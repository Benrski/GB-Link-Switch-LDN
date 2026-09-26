// Client side of the adapter link: joins the trade room offered by the board, runs the
// adapter name exchange, then answers each Switch frame with one frame.

import { DataError, b32, equal, u16, w16, w32 } from './bytes.js';
import { RFU, clientFrame, command, hostPayload } from './adapter.js';
import { gameData, ni, words } from './rfu.js';

// pokefirered union-room activity id for trading.
const TRADE = 4;

export class AdapterLink {
    // send(frame): passes one whole adapter frame to the board.
    constructor({ engine, send, activity = TRADE }) {
        this.engine = engine;
        this.send = send;
        this.activity = activity;
        this.room = null;          // devid of the trade room
        this.requested = false;
        this.connected = false;
        this.disconnected = false;
        this.ni = gameData();
        this.niAck = null;
        this.emittedAck = null;
        this.uni = false;
        this.niDone = false;
        this.exiting = false;
        this.tag = 0;
        this.heldCount = 0;
        this.heldKey = 0;
        this.hostFrames = 0;
        this.sentFrames = 0;
        this.onLog = null;
        this.onRoom = null;
    }

    emit(message) { this.onLog?.(message); }

    feed({ type, header, frame }) {
        if (type === RFU.BROADCAST) { this.onBeacon(header, frame); return; }
        if (type === RFU.CONNECT_ACK) {
            if (this.connected) return;
            this.connected = true;
            this.emit('Joined the room the Switch is hosting');
            return;
        }
        if (type === RFU.DISCONNECT) { this.disconnected = true; return; }
        if (type !== RFU.HOST_SEND || !this.connected) return;
        this.hostFrames++;
        this.deliver(hostPayload(frame));
        const payload = this.next();
        if (payload) { this.send(clientFrame(payload)); this.sentFrames++; }
        else this.engine.pollSendDone();
        this.afterFrame();
    }

    // The board offers one room per activity; join the one matching this.activity.
    onBeacon(header, frame) {
        const packet = new Uint8Array(24);
        for (let i = 0; i < 6; i++) w32(packet, i * 4, b32(frame, 12 + i * 4));
        if (packet[12] !== this.activity) return;
        const devid = header & 0xffff;
        if (this.room !== devid) { this.room = devid; this.requested = false; this.onRoom?.(packet); }
        if (this.connected || this.requested) return;
        this.requested = true;
        this.emit('Asking to join the room');
        this.send(command(RFU.CONNECT_REQ, devid));
    }

    // Switch frame. During the name exchange it carries adapter state (bits 14-17 of the
    // first 3 bytes); in state 4 it carries 14-byte command slots.
    deliver(payload) {
        const slots = [];
        if (payload.length > 1) {
            if (payload.length < 3) throw new DataError('Invalid parent frame');
            const f = payload[0] | (payload[1] << 8) | (payload[2] << 16), state = (f >> 14) & 15;
            if (state === 4) {
                this.uni = true;
                for (let o = 3; o + 14 <= payload.length; o += 14) slots.push(payload.slice(o, o + 14));
            } else if (((f >> 13) & 1) === 0) {
                if (state === 2 && payload.length > 3 && payload[3] !== 5) throw new DataError(`The room refused the join: ${payload[3]}`);
                if (state === 1 || state === 2 || state === 3) this.niAck = ni(state, (f >> 11) & 3, (f >> 9) & 3, 1, new Uint8Array(0));
            }
        }
        this.engine.feed(slots);
    }

    next() {
        if (!this.niDone) {
            if (this.ni.length > 0) return this.ni.shift();
            if (this.niAck && (!this.emittedAck || !equal(this.niAck, this.emittedAck))) {
                this.emittedAck = this.niAck;
                return this.niAck;
            }
            if (!this.uni) return null;
            this.niDone = true;
            this.emit('Adapter name exchange complete');
        }
        let out = this.engine.tick();
        // Idle while seated: send a key report (0xbe00) every frame to stay seated.
        if (out[0] === 0 && this.engine.established && this.engine.hostInSeat && this.engine.inSeatPhase) {
            this.heldCount = (this.heldCount + 1) & 255;
            out = words(0xbe00, (this.heldCount << 8) | (this.heldKey === 0 ? 17 : this.heldKey));
            this.heldKey = 0;
        }
        const payload = new Uint8Array(16);
        w16(payload, 0, 0x100e);
        if (out[0] !== 0) {
            out[0] |= this.tag << 5;
            this.tag = (this.tag + 1) & 7;
            for (let i = 0; i < 7; i++) w16(payload, 2 + i * 2, out[i]);
        }
        return payload;
    }

    afterFrame() {
        if (!this.engine.seated && this.engine.established && this.engine.hostReady && this.engine.inSeatPhase) {
            this.engine.sit();
            this.heldKey = 22;
            this.emit('Taking the right seat');
        }
        if (this.engine.hostExiting && !this.exiting) {
            this.exiting = true;
            this.heldKey = 23;
            this.emit('Responding to the Switch leaving');
        }
    }

    leave() { if (this.connected) this.send(command(RFU.DISCONNECT, 0)); }
}

export { TRADE };
