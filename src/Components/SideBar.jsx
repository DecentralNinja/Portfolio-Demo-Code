import React, { forwardRef,useEffect, useRef, useState } from "react";
import cases from "../Data/cases";
import gsap from "gsap";
import { Elastic } from "gsap";

const SideBar = forwardRef(({ activeCase, setActiveCase, style }) => {
  const sideBarRef = useRef(null);
  const dotRefs = useRef([]);
  const titleRefs = useRef([]);
  
  const imageWrapperRefs = useRef([]);
  const timelinesRef = useRef([]);
  const [isPreloaded, setIsPreloaded] = useState(false);

  // Helper function to check if mobile or tablet
  const isMobileOrTablet = () => {
    return window.innerWidth <= 1024;
  };
  

  // Initialize individual dot animation
  const initializeDotAnimation = (index) => {
    const dot = dotRefs.current[index];
    const title = titleRefs.current[index];
    const item = cases[index];
    
    if (!dot || !title || !item) return;

    // Kill existing timeline for this dot
    if (timelinesRef.current[index]) {
      timelinesRef.current[index].kill();
    }

     // Calculate width based on title length (use origTitle if available)
    const titleText = item.origTitle || item.title;
    const titleLength = titleText.trim().length;
    const targetWidth = 100 + titleLength * 6;

    // Create new timeline
    const timeline = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.7,
        ease: Elastic.easeOut.config(1, 1)
      }
    });

    // Set initial state
    gsap.set(title, { 
      opacity: 0, 
      y: 20, 
      x: 0 
    });

     gsap.set(dot, {
      width: 50,
      borderRadius: "50%",
      backgroundColor: index === activeCase ? "white" : "rgba(255, 255, 255, 0.5)",
      zIndex: 1
    });

     // Build timeline
    timeline
      .to(dot, {
        width: targetWidth,
        borderRadius: "50px",
        backgroundColor: item.bgColor
      })
      .to(title, {
        opacity: 1,
         y: 0,
        x: 0
      }, "-=0.5");

      // Store timeline
    timelinesRef.current[index] = timeline;
  };
  
  // Initialize all animations
  const initializeAllAnimations = () => {
    cases.forEach((_, index) => {
      initializeDotAnimation(index);
    });
    setIsPreloaded(true);
  };

  // Mouse enter handler
  const handleMouseEnter = (index) => {
    if (isMobileOrTablet()) return;
    
    const dot = dotRefs.current[index];
    const timeline = timelinesRef.current[index];
    
    if (dot && timeline) {
      gsap.set(dot, { zIndex: 99 });
      timeline.timeScale(1).play();
  }
};

  // Mouse leave handler 
  const handleMouseLeave = (index) => {
    if (isMobileOrTablet()) return;

    const dot = dotRefs.current[index];
    const timeline = timelinesRef.current[index];
    
    if (dot && timeline) {
      gsap.set(dot, { zIndex: 1 });
      timeline.timeScale(1.3).reverse();
    }
  };

  // Update active case styling
  useEffect(() => {
    cases.forEach((_, index) => {
      const dot = dotRefs.current[index];
      if (dot && timelinesRef.current[index]) {
        // Update background color for inactive state
        if (timelinesRef.current[index].progress() === 0) {
          gsap.set(dot, {
            backgroundColor: index === activeCase ? "white" : "rgba(255, 255, 255, 0.5)"
          });
        }
      }
    });
  }, [activeCase]);

   // Initialize on mount and when preload changes
  useEffect(() => {
    if (!isPreloaded) {
      initializeAllAnimations();
    }
  }, []);

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      timelinesRef.current.forEach(timeline => {
        if (timeline) timeline.kill();
      });
    };
  }, []);

  return (
    <div className="indicator" ref={sideBarRef} style={style}>
      {cases.map((item, index) => (
        <div
          key={item.id}
          className={`indicator__dot ${item.isContrastColor ? 'dot--contrast' : ''}`}
          ref={el => (dotRefs.current[index] = el)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
          onClick={() => setActiveCase(index)}
        >
          <div className="dot__img-wrapper"
          ref={el => (imageWrapperRefs.current[index] = el)}>

            <img
              className="dot__img"
              src={item.dotImage || item.image}
              alt={item.title || item.title}
              height="150"
              width="150"
              style={{
                filter: index === activeCase ? "brightness(0.7)" : "none",
              }}
              aria-label={item.origTitle || item.title}
            />
          </div>
          <div className="dot__info">
            <div className="dot__title-wrapper">
              <span 
                className="dot__title"
                ref={el => (titleRefs.current[index] = el)}
              >
                {item.origTitle || item.title}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

SideBar.displayName = "SideBar";

export default SideBar;