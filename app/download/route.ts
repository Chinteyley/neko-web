import { NextResponse } from "next/server";
import {
  assetsFromGithubRelease,
  chooseTrustedMacOsDownloadUrl,
  latestReleaseApiUrl,
} from "@/lib/macos-release";
import { downloadUrl } from "@/lib/site";

export const revalidate = 300;

async function resolveLatestMacOsDownloadUrl(): Promise<string> {
  try {
    const headers = new Headers({
      Accept: "application/vnd.github+json",
      "User-Agent": "neko-web",
      "X-GitHub-Api-Version": "2022-11-28",
    });

    if (process.env.GITHUB_TOKEN) {
      headers.set("Authorization", `Bearer ${process.env.GITHUB_TOKEN}`);
    }

    const response = await fetch(latestReleaseApiUrl, {
      headers,
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return downloadUrl;
    }

    return chooseTrustedMacOsDownloadUrl(
      assetsFromGithubRelease(await response.json()),
      downloadUrl,
    );
  } catch {
    return downloadUrl;
  }
}

async function redirectToLatestPackage() {
  const target = await resolveLatestMacOsDownloadUrl();
  return NextResponse.redirect(target, 302);
}

export function GET() {
  return redirectToLatestPackage();
}

export function HEAD() {
  return redirectToLatestPackage();
}
