"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { education, educationRoad, type EducationStop } from "@/data/profile";
import { useInView } from "@/hooks/useInView";
import SectionHeader from "@/components/ui/SectionHeader";
import "./education.css";

/**
 * Education as a road. The newest stop (university, still going) is at the top,
 * school is further down, and the road begins at the bottom. A sign at the very
 * top shows where the road goes next. The centre line lights up as you scroll.
 */
export default function Education() {
  const roadRef = useRef<HTMLDivElement>(null);

  // light the road from the top as the visitor scrolls through it
  useEffect(() => {
    const el = roadRef.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const reach = window.innerHeight * 0.6 - r.top; // how far the "headlight" has got
      const p = Math.max(0, Math.min(1, reach / r.height));
      el.style.setProperty("--lit", p.toFixed(4));
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

  return (
    <section id="education" className="ed" aria-labelledby="education-title">
      <SectionHeader id="education" title="The road so far" sub="From school to university. The newest stop is at the top, and the road keeps going." />

      <div className="ed-map" ref={roadRef}>
        <div className="ed-road" aria-hidden="true">
          <span className="ed-lane" />
          <span className="ed-lit" />
        </div>

        <p className="ed-sign">
          <span className="ed-sign-tag">next stop</span>
          <span>{educationRoad.next}</span>
        </p>

        <ol className="ed-stops">
          {education.map((stop, i) => (
            <Stop key={stop.id} stop={stop} side={i % 2 === 0 ? "left" : "right"} />
          ))}
        </ol>

        <p className="ed-start">
          <span className="ed-start-dot" aria-hidden="true" />
          <span className="ed-sign-tag">start · {educationRoad.start.year}</span>
          <span>{educationRoad.start.place}</span>
        </p>
      </div>
    </section>
  );
}

function Stop({ stop, side }: { stop: EducationStop; side: "left" | "right" }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, 0.35);

  return (
    <li ref={ref} className="ed-stop" data-side={side} data-in={inView} data-current={stop.current ?? false}>
      <article className="ed-card">
        <div className="ed-card-top">
          <span className="ed-logo">
            {/* unoptimized: serve the crest file as it is, so Next.js doesn't shrink or re-compress it */}
            <Image src={stop.logo.src} alt={stop.logo.alt} width={stop.logo.width} height={stop.logo.height} unoptimized />
          </span>
          <span className="ed-meta">
            <span className="ed-level">{stop.level}</span>
            <span className="ed-years">{stop.years}</span>
          </span>
          {stop.current && (
            <span className="ed-now">
              <span aria-hidden="true" />
              now
            </span>
          )}
        </div>

        <h3 className="ed-school">{stop.school}</h3>
        <p className="ed-qual">{stop.qualification}</p>
        {stop.status && (
          <p className="ed-status">
            <span aria-hidden="true">▸</span> {stop.status} <span className="ed-status-dim">· still learning</span>
          </p>
        )}

        <p className="ed-headline">
          <b>{stop.headline.value}</b>
          <span>{stop.headline.label}</span>
        </p>

        {stop.highlight && (
          <p className="ed-highlight">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 1.8 9.8 5.6l4.1.5-3 2.9.8 4.1L8 11.1l-3.7 2 .8-4.1-3-2.9 4.1-.5L8 1.8Z" />
            </svg>
            {stop.highlight}
          </p>
        )}

        {stop.results.length > 0 && (
          <ul className="ed-chips">
            {stop.results.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        )}

        {stop.gpaPath && <GpaPath path={stop.gpaPath} show={inView} />}
      </article>

      <span className="ed-pin" aria-hidden="true">
        <StopIcon id={stop.id} />
      </span>

      <span className="ed-year" aria-hidden="true">
        {stop.year}
      </span>
    </li>
  );
}

/**
 * Semester GPAs as a straight little road: one checkpoint per semester.
 * Dean's List semesters are big glowing checkpoints with a star and a tag;
 * the semester that's still running is a dashed "?" at the end.
 */
function GpaPath({ path, show }: { path: NonNullable<EducationStop["gpaPath"]>; show: boolean }) {
  const n = path.length;
  const lastDone = path.reduce((acc, p, i) => (p.value !== null ? i : acc), 0);
  const col = 100 / n; // each checkpoint sits in the middle of its own column

  return (
    <div className="ed-gpa" data-show={show}>
      <p className="ed-gpa-title">
        <span>Semester GPA</span>
        <span className="ed-gpa-key">
          <i aria-hidden="true" /> Dean&apos;s List
        </span>
      </p>

      <div className="ed-gpa-road">
        {/* finished part of the road (solid), then the part still ahead (dashed) */}
        <span
          className="ed-gpa-done"
          aria-hidden="true"
          style={{ left: `${col / 2}%`, width: `${lastDone * col}%` }}
        />
        <span
          className="ed-gpa-ahead"
          aria-hidden="true"
          style={{ left: `${col / 2 + lastDone * col}%`, width: `${(n - 1 - lastDone) * col}%` }}
        />

        <ol className="ed-gpa-list" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {path.map((p, i) => {
          const open = p.value === null;
          return (
            <li
              key={p.term}
              className="ed-gpa-cp"
              data-dl={p.deansList ?? false}
              data-open={open}
              style={{ "--i": i } as React.CSSProperties}
            >
              <b className="ed-gpa-val">{open ? "?" : p.value?.toFixed(2)}</b>
              <span className="ed-gpa-node" aria-hidden="true">
                {p.deansList && (
                  <svg viewBox="0 0 16 16">
                    <path d="M8 1.8 9.8 5.6l4.1.5-3 2.9.8 4.1L8 11.1l-3.7 2 .8-4.1-3-2.9 4.1-.5L8 1.8Z" />
                  </svg>
                )}
              </span>
              <span className="ed-gpa-term">
                {p.term}
                {open && " · now"}
              </span>
              {p.deansList && <span className="ed-gpa-tag">Dean&apos;s List</span>}
              {open && <span className="sr-only">in progress</span>}
            </li>
          );
        })}
        </ol>
      </div>
    </div>
  );
}

/** graduation cap (university), flask (A/L science), open book (O/L) */
function StopIcon({ id }: { id: EducationStop["id"] }) {
  return (
    <svg viewBox="0 0 24 24">
      {id === "uni" && (
        <>
          <path d="M2.5 9 12 4.5 21.5 9 12 13.5 2.5 9Z" />
          <path d="M6.5 11v4.5c1.6 1.6 3.4 2.3 5.5 2.3s3.9-.7 5.5-2.3V11" />
          <path d="M21.5 9v5" />
        </>
      )}
      {id === "al" && (
        <>
          <path d="M9.5 3.5h5M10.5 3.5v5.2L5.2 18a1.8 1.8 0 0 0 1.6 2.6h10.4a1.8 1.8 0 0 0 1.6-2.6l-5.3-9.3V3.5" />
          <path d="M7.6 14.5h8.8" />
        </>
      )}
      {id === "ol" && (
        <>
          <path d="M12 6.5C10.2 5.2 7.7 4.5 3.5 4.5v13c4.2 0 6.7.7 8.5 2 1.8-1.3 4.3-2 8.5-2v-13c-4.2 0-6.7.7-8.5 2Z" />
          <path d="M12 6.5v13" />
        </>
      )}
    </svg>
  );
}
