import type { CSSProperties } from "react";
import Image from "next/image";
import { siCloudinary, siEspressif, type SimpleIcon } from "simple-icons";

/**
 * Every technology on Isuru's CV, as its real full-colour logo, floating slowly
 * in the background.
 *
 * - Logos in /public/tech come from Devicon (official colours).
 * - Cloudinary and Espressif (ESP32) aren't in Devicon, so they come from
 *   simple-icons, drawn in their brand colour.
 * - `light`: the logo is black (GitHub, Next.js, ...), so it is shown in white,
 *   the way those brands appear on dark backgrounds.
 *
 * x / y = position in % of the screen (kept away from the face and the text),
 * size in px, depth: 0 = near (sharp, bright), 1 = middle, 2 = far (faint, blurred).
 */
type Item = {
  name: string;
  x: number;
  y: number;
  size: number;
  depth: 0 | 1 | 2;
  file?: string;
  icon?: SimpleIcon;
  light?: boolean;
};

const ICONS: Item[] = [
  // top band
  { name: "React", file: "react", x: 60, y: 13, size: 46, depth: 0 },
  { name: "Spring Boot", file: "spring", x: 77, y: 8, size: 36, depth: 1 },
  { name: "Docker", file: "docker", x: 91, y: 18, size: 50, depth: 0 },
  { name: "Java", file: "java", x: 70, y: 24, size: 36, depth: 1 },
  { name: "PostgreSQL", file: "postgresql", x: 85, y: 28, size: 30, depth: 2 },
  {
    name: "Next.js",
    file: "nextjs",
    x: 53,
    y: 23,
    size: 28,
    depth: 2,
    light: true,
  },
  {
    name: "GitHub Actions",
    file: "githubactions",
    x: 47,
    y: 7,
    size: 26,
    depth: 2,
  },
  { name: "Postman", file: "postman", x: 67, y: 5, size: 26, depth: 2 },
  { name: "Python", file: "python", x: 95, y: 6, size: 30, depth: 2 },
  { name: "HTML5", file: "html5", x: 83, y: 16, size: 28, depth: 2 },
  { name: "JavaScript", file: "javascript", x: 74, y: 14, size: 24, depth: 2 },
  { name: "AWS", file: "amazonwebservices", x: 50, y: 14, size: 34, depth: 1 },
  { name: "CSS3", file: "css3", x: 64, y: 28, size: 24, depth: 2 },
  { name: "JWT", file: "jwt", x: 97, y: 27, size: 24, depth: 2 },

  // right edge
  {
    name: "Tailwind CSS",
    file: "tailwindcss",
    x: 96,
    y: 40,
    size: 30,
    depth: 1,
  },
  { name: "MongoDB", file: "mongodb", x: 92, y: 52, size: 34, depth: 0 },
  { name: "ESP32", icon: siEspressif, x: 89, y: 63, size: 26, depth: 2 },
  { name: "MySQL", file: "mysql", x: 97, y: 65, size: 34, depth: 1 },
  { name: "Swagger", file: "swagger", x: 92, y: 75, size: 28, depth: 2 },

  // the seam between the face and the text
  { name: "Figma", file: "figma", x: 49, y: 38, size: 24, depth: 2 },
  { name: "C", file: "c", x: 47, y: 52, size: 28, depth: 2 },
  { name: "C++", file: "cplusplus", x: 50, y: 66, size: 26, depth: 2 },
  { name: "Arduino", file: "arduino", x: 46, y: 79, size: 30, depth: 2 },

  // bottom band
  {
    name: "GitHub",
    file: "github",
    x: 72,
    y: 88,
    size: 42,
    depth: 0,
    light: true,
  },
  { name: "Vite", file: "vitejs", x: 58, y: 83, size: 32, depth: 1 },
  { name: "Node.js", file: "nodejs", x: 52, y: 93, size: 34, depth: 1 },
  {
    name: "Socket.io",
    file: "socketio",
    x: 63,
    y: 95,
    size: 24,
    depth: 2,
    light: true,
  },
  { name: "Cloudinary", icon: siCloudinary, x: 70, y: 79, size: 26, depth: 2 },
  {
    name: "SQL Server",
    file: "microsoftsqlserver",
    x: 81,
    y: 84,
    size: 32,
    depth: 1,
  },
  { name: "Git", file: "git", x: 77, y: 95, size: 26, depth: 2 },
  {
    name: "Django",
    file: "django",
    x: 88,
    y: 92,
    size: 28,
    depth: 2,
    light: true,
  },
  { name: "Django REST", file: "djangorest", x: 97, y: 88, size: 26, depth: 2 },
];

export default function TechField() {
  return (
    <div className="ios-tech" aria-hidden="true">
      {ICONS.map((it, i) => (
        <span
          key={it.name}
          className={`ios-tech-icon ios-depth-${it.depth}${it.light ? " ios-tech-light" : ""}`}
          style={
            {
              left: `${it.x}%`,
              top: `${it.y}%`,
              width: it.size,
              height: it.size,
              // every icon floats on its own rhythm
              animationDuration: `${10 + ((i * 37) % 7)}s`,
              animationDelay: `${-((i * 1.7) % 12)}s`,
            } as CSSProperties
          }
        >
          {it.file ? (
            <Image
              src={`/tech/${it.file}.svg`}
              alt=""
              width={it.size}
              height={it.size}
              unoptimized
            />
          ) : it.icon ? (
            <svg viewBox="0 0 24 24" fill={`#${it.icon.hex}`}>
              <path d={it.icon.path} />
            </svg>
          ) : null}
        </span>
      ))}
    </div>
  );
}
