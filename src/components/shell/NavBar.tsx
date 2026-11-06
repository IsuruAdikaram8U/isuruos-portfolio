"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LINKS, SECTIONS, type SectionId } from "@/data/site";
import { useOS } from "@/store/useOS";
import { scrollToSection } from "@/lib/scroll";
import { GithubIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import "./nav.css";

/**
 * The top navigation bar.
 * - At the top of the page it is see-through; once you scroll it turns into a floating glass bar.
 * - A soft pill slides under the link you hover (or the section you are reading).
 * - A thin line along the bottom shows how far down the page you are.
 * - On small screens the links move into a full-screen menu.
 */
export default function NavBar() {
  const introOpen = useOS((s) => s.introOpen);

  const [active, setActive] = useState<SectionId>("home");
  const [hovered, setHovered] = useState<SectionId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef(new Map<SectionId, HTMLAnchorElement>());

  // --- which section is in the middle of the screen right now ---
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) if (en.isIntersecting) setActive(en.target.id as SectionId);
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  // --- glass bar after scrolling + reading progress line ---
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 12);
      progressRef.current?.style.setProperty("--p", String(max > 0 ? Math.min(1, y / max) : 0));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // --- move the sliding pill under the hovered link (or the active one) ---
  const placePill = useCallback(() => {
    const pill = pillRef.current;
    const link = linkRefs.current.get(hovered ?? active);
    if (!pill || !link) return;
    pill.style.setProperty("--x", `${link.offsetLeft}px`);
    pill.style.setProperty("--w", `${link.offsetWidth}px`);
    if (!pill.dataset.on) {
      // first time: jump into place without sliding in from the left
      requestAnimationFrame(() => (pill.dataset.on = "true"));
    }
  }, [hovered, active]);

  useEffect(() => {
    placePill();
  }, [placePill]);

  // re-measure when the fonts finish loading or the bar changes size
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ro = new ResizeObserver(() => placePill());
    ro.observe(list);
    document.fonts?.ready.then(() => placePill());
    return () => ro.disconnect();
  }, [placePill]);

  // --- mobile menu: lock the page, close on Esc, close when the screen gets wide ---
  useEffect(() => {
    if (!menuOpen) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    const wide = window.matchMedia("(min-width: 1180px)");
    const onWide = () => wide.matches && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      html.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [menuOpen]);

  const go = (e: React.MouseEvent, id: SectionId) => {
    e.preventDefault();
    setMenuOpen(false);
    document.documentElement.style.overflow = ""; // unlock right away so the scroll can run
    scrollToSection(id);
  };

  return (
    <>
      <header className="nv" data-ready={!introOpen} data-scrolled={scrolled || menuOpen}>
        <div className="nv-bar">
          <a className="nv-brand" href="#home" onClick={(e) => go(e, "home")} aria-label="Isuru Adikaram, back to top">
            Isuru<span>.</span>
          </a>

          <nav className="nv-links" aria-label="Sections" ref={listRef} onMouseLeave={() => setHovered(null)}>
            <span className="nv-pill" ref={pillRef} aria-hidden="true" />
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                ref={(el) => {
                  if (el) linkRefs.current.set(s.id, el);
                }}
                className="nv-link"
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                onMouseEnter={() => setHovered(s.id)}
                onFocus={() => setHovered(s.id)}
                onBlur={() => setHovered(null)}
                onClick={(e) => go(e, s.id)}
              >
                {s.label}
              </a>
            ))}
          </nav>

          <div className="nv-actions">
            <a className="nv-cta" href={LINKS.cv} target="_blank" rel="noopener">
              <span>Resume</span>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M3 13h10" />
              </svg>
            </a>
            <button
              className="nv-burger"
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="nv-sheet"
              data-open={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>

          <span className="nv-progress" ref={progressRef} aria-hidden="true" />
        </div>
      </header>

      {/* full-screen menu for phones and tablets */}
      <div id="nv-sheet" className="nv-sheet" data-open={menuOpen} aria-hidden={!menuOpen} inert={!menuOpen}>
        <nav className="nv-sheet-links" aria-label="Sections">
          {SECTIONS.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{ "--i": i } as React.CSSProperties}
              aria-current={active === s.id ? "true" : undefined}
              onClick={(e) => go(e, s.id)}
            >
              <span className="nv-num">{String(i + 1).padStart(2, "0")}</span>
              {s.label}
            </a>
          ))}
        </nav>
        <div className="nv-sheet-foot" style={{ "--i": SECTIONS.length } as React.CSSProperties}>
          <a className="nv-icon" href={LINKS.github} target="_blank" rel="noopener" aria-label="GitHub">
            <GithubIcon />
          </a>
          <a className="nv-icon" href={LINKS.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
            <LinkedinIcon />
          </a>
          <a className="nv-cta" href={LINKS.cv} target="_blank" rel="noopener">
            <span>Resume</span>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M3 13h10" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
