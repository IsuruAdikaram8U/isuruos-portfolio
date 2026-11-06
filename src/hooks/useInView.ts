"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * true once the element has scrolled into view (and stays true).
 * Used to start "fade up" and "count up" animations when a block is first seen.
 */
export function useInView(ref: RefObject<Element | null>, threshold = 0.2) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, inView]);

  return inView;
}
