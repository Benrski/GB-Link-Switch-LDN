using System.Diagnostics;
using System.Security.Cryptography;

namespace Frlg.Trade.Core;

// Minimal FireRed leader for a GBA joining through a GB-Link adapter in wireless mode. Advertises a
// trade-group beacon, accepts the connect, runs the leader side of the librfu name exchange (per-chunk
// LLSF acks), then admits the child with JOIN_GROUP_OK. Logs every frame and the adapter telemetry.
// Frame formats follow pokefirered librfu_rfu.c and Switch captures.
public sealed class LeaderBridge(GbLinkDevice device, Action<string> log)
{
    public ushort Devid { get; } = (ushort)RandomNumberGenerator.GetInt32(1, 0xFFFF);
    public ushort ChildDevid { get; private set; }
    public bool Connected { get; private set; }
    public bool NameReceived { get; private set; }
    public bool Joined { get; private set; }
    public int HostSends { get; private set; }
    public int ClientSends { get; private set; }
    private byte[]? ack; private int ackRepeats; private double acceptAt = double.PositiveInfinity, nextFrame = double.PositiveInfinity;
    private readonly List<byte[]> childName = [];
    // Parent NI send of the 1-byte join status. Each step repeats until the child acks it.
    private static readonly (byte[] Frame, int State, int N, int Phase)[] JoinStatus =
    [
        (ParentFrame(1, 1, 0, [0x00, 0x05, 0x00, 0x01, 0x00]), 1, 1, 0),   // NI_START control: dataType 0, payloadSize 5, dataSize 1 (first 5 bytes)
        (ParentFrame(1, 2, 0, [0x00, 0x00]), 1, 2, 0),                     // control bytes 6-7
        (ParentFrame(2, 1, 0, [0x05]), 2, 1, 0),                           // data: RFU_STATUS_JOIN_GROUP_OK
        (ParentFrame(3, 0, 0, []), 3, 0, 0),                               // NI_END
    ];
    private int joinStep = -1;

    // librfu rfu_REQ_configGameData: serial(2) | RfuGameData(13) | checksum | uname(8) = the six broadcast words.
    public static byte[] Beacon(string name, byte activity, bool started, ushort trainerId)
    {
        var b = new byte[24];
        Bin.W16(b, 0, 0x0002);                         // RFU_SERIAL_GAME
        // Compatibility: language English (2), version FireRed (4),
        // bits 7-9 canLinkNationally/hasNationalDex/gameClear.
        Bin.W16(b, 2, 2 | (1 << 7) | (1 << 8) | (1 << 9) | (4 << 10));
        Bin.W16(b, 4, trainerId);                      // playerTrainerId; partnerInfo[4] and tradeSpecies/tradeType stay zero
        b[12] = (byte)((activity & 0x7F) | (started ? 0x80 : 0));
        var uname = Rfu.Name(name, 8); uname.CopyTo(b, 16);
        int sum = 0; for (int i = 0; i < 8; i++) sum += uname[i] + b[2 + i];
        b[15] = (byte)~sum;
        return b;
    }
    // Parent LLSF (3 bytes, slot 0): bmSlot<<18 | state<<14 | ack<<13 | n<<11 | phase<<9 | size.
    public static byte[] ParentFrame(int state, int n, int phase, byte[] payload, bool ack = false)
    {
        uint h = 0x040000u | (uint)(state << 14) | (ack ? 1u << 13 : 0) | (uint)(n << 11) | (uint)(phase << 9) | (uint)payload.Length;
        return [(byte)h, (byte)(h >> 8), (byte)(h >> 16), .. payload];
    }
    // Ack of a child NI frame: same state/n/phase, ack bit set, no payload.
    public static byte[] ParentAck(ushort h) => ParentFrame((h >> 10) & 15, (h >> 7) & 3, (h >> 5) & 3, [], true);
    public static string DescribeNi(ReadOnlySpan<byte> d)
    {
        if (d.Length < 2) return "";
        ushort h = Bin.U16(d);
        return $"NI state={(h >> 10) & 15} ack={(h >> 9) & 1} n={(h >> 7) & 3} phase={(h >> 5) & 3} len={h & 31}";
    }
    // A child send may carry several 2-byte-header LLSF frames back to back.
    public static IEnumerable<(ushort Header, byte[] Payload)> ChildFrames(byte[] data)
    {
        for (int o = 0; o + 2 <= data.Length;)
        {
            ushort h = Bin.U16(data, o); int size = h & 31;
            if (o + 2 + size > data.Length) yield break;
            yield return (h, data[(o + 2)..(o + 2 + size)]); o += 2 + size;
            if (h == 0) yield break;
        }
    }

