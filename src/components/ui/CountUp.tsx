"use client";

import { useEffect, useRef } from "react";

type Props = { to: number; decimals?: number; start: boolean; duration?: number };

/**
 * A number that counts up from 0 when `start` becomes true.
 * The real value is in the HTML from the start (good for SEO and screen readers);
 * the animation only rewrites the text while it runs.
 */
export default function CountUp({ to, decimals = 0, start, duration = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = to.toFixed(decimals);

  useEffect(() => {
    const el = ref.current;
    if (!el || !start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out: fast first, gentle finish
      el.textContent = (to * eased).toFixed(decimals);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    el.textContent = (0).toFixed(decimals);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      el.textContent = final;
    };
  }, [start, to, decimals, duration, final]);

  return <span ref={ref}>{final}</span>;
}
