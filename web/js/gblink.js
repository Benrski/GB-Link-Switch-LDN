// GB-Link adapter over WebUSB or WebSerial, exposed as a GB-Link frame stream both ways (the
// bridge firmware's UART format). Serial traffic is already framed by the adapter. WebUSB
// channels are separate endpoints, framed and unframed here.

import { GB_CHANNEL, GbFrameParser, buildGbFrame } from './wire.js';

export const GBLINK_VENDOR_ID = 0x2fe3;
export const BOOTROM_VENDOR_ID = 0x2e8a;

export const COMMAND = {
    SET_MODE: 0x00,
    CANCEL: 0x01,
    FIRMWARE_INFO: 0x0f,
    REBOOT_BOOTLOADER: 0x43,
    WIRELESS_STATS: 0x4c,
};

export const MODE_CABLE_LINK = 0x01;
export const MODE_WIRELESS_ADAPTER = 0x07;

const ENDPOINT_SIZE = 64;

class GbLinkBase extends EventTarget {
    constructor() {
        super();
        this.onBytes = null;       // (Uint8Array) => void, GB-Link frames from the adapter
        this.onFrame = null;       // (channel, payload) => void, every frame; the cable mode reads these
        this.waiters = [];         // requests awaiting a data-channel reply
        this.resets = [];          // { at, count } samples, last 10 s
        this.resetLoop = false;
        this.quietUntil = 0;       // resets ignored until then (the room is closing)
        this.startedUp = false;    // past the ID handshake, into commands
    }

    // Sends a command; resolves with the reply, or null on timeout. Replies arrive on the data
    // channel prefixed by the command byte. Other data-channel traffic is ignored.
    request(payload, timeoutMs = 600) {
        return new Promise((resolve) => {
            const waiter = { command: payload[0], resolve, timer: null };
            waiter.timer = setTimeout(() => {
                const at = this.waiters.indexOf(waiter);
                if (at >= 0) this.waiters.splice(at, 1);
                resolve(null);
            }, timeoutMs);
            this.waiters.push(waiter);
            this.sendCommand(payload).catch(() => {});
        });
    }

    // Ignore resets for a while: the game re-detects the adapter after a room closes, and
    // longer while the board restarts.
    quiet(ms) {
        this.quietUntil = Date.now() + ms;
    }

    // A game that cannot reach the adapter resets it ~4x/s until it gets through (the GBA
    // freezes).
    noteResets(count) {
        const now = Date.now();
        if (now < this.quietUntil) this.resets = [];
        this.resets.push({ at: now, count });
        while (this.resets.length > 1 && now - this.resets[0].at > 10000) this.resets.shift();
        const risen = (count - this.resets[0].count) & 0xff;
        const looping = risen >= 30;
        if (looping === this.resetLoop) return;
        this.resetLoop = looping;
        this.dispatchEvent(new CustomEvent('resetloop', { detail: { looping, startedUp: this.startedUp } }));
    }

    deliver(channel, payload) {
        this.onFrame?.(channel, payload);
        if (channel !== GB_CHANNEL.DATA || payload.length === 0) return;
        // Wireless-mode status, 2x/s: 0x1d carries the game's adapter-reset count (8-bit,
        // wrapping), 0x0e the adapter's start-up stage.
        if (payload[0] === 0x1d && payload.length === 25) { this.noteResets(payload[14]); return; }
        if (payload[0] === 0x0e && payload.length === 16) { this.startedUp = payload[3] >= 2; return; }
        const at = this.waiters.findIndex((waiter) => waiter.command === payload[0]);
        if (at < 0) return;
        const [waiter] = this.waiters.splice(at, 1);
        clearTimeout(waiter.timer);
        waiter.resolve(payload);
    }

    // Firmware version and wireless-mode support (only that firmware answers WIRELESS_STATS).
    async identify() {
        const info = await this.request([COMMAND.FIRMWARE_INFO]);
        const stats = await this.request([COMMAND.WIRELESS_STATS], 400);
        return {
            version: info && info.length >= 4 && info[0] === COMMAND.FIRMWARE_INFO
                ? `${info[1]}.${info[2]}.${info[3]}` : null,
            wireless: Boolean(stats && stats.length >= 21 && stats[0] === COMMAND.WIRELESS_STATS),
        };
    }

    rebootToBootloader() {
        return this.sendCommand([COMMAND.REBOOT_BOOTLOADER]).catch(() => {});
    }

    setMode(mode) {
        return this.sendCommand([COMMAND.SET_MODE, mode]);
    }

    leaveMode() {
        return this.sendCommand([COMMAND.CANCEL]).catch(() => {});
    }
}

export class GbLinkSerial extends GbLinkBase {
    constructor() {
        super();
        this.kind = 'serial';
        this.port = null;
        this.reader = null;
        this.writer = null;
        this.parser = new GbFrameParser(ENDPOINT_SIZE);
    }

    static available() {
        return typeof navigator !== 'undefined' && Boolean(navigator.serial);
    }

    static requestPort() {
        return navigator.serial.requestPort({ filters: [{ usbVendorId: GBLINK_VENDOR_ID }] });
    }

    async open(port) {
        await port.open({ baudRate: 115200, bufferSize: 16384 });
        this.port = port;
        this.writer = port.writable.getWriter();
        this.reader = port.readable.getReader();
        this.readEnded = false;
        this.readLoop();
        // Same Linux VMIN=0 issue as PORT_LOST_ADVICE in esp.js.
        await new Promise((resolve) => setTimeout(resolve, 150));
        if (this.readEnded) {
            throw Object.assign(new Error('The browser lost the port the moment it opened it. On Linux this happens after another serial program has used the port: unplug the adapter and plug it back in, then connect again.'), { code: 'port-lost' });
        }
    }

