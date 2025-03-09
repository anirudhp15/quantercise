import React, { useState, useEffect } from "react";
import SEO from "../parts/SEO";
import Intro from "./hero/HeroFinal";
import Pricing from "./pricing/Pricing";
import POTD from "./ProblemOfTheDay";
import LandingFooter from "./LandingFooter";
import Topics from "./Topics";
import AnimatedGrid from "./animatedGrid/AnimatedGrid";
import Header from "../layout/header";
import ComparisonTable from "../parts/ComparisonTable";
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

  // Define rich schema for homepage
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Quantercise - Master Quantitative Skills",
    description:
      "Strengthen your quantitative thinking with practice problems.",
    url: "https://quantercise.com",
    mainEntity: {
      "@type": "Service",
      name: "Quantercise Training Platform",
      description:
        "An affordable platform for mastering quantitative skills through targeted practice",
      offers: {
        "@type": "Offer",
        price: "4.99",
        priceCurrency: "USD",
      },
    },
  };

  return (
    <div className="relative bg-gray-950">
      <SEO
        title="Quantercise | Master Quantitative Skills Through Practice"
        description="Strengthen your quantitative thinking with over 150+ industry-standard practice problems. Perfect for interview preparation and skill development."
        keywords="quantitative practice, math skills, financial math, statistics, problem-solving, quant interviews"
        canonicalUrl="https://quantercise.com"
        schema={homeSchema}
      />
      {!lowDetailMode && <AnimatedGrid />}
      <Header onJoinClick={handleJoinClick} /> {/* Pass the prop here */}
      <Intro triggerBounce={triggerBounce} />
      <POTD />
      <Topics />
      <Pricing />
      <ComparisonTable />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
