// The Switch linked with another player over the Celio server: a Game Boy Advance on a
// GB-Link, an emulator, or another Switch through this page. The page stands in for a Celio
// client and its GB-Link adapter, and reports itself as one (0xFF02).
// The server makes the first such adapter in a session the master and every other one the
// slave; emulators (0xFF01) are always slaves. A master adapter clocks its GBA, the child
// (player 1); a slave's GBA clocks the link, the parent (player 0). So the page plays:
// - slave: the parent, as CableTranslator, with the Switch leading a group it joins;
// - master: the child, as ReverseTranslator, leading a group the Switch joins.
//
// Celio protocol (Celio-Server session.ts, Celio-Client linkExchangeSession.ts): the server
// pairs two clients by session id and relays each one's deviceData to the other, in order,
// waiting for an acknowledgement each time. Link statuses go to the server only, which
// answers with device commands.

import { SocketIo } from './socketio.js';
import { CableTranslator, CMD_WORDS } from './translator.js';
import { ReverseTranslator } from './reverse.js';
import { RfuLeader } from './leader.js';
import { GB_CHANNEL, GbFrameParser } from '../wire.js';
import { FrameReader, RFU, clientFrame, command, toGbFrames } from '../trade/adapter.js';

export const CELIO_SERVER = 'wss://celio-server.up.railway.app';

const STATUS = { AWAIT_MODE: 0xff02, HANDSHAKE_RECEIVED: 0xff03, LINK_CONNECTED: 0xff05, LINK_RECONNECTING: 0xff06, LINK_CLOSED: 0xff07 };
const COMMAND = { SET_MODE_MASTER: 0x10, SET_MODE_SLAVE: 0x11, START_HANDSHAKE: 0x12, CONNECT_LINK: 0x13 };

// The other adapter plays one command per cable packet, about 40 a second as master.
const PACKET_MS = 26;
const BATCH = 4;
const AHEAD = 4;               // slots produced ahead of the estimate
const REOPEN_MS = 400;         // the adapter's pause before a new section
// As the slave, a section's commands wait for the master's adapter to have linked with its
// GBA (the server's ConnectLink, sent when the master reports LinkConnected): a command that
// reaches it while it is still linking stops the link coming up, and its GBA errors. Without
// that word after this long, they go anyway.
const PEER_WAIT_MS = 4000;
const FRAME_MS = 1000 / 59.7275;

const uuid = () => crypto.randomUUID();

// The cable side over Celio. onRole(master) is called once the server has chosen, and
// returns the game side: { gameCommand, nextCommand, reset, ready }.
export class CelioLink {
    constructor(socket, { onRole, log = () => {} }) {
        this.socket = socket;
        this.onRole = onRole;
        this.game = null;
        this.log = log;
        this.running = false;
        this.master = null;           // null until the server has chosen
        this.partner = false;
        this.connected = false;       // a section is up
        this.peerUp = false;          // the other adapter has linked with its GBA: commands go out
        this.waiting = false;         // told the server our GBA is ready, awaiting the other
        this.handshake = false;       // master: the handshake started, awaiting the slave
        this.closed = false;          // the link ended for good (EXIT_ROOM)
        this.readyAfter = 0;
        this.sequence = 0;
        this.expected = 0;
        this.buffered = new Map();
        this.batch = [];
        this.cafeStreak = 0;
        this.since = 0;
        this.slots = 0;
        this.sentClose = false;
        this.gotClose = false;
        this.exitSeen = false;
        this.commands = new Set();
        this.timer = null;
        this.onState = null;
        socket.on('deviceCommand', (packet) => this.onCommand(packet));
        socket.on('deviceData', (packet) => this.onData(packet));
    }

    status(value) { this.socket.emit('deviceStatus', { uuid: uuid(), linkStatus: value }); }

    setConnected(value) {
        if (this.connected === value) return;
        this.connected = value;
        this.onState?.(value);
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.timer = setInterval(() => this.pump(), 8);
        this.status(STATUS.AWAIT_MODE);
    }

    stop() {
        this.running = false;
        clearInterval(this.timer);
        this.setConnected(false);
    }

    // The server's "both ready" check passes with one client alone, so our GBA is reported
    // ready only while the other user is in the session; as the child, only once it can
    // answer the parent (the Switch's player is known).
    setPartner(present) {
        this.partner = present;
        this.maybeReady();
    }

