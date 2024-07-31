import React, { useState, useEffect } from "react";
import Intro from "./Intro";
import Features from "./Features";
import Pricing from "./Pricing";
import LandingFooter from "./LandingFooter";
import Topics from "./Topics";
import FAQ from "./FAQ";
import AnimatedGrid from "./AnimatedGrid";
import Header from "../header/index";

const LandingPage = () => {
  const [triggerBounce, setTriggerBounce] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleJoinClick = () => {
    setTriggerBounce(true);
    setTimeout(() => setTriggerBounce(false), 5000); // Duration of the bounce animation
  };

  return (
    <div className="relative bg-gray-950">
      <AnimatedGrid />
      <Header onJoinClick={handleJoinClick} /> {/* Pass the prop here */}
      <Intro triggerBounce={triggerBounce} />
      {/* <Features /> */}
      <Topics />
      <Pricing />
      {/* <FAQ /> */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
