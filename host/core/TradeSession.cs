using System.Diagnostics;
using System.Text.Json;

namespace Frlg.Trade.Core;

public sealed class TradeSession(Action<object> emit)
{
    // Set from the UI thread; the engine is only touched on the session thread.
    private volatile bool declineRequested;
    private int offerRequested = -1;
    public void DeclineTrade() => declineRequested = true;
    public void OfferSlot(int slot) => Interlocked.Exchange(ref offerRequested, slot);
    public const ulong FireRedId = 0x01006fa0233f8000;
    private void Phase(string message) => emit(new { @event = "phase", message });
    private void Log(string message) => emit(new { @event = "log", message });
    public void Run(string port, byte[]?[] party, int selected, string runPath, CancellationToken cancel)
    {
        using var timing = new SessionTiming();
        var engine = new TradeEngine(party, selected);
        var keys = KeyFile.LoadDefault();
        Directory.CreateDirectory(runPath); emit(new { @event = "run", path = runPath });
        using var log = new StreamWriter(Path.Combine(runPath, "native.log")) { AutoFlush = true };
        void Record(string text) { log.WriteLine($"{DateTimeOffset.Now:O} {text}"); Log(text); }
        engine.Log += Record;
        engine.Notice += Phase;
        engine.DecliningChanged += value => emit(new { @event = "declining", value });
        engine.OpponentParty += (values, name) => emit(new { @event = "opponent_party", name, party = values.Select(v => v == null ? null : Convert.ToHexString(v)).ToArray() });
        engine.Committed += (data, slot) =>
        {
            // Save at commit, before UI notification or the room-exit handshake.
            string name = engine.Commits == 1 ? "received.pk3" : $"received-{engine.Commits}.pk3";
            string temp = Path.Combine(runPath, name + ".tmp"), target = Path.Combine(runPath, name);
            File.WriteAllBytes(temp, data); File.Move(temp, target, true);
            emit(new { @event = "received", slot, pk3 = Convert.ToHexString(data) }); Record($"Trade committed; received {TradeEngine.Parse(data).Nickname}");
        };
        Phase("Identifying the serial device");
        using var device = new SerialDevice(port, cancel);
        bool started = false;
        try
        {
            device.Handshake(); started = true; Record($"Bridge firmware {device.Firmware} on {device.Model}");
            emit(new { @event = "device", model = device.Model, firmware = device.Firmware });
            Phase("Searching for a Leader room");
            var network = LdnJoiner.Scan(device, keys, 25, cancel) ?? throw new ConnectionException("No joinable FireRed Leader room found; make sure the host is still waiting.");
            Record($"Room verified: protocol={network.Protocol} version={network.Version} channel={network.Channel}");
            Phase("Associating and authenticating with the room");
            var room = LdnJoiner.Join(device, keys, network, Record, cancel);
            emit(new { @event = "connected" });
            Phase("Joined the room, waiting for the Leader");
            using var capture = new StreamWriter(Path.Combine(runPath, "pia.jsonl")) { AutoFlush = true };
            capture.WriteLine(JsonSerializer.Serialize(new { rec = "meta", ip = room.Ours.Ip, host = room.Host.Ip, ssid_hex = Convert.ToHexString(network.Ssid) }));
            var clock = Stopwatch.StartNew();
            void Capture(string dir, byte[] data, string source, string destination) => capture.WriteLine(JsonSerializer.Serialize(new { rec = "pkt", t = clock.Elapsed.TotalSeconds, dir, src = source + ":12345", dst = destination + ":12345", hex = Convert.ToHexString(data) }));
            using var simulator = new Simulator(network.Ssid, room.OurMac, network.Host, room.Ours.Ip, room.Host.Ip, engine,
                (data, destination) => { device.SendDatagram(data, destination); Capture("out", data, room.Ours.Ip, destination); });
            simulator.Log += Record;
            double nextPing = 0, nextTick = 0, lastReceive = 0, closeAt = double.PositiveInfinity, leaveAt = double.PositiveInfinity;
            bool closeSeen = false, doneSeen = false;
            while (!simulator.HostDisconnected)
            {
                cancel.ThrowIfCancellationRequested(); double now = clock.Elapsed.TotalSeconds;
                if (declineRequested) { declineRequested = false; engine.Decline(); }
                if (Interlocked.Exchange(ref offerRequested, -1) is >= 0 and var wanted) engine.Offer(wanted);
                if (now >= nextPing) { device.Command("LDN_PING", 5); nextPing = now + 1; }
                var frames = device.Drain();
                // The reason arrives in the same batch as LINK 0; keep it in the log before failing.
                foreach (var frame in frames) if (frame.Kind == 3 && LdnJoiner.Text(frame).StartsWith("LDN_DISCONNECTED ")) Record(LdnJoiner.Text(frame));
                foreach (var frame in frames)
                {
                    if (frame.Kind == 5 && frame.Payload.Length >= 4)
                    {
                        string source = new System.Net.IPAddress(frame.Payload[..4]).ToString();
                        if (!room.Peers.ContainsKey(source)) throw new ConnectionException("Received data from an unauthenticated room member.");
                        var data = frame.Payload[4..]; Capture("in", data, source, room.Ours.Ip);
                        int before = simulator.ReceivedPackets; simulator.Receive(data, source);
                        if (before != simulator.ReceivedPackets) lastReceive = now;
                    }
                    else if (frame.Kind == 3)
                    {
                        string text = LdnJoiner.Text(frame);
                        if (text.StartsWith("LDN_ERROR ") || text.StartsWith("LDN_LINK 0 ") || text.StartsWith("LDN_NET_LOST") || text.StartsWith("LDN_UDP_ERROR "))
                            throw new ConnectionException("Wireless connection lost: " + text);
                        var adv = LdnJoiner.Advertisement(frame, keys);
                        if (adv != null) room.Refresh(device, adv);
                    }
                }
                if (now >= nextTick) { simulator.Tick(); nextTick = now + 1 / 59.727; }
                if (engine.Barrier.Mode == 2 && !closeSeen) { closeSeen = true; closeAt = now + 1.5; }
                if (engine.Done && !doneSeen) { doneSeen = true; leaveAt = now + 120; Phase((engine.Commits == 0 ? "Trade cancelled" : "Trade finished") + ", waiting for the Leader to leave the room"); }
                if (now >= closeAt || now >= leaveAt) break;
                if (now - lastReceive > 30) throw new ConnectionException("Host communication timed out; the connection was closed.");
                Thread.Sleep(1);
            }
            Record($"Link closed: rx={simulator.ReceivedPackets} decryptFailed={simulator.DecryptFailures} tx={simulator.SentPackets} serialBad={device.BadFrames}");
        }
        finally
        {
            // No board reset or external process needed to cancel.
            if (started) { try { device.Stop(); } catch (Exception error) { Record("Stop acknowledgement unavailable: " + error.Message); } }
        }
    }
}
