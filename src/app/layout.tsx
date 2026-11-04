import type { Metadata } from "next";
import {
  DM_Sans,
  JetBrains_Mono,
  Noto_Sans_Sinhala,
  Noto_Sans_Tamil,
  Sora,
} from "next/font/google";
import { ThemeSync } from "@/components/shell/ThemeSync";
import { themeBootstrapScript } from "@/lib/theme";
import "./globals.css";

// next/font downloads these at build time and serves them from our own domain.
// Each one becomes a CSS variable that globals.css uses.
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
// opsz = optical size: small text gets slightly sturdier letter shapes.
const dmSans = DM_Sans({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-dm-sans",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});
// Only the Hello screen uses these, so don't preload them on every page load.
const notoSinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  weight: ["600", "700"],
  variable: "--font-noto-sinhala",
  preload: false,
});
const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["600", "700"],
  variable: "--font-noto-tamil",
  preload: false,
});

const fontVariables = [sora, dmSans, jetbrainsMono, notoSinhala, notoTamil]
  .map((f) => f.variable)
  .join(" ");

export const metadata: Metadata = {
  title: "IsuruOS",
  description: "Portfolio of Isuru Adikaram",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline script may add data-theme before
    // React loads, so the server HTML and the browser DOM can differ here on purpose.
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body>
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
