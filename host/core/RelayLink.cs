namespace Frlg.Trade.Core;

// PiaLink relaying a real GBA behind a GB-Link adapter. Host WT frames become HOST_SEND payloads;
// the GBA's CLIENT_SEND payloads become WT frames, byte for byte.
//
// Child->parent frames carry a mod-8 sequence tag the parent checks, so the queue is lossless and
// ordered; one dropped or reordered frame desyncs the trade and the Switch disconnects.
// Exact consecutive duplicates are RFU retransmits and collapse to one.
public sealed class RelayLink(byte[] ssid, byte[] ourMac, byte[] hostMac, string ourIp, string hostIp, Action<byte[], string> send)
    : PiaLink(ssid, ourMac, hostMac, ourIp, hostIp, send)
{
    private readonly Queue<byte[]> outbound = [];
    private byte[]? lastEnqueued, idle;
    public Action<byte[]>? HostPayload { get; set; }
    public bool ConnectRequested { get; set; }
    public int Repeated { get; private set; }
    public int HighWater { get; private set; }
    public int Overflow { get; private set; }
    public int Pending { get { lock (outbound) return outbound.Count; } }
    protected override bool WantConnect => ConnectRequested;
    // Byte 8 is the adapter send length. The payload is trimmed of trailing zeros, so zero-extend.
    public static byte[] HostPayloadOf(byte[] frame)
    {
        int length = frame[8] & 0x7F; var payload = new byte[length];
        frame.AsSpan(12, Math.Max(0, Math.Min(length, frame.Length - 12))).CopyTo(payload);
        return payload;
    }
    protected override void Deliver(byte[] frame) => HostPayload?.Invoke(HostPayloadOf(frame));
    // With nothing new from the GBA, repeat its idle frame, never its last command. The games drop a
    // frame only when every slot's command word is zero (RfuRecvQueue_Enqueue); a repeated command
    // keeps the peer's receive queue non-empty and the link-standby handshake never arms.
    protected override byte[]? Next()
    {
        lock (outbound)
        {
            if (outbound.TryDequeue(out var payload)) return Rfu.Wrap(payload, NextTime());
            if (idle == null) return null;
            Repeated++; return Rfu.Wrap(idle, NextTime());
        }
    }
    private static bool IsIdle(byte[] p)
    {
        for (int i = 2; i < p.Length; i++) if (p[i] != 0) return false;
        return true;
    }
    public void Enqueue(byte[] payload)
    {
        lock (outbound)
        {
            if (IsIdle(payload)) idle = payload;
            // Drop only an exact repeat of the last queued frame (RFU retransmit). Do not mask bits 5-7
            // of payload[2]: they are the mod-8 sequence the parent checks.
            if (lastEnqueued != null && lastEnqueued.AsSpan().SequenceEqual(payload)) return;
            outbound.Enqueue(payload); lastEnqueued = payload;
            if (outbound.Count > HighWater) HighWater = outbound.Count;
            // Last-resort cap for a wedged drain. Dropping desyncs the trade; counted in Overflow.
            if (outbound.Count > 512) { outbound.Dequeue(); Overflow++; }
        }
    }
}
