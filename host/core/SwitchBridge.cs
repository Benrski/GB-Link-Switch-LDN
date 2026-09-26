using System.Diagnostics;
using System.Security.Cryptography;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace Frlg.Trade.Core;

// Shared GB-Link pump for the bridges: statuses, telemetry logging, and RFU1 frame reassembly.
public sealed class GbLinkMonitor(GbLinkDevice device, Action<string> log)
{
    private readonly Rfu1.Parser parser = new();
    private readonly Dictionary<byte, (string Key, double At)> lastTelemetry = [];
    public int ClientAcks { get; private set; }
    public void Pump(double now, Action<Rfu1.Frame> onFrame)
    {
        while (device.TryDequeueStatus(out var status))
        {
            log($"{now,7:F3} status {GbLinkDevice.StatusName(status)}");
            if (status == 0xFF0D) throw new ConnectionException("Wrong cable: the wireless mode needs the GBC (grey) cable");
        }
        while (device.TryDequeueData(out var chunk))
        {
            if (chunk.Length != 64) { Telemetry(chunk, now); continue; }
            foreach (var frame in parser.Feed(chunk)) { if (frame.Type == Rfu1.ClientAck) ClientAcks++; else onFrame(frame); }
        }
    }
    private void Telemetry(byte[] chunk, double now)
    {
        var text = RfuTelemetry.Describe(chunk);
        if (text == null) { if (chunk.Length > 0 && chunk[0] != GbLinkDevice.GetFirmwareInfo) log($"{now,7:F3} data {Convert.ToHexString(chunk)}"); return; }
        string key = Regex.Replace(text, @"(slaveXfers|masterXfers|waitEvents|cmds|cmdCounter|transfers|lastRx)=[0-9a-f]+", "");
        if (lastTelemetry.TryGetValue(chunk[0], out var last) && last.Key == key && now - last.At < 30) return;
        lastTelemetry[chunk[0]] = (key, now); log($"{now,7:F3}   {text}");
    }
    public static string DescribeBeacon(Rfu1.Frame frame)
    {
        var packet = frame.BroadcastBytes();
        return $"beacon devid={frame.Header & 0xFFFF:x4} slot={frame.Header >> 16} serial={Bin.U16(packet):x4} compat={Bin.U16(packet, 2):x4} tid={Bin.U16(packet, 4):x4} activity=0x{packet[12]:x2} name={Rfu.ReadName(packet[16..24])} raw={Convert.ToHexString(packet)}";
    }
}

// Real GBA (GB-Link wireless mode) joining a Switch FireRed leader room. The LDN session is joined first;
// the GBA sees the leader as a broadcast, its connect becomes the WC request, and adapter payloads are
// relayed verbatim.
public sealed class SwitchBridge(Action<string> log)
{
    // Link commands logged by name, to correlate the log with the games' screens.
    private static readonly Dictionary<int, string> Milestones = new()
    {
        [0xaabb] = "Ready (mon selected)", [0xdddd] = "SetMons", [0xbbbb] = "InitBlock",
        [0xccdd] = "Start trade", [0xabcd] = "ReadyFinish", [0xdcba] = "ConfirmFinish",
        [0xeeaa] = "Cancel", [0xddee] = "PlayerCancel", [0xeecc] = "PartnerCancel", [0x5f00] = "CLOSE LINK",
    };
    private static string? Describe(ReadOnlySpan<byte> words)
    {
        if (words.Length < 4) return null;
        int cmd = words[0] | (words[1] << 8), value = words[2] | (words[3] << 8);
        if ((cmd & 0xFF00) == 0x6600) return $"standby round {value}";
        if ((cmd & 0xFF00) == 0x5F00) return "CLOSE LINK";
        return Milestones.TryGetValue(cmd, out var name) ? name : null;
    }

    // Set after teardown (LDN_STOP sent); lets a signal handler wait for a clean exit.
    public static volatile bool ShutdownComplete;

