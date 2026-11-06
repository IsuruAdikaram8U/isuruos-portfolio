"use client";

import { currentTheme, useOS } from "@/store/useOS";

/**
 * TEMPORARY. Stands in for the real workspace (top bar + A* hero) so you can test the intro.
 * Replace it when you build the app shell and the Home section.
 */
export default function WorkspacePlaceholder() {
  const mode = useOS((s) => s.mode);
  const setTheme = useOS((s) => s.setTheme);
  const replayIntro = useOS((s) => s.replayIntro);

  return (
    <main className="min-h-screen grid place-items-center px-4 py-24">
      <div className="grid gap-5 max-w-xl">
        <p className="font-mono text-xs text-muted">
          <span className="text-accent">~/workspace</span> · mode: <b className="text-fg font-medium">{mode ?? "not chosen yet"}</b>
        </p>
        <h1 className="font-display text-5xl font-extrabold tracking-tight">
          Isuru <span className="text-accent">Adikaram</span>
        </h1>
        <p className="text-muted">
          You made it through the IsuruOS setup. The A* hero and the rest of the sections will be built here next.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={replayIntro}
            className="h-11 px-5 rounded-xl bg-accent text-accent-ink font-semibold cursor-pointer"
          >
            ↺ Replay intro
          </button>
          <button
            type="button"
            onClick={() => setTheme(currentTheme() === "dark" ? "light" : "dark")}
            className="h-11 px-5 rounded-xl border border-line-2 bg-surface font-semibold cursor-pointer"
          >
            ◐ Toggle theme
          </button>
        </div>
      </div>
    </main>
  );
}
