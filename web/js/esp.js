// WebSerial session with the bridge firmware: binary mode, commands and replies, adapter
// frames (kinds 6 and 7), and re-attach after the firmware restarts at the end of every
// Switch session.

import { KIND, FrameDecoder, buildFrame } from './wire.js';
import { parseKeyStatus } from './keys.js';

// Native USB Serial/JTAG (S3, C3, C6), then dev-board USB-UART bridges (CP210x, CH34x, FTDI).
export const ESP_FILTERS = [
    { usbVendorId: 0x303a },
    { usbVendorId: 0x10c4 },
    { usbVendorId: 0x1a86 },
    { usbVendorId: 0x0403 },
];

const BOOT_BANNER = new TextEncoder().encode('LDN_READY');
const HANDSHAKE_ATTEMPTS = 4;
// Output seen only while the chip boots: ROM banner, 2nd-stage bootloader log, firmware
// banner. The ROM prints at 115200, so at the console rate bootloader lines are the first
// readable ones.
const BOOT_SIGNS = /LDN_READY|ldn_bridge|rst:0x|ESP-ROM:|I \(\d+\) boot:/;
// Panic output printed before a crash reboot.
const CRASH_LINES = /^(Guru Meditation Error.*|abort\(\).*|ESP_ERROR_CHECK failed.*|assert failed.*|Backtrace:.*|Stack smashing.*|Task watchdog.*|E \(\d+\) task_wdt.*|Core +\d+ register dump:.*|PC +: .*|.*Interrupt wdt timeout.*)$/gm;

// Native USB ignores the baud rate. Behind a USB-UART bridge the console runs at 921600,
// needed for adapter traffic. The browser cannot change an open port's rate, so 115200 is
// tried second (older firmware, ROM, readable boot banners).
const NATIVE_VENDOR_ID = 0x303a;
export const FAST_BAUD = 921600;
const SLOW_BAUD = 115200;

function isNativeUsb(port) {
    return safeInfo(port).usbVendorId === NATIVE_VENDOR_ID;
}

function ratesFor(port) {
    return isNativeUsb(port) ? [SLOW_BAUD] : [FAST_BAUD, SLOW_BAUD];
}

// Linux keeps tty settings between programs. After a VMIN=0 reader (pyserial, esptool) the
// browser's first read returns empty and is reported as a lost device. Replugging resets it.
export const PORT_LOST_ADVICE = 'The browser lost the port the moment it opened it. On Linux this happens after another serial program has used the port: unplug the board and plug it back in, then connect again.';

// Whether version string `candidate` is newer than `than` (dotted numbers).
export function newer(candidate, than) {
    const a = String(candidate).split('.').map(Number);
    const b = String(than).split('.').map(Number);
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        if ((a[i] ?? 0) !== (b[i] ?? 0)) return (a[i] ?? 0) > (b[i] ?? 0);
    }
    return false;
}

export class EspDevice extends EventTarget {
    constructor() {
        super();
        this.port = null;
        this.reader = null;
        this.writer = null;
        this.decoder = new FrameDecoder();
        this.session = 0;
        this.request = 0;
        this.pending = null;          // { request, lines, resolve, timer }
        this.queue = Promise.resolve();
        this.info = null;
        this.hello = null;
        this.attached = false;
        this.attaching = false;
        this.onAdapterFrame = null;   // (Uint8Array) => void, kind 6
        this.bannerTail = new Uint8Array(0);
        this.recentText = '';         // last few KB as text, for crash reports
        this.heardAt = 0;             // last room advertisement heard (LDN_ADV)
        this.readAt = 0;              // last advertisement decoded (LDN_ROOM)
        this.bannerSeen = false;
        this.readEnded = false;
        this.bootText = '';           // chip output while not attached
        this.bootSignAt = 0;          // last time boot output was seen
        this.baudRate = 0;
    }

    static available() {
        return typeof navigator !== 'undefined' && Boolean(navigator.serial);
    }

