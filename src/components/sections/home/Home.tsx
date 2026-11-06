import Hero from "./Hero";
import Stats from "./Stats";
import "./stats.css";

/** The Home section: the hero (first screen) and, just below it, four key numbers. */
export default function Home() {
  return (
    <section id="home" aria-labelledby="hm-title">
      <Hero />
      <Stats />
    </section>
  );
}
