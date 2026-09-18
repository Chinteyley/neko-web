import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import {
  authorName,
  authorUrl,
  description,
  downloadUrl,
  imageAlt,
  projectPageUrl,
  repoUrl,
  site,
  title,
} from "@/lib/site";
import "./globals.css";

const ogImage = `${site}/og.png`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Neko",
  description,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "macOS",
  url: site,
  downloadUrl,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: authorName,
    url: authorUrl,
  },
  sameAs: [repoUrl, projectPageUrl],
};

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title,
  description,
  applicationName: "Neko",
  authors: [{ name: authorName, url: authorUrl }],
  alternates: {
    canonical: site,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: site,
    title,
    description,
    siteName: "Neko",
    locale: "en_US",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: imageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: ogImage, alt: imageAlt }],
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
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
