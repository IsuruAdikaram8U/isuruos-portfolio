import IntroOverlay from "@/components/intro/IntroOverlay";
import NavBar from "@/components/shell/NavBar";
import Hero from "@/components/sections/home/Hero";
import WorkspacePlaceholder from "@/components/shell/WorkspacePlaceholder";

export default function Home() {
  return (
    <>
      <IntroOverlay />
      <NavBar />
      <main>
        <Hero />
        <WorkspacePlaceholder />
      </main>
    </>
  );
}
