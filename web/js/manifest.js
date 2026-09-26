// Bundled firmware list: firmware/manifest.json, written by firmware/tools/package_web.py.

export async function loadManifest(url = 'firmware/manifest.json') {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`The firmware list could not be loaded (HTTP ${response.status}).`);
    const manifest = await response.json();
    manifest.base = new URL('.', new URL(url, location.href)).href;
    return manifest;
}

export async function fetchBytes(url) {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`${url} could not be downloaded (HTTP ${response.status}).`);
    return new Uint8Array(await response.arrayBuffer());
}
