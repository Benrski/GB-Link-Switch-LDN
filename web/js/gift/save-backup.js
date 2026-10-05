// Backs up the save of the Switch's FireRed or LeafGreen over Mystery Gift: the
// client runs its ROM's backup script (cards/savebackup.s) once per pass of its client
// script, and each pass sends the next stretch of the 128 KB save chip,
// compressed into a message of up to 1 KB. The exchange ends with a message of
// the page's own, which the game shows without saving, so the backup leaves the
// save as it was. A backup the link cut short is kept, and the same game's next
// backup goes on from where it stopped.

import {
    CLI, CLIENT_SCRIPTS, MG_LINK, WonderCardServer, clientScript, parseGameData, romId,
} from './mystery-gift.js';
import { BACKED_UP, SAVE_SCRIPTS } from './save-payloads.js';

export const SAVE_BYTES = 0x20000;
// Passes per client script: each takes 24 of its 1024 bytes.
const MAX_PASSES = 32;
const CLI_MSG_BUFFER_FAILURE = 14;

export const BACKUP_ROMS = Object.keys(SAVE_SCRIPTS);

// Backups cut short, by game and player: { save, at }.
const unfinished = new Map();
const playerKey = (game) => `${game.gameCode} ${game.trainerId} ${Array.from(game.playerName).join(',')}`;

// How far a game's unfinished backup got, in bytes, or 0.
export function unfinishedBackup(game) {
    return game ? unfinished.get(playerKey(game))?.at ?? 0 : 0;
}

const u16 = (bytes, at) => bytes[at] | (bytes[at + 1] << 8);
const u32 = (bytes, at) => (bytes[at] | (bytes[at + 1] << 8) | (bytes[at + 2] << 16) | (bytes[at + 3] << 24)) >>> 0;

function passesScript(count) {
    const passes = [];
    for (let i = 0; i < count; i++) passes.push([CLI.LOAD_TOSS_RESPONSE], [CLI.RUN_BUFFER_SCRIPT], [CLI.SEND_LOADED]);
    return clientScript([[CLI.RECV, MG_LINK.RAM_SCRIPT], ...passes, [CLI.RECV, MG_LINK.CLIENT_SCRIPT], [CLI.COPY_RECV]]);
}

// One message's tokens onto `save` from `at`: n < 0x80 is followed by n + 1
// bytes as they are, n >= 0x80 by a byte repeated n - 0x80 + 3 times. Returns
// where the next message goes on.
export function inflate(tokens, save, at) {
    for (let i = 0; i < tokens.length;) {
        const n = tokens[i++];
        const length = n < 0x80 ? n + 1 : n - 0x80 + 3;
        if (at + length > save.length || i + (n < 0x80 ? length : 1) > tokens.length) throw new Error('The Switch sent a save block that does not fit.');
        if (n < 0x80) {
            save.set(tokens.subarray(i, i + length), at);
            i += length;
        } else {
            save.fill(tokens[i++], at, at + length);
        }
        at += length;
    }
    return at;
}

const SECTOR_BYTES = 0x1000;
const SECTOR_DATA = 0xf80;
const SECTORS_PER_SLOT = 14;
const SIGNATURE = 0x08012025;

// Whether a sector's checksum (save.c CalculateChecksum) holds over its data,
// whose size depends on the sector, the game and its language: some size, in
// steps of 4 bytes, up to the whole data area.
function checksumHolds(save, at) {
    const want = u16(save, at + 0xff6);
    let sum = 0;
    for (let i = 0; i < SECTOR_DATA; i += 4) {
        sum = (sum + u32(save, at + i)) >>> 0;
        if ((((sum >>> 16) + sum) & 0xffff) === want) return true;
    }
    return false;
}

