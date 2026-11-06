import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type VisitorMode = "recruiter" | "developer" | "explorer";
export type Theme = "dark" | "light";

/** Key used in localStorage. The theme script in layout.tsx reads the same key. */
export const OS_STORAGE_KEY = "isuruos";

type OSState = {
  /** Who is visiting (chosen in the intro). null until chosen. */
  mode: VisitorMode | null;
  /** Saved theme. null = follow the system setting. */
  theme: Theme | null;
  /** true once the visitor has finished (or skipped) the intro once. */
  setupComplete: boolean;
  /** Is the intro overlay open right now? Not saved: it opens on every page load. */
  introOpen: boolean;

  setMode: (mode: VisitorMode) => void;
  setTheme: (theme: Theme) => void;
  /** The visitor entered the site: hide the intro (mode defaults to "explorer"). */
  closeIntro: () => void;
  replayIntro: () => void;
};

/** Apply a theme to <html> right away (the CSS tokens switch on data-theme). */
export function applyTheme(theme: Theme) {
  if (typeof document !== "undefined")
    document.documentElement.dataset.theme = theme;
}

/** The theme that is showing right now (saved choice, or what the inline script picked). */
export function currentTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export const useOS = create<OSState>()(
  persist(
    (set) => ({
      mode: null,
      theme: null,
      setupComplete: false,
      introOpen: true,

      setMode: (mode) => set({ mode }),
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      closeIntro: () =>
        set((s) => ({
          introOpen: false,
          setupComplete: true,
          mode: s.mode ?? "explorer",
        })),
      replayIntro: () => set({ setupComplete: false, introOpen: true }),
    }),
    {
      name: OS_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // only these are saved; introOpen always starts as true
      partialize: (s) => ({
        mode: s.mode,
        theme: s.theme,
        setupComplete: s.setupComplete,
      }),
      // Don't read localStorage while React hydrates (the server can't see it, so the first
      // client render must match the server). IntroOverlay calls useOS.persist.rehydrate() on mount.
      skipHydration: true,
    },
  ),
);
