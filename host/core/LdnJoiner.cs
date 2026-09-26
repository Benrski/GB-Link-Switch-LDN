using System.Diagnostics;
using System.Text;

namespace Frlg.Trade.Core;

public sealed class JoinedRoom(LdnNetwork network, LdnKeys derived, byte[] ourMac, LdnMember ours, LdnMember host, Dictionary<string, byte[]> peers)
{
    public LdnNetwork Network { get; } = network;
    public LdnKeys Derived { get; } = derived;
    public byte[] OurMac { get; } = ourMac;
    public LdnMember Ours { get; } = ours;
    public LdnMember Host { get; } = host;
    public Dictionary<string, byte[]> Peers { get; private set; } = peers;
    // Verifies a new advertisement from the same host and updates neighbors. False if it is another room.
    public bool Refresh(SerialDevice device, LdnNetwork room)
    {
        if (!room.Host.AsSpan().SequenceEqual(Network.Host)) return false;
        LdnJoiner.VerifySameRoom(Network, room); LdnJoiner.ValidateMembers(room, Ours, Host);
        var current = room.Members.Where(m => m.Index != Ours.Index).ToDictionary(m => m.Ip, m => m.Mac);
        foreach (string ip in Peers.Keys.Except(current.Keys).ToArray()) device.Command($"LDN_FORGET {ip}");
        foreach (var (ip, mac) in current) if (!Peers.TryGetValue(ip, out var previous) || !mac.AsSpan().SequenceEqual(previous)) device.Command($"LDN_NEIGH {ip} {Convert.ToHexString(mac)}");
        Peers = current; return true;
    }
}

