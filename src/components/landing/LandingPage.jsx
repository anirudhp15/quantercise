import React, { useEffect } from "react";
import Intro from "./Intro";
import Features from "./Features";
import Pricing from "./Pricing";
import LandingFooter from "./LandingFooter";
import Topics from "./Topics";
import FAQ from "./FAQ";
import AnimatedGrid from "./AnimatedGrid";

const LandingPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="relative bg-gray-950">
      <AnimatedGrid />
      <Intro />
      {/* <Features /> */}
      <Topics />
      <Pricing />
      {/* <FAQ /> */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
