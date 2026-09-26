// prod.keys entries stored by the bridge firmware. The file is parsed locally; other entries
// are neither kept nor sent.

export const REQUIRED_KEYS = [
    'aes_kek_generation_source',
    'aes_key_generation_source',
    'master_key_00',
    'master_key_12',
];

// Returns { keys: {name: hex}, missing: [names], malformed: [names] }.
export function parseProdKeys(text) {
    const found = {};
    const malformed = [];
    for (const line of text.split(/\r?\n/)) {
        const at = line.indexOf('=');
        if (at < 0) continue;
        const name = line.slice(0, at).trim().toLowerCase();
        if (!REQUIRED_KEYS.includes(name)) continue;
        const value = line.slice(at + 1).trim().toLowerCase();
        if (/^[0-9a-f]{32}$/.test(value)) found[name] = value;
        else malformed.push(name);
    }
    const missing = REQUIRED_KEYS.filter((name) => !(name in found) && !malformed.includes(name));
    return { keys: found, missing, malformed };
}

// "LDN_KEYS kek=1 gen=1 master00=1 master12=1 protocol1=1 protocol3=1" -> flags
export function parseKeyStatus(line) {
    const flags = {};
    for (const part of line.split(/\s+/).slice(1)) {
        const [name, value] = part.split('=');
        if (name) flags[name] = value === '1';
    }
    flags.complete = ['kek', 'gen', 'master00', 'master12', 'protocol1', 'protocol3'].every((k) => flags[k]);
    return flags;
}
