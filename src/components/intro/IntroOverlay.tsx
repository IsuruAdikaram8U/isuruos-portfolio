"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useOS } from "@/store/useOS";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import BinaryPhoto from "./BinaryPhoto";
import TechField from "./TechField";
import "./intro.css";

const EXIT_MS = 1000; // slide-away time

/**
 * The intro: one dark screen. Half of Isuru's face in 0s and 1s on the left,
 * floating tech logos, and "Hello." on the right. Scrolling (or a swipe, a key,
 * or a click) slides it up and away to reveal the site.
 */
export default function IntroOverlay() {
  const introOpen = useOS((st) => st.introOpen);

  // load the saved mode / theme from localStorage (after hydration, see useOS.ts)
  useEffect(() => {
    useOS.persist.rehydrate();
    // Every visit starts at Home: don't let the browser restore an old scroll position
    // or jump to a #section left in the URL from last time.
    history.scrollRestoration = "manual";
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    window.scrollTo(0, 0);
  }, []);

  // Mounted fresh every time the intro opens, so "Replay intro" starts clean.
  return introOpen ? <IntroScreen /> : null;
}

const QUIET_MS = 260; // a gap this long means the scroll gesture has really ended
const MAX_HOLD_MS = 2500;
const SCROLL_KEYS = ["ArrowDown", "PageDown", " ", "End", "Enter"];

/**
 * After the intro closes, keep the page on Home.
 * A trackpad flick (or a held key) keeps sending scroll events for a moment after the
 * intro is gone; those would carry the page halfway down. We swallow them until they
 * stop, so only a NEW scroll moves the page.
 */
function holdAtTop() {
  window.scrollTo(0, 0);
  let quiet = 0;
  const release = () => {
    window.removeEventListener("wheel", block);
    window.removeEventListener("touchmove", block);
    window.removeEventListener("keydown", onKey);
    clearTimeout(quiet);
    clearTimeout(cap);
  };
  const block = (e: Event) => {
    e.preventDefault();
    clearTimeout(quiet);
    quiet = window.setTimeout(release, QUIET_MS);
  };
  const onKey = (e: KeyboardEvent) => {
    if (SCROLL_KEYS.includes(e.key) && e.repeat) block(e);
  };
  window.addEventListener("wheel", block, { passive: false });
  window.addEventListener("touchmove", block, { passive: false });
  window.addEventListener("keydown", onKey);
  quiet = window.setTimeout(release, QUIET_MS);
  const cap = window.setTimeout(release, MAX_HOLD_MS);
}

function IntroScreen() {
  const closeIntro = useOS((st) => st.closeIntro);
  const reduce = useReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const exiting = useRef(false);
  const touchY = useRef<number | null>(null);

  const enter = useCallback(() => {
    if (exiting.current) return; // ignore double triggers
    exiting.current = true;
    window.scrollTo(0, 0);
    setLeaving(true);
    window.setTimeout(
      () => {
        closeIntro();
        holdAtTop();
      },
      reduce ? 0 : EXIT_MS,
    );
  }, [closeIntro, reduce]);

  // the page behind can't scroll while the intro is on screen (also while it slides away)
  useEffect(() => {
    const el = document.documentElement;
    el.style.overflow = "hidden";
    return () => {
      el.style.overflow = "";
    };
  }, []);

  // Enter, ↓, Page Down, Space or Esc also go in
  useEffect(() => {
    if (leaving) return;
    const onKey = (e: KeyboardEvent) => {
      if (["Enter", "ArrowDown", "PageDown", " ", "Escape"].includes(e.key)) {
        e.preventDefault();
        enter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leaving, enter]);

  return (
    <div
      className={`ios-os ${leaving ? "ios-leaving" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Isuru's workspace"
      onWheel={(e) => {
        if (e.deltaY > 8) enter();
      }}
      onTouchStart={(e) => {
        touchY.current = e.touches[0].clientY;
      }}
      onTouchMove={(e) => {
        if (
          touchY.current !== null &&
          touchY.current - e.touches[0].clientY > 40
        ) {
          touchY.current = null;
          enter();
        }
      }}
    >
      <div className="ios-glow" aria-hidden="true" />
      {/* Isuru's photo on the left side, drawn in 0s and 1s in its real colours */}
      <div className="ios-portrait">
        <BinaryPhoto reduce={reduce} />
      </div>
      <TechField />
      <div className="ios-vignette" aria-hidden="true" />

      <div className="ios-copy">
        <p className="ios-hello">
          Hello<span>.</span>
        </p>
        <p className="ios-welcome">
          Welcome to <b>Isuru&apos;s</b> workspace.
        </p>
        <button className="ios-scroll-cue" type="button" onClick={enter}>
          <span className="ios-mouse" aria-hidden="true" />
          <span>Scroll to explore</span>
          <span className="ios-chev" aria-hidden="true">
            ↓
          </span>
        </button>
      </div>
    </div>
  );
}
