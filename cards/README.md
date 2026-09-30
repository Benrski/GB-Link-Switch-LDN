# GB-Link Team cards for the Switch

The GB-Link Team's Wonder Cards from
[gblink-wondercards](https://github.com/GB-Link/gblink-wondercards) (`tools/native-cards`),
built for the Nintendo Switch release of FireRed and LeafGreen (revision 10, English). The
web page sends them over Mystery Gift; `build.mjs` writes their payloads into
`web/js/gift/team.js`.

A payload is a Wonder Card, then the RAM script the deliveryman runs. Most scripts carry a
little ARM code, which uses the game's own routines and RAM, so each card is built for
each ROM from its addresses in `roms.mjs`. Every script checks the ROM header first; on any
other game the deliveryman says the gift doesn't work with it.

## Rebuilding

Needs Node.js and the arm-none-eabi binutils on `PATH`.

```
node cards/build.mjs
```

`roms.mjs` comes from pret's [pokefirered](https://github.com/pret/pokefirered) builds of the
Switch's ROMs, which match them byte for byte:

```
make firered_switch leafgreen_switch        # in a pokefirered checkout
node cards/rom-symbols.mjs <pokefirered dir>
```

## Differences from gblink-wondercards

- Only the Switch's FireRed (`BPRE 1.10`) and LeafGreen (`BPGE 1.10`); no Emerald cards.

The sources are GPL-3.0, like gblink-wondercards.