    maybeReady() {
        if (!this.running || !this.game || !this.partner || this.connected || this.waiting || this.handshake || this.closed) return;
        if (performance.now() < this.readyAfter || !this.game.ready()) return;
        this.waiting = true;
        this.status(STATUS.HANDSHAKE_RECEIVED);
        this.log('Ready for the other Game Boy Advance');
    }

    onCommand(packet) {
        if (!packet || this.commands.has(packet.uuid)) return;
        this.commands.add(packet.uuid);
        switch (packet.command) {
            case COMMAND.SET_MODE_SLAVE:
            case COMMAND.SET_MODE_MASTER:
                if (this.master !== null) break;
                this.master = packet.command === COMMAND.SET_MODE_MASTER;
                this.game = this.onRole(this.master);
                this.maybeReady();
                break;
            case COMMAND.START_HANDSHAKE:
                if (!this.waiting) break;
                this.waiting = false;
                this.game.reset();
                this.sentClose = this.gotClose = this.exitSeen = false;
                this.batch = [];
                this.cafeStreak = 0;
                // The master's link is up once the slave's is.
                if (this.master) this.handshake = true;
                else this.up();
                break;
            case COMMAND.CONNECT_LINK:
                if (!this.master) {
                    if (this.connected && !this.peerUp) this.startSending('the other Game Boy Advance is linked');
                    break;
                }
                if (!this.handshake) break;
                this.handshake = false;
                this.up();
                break;
        }
    }

    up() {
        this.since = performance.now();
        this.slots = 0;
        // The master's ConnectLink came after its partner (the slave) linked: it sends at once.
        this.peerUp = this.master;
        this.setConnected(true);
        this.status(STATUS.LINK_CONNECTED);
        this.log('the other Game Boy Advance\'s link is open');
    }

    startSending(why) {
        this.peerUp = true;
        this.since = performance.now();
        this.slots = 0;
        this.log(why);
    }

    // Packets arrive in order but may repeat or run ahead after a retry.
    onData(packet) {
        if (!packet || !Array.isArray(packet.data)) return;
        if (packet.sequence < this.expected) return;
        this.buffered.set(packet.sequence, packet.data);
        while (this.buffered.has(this.expected)) {
            const data = this.buffered.get(this.expected);
            this.buffered.delete(this.expected);
            this.expected++;
            this.deliver(data);
        }
    }

    deliver(data) {
        if (!this.connected && !this.handshake) return;
        for (let c = 0; c < BATCH; c++) {
            const words = data.slice(c * CMD_WORDS, (c + 1) * CMD_WORDS).map((w) => w & 0xffff);
            if (!words.some((w) => w)) continue;
            if (words[0] === 0x5fff) this.gotClose = true;
            if (words[0] === 0xcafe && (words[1] & 0xff) === 0x17) this.exitSeen = true;
            this.game.gameCommand(words);
        }
        this.checkClose();
    }

    pump() {
        if (!this.connected) { this.maybeReady(); return; }
        if (!this.peerUp) {
            if (performance.now() - this.since < PEER_WAIT_MS) return;
            this.startSending('the other Game Boy Advance did not report its link: sending anyway');
        }
        const played = Math.floor((performance.now() - this.since) / PACKET_MS);
        while (this.slots < played + AHEAD) {
            let words = this.game.nextCommand() ?? new Array(CMD_WORDS).fill(0);
            words = words.map((w) => w & 0xffff);
            if (words[0] === 0x5fff) this.sentClose = true;
            if (words[0] === 0xcafe && (words[1] & 0xff) === 0x17) this.exitSeen = true;
            // Like the adapter: a run of "no key" reports travels as its first one.
            if (words[0] === 0xcafe && words[1] === 0x11) {
                if (this.cafeStreak++ > 0) words = new Array(CMD_WORDS).fill(0);
            } else if (words.some((w) => w)) this.cafeStreak = 0;
            this.batch.push(words);
            this.slots++;
            if (this.batch.length === BATCH) this.flush();
            if (this.checkClose()) return;
        }
    }

    flush() {
        const data = this.batch.flat();
        this.batch = [];
        if (!data.some((w) => w)) return;
        this.socket.emit('deviceData', { sequence: this.sequence++, data });
    }

