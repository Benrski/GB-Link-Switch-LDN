// Runs the Mystery Gift group on the ESP32 board: takes its adapter port (LDN_ADAPTER host),
// ticks the session at the GBA's frame rate and passes the RFU1 frames both ways. When the
// board restarts, after a link it ended itself, the group opens again once it is back.

import { GB_CHANNEL, GbFrameParser } from '../wire.js';
import { FrameReader, toGbFrames } from '../trade/adapter.js';
import { RfuLeader } from '../cable/leader.js';
import { GiftSession } from './session.js';
import { startTicker } from './ticker.js';

// After the page lets go, the board keeps its room for a few seconds, then closes it and
// restarts. A group opened again before that lands in the old room, where a Switch joins but
// its name never reaches the page, so stopping waits for the board to be back.
const BOARD_BACK_MS = 10000;

export class GiftDistribution extends EventTarget {
    constructor(esp) {
        super();
        this.esp = esp;
        this.running = false;
        this.session = null;
        this.stopTicker = null;
        this.onRestarted = () => this.session?.restarted();
        this.onReattached = () => this.claim().then(() => { if (this.running) this.session.open(); }, (error) => this.fail(error));
    }

    log(message) { this.dispatchEvent(new CustomEvent('log', { detail: message })); }
    emit(type, detail) { this.dispatchEvent(new CustomEvent(type, { detail })); }
    fail(error) { this.emit('failed', error); }

    // Events: 'status' ({ stage, event, player, ... }), 'decision' (a request, or null when
    // withdrawn), 'result', 'log', 'failed'.
    async start(event) {
        if (this.running) return;
        const esp = this.esp;
        const gb = new GbFrameParser(512);
        const reader = new FrameReader();
        const log = (message) => this.log(message);
        const leader = new RfuLeader({ send: (frame) => esp.sendAdapter(toGbFrames(frame)), log });
        const session = this.session = new GiftSession({ leader, log });
        session.onStatus = (status) => this.emit('status', status);
        session.onDecision = (request) => this.emit('decision', request);
        session.onResult = (result) => this.emit('result', result);
        session.setEvent(event);
        esp.onAdapterFrame = (bytes) => {
            try {
                for (const frame of gb.push(bytes)) {
                    if (frame.channel !== GB_CHANNEL.DATA) continue;
                    for (const rfu of reader.push(frame.payload)) leader.boardFrame(rfu);
                }
            } catch (error) { this.fail(error); }
        };
        this.running = true;
        esp.addEventListener('restarted', this.onRestarted);
        esp.addEventListener('reattached', this.onReattached);
        try {
            await this.claim();
        } catch (error) {
            await this.stop();
            throw error;
        }
        session.start();
        this.stopTicker = startTicker(() => leader.tick());
    }

    async claim() {
        if (!this.running) return;
        if (!(await this.esp.setAdapterPort('host'))) throw new Error('The ESP32 board did not hand over its adapter port.');
    }

    // The event for the next Switch.
    setEvent(event) {
        this.session?.setEvent(event);
    }

    // The answer to a 'decision' event: true sends the card anyway.
    decide(send) {
        this.session?.decide(send);
    }

    async stop() {
        if (!this.running) return;
        this.running = false;
        this.stopTicker?.();
        this.stopTicker = null;
        this.esp.removeEventListener('restarted', this.onRestarted);
        this.esp.removeEventListener('reattached', this.onReattached);
        try { this.session?.stop(); } catch {}
        this.esp.onAdapterFrame = null;
        await new Promise((resolve) => setTimeout(resolve, 150));
        if (!this.esp.attached) return;
        const back = this.boardBack(BOARD_BACK_MS);
        try { await this.esp.setAdapterPort('uart'); } catch {}
        await back;
    }

    // Resolves once the board has restarted and is attached again, or after `ms`.
    boardBack(ms) {
        return new Promise((resolve) => {
            const done = () => {
                clearTimeout(timer);
                this.esp.removeEventListener('reattached', done);
                resolve();
            };
            const timer = setTimeout(done, ms);
            this.esp.addEventListener('reattached', done);
        });
    }
}
