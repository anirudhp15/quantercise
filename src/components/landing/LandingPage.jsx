import React from "react";
import Intro from "./Intro";
import Features from "./Features";
import Pricing from "./Pricing";
import LandingFooter from "./LandingFooter";
import Topics from "./Topics";
import FAQ from "./FAQ";
import AnimatedGrid from "./AnimatedGrid";

const LandingPage = () => {
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
