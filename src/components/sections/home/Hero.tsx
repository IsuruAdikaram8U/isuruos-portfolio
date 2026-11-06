"use client";

import Image from "next/image";
import { hero, profile } from "@/data/profile";
import { useOS } from "@/store/useOS";
import { scrollToSection } from "@/lib/scroll";
import { GithubIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import "./home.css";

/** delay step for the staggered entrance (CSS reads --d) */
const d = (n: number) => ({ "--d": n }) as React.CSSProperties;

/**
 * The first screen of Home: who Isuru is, what he does, and where to go next.
 * Left: name, role, one-line intro, buttons. Right: the real photo
 * (the intro showed it in 0s and 1s; here it's the real thing).
 * Everything fades up once the intro has slid away.
 */
export default function Hero() {
  const introOpen = useOS((s) => s.introOpen);
  const [first, ...rest] = profile.name.split(" ");

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <div className="hm" data-ready={!introOpen}>
      <div className="hm-bg" aria-hidden="true" />

      <div className="hm-in">
        <div className="hm-copy">
          <p className="hm-status hm-up" style={d(0)}>
            <span className="hm-dot" aria-hidden="true" />
            {hero.status}
          </p>

          <h1 id="hm-title" className="hm-name hm-up" style={d(1)}>
            <span>{first}</span> <span className="hm-name-2">{rest.join(" ")}</span>
          </h1>

          <p className="hm-role hm-up" style={d(2)}>
            <span className="hm-grad">{hero.focus}</span> {profile.title}
          </p>

          <p className="hm-lead hm-up" style={d(3)}>
            {hero.lead}
          </p>

          <div className="hm-actions hm-up" style={d(4)}>
            <a className="hm-btn hm-btn-primary" href="#projects" onClick={(e) => go(e, "projects")}>
              View projects
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h10m0 0L9 4m4 4-4 4" />
              </svg>
            </a>
            <a className="hm-btn hm-btn-ghost" href={profile.links.cv} target="_blank" rel="noopener">
              Resume
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 2v8m0 0L4.5 6.5M8 10l3.5-3.5M3 13h10" />
              </svg>
            </a>
            <span className="hm-sep" aria-hidden="true" />
            <a className="hm-icon" href={profile.links.github} target="_blank" rel="noopener" aria-label="GitHub">
              <GithubIcon />
            </a>
            <a className="hm-icon" href={profile.links.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
              <LinkedinIcon />
            </a>
          </div>

          <p className="hm-building hm-up" style={d(5)}>
            <span className="hm-building-tag">▸ currently building</span>
            <a href={hero.building.url} target="_blank" rel="noopener">
              {hero.building.name}
            </a>
            <span className="hm-building-text">· {hero.building.text}</span>
          </p>
        </div>

        <div className="hm-visual">
          <div className="hm-orb" aria-hidden="true" />
          <div className="hm-ring" aria-hidden="true" />
          <Image
            className="hm-photo"
            src={hero.photo.src}
            alt={hero.photo.alt}
            width={hero.photo.width}
            height={hero.photo.height}
            sizes="(max-width: 900px) 72vw, 540px"
            preload
          />
          <p className="hm-loc">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 14.5s4.5-4.2 4.5-8a4.5 4.5 0 0 0-9 0c0 3.8 4.5 8 4.5 8Z" />
              <circle cx="8" cy="6.5" r="1.6" />
            </svg>
            {profile.location}
          </p>
        </div>
      </div>

      <a className="hm-scroll" href="#stats" onClick={(e) => go(e, "stats")} aria-label="Scroll down">
        <span>scroll</span>
        <span className="hm-scroll-line" aria-hidden="true" />
      </a>
    </div>
  );
}
