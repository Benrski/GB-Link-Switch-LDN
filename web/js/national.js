// The National Dex bypass for links this page carries. A game joining a trade group led by
// another kind of game (Emerald and FireRed/LeafGreen) checks its own player is Champion
// and the leader can link nationally (union_room.c IsTryingToTradeAcrossVersionTooSoon);
// with the same kind of leader it checks nothing. With the bypass on, broadcasts passing
// through carry the joiner's kind: the Switch's group reaches the GBA as an Emerald's, and
// an Emerald's group reaches the Switch as a FireRed's. Both also read as able to link
// nationally. After the join each game sees the other's real LinkPlayer.
//
// Works on a GB-Link frame stream. Data frames carry RFU1 frames as one byte stream, and a
// broadcast can be cut across two data frames: frames are passed on unchanged in size and
// order, and one holding the start of an unfinished broadcast waits for the next.

import { GB_CHANNEL, GbFrameParser, buildGbFrame } from './wire.js';
import { join } from './trade/bytes.js';

const MAGIC = [0x52, 0x46, 0x55, 0x31];
const BROADCAST = 0;

function frameSize(type) {
    if (type === BROADCAST) return 36;
    if (type === 5 || type === 6) return 104;
    return 16;
}

// Broadcast body: six big-endian words of the little-endian record, so record byte r is at
// 12 + (r & ~3) + (3 - (r & 3)).
const at = (r) => 12 + (r & ~3) + (3 - (r & 3));

export const VERSION = { EMERALD: 3, FIRE_RED: 4, LEAF_GREEN: 5 };

// Compatibility word: record bytes 2-3, can link nationally at bit 7, version at bits 10-13.
// asVersion(version) gives the version the joiner should see, or null to keep it.
export function markNationally(frame, offset = 0, asVersion = null) {
    frame[offset + at(2)] |= 0x80;
    const version = (frame[offset + at(3)] >> 2) & 0xf;
    const shown = asVersion ? asVersion(version) : null;
    if (shown !== null && shown !== undefined) frame[offset + at(3)] = (frame[offset + at(3)] & ~0x3c) | (shown << 2);
    let sum = 0;
    for (let r = 2; r < 10; r++) sum += frame[offset + at(r)];
    for (let r = 16; r < 24; r++) sum += frame[offset + at(r)];
    frame[offset + at(15)] = ~sum & 0xff;
}

export class NationalPatch {
    // asVersion: see markNationally.
    constructor(asVersion = null) {
        this.asVersion = asVersion;
        this.enabled = false;
        this.parser = new GbFrameParser(512);
        this.queue = [];    // { channel, payload } not yet passed on
        this.scan = 0;      // stream position scanned so far, from the first queued data frame
    }

    // GB-Link frames in, GB-Link frames out.
    push(bytes) {
        if (!this.enabled && this.queue.length === 0) return bytes;
        for (const frame of this.parser.push(bytes)) this.queue.push({ channel: frame.channel, payload: frame.payload.slice() });
        return this.release();
    }

    release() {
        const data = this.queue.filter((f) => f.channel === GB_CHANNEL.DATA);
        const stream = join(...data.map((f) => f.payload));
        let i = this.scan, hold = -1;
        while (i < stream.length) {
            const left = stream.length - i;
            if (!MAGIC.every((m, k) => k >= left || stream[i + k] === m)) { i++; continue; }
            // A magic cut by the end of what has arrived: wait for the rest.
            if (left < 4) { hold = i; break; }
            if (stream.length - i < 12) { hold = i; break; }
            const type = (stream[i + 4] << 24 | stream[i + 5] << 16 | stream[i + 6] << 8 | stream[i + 7]) >>> 0;
            const size = frameSize(type);
            if (type === BROADCAST) {
                if (stream.length - i < size) { hold = i; break; }
                if (this.enabled) markNationally(stream, i, this.asVersion);
            }
            i += Math.min(size, stream.length - i);
        }
        // Write the patched stream back into its frames.
        let o = 0;
        for (const f of data) { f.payload.set(stream.subarray(o, o + f.payload.length)); o += f.payload.length; }
        // Pass on every frame before the data frame the held broadcast starts in.
        const out = [];
        let consumed = 0;
        while (this.queue.length) {
            const f = this.queue[0];
            if (f.channel === GB_CHANNEL.DATA) {
                if (hold >= 0 && consumed + f.payload.length > hold) break;
                consumed += f.payload.length;
            }
            out.push(buildGbFrame(f.channel, f.payload));
            this.queue.shift();
        }
        this.scan = Math.max(0, (hold >= 0 ? hold : i) - consumed);
        return out.length ? join(...out) : new Uint8Array(0);
    }
}