    // A command whose first word is 0x5FFF, sent and received, ends the section, as the
    // adapter does; EXIT_ROOM before it ends the link.
    checkClose() {
        if (!this.connected || !this.sentClose || !this.gotClose) return false;
        if (this.batch.length) {
            while (this.batch.length < BATCH) this.batch.push(new Array(CMD_WORDS).fill(0));
            this.flush();
        }
        this.setConnected(false);
        if (this.exitSeen) {
            this.closed = true;
            this.status(STATUS.LINK_CLOSED);
            this.log('the other Game Boy Advance left the link');
        } else {
            this.status(STATUS.LINK_RECONNECTING);
            this.readyAfter = performance.now() + REOPEN_MS;
        }
        return true;
    }
}

// A Celio session: the server connection, the session id, and once started, the board's
// room and the translator for the role the server chose. As the child the page leads a group
// for the room the Switch goes to, chosen once that role is known (chooseRoom).
export class CelioSession extends EventTarget {
    constructor(esp, { server = CELIO_SERVER, bypassNationally = false } = {}) {
        super();
        this.esp = esp;
        this.server = server;
        this.bypassNationally = bypassNationally;
        this.activity = null;             // the room of the page's group: 4 trade, 1 single, 2 double
        this.socket = null;
        this.sessionId = null;
        this.partner = false;
        this.running = false;
        this.role = null;             // 'parent' (the Switch leads) | 'child' (the page leads)
        this.translator = null;
        this.leader = null;
        this.board = null;            // where the board's RFU frames go
        this.link = null;
        this.timers = [];
        this.onReattached = () => this.claim().catch((error) => this.fail(error));
    }

    get leading() { return this.role === 'child'; }
    get needsRoom() { return this.leading && this.activity === null; }
    get linked() { return this.leading ? Boolean(this.leader?.linked && this.translator?.parentLP) : Boolean(this.translator?.linked); }
    get tradeReady() { return !this.leading && Boolean(this.translator?.haveRubyLP); }
    get cableOpen() { return Boolean(this.link?.connected); }
    get switchNotReady() { return !this.leading && Boolean(this.translator?.hostNotReady); }
    get switchJoined() { return Boolean(this.leader?.joined); }
    get switchKnown() { return this.leading && Boolean(this.translator?.ready); }
    get switchLeft() { return this.leader?.state === 'closed'; }
    get otherChoice() { return this.leading ? this.translator?.otherChoice ?? null : null; }
    get refused() { return this.leading ? this.translator?.refused ?? null : null; }

    log(message) { this.dispatchEvent(new CustomEvent('log', { detail: message })); }
    changed() { this.dispatchEvent(new Event('change')); }
    fail(error) { this.dispatchEvent(new CustomEvent('failed', { detail: error })); }
    notice(text, tone = 'warn') { this.dispatchEvent(new CustomEvent('notice', { detail: { text, tone } })); }

    async open() {
        const socket = this.socket = new SocketIo(this.server, { clientId: uuid() });
        socket.on('partnerJoined', () => { this.partner = true; this.link?.setPartner(true); this.changed(); });
        socket.on('partnerLeft', () => { this.partner = false; this.link?.setPartner(false); this.notice('The other player left the session.'); this.changed(); });
        socket.on('sessionClose', () => { this.notice('The session has ended.', ''); this.end(); });
        socket.addEventListener('disconnect', () => { this.notice('Lost the connection to the Celio server.', 'bad'); this.end(); });
        await socket.connect();
    }

    async create() { return this.enter('sessionCreate', null); }
    async join(id) { return this.enter('sessionJoin', id); }

    async enter(event, arg) {
        if (!this.socket?.connected) await this.open();
        const [result] = await this.socket.request(event, arg);
        if (result?.variant !== 'Ok') throw new Error(result?.error ?? 'The Server refused');
        this.sessionId = result.value.id;
        this.partner = event === 'sessionJoin' || Boolean(result.value.full);
        this.changed();
        return this.sessionId;
    }

    // Takes the board's adapter port and starts linking.
    async start() {
        if (this.running) return;
        const esp = this.esp;
        const gb = new GbFrameParser(512);
        const reader = new FrameReader();
        esp.onAdapterFrame = (bytes) => {
            try {
                for (const frame of gb.push(bytes)) {
                    if (frame.channel !== GB_CHANNEL.DATA) continue;
                    for (const rfu of reader.push(frame.payload)) this.board?.(rfu);
                }
            } catch (error) { this.fail(error); }
        };
        this.link = new CelioLink(this.socket, { onRole: (master) => this.setRole(master), log: (message) => this.log(message) });
        this.link.onState = () => this.changed();
        this.running = true;
        esp.addEventListener('reattached', this.onReattached);
        try {
            await this.claim();
        } catch (error) {
            await this.stop();
            throw error;
        }
        this.link.setPartner(this.partner);
        this.link.start();
        this.changed();
    }

