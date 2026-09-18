import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  chooseTrustedMacOsDownloadUrl,
  pickMacOsInstallAsset,
} from "./macos-release.ts";

describe("pickMacOsInstallAsset", () => {
  it("picks the versioned macOS dmg and ignores checksums", () => {
    const chosen = pickMacOsInstallAsset([
      {
        name: "neko-v1.6.2-macOS.dmg.sha256",
        browser_download_url: "https://example.com/checksum",
      },
      {
        name: "neko-v1.6.2-macOS.dmg",
        browser_download_url: "https://example.com/neko.dmg",
      },
    ]);

    assert.equal(chosen?.name, "neko-v1.6.2-macOS.dmg");
  });

  it("prefers dmg over zip when both exist", () => {
    const chosen = pickMacOsInstallAsset([
      {
        name: "neko-v1.6.0-macOS.zip",
        browser_download_url: "https://example.com/neko.zip",
      },
      {
        name: "neko-v1.6.0-macOS.dmg",
        browser_download_url: "https://example.com/neko.dmg",
      },
    ]);

    assert.equal(chosen?.name, "neko-v1.6.0-macOS.dmg");
  });

  it("falls back to the zip used by older releases", () => {
    const chosen = pickMacOsInstallAsset([
      {
        name: "neko-v1.6.0-macOS.zip.sha256",
        browser_download_url: "https://example.com/checksum",
      },
      {
        name: "neko-v1.6.0-macOS.zip",
        browser_download_url: "https://example.com/neko.zip",
      },
    ]);

    assert.equal(chosen?.name, "neko-v1.6.0-macOS.zip");
  });

  it("returns null when only checksums are published", () => {
    const chosen = pickMacOsInstallAsset([
      {
        name: "neko-v1.6.2-macOS.dmg.sha256",
        browser_download_url: "https://example.com/checksum",
      },
    ]);

    assert.equal(chosen, null);
  });

  it("prefers an explicit macOS name over a generic installer", () => {
    const chosen = pickMacOsInstallAsset([
      {
        name: "neko-windows.exe",
        browser_download_url: "https://example.com/neko.exe",
      },
      {
        name: "notes.zip",
        browser_download_url: "https://example.com/notes.zip",
      },
      {
        name: "neko-v1.6.2-macOS.dmg",
        browser_download_url: "https://example.com/neko.dmg",
      },
    ]);

    assert.equal(chosen?.name, "neko-v1.6.2-macOS.dmg");
  });

  it("returns a trusted GitHub asset URL and otherwise the fallback", () => {
    const fallback = "https://github.com/Chinteyley/neko/releases/latest";

    assert.equal(
      chooseTrustedMacOsDownloadUrl(
        [
          {
            name: "neko-v1.6.2-macOS.dmg",
            browser_download_url:
              "https://github.com/Chinteyley/neko/releases/download/v1.6.2/neko-v1.6.2-macOS.dmg",
          },
        ],
        fallback,
      ),
      "https://github.com/Chinteyley/neko/releases/download/v1.6.2/neko-v1.6.2-macOS.dmg",
    );

    assert.equal(
      chooseTrustedMacOsDownloadUrl(
        [
          {
            name: "neko-v1.6.2-macOS.dmg",
            browser_download_url: "https://evil.example/neko.dmg",
          },
        ],
        fallback,
      ),
      fallback,
    );
  });
});
