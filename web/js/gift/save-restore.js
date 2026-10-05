// Restores a whole save onto the Switch's FireRed or LeafGreen over Mystery
// Gift: the client installs its ROM's restore script (cards/saverestore.s),
// which reports where the chip's newest copy is, then takes the save a sector
// at a time, compressed, writes each sector beside that copy with the game's
// own sector write, reads it back and reports; the next sector goes once the
// report is in. With every sector in, it loads the save,
// and the exchange ends on a success the game saves after, which is also what
// makes the Switch keep its save file. Anything short of that ends on a
// message the game shows without saving.

import {
    CLI, CLIENT_SCRIPTS, MG_LINK, MG_LINK_BUFFER_SIZE, WonderCardServer, clientScript, parseGameData, romId,
} from './mystery-gift.js';
import { NOT_RESTORED, RESTORED, SAVE_SCRIPTS } from './save-payloads.js';
import { SAVE_BYTES, describeSave } from './save-backup.js';

export const RESTORE_ROMS = Object.keys(SAVE_SCRIPTS);

const SECTOR_BYTES = 0x1000;
const SECTORS = SAVE_BYTES / SECTOR_BYTES;
const OP_DATA = 1;
const OP_FINISH = 2;
const HEADER_BYTES = 12;
const SAVE_STATUS_OK = 1;
const CLI_MSG_BUFFER_SUCCESS = 13;
const CLI_MSG_BUFFER_FAILURE = 14;

// The tokens cards/saverestore.s reads: n < 0x80 then n + 1 bytes as they
// are, or n >= 0x80 then a byte repeated n - 0x80 + 3 times. One token per
// array, each with how many bytes it stands for.
export function deflate(bytes) {
    const tokens = [];
    for (let i = 0; i < bytes.length;) {
        let run = 1;
        while (i + run < bytes.length && run < 130 && bytes[i + run] === bytes[i]) run++;
        if (run >= 3) {
            tokens.push({ bytes: [0x80 + run - 3, bytes[i]], length: run });
            i += run;
            continue;
        }
        const start = i;
        while (i < bytes.length && i - start < 128) {
            if (i > start && i + 2 < bytes.length && bytes[i + 1] === bytes[i] && bytes[i + 2] === bytes[i]) break;
            i++;
        }
        tokens.push({ bytes: [i - start - 1, ...bytes.subarray(start, i)], length: i - start });
    }
    return tokens;
}

// A branch from where the client runs a message (the start of the decompression
// buffer) to the installed entry.
function branchWord(scripts) {
    return (0xea000000 | (((scripts.entry - (scripts.buffer + 8)) >> 2) & 0xffffff)) >>> 0;
}

function message(scripts, op, body = []) {
    const bytes = new Uint8Array(4 + 1 + body.length);
    new DataView(bytes.buffer).setUint32(0, branchWord(scripts), true);
    bytes[4] = op;
    bytes.set(body, 5);
    return bytes;
}

const SLOT_SECTORS = 14;
const FIRST_EXTRA_SECTOR = 2 * SLOT_SECTORS;
const SIGNATURE = 0x08012025;

// Where the chip's newest copy is, from the footers the restore script reads
// (12 bytes a sector: id, checksum, signature, counter): the slot whose 14
// sectors all carry the signature, the higher counter winning as in save.c.
export function chipNewest(footers) {
    const slots = [0, 1].map((slot) => {
        const ids = new Set();
        let counter = null;
        for (let i = 0; i < SLOT_SECTORS; i++) {
            const at = (slot * SLOT_SECTORS + i) * 12;
            if (u32(footers, at + 4) !== SIGNATURE) return null;
            ids.add(footers[at] | (footers[at + 1] << 8));
            counter = u32(footers, at + 8);
        }
        return ids.size === SLOT_SECTORS ? { slot, counter } : null;
    }).filter(Boolean);
    if (!slots.length) return null;
    return slots.reduce((a, b) => ((b.counter + 1) >>> 0 > (a.counter + 1) >>> 0 ? b : a));
}

