// Mystery Gift from this page to the Switch. The page leads a wireless group as a FireRed
// sharing a Wonder Card, which the Switch finds under Mystery Gift -> Wonder Cards -> Friend.
// RfuLeader runs the link; this runs the rest as the sharing game would (union_room.c,
// mystery_gift_server.c): the player exchange, one standby round, the Mystery Gift exchange
// (mystery-gift.js) and the close. Pacing follows pokeldn's MysteryGiftTiming, measured
// against the Switch.

import { leaderBeacon } from '../cable/leader.js';
import { MG_LINK, MysteryGiftError, WonderCardServer } from './mystery-gift.js';
import { SaveBackupServer } from './save-backup.js';
import { SaveRestoreServer } from './save-restore.js';
import { eventPayload } from './events.js';

const ACTIVITY_WONDER_CARD = 21;
// English FireRed, able to link nationally, with the National Pokédex and the game cleared.
const COMPATIBILITY = 2 | (1 << 7) | (1 << 8) | (1 << 9) | (4 << 10);
// "GBLINK": the group's name on the Switch and the sender it names.
const NAME = Uint8Array.of(0xc1, 0xbc, 0xc6, 0xc3, 0xc8, 0xc5, 0xff, 0xff);
const TRAINER_ID = 0x4742;
const VERSION_FIRERED = 4;
const LANGUAGE_ENGLISH = 2;
const LINK_PLAYER_BYTES = 200;
const GAME_FREAK = 'GameFreak inc.';
const BLOCK_REQ_LINK_PLAYER = 0;
// A request the Switch has not started to answer is asked again: another one while it
// answers could make it send twice.
const REREQUEST_FRAMES = 60;
const REREQUESTS = 3;

// The Switch misses a SEND_PLAYER_IDS sent on one frame only.
const PLAYER_IDS_FRAMES = 8;
// Each standby answer and close goes out on this many frames.
const ANSWER_FRAMES = 4;
// The Switch asks again after 60 frames when an answer is lost; one this recent is kept.
const STANDBY_RESEND_FRAMES = 60;
// The Switch drops the second block of a message sent while its standby round is still
// settling; this many quiet frames after the round, it takes them.
const CLIENT_READY_FRAMES = 20;
// A block that arrives before the Switch has taken the previous one is dropped unseen.
const BLOCK_GAP_FRAMES = 36;
const BLOCK_REPEAT = 2;
// The Switch queues each fragment it resends on top of what it sends every frame, and its
// queue (40) drains only while it has nothing to send: a block waits for it to go quiet, up
// to this many frames, so a lossy link cannot overflow it over a long exchange.
const QUIET_WAIT_FRAMES = 120;
// Nothing tells which fragment of the RAM script went missing, so it goes three times.
const RAM_SCRIPT_REPEAT = 3;
const CLOSE_RETRY_FRAMES = 60;
// Frames the room stays after the Switch closes its link, for it to finish and save.
const CLOSE_GRACE_FRAMES = 5 * 60;

const put16 = (b, at, v) => { b[at] = v & 0xff; b[at + 1] = (v >> 8) & 0xff; };

// The group the Switch lists under Wonder Cards -> Friend.
export function giftBeacon() {
    return leaderBeacon({ activity: ACTIVITY_WONDER_CARD, name: NAME, trainerId: TRAINER_ID, compatibility: COMPATIBILITY });
}

// struct LinkPlayerBlock: magic, struct LinkPlayer, magic, in a 200-byte block.
export function linkPlayerBlock() {
    const b = new Uint8Array(LINK_PLAYER_BYTES);
    for (let i = 0; i < GAME_FREAK.length; i++) {
        b[i] = GAME_FREAK.charCodeAt(i);
        b[44 + i] = GAME_FREAK.charCodeAt(i);
    }
    put16(b, 16, 0x4000 | VERSION_FIRERED);
    put16(b, 18, 0x8000);
    put16(b, 20, TRAINER_ID);
    b.set(NAME, 24);
    b[32] = 0x11;
    b[34] = 0x11;
    put16(b, 42, LANGUAGE_ENGLISH);
    return b;
}

const CHARSET = (() => {
    const map = new Map([[0x00, ' '], [0xab, '!'], [0xac, '?'], [0xad, '.'], [0xae, '-'], [0xb0, '…'],
        [0xb5, '♂'], [0xb6, '♀'], [0xb8, ','], [0xba, '/']]);
    for (let i = 0; i < 26; i++) {
        map.set(0xbb + i, String.fromCharCode(65 + i));
        map.set(0xd5 + i, String.fromCharCode(97 + i));
    }
    for (let i = 0; i < 10; i++) map.set(0xa1 + i, String(i));
    return map;
})();

function decodeName(bytes) {
    let name = '';
    for (const b of bytes) {
        if (b === 0xff) break;
        name += CHARSET.get(b) ?? '';
    }
    return name.trim();
}

function magicAt(bytes, at) {
    for (let i = 0; i < GAME_FREAK.length; i++) if (bytes[at + i] !== GAME_FREAK.charCodeAt(i)) return false;
    return bytes[at + GAME_FREAK.length] === 0;
}

