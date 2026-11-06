"use client";

import { SECTIONS } from "@/data/site";
import { useOS } from "@/store/useOS";

/**
 * TEMPORARY. One empty block per section so the nav bar has something to scroll to.
 * Each block is replaced by the real section as we build them.
 */
export default function WorkspacePlaceholder() {
  const replayIntro = useOS((s) => s.replayIntro);

  return (
    <main>
      {SECTIONS.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          className={`px-6 border-b border-line grid place-items-center ${i === 0 ? "min-h-screen" : "min-h-[80vh]"}`}
        >
          <div className="grid gap-3 text-center">
            <p className="font-mono text-xs text-faint">
              {String(i + 1).padStart(2, "0")} / {s.id}
            </p>
            <h2 className="font-display text-5xl font-extrabold tracking-tight">{s.label}</h2>
            <p className="text-muted">Coming soon.</p>
            {i === 0 && (
              <button
                type="button"
                onClick={() => {
                  window.scrollTo(0, 0);
                  replayIntro();
                }}
                className="mx-auto mt-2 h-10 px-5 rounded-full border border-line-2 bg-surface text-sm font-semibold cursor-pointer"
              >
                ↺ Replay intro
              </button>
            )}
          </div>
        </section>
      ))}
    </main>
  );
}
