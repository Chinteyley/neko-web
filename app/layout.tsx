import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const site = "https://neko.ctey.dev";
const title = "neko";
const description = "a kitten in the mac menu bar";
const ogImage = `${site}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title,
  description,
  applicationName: "neko",
  alternates: {
    canonical: site,
  },
  openGraph: {
    type: "website",
    url: site,
    title,
    description,
    siteName: "neko",
    locale: "en_US",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "neko",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
