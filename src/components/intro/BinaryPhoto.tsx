"use client";

import { useEffect, useRef } from "react";

/**
 * Isuru's photo, drawn entirely with 0s and 1s in the photo's real colours.
 *
 * How it works:
 * 1. Shrink the photo to one pixel per character cell (same size and position
 *    as the normal photo, so nothing moves).
 * 2. In every cell, draw a "0" or "1" in that pixel's colour.
 *    Transparent pixels (the removed background) get no digit.
 * 3. On load, the digits appear from top to bottom: each one flickers between
 *    0 and 1 for a moment (in its real colour), then settles.
 * 4. After that, a few digits quietly flip between 0 and 1.
 */

const PHOTO = "/images/isuru-cutout.webp";

/** Digits are thin, so the picture looks darker than the photo. These lift it back:
 *  colour = LIFT + original * GAIN (dark hair stays dark but still visible). */
const GAIN = 1.12;
const LIFT = 26;

/** Target number of digit columns across the picture (more = more detail). */
const COLUMNS = 220;

/** Reveal timing (ms): the scan takes SWEEP_MS top to bottom, each digit
 *  starts up to JITTER_MS early/late, and flickers for DECODE_MS before settling. */
const SWEEP_MS = 1300;
const JITTER_MS = 450;
const DECODE_MS = 280;

/** How often (ms) the finished picture flips a few digits. */
const FLIP_MS = 220;

type Cell = {
  x: number;
  y: number;
  color: string;
  ch: string;
  delay: number; // when this digit starts decoding
  state: 0 | 1 | 2; // 0 = hidden, 1 = decoding, 2 = settled
};

export default function BinaryPhoto({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let cancelled = false;
    let flicker = 0;
    let raf = 0;
    let cells: Cell[] = [];
    let cellW = 0;
    let cellH = 0;
    let font = "";
    let builtW = 0; // size the cells were built for
    let builtH = 0;

    const img = new Image();
    img.src = PHOTO;
    // next/font gives JetBrains Mono a generated name; read it from the CSS variable
    const family =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-jetbrains")
        .trim() || "monospace";

    const drawCell = (c: Cell, color = c.color, ch = c.ch) => {
      ctx.fillStyle = color;
      ctx.fillText(ch, c.x + cellW / 2, c.y + cellH / 2);
    };
    const clearCell = (c: Cell) => ctx.clearRect(c.x, c.y, cellW, cellH);
    const randomDigit = () => (Math.random() < 0.5 ? "0" : "1");

    /** Measure the canvas and sample the photo into digit cells. */
    function build() {
      if (!canvas || !ctx) return false;
      // layout size (not affected by the slow "breathing" zoom on the parent)
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (!W || !H || !img.naturalWidth) return false;
      builtW = W;
      builtH = H;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // monospace digits are about 0.6em wide; rows are packed a bit tighter
      cellW = W / COLUMNS;
      const fontPx = cellW / 0.6;
      cellH = fontPx * 0.82;
      font = `600 ${fontPx}px ${family}`;
      const cols = COLUMNS;
      const rows = Math.floor(H / cellH);

      // shrink the photo to one pixel per cell, then read the colours
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      o.drawImage(img, 0, 0, cols, rows);
      const px = o.getImageData(0, 0, cols, rows).data;

      const lift = (v: number) => Math.min(255, Math.round(LIFT + v * GAIN));
      const next: Cell[] = [];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = (j * cols + i) * 4;
          const a = px[k + 3];
          if (a < 24) continue; // background: no digit
          next.push({
            x: i * cellW,
            y: j * cellH,
            color: `rgba(${lift(px[k])},${lift(px[k + 1])},${lift(px[k + 2])},${(a / 255).toFixed(2)})`,
            ch: randomDigit(),
            // top rows start first; a little randomness makes the scan line uneven
            delay: (j / rows) * SWEEP_MS + Math.random() * JITTER_MS,
            state: 0,
          });
        }
      }
      cells = next;

      ctx.clearRect(0, 0, W, H);
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      return true;
    }

    /** Clear the canvas and draw the finished picture in one go. A full redraw
     *  leaves no leftover marks from digits that were drawn earlier. */
    function drawAll() {
      if (!ctx) return;
      ctx.clearRect(0, 0, builtW, builtH);
      for (const c of cells) {
        c.state = 2;
        drawCell(c);
      }
    }

    /** The decode reveal. Only cells that change are redrawn, so it stays smooth. */
    function reveal(onDone: () => void) {
      let start = 0;
      let frame = 0;
      const step = (now: number) => {
        if (!start) start = now;
        const t = now - start;
        const scramble = frame++ % 2 === 0; // new random digits every other frame
        let pending = 0;
        for (const c of cells) {
          if (c.state === 2) continue;
          pending++;
          if (t < c.delay) continue;
          if (t < c.delay + DECODE_MS) {
            // appearing: a flickering random digit, already in its real colour
            if (c.state === 0 || scramble) {
              c.state = 1;
              clearCell(c);
              drawCell(c, c.color, randomDigit());
            }
          } else {
            // settled: the real colour and its final digit
            c.state = 2;
            clearCell(c);
            drawCell(c);
          }
        }
        if (pending && !cancelled) raf = requestAnimationFrame(step);
        else {
          drawAll(); // one clean redraw when the reveal ends
          onDone();
        }
      };
      raf = requestAnimationFrame(step);
    }

    /** Flip a few random digits, then redraw the whole picture cleanly. */
    function flip() {
      const n = Math.max(1, Math.round(cells.length * 0.008));
      for (let i = 0; i < n; i++) {
        const c = cells[(Math.random() * cells.length) | 0];
        if (c) c.ch = c.ch === "0" ? "1" : "0";
      }
      drawAll();
    }

    // on resize, rebuild and show the finished picture straight away
    // (the browser also reports the size once when watching starts; that report
    // must not cut the reveal short, so only a real size change rebuilds)
    const ro = new ResizeObserver(() => {
      if (!cells.length) return;
      if (canvas.clientWidth === builtW && canvas.clientHeight === builtH)
        return;
      cancelAnimationFrame(raf);
      if (build()) drawAll();
    });

    Promise.all([img.decode(), document.fonts.load(`600 10px ${family}`)])
      .catch(() => undefined)
      .then(() => {
        if (cancelled || !build()) return;
        ro.observe(canvas);
        if (reduce) {
          drawAll(); // reduced motion: no reveal, no flicker
          return;
        }
        reveal(() => {
          if (!cancelled) flicker = window.setInterval(flip, FLIP_MS);
        });
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearInterval(flicker);
      ro.disconnect();
    };
  }, [reduce]);

  return <canvas ref={ref} aria-hidden="true" />;
}