    static requestPort() {
        return navigator.serial.requestPort({ filters: ESP_FILTERS });
    }

    async open(port) {
        const rates = ratesFor(port);
        let failure = null;
        for (let i = 0; i < rates.length; i++) {
            try {
                await this.openPort(port, rates[i]);
            } catch (error) {
                throw Object.assign(new Error(error?.message ?? String(error)), { code: 'port-busy' });
            }
            try {
                await this.attach(i === rates.length - 1);
                return;
            } catch (error) {
                failure = error;
                await this.close();
                if (error.code === 'port-lost' || error.code === 'crash-loop') break;
            }
        }
        throw failure;
    }

    async openPort(port, baudRate) {
        await port.open({ baudRate, bufferSize: 65536 });
        this.baudRate = baudRate;
        this.port = port;
        this.writer = port.writable.getWriter();
        this.reader = port.readable.getReader();
        this.readEnded = false;
        this.bootText = '';
        this.readLoop();
        // On dev boards DTR/RTS drive boot-select and reset, and the OS asserts both on open.
        // Releasing them also keeps the chip untouched on close. Reset is RTS without DTR, and
        // USB-UART chips change the pins one at a time, so RTS goes first. Native USB takes
        // both in one request.
        try {
            if (isNativeUsb(port)) await port.setSignals({ dataTerminalReady: false, requestToSend: false });
            else {
                await port.setSignals({ requestToSend: false });
                await port.setSignals({ dataTerminalReady: false });
            }
        } catch {}
    }

    // Binary mode, session id, device info. Opening the port can reset the chip, so the
    // handshake is retried until the firmware has booted.
    async attach(lastChance = true) {
        this.attached = false;
        this.attaching = true;
        try {
            let hello = null;
            for (let attempt = 0; attempt < HANDSHAKE_ATTEMPTS && !hello; attempt++) {
                this.decoder = new FrameDecoder();
                const justBooted = this.bannerSeen;
                this.bannerSeen = false;
                await sleep(attempt === 0 || justBooted ? 150 : 600);
                // Port lost before any output: OS problem. Lost after output: the chip, e.g.
                // one with nothing to run restarts every few seconds and its native USB drops.
                if (this.readEnded) throw this.bootText ? this.silenceExplained() : Object.assign(new Error(PORT_LOST_ADVICE), { code: 'port-lost' });
                await this.writeRaw(new TextEncoder().encode('\nLDN_BINARY\n\0'));
                await sleep(200);
                const lines = await this.command('LDN_HELLO', 700, true);
                hello = lines.find((line) => line.startsWith('LDN_HELLO')) ?? null;
                if (this.bannerSeen) hello = null;   // rebooted mid-handshake, retry
                if (!hello && !this.worthAnotherTry(attempt, lastChance)) break;
            }
            if (!hello) throw this.silenceExplained();
            this.hello = hello;
            this.session = ((Date.now() & 0x7fffffff) | 1) >>> 0;
            await this.command(`LDN_BEGIN ${this.session.toString(16).padStart(8, '0')}`, 2000, true);
            const info = await this.command('LDN_INFO', 2000, true);
            this.info = parseInfo(info.find((line) => line.startsWith('LDN_INFO')) ?? '');
            this.attached = true;
        } finally {
            this.attaching = false;
        }
        this.dispatchEvent(new CustomEvent('attached', { detail: this.info }));
    }

    // Running firmware answers within milliseconds, so keep waiting only while the chip is
    // visibly booting. Other firmware, a bootloader or a crash stop at once. Plain silence
    // gets one more try, only at the last rate.
    worthAnotherTry(attempt, lastChance) {
        const text = this.bootText;
        if (/waiting for download|invalid header|No bootable app|ESP_ERROR_CHECK failed|abort\(\) was called|Guru Meditation/i.test(text)) return false;
        const project = text.match(/Project name:\s+(\S+)/)?.[1];
        if (project && !project.startsWith('ldn_bridge')) return false;
        // Recent boot output only: this firmware answers ~1 s after reset, other firmware never.
        if (BOOT_SIGNS.test(text)) return Date.now() - this.bootSignAt < 3000;
        return lastChance && attempt === 0 && text.length === 0;
    }

