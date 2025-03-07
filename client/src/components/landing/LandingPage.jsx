import React, { useState, useEffect } from "react";
import Intro from "./hero/HeroFinal";
import Features from "./tba/Features";
import Pricing from "./pricing/Pricing";
import POTD from "./ProblemOfTheDay";
import LandingFooter from "./LandingFooter";
import Topics from "./Topics";
import FAQ from "./tba/FAQ";
import AnimatedGrid from "./animatedGrid/AnimatedGrid";
import Header from "../layout/header";
import ComparisonTable from "../parts/ComparisonTable";
import Footer from "../layout/footer/Footer";
import { useLowDetail } from "../../contexts/LowDetailContext";

const LandingPage = () => {
  const { lowDetailMode } = useLowDetail();
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
      {!lowDetailMode && <AnimatedGrid />}
      <Header onJoinClick={handleJoinClick} /> {/* Pass the prop here */}
      <Intro triggerBounce={triggerBounce} />
      {/* <Features /> */}
      <POTD />
      <Topics />
      <Pricing />
      <ComparisonTable />
      {/* <FAQ /> */}
      <LandingFooter />
      {/* <Footer /> */}
    </div>
  );
};

export default LandingPage;
