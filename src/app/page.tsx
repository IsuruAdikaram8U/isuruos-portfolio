import IntroOverlay from "@/components/intro/IntroOverlay";
import NavBar from "@/components/shell/NavBar";
import Home from "@/components/sections/home/Home";
import Education from "@/components/sections/education/Education";
import Skills from "@/components/sections/skills/Skills";
import WorkspacePlaceholder from "@/components/shell/WorkspacePlaceholder";

export default function Page() {
  return (
    <>
      <IntroOverlay />
      <NavBar />
      <main>
        <Home />
        <Education />
        <Skills />
        <WorkspacePlaceholder />
      </main>
    </>
  );
}
