"use client";

import { SECTIONS } from "@/data/site";
import { useOS } from "@/store/useOS";

/**
 * TEMPORARY. One empty block per section that isn't built yet, so the nav bar has
 * something to scroll to. Each block is replaced by the real section as we build them.
 */
const BUILT = new Set(["home", "education", "skills"]);

export default function WorkspacePlaceholder() {
  const replayIntro = useOS((s) => s.replayIntro);
  const todo = SECTIONS.map((s, i) => ({ ...s, n: i + 1 })).filter((s) => !BUILT.has(s.id));

  return (
    <>
      {todo.map((s, i) => (
        <section key={s.id} id={s.id} className="px-6 border-t border-line grid place-items-center min-h-[80vh]">
          <div className="grid gap-3 text-center">
            <p className="font-mono text-xs text-faint">
              {String(s.n).padStart(2, "0")} / {s.id}
            </p>
            <h2 className="font-display text-5xl font-extrabold tracking-tight">{s.label}</h2>
            <p className="text-muted">Coming soon.</p>
            {i === todo.length - 1 && (
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
    </>
  );
}
