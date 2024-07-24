import React, { useEffect, useRef } from "react";
import anime from "animejs";
import "./AnimatedGrid.css";

const AnimatedGrid = () => {
  const gridRef = useRef(null);

  useEffect(() => {
    const gridElement = gridRef.current;

    if (gridElement) {
      const fragment = document.createDocumentFragment();
      const grid = [17, 17];
      const col = grid[0];
      const row = grid[1];
      const numberOfElements = col * row;

      for (let i = 0; i < numberOfElements; i++) {
        const div = document.createElement("div");
        div.className = "grid-item";
        fragment.appendChild(div);
      }

      gridElement.appendChild(fragment);

      const staggersAnimation = anime
        .timeline({
          targets: ".stagger-visualizer div",
          easing: "easeInOutSine",
          delay: anime.stagger(50),
          loop: true,
          autoplay: true,
        })
        .add({
          translateX: [
            {
              value: anime.stagger("-.1rem", {
                grid: grid,
                from: "center",
                axis: "x",
              }),
            },
            {
              value: anime.stagger(".1rem", {
                grid: grid,
                from: "center",
                axis: "x",
              }),
            },
          ],
          translateY: [
            {
              value: anime.stagger("-.1rem", {
                grid: grid,
                from: "center",
                axis: "y",
              }),
            },
            {
              value: anime.stagger(".1rem", {
                grid: grid,
                from: "center",
                axis: "y",
              }),
            },
          ],
          duration: 1000,
          scale: 0.5,
          delay: anime.stagger(100, { grid: grid, from: "center" }),
        })
        .add({
          translateX: () => anime.random(-10, 10),
          translateY: () => anime.random(-10, 10),
          delay: anime.stagger(8, { from: "last" }),
        })
        .add({
          translateX: anime.stagger(".25rem", {
            grid: grid,
            from: "center",
            axis: "x",
          }),
          translateY: anime.stagger(".25rem", {
            grid: grid,
            from: "center",
            axis: "y",
          }),
          rotate: 0,
          scaleX: 2.5,
          scaleY: 0.25,
          delay: anime.stagger(4, { from: "center" }),
        })
        .add({
          rotate: anime.stagger([90, 0], { grid: grid, from: "center" }),
          delay: anime.stagger(50, { grid: grid, from: "center" }),
        })
        .add({
          translateX: 0,
          translateY: 0,
          scale: 0.5,
          scaleX: 1,
          rotate: 180,
          duration: 100,
          delay: anime.stagger(100, { grid: grid, from: "center" }),
        })
        .add({
          scaleY: 1,
          scale: 1,
          delay: anime.stagger(20, { grid: grid, from: "center" }),
        });

      staggersAnimation.play();
    }
  }, []);

  return <div ref={gridRef} className="stagger-visualizer"></div>;
};

export default AnimatedGrid;