    async readLoop() {
        const reader = this.reader;
        try {
            while (reader === this.reader) {
                const { value, done } = await reader.read();
                if (done) break;
                if (!value || value.length === 0) continue;
                if (this.onBytes) this.onBytes(value);
                for (const frame of this.parser.push(value)) this.deliver(frame.channel, frame.payload);
            }
        } catch {
            // Unplugged, or close() cancelled the read.
        }
        this.readEnded = true;
        if (reader === this.reader) this.dispatchEvent(new Event('disconnected'));
    }

    // Whole GB-Link frames from the bridge firmware.
    writeStream(bytes) {
        if (!this.writer) return;
        this.writer.write(bytes).catch(() => {});
    }

    sendCommand(payload) {
        if (!this.writer) return Promise.reject(new Error('Not connected'));
        return this.writer.write(buildGbFrame(GB_CHANNEL.COMMAND, Uint8Array.from(payload)));
    }

    sendData(payload) {
        if (!this.writer) return Promise.reject(new Error('Not connected'));
        return this.writer.write(buildGbFrame(GB_CHANNEL.DATA, payload));
    }

    async close() {
        const { port, reader, writer } = this;
        this.port = null;
        this.reader = null;
        this.writer = null;
        try { await reader?.cancel(); } catch {}
        try { reader?.releaseLock(); } catch {}
        try { writer?.releaseLock(); } catch {}
        try { await port?.close(); } catch {}
    }
}

export class GbLinkUsb extends GbLinkBase {
    constructor() {
        super();
        this.kind = 'usb';
        this.device = null;
        this.endpoints = null;     // { commandOut, statusIn, dataOut, dataIn }
        this.parser = new GbFrameParser(ENDPOINT_SIZE);
        this.outbound = Promise.resolve();
        this.running = false;
    }

    static available() {
        return typeof navigator !== 'undefined' && Boolean(navigator.usb);
    }

    // Bootloader VID included so a board already in update mode can be picked.
    static requestDevice() {
        return navigator.usb.requestDevice({
            filters: [{ vendorId: GBLINK_VENDOR_ID }, { vendorId: BOOTROM_VENDOR_ID }],
        });
    }

    async open(device) {
        if (!device.opened) await device.open();
        if (!device.configuration) await device.selectConfiguration(1);
        const found = findVendorInterface(device);
        if (!found) throw new Error('This device has no GB-Link interface.');
        await device.claimInterface(found.interfaceNumber);
        this.device = device;
        this.endpoints = found;
        this.running = true;
        this.readLoop(found.dataIn, GB_CHANNEL.DATA);
        this.readLoop(found.statusIn, GB_CHANNEL.STATUS);
    }

    async readLoop(endpoint, channel) {
        const device = this.device;
        try {
            while (this.running && device === this.device) {
                const result = await device.transferIn(endpoint, ENDPOINT_SIZE);
                if (result.status === 'stall') { await device.clearHalt('in', endpoint); continue; }
                if (!result.data || result.data.byteLength === 0) continue;
                const payload = new Uint8Array(result.data.buffer, result.data.byteOffset, result.data.byteLength);
                if (this.onBytes) this.onBytes(buildGbFrame(channel, payload));
                this.deliver(channel, payload);
            }
        } catch {
            // Unplugged, or close() ended the transfers.
        }
        if (this.running && device === this.device && channel === GB_CHANNEL.DATA) {
            this.running = false;
            this.dispatchEvent(new Event('disconnected'));
        }
    }

    // One transfer per frame, in order: a mode change must land before the data after it.
    writeStream(bytes) {
        for (const frame of this.parser.push(bytes)) {
            const endpoint = frame.channel === GB_CHANNEL.COMMAND ? this.endpoints?.commandOut
                : frame.channel === GB_CHANNEL.DATA ? this.endpoints?.dataOut : null;
            if (endpoint) this.transferOut(endpoint, frame.payload);
        }
    }

    transferOut(endpoint, payload) {
        const device = this.device;
        const result = this.outbound.then(() => {
            if (!device || device !== this.device) throw new Error('Not connected');
            return device.transferOut(endpoint, payload);
        });
        this.outbound = result.catch(() => {});
        return result;
    }

    sendCommand(payload) {
        if (!this.endpoints) return Promise.reject(new Error('Not connected'));
        return this.transferOut(this.endpoints.commandOut, Uint8Array.from(payload));
    }

    sendData(payload) {
        if (!this.endpoints) return Promise.reject(new Error('Not connected'));
        return this.transferOut(this.endpoints.dataOut, payload);
    }

    async close() {
        const device = this.device;
        this.running = false;
        this.device = null;
        this.endpoints = null;
        try { if (device?.opened) await device.close(); } catch {}
    }
}

// Vendor interface: lower endpoint pair = command out / status in, upper pair = data.
function findVendorInterface(device) {
    for (const iface of device.configuration?.interfaces ?? []) {
        for (const alternate of iface.alternates) {
            if (alternate.interfaceClass !== 0xff) continue;
            const numbers = (direction) => alternate.endpoints
                .filter((endpoint) => endpoint.direction === direction)
                .map((endpoint) => endpoint.endpointNumber)
                .sort((a, b) => a - b);
            const ins = numbers('in');
            const outs = numbers('out');
            if (ins.length < 2 || outs.length < 2) continue;
            return {
                interfaceNumber: iface.interfaceNumber,
                commandOut: outs[0],
                statusIn: ins[0],
                dataOut: outs[outs.length - 1],
                dataIn: ins[ins.length - 1],
            };
        }
    }
    return null;
}
