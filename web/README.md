# Web client

The page at <https://switch.gblink.io>. It installs the firmware on both boards, stores
the Switch keys on the ESP32, and then either carries the link between the boards or
trades with the Switch by itself. It is a plain static site with no build step and no
server.

## Two modes

Pick one at the top of the page, or open `#gba` or `#switch` directly.

**GBA to Switch** (ESP32 board + GB-Link adapter)

1. **ESP32 board:** install the firmware and drop your `prod.keys` on the page.
2. **GB-Link adapter:** install the wireless adapter firmware.
3. **Play:** wire the boards together, or leave both on USB and let the page pass the
   traffic between them.

**PC to Switch** (ESP32 board only)

1. **ESP32 board:** the same as above.
2. **Trade:** *Wonder Trade* with the pool at <https://pokemon.gblink.io>, or *PK3
   files* from a party kept in your browser. `assets/party.json` is the party a first
   visit starts with.

The page never offers a Pokémon on its own. The Switch never tells the other side what
its player picked, so the page waits for you to choose or press *Accept trade*.

Keep the tab visible while playing. Browsers slow down hidden tabs, and the game drops a
partner that stops answering.

The keys stay on your computer and the board. The page reads the four values it needs
from `prod.keys`, sends them to the board over USB, and does not keep or upload them.
The board never sends them back.

## Running it locally

USB access only works over `https://` or from `localhost`:

```
python3 -m http.server -d web 8000
```

Then open <http://localhost:8000> in Chrome or Edge on a computer.

| Browser | ESP32 board | GB-Link adapter |
| --- | --- | --- |
| Chrome, Edge (desktop) | yes | yes |
| Firefox 151 and later | yes | serial only; install its firmware by hand |
| Safari, phones | no | no |

On Linux:

- Add yourself to the serial group (`dialout`, or `uucp` on Arch).
- The adapter needs udev rules for WebUSB. Run `scripts/setup-linux-permissions.sh`
  from the GB-Link firmware repository.
- If Chrome says the port was lost right after you used `esptool.py` or `idf.py`,
  unplug the board and plug it back in.

## Firmware images

`firmware/` holds the images the page installs, listed in `firmware/manifest.json`.
Refresh them after a build with:

```
firmware/tools/package_web.py
```

## Code

| File | |
| --- | --- |
| `js/app.js` | the page |
| `js/esp.js`, `js/wire.js` | talking to the ESP32 firmware |
| `js/gblink.js` | talking to the GB-Link adapter |
| `js/bridge.js` | passing traffic between the two boards |
| `js/flash-esp.js`, `js/flash-pico.js` | installing firmware |
| `js/keys.js` | reading `prod.keys` |
| `js/trade/` | trading without a GBA |

## Tests

These run without any hardware:

```
node web/tests/run.mjs            # framing and the board connection
node web/tests/trade.mjs          # trade code against the C# host
node web/tests/session-test.mjs   # whole trades against a stand-in Switch
```

## Third-party code

- `vendor/esptool-js`: [esptool-js](https://github.com/espressif/esptool-js) 0.6.1,
  Apache-2.0
- `vendor/picoflash`: [picoflash](https://github.com/picoflash/picoflash), MIT,
  © Piers Finlayson
