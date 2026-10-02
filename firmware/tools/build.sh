#!/bin/bash
# Build, flash or monitor one chip's firmware with the pinned ESP-IDF.
# Usage: build.sh <ESP32|ESP32-C3|ESP32-C5|ESP32-C6|ESP32-S3> [build | flash <port> | monitor <port>]
set -euo pipefail
CHIP=${1:-}; ACTION=${2:-build}; PORT=${3:-}
SDK=${SDK_PATH:-$HOME/esp/esp-idf-v6.1}
REV=fff9895c82d744c7237be8847347bdd1b07c6643
ROOT=$(cd "$(dirname "$0")/.." && pwd)
[ -n "$CHIP" ] && [ -f "$ROOT/$CHIP/CMakeLists.txt" ] || { echo "Usage: $0 <ESP32|ESP32-C3|ESP32-C5|ESP32-C6|ESP32-S3> [build | flash <port> | monitor <port>]"; exit 1; }
[ -f "$SDK/export.sh" ] || { echo "ESP-IDF is missing at $SDK (install the pinned v6.1 release there, or set SDK_PATH)"; exit 1; }
actual=$(git -C "$SDK" rev-parse HEAD)
[ "$actual" = "$REV" ] || { echo "This firmware requires ESP-IDF $REV; found $actual"; exit 1; }
case $ACTION in
    build) ;;
    flash|monitor) [ -n "$PORT" ] || { echo "Specify the serial port, for example /dev/ttyACM0"; exit 1; } ;;
    *) echo "Unknown action: $ACTION"; exit 1 ;;
esac
set +eu; . "$SDK/export.sh" >/dev/null; set -eu
CONFIG="$ROOT/$CHIP/build/sdkconfig"
[ "$ROOT/$CHIP/sdkconfig.defaults" -nt "$CONFIG" ] && rm -f "$CONFIG"
IDF=(idf.py -C "$ROOT/$CHIP" -B "$ROOT/$CHIP/build" -DSDKCONFIG="$CONFIG")
case $ACTION in
    build) "${IDF[@]}" build ;;
    flash) "${IDF[@]}" -p "$PORT" -b 460800 flash ;;
    monitor) "${IDF[@]}" -p "$PORT" monitor ;;
esac
