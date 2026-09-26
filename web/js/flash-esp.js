// Flashes the bridge firmware to an ESP32 over WebSerial with esptool-js. Images are picked
// from the manifest by detected chip. The three images are written separately so the NVS
// partition between them (stored keys) survives updates.

import { ESPLoader, Transport } from '../vendor/esptool-js/bundle.js';
import { md5 } from './md5.js';
import { fetchBytes } from './manifest.js';

const ESPRESSIF_VENDOR_ID = 0x303a;

// port: a closed SerialPort. Resolves with { chip, version } after reset into the new
// firmware. The port is closed on return.
export async function flashBridge(port, manifest, options = {}) {
    // Baud rate is ignored on native USB, and changing it there closes and reopens the port.
    // Some UART bridges accept 460800 and then corrupt the next packet; those retry at 115200.
    const native = safeInfo(port).usbVendorId === ESPRESSIF_VENDOR_ID;
    return withSlowerRetry(native ? [115200] : [460800, 115200], (baudrate, seen) => flashAt(port, manifest, baudrate, seen, options), options);
}

// Tries each rate in turn. Falls back only if the failure came after a switch to a faster rate.
export async function withSlowerRetry(rates, attempt, { onStatus = () => {}, onLog = () => {} } = {}) {
    for (let i = 0; i < rates.length; i++) {
        const seen = { faster: false };
        try {
            return await attempt(rates[i], seen);
        } catch (error) {
            if (i === rates.length - 1 || !seen.faster) throw error;
            onLog(`the board did not keep up at ${rates[i]} baud (${error.message}); trying again at ${rates[i + 1]}`);
            onStatus('The board could not keep up at high speed. Trying again slower…');
        }
    }
    return undefined;
}

async function flashAt(port, manifest, baudrate, seen, { onStatus = () => {}, onProgress = () => {}, onLog = () => {}, eraseAll = false } = {}) {
    const terminal = {
        clean() {},
        write() {},
        writeLine(text) {
            if (!text || text.startsWith('Writing at')) return;
            if (text.startsWith('Changing baudrate')) seen.faster = true;
            onLog(text);
        },
    };
    const transport = new Transport(port, false);
    const loader = new ESPLoader({ transport, baudrate, romBaudrate: 115200, terminal, debugLogging: false });
    try {
        onStatus('Connecting to the chip…');
        await loader.main();
        const chip = loader.chip.CHIP_NAME;
        const entry = manifest.bridge.chips[chip];
        if (!entry) throw new Error(`There is no bridge firmware for the ${chip}.`);

        onStatus(`Found an ${chip}. Downloading firmware ${manifest.bridge.version}…`);
        const files = [];
        for (const part of entry.parts) files.push({ address: part.address, data: await fetchBytes(manifest.base + part.path) });

        const sizes = files.map((file) => file.data.length);
        const total = sizes.reduce((sum, size) => sum + size, 0);
        const flashSize = await loader.detectFlashSize();
        onStatus(eraseAll ? 'Erasing the whole flash, then writing…' : 'Writing… do not unplug the board.');
        await loader.writeFlash({
            fileArray: files,
            flashSize,
            flashMode: 'keep',
            flashFreq: 'keep',
            eraseAll,
            compress: true,
            calculateMD5Hash: md5,
            reportProgress: (index, written, length) => {
                const before = sizes.slice(0, index).reduce((sum, size) => sum + size, 0);
                onProgress((before + sizes[index] * (length ? written / length : 1)) / total);
            },
        });
        onStatus('Written and verified. Restarting the board…');
        await hardReset(transport);
        return { chip, version: manifest.bridge.version };
    } finally {
        try { await transport.disconnect(); } catch {}
    }
}

// RTS asserted with DTR released pulls EN via the dev-board auto-reset circuit (or its USB
// Serial/JTAG emulation). esptool-js 0.6.1's hard reset only releases RTS and leaves the chip
// in the flasher stub.
async function hardReset(transport) {
    await transport.setDTR(false);
    await transport.setRTS(true);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await transport.setRTS(false);
}

function safeInfo(port) {
    try { return port?.getInfo?.() ?? {}; } catch { return {}; }
}
