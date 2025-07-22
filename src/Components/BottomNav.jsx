// components/AnimatedCircleNav.jsx
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

const AnimatedCircleNav = ({ activeNav, setActiveNav }) => {
  const navCircleRef = useRef(null);
  const navItemsRef = useRef([]);

  useEffect(() => {
    gsap.from(navCircleRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });

    navItemsRef.current.forEach((item, index) => {
      if (item) {
        gsap.from(item, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          delay: 0.7 + index * 0.1,
          ease: "power2.out",
        });
      }
    });
  }, []);

  return (
    <div className="nav-wrapper fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
      <svg className="nav-svg" viewBox="0 0 100 100">
        <circle
          ref={navCircleRef}
          className="nav-circle"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="283"
          strokeDashoffset="283"
          strokeLinecap="round"
        />
      </svg>
      <div className="nav-ball" />
      <ul className="nav-items">
        {["HOME", "WORK", "ABOUT"].map((item, i) => (
          <li
            key={item}
            ref={(el) => (navItemsRef.current[i] = el)}
            className={`nav-item ${activeNav === item ? "active" : ""}`}
            onClick={() => setActiveNav(item)}
          >
            {item}
            <span className="dot" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnimatedCircleNav;
