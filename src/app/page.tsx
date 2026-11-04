"use client";

// TEMPORARY test page for step 0.1 (theme + fonts).
// It gets replaced by the real app shell in step 0.3.

import { saveTheme, type Theme } from "@/lib/theme";

const swatches = [
  "bg",
  "bg-2",
  "surface",
  "surface-2",
  "line",
  "line-2",
  "fg",
  "muted",
  "faint",
  "accent",
  "warm",
  "ok",
  "violet",
];

const themeButtons: { label: string; value: Theme | null }[] = [
  { label: "dark", value: "dark" },
  { label: "light", value: "light" },
  { label: "follow OS", value: null },
];

export default function ThemeTestPage() {
  return (
    <main className="mx-auto grid max-w-[1280px] gap-12 px-4 py-16">
      <header className="grid gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-faint">
          step 0.1 · theme test
        </p>
        <h1 className="font-display text-[clamp(46px,7.2vw,96px)] leading-[0.95] font-extrabold tracking-[-0.045em] text-balance">
          Isuru <span className="text-accent">Adikaram</span>
        </h1>
        <div className="flex flex-wrap gap-2">
          {themeButtons.map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() => saveTheme(b.value)}
              className="h-[46px] rounded-xl border border-line-2 bg-surface px-5 font-semibold hover:border-accent"
            >
              {b.label}
            </button>
          ))}
          <button
            type="button"
            className="h-[46px] rounded-xl bg-accent px-5 font-semibold text-accent-ink"
          >
            primary button
          </button>
        </div>
      </header>

      <section className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
        {swatches.map((name) => (
          <div
            key={name}
            className="overflow-hidden rounded-2xl border border-line bg-surface"
          >
            <div className="h-16" style={{ background: `var(--${name})` }} />
            <p className="bg-surface-2 px-3 py-2 font-mono text-xs text-muted">
              --{name}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 rounded-2xl border border-line bg-surface p-6">
        <p className="font-display text-[clamp(21px,2.1vw,26px)] font-medium">
          Sora: display headings and numbers 0123456789
        </p>
        <p className="max-w-[62ch] text-muted">
          DM Sans: body text. Every section of this portfolio is a real CS
          concept you can play with by scrolling and with the mouse.
        </p>
        <p className="font-mono text-sm">
          JetBrains Mono: <span className="text-accent">astar</span>(start: me,
          goal: <span className="text-warm">you</span>) · O(E log V)
        </p>
        <p className="font-si text-4xl font-bold">ආයුබෝවන්</p>
        <p className="font-ta text-4xl font-bold">வணக்கம்</p>
      </section>
    </main>
  );
}
