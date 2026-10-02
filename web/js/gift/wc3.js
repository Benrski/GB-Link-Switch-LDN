// .wc3 files, the Wonder Card files of PKHeX's WC3 plugin and the Mystery Gift Tool: a Wonder
// Card and the RAM script the deliveryman runs, as the international games keep them in the
// save. A .wc3 of anyone's is sent to the Switch like the page's own cards.

import { PAYLOAD_SCRIPT_OFFSET, RAM_SCRIPT_BYTES, WONDER_CARD_BYTES } from './mystery-gift.js';

const WC3_BYTES = 0x58c;
const JAPANESE_WC3_BYTES = 0x4e4;
const CARD_AT = 4;                  // after the card's CRC16
// After the RAM script's CRC16, struct RamScriptData: magic, map group, map number, object,
// then the script.
const SCRIPT_DATA_AT = 0x1a4;
const RAM_SCRIPT_MAGIC = 51;

// The games' ValidateWonderCard limits.
const CARD_TYPE_COUNT = 3;
const SEND_TYPE_COUNT = 3;
const NUM_WONDER_BGS = 8;
const MAX_STAMP_CARD_STAMPS = 7;

const TITLE_AT = 10;
const TEXT_LENGTH = 40;
// Gen 3 text, enough for card titles: codes 0x00-0x2E, then 0xA1-0xF6.
const LATIN = ' ÀÁÂÇÈÉÊËÌ\0ÎÏÒÓÔŒÙÚÛÑßàá\0çèéêëì\0îïòóôœùúûñºª\0&+';
const COMMON = '0123456789!?.-\0…“”‘’♂♀¥,×/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz▶:ÄÖÜäöü';

export class Wc3Error extends Error {}

function textOf(bytes) {
    let text = '';
    for (const code of bytes) {
        if (code === 0xff) break;
        const char = code < LATIN.length ? LATIN[code] : COMMON[code - 0xa1];
        if (char && char !== '\0') text += char;
    }
    return text.replace(/\s+/g, ' ').trim();
}

// The payload a .wc3 holds, as the page sends it (the card, padding, then the script), and the
// card's title. A file whose card the games would refuse is refused here, with the reason.
export function readWc3(bytes) {
    if (bytes.length === JAPANESE_WC3_BYTES) {
        throw new Wc3Error('This .wc3 is for the Japanese games. This page sends Wonder Cards to the games of the other languages.');
    }
    if (bytes.length !== WC3_BYTES) {
        throw new Wc3Error(`This is not a .wc3 file: it has ${bytes.length} bytes, where a .wc3 has ${WC3_BYTES}.`);
    }
    const card = bytes.subarray(CARD_AT, CARD_AT + WONDER_CARD_BYTES);
    const flagId = card[0] | (card[1] << 8);
    const type = card[8] & 3;
    const bgType = (card[8] >> 2) & 0xf;
    const sendType = card[8] >> 6;
    if (!flagId || type >= CARD_TYPE_COUNT || sendType >= SEND_TYPE_COUNT || bgType >= NUM_WONDER_BGS
        || card[9] > MAX_STAMP_CARD_STAMPS) {
        throw new Wc3Error('This .wc3 holds no Wonder Card the games would accept.');
    }
    let script = new Uint8Array(0);
    if (bytes[SCRIPT_DATA_AT] === RAM_SCRIPT_MAGIC) {
        script = bytes.subarray(SCRIPT_DATA_AT + 4, SCRIPT_DATA_AT + 4 + RAM_SCRIPT_BYTES);
        let end = script.length;
        while (end > 0 && script[end - 1] === 0) end--;
        script = script.subarray(0, end);
    }
    const payload = new Uint8Array(PAYLOAD_SCRIPT_OFFSET + script.length);
    payload.set(card);
    payload.set(script, PAYLOAD_SCRIPT_OFFSET);
    return { payload, title: textOf(card.subarray(TITLE_AT, TITLE_AT + TEXT_LENGTH)), hasScript: script.length > 0 };
}

// The event for a .wc3 opened on the page. The Switch runs FireRed or LeafGreen, so it goes to
// either, with a warning when the file's name says it is for Emerald (as Project Pokémon's
// "E - …" files do).
export function wc3Event(bytes, fileName) {
    const { payload, title, hasScript } = readWc3(bytes);
    const emerald = /^E\s*-|\bemerald\b/i.test(fileName)
        && !/^(FL|FRLG|FR|LG)\s*-|\b(fire\s*red|leaf\s*green|frlg)\b/i.test(fileName);
    const quoted = /^“.*”$/.test(title) ? title : `“${title || 'untitled'}”`;
    return {
        id: 'wc3-file',
        label: fileName.replace(/\.wc3$/i, ''),
        description: [
            `Your file ${fileName}: the Wonder Card ${quoted}.`,
            emerald
                ? 'Its name says it is for Emerald, and the Switch runs FireRed or LeafGreen, where a card made for Emerald may not work.'
                : 'Only cards made for FireRed or LeafGreen work on the Switch.',
            hasScript ? '' : 'It has no script, so the deliveryman has nothing to hand over.',
        ].filter(Boolean).join(' '),
        payloads: { frlg: [payload] },
        emerald,
    };
}
