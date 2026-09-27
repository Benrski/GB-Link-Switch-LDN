// Ruby or Sapphire on a real GBA trading with the Switch. The adapter plays the game's cable
// partner (mode 0x01), the ESP32 board runs the Switch's room with this page as its wireless
// adapter (LDN_ADAPTER host), and the translator converts between the two link protocols.

import { GB_CHANNEL, GbFrameParser } from '../wire.js';
import { FrameReader, RFU, clientFrame, command, toGbFrames } from '../trade/adapter.js';
import { CableTranslator } from './translator.js';
import { CableLink } from './cable.js';

const FRAME_MS = 1000 / 59.7275;

export class CableSession extends EventTarget {
    constructor(esp, adapter, { bypassNationally = false } = {}) {
        super();
        this.bypassNationally = bypassNationally;
        this.esp = esp;
        this.adapter = adapter;
        this.running = false;
        this.translator = null;
        this.cable = null;
        this.timers = [];
        this.onReattached = () => this.claim().catch((error) => this.fail(error));
    }

    get cableOpen() { return Boolean(this.cable?.connected); }
    get linked() { return Boolean(this.translator?.linked); }
    get tradeReady() { return Boolean(this.translator?.haveRubyLP); }
    get switchNotReady() { return Boolean(this.translator?.hostNotReady); }

    setBypass(value) {
        this.bypassNationally = value;
        if (this.translator) this.translator.bypassNationally = value;
    }

    log(message) { this.dispatchEvent(new CustomEvent('log', { detail: message })); }
    changed() { this.dispatchEvent(new Event('change')); }
    fail(error) { this.dispatchEvent(new CustomEvent('failed', { detail: error })); }

    async start() {
        if (this.running) return;
        const esp = this.esp;
        const toBoard = (frame) => esp.sendAdapter(toGbFrames(frame));
        const translator = this.translator = new CableTranslator({
            send: (payload) => toBoard(clientFrame(payload)),
            connect: (devid) => toBoard(command(RFU.CONNECT_REQ, devid)),
            disconnect: () => toBoard(command(RFU.DISCONNECT, 0)),
            log: (message) => this.log(message),
        });
        translator.bypassNationally = this.bypassNationally;
        translator.onLinked = () => this.changed();
        const gb = new GbFrameParser(512);
        const reader = new FrameReader();
        esp.onAdapterFrame = (bytes) => {
            try {
                for (const frame of gb.push(bytes)) {
                    if (frame.channel !== GB_CHANNEL.DATA) continue;
                    for (const rfu of reader.push(frame.payload)) translator.boardFrame(rfu);
                }
            } catch (error) { this.fail(error); }
        };
        this.cable = new CableLink(this.adapter, {
            gameCommand: (words) => translator.gameCommand(words),
            nextCommand: () => translator.nextCommand(),
            reset: () => translator.cableReset(),
            log: (message) => this.log(message),
        });
        this.cable.onState = () => this.changed();
        this.running = true;
        esp.addEventListener('reattached', this.onReattached);
        try {
            await this.claim();
        } catch (error) {
            await this.stop();
            throw error;
        }
        this.cable.start();
        this.timers.push(setInterval(() => translator.frame(), FRAME_MS));
    }

    // The host-port setting is lost on the restart after every session; reapplied on reattach.
    async claim() {
        if (!this.running) return;
        if (!(await this.esp.setAdapterPort('host'))) throw new Error('The ESP32 board did not hand over its adapter port.');
    }

    async stop() {
        if (!this.running) return;
        this.running = false;
        for (const t of this.timers) clearInterval(t);
        this.timers = [];
        this.esp.removeEventListener('reattached', this.onReattached);
        if (this.translator?.joined) {
            try { this.esp.sendAdapter(toGbFrames(command(RFU.DISCONNECT, 0))); } catch {}
        }
        this.esp.onAdapterFrame = null;
        await this.cable?.stop();
        await new Promise((resolve) => setTimeout(resolve, 150));
        try { if (this.esp.attached) await this.esp.setAdapterPort('uart'); } catch {}
    }
}
