// Six-slot party offered to the Switch. Persisted in localStorage; falls back to the
// bundled default party.

import { fromHex, toHex } from './bytes.js';
import { Pk3, parse } from './pk3.js';

const STORE = 'gblink-switch-party';
export const DEFAULT_PARTY = 'assets/party.json';

export class Party {
    constructor() {
        this.slots = [null, null, null, null, null, null];
        this.selected = 0;
    }

    get occupied() { return this.slots.filter(Boolean).length; }
    get canTrade() { return this.occupied >= 2 && Boolean(this.slots[this.selected]); }

    read(record) {
        const entries = record.slots;
        if (!Array.isArray(entries) || entries.length !== 6) throw new Error('A party record needs six slots.');
        this.slots = entries.map((entry) => (entry ? parse(fromHex(entry.toLowerCase())) : null));
        this.selected = Number(record.selected) || 0;
        if (!this.slots[this.selected]) this.selected = this.slots.findIndex(Boolean);
        if (this.selected < 0) this.selected = 0;
    }

    // Loads the saved party, else the bundled default.
    async load(fetchDefault = true) {
        const saved = localStorage.getItem(STORE);
        if (saved) {
            try { this.read(JSON.parse(saved)); return 'saved'; }
            catch { localStorage.removeItem(STORE); }
        }
        if (!fetchDefault) return 'empty';
        const response = await fetch(DEFAULT_PARTY, { cache: 'no-store' });
        if (!response.ok) return 'empty';
        this.read(await response.json());
        return 'default';
    }

    save() {
        try { localStorage.setItem(STORE, JSON.stringify(this.record())); } catch {}
    }

    record() {
        return { selected: this.selected, slots: this.slots.map((pk) => (pk ? toHex(pk.export()) : null)) };
    }

    export() { return this.slots.map((pk) => (pk ? pk.export() : null)); }

    set(index, pk) {
        this.slots[index] = pk;
        if (!this.slots[this.selected]) this.selected = this.slots.findIndex(Boolean);
        if (this.selected < 0) this.selected = 0;
        this.save();
    }

    select(index) {
        if (!this.slots[index]) return false;
        this.selected = index;
        this.save();
        return true;
    }

    // Stores a received Pokémon in the traded slot.
    receive(index, bytes) {
        this.slots[index] = parse(bytes);
        this.save();
    }
}

export function describe(pk) {
    const kind = pk.isEgg ? 'Egg' : pk.speciesName;
    const gender = pk.gender === 0 ? '♂' : pk.gender === 1 ? '♀' : '';
    return { name: pk.isEgg ? 'Egg' : pk.nickname || kind, kind, level: pk.isEgg ? '' : `Lv. ${pk.level}`, gender, shiny: pk.isShiny && !pk.isEgg };
}

export { Pk3 };