// The Switch's player from its LinkPlayer block, or null if the block is not one.
export function readLinkPlayer(block) {
    if (block.length < 60 || !magicAt(block, 0) || !magicAt(block, 44)) return null;
    const japanese = (block[42] | (block[43] << 8)) === 1;
    return { name: japanese ? '' : decodeName(block.subarray(24, 32)), version: block[16] };
}

export class GiftSession {
    // leader: an RfuLeader on the board's host port.
    constructor({ leader, log = () => {} }) {
        this.leader = leader;
        this.log = log;
        this.event = null;            // the event the next Switch gets
        this.link = null;             // the Switch in the group now
        this.running = false;
        this.announced = false;       // 'joining' reported for the Switch now joining
        this.blocks = [];             // { data, repeat, sent } waiting to go out
        this.inFlight = null;         // the block whose frames are queued in the leader
        this.gap = 0;
        this.quietWait = 0;
        this.decision = null;
        this.onStatus = null;         // ({ stage, event, player, detail })
        this.onDecision = null;       // ({ reasons, game, event }), or null when withdrawn
        this.onResult = null;         // ({ outcome, event, player, game, message })
        leader.onJoined = () => this.joined();
        leader.onCommand = (words) => this.command(words);
        leader.onBlock = (count, data) => this.block(data);
        leader.onClosed = () => this.left();
        leader.onTick = () => this.tick();
    }

    status(stage, detail = {}) {
        this.onStatus?.({ stage, event: this.link?.event ?? this.event, player: this.link?.player ?? null, ...detail });
    }

    // The event for the next Switch; one being served keeps its own.
    setEvent(event) {
        this.event = event;
    }

    start() {
        if (!this.event) throw new Error('No event chosen.');
        this.running = true;
        this.open();
    }

    stop() {
        this.running = false;
        this.cancelDecision();
        const link = this.link;
        if (link) {
            link.server?.fail(new MysteryGiftError('Stopped.'));
            this.finish(link.result ?? { outcome: 'stopped' });
        }
        this.leader.close();
    }

    // Opens the group again, for the next Switch.
    open() {
        this.blocks = [];
        this.inFlight = null;
        this.gap = 0;
        this.quietWait = 0;
        this.announced = false;
        this.leader.open(giftBeacon());
        this.status('open');
    }

    // The board restarted: its room and the link in it are gone until it is back.
    restarted() {
        const link = this.link;
        if (link) {
            this.cancelDecision();
            link.server?.fail(new MysteryGiftError('The ESP32 board restarted.'));
            this.finish(link.result ?? { outcome: 'lost', stage: link.stage });
        }
        this.leader.close();
        if (this.running) this.status('restarting');
    }

    // ---- the Switch

    joined() {
        this.link = {
            event: this.event,
            stage: 'players',
            exchanged: false,         // the Switch's player block is in
            player: null,             // { name, version } from it, when readable
            requestAt: this.leader.ticks,
            rerequests: 0,
            playerSent: false,
            standby: null,            // count of the Switch's last standby round
            standbyAt: -Infinity,
            standbyDone: false,
            heardAt: this.leader.ticks,
            server: null,
            result: null,
            closeAt: 0,
            graceUntil: 0,
        };
        for (let i = 0; i < PLAYER_IDS_FRAMES; i++) this.leader.playerIds();
        this.leader.request(BLOCK_REQ_LINK_PLAYER);
    }

    command(words) {
        const link = this.link;
        if (!link) return;
        link.heardAt = this.leader.ticks;
        const op = words[0] & 0xff00;
        if (op === 0x6600) this.standby(words[1]);
        else if (op === 0x5f00) this.switchClosing();
    }

    standby(count) {
        const link = this.link;
        if (!link.exchanged || count === 0xffff) return;
        if (count === link.standby && this.leader.ticks - link.standbyAt < STANDBY_RESEND_FRAMES) return;
        link.standby = count;
        link.standbyAt = this.leader.ticks;
        for (let i = 0; i < ANSWER_FRAMES / 2; i++) this.leader.standby(count);
        if (link.stage === 'players') link.standbyDone = true;
    }

    block(data) {
        const link = this.link;
        if (!link) return;
        link.heardAt = this.leader.ticks;
        if (link.server) {
            link.server.block(data);
            return;
        }
        if (link.stage !== 'players' || link.exchanged) return;
        // A block asked for before the Switch's game filled it is stale; the Switch still
        // takes this side's, and its player only names it here.
        link.exchanged = true;
        link.player = readLinkPlayer(data);
        this.log(link.player ? `linked with ${link.player.name || 'the Switch'}` : 'linked with the Switch (its player block was unreadable)');
        this.queueBlock(linkPlayerBlock(), BLOCK_REPEAT, () => { link.playerSent = true; });
        this.status('linked');
    }

