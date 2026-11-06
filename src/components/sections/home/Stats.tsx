"use client";

import { useRef } from "react";
import { stats } from "@/data/profile";
import { useInView } from "@/hooks/useInView";
import CountUp from "@/components/ui/CountUp";

const d = (n: number) => ({ "--d": n }) as React.CSSProperties;

/** Four key numbers under the hero. They fade up and count from 0 when scrolled into view. */
export default function Stats() {
  const ref = useRef<HTMLDListElement>(null);
  const inView = useInView(ref, 0.3);

  return (
    <div id="stats" className="st">
      <dl className="st-grid" ref={ref} data-in={inView}>
        {stats.map((s, i) => (
          <div key={s.label} className="st-item" style={d(i)}>
            <dt className="st-label">{s.label}</dt>
            <dd className="st-value">
              <CountUp to={s.value} decimals={s.decimals} start={inView} />
              {s.suffix && <span className="st-suffix">{s.suffix}</span>}
            </dd>
            <dd className="st-note">{s.note}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
