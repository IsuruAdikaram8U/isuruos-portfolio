import IntroOverlay from "@/components/intro/IntroOverlay";
import NavBar from "@/components/shell/NavBar";
import WorkspacePlaceholder from "@/components/shell/WorkspacePlaceholder";

export default function Home() {
  return (
    <>
      <IntroOverlay />
      <NavBar />
      <WorkspacePlaceholder />
    </>
  );
}
