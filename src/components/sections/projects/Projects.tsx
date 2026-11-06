"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { projects, type Project } from "@/data/profile";
import { GithubIcon } from "@/components/ui/SocialIcons";
import SectionHeader from "@/components/ui/SectionHeader";
import "./projects.css";

const pad = (n: number) => String(n).padStart(2, "0");

/** how many projects the list shows at once; the rest scroll into view as you go */
const VISIBLE = 5;

/**
 * Projects as a deck: one card at a time. The list on the left shows a window of
 * 5 projects and slides to keep the chosen one in view; ‹ / ›, the ← → keys and a
 * swipe all change the card. The list, the card and the arrows fit on one screen.
 */
export default function Projects() {
  const total = projects.length;
  const [index, setIndex] = useState(0);
  const [first, setFirst] = useState(0); // first project shown in the list window
  const touchX = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const current = projects[index];

  // on small screens the list is a sideways row of chips: keep the chosen chip in view
  useEffect(() => {
    const list = listRef.current;
    const tab = list?.children[index] as HTMLElement | undefined;
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: tab.offsetLeft - list.clientWidth / 2 + tab.offsetWidth / 2, behavior: "smooth" });
  }, [index]);

  const go = (target: number) => {
    const i = ((target % total) + total) % total;
    setIndex(i);
    // keep the chosen project inside the visible window
    setFirst((f) => (i < f ? i : i >= f + VISIBLE ? i - VISIBLE + 1 : f));
  };

  const hiddenAbove = first;
  const hiddenBelow = Math.max(0, total - first - VISIBLE);

  return (
    <section id="projects" className="pj" aria-labelledby="projects-title">
      <SectionHeader
        id="projects"
        title="Things I've built"
        sub="From a multi-branch restaurant platform to a chess board that moves its own pieces."
      />

      <div
        className="pj-deck"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowDown") go(index + 1);
          else if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(index - 1);
          else return;
          e.preventDefault();
        }}
      >
        {/* ---------- left: list window + arrows ---------- */}
        <div className="pj-side-nav">
          <div
            className="pj-window"
            data-above={hiddenAbove > 0}
            data-below={hiddenBelow > 0}
            style={{ "--rows": Math.min(VISIBLE, total) } as React.CSSProperties}
          >
            <div
              ref={listRef}
              className="pj-index"
              role="tablist"
              aria-label="Projects"
              aria-orientation="vertical"
              style={{ "--first": first } as React.CSSProperties}
            >
              {projects.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  id={`pj-tab-${p.id}`}
                  aria-selected={i === index}
                  aria-controls="pj-panel"
                  tabIndex={i === index ? 0 : -1}
                  className="pj-tab"
                  style={{ "--tint": p.accent } as React.CSSProperties}
                  onClick={() => go(i)}
                >
                  <span className="pj-tab-n">{pad(i + 1)}</span>
                  <span className="pj-tab-name">{p.name}</span>
                  <span className="pj-tab-type">{p.type}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pj-nav">
            <button type="button" className="pj-arrow" onClick={() => go(index - 1)} aria-label="Previous project">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M10 3 5 8l5 5" />
              </svg>
            </button>
            <p className="pj-count" aria-live="polite">
              <b>{pad(index + 1)}</b> / {pad(total)}
            </p>
            <button type="button" className="pj-arrow" onClick={() => go(index + 1)} aria-label="Next project">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="m6 3 5 5-5 5" />
              </svg>
            </button>
          </div>
        </div>

        {/* ---------- right: the card, with two cards peeking out underneath ---------- */}
        <div
          className="pj-pile"
          style={{ "--tint": current.accent } as React.CSSProperties}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
          }}
        >
          {/* key = project id: a new card mounts (and animates in) each time */}
          <ProjectCard key={current.id} project={current} />
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project: p }: { project: Project }) {
  const host = p.links.live ? new URL(p.links.live).host : p.links.github?.replace("https://", "");

  return (
    <article id="pj-panel" role="tabpanel" aria-labelledby={`pj-tab-${p.id}`} className="pj-card">
      {/* left: screenshot, technologies, links */}
      <div className="pj-media">
        <div className="pj-shot">
          <div className="pj-bar" aria-hidden="true">
            <span />
            <span />
            <span />
            <p>{host}</p>
          </div>
          <div className="pj-view">
            {p.image ? (
              <Image src={p.image.src} alt={p.image.alt} fill sizes="(max-width: 900px) 92vw, 480px" />
            ) : (
              <div className="pj-ph" aria-hidden="true">
                <b>{p.name}</b>
                <span>screenshot coming soon</span>
              </div>
            )}
          </div>
        </div>

        <ul className="pj-tech" aria-label="Built with">
          {p.tech.map((t) => (
            <li key={t.name}>
              {t.icon ? (
                <Image src={`/tech/${t.icon}.svg`} alt="" width={15} height={15} data-light={t.light} unoptimized />
              ) : (
                <span className="pj-glyph" aria-hidden="true">
                  {t.glyph}
                </span>
              )}
              {t.name}
            </li>
          ))}
        </ul>

        <div className="pj-links">
          {p.links.github && (
            <a className="pj-btn" href={p.links.github} target="_blank" rel="noopener">
              <GithubIcon />
              GitHub
            </a>
          )}
          {p.links.live && (
            <a className="pj-btn pj-btn-live" href={p.links.live} target="_blank" rel="noopener">
              Live site
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M5 11 11 5M6 5h5v5" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* right: what it is and what Isuru built */}
      <div className="pj-body">
        <p className="pj-meta">
          <span className="pj-type">{p.type}</span>
          {p.status && (
            <span className="pj-status">
              <i aria-hidden="true" />
              {p.status}
            </span>
          )}
        </p>

        <h3 className="pj-name">{p.name}</h3>
        <p className="pj-sub">{p.subtitle}</p>
        <p className="pj-context">{p.context}</p>

        <ul className="pj-built">
          {p.built.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