    // Explains a failed handshake from the chip's output: ROM download mode, or firmware that
    // aborts at start-up and restarts (equally silent from outside).
    silenceExplained() {
        const text = this.bootText;
        if (/waiting for download/i.test(text)) {
            return Object.assign(new Error('The chip is sitting in its bootloader.'), { code: 'download-mode' });
        }
        // No bootloader or no app: an empty board restarting endlessly, not a crash loop.
        if (/invalid header|No bootable app/i.test(text)) {
            return Object.assign(new Error('No bridge firmware answered on this port.'), { code: 'no-firmware' });
        }
        const crash = text.match(/ESP_ERROR_CHECK failed[^\r\n]*|abort\(\) was called[^\r\n]*|Guru Meditation Error[^\r\n]*|Brownout detector was triggered/);
        const restarts = (text.match(/rst:0x/g) ?? []).length;
        if (crash || restarts >= 2) {
            const detail = ['file:', 'func:', 'expression:']
                .map((label) => text.match(new RegExp(`${label}[^\\r\\n]*`))?.[0]).filter(Boolean).join(' ');
            return Object.assign(new Error('The firmware on this board crashes as it starts, and restarts.'),
                { code: 'crash-loop', detail: [crash?.[0], detail].filter(Boolean).join(' ') });
        }
        const project = text.match(/Project name:\s+(\S+)/)?.[1];
        if (project && !project.startsWith('ldn_bridge')) {
            return Object.assign(new Error(`This board is running other firmware (${project}).`), { code: 'no-firmware' });
        }
        return Object.assign(new Error('No bridge firmware answered on this port.'), { code: 'no-firmware' });
    }

    async readLoop() {
        const reader = this.reader;
        try {
            while (reader === this.reader) {
                const { value, done } = await reader.read();
                if (done) break;
                if (!value || value.length === 0) continue;
                if (!this.attached) {
                    const text = new TextDecoder().decode(value);
                    this.bootText = (this.bootText + text).slice(-16384);
                    // Includes earlier text so a sign split across reads is found.
                    if (BOOT_SIGNS.test(this.bootText.slice(-(text.length + 32)))) this.bootSignAt = Date.now();
                }
                this.watchForReboot(value);
                // A page error on one frame is not a port failure. Keep reading, or the
                // board would look unplugged.
                for (const frame of this.decoder.push(value)) {
                    try { this.handleFrame(frame); }
                    catch (error) { this.dispatchEvent(new CustomEvent('log', { detail: `page: ${error?.message ?? error}` })); }
                }
            }
        } catch {
            // Port gone, or close() cancelled the read.
        }
        this.readEnded = true;
        if (reader === this.reader) this.dispatchEvent(new Event('disconnected'));
    }

    // A software restart keeps the USB port open. The boot banner is the only sign the chip
    // is back in text mode and needs a new handshake.
    watchForReboot(chunk) {
        this.recentText = (this.recentText + new TextDecoder().decode(chunk)).slice(-6144);
        const joined = new Uint8Array(this.bannerTail.length + chunk.length);
        joined.set(this.bannerTail, 0);
        joined.set(chunk, this.bannerTail.length);
        this.bannerTail = joined.slice(Math.max(0, joined.length - (BOOT_BANNER.length - 1)));
        if (indexOf(joined, BOOT_BANNER) < 0) return;
        this.bannerSeen = true;
        if (this.attaching) this.finishPending();   // sent before boot, no reply coming
        if (!this.attached || this.attaching) return;
        this.attached = false;
        const report = this.recentText.match(CRASH_LINES);
        this.recentText = '';
        if (report) this.dispatchEvent(new CustomEvent('log', { detail: `the board crashed: ${report.map((l) => l.trim()).join(' | ')}` }));
        this.dispatchEvent(new Event('restarted'));
        sleep(1200)
            .then(() => this.attach())
            .then(() => this.dispatchEvent(new Event('reattached')))
            .catch((error) => this.dispatchEvent(new CustomEvent('failed', { detail: error })));
    }

