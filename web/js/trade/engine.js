// Follower side of a FireRed/LeafGreen link trade: block exchange, trade menu commands and
// standby rounds. Port of host/core/TradeEngine.cs.

import { DataError, join, u16, w16 } from './bytes.js';
import { Barrier, BlockReceive, BlockSend, isPlayer, playerBlock, readName, trainerCard, words } from './rfu.js';
import { Pk3, parse, toWire } from './pk3.js';

export const LINK = {
    READY: 0xaabb, SET_MONS: 0xdddd, INIT_BLOCK: 0xbbbb, START: 0xccdd, READY_FINISH: 0xabcd, CONFIRM_FINISH: 0xdcba,
    CANCEL: 0xeeaa, READY_CANCEL: 0xbbcc, PLAYER_CANCEL: 0xddee, BOTH_CANCEL: 0xeebb, PARTNER_CANCEL: 0xeecc,
};

const MAIL_SIZE = 36;

export function linkCommand(command, cursor = 0) {
    const b = new Uint8Array(20);
    w16(b, 0, command);
    w16(b, 2, cursor);
    return b;
}

export class TradeEngine {
    // party: six 80- or 100-byte PK3s or null. The game requires two Pokémon; the trade pool
    // passes a lower minimum, starts empty and holds the party until its Pokémon arrives.
    constructor(party, offered, { minimum = 2 } = {}) {
        const count = party.filter(Boolean).length;
        if (party.length !== 6 || !(offered >= 0 && offered <= 5) || count < minimum || (count > 0 && !party[offered]))
            throw new DataError('The party needs at least two Pokémon and a valid selected slot.');
        this.party = party.map((p) => (p ? toWire(p) : new Uint8Array(100)));
        this.offered = offered;
        this.sentCursor = -1;
        this.state = 0;
        this.barrier = new Barrier();
        this.hostInSeat = false;
        this.hostReady = false;
        this.hostExiting = false;
        this.done = false;
        this.commits = 0;
        this.hostName = null;
        this.received = null;
        this.animationFrames = 1935;
        this.receivers = [0, 1, 2, 3, 4].map(() => new BlockReceive());
        this.sender = null;
        this.pending = null;
        this.hostParty = new Uint8Array(600);
        this.sentParty = 0; this.hostBlocks = 0; this.settle = 0; this.hostCursor = -1; this.animWait = -1; this.reselect = -1;
        this.playerSent = false; this.cardSupplied = false; this.seatOver = false; this.menuComplete = false; this.ribbons = false;
        this.selected = false; this.confirmed = false; this.finishSent = false; this.pendingConfirm = false;
        this.offering = false;   // local player has made an offer
        this.declining = false; this.trading = false; this.cancelled = false; this.cancelAfterSend = false;
        this.cancelBarrier = false; this.returnBarrier = false; this.postCancel = false; this.saveBarriers = false; this.seam = false;
        this.postSeat = 0; this.seated = false;
        this.seatRound = 2;          // standby round after sitting down
        this.awaitingVerdict = false;
        this.partyHeld = false;
        this.heldRequest = null;
        this.mail = new Uint8Array(220);   // six 36-byte mail messages
        this.hostMail = null;        // Switch's mail
        this.hostRibbons = null;
        this.hostGame = 0;           // 0 FireRed, 1 LeafGreen
        this.firstEmits = 0; this.secondEmits = 0;
        this.third = { emits: 0, gap: 0 };
        this.fourth = { emits: 0, gap: 0 };
        this.onOpponentParty = null;    // (six Uint8Array or null, host name)
        this.onCommitted = null;        // (received data, slot)
        this.onLog = null;
        this.onNotice = null;
        this.onMenuOpen = null;
        this.onDecliningChanged = null;
        this.onHostChoice = null;       // (cursor); answer with verdict()
        this.onTradeStart = null;       // both confirmed; trade can no longer be cancelled
        this.onRoom = null;             // back in the room after a cancelled menu
    }

    get established() { return this.playerSent && this.hostName !== null; }
    get inSeatPhase() { return this.postCancel || !this.seatOver; }

    sit() {
        if (this.seated) return;
        this.seated = true;
        this.postSeat = 20;
        this.third = { emits: 0, gap: 0 };
        this.fourth = { emits: 0, gap: 0 };
        // Re-seat after a cancelled menu: reset menu state; standby rounds continue from the
        // current barrier count instead of 2.
        if (this.postCancel) {
            this.seatRound = this.barrier.count;
            this.postCancel = this.done = false;
            this.sentParty = this.hostBlocks = this.settle = 0;
            this.hostParty = new Uint8Array(600);
            this.hostCursor = -1;
            this.selected = this.ribbons = this.finishSent = this.pendingConfirm = this.confirmed = this.seam = false;
            this.menuComplete = this.offering = this.cancelled = this.cancelAfterSend = this.trading = this.awaitingVerdict = false;
            this.animWait = this.reselect = -1;
            this.state = 0;
            this.setDeclining(false, null);
            this.onLog?.('Sitting down again');
        }
    }

