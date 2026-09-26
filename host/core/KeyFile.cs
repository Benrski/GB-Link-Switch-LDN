namespace Frlg.Trade.Core;

public sealed class MissingKeysException(string directory) : FileNotFoundException(
    $"prod.keys not found. Place the file in the program directory and retry.\n{directory}")
{ public string DirectoryPath { get; } = directory; }

public sealed class KeyFile
{
    private readonly Dictionary<string, byte[]> values = new(StringComparer.OrdinalIgnoreCase);
    public string SourcePath { get; }
    public KeyFile(string path)
    {
        SourcePath = path;
        int number = 0;
        foreach (var raw in File.ReadLines(path))
        {
            number++;
            string line = raw.Trim();
            if (line.Length == 0 || line.StartsWith('#') || line.StartsWith(';')) continue;
            var parts = line.Split('=', 2, StringSplitOptions.TrimEntries);
            if (parts.Length != 2) throw new InvalidDataException($"prod.keys line {number} is malformed: {path}");
            try
            {
                if (!values.TryAdd(parts[0], Convert.FromHexString(parts[1]))) throw new FormatException();
            }
            catch (FormatException) { throw new InvalidDataException($"prod.keys line {number} is malformed or repeats a key: {path}"); }
        }
        Get("aes_kek_generation_source"); Get("aes_key_generation_source");
        if (!values.ContainsKey("master_key_00") && !values.ContainsKey("master_key_12"))
            throw new InvalidDataException($"prod.keys has no supported master_key: {path}");
    }
    public byte[] Get(string name)
    {
        if (!values.TryGetValue(name, out var key) || key.Length != 16)
            throw new InvalidDataException($"prod.keys has no valid {name}: {SourcePath}");
        return key;
    }
    public bool Supports(int protocol) => values.ContainsKey(protocol == 1 ? "master_key_00" : "master_key_12");
    public static string? Locate(string executableDirectory, string userDirectory)
    {
        string local = Path.Combine(executableDirectory, "prod.keys");
        if (File.Exists(local)) return local;
        string home = Path.Combine(userDirectory, ".switch", "prod.keys");
        return File.Exists(home) ? home : null;
    }
    public static string Find(string executableDirectory, string userDirectory) =>
        Locate(executableDirectory, userDirectory) ?? throw new MissingKeysException(executableDirectory);
    private static string UserDirectory => Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
    public static bool Present => Locate(ProgramDirectory.Path, UserDirectory) != null;
    public static KeyFile LoadDefault() => new(Find(ProgramDirectory.Path, UserDirectory));

    public static readonly string[] Used = ["aes_kek_generation_source", "aes_key_generation_source", "master_key_00", "master_key_12"];

    // Copies only the entries in Used; a full prod.keys holds far more than needed.
    public static KeyFile Import(string source, string programDirectory)
    {
        var keys = new KeyFile(source);
        var lines = Used.Where(keys.values.ContainsKey).Select(name => $"{name} = {Convert.ToHexString(keys.values[name]).ToLowerInvariant()}");
        Directory.CreateDirectory(programDirectory);
        string target = Path.Combine(programDirectory, "prod.keys"), temp = target + ".tmp";
        var options = new FileStreamOptions { Mode = FileMode.Create, Access = FileAccess.Write };
        if (!OperatingSystem.IsWindows()) options.UnixCreateMode = UnixFileMode.UserRead | UnixFileMode.UserWrite;
        using (var writer = new StreamWriter(temp, options)) foreach (string line in lines) writer.WriteLine(line);
        File.Move(temp, target, true);
        return new KeyFile(target);
    }
}
