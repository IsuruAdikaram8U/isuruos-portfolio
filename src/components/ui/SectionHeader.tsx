"use client";

import { useRef } from "react";
import { SECTIONS, type SectionId } from "@/data/site";
import { useInView } from "@/hooks/useInView";
import "./ui.css";

type Props = {
  /** which section this header belongs to (gives the "02 / education" label) */
  id: SectionId;
  title: string;
  sub?: string;
  align?: "center" | "left";
};

/** The same header on every section: a small numbered label, a big title and an optional line. */
export default function SectionHeader({ id, title, sub, align = "center" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.4);
  const n = SECTIONS.findIndex((s) => s.id === id) + 1;

  return (
    <header ref={ref} className="ui-head" data-align={align} data-in={inView}>
      <p className="ui-head-label">
        <span className="ui-head-n">{String(n).padStart(2, "0")}</span>
        <span className="ui-head-bar" aria-hidden="true" />
        {id}
      </p>
      <h2 id={`${id}-title`} className="ui-head-title">
        {title}
      </h2>
      {sub && <p className="ui-head-sub">{sub}</p>}
    </header>
  );
}
