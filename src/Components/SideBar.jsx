import React, { forwardRef,useEffect, useRef } from "react";
import cases from "../Data/cases";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { Elastic } from "gsap";
const SideBar = forwardRef(({ activeCase, setActiveCase, style }) => {
  const sideBarRef = useRef(null);
  const dotRefs = useRef([]);
  const titleRefs = useRef([]);
  const animationRefs = useRef([]);

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      animationRefs.current.forEach(anim => anim.kill());
    };
  }, []);

  // Initialize animations
  const initAnimations = () => {
    cases.forEach((item, index) => {
      const dot = dotRefs.current[index];
      const title = titleRefs.current[index];
      
      if (dot && title) {
        // Kill any existing animations
        gsap.killTweensOf([dot, title]);
        
        // Set initial state
        gsap.set(title, { opacity: 0, x: -20 });
        gsap.set(dot, {
          width: 50,
          borderRadius: "50%",
          backgroundColor: index === activeCase ? "white" : "rgba(255, 255, 255, 0.5)"
        });
      }
    });
  };

  // Re-initialize when activeCase changes
  useEffect(() => {
    initAnimations();
  }, [activeCase]);

  // Mouse enter handler (simplified)
  const handleMouseEnter = (index) => {
    const dot = dotRefs.current[index];
    const title = titleRefs.current[index];
    const item = cases[index];
    
    if (dot && title) {
      // Calculate width based on title length (like Vue version)
      const titleLength = item.title.trim().length;
      const targetWidth = 100 + titleLength * 6;
      
      // Create timeline
      const tl = gsap.timeline();
      animationRefs.current.push(tl);
      
      tl.to(dot, {
        width: targetWidth,
        borderRadius: "50px",
        backgroundColor: item.bgColor,
        duration: 0.7,
        ease: Elastic.easeOut.config(1, 1)
      })
      .to(title, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.3");
    }
  };

  // Mouse leave handler (simplified)
  const handleMouseLeave = (index) => {
    const dot = dotRefs.current[index];
    const title = titleRefs.current[index];
    
    if (dot && title) {
      const tl = gsap.timeline();
      animationRefs.current.push(tl);
      
      tl.to(dot, {
        width: 50,
        borderRadius: "50%",
        backgroundColor: index === activeCase ? "white" : "rgba(255, 255, 255, 0.5)",
        duration: 0.5,
        ease: "power2.out"
      })
      .to(title, {
        opacity: 0,
        x: -20,
        duration: 0.3
      }, 0);
    }
  };

  return (
    <div className="indicator" ref={sideBarRef} style={style}>
      {cases.map((item, index) => (
        <div
          key={item.id}
          className="indicator__dot"
          ref={el => (dotRefs.current[index] = el)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
          onClick={() => setActiveCase(index)}
        >
          <div className="dot__img-wrapper">
            <img
              className="dot__img"
              src={item.dotImage}
              alt={item.title}
              style={{
                filter: index === activeCase ? "brightness(0.7)" : "none",
              }}
            />
          </div>
          <div className="dot__info">
            <div
              className="dot__title-wrapper"
              ref={el => (titleRefs.current[index] = el)}
              style={{ opacity: 0, transform: "translateX(-20px)" }}
            >
              <span className="dot__title">
                {item.title}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default SideBar;