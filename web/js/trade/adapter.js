// Wireless adapter frames exchanged with the board's bridge. The board runs the room and
// decrypts all traffic, so no keys are needed here.
//
// Frame: "RFU1", 4-byte type, 4-byte header (both big-endian), payload. Size is fixed per type.
// Sent as 64-byte GB-Link data frames; the reader resyncs on the magic.

import { b32, join, wb32 } from './bytes.js';
import { GB_CHANNEL, buildGbFrame } from '../wire.js';

const MAGIC = Uint8Array.of(0x52, 0x46, 0x55, 0x31);
const CHUNK = 64;

export const RFU = {
    BROADCAST: 0,     // room offered by the board
    CONNECT_REQ: 1,   // join request
    CONNECT_ACK: 2,   // join accepted
    DISCONNECT: 4,
    HOST_SEND: 5,     // frame from the Switch's game
    CLIENT_SEND: 6,   // frame from this side's game
};

export function frameSize(type) {
    if (type === RFU.BROADCAST) return 36;
    if (type === RFU.HOST_SEND || type === RFU.CLIENT_SEND) return 104;
    return 16;
}

export function command(type, header) {
    const frame = new Uint8Array(16);
    frame.set(MAGIC);
    wb32(frame, 4, type);
    wb32(frame, 8, header);
    return frame;
}

// Payload length goes in the header's top byte.
export function clientFrame(payload) {
    const frame = new Uint8Array(104);
    frame.set(MAGIC);
    wb32(frame, 4, RFU.CLIENT_SEND);
    wb32(frame, 8, Math.min(payload.length, 92) << 24);
    frame.set(payload.subarray(0, 92), 12);
    return frame;
}

// Payload length is in the header's low 7 bits.
export function hostPayload(frame) {
    const length = Math.min(b32(frame, 8) & 0x7f, 92);
    return frame.subarray(12, 12 + length);
}

// Reassembles whole frames from a chunked, possibly padded stream.
export class FrameReader {
    constructor() {
        this.buffer = new Uint8Array(0);
    }

    push(bytes) {
        this.buffer = join(this.buffer, bytes);
        const frames = [];
        let at = 0;
        while (this.buffer.length - at >= 12) {
            if (!startsWithMagic(this.buffer, at)) { at++; continue; }
            const size = frameSize(b32(this.buffer, at + 4));
            if (this.buffer.length - at < size) break;
            frames.push({ type: b32(this.buffer, at + 4), header: b32(this.buffer, at + 8), frame: this.buffer.slice(at, at + size) });
            at += size;
        }
        this.buffer = this.buffer.slice(at);
        if (this.buffer.length > 4096) this.buffer = this.buffer.slice(-256);
        return frames;
    }
}

function startsWithMagic(bytes, at) {
    for (let i = 0; i < 4; i++) if (bytes[at + i] !== MAGIC[i]) return false;
    return true;
}

// Splits a frame into 64-byte GB-Link data frames. The last piece is padded; the board
// treats a shorter piece as adapter telemetry.
export function toGbFrames(frame) {
    const pieces = [];
    for (let at = 0; at < frame.length; at += CHUNK) {
        const piece = new Uint8Array(CHUNK);
        piece.set(frame.subarray(at, at + CHUNK));
        pieces.push(buildGbFrame(GB_CHANNEL.DATA, piece));
    }
    return join(...pieces);
}