    public void Run(string ldnPort, string? gblinkPort, string? leaderName, string runPath, CancellationToken cancel)
    {
        ShutdownComplete = false;
        Directory.CreateDirectory(runPath);
        using var native = new StreamWriter(Path.Combine(runPath, "native.log")) { AutoFlush = true };
        using var rfuLog = new StreamWriter(Path.Combine(runPath, "rfu1.log")) { AutoFlush = true };
        void Record(string text) { native.WriteLine($"{DateTimeOffset.Now:O} {text}"); log(text); }
        var keys = KeyFile.LoadDefault();
        // No GB-Link port: the adapter is on the LDN device and its frames use kinds 6/7. That device
        // also owns wireless-mode entry. The GBA probes for an adapter only at power-on, so re-entering
        // the mode here would strand it.
        bool tunnelled = string.IsNullOrEmpty(gblinkPort);
        using var device = new SerialDevice(ldnPort, cancel);
        using var gblink = tunnelled ? new GbLinkDevice(device.SendRfu) : new GbLinkDevice(gblinkPort!);
        bool started = false, wirelessMode = false;
        try
        {
            if (tunnelled)
            {
                device.RfuReceived = bytes => gblink.Feed(bytes); gblink.Pump = device.Pump;
                device.Handshake(); started = true; Record($"LDN device: {device.Model} (GB-Link wired to it)");
            }
            else
            {
                LeaderBridge.EnterWirelessMode(gblink, Record, cancel); wirelessMode = true;
                device.Handshake(); started = true; Record($"LDN device: {device.Model}");
            }
            var info = gblink.FirmwareInfo(); Record(info == null ? "GB-Link: no firmware info reply" : $"GB-Link firmware {info[1]}.{info[2]}.{info[3]}");
            // No timeout: the GBA side is live, so the Switch can host at any time.
            Record("Waiting for the Switch to host a FireRed Leader room");
            LdnNetwork? network = null;
            for (int pass = 1; network == null; pass++)
            {
                cancel.ThrowIfCancellationRequested();
                network = LdnJoiner.Scan(device, keys, 25, cancel);
                if (network == null && pass % 4 == 0) Record($"still waiting for the room ({pass * 25}s)");
            }
            string hostName = network.Members.FirstOrDefault(m => m.Index == 0)?.Name ?? "SWITCH";
            Record($"Room: protocol={network.Protocol} channel={network.Channel} host={hostName} members={network.Members.Count}/{network.Maximum} appData={Convert.ToHexString(network.ApplicationData)}");
            var room = LdnJoiner.Join(device, keys, network, Record, cancel);
            Record("Joined the Switch room; advertising it to the GBA");
            var monitor = new GbLinkMonitor(gblink, Record);
            ushort leaderDevid = (ushort)RandomNumberGenerator.GetInt32(1, 0xFFFF), childDevid = 0;
            var beacon = LeaderBridge.Beacon(leaderName ?? hostName, 4, false, 0x1234);
            Record($"Leader beacon devid={leaderDevid:x4} name={leaderName ?? hostName} {Convert.ToHexString(beacon)}");
            using var capture = new StreamWriter(Path.Combine(runPath, "pia.jsonl")) { AutoFlush = true };
            capture.WriteLine(JsonSerializer.Serialize(new { rec = "meta", ip = room.Ours.Ip, host = room.Host.Ip, ssid_hex = Convert.ToHexString(network.Ssid) }));
            var clock = Stopwatch.StartNew();
            void Capture(string dir, byte[] data, string source, string destination) => capture.WriteLine(JsonSerializer.Serialize(new { rec = "pkt", t = clock.Elapsed.TotalSeconds, dir, src = source + ":12345", dst = destination + ":12345", hex = Convert.ToHexString(data) }));
            void Rfu(string dir, byte[] frame) => rfuLog.WriteLine($"{clock.Elapsed.TotalSeconds:F4} {dir} {Convert.ToHexString(frame)}");
            using var relay = new RelayLink(network.Ssid, room.OurMac, network.Host, room.Ours.Ip, room.Host.Ip,
                (data, destination) => { device.SendDatagram(data, destination); Capture("out", data, room.Ours.Ip, destination); });
            relay.Log += Record;
            bool childConnected = false; int hostFrames = 0, childFrames = 0, droppedBeforeConnect = 0;
            double lastChildTraffic = 0, silenceReported = 0;
            relay.HostPayload = payload =>
            {
                if (!childConnected) { droppedBeforeConnect++; return; }
                if (payload.Length >= 17)
                    for (int off = 3; off + 14 <= payload.Length; off += 14)
                    {
                        var note = Describe(payload.AsSpan(off, 14));
                        if (note != null) Record($"{clock.Elapsed.TotalSeconds,7:F3} Switch -> {note} (slot {(off - 3) / 14})");
                    }
                var frame = Rfu1.HostSendFrame(payload); gblink.SendData(frame); Rfu("host->gba", frame); hostFrames++;
                if (hostFrames <= 40 && !payload.All(b => b == 0)) Record($"{clock.Elapsed.TotalSeconds,7:F3} Switch -> {Convert.ToHexString(payload)}");
            };
            double nextPing = 0, nextTick = 0, nextBeacon = 0, nextSummary = 5, lastReceive = 0; string lastBeacon = "";
            while (!relay.HostDisconnected)
            {
                cancel.ThrowIfCancellationRequested(); double now = clock.Elapsed.TotalSeconds;
                if (now >= nextPing) { device.Command("LDN_PING", 5); nextPing = now + 1; }
                var frames = device.Drain();
                foreach (var frame in frames) if (frame.Kind == 3 && LdnJoiner.Text(frame).StartsWith("LDN_DISCONNECTED ")) Record(LdnJoiner.Text(frame));
                foreach (var frame in frames)
                {
                    if (frame.Kind == 5 && frame.Payload.Length >= 4)
                    {
                        string source = new System.Net.IPAddress(frame.Payload[..4]).ToString();
                        if (!room.Peers.ContainsKey(source)) throw new ConnectionException("Received data from an unauthenticated room member.");
                        var data = frame.Payload[4..]; Capture("in", data, source, room.Ours.Ip);
                        int before = relay.ReceivedPackets; relay.Receive(data, source);
                        if (before != relay.ReceivedPackets) lastReceive = now;
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
                monitor.Pump(now, frame =>
                {
                    Rfu("gba->host", Rfu1Bytes(frame));
                    switch (frame.Type)
                    {
                        case Rfu1.Broadcast:
                            var text = GbLinkMonitor.DescribeBeacon(frame);
                            if (text != lastBeacon) { lastBeacon = text; Record($"{now,7:F3} GBA {text}"); }
                            break;
                        case Rfu1.ConnectReq:
                            Record($"{now,7:F3} GBA CONNECT_REQ for devid {frame.Header & 0xFFFF:x4}");
                            if ((frame.Header & 0xFFFF) == leaderDevid) { relay.ConnectRequested = true; Record("Requesting the RFU connection from the Switch (WC)"); }
                            else gblink.SendData(Rfu1.Cmd(Rfu1.ConnectNack, 0));
                            break;
                        case Rfu1.ClientSend:
                            var payload = frame.Data; childFrames++;
                            if (!childConnected) { Record($"{now,7:F3} CLIENT_SEND before connect, ignored: {Convert.ToHexString(payload)}"); break; }
                            if (payload.Length >= 6 && payload[0] == 0x0E && payload[1] == 0x10)
                            {
                                var note = Describe(payload.AsSpan(2));
                                if (note != null) Record($"{now,7:F3} GBA -> {note}");
                            }
                            // Skip the 2-byte 0e10 header, which idle frames also carry.
                            if (payload.Length > 2 && payload.AsSpan(2).ToArray().Any(b => b != 0)) lastChildTraffic = now;
                            relay.Enqueue(payload);
                            if (childFrames <= 40 && !payload.All(b => b == 0)) Record($"{now,7:F3} GBA -> {Convert.ToHexString(payload)} {LeaderBridge.DescribeNi(payload)}");
                            break;
                        case Rfu1.Disconnect:
                            Record($"{now,7:F3} GBA DISCONNECT"); childConnected = false; break;
                        case Rfu1.FlowCtl:
                            if ((frame.Header & 1) == 0 || relay.Pending > 8) Record($"{now,7:F3} GBA FLOWCTL active={frame.Header & 1} depth={(frame.Header >> 8) & 0xFF}");
                            break;
                        default:
                            Record($"{now,7:F3} GBA {frame.Name} hdr={frame.Header:x8}"); break;
                    }
                });
                if (relay.Accepted && !childConnected && relay.ConnectRequested)
                {
                    childDevid = (ushort)RandomNumberGenerator.GetInt32(1, 0xFFFF); childConnected = true;
                    var ack = Rfu1.Cmd(Rfu1.ConnectAck, childDevid); gblink.SendData(ack); Rfu("host->gba", ack);
                    Record($"Switch accepted; CONNECT_ACK to the GBA, child devid={childDevid:x4} slot 0");
                }
                if (now >= nextBeacon) { gblink.SendData(Rfu1.Bcast(leaderDevid, (byte)(childConnected ? 1 : 0), beacon)); nextBeacon = now + 0.5; }
                if (now >= nextTick) { relay.Tick(); nextTick = now + 1 / 59.727; }
                // Log a stalled GBA; the Switch drops it during this window.
                if (childConnected && lastChildTraffic > 0 && now - lastChildTraffic > 2 && now - silenceReported > 5)
                {
                    silenceReported = now;
                    Record($"{now,7:F3} GBA has sent nothing but idle for {now - lastChildTraffic:F1}s");
                }
                if (now >= nextSummary)
                {
                    Record($"{now,7:F3} summary connected={childConnected} pia rx={relay.ReceivedPackets} tx={relay.SentPackets} decryptFailed={relay.DecryptFailures} host->gba={hostFrames} gba->host={childFrames} queued={relay.Pending} highWater={relay.HighWater} repeated={relay.Repeated} overflow={relay.Overflow} reordered={relay.Reordered} holding={relay.Resequencing} clientAcks={monitor.ClientAcks} serialBad={device.BadFrames}/{gblink.BadFrames}");
                    nextSummary = now + 5;
                }
                // Silence timeout only once connected; before that the Switch may stay quiet while the
                // player navigates menus.
                if (childConnected && now - lastReceive > 30) throw new ConnectionException("Host communication timed out; the connection was closed.");
                Thread.Sleep(1);
            }
            Record($"Host disconnected (WD): pia rx={relay.ReceivedPackets} tx={relay.SentPackets} host->gba={hostFrames} gba->host={childFrames}");
            if (childConnected) gblink.SendData(Rfu1.Cmd(Rfu1.Disconnect, childDevid));
        }
        finally
        {
            if (wirelessMode) { try { gblink.Command(GbLinkDevice.Cancel); } catch (Exception) { } }
            if (started) { try { device.Stop(); } catch (Exception error) { Record("Stop acknowledgement unavailable: " + error.Message); } }
                    ShutdownComplete = true;
        }
    }
    private static byte[] Rfu1Bytes(Rfu1.Frame f) => f.Type == Rfu1.Broadcast ? Rfu1.Bcast((ushort)(f.Header & 0xFFFF), (byte)(f.Header >> 16), f.BroadcastBytes())
        : Rfu1.Size(f.Type) == 104 ? Rfu1.Data(f.Type, f.Header, f.Payload) : Rfu1.Cmd(f.Type, f.Header);
}
