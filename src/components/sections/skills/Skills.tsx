"use client";

import { useRef } from "react";
import Image from "next/image";
import { skillGroups, type SkillGroup } from "@/data/profile";
import { useInView } from "@/hooks/useInView";
import SectionHeader from "@/components/ui/SectionHeader";
import "./skills.css";

// The map is drawn on a 1240 × 1000 board (the CSS keeps the same shape at any width).
const W = 1240;
const H = 1000;
const RX = 0.36 * W; // how far the cards sit from the hub, sideways…
const RY = 0.3 * W; // …and up/down (an ellipse, because the board is wider than tall)

const total = skillGroups.reduce((n, g) => n + g.items.length, 0);

const CX = W / 2;
const CY = H / 2;
// The hub core's radius is 74 (148 of 1240 wide, see .sk-hub-core). Each pad (r 7 + its
// 5-wide halo) sits just outside, touching the edge, so the whole dot shows.
const PAD_R = 74 + 9.5;
const CARD_HALF_W = 0.1125 * W; // half a card's width (cards are 22.5cqw wide)
const ENTRY = 64; // straight run into the side of a card

type Pt = [number, number];

/**
 * A circuit-board style route from the hub to a card. It leaves the hub from a pad,
 * runs straight up/down, takes one 45° diagonal, then goes straight into the side
 * of the card. Top and bottom cards get a plain straight trace.
 */
function route(cos: number, sin: number) {
  const pad: Pt = [CX + cos * PAD_R, CY + sin * PAD_R];
  const card: Pt = [CX + cos * RX, CY + sin * RY];

  if (Math.abs(cos) < 0.01) {
    return { d: `M${pad[0]},${pad[1]} L${card[0]},${card[1]}`, pad, vias: [] as Pt[] };
  }

  const sx = Math.sign(cos);
  const sy = Math.sign(sin);
  const rise = Math.abs(card[1] - pad[1]); // how far up/down the trace has to go
  const entryX = card[0] - sx * (CARD_HALF_W + ENTRY); // where the straight run into the card starts
  const diag = Math.max(0, Math.min(rise, (entryX - pad[0]) * sx)); // 45° part
  const lead = rise - diag; // straight up/down part before the bend

  const b1: Pt = [pad[0], pad[1] + sy * lead];
  const b2: Pt = [b1[0] + sx * diag, card[1]];
  const vias = lead > 1 ? [b1, b2] : [b2];
  return { d: `M${pad[0]},${pad[1]} V${b1[1]} L${b2[0]},${b2[1]} H${card[0]}`, pad, vias };
}

/** each card's direction: equal angles (6 groups → 60° apart), the first one straight up */
const spokes = skillGroups.map((g, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / skillGroups.length;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return { group: g, cos, sin, ...route(cos, sin) };
});

/**
 * Skills as a hub with spokes: the CV's skill groups sit at equal angles around
 * a centre point. When the map scrolls into view, the cards burst out of the hub
 * and the spokes draw in. On narrow screens it becomes a simple grid.
 */
export default function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, 0.25);

  return (
    <section id="skills" className="sk" aria-labelledby="skills-title">
      <SectionHeader id="skills" title="What I build with" sub="The technologies from my CV, in six groups." />

      <div className="sk-map" ref={ref} data-in={inView}>
        {/* circuit traces from the hub to each card */}
        <svg className="sk-traces" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
          {spokes.map((s, i) => (
            <g key={s.group.id} style={{ "--i": i } as React.CSSProperties}>
              <path className="sk-copper" d={s.d} />
              <path className="sk-trace" d={s.d} pathLength={1000} />
              <path className="sk-pulse" d={s.d} pathLength={1000} />
              {s.vias.map(([x, y]) => (
                <circle key={`${x},${y}`} className="sk-via" cx={x} cy={y} r={4} />
              ))}
              <circle className="sk-pad" cx={s.pad[0]} cy={s.pad[1]} r={7} />
            </g>
          ))}
        </svg>

        <div className="sk-hub" aria-hidden="true">
          <span className="sk-hub-ring" />
          <span className="sk-hub-ring" />
          <span className="sk-hub-core">
            <b>{total}</b>
            <span>technologies</span>
          </span>
        </div>

        {spokes.map((s, i) => (
          <SkillCard key={s.group.id} group={s.group} cos={s.cos} sin={s.sin} index={i} />
        ))}
      </div>
    </section>
  );
}

function SkillCard({ group, cos, sin, index }: { group: SkillGroup; cos: number; sin: number; index: number }) {
  return (
    <article
      className="sk-card"
      data-id={group.id}
      style={{ "--cos": cos.toFixed(4), "--sin": sin.toFixed(4), "--i": index } as React.CSSProperties}
    >
      <header className="sk-head">
        <h3>{group.title}</h3>
        {group.tag && <span className="sk-tag">{group.tag}</span>}
      </header>

      <ul className="sk-items">
        {group.items.map((it) => (
          <li key={it.name} className="sk-item">
            <span className="sk-logo">
              {it.icon ? (
                <Image src={`/tech/${it.icon}.svg`} alt="" width={36} height={36} data-light={it.light} unoptimized />
              ) : (
                <span className="sk-glyph" aria-hidden="true">
                  {it.glyph}
                </span>
              )}
            </span>
            {it.short ? (
              <>
                <span className="sk-name" aria-hidden="true">
                  {it.short}
                </span>
                <span className="sr-only">{it.name}</span>
              </>
            ) : (
              <span className="sk-name">{it.name}</span>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
}