// The sectors to write, in order, as { sector, bytes }: the save's newest whole
// copy in the slot beside the chip's newest one, its counter one past that
// copy's so that it loads (the game puts a counter's copy in slot counter % 2,
// which this keeps), then the last four sectors (Hall of Fame and the rest).
// The game takes a slot whose 14 sector ids all pass their checksums, whatever
// their counters, so old and new sectors could pass as a copy halfway: the old
// copy's sector of id 0 there is erased first and the new one written last, so
// the slot lacks it until the copy is whole, and the chip's own copy loads.
// footers: the chip's, as the restore script reads them.
export function sectorsToWrite(save, newest, footers) {
    const { slots } = describeSave(save);
    const from = slots[0].sound && (!slots[1].sound || slots[0].counter > slots[1].counter) ? 0 : 1;
    const counter = newest ? (newest.counter + 1) >>> 0 : 0;
    const to = counter % 2;
    const copy = [];
    for (let i = 0; i < SLOT_SECTORS; i++) {
        const bytes = save.slice((from * SLOT_SECTORS + i) * SECTOR_BYTES, (from * SLOT_SECTORS + i + 1) * SECTOR_BYTES);
        new DataView(bytes.buffer).setUint32(0xffc, counter, true);
        copy.push({ sector: to * SLOT_SECTORS + i, bytes, id: bytes[0xff4] | (bytes[0xff5] << 8) });
    }
    const out = [];
    for (let i = 0; i < SLOT_SECTORS; i++) {
        const at = (to * SLOT_SECTORS + i) * 12;
        if (u32(footers, at + 4) === SIGNATURE && (footers[at] | (footers[at + 1] << 8)) === 0) {
            out.push({ sector: to * SLOT_SECTORS + i, bytes: new Uint8Array(SECTOR_BYTES).fill(0xff) });
        }
    }
    out.push(...copy.filter((s) => s.id !== 0), ...copy.filter((s) => s.id === 0));
    for (let n = FIRST_EXTRA_SECTOR; n < SECTORS; n++) out.push({ sector: n, bytes: save.subarray(n * SECTOR_BYTES, (n + 1) * SECTOR_BYTES) });
    return out.map(({ sector, bytes }) => ({ sector, bytes }));
}

// Each sector to write as messages of at most 1 KB, the last marked to write it.
export function sectorMessages(save, scripts, newest, footers) {
    const sectors = [];
    for (const { sector, bytes } of sectorsToWrite(save, newest, footers)) {
        const messages = [];
        const tokens = deflate(bytes);
        let offset = 0;
        for (let i = 0; i < tokens.length;) {
            const start = offset;
            const body = [];
            while (i < tokens.length && HEADER_BYTES + body.length + tokens[i].bytes.length <= MG_LINK_BUFFER_SIZE) {
                body.push(...tokens[i].bytes);
                offset += tokens[i].length;
                i++;
            }
            const last = i === tokens.length;
            const data = message(scripts, OP_DATA, [sector, last ? 1 : 0, 0, start & 0xff, start >> 8, body.length & 0xff, body.length >> 8, ...body]);
            messages.push(data);
        }
        sectors.push({ sector, messages });
    }
    return sectors;
}

// Restores cut short, by game, player and file: { counter, done }. The copy goes beside
// the chip's newest one, which stays newest until the copy is whole, so a restore that
// finds the same newest copy goes on after the sectors already written and checked.
const unfinished = new Map();
function restoreKey(game, save) {
    let hash = 0;
    for (let i = 0; i < save.length; i += 4) hash = (Math.imul(hash, 31) + u32(save, i)) >>> 0;
    return `${game.gameCode} ${game.trainerId} ${Array.from(game.playerName).join(',')} ${hash}`;
}

const u32 = (bytes, at) => (bytes[at] | (bytes[at + 1] << 8) | (bytes[at + 2] << 16) | (bytes[at + 3] << 24)) >>> 0;

// The list entry: no card; the page adds the .sav as `save` before it starts.
export const RESTORE_EVENTS = [{
    id: 'save-restore',
    label: 'Restore a save (.sav file)',
    kind: 'restore',
    roms: RESTORE_ROMS,
    payloads: {},
    description: 'Writes a .sav file over the whole save of the Switch’s FireRed or LeafGreen: a backup from this page, or a save from PKHeX or an emulator. It goes beside the game’s newest save and checks every sector before the game loads it and saves; until then, the game keeps the save it had. Back up the save first.',
}];

export class SaveRestoreServer extends WonderCardServer {
    // save: the 128 KB .sav to write.
    constructor({ link, save, log = () => {} }) {
        super({ link, payload: () => null, confirm: async () => false, log });
        this.save = save;
    }

