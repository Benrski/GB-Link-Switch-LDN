// Client for the GB-Link Pokémon web client's Gen 3 trade pool (same server and messages).
// A swap is confirmed with two accept rounds and seven success rounds.
//
// Message: "S" + 4-char tag + big-endian u16 length + data, or "G" + tag to request one.
// Counted messages start with a sequence byte (+1 per message) to detect repeats.

import { DataError } from './bytes.js';
import { Pk3 } from './pk3.js';

export const POOL_SERVER = 'wss://pokemon-gb-online-trades.herokuapp.com';
export const POOL_PATH = '/pool3';

const RECORD_SIZE = 149;       // 100 mon + 36 mail + 2 version + 11 ribbons
const MON_SIZE = 100;
const MAIL_SIZE = 36;
const CLIENT_VERSION = Uint8Array.of(4, 0, 1, 0, 0, 0);
const ACCEPT = [0xa20000, 0xb20000];
const SUCCESS = [0x900000, 0x910000, 0x920000, 0x930000, 0x940000, 0x950000, 0x9c0000];
const ASK_EVERY_MS = 250;
const CONNECT_MS = 20000;      // allows for server cold start

export class PoolError extends Error {
    constructor(message) { super(message); this.name = 'PoolError'; }
}

// Pool record for one Pokémon. `wire`: 100-byte traded mon; `game`: 0 FireRed, 1 LeafGreen.
export function poolRecord(wire, { mail = null, game = 0, ribbons = null } = {}) {
    const record = new Uint8Array(RECORD_SIZE);
    record.set(wire.subarray(0, MON_SIZE));
    if (mail) record.set(mail.subarray(0, MAIL_SIZE), MON_SIZE);
    record[MON_SIZE + MAIL_SIZE] = 1;
    record[MON_SIZE + MAIL_SIZE + 1] = game;
    if (ribbons) record.set(ribbons.subarray(0, 11), MON_SIZE + MAIL_SIZE + 2);
    return record;
}

const threeBytes = (value) => Uint8Array.of(value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff);
const fromThreeBytes = (bytes) => bytes[0] | (bytes[1] << 8) | (bytes[2] << 16);

export class PoolClient {
    // Socket: WebSocket replacement for tests.
    constructor(server = POOL_SERVER, { Socket = globalThis.WebSocket } = {}) {
        this.Socket = Socket;
        this.url = server.replace(/\/$/, '') + POOL_PATH;
        this.socket = null;
        this.sent = new Map();        // tag -> data to resend on a "G" request
        this.received = new Map();    // tag -> latest data
        this.ownId = null;
        this.otherId = null;
        this.closed = false;
        this.wake = null;
    }

    connect() {
        this.close();
        this.closed = false;
        this.sent.clear();
        this.received.clear();
        this.ownId = this.otherId = null;
        return new Promise((resolve, reject) => {
            const socket = new this.Socket(this.url);
            socket.binaryType = 'arraybuffer';
            this.socket = socket;
            const unreachable = () => { clearTimeout(timer); if (this.socket === socket) this.close(); reject(new PoolError('The trade pool could not be reached.')); };
            const timer = setTimeout(unreachable, CONNECT_MS);
            socket.onopen = () => { clearTimeout(timer); this.send('VEC3', CLIENT_VERSION); resolve(); };
            socket.onerror = unreachable;
            socket.onclose = () => { if (this.socket === socket) this.closed = true; };
            socket.onmessage = (event) => { if (this.socket === socket) this.onMessage(new Uint8Array(event.data)); };
        });
    }

    close() {
        const socket = this.socket;
        this.socket = null;
        this.closed = true;
        if (!socket) return;
        socket.onopen = socket.onerror = socket.onclose = socket.onmessage = null;
        try { socket.close(); } catch {}
    }

    onMessage(data) {
        if (data.length < 5) return;
        const tag = String.fromCharCode(...data.subarray(1, 5));
        if (data[0] === 0x53 && data.length >= 7) {
            const length = (data[5] << 8) | data[6];
            if (data.length >= 7 + length) this.received.set(tag, data.slice(7, 7 + length));
        } else if (data[0] === 0x47) {
            const again = this.sent.get(tag);
            if (again) this.write('S', tag, again);
        }
        this.wake?.();
    }

