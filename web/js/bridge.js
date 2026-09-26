// Relays GB-Link frames between the bridge firmware's host adapter port and the adapter.
// Frames are passed through unparsed.

const CHUNK = 1024;

export class Bridge extends EventTarget {
    constructor(esp, adapter) {
        super();
        this.esp = esp;
        this.adapter = adapter;
        this.running = false;
        this.stats = { toAdapterFrames: 0, toAdapterBytes: 0, fromAdapterBytes: 0, reattached: 0, since: 0 };
        this.onReattached = () => {
            this.stats.reattached++;
            this.claim().catch((error) => this.fail(error));
        };
    }

    async start() {
        if (this.running) return;
        this.stats = { toAdapterFrames: 0, toAdapterBytes: 0, fromAdapterBytes: 0, reattached: 0, since: Date.now() };
        this.esp.onAdapterFrame = (bytes) => {
            this.stats.toAdapterFrames++;
            this.stats.toAdapterBytes += bytes.length;
            this.adapter.writeStream(bytes);
        };
        this.adapter.onBytes = (bytes) => {
            this.stats.fromAdapterBytes += bytes.length;
            for (let at = 0; at < bytes.length; at += CHUNK) this.esp.sendAdapter(bytes.subarray(at, at + CHUNK));
        };
        this.running = true;
        this.esp.addEventListener('reattached', this.onReattached);
        try {
            await this.claim();
        } catch (error) {
            await this.stop();
            throw error;
        }
    }

    // The host-port setting is lost on the restart after every session; reapplied on reattach.
    async claim() {
        if (!this.running) return;
        if (!(await this.esp.setAdapterPort('host'))) throw new Error('The ESP32 board did not hand over its adapter port.');
    }

    fail(error) {
        this.dispatchEvent(new CustomEvent('failed', { detail: error }));
    }

    // Adapter leaves the mode before the board gets UART back. A board also wired to the
    // adapter re-enters the mode over the wires right away, and a later cancel would undo it.
    async stop() {
        if (!this.running) return;
        this.running = false;
        this.esp.removeEventListener('reattached', this.onReattached);
        this.esp.onAdapterFrame = null;
        this.adapter.onBytes = null;
        await this.adapter.leaveMode();
        await new Promise((resolve) => setTimeout(resolve, 150));
        try { if (this.esp.attached) await this.esp.setAdapterPort('uart'); } catch {}
    }
}