    handleFrame(frame) {
        if (frame.kind === KIND.ADAPTER_OUT) {
            if (this.onAdapterFrame) this.onAdapterFrame(frame.payload);
            return;
        }
        if (frame.kind !== KIND.RESPONSE && frame.kind !== KIND.EVENT) return;
        const text = new TextDecoder().decode(frame.payload).trim();
        const pending = this.pending;
        if (pending && frame.request === pending.request) {
            if (text === 'LDN_DONE') {
                clearTimeout(pending.timer);
                this.pending = null;
                pending.resolve(pending.lines);
            } else {
                pending.lines.push(text);
            }
            return;
        }
        if (text.startsWith('LDN_ADV ')) this.heardAt = Date.now();
        else if (text.startsWith('LDN_ROOM ')) this.readAt = Date.now();
        if (text && text !== 'LDN_DONE') this.dispatchEvent(new CustomEvent('log', { detail: text }));
    }

    // Advertisements arrive (4/s while a room is up) but none decode: the stored keys cannot
    // read this room.
    get hearsUnreadableRoom() {
        const now = Date.now();
        return now - this.heardAt < 5000 && now - this.readAt > 10000;
    }

    // Switch signal in dBm over the last few seconds, or null if its room was not heard.
    // Skipped before 2.0.2, which counted every wireless frame.
    async signal() {
        if (!this.info || newer('2.0.2', this.info.version)) return null;
        const lines = await this.command('LDN_RF', 1500);
        const match = lines.find((l) => l.startsWith('LDN_RF '))?.match(/frames=(\d+) avg=(-?\d+)/);
        return match && Number(match[1]) > 0 ? Number(match[2]) : null;
    }

    // One request at a time, per protocol. Resolves with the reply lines, or whatever arrived
    // before the timeout. Before attach only handshake commands may run.
    command(text, timeoutMs = 2000, handshake = false) {
        const run = () => new Promise((resolve, reject) => {
            if (!this.writer) { reject(new Error('Not connected')); return; }
            if (!this.attached && !handshake) { reject(new Error('The ESP32 board is restarting')); return; }
            const request = (this.request = (this.request % 0x7fffffff) + 1);
            const entry = { request, lines: [], resolve, timer: null };
            entry.timer = setTimeout(() => {
                if (this.pending === entry) this.pending = null;
                resolve(entry.lines);
            }, timeoutMs);
            this.pending = entry;
            this.writeRaw(buildFrame(KIND.COMMAND, request, this.session, new TextEncoder().encode(text)))
                .catch((error) => { clearTimeout(entry.timer); if (this.pending === entry) this.pending = null; reject(error); });
        });
        const result = this.queue.then(run, run);
        this.queue = result.catch(() => {});
        return result;
    }

    finishPending() {
        const pending = this.pending;
        if (!pending) return;
        clearTimeout(pending.timer);
        this.pending = null;
        pending.resolve(pending.lines);
    }

    // Adapter bytes to the bridge (kind 7).
    sendAdapter(bytes) {
        if (!this.attached) return;
        this.writeRaw(buildFrame(KIND.ADAPTER_IN, 0, this.session, bytes)).catch(() => {});
    }

    writeRaw(bytes) {
        if (!this.writer) return Promise.reject(new Error('Not connected'));
        return this.writer.write(bytes);
    }

    async keyStatus() {
        const lines = await this.command('LDN_KEYS');
        const line = lines.find((l) => l.startsWith('LDN_KEYS '));
        return line ? parseKeyStatus(line) : null;
    }

