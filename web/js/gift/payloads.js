// Payload encoding for the event files: a Wonder Card (332 bytes), 4 bytes of
// padding, then the RAM script that goes with it.

export function decodeBase64(text) {
    const binary = atob(text.replace(/\s+/g, ''));
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
    return out;
}

// FireRed's payload for the Switch, and each other ROM's as runs of [u16
// offset, u8 length, bytes] that differ from it.
export function romPayloads(base, patches) {
    const payloads = { 'BPRE 1.10': [base] };
    for (const [rom, diff] of Object.entries(patches)) {
        const bytes = Uint8Array.from(base);
        for (let at = 0; at < diff.length; at += 3 + diff[at + 2]) {
            bytes.set(diff.subarray(at + 3, at + 3 + diff[at + 2]), diff[at] | (diff[at + 1] << 8));
        }
        payloads[rom] = [bytes];
    }
    return payloads;
}