    write(kind, tag, data = null) {
        if (!this.socket || this.socket.readyState !== 1) throw new PoolError('The connection to the trade pool was lost.');
        const packet = new Uint8Array(5 + (data ? 2 + data.length : 0));
        packet[0] = kind.charCodeAt(0);
        for (let i = 0; i < 4; i++) packet[1 + i] = tag.charCodeAt(i);
        if (data) {
            packet[5] = data.length >> 8;
            packet[6] = data.length & 0xff;
            packet.set(data, 7);
        }
        this.socket.send(packet);
    }

    send(tag, data) {
        this.sent.set(tag, data);
        this.write('S', tag, data);
    }

    sendCounted(tag, data) {
        this.ownId = this.ownId === null ? Math.floor(Math.random() * 256) : (this.ownId + 1) & 0xff;
        const counted = new Uint8Array(1 + data.length);
        counted[0] = this.ownId;
        counted.set(data, 1);
        this.send(tag, counted);
    }

    takeCounted(tag) {
        const data = this.received.get(tag);
        if (!data) return null;
        this.received.delete(tag);
        if (data.length < 1) return null;
        if (this.otherId === null) this.otherId = data[0];
        else if (data[0] !== this.otherId) return null;   // stale repeat
        this.otherId = (this.otherId + 1) & 0xff;
        return data.subarray(1);
    }

    // Polls with "G" until the next counted message for tag arrives.
    async receive(tag, signal, timeoutMs = 20000) {
        const deadline = Date.now() + timeoutMs;
        for (;;) {
            if (signal?.aborted) throw new PoolError('The trade pool did not answer in time.');
            const data = this.takeCounted(tag);
            if (data) return data;
            if (this.closed) throw new PoolError('The connection to the trade pool was lost.');
            if (Date.now() > deadline) throw new PoolError('The trade pool stopped answering.');
            this.write('G', tag);
            await this.arrival(ASK_EVERY_MS);
        }
    }

    // Resolves on the next message or after ms.
    arrival(ms) {
        return new Promise((resolve) => {
            const timer = setTimeout(() => { this.wake = null; resolve(); }, ms);
            this.wake = () => { this.wake = null; clearTimeout(timer); resolve(); };
        });
    }

    // Pokémon offered to this connection: { record, wire, pk, mail }.
    async fetchMon(signal) {
        const data = await this.receive('P3SI', signal);
        if (data.length < RECORD_SIZE) throw new PoolError('The trade pool has no Pokémon to offer right now.');
        const record = data.slice(0, RECORD_SIZE);
        const wire = record.slice(0, MON_SIZE);
        const pk = new Pk3(wire);
        if (!pk.checksumValid || pk.species === 0 || pk.isBadEgg) throw new DataError('The trade pool sent a Pokémon this page cannot read.');
        return { record, wire, pk, mail: pk.hasMail ? record.slice(MON_SIZE, MON_SIZE + MAIL_SIZE) : null };
    }

    // Proposes a Pokémon in exchange. False if the server refuses it.
    async propose(record, signal) {
        const species = new Pk3(record.subarray(0, MON_SIZE)).speciesInternal;
        this.sendCounted('P3SO', record);
        for (let round = 0; round < 2; round++) {
            const tag = `A3S${round + 1}`;
            this.sendCounted(tag, threeBytes(ACCEPT[round] | species));
            const answer = fromThreeBytes(await this.receive(tag, signal));
            if ((answer & 0xff0000) !== ACCEPT[round]) return false;
        }
        return true;
    }

    // Confirms a completed trade. `given` went to the pool, `taken` came from it.
    // False if the server reports failure.
    async complete(given, taken, signal) {
        const ours = [given.speciesInternal, given.pid & 0xffff, given.pid >>> 16, taken.speciesInternal, taken.pid & 0xffff, taken.pid >>> 16, 0];
        for (let round = 0; round < 7; round++) {
            const tag = `S3S${round + 1}`;
            this.sendCounted(tag, threeBytes(SUCCESS[round] | ours[round]));
            const answer = fromThreeBytes(await this.receive(tag, signal));
            if ((answer & 0xff0000) !== SUCCESS[round]) return false;
        }
        return true;
    }
}
