// A socket.io v4 client over one WebSocket (Engine.IO 4, WebSocket transport only), enough
// for the Celio server: events with and without acknowledgements, both ways, JSON only.
//
// Wire: "0{...}" open, "2"/"3" ping/pong, "40{auth}" connect, "41" disconnect,
// "42[id][event,...args]" event, "43id[...args]" acknowledgement.

export class SocketIo extends EventTarget {
    constructor(url, auth) {
        super();
        this.url = url;
        this.auth = auth;
        this.ws = null;
        this.connected = false;
        this.nextAck = 0;
        this.acks = new Map();
        this.handlers = new Map();
        this.closing = false;
    }

    on(event, handler) { this.handlers.set(event, handler); }

    connect(timeoutMs = 5000) {
        this.closing = false;
        return new Promise((resolve, reject) => {
            const base = this.url.replace(/\/+$/, '');
            const ws = this.ws = new WebSocket(`${base}/socket.io/?EIO=4&transport=websocket`);
            const timer = setTimeout(() => { ws.close(); reject(new Error('Could not connect to Server')); }, timeoutMs);
            ws.onmessage = (message) => {
                const text = String(message.data);
                if (text[0] === '0') { ws.send(`40${JSON.stringify(this.auth)}`); return; }
                if (text === '2') { ws.send('3'); return; }
                if (text.startsWith('40')) {
                    clearTimeout(timer);
                    this.connected = true;
                    resolve();
                    return;
                }
                if (text.startsWith('44')) { clearTimeout(timer); reject(new Error(connectError(text))); return; }
                if (text.startsWith('41')) { this.drop(); return; }
                if (text.startsWith('42')) this.onEvent(text.slice(2));
                else if (text.startsWith('43')) this.onAck(text.slice(2));
            };
            ws.onerror = () => {};
            ws.onclose = () => {
                clearTimeout(timer);
                if (!this.connected) { reject(new Error('Could not connect to Server')); return; }
                this.drop();
            };
        });
    }

    drop() {
        if (!this.connected) return;
        this.connected = false;
        for (const [, pending] of this.acks) pending.reject(new Error('Disconnected'));
        this.acks.clear();
        if (!this.closing) this.dispatchEvent(new Event('disconnect'));
    }

    close() {
        this.closing = true;
        try { if (this.connected) this.ws.send('41'); } catch {}
        try { this.ws?.close(); } catch {}
        this.drop();
    }

    emit(event, ...args) {
        if (!this.connected) return;
        this.ws.send(`42${JSON.stringify([event, ...args])}`);
    }

    // Resolves with the acknowledgement's arguments.
    request(event, arg, timeoutMs = 5000) {
        if (!this.connected) return Promise.reject(new Error('Not connected to the Server'));
        const id = this.nextAck++;
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => { this.acks.delete(id); reject(new Error('The Server did not answer')); }, timeoutMs);
            this.acks.set(id, {
                resolve: (value) => { clearTimeout(timer); resolve(value); },
                reject: (error) => { clearTimeout(timer); reject(error); },
            });
            this.ws.send(`42${id}${JSON.stringify([event, arg ?? null])}`);
        });
    }

    onEvent(text) {
        const bracket = text.indexOf('[');
        const id = bracket > 0 ? Number(text.slice(0, bracket)) : null;
        let packet;
        try { packet = JSON.parse(text.slice(bracket)); } catch { return; }
        const [event, ...args] = packet;
        // The server waits for an acknowledgement before it sends the next one.
        if (id !== null) this.ws.send(`43${id}${JSON.stringify([true])}`);
        this.handlers.get(event)?.(...args);
    }

    onAck(text) {
        const bracket = text.indexOf('[');
        const id = Number(text.slice(0, bracket));
        const pending = this.acks.get(id);
        if (!pending) return;
        this.acks.delete(id);
        try { pending.resolve(JSON.parse(text.slice(bracket))); } catch (error) { pending.reject(error); }
    }
}

function connectError(text) {
    try { return JSON.parse(text.slice(2)).message ?? 'Could not connect to Server'; } catch { return 'Could not connect to Server'; }
}
