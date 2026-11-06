import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Noto_Sans_Sinhala, Noto_Sans_Tamil, Sora } from "next/font/google";
import "./globals.css";

// Fonts become CSS variables; globals.css turns them into --f-display, --f-body, --f-mono, ...
const sora = Sora({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-sora", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-dm-sans", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-jetbrains", display: "swap" });
const sinhala = Noto_Sans_Sinhala({ subsets: ["sinhala"], weight: ["600", "700"], variable: "--font-sinhala", display: "swap" });
const tamil = Noto_Sans_Tamil({ subsets: ["tamil"], weight: ["600", "700"], variable: "--font-tamil", display: "swap" });

export const metadata: Metadata = {
  title: "Isuru Adikaram · IsuruOS",
  description: "Portfolio of Isuru Adikaram, full-stack and backend developer at the University of Moratuwa.",
};

/**
 * Runs before the first paint: picks the saved theme (or the system theme) and sets
 * <html data-theme="...">, so the page never flashes in the wrong colours.
 * It reads the same localStorage key as the zustand store (src/store/useOS.ts).
 */
const themeScript = `(function(){try{var s=JSON.parse(localStorage.getItem("isuruos")||"null");var t=s&&s.state&&s.state.theme;if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${sora.variable} ${dmSans.variable} ${jetbrains.variable} ${sinhala.variable} ${tamil.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