    public void Run(string name, byte activity, bool started, bool beacons, bool accept, double seconds, CancellationToken cancel)
    {
        var info = device.FirmwareInfo();
        log(info == null ? "firmware info: no reply" : $"firmware {info[1]}.{info[2]}.{info[3]}");
        EnterWirelessMode(device, log, cancel);
        var beacon = Beacon(name, activity, started, 0x1234);
        log($"leader devid={Devid:x4} name={name} activity=0x{beacon[12]:x2} beacon={Convert.ToHexString(beacon)}");
        var monitor = new GbLinkMonitor(device, log); var clock = Stopwatch.StartNew(); double nextBeacon = 0, nextSummary = 5; string lastBeacon = "";
        try
        {
            while (!cancel.IsCancellationRequested && clock.Elapsed.TotalSeconds < seconds)
            {
                double now = clock.Elapsed.TotalSeconds;
                monitor.Pump(now, frame => Handle(frame, now, ref lastBeacon));
                if (beacons && now >= nextBeacon) { device.SendData(Rfu1.Bcast(Devid, (byte)(Connected ? 1 : 0), beacon)); nextBeacon = now + 0.5; }
                if (accept && now >= acceptAt && joinStep < 0) { joinStep = 0; acceptAt = double.PositiveInfinity; log($"{now,7:F3} admitting the child: sending JOIN_GROUP_OK"); }
                if (Connected && now >= nextFrame)
                {
                    byte[] payload = joinStep >= 0 && joinStep < JoinStatus.Length ? JoinStatus[joinStep].Frame : ack ?? [0];
                    device.SendData(Rfu1.HostSendFrame(payload)); HostSends++;
                    if (ack != null && ackRepeats > 0 && --ackRepeats == 0) ack = null;
                    nextFrame = now + 1 / 59.727;
                }
                if (now >= nextSummary) { log($"{now,7:F3} summary connected={Connected} name={NameReceived} joined={Joined} hostSends={HostSends} clientSends={ClientSends} clientAcks={monitor.ClientAcks} badSerial={device.BadFrames}"); nextSummary = now + 5; }
                Thread.Sleep(1);
            }
        }
        finally
        {
            if (Connected) device.SendData(Rfu1.Cmd(Rfu1.Disconnect, ChildDevid));
            device.Command(GbLinkDevice.Cancel);
            Thread.Sleep(200);
            while (device.TryDequeueStatus(out var status)) log($"status {GbLinkDevice.StatusName(status)}");
        }
    }
    // Mode entry checks the cable; retry until the GBC cable and a GBA are on the link port.
    public static void EnterWirelessMode(GbLinkDevice device, Action<string> log, CancellationToken cancel)
    {
        for (int attempt = 0; ; attempt++)
        {
            cancel.ThrowIfCancellationRequested();
            device.Command(GbLinkDevice.SetMode, GbLinkDevice.ModeWireless, 0);
            var watch = Stopwatch.StartNew(); bool wrongCable = false, ready = false;
            while (watch.ElapsedMilliseconds < 1500 && !wrongCable && !ready)
            {
                while (device.TryDequeueStatus(out var status))
                {
                    if (status == 0xFF0D) wrongCable = true;
                    else if (status == 0xFF02) ready = true;   // AwaitMode: the adapter section is running
                }
                Thread.Sleep(20);
            }
            if (!wrongCable) { log(ready ? "wireless adapter mode running" : "wireless mode entered (no AwaitMode seen yet)"); return; }
            if (attempt == 0) log("WrongCable: waiting for the grey GBC cable and the GBA on the link port (retrying every 2 s)");
            device.Command(GbLinkDevice.Cancel); Thread.Sleep(2000);
            while (device.TryDequeueStatus(out _)) { }
        }
    }
    private void Handle(Rfu1.Frame frame, double now, ref string lastBeacon)
    {
        switch (frame.Type)
        {
            case Rfu1.Broadcast:
                var text = GbLinkMonitor.DescribeBeacon(frame);
                if (text != lastBeacon) { lastBeacon = text; log($"{now,7:F3} GBA {text}"); }
                break;
            case Rfu1.ConnectReq:
                log($"{now,7:F3} CONNECT_REQ for devid {frame.Header & 0xFFFF:x4}");
                if ((frame.Header & 0xFFFF) == Devid)
                {
                    ChildDevid = (ushort)RandomNumberGenerator.GetInt32(1, 0xFFFF); Connected = true; ack = null; joinStep = -1; childName.Clear(); nextFrame = now;
                    device.SendData(Rfu1.Cmd(Rfu1.ConnectAck, ChildDevid)); log($"{now,7:F3} CONNECT_ACK child devid={ChildDevid:x4} slot 0");
                }
                else device.SendData(Rfu1.Cmd(Rfu1.ConnectNack, 0));
                break;
            case Rfu1.ClientSend:
                var data = frame.Data; ClientSends++;
                if (data.All(b => b == 0)) break;   // idle frame; counted in the summary
                log($"{now,7:F3} GBA -> {Convert.ToHexString(data)}");
                foreach (var (h, payload) in ChildFrames(data)) ChildFrame(h, payload, now);
                break;
            case Rfu1.Disconnect: Connected = false; log($"{now,7:F3} DISCONNECT {frame.Header:x8}"); break;
            case Rfu1.FlowCtl: log($"{now,7:F3} FLOWCTL active={frame.Header & 1} depth={(frame.Header >> 8) & 0xFF}"); break;
            default: log($"{now,7:F3} {frame.Name} hdr={frame.Header:x8} {Convert.ToHexString(frame.Payload)}"); break;
        }
    }
    private void ChildFrame(ushort h, byte[] payload, double now)
    {
        int state = (h >> 10) & 15, isAck = (h >> 9) & 1, n = (h >> 7) & 3, phase = (h >> 5) & 3;
        if (isAck == 1)
        {
            if (joinStep >= 0 && joinStep < JoinStatus.Length && JoinStatus[joinStep].State == state && JoinStatus[joinStep].N == n && JoinStatus[joinStep].Phase == phase)
            {
                log($"{now,7:F3}   child acked join step {joinStep + 1}/{JoinStatus.Length} ({DescribeNi([(byte)h, (byte)(h >> 8)])})");
                if (++joinStep == JoinStatus.Length)
                {
                    Joined = true; ack = ParentFrame(0, 1, 0, []); ackRepeats = 2;   // leader idle NI frame after admission (capture: 00 08 04)
                    log($"{now,7:F3} JOIN_GROUP_OK accepted: the GBA is joined to the group");
                }
            }
            else log($"{now,7:F3}   child ack {DescribeNi([(byte)h, (byte)(h >> 8)])}");
            return;
        }
        log($"{now,7:F3}   {DescribeNi([(byte)h, (byte)(h >> 8)])} {Convert.ToHexString(payload)}");
        if (state is 1 or 2 or 3)
        {
            if (state == 2) childName.Add(payload);
            ack = ParentAck(h); ackRepeats = state == 3 ? 6 : 0;
            if (state == 3 && !NameReceived)
            {
                NameReceived = true; var block = childName.SelectMany(b => b).ToArray();
                string name = block.Length >= 25 ? Rfu.ReadName(block[17..25]) : "?";
                log($"{now,7:F3} name exchange complete: serial={(block.Length >= 2 ? Bin.U16(block) : 0):x4} activity=0x{(block.Length > 12 ? block[12] : 0):x2} name={name} ({block.Length} bytes)");
                acceptAt = now + 1.0;
            }
        }
        else if (h == 0x0080) { ack = null; log($"{now,7:F3}   child closed its NI send"); }
    }
}
