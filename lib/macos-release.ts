/** Builds are published on the app repo, not this marketing site. */
export const githubReleaseRepo = "Chinteyley/neko";

export const latestReleaseApiUrl = `https://api.github.com/repos/${githubReleaseRepo}/releases/latest`;

const INSTALL_EXTENSIONS = [".dmg", ".pkg", ".zip"] as const;

type InstallExtension = (typeof INSTALL_EXTENSIONS)[number];

export type ReleaseAsset = {
  name: string;
  browser_download_url: string;
};

function installExtensionOf(name: string): InstallExtension | null {
  const lower = name.toLowerCase();

  if (/\.(sha256|sha256sum|sig|asc|blockmap)$/.test(lower)) {
    return null;
  }

  for (const extension of INSTALL_EXTENSIONS) {
    if (lower.endsWith(extension)) {
      return extension;
    }
  }

  return null;
}

function extensionPriority(extension: InstallExtension): number {
  switch (extension) {
    case ".dmg":
      return 0;
    case ".pkg":
      return 1;
    case ".zip":
      return 2;
    default: {
      const _exhaustive: never = extension;
      return _exhaustive;
    }
  }
}

function looksLikeMacOs(name: string): boolean {
  return /macos|darwin|osx|(^|[^a-z])mac([^a-z]|$)/i.test(name);
}

/**
 * Pick the latest-release macOS install package.
 *
 * Asset names are versioned (`neko-v1.6.2-macOS.dmg`), so GitHub's stable
 * `/releases/latest/download/<asset>` URL cannot be used. Prefer .dmg, then
 * .pkg, then .zip. Ignore checksums and signatures.
 */
export function pickMacOsInstallAsset(
  assets: readonly ReleaseAsset[],
): ReleaseAsset | null {
  const installAssets = assets.filter(
    (asset) => installExtensionOf(asset.name) !== null,
  );

  if (installAssets.length === 0) {
    return null;
  }

  const macNamed = installAssets.filter((asset) => looksLikeMacOs(asset.name));
  const pool = macNamed.length > 0 ? macNamed : installAssets;

  return (
    [...pool].sort((left, right) => {
      const leftExt = installExtensionOf(left.name);
      const rightExt = installExtensionOf(right.name);

      if (!leftExt || !rightExt) {
        return 0;
      }

      return extensionPriority(leftExt) - extensionPriority(rightExt);
    })[0] ?? null
  );
}

export function isTrustedDownloadUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      (parsed.hostname === "github.com" ||
        parsed.hostname.endsWith(".githubusercontent.com"))
    );
  } catch {
    return false;
  }
}

export function assetsFromGithubRelease(release: unknown): ReleaseAsset[] {
  if (!release || typeof release !== "object" || !("assets" in release)) {
    return [];
  }

  const assets = release.assets;
  if (!Array.isArray(assets)) {
    return [];
  }

  return assets.flatMap((asset) => {
    if (!asset || typeof asset !== "object") {
      return [];
    }

    const name = "name" in asset ? asset.name : null;
    const browserDownloadUrl =
      "browser_download_url" in asset ? asset.browser_download_url : null;

    if (typeof name !== "string" || typeof browserDownloadUrl !== "string") {
      return [];
    }

    return [
      {
        name,
        browser_download_url: browserDownloadUrl,
      },
    ];
  });
}

export function chooseTrustedMacOsDownloadUrl(
  assets: readonly ReleaseAsset[],
  fallbackUrl: string,
): string {
  const chosen = pickMacOsInstallAsset(assets);

  if (chosen && isTrustedDownloadUrl(chosen.browser_download_url)) {
    return chosen.browser_download_url;
  }

  return fallbackUrl;
}