    // Back in the room after a cancelled menu. Sitting down again opens the next menu.
    returnToRoom() {
        this.done = this.postCancel = true;
        this.hostReady = this.seated = this.seatOver = false;
        this.onRoom?.();
    }

    // Switch's Pokémon at cursor, 100-byte wire format.
    hostMon(cursor) { return this.hostParty.slice(cursor * 100, (cursor + 1) * 100); }

    // Replaces a slot and its mail; takes effect at the next party exchange.
    setPartyMon(slot, bytes, mail = null) {
        const written = Boolean(mail) && mail.some((b) => b !== 0);
        this.party[slot] = toWire(bytes, written ? slot : 0xff);
        this.mail.fill(0, slot * MAIL_SIZE, (slot + 1) * MAIL_SIZE);
        if (written) this.mail.set(mail.subarray(0, MAIL_SIZE), slot * MAIL_SIZE);
    }

    // Delays party blocks while a Pokémon is incoming. Safe: the Switch waits and the board
    // repeats the request.
    holdParty() { this.partyHeld = true; }
    releaseParty() { this.partyHeld = false; }

    // Accept or refuse the Switch's choice after onHostChoice.
    verdict(accept) {
        if (!this.awaitingVerdict) return;
        this.awaitingVerdict = false;
        if (this.state === 3) this.pending = linkCommand(accept && !this.declining ? LINK.INIT_BLOCK : LINK.READY_CANCEL);
    }

    occupied(slot) { return this.party[slot].some((b) => b !== 0); }

    setDeclining(value, notice) {
        if (this.declining === value) return;
        this.declining = value;
        this.onLog?.(value ? 'Declining the trade' : 'Offering the trade again');
        if (notice) this.onNotice?.(notice);
        this.onDecliningChanged?.(value);
    }

    // The menu closes only when both sides send Cancel. The leader transmits Cancel but
    // never Ready, and keeps only the follower's latest Ready/Cancel until its player
    // answers, so a later block replaces an earlier one.
    decline() {
        if (this.declining || this.done || this.state === 4) return;
        this.setDeclining(true, this.state === 3 ? 'Cancelling the trade: answer the question on the Switch, then choose CANCEL there'
            : 'Cancelling the trade: choose CANCEL on the Switch to leave');
        this.awaitingVerdict = false;
        if (this.state === 3) this.pending = linkCommand(LINK.READY_CANCEL);
        else if (this.selected) this.pending = linkCommand(LINK.CANCEL);
    }

    offer(slot) {
        if (!(slot >= 0 && slot <= 5) || !this.occupied(slot) || this.done || this.cancelBarrier || this.returnBarrier || this.postCancel) return false;
        if (slot === this.offered && this.offering && !this.declining) return true;
        if (this.state === 3 || this.state === 4) {
            this.onNotice?.('The Switch is already confirming a trade. Offer again once it is done.');
            return false;
        }
        this.offered = slot;
        this.offering = true;
        this.onLog?.(`Offering slot ${slot + 1}`);
        this.setDeclining(false, null);
        if (this.selected) this.pending = linkCommand(LINK.READY, this.offered);
        return true;
    }

    begin(data) {
        this.receivers[1] = new BlockReceive();
        this.sender = new BlockSend(data);
    }

    // Five command slots per host frame: host's own, then each player's echo.
    feed(slots) {
        const completed = [], requests = [];
        let barrierSeen = false;
        for (let i = 0; i < Math.min(5, slots.length); i++) {
            const slot = slots[i];
            if (slot.length !== 14) throw new DataError('Invalid RFU command size');
            const word = u16(slot), op = word & 0xff00, value = u16(slot, 2);
            if (op === 0xa100) requests.push(value);
            else if (op === 0x8800) this.receivers[i].init(value);
            else if (op === 0x8900 && this.receivers[i].add(word & 31, slot.subarray(2, 14))) completed.push({ peer: i, count: this.receivers[i].count, data: this.receivers[i].data.slice() });
            if (!this.hostReady && op === 0xbe00) {
                if (!this.hostInSeat) { this.hostInSeat = true; this.barrier.reset(); this.onLog?.('Host entered the room'); }
                if ((value & 255) === 22) this.hostReady = true;
            }
            if (op === 0xbe00 && (value & 255) === 23) this.hostExiting = true;
            if (i !== 1 && (op === 0x6600 || op === 0x5f00) && !barrierSeen) { this.barrier.feed(op, value); barrierSeen = true; }
        }
        this.barrier.observe(barrierSeen);
        const hostBlock = completed.some((c) => c.peer === 0);
        if (this.saveBarriers && (requests.length > 0 || hostBlock)) { this.saveBarriers = false; this.barrier.reset(); }
        if (this.heldRequest !== null && !this.partyHeld && requests.length === 0) { requests.push(this.heldRequest); this.heldRequest = null; }
        for (const request of requests) {
            if (this.sender && !this.sender.done) continue;
            if (this.partyHeld && request < 2 && this.playerSent) { this.heldRequest = request; continue; }
            this.heldRequest = null;
            this.begin(this.requestBlock(request));
            this.onLog?.(`RFU request ${request}`);
        }
        for (const c of completed) if (c.peer === 0) this.hostBlock(c.count, c.data);
        this.settle = requests.length > 0 || hostBlock ? 0 : this.settle + 1;
    }

