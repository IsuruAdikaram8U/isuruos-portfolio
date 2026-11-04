"use client";

import { useLayoutEffect } from "react";
import { applyTheme, readSavedTheme } from "@/lib/theme";

// In development, React Strict Mode re-mounts the page once and wipes the
// data-theme attribute that the inline script set. This puts it back before
// paint. In production it changes nothing.
export function ThemeSync() {
  useLayoutEffect(() => {
    applyTheme(readSavedTheme());
  }, []);
  return null;
}
