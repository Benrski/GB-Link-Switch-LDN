// Bridge firmware console protocol (docs/SERIAL_PROTOCOL.md). COBS frames terminated by 0x00:
//   version:1 | kind:1 | request:4 LE | session:4 LE | length:2 LE | payload | crc32:4 LE

export const KIND = {
    COMMAND: 1,        // host -> device, ASCII
    RESPONSE: 2,       // device -> host, ASCII, answers a request
    EVENT: 3,          // device -> host, ASCII, unsolicited
    ADAPTER_OUT: 6,    // device -> host, whole GB-Link frames for the adapter
    ADAPTER_IN: 7,     // host -> device, a GB-Link frame stream from the adapter
};

const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        table[n] = c >>> 0;
    }
    return table;
})();

export function crc32(bytes) {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
}

export function cobsEncode(data) {
    const out = [];
    let codeAt = 0;
    let code = 1;
    out.push(0);
    for (let i = 0; i < data.length; i++) {
        if (data[i] === 0) {
            out[codeAt] = code;
            codeAt = out.length;
            out.push(0);
            code = 1;
        } else {
            out.push(data[i]);
            code++;
            if (code === 0xff) {
                out[codeAt] = code;
                codeAt = out.length;
                out.push(0);
                code = 1;
            }
        }
    }
    out[codeAt] = code;
    return Uint8Array.from(out);
}

export function cobsDecode(data) {
    const out = [];
    let i = 0;
    while (i < data.length) {
        const code = data[i++];
        if (code === 0 || i + code - 1 > data.length) return null;
        for (let k = 1; k < code; k++) out.push(data[i++]);
        if (code !== 0xff && i < data.length) out.push(0);
    }
    return Uint8Array.from(out);
}

export function buildFrame(kind, request, session, payload) {
    const raw = new Uint8Array(16 + payload.length);
    const view = new DataView(raw.buffer);
    raw[0] = 1;
    raw[1] = kind;
    view.setUint32(2, request >>> 0, true);
    view.setUint32(6, session >>> 0, true);
    view.setUint16(10, payload.length, true);
    raw.set(payload, 12);
    view.setUint32(12 + payload.length, crc32(raw.subarray(0, 12 + payload.length)), true);
    const encoded = cobsEncode(raw);
    const framed = new Uint8Array(encoded.length + 1);
    framed.set(encoded, 0);
    return framed;
}

// Splits a byte stream on 0x00 and returns frames that pass all checks. Boot text and torn
// frames are dropped, as in the firmware.
export class FrameDecoder {
    constructor() {
        this.pending = [];
    }

    push(bytes) {
        const frames = [];
        for (let i = 0; i < bytes.length; i++) {
            if (bytes[i] !== 0) {
                if (this.pending.length < 8192) this.pending.push(bytes[i]);
                continue;
            }
            const chunk = this.pending;
            this.pending = [];
            if (chunk.length === 0) continue;
            const raw = cobsDecode(chunk);
            if (!raw || raw.length < 16 || raw[0] !== 1) continue;
            const view = new DataView(raw.buffer, raw.byteOffset, raw.byteLength);
            const length = view.getUint16(10, true);
            if (raw.length !== length + 16) continue;
            if (view.getUint32(12 + length, true) !== crc32(raw.subarray(0, 12 + length))) continue;
            frames.push({
                kind: raw[1],
                request: view.getUint32(2, true),
                session: view.getUint32(6, true),
                payload: raw.subarray(12, 12 + length),
            });
        }
        return frames;
    }
}

// GB-Link frame: 'G' 'B' | channel:1 | length:2 LE | payload
export const GB_CHANNEL = { COMMAND: 0, DATA: 1, STATUS: 2 };

export function buildGbFrame(channel, payload) {
    const frame = new Uint8Array(5 + payload.length);
    frame[0] = 0x47;
    frame[1] = 0x42;
    frame[2] = channel;
    frame[3] = payload.length & 0xff;
    frame[4] = payload.length >> 8;
    frame.set(payload, 5);
    return frame;
}

// Incremental parser; input need not be frame-aligned.
export class GbFrameParser {
    constructor(maxPayload = 512) {
        this.maxPayload = maxPayload;
        this.state = 0;
        this.channel = 0;
        this.length = 0;
        this.buffer = null;
        this.seen = 0;
    }

    push(bytes) {
        const frames = [];
        for (let i = 0; i < bytes.length; i++) {
            const b = bytes[i];
            switch (this.state) {
                case 0: if (b === 0x47) this.state = 1; break;
                case 1: this.state = b === 0x42 ? 2 : b === 0x47 ? 1 : 0; break;
                case 2: this.channel = b; this.state = 3; break;
                case 3: this.length = b; this.state = 4; break;
                case 4:
                    this.length |= b << 8;
                    if (this.length > this.maxPayload) { this.state = 0; break; }
                    this.buffer = new Uint8Array(this.length);
                    this.seen = 0;
                    if (this.length === 0) { frames.push({ channel: this.channel, payload: this.buffer }); this.state = 0; }
                    else this.state = 5;
                    break;
                case 5:
                    this.buffer[this.seen++] = b;
                    if (this.seen >= this.length) { frames.push({ channel: this.channel, payload: this.buffer }); this.state = 0; }
                    break;
            }
        }
        return frames;
    }
}
