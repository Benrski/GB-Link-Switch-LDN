# Bridge firmware

Firmware for the ESP32 board. It joins the Switch's local wireless like a second Switch
(or hosts the room when the GBA leads) and passes the game's traffic to a GB-Link
adapter running the wireless adapter mode. Once flashed and given its keys, it needs no
computer.

The [web client](../web/README.md) installs it and stores the keys, so most people never
need this page.

## Boards

One source tree (`common/`) builds for four chips. The ESP32-S3 is the recommended one.

| Folder | Console | TX, to GB-Link GP9 | RX, to GB-Link GP8 |
| --- | --- | --- | --- |
| `ESP32` | USB-UART chip, 921600 baud | GPIO17 (TX2) | GPIO16 (RX2) |
| `ESP32-S3` | native USB | GPIO2 | GPIO1 |
| `ESP32-C6` | native USB | GPIO2 | GPIO1 |
| `ESP32-C3` | native USB | GPIO5 | GPIO4 |

Connect ground to ground as well. If the link stays silent, the two data wires are
probably swapped: `LDN_PICO_SWAP` swaps them in software until the next restart.

Tested boards: Seeed Studio XIAO ESP32-S3 (attach its antenna), ESP32-S3-N16R8,
M5Stack AtomS3, Seeed Studio XIAO ESP32-C6, a DOIT ESP32 DEVKIT V1 and an ESP32-C3
board. On the XIAO ESP32-C6, `LDN_ANTENNA 0|1` picks the onboard or external antenna.

## Building

The build is pinned to ESP-IDF v6.1 (commit `fff9895c82d744c7237be8847347bdd1b07c6643`),
because the firmware uses a private part of the Wi-Fi driver.

```
tools/build.sh ESP32-S3
tools/build.sh ESP32-S3 flash /dev/ttyACM0
```

To flash with another tool, write these three files from the build folder:

| Address | File |
| --- | --- |
| `0x0` (`0x1000` on the original ESP32) | `bootloader/bootloader.bin` |
| `0x8000` | `partition_table/partition-table.bin` |
| `0x10000` | `ldn_bridge_<chip>.bin` |

`tools/package_web.py` copies the built images into the web client.

## Keys

The board needs four keys from your Switch's `prod.keys`. They are stored on the board,
not in the firmware, and survive reflashing (but not a full erase). The web client sends
them for you; by hand:

```
LDN_KEY aes_kek_generation_source <32 hex>
LDN_KEY aes_key_generation_source <32 hex>
LDN_KEY master_key_00 <32 hex>
LDN_KEY master_key_12 <32 hex>
LDN_KEYS
```

`LDN_KEYS` shows which keys are stored. It never prints them.

## How it works

- The board only joins or hosts a room while a GB-Link adapter (or the web client) is
  connected, so a board that is just plugged into a PC stays out of the way.
- **Switch leads:** the board joins the Switch's room and shows it to the GBA as a
  wireless group.
- **GBA leads:** the board hosts a room that looks like a Switch's, and the Switch
  joins it.
- The link between the two games is lockstep and the wireless adds lag, so
  `trade_shim.c` smooths over the differences: the Switch version runs one extra
  standby step after a trade, lost messages are resent, and old d-pad reports are
  dropped when they pile up so walking stays responsive.
- When a session ends, the board restarts and is ready again in about ten seconds.

## Console commands

| Command | |
| --- | --- |
| `LDN_INFO` | firmware version and chip |
| `LDN_STATUS`, `LDN_BRIDGE_STATUS` | link state and counters |
| `LDN_SHIM_LOG` | log of the last sessions, kept across restarts |
| `LDN_RF` | signal strength of the room |
| `LDN_PICO_STATUS`, `LDN_PICO_PROBE`, `LDN_PICO_SWAP` | the wires to the GB-Link |
| `LDN_PICO_BOOTSEL` | restart the GB-Link into its bootloader for reflashing |
| `LDN_BRIDGE_STOP`, `LDN_BRIDGE_START` | stop or start the bridge |
| `LDN_ADAPTER host\|uart` | adapter on the wires, or carried over USB by the web client |

Some serial tools reset the board when they open the port (DTR). Open it with DTR high
and RTS low. The original ESP32's console runs at 921600 baud.

## Tests

`tools/` has tests that run on a PC with no hardware: `trade_shim_test.c`,
`pia_host_test.c`, `ldn_host_test.c` and `pico_link_test.c`. The build command is at the
top of each file.

## Troubleshooting

- **The GBA freezes when the game starts the wireless adapter.** Use a Game Boy Color
  link cable; a Game Boy Advance cable does not work in this mode. Update the adapter
  firmware, and if it still happens, try another cable.
- **The GBA says the trainer is busy, or waits forever.** Close the room on the Switch
  and open it again.
- **Emerald says the other trainer is not ready yet, or a game says it can't transmit
  with a trainer who is too far away.** Emerald and FireRed or LeafGreen trade only once
  both players have entered the Hall of Fame and the FireRed or LeafGreen player has
  finished the Sevii Islands story (Cerulean Cave shows on its town map). The same
  happens between two GBAs. When the web page carries the link, turning on its National
  Dex bypass lets them trade anyway.
- **The GBA never sees the Switch.** Check the keys (`LDN_KEYS`), the antenna, and that
  both consoles picked the same activity.
- **Choppy walking.** Move the board closer to the Switch.

## Licence

AGPL-3.0, see `LICENSE` at the repository root. The LDN protocol components are GPL-3.0
(`licenses/LDN-GPL-3.0.txt`).