// What a save holds: each slot's 14 sectors whole, and its counter.
export function describeSave(save) {
    const slots = [0, 1].map((slot) => {
        const ids = new Set();
        let counter = null;
        let sound = true;
        for (let i = 0; i < SECTORS_PER_SLOT; i++) {
            const at = (slot * SECTORS_PER_SLOT + i) * SECTOR_BYTES;
            const id = u16(save, at + 0xff4);
            const good = u32(save, at + 0xff8) === SIGNATURE && checksumHolds(save, at) && id < SECTORS_PER_SLOT;
            if (!good) { sound = false; continue; }
            ids.add(id);
            const count = u32(save, at + 0xffc);
            if (counter !== null && count !== counter) sound = false;
            counter = count;
        }
        return { sound: sound && ids.size === SECTORS_PER_SLOT, counter };
    });
    const sound = slots.filter((slot) => slot.sound);
    return { slots, sound: sound.length > 0, counter: sound.length ? Math.max(...sound.map((slot) => slot.counter)) : null };
}

// The list entry: no card, the backup instead.
export const SAVE_EVENTS = [{
    id: 'save-backup',
    label: 'Back up the save (.sav file)',
    kind: 'backup',
    roms: BACKUP_ROMS,
    payloads: {},
    description: 'Copies the whole save of the Switch’s FireRed or LeafGreen to this page, as a .sav file for PKHeX or an emulator. Nothing on the Switch changes: the game shows a message and does not save. It takes a few minutes; keep the Switch near the board.',
}];

export class SaveBackupServer extends WonderCardServer {
    constructor({ link, log = () => {} }) {
        super({ link, payload: () => null, confirm: async () => false, log });
    }

    async run() {
        this.stage('checking');
        this.send(MG_LINK.CLIENT_SCRIPT, CLIENT_SCRIPTS.sendGameData);
        const game = parseGameData(await this.receive(MG_LINK.GAME_DATA));
        this.stage('checked', game);
        if (!game.valid) return this.end('cant-accept', CLIENT_SCRIPTS.cantAccept, game);
        const scripts = SAVE_SCRIPTS[romId(game)];
        if (!scripts) return this.end('unsupported', CLIENT_SCRIPTS.cantAccept, game);

        const key = playerKey(game);
        const kept = unfinished.get(key) ?? { save: new Uint8Array(SAVE_BYTES), at: 0 };
        unfinished.set(key, kept);
        const { save } = kept;
        const total = SAVE_BYTES / 1024;
        const start = kept.at;
        let at = start;
        let passes = 0;
        if (start) this.log(`going on with the backup from ${Math.floor(start / 1024)} KB`);
        const code = scripts.backup.slice();
        new DataView(code.buffer).setUint32(4, start, true);
        this.stage('backing-up', { done: Math.floor(at / 1024), total });
        while (at < SAVE_BYTES) {
            // As many passes as the rest should take at the pace so far, and one more.
            const count = passes ? Math.min(MAX_PASSES, Math.ceil(((SAVE_BYTES - at) * passes) / (at - start)) + 1) : MAX_PASSES;
            this.send(MG_LINK.CLIENT_SCRIPT, passesScript(count));
            this.send(MG_LINK.RAM_SCRIPT, code);
            for (let i = 0; i < count; i++) {
                const tokens = await this.receive(MG_LINK.RESPONSE);
                // Past the end, a pass answers with its 4-byte word.
                const before = at;
                if (at < SAVE_BYTES) kept.at = at = inflate(tokens, save, at);
                passes += 1;
                // The whole save is in: the page offers it now, whatever becomes of the
                // exchange's ending.
                const whole = before < SAVE_BYTES && at >= SAVE_BYTES ? { save: save.slice(), summary: describeSave(save) } : {};
                this.stage('backing-up', { done: Math.floor(at / 1024), total, ...whole });
            }
        }

        this.send(MG_LINK.CLIENT_SCRIPT, clientScript([
            [CLI.RECV, MG_LINK.DYNAMIC_MSG],
            [CLI.COPY_MSG],
            [CLI.SEND_READY_END],
            [CLI.RETURN, CLI_MSG_BUFFER_FAILURE],
        ]));
        this.send(MG_LINK.DYNAMIC_MSG, BACKED_UP);
        await this.receive(MG_LINK.READY_END);
        unfinished.delete(key);
        return { outcome: 'backed-up', game, save, summary: describeSave(save) };
    }
}
