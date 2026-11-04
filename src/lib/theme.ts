// Theme helpers shared by the inline bootstrap script (layout.tsx)
// and, later, the zustand store.
//
// Saved data lives in localStorage under one key as JSON:
//   isuruos.v1 = { "mode": "recruiter", "theme": "dark" }
// No saved theme means "follow the OS" (handled in CSS).

export type Theme = "dark" | "light";

export const STORAGE_KEY = "isuruos.v1";

/** Reads the saved theme. Returns null if nothing valid is saved or storage is blocked. */
export function readSavedTheme(): Theme | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const theme = raw ? JSON.parse(raw)?.theme : null;
    return theme === "dark" || theme === "light" ? theme : null;
  } catch {
    return null;
  }
}

/** Puts the theme on <html>. null removes it, so the OS preference applies. */
export function applyTheme(theme: Theme | null) {
  const root = document.documentElement;
  if (theme) root.dataset.theme = theme;
  else delete root.dataset.theme;
}

/** Applies the theme and saves it, keeping any other saved fields (like mode). */
export function saveTheme(theme: Theme | null) {
  applyTheme(theme);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    if (theme) data.theme = theme;
    else delete data.theme;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage blocked (private mode etc.): the theme still applies for this visit.
  }
}

// The same logic as readSavedTheme + applyTheme, as a plain string.
// It runs in <head> while the HTML is parsed, before the first paint,
// so a light-theme visitor never sees a dark flash.
export const themeBootstrapScript = `(function(){try{var s=JSON.parse(localStorage.getItem("${STORAGE_KEY}"));var t=s&&s.theme;if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
