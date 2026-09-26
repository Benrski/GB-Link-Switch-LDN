// Flashes the GB-Link adapter (RP2040) over WebUSB with picoflash. Requires the USB bootloader
// ("RP2 Boot"). Firmware 2.1.2+ enters it on command; older firmware needs BOOTSEL at plug-in.

import { Picoboot } from '../vendor/picoflash/picoboot.js';
import { Target } from '../vendor/picoflash/target.js';
import { uf2ToFlashBuffer } from '../vendor/picoflash/uf2.js';
import { BOOTROM_VENDOR_ID } from './gblink.js';

const SECTOR = 4096;
const ERASE_STEP = 16 * SECTOR;
const WRITE_STEP = 4 * SECTOR;
const ERASE_SHARE = 0.3;      // fraction of the progress bar
const REBOOT_DELAY_MS = 500;

export function parseUf2(bytes) {
    const image = uf2ToFlashBuffer(bytes);
    const padded = new Uint8Array(Math.ceil(image.data.length / SECTOR) * SECTOR).fill(0xff);
    padded.set(image.data);
    return { address: image.address, data: padded };
}

// Needs a user gesture. The chooser only renews permission. Linux can list several stale
// "RP2 Boot" entries for one board, so each granted bootloader is tried until one opens.
export async function chooseBootloader() {
    await Picoboot.requestDevice([new Target('RP2040')]);
    for (let attempt = 0; attempt < 3; attempt++) {
        const stale = [];
        for (const picoboot of (await Picoboot.getDevices([new Target('RP2040')])) ?? []) {
            try {
                await picoboot.connect();
                for (const other of stale) { try { await other.device?.forget?.(); } catch {} }
                return picoboot;
            } catch {
                await release(picoboot);
                stale.push(picoboot);
            }
        }
        await sleep(400);
    }
    throw new Error('The adapter could not be opened. If several "RP2 Boot" entries are listed, pick another one.');
}

export function bootloaderFrom(device) {
    return Picoboot.fromDevice(device);
}

export async function flashAdapter(picoboot, image, { onStatus = () => {}, onProgress = () => {} } = {}) {
    try {
        const connection = await connectWithRetry(picoboot);
        await connection.resetInterface();
        await connection.exitXip();

        onStatus('Erasing…');
        for (let at = 0; at < image.data.length; at += ERASE_STEP) {
            await connection.flashErase(image.address + at, Math.min(ERASE_STEP, image.data.length - at));
            onProgress(ERASE_SHARE * Math.min(1, (at + ERASE_STEP) / image.data.length));
        }
        onStatus('Writing… do not unplug the adapter.');
        for (let at = 0; at < image.data.length; at += WRITE_STEP) {
            await connection.flashWrite(image.address + at, image.data.subarray(at, at + WRITE_STEP));
            onProgress(ERASE_SHARE + (1 - ERASE_SHARE) * Math.min(1, (at + WRITE_STEP) / image.data.length));
        }
        onStatus('Written. Restarting the adapter…');
        try { await connection.reboot(REBOOT_DELAY_MS); } catch {}   // link drops on reboot
    } finally {
        await release(picoboot);
    }
    await forgetBootloaders();
}

// The bootloader's device node may not be openable right after enumeration.
async function connectWithRetry(picoboot) {
    for (let attempt = 0; ; attempt++) {
        try {
            return await picoboot.connect();
        } catch (error) {
            const transient = error?.name === 'SecurityError' || /access denied/i.test(error?.message ?? '');
            await release(picoboot);
            if (!transient || attempt >= 3) throw error;
            await sleep(400);
        }
    }
}

// disconnect() only closes an established connection. A partly failed connect() leaves the
// device open, and an open handle across a board restart lingers as a phantom entry.
async function release(picoboot) {
    try { await picoboot.disconnect(); } catch {}
    try { if (picoboot.device?.opened) await picoboot.device.close(); } catch {}
}

// Bootloader grants are stale once the board has left it.
async function forgetBootloaders() {
    try {
        for (const device of await navigator.usb.getDevices()) {
            if (device.vendorId === BOOTROM_VENDOR_ID) { try { await device.forget?.(); } catch {} }
        }
    } catch {}
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