    async run() {
        this.stage('checking');
        this.send(MG_LINK.CLIENT_SCRIPT, CLIENT_SCRIPTS.sendGameData);
        const game = parseGameData(await this.receive(MG_LINK.GAME_DATA));
        this.stage('checked', game);
        if (!game.valid) return this.end('cant-accept', CLIENT_SCRIPTS.cantAccept, game);
        const scripts = SAVE_SCRIPTS[romId(game)];
        if (!scripts) return this.end('unsupported', CLIENT_SCRIPTS.cantAccept, game);
        if (this.save.length !== SAVE_BYTES || !describeSave(this.save).sound) {
            return this.finish(false, game, { reason: 'unsound' });
        }

        // Installed, the script reports the chip's sector footers.
        const reporting = (ident) => [[CLI.RECV, ident], [CLI.LOAD_TOSS_RESPONSE], [CLI.RUN_BUFFER_SCRIPT], [CLI.SEND_LOADED],
            [CLI.RECV, MG_LINK.CLIENT_SCRIPT], [CLI.COPY_RECV]];
        this.stage('restoring', { done: 0, total: SLOT_SECTORS + SECTORS - FIRST_EXTRA_SECTOR });
        this.send(MG_LINK.CLIENT_SCRIPT, clientScript(reporting(MG_LINK.RAM_SCRIPT)));
        this.send(MG_LINK.RAM_SCRIPT, scripts.restore);
        const footers = await this.receive(MG_LINK.RESPONSE);
        const newest = chipNewest(footers);
        const counter = newest ? (newest.counter + 1) >>> 0 : 0;
        const key = restoreKey(game, this.save);
        const earlier = unfinished.get(key);
        // Going on, the plan is the first attempt's: the slot written to has changed since.
        const kept = earlier?.counter === counter ? earlier : { counter, done: 0, sectors: sectorMessages(this.save, scripts, newest, footers) };
        unfinished.set(key, kept);
        const { sectors } = kept;
        if (kept.done) this.log(`going on with the restore after ${kept.done} sectors`);
        this.stage('restoring', { done: kept.done, total: sectors.length });

        // A sector at a time: its messages, then the client's report once written.
        for (const [i, { sector, messages }] of sectors.entries()) {
            if (i < kept.done) continue;
            const passes = messages.slice(1).flatMap(() => [[CLI.RECV, MG_LINK.NEWS], [CLI.RUN_BUFFER_SCRIPT]]);
            this.send(MG_LINK.CLIENT_SCRIPT, clientScript([...passes, ...reporting(MG_LINK.NEWS)]));
            for (const bytes of messages) this.send(MG_LINK.NEWS, bytes);
            const failed = u32(await this.receive(MG_LINK.RESPONSE), 0);
            if (failed) {
                this.log(`the save's sector ${sector} did not write (${failed.toString(16)})`);
                unfinished.delete(key);
                return this.finish(false, game, { failed });
            }
            kept.done = i + 1;
            this.stage('restoring', { done: i + 1, total: sectors.length });
        }

        this.send(MG_LINK.CLIENT_SCRIPT, clientScript(reporting(MG_LINK.NEWS)));
        this.send(MG_LINK.NEWS, message(scripts, OP_FINISH));
        const status = await this.receive(MG_LINK.RESPONSE);
        const failed = status.length >= 8 ? u32(status, 0) : 0xffffffff;
        const loaded = status.length >= 8 ? status[4] : 0xff;
        const ok = failed === 0 && loaded === SAVE_STATUS_OK;
        if (!ok) this.log(`the game could not load the save (sectors failed ${failed.toString(16)}, load ${loaded})`);
        unfinished.delete(key);
        return this.finish(ok, game, { failed, loaded });
    }

    async finish(ok, game, detail) {
        this.send(MG_LINK.CLIENT_SCRIPT, clientScript([
            [CLI.RECV, MG_LINK.DYNAMIC_MSG], [CLI.COPY_MSG], [CLI.SEND_READY_END],
            [CLI.RETURN, ok ? CLI_MSG_BUFFER_SUCCESS : CLI_MSG_BUFFER_FAILURE],
        ]));
        this.send(MG_LINK.DYNAMIC_MSG, ok ? RESTORED : NOT_RESTORED);
        await this.receive(MG_LINK.READY_END);
        return { outcome: ok ? 'restored' : 'restore-failed', game, ...detail };
    }
}
