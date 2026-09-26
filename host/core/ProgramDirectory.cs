namespace Frlg.Trade.Core;

// AppImages run from a read-only mount, so program files go next to the AppImage file.
public static class ProgramDirectory
{
    public static string Path { get; } = Find(AppContext.BaseDirectory,
        Environment.GetEnvironmentVariable("APPIMAGE"), Environment.GetEnvironmentVariable("APPDIR"));

    // APPIMAGE/APPDIR are inherited by child processes; use them only when running from that mount.
    public static string Find(string baseDirectory, string? appImage, string? appDir)
    {
        bool mounted = !string.IsNullOrEmpty(appImage) && !string.IsNullOrEmpty(appDir) &&
            baseDirectory.StartsWith(appDir.TrimEnd('/') + "/", StringComparison.Ordinal);
        return mounted ? System.IO.Path.GetDirectoryName(appImage) ?? baseDirectory : baseDirectory;
    }
}
