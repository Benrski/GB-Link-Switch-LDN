// Sprite URLs from the PokeAPI sprite collection (FireRed/LeafGreen artwork).

const BASE = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon';
const GAME = `${BASE}/versions/generation-iii/firered-leafgreen`;
const UNOWN_FORMS = [...'abcdefghijklmnopqrstuvwxyz', 'exclamation', 'question'];

export function spriteUrl(pk) {
    if (pk.isEgg) return `${BASE}/egg.png`;
    if (!pk.species) return null;
    const shiny = pk.isShiny ? 'shiny/' : '';
    if (pk.species === 201) return `${GAME}/${shiny}201-${UNOWN_FORMS[pk.form] ?? 'a'}.png`;
    return `${GAME}/${shiny}${pk.species}.png`;
}

// Non-shiny fallback; some shiny sprites are missing.
export function spriteFallbackUrl(pk) {
    if (!pk.species || pk.isEgg) return null;
    if (pk.species === 201) return `${GAME}/201-${UNOWN_FORMS[pk.form] ?? 'a'}.png`;
    return `${GAME}/${pk.species}.png`;
}
