import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables, KANA_FONT_HREF } from "@/app/fonts";
import { SITE } from "@/lib/config";
import { buildMetadata } from "@/lib/seo";
import { SiteChrome } from "@/components/blocks/SiteChrome";

export const metadata: Metadata = {
  ...buildMetadata("/"),
  metadataBase: new URL(SITE.baseUrl),
  title: {
    default: "Fillo Bakes — eggless Japanese bakery, Bangalore",
    template: "%s | Fillo Bakes",
  },
  icons: { icon: "/brand/fillo-logo-transparent.png" },
};

export const viewport: Viewport = {
  themeColor: "#f7f2ea",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={fontVariables}>
      <head>
        {/* Kana only. Google serves this split by unicode-range, so the
            Japanese chunks download only where a KanaLabel actually renders. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={KANA_FONT_HREF} />
      </head>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