    // keys: { name: 32 hex digits }. Stored in flash and never read back. Only presence
    // can be queried.
    async storeKeys(keys) {
        const rejected = [];
        for (const [name, value] of Object.entries(keys)) {
            const lines = await this.command(`LDN_KEY ${name} ${value}`, 3000);
            if (!lines.some((l) => l === `LDN_KEY_OK ${name}`)) rejected.push(name);
        }
        return rejected;
    }

    async eraseKeys() {
        const lines = await this.command('LDN_KEYS_ERASE', 3000);
        return lines.includes('LDN_KEYS_ERASED');
    }

    // Without keys the board stops scanning at the first room found; this restarts it.
    async startBridge() {
        await this.command('LDN_BRIDGE_START');
    }

    async bridgeStatus() {
        const lines = await this.command('LDN_BRIDGE_STATUS', 1500);
        const line = lines.find((l) => l.startsWith('LDN_BRIDGE_STATUS '));
        if (!line) return null;
        const fields = {};
        for (const part of line.split(/\s+/).slice(1)) {
            const at = part.indexOf('=');
            if (at > 0) fields[part.slice(0, at)] = part.slice(at + 1);
        }
        return fields;
    }

    async adapterPort() {
        const lines = await this.command('LDN_ADAPTER');
        return lines.find((l) => l.startsWith('LDN_ADAPTER '))?.slice(12) ?? null;
    }

    async setAdapterPort(where) {
        const lines = await this.command(`LDN_ADAPTER ${where}`);
        return lines.includes(`LDN_ADAPTER ${where}`);
    }

    // Closes the port and returns it, for the flasher or reopening.
    async close() {
        const port = this.port;
        const reader = this.reader;
        const writer = this.writer;
        this.port = null;
        this.reader = null;
        this.writer = null;
        this.attached = false;
        this.finishPending();
        try { await reader?.cancel(); } catch {}
        try { reader?.releaseLock(); } catch {}
        try { writer?.releaseLock(); } catch {}
        try { await port?.close(); } catch {}
        return port;
    }
}

// After a reset the board can re-enumerate as a new port object with the same permission.
// Tries the previous port first, then any granted port with the same VID/PID.
export async function reopenPort(previous, attempts = 12) {
    const wanted = safeInfo(previous);
    for (let attempt = 0; attempt < attempts; attempt++) {
        await sleep(attempt === 0 ? 1200 : 700);
        let candidates = [];
        try { candidates = await navigator.serial.getPorts(); } catch {}
        candidates = candidates.filter((port) => {
            const info = safeInfo(port);
            return info.usbVendorId === wanted.usbVendorId && info.usbProductId === wanted.usbProductId;
        });
        if (candidates.includes(previous)) candidates = [previous, ...candidates.filter((p) => p !== previous)];
        for (const port of candidates) {
            const device = new EspDevice();
            try {
                await device.open(port);
                return device;
            } catch (error) {
                await device.close();
                if (error.code !== 'port-busy') throw error;   // otherwise not back yet, or stale
            }
        }
    }
    return null;
}

function safeInfo(port) {
    try { return port?.getInfo?.() ?? {}; } catch { return {}; }
}

function parseInfo(line) {
    // LDN_INFO frlg-ldn-bridge 2.0.0 chip=esp32s3 transport=USB Serial/JTAG
    const match = line.match(/^LDN_INFO (\S+) (\S+) chip=(\S+) transport=(.+)$/);
    return match ? { name: match[1], version: match[2], chip: match[3], transport: match[4] } : null;
}

function indexOf(haystack, needle) {
    outer: for (let i = 0; i + needle.length <= haystack.length; i++) {
        for (let k = 0; k < needle.length; k++) if (haystack[i + k] !== needle[k]) continue outer;
        return i;
    }
    return -1;
}

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