// Joins a FireRed leader room via the serial bridge device: scan, associate, LDN auth, membership, UDP setup.
public static class LdnJoiner
{
    public static string Text(SerialFrame frame) => Encoding.UTF8.GetString(frame.Payload);
    public static LdnNetwork? Advertisement(SerialFrame frame, KeyFile keys)
    {
        if (frame.Kind != 3) return null;
        var fields = Text(frame).Split(' ');
        if (fields.Length != 4 || fields[0] != "LDN_ADV") return null;
        try { return LdnKeys.Decode(keys, Bin.Hex(fields[3]), Bin.Hex(fields[1].Replace(":", "")), int.Parse(fields[2])); }
        catch (Exception e) when (e is InvalidDataException or FormatException or Org.BouncyCastle.Crypto.InvalidCipherTextException or System.Security.Cryptography.CryptographicException) { return null; }
    }
    public static bool IsJoinableFireRed(LdnNetwork room) => room.CommunicationId == TradeSession.FireRedId && room.Policy != 1 && room.Members.Count < room.Maximum;
    public static LdnNetwork? Scan(SerialDevice device, KeyFile keys, double seconds, CancellationToken cancel)
    {
        var scanTime = Stopwatch.StartNew(); LdnNetwork? network = null;
        int[] channels = [1, 6, 11, 2, 3, 4, 5, 7, 8, 9, 10];
        while (network == null && scanTime.Elapsed.TotalSeconds < seconds)
        {
            foreach (int channel in channels)
            {
                cancel.ThrowIfCancellationRequested(); device.Command($"LDN_SCAN {channel}");
                var dwell = Stopwatch.StartNew();
                while (dwell.ElapsedMilliseconds < 500 && network == null)
                {
                    foreach (var frame in device.Drain())
                    {
                        var room = Advertisement(frame, keys);
                        if (room != null && IsJoinableFireRed(room)) { network = room; break; }
                    }
                    Thread.Sleep(2);
                }
                if (network != null || scanTime.Elapsed.TotalSeconds >= seconds) break;
            }
        }
        return network;
    }
    public static JoinedRoom Join(SerialDevice device, KeyFile keys, LdnNetwork network, Action<string> record, CancellationToken cancel)
    {
        var derived = new LdnKeys(keys, network.Protocol); var auth = new LdnAuthentication(network, derived);
        device.Command($"LDN_CONFIG {network.Channel} {Convert.ToHexString(network.Ssid).ToLowerInvariant()} {Bin.Mac(network.Host)} {Convert.ToHexString(derived.Data(network))}", 8);
        byte[]? ourMac = null; LdnNetwork? membership = null; bool accepted = false;
        var joinTime = Stopwatch.StartNew(); double nextStatus = 0, nextAuth = double.PositiveInfinity; int attempts = 0;
        while (joinTime.Elapsed.TotalSeconds < 40 && !(accepted && membership != null))
        {
            cancel.ThrowIfCancellationRequested();
            double now = joinTime.Elapsed.TotalSeconds;
            if (now >= nextStatus)
            {
                foreach (string line in device.Command("LDN_STATUS"))
                    if (line.StartsWith("LDN_LINK 1 ") && ourMac == null) { ourMac = Bin.Hex(line.Split(' ')[2].Replace(":", "")); nextAuth = now; }
                nextStatus = now + 2;
            }
            if (now >= nextAuth && !accepted && attempts < 3)
            { device.Command("LDN_TX " + Convert.ToHexString(auth.Request)); nextAuth = now + 0.7; attempts++; record($"LDN authentication request {attempts}"); }
            foreach (var frame in device.Drain())
            {
                string text = frame.Kind == 3 ? Text(frame) : "";
                if (text.StartsWith("LDN_LINK 1 ") && ourMac == null) { ourMac = Bin.Hex(text.Split(' ')[2].Replace(":", "")); nextAuth = now; }
                if (text.StartsWith("LDN_ERROR ")) throw new ConnectionException(text);
                if (text.StartsWith("LDN_RX "))
                {
                    var fields = text.Split(' ');
                    if (fields.Length != 3 || !Bin.Hex(fields[1].Replace(":", "")).AsSpan().SequenceEqual(network.Host)) continue;
                    auth.Accept(Bin.Hex(fields[2])); accepted = true; record("LDN response and challenge verified");
                }
                var room = Advertisement(frame, keys);
                if (room != null && room.Host.AsSpan().SequenceEqual(network.Host))
                {
                    VerifySameRoom(network, room);
                    if (ourMac != null && room.Members.Any(m => m.Mac.AsSpan().SequenceEqual(ourMac))) membership = room;
                }
            }
            Thread.Sleep(2);
        }
        if (ourMac == null || !accepted || membership == null) throw new ConnectionException("Room authentication timed out; check the Leader room and retry.");
        var ours = membership.Members.Single(m => m.Mac.AsSpan().SequenceEqual(ourMac));
        var host = membership.Members.Single(m => m.Index == 0);
        ValidateMembers(membership, ours, host);
        device.Command($"LDN_NET {ours.Ip} {host.Ip}");
        foreach (var m in membership.Members.Where(m => m.Index != ours.Index)) device.Command($"LDN_NEIGH {m.Ip} {Convert.ToHexString(m.Mac)}");
        record($"Network ready: serialBad={device.BadFrames}");
        return new(network, derived, ourMac, ours, host, membership.Members.Where(m => m.Index != ours.Index).ToDictionary(m => m.Ip, m => m.Mac));
    }
    public static void VerifySameRoom(LdnNetwork previous, LdnNetwork current)
    {
        if (!current.Id.AsSpan().SequenceEqual(previous.Id) || !current.Random.AsSpan().SequenceEqual(previous.Random))
            throw new ConnectionException("The Leader room has changed; reconnect.");
    }
    public static void ValidateMembers(LdnNetwork room, LdnMember ours, LdnMember host)
    {
        if (!room.Members.Any(m => m.Ip == ours.Ip && m.Mac.AsSpan().SequenceEqual(ours.Mac)) ||
            !room.Members.Any(m => m.Index == 0 && m.Ip == host.Ip && m.Mac.AsSpan().SequenceEqual(host.Mac)) ||
            room.Members.Select(m => m.Ip).Distinct().Count() != room.Members.Count)
            throw new ConnectionException("Room membership changed; the current connection is no longer valid.");
        var prefix = ours.Ip[..(ours.Ip.LastIndexOf('.') + 1)];
        if (!prefix.StartsWith("169.254.") || room.Members.Any(m => !m.Ip.StartsWith(prefix) || m.Ip.EndsWith(".0") || m.Ip.EndsWith(".255")))
            throw new ConnectionException("The room assigned an invalid link-local address.");
    }
}