    // The Switch closes its link: after the exchange, or when it gave up.
    switchClosing() {
        const link = this.link;
        if (link.graceUntil) return;
        if (link.stage !== 'closing') {
            link.result ??= { outcome: 'lost', stage: link.stage };
            link.server?.fail(new MysteryGiftError('The Switch ended the link.'));
            this.close();
        }
        link.graceUntil = this.leader.ticks + CLOSE_GRACE_FRAMES;
    }

    left() {
        const link = this.link;
        if (link) {
            this.cancelDecision();
            link.server?.fail(new MysteryGiftError('The Switch left the group.'));
            this.finish(link.result ?? { outcome: 'lost', stage: link.stage });
        }
        if (this.running) this.open();
    }

    // ---- this side

    tick() {
        const leader = this.leader;
        if (!this.link && leader.joined && !this.announced) {
            this.announced = true;
            this.status('joining');
        }
        this.sendBlocks();
        const link = this.link;
        if (!link) return;
        if (link.stage === 'players' && !link.exchanged) this.repeatRequest();
        else if (link.stage === 'players' && link.playerSent && link.standbyDone && !leader.queued
            && leader.ticks - link.heardAt >= CLIENT_READY_FRAMES) {
            this.startServer();
        } else if (link.stage === 'closing') {
            if (link.graceUntil && leader.ticks >= link.graceUntil) {
                // The Switch has not left by itself: the board ends the link and restarts.
                this.finish(link.result ?? { outcome: 'lost', stage: 'closing' });
                leader.close();
                this.status('restarting');
            } else if (leader.ticks - link.closeAt >= CLOSE_RETRY_FRAMES) {
                this.sendClose();
            }
        }
    }

    repeatRequest() {
        const link = this.link, leader = this.leader;
        if (leader.ticks - link.requestAt < REREQUEST_FRAMES || link.rerequests >= REREQUESTS) return;
        if (leader.recv && !leader.recv.done) return;
        link.rerequests++;
        link.requestAt = leader.ticks;
        leader.request(BLOCK_REQ_LINK_PLAYER);
        this.log('the Switch has not sent its player: asking again');
    }

    // One block at a time, each after the gap the Switch needs to take the last one.
    sendBlocks() {
        const leader = this.leader;
        if (this.inFlight) {
            if (leader.queued) return;
            this.inFlight.sent?.();
            this.inFlight = null;
            this.gap = BLOCK_GAP_FRAMES;
        }
        if (this.gap > 0) { this.gap--; return; }
        if (!this.blocks.length || leader.queued) return;
        if (!leader.childQuiet && this.quietWait++ < QUIET_WAIT_FRAMES) return;
        this.quietWait = 0;
        this.inFlight = this.blocks.shift();
        leader.sendBlock(this.inFlight.data, this.inFlight.repeat);
    }

    queueBlock(data, repeat, sent = null) {
        this.blocks.push({ data, repeat, sent });
    }

    startServer() {
        const link = this.link;
        link.stage = 'gift';
        const Server = { backup: SaveBackupServer, restore: SaveRestoreServer }[link.event?.kind] ?? WonderCardServer;
        const server = link.server = new Server({
            save: link.event?.save,
            link: {
                sendBlock: (data, ident, sent = null) => {
                    if (this.link === link) this.queueBlock(data, ident === MG_LINK.RAM_SCRIPT ? RAM_SCRIPT_REPEAT : BLOCK_REPEAT, sent);
                },
            },
            payload: (game) => eventPayload(link.event, game),
            confirm: (reasons, game) => this.ask(reasons, game),
            log: this.log,
        });
        server.onStage = (stage, detail) => this.status(stage, { detail });
        server.run().then(
            (result) => {
                if (this.link !== link) return;
                link.result = result;
                this.close();
                this.status('closing', { result });
            },
            (error) => {
                if (this.link !== link) return;
                const message = error instanceof MysteryGiftError ? error.message : 'The Mystery Gift exchange failed.';
                this.log(message);
                link.result ??= { outcome: 'error', message };
                this.close();
            },
        );
    }

    close() {
        const link = this.link;
        if (link.stage === 'closing') return;
        link.stage = 'closing';
        this.blocks = [];
        this.sendClose();
    }

    sendClose() {
        const link = this.link;
        link.closeAt = this.leader.ticks;
        const count = link.standby === null ? 0 : (link.standby + 1) & 0xffff;
        for (let i = 0; i < ANSWER_FRAMES; i++) this.leader.closeLink(count);
        this.leader.echoCloseLink(count);
    }

    ask(reasons, game) {
        return new Promise((resolve) => {
            this.decision = resolve;
            this.onDecision?.({ reasons, game, event: this.link?.event ?? this.event });
        });
    }

    // The page's answer to onDecision: true sends the card anyway.
    decide(send) {
        const decision = this.decision;
        this.decision = null;
        decision?.(Boolean(send));
    }

    cancelDecision() {
        if (!this.decision) return;
        this.decision(false);
        this.decision = null;
        this.onDecision?.(null);
    }

    finish(result) {
        const link = this.link;
        this.link = null;
        this.announced = false;
        this.onResult?.({ event: link?.event ?? null, player: link?.player ?? null, ...result });
    }
}