    requestBlock(type) {
        if (type === 2) { this.cardSupplied = true; return trainerCard(); }
        if (type === 3) return this.mail.slice();
        if (type === 4) return new Uint8Array(40);
        if (this.hostInSeat) this.seatOver = true;
        if (this.commits === 0 && !this.playerSent) { this.playerSent = true; return playerBlock(); }
        const block = this.sentParty++;
        return block < 3 ? join(this.party[block * 2], this.party[block * 2 + 1]) : new Uint8Array(200);
    }

    // Completed host block, identified by fragment count.
    hostBlock(count, data) {
        if (count === 2) { this.onCommand(u16(data), u16(data, 2)); return; }
        if (count === 4) { this.ribbons = true; this.hostRibbons = data.slice(0, 11); return; }
        if (count === 19) { this.hostMail = data.slice(0, 216); return; }
        if (count !== 17) return;
        if (this.hostInSeat) this.seatOver = true;
        if (isPlayer(data)) {
            this.hostName ??= readName(data.subarray(24, 32));
            this.hostGame = (u16(data, 16) & 0xff) === 5 ? 1 : 0;
            return;
        }
        if (this.hostBlocks >= 3) return;
        this.hostParty.set(data.subarray(0, 200), 200 * this.hostBlocks);
        this.hostBlocks++;
        if (this.hostBlocks === 3) {
            const parsed = [0, 1, 2, 3, 4, 5].map((i) => new Pk3(this.hostParty.subarray(i * 100, (i + 1) * 100)));
            for (const p of parsed) if (p.species !== 0 && !p.checksumValid) throw new DataError('Opponent PK3 checksum failed');
            this.onOpponentParty?.(parsed.map((p) => (p.species === 0 ? null : p.data.slice())), this.hostName ?? 'Switch');
            if (this.state === 0) this.state = 1;
        }
    }

    onCommand(command, cursor) {
        this.onLog?.(`LINKCMD ${command.toString(16).padStart(4, '0')} cursor=${cursor}`);
        switch (command) {
            case LINK.SET_MONS:
                if (cursor < 0 || cursor > 5) throw new DataError('Invalid opponent cursor');
                this.hostCursor = cursor;
                // Decline raced SetMons: answer the confirmation with ReadyCancel.
                if (this.state === 1 || this.state === 2) {
                    this.state = 3;
                    if (!this.confirmed) {
                        this.confirmed = true;
                        if (this.declining) this.pending = linkCommand(LINK.READY_CANCEL);
                        else if (this.onHostChoice) { this.awaitingVerdict = true; this.onHostChoice(cursor); }
                        else this.pending = linkCommand(LINK.INIT_BLOCK);
                    }
                }
                break;
            case LINK.CANCEL:
                if (this.done) break;
                this.offering = false;
                this.setDeclining(true, this.selected
                    ? 'The Switch asked to leave: choose CANCEL there once more'
                    : 'The Switch asked to leave the trade menu');
                if (this.menuComplete && (this.state === 1 || this.state === 2)) { this.selected = true; this.pending = linkCommand(LINK.CANCEL); }
                break;
            case LINK.START:
                if (!this.cancelled) { this.state = 4; this.animWait = this.animationFrames; this.trading = true; this.onTradeStart?.(); }
                break;
            case LINK.CONFIRM_FINISH:
                if (this.cancelled || !this.trading) break;
                if (this.finishSent) this.commit(); else this.pendingConfirm = true;
                break;
            case LINK.BOTH_CANCEL:
                this.state = 6; this.cancelled = true; this.cancelBarrier = true; this.barrier.initiate();
                break;
            case LINK.PLAYER_CANCEL:
            case LINK.PARTNER_CANCEL:
                // Both answers are spent; the player must choose again.
                if (command === LINK.PARTNER_CANCEL) { this.offering = false; this.setDeclining(false, 'The Switch chose a Pokémon while this side was cancelling, so that trade was called off. Choose again.'); }
                this.state = 1; this.selected = false; this.reselect = 60; this.pending = null; this.cancelAfterSend = false;
                this.confirmed = false; this.cancelled = false; this.hostCursor = -1;
                break;
        }
    }

