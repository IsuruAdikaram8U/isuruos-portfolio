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
  }, []);

  // Mounted fresh every time the intro opens, so "Replay intro" starts clean.
  return introOpen ? <IntroScreen /> : null;
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
    window.setTimeout(closeIntro, reduce ? 0 : EXIT_MS);
  }, [closeIntro, reduce]);

  // the page behind can't scroll while the intro covers it
  useEffect(() => {
    if (leaving) return;
    const el = document.documentElement;
    el.style.overflow = "hidden";
    return () => {
      el.style.overflow = "";
    };
  }, [leaving]);

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