    // The server's choice: as its slave the page is the parent and joins the Switch's group;
    // as its master the page is the child and leads a group the Switch joins.
    setRole(master) {
        this.role = master ? 'child' : 'parent';
        this.log(master ? 'the other Game Boy Advance is the parent: the Switch joins this page\'s group' : 'the other Game Boy Advance is the child: this page joins the Switch\'s group');
        if (!master) {
            const toBoard = (frame) => this.esp.sendAdapter(toGbFrames(frame));
            const translator = new CableTranslator({
                send: (payload) => toBoard(clientFrame(payload)),
                connect: (devid) => toBoard(command(RFU.CONNECT_REQ, devid)),
                disconnect: () => toBoard(command(RFU.DISCONNECT, 0)),
                log: (message) => this.log(message),
            });
            translator.onLinked = () => this.changed();
            translator.bypassNationally = this.bypassNationally;
            this.translator = translator;
            this.board = (rfu) => translator.boardFrame(rfu);
            this.timers.push(setInterval(() => translator.frame(), FRAME_MS));
        }
        this.changed();
        // As the child nothing links until the room is chosen and the Switch has joined.
        return {
            gameCommand: (words) => this.translator?.gameCommand(words),
            nextCommand: () => this.translator?.nextCommand() ?? null,
            reset: () => this.translator?.cableReset(),
            ready: () => (master ? Boolean(this.translator?.ready) : true),
        };
    }

    // The room of the group the page leads as the child: the Switch joins it there.
    chooseRoom(activity) {
        if (!this.running || !this.needsRoom) return;
        this.activity = activity;
        const toBoard = (frame) => this.esp.sendAdapter(toGbFrames(frame));
        const log = (message) => this.log(message);
        const leader = this.leader = new RfuLeader({ send: toBoard, log });
        const translator = new ReverseTranslator({ leader, activity, log });
        translator.onReady = () => this.changed();
        translator.onOtherChoice = () => this.changed();
        translator.onRefused = (reason) => {
            this.changed();
            if (reason) this.dispatchEvent(new CustomEvent('refused', { detail: reason }));
        };
        const joined = leader.onJoined;
        leader.onJoined = () => { joined?.(); this.changed(); };
        leader.onClosed = () => { log('the Switch left the group'); this.changed(); };
        translator.bypassNationally = this.bypassNationally;
        this.translator = translator;
        this.board = (rfu) => leader.boardFrame(rfu);
        translator.openGroup();
        this.timers.push(setInterval(() => leader.tick(), FRAME_MS));
        this.changed();
    }

    async claim() {
        if (!this.running) return;
        if (!(await this.esp.setAdapterPort('host'))) throw new Error('The ESP32 board did not hand over its adapter port.');
    }

    setBypass(value) {
        this.bypassNationally = value;
        if (this.translator) this.translator.bypassNationally = value;
    }

    async stop() {
        if (!this.running) return;
        this.running = false;
        for (const t of this.timers) clearInterval(t);
        this.timers = [];
        this.link?.stop();
        this.esp.removeEventListener('reattached', this.onReattached);
        try {
            if (this.leader) this.leader.close();
            else if (this.translator?.joined) this.esp.sendAdapter(toGbFrames(command(RFU.DISCONNECT, 0)));
        } catch {}
        this.board = null;
        this.esp.onAdapterFrame = null;
        await new Promise((resolve) => setTimeout(resolve, 150));
        try { if (this.esp.attached) await this.esp.setAdapterPort('uart'); } catch {}
    }

    // Leaves the session; after the link has started this ends it for both.
    async leave() {
        try { this.socket?.emit('sessionLeft'); } catch {}
        await this.end();
    }

    async end() {
        if (this.ended) return;
        this.ended = true;
        await this.stop();
        this.socket?.close();
        this.sessionId = null;
        this.partner = false;
        this.dispatchEvent(new Event('ended'));
    }
}
