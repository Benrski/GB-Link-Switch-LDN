#!/usr/bin/env python3
"""Copy built firmware into web/firmware/ and write the manifest the web client reads.

Each chip's images and flash offsets come from the flasher_args.json its build left
behind, so nothing here knows where a given chip keeps its bootloader.

    package_web.py [--builds DIR] [--adapter-uf2 FILE --adapter-version X.Y.Z]

--builds names a directory holding one build directory per chip (DIR/ESP32-S3, ...);
the default is each project's own build directory, where tools/build.sh puts it.
Without --adapter-uf2 the GB-Link image already in web/firmware/ is kept.
"""
import argparse, json, re, shutil, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FIRMWARE = ROOT / "firmware"
OUT = ROOT / "web" / "firmware"

# esptool-js chip names, and whether the board has run a session on real hardware.
CHIPS = {"ESP32-S3": True, "ESP32-C6": False, "ESP32-C5": False, "ESP32-C3": False, "ESP32": False}


def bridge_version():
    source = (FIRMWARE / "common" / "ldn_control.h").read_text()
    return re.search(r'#define BRIDGE_VERSION "([^"]+)"', source).group(1)


def package_chip(chip, build):
    args = json.loads((build / "flasher_args.json").read_text())
    target = OUT / "bridge" / chip.lower()
    shutil.rmtree(target, ignore_errors=True)
    target.mkdir(parents=True)
    parts = []
    for offset, name in sorted(args["flash_files"].items(), key=lambda item: int(item[0], 16)):
        shutil.copyfile(build / name, target / Path(name).name)
        parts.append({"address": int(offset, 16), "path": f"bridge/{chip.lower()}/{Path(name).name}"})
    return {"tested": CHIPS[chip], "parts": parts}


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--builds", type=Path)
    parser.add_argument("--adapter-uf2", type=Path)
    parser.add_argument("--adapter-version")
    options = parser.parse_args()

    manifest_path = OUT / "manifest.json"
    previous = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}

    chips = {}
    for chip in CHIPS:
        build = (options.builds / chip) if options.builds else (FIRMWARE / chip / "build")
        if not (build / "flasher_args.json").exists():
            sys.exit(f"{chip}: no build found in {build} (run tools/build.sh {chip} first)")
        chips[chip] = package_chip(chip, build)

    adapter = previous.get("adapter")
    if options.adapter_uf2:
        if not options.adapter_version:
            sys.exit("--adapter-uf2 needs --adapter-version")
        shutil.rmtree(OUT / "adapter", ignore_errors=True)
        (OUT / "adapter").mkdir(parents=True)
        name = f"gblink-wireless-{options.adapter_version}.uf2"
        shutil.copyfile(options.adapter_uf2, OUT / "adapter" / name)
        adapter = {"version": options.adapter_version, "path": f"adapter/{name}"}
    if not adapter:
        sys.exit("no GB-Link image yet: pass --adapter-uf2 and --adapter-version")

    manifest = {"bridge": {"version": bridge_version(), "chips": chips}, "adapter": adapter}
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"bridge {manifest['bridge']['version']}: {', '.join(chips)}; adapter {adapter['version']}")


if __name__ == "__main__":
    main()
