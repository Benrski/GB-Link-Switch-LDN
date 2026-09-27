// The adapter's cable relay (mode 0x01) as the link master. The adapter clocks the GBA's cable
// and runs the handshake; this side supplies player 0's commands and reads the game's.
//
// Data frames are 64 bytes both ways: four commands of eight 16-bit words (little-endian).
// The adapter plays one queued command per cable packet and sends zeros when none is queued,
// which the game reads as "no command". It reports the game's commands four packets at a time,
// skipping batches that are all zero.

import { GB_CHANNEL } from '../wire.js';
import { MODE_CABLE_LINK } from '../gblink.js';
import { CMD_WORDS } from './translator.js';

const STATUS = {
    AWAIT_MODE: 0xff02, HANDSHAKE_RECEIVED: 0xff03, LINK_CONNECTED: 0xff05, RECONNECTING: 0xff06, CLOSED: 0xff07,
};
const COMMAND = { SET_MODE_MASTER: 0x10, START_HANDSHAKE: 0x12, CONNECT_LINK: 0x13 };

// The adapter's packet period as master: a checksum and eight words 1.378 ms apart, then a
// 12.953 ms gap. Estimated slightly long, so the queue runs dry now and then rather than grow.
const PACKET_MS = 26;
const BATCH = 4;
const AHEAD = 6;               // commands queued in the adapter at most
const CONNECT_GRACE_MS = 150;  // slave handshakes before the master's
const REOPEN_MS = 500;

export class CableLink {
    // gameCommand(words): a command from the game. nextCommand(): player 0's next command, or
    // null. reset(): the game opened a fresh cable link.
    constructor(adapter, { gameCommand, nextCommand, reset, log = () => {} }) {
        this.adapter = adapter;
        this.gameCommand = gameCommand;
        this.nextCommand = nextCommand;
        this.reset = reset;
        this.log = log;
        this.running = false;
        this.connected = false;
        this.since = 0;
        this.sent = 0;
        this.timer = null;
        this.timeouts = new Set();
        this.onState = null;       // (connected)
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.adapter.onFrame = (channel, payload) => this.onFrame(channel, payload);
        this.timer = setInterval(() => this.pump(), 8);
        this.open();
    }

    async stop() {
        if (!this.running) return;
        this.running = false;
        clearInterval(this.timer);
        for (const t of this.timeouts) clearTimeout(t);
        this.timeouts.clear();
        this.adapter.onFrame = null;
        this.setConnected(false);
        await this.adapter.leaveMode();
    }

    open() {
        this.adapter.setMode(MODE_CABLE_LINK).catch((error) => this.log(`the adapter did not take the cable mode: ${error.message}`));
    }

    later(ms, work) {
        const t = setTimeout(() => { this.timeouts.delete(t); if (this.running) work(); }, ms);
        this.timeouts.add(t);
    }

    command(byte) {
        this.adapter.sendCommand([byte]).catch(() => {});
    }

    setConnected(value) {
        if (this.connected === value) return;
        this.connected = value;
        this.onState?.(value);
    }

    onFrame(channel, payload) {
        if (channel === GB_CHANNEL.STATUS && payload.length >= 2) this.onStatus(payload[0] | (payload[1] << 8));
        else if (channel === GB_CHANNEL.DATA && payload.length === BATCH * CMD_WORDS * 2) this.onData(payload);
    }

    onStatus(status) {
        switch (status) {
            case STATUS.AWAIT_MODE:
                this.command(COMMAND.SET_MODE_MASTER);
                break;
            case STATUS.HANDSHAKE_RECEIVED:
                // The game opened its link. Only now may the handshake commands go out.
                this.setConnected(false);
                this.reset();
                this.command(COMMAND.START_HANDSHAKE);
                this.later(CONNECT_GRACE_MS, () => this.command(COMMAND.CONNECT_LINK));
                break;
            case STATUS.LINK_CONNECTED:
                this.since = performance.now();
                this.sent = 0;
                this.setConnected(true);
                this.log('the game\'s cable link is open');
                break;
            case STATUS.RECONNECTING:
                this.setConnected(false);
                this.log('the game closed its cable link');
                break;
            case STATUS.CLOSED:
                // The game left the link for good (EXIT_ROOM); the mode ends. Enter it again for
                // the next visit.
                this.setConnected(false);
                this.log('the cable link ended');
                this.later(REOPEN_MS, () => this.open());
                break;
        }
    }

    // Processed whenever running: the adapter sends a closing link's last commands before its
    // status, over a separate endpoint.
    onData(payload) {
        for (let c = 0; c < BATCH; c++) {
            const words = [];
            let any = false;
            for (let i = 0; i < CMD_WORDS; i++) {
                const at = (c * CMD_WORDS + i) * 2;
                const word = payload[at] | (payload[at + 1] << 8);
                words.push(word);
                if (word) any = true;
            }
            if (any) this.gameCommand(words);
        }
    }

    // Keeps the adapter's queue at most AHEAD commands deep.
    pump() {
        if (!this.connected) return;
        const played = Math.floor((performance.now() - this.since) / PACKET_MS);
        if (this.sent < played) this.sent = played;
        while (this.sent - played + BATCH <= AHEAD) {
            const batch = new Uint8Array(BATCH * CMD_WORDS * 2);
            for (let c = 0; c < BATCH; c++) {
                const words = this.nextCommand();
                if (!words) continue;
                for (let i = 0; i < CMD_WORDS; i++) {
                    const at = (c * CMD_WORDS + i) * 2;
                    batch[at] = words[i] & 0xff;
                    batch[at + 1] = (words[i] >> 8) & 0xff;
                }
            }
            this.adapter.sendData(batch).catch(() => {});
            this.sent += BATCH;
        }
    }
}
