/** Height of the fixed nav bar plus a little air, so a section's heading isn't hidden under it. */
const NAV_OFFSET = 72;

/** Smoothly scroll to a section by its id ("home" goes to the very top) and update the URL hash. */
export function scrollToSection(id: string) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const el = document.getElementById(id);
  const top = id === "home" || !el ? 0 : el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  history.replaceState(null, "", id === "home" ? location.pathname : `#${id}`);
}