    commit() {
        if (this.hostCursor < 0 || this.hostBlocks !== 3) throw new DataError('Trade confirmed without a complete opponent selection');
        const received = this.hostParty.slice(this.hostCursor * 100, (this.hostCursor + 1) * 100);
        // Traded slot = cursor of the last Ready sent; may differ from this.offered.
        const slot = this.sentCursor;
        this.received = parse(received).data.slice();
        this.party[slot] = received;
        this.commits++;
        this.trading = false;
        this.onCommitted?.(this.received, slot);
        this.saveBarriers = true;
        this.sentParty = this.hostBlocks = this.settle = 0;
        this.hostParty = new Uint8Array(600);
        this.hostCursor = -1;
        this.selected = this.ribbons = this.finishSent = this.pendingConfirm = this.confirmed = this.seam = false;
        this.menuComplete = this.offering = false;
        this.animWait = this.reselect = -1;
        this.state = 0;
    }

    timers() {
        if (this.reselect >= 0) this.reselect--;
        if (this.animWait >= 0 && this.animWait-- === 0) {
            this.pending = linkCommand(LINK.READY_FINISH);
            this.finishSent = true;
            if (this.pendingConfirm) { this.pendingConfirm = false; this.commit(); }
        }
    }

    pollSendDone() {
        this.timers();
        if (this.sender?.state === 2) this.tick();
    }

    // Command for this frame, as seven words.
    tick() {
        if (this.sender) {
            const result = this.sender.tick(this.receivers[1]);
            if (this.sender.done) {
                this.sender = null;
                if (this.cancelAfterSend && !this.done) { this.cancelAfterSend = false; this.state = 6; }
            }
            return result;
        }
        if (this.cancelBarrier) {
            if (this.barrier.active) return this.barrier.emit() ?? words(0);
            this.cancelBarrier = false; this.returnBarrier = true; this.barrier.initiate();
        }
        if (this.returnBarrier) {
            if (this.barrier.active) return this.barrier.emit() ?? words(0);
            this.returnBarrier = false;
            this.returnToRoom();
        }
        if (this.postCancel && this.barrier.active) return this.barrier.emit() ?? words(0);
        // Save rounds after a trade. The leader never starts one, and an evolution (with
        // move learning) can delay its answer indefinitely, so keep initiating until the
        // Switch requests the party.
        if (this.saveBarriers) {
            if (!this.barrier.active) this.barrier.initiate();
            return this.barrier.emit() ?? words(0);
        }
        this.timers();
        if (this.animWait >= 0 && !this.seam) { this.seam = true; this.barrier.initiate(); }
        if (!this.menuComplete && this.state === 1 && this.hostBlocks >= 3 && this.playerSent && this.sentParty >= 3 &&
            (this.ribbons || this.settle >= 600)) {
            this.menuComplete = true;
            this.onMenuOpen?.();
        }
        // Send nothing until offering or declining. The leader acts only after both players
        // answer, so silence lets the Switch player leave the menu with one cancel.
        if (!this.selected && this.menuComplete && this.state === 1 && this.reselect < 0 && this.pending === null &&
            (this.offering || this.declining)) {
            this.selected = true;
            this.pending = this.declining ? linkCommand(LINK.CANCEL) : linkCommand(LINK.READY, this.offered);
        }
        if (this.pending !== null) {
            const buffer = this.pending;
            this.pending = null;
            const command = u16(buffer);
            if (command === LINK.CANCEL || command === LINK.READY_CANCEL) this.cancelAfterSend = this.cancelled = true;
            else if (command === LINK.READY) { this.state = 2; this.cancelAfterSend = this.cancelled = false; this.sentCursor = u16(buffer, 2); }
            this.begin(buffer);
            return this.sender.tick(this.receivers[1]);
        }
        if (this.established && !this.hostInSeat) {
            if (!this.cardSupplied && this.firstEmits++ < 6) return words(0x6600, 0);
            if (this.cardSupplied && this.secondEmits++ < 6) return words(0x6600, 1);
            return words(0);
        }
        if (this.established && this.seated && !this.seatOver) {
            if (this.postSeat > 0) { this.postSeat--; return words(0); }
            if (this.barrier.hostCount < this.seatRound) return sustain(this.seatRound, this.third);
            if (this.barrier.hostCount < this.seatRound + 1) return sustain(this.seatRound + 1, this.fourth);
            return words(0);
        }
        return this.barrier.emit() ?? words(0);
    }
}

// Six standby frames, then a 60-frame pause.
function sustain(count, pace) {
    if (pace.emits < 6) { pace.emits++; pace.gap = 0; return words(0x6600, count); }
    if (++pace.gap >= 60) pace.emits = pace.gap = 0;
    return words(0);
}
