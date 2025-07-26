import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from "react-router-dom";
import { Z_INDEX } from '../Components/zIndex';

const CaseImageDisplay = ({
  index = 0,
  project = {},
  isActive = false,
  isAnimating = false,
  isNextItem = false,
  direction = "next",
  animationPhase = "idle",
}) => {
  const titleWrapperRef = useRef(null);
  const titleRef = useRef(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();
  const [hasNavigated, setHasNavigated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { loading } = useOutletContext(); 

  const hasLineBreak = project.title?.includes('<br/>');

  // Initial setup animations
  useEffect(() => {
    if (isActive && index === 0 && !isInitialized) {
      // Initial animation for the first case
      gsap.to(titleRef.current, {
        y: 0,
        rotate: 0,
        ease: "elastic.out(1, 1)",
        duration: 1.5
      });
      setIsInitialized(true);
    }
    
    if (isActive && !isAnimating) {
      // Set initial state for active case image when not animating
      gsap.to(imageRef.current, {
        yPercent: 0,
        rotate: 2,
        ease: "expo.inOut",
        duration: 1.7
      });
    }
  }, [isActive, index, loading, isAnimating, isInitialized]);

  // Animation when cases transition - improved with animation phases
  useEffect(() => {
    if (!isAnimating || animationPhase === "idle") return;

    // Prevent conflicting animations during phase transitions
    if (animationPhase === "starting") {
      // Kill any existing animations to prevent conflicts
      gsap.killTweensOf([titleRef.current, imageRef.current]);
      return;
    }

    if (animationPhase === "animating" && isActive) {
      // Current case being replaced
      if (direction === "next") {
        // Moving up (next case comes from below)
        gsap.to(imageRef.current, {
          yPercent: -105,
          rotate: -5,
          ease: "expo.inOut",
          duration: 1.7,
          onComplete: () => {
            // Only reset if still the active case
            if (isActive) {
              gsap.set(imageRef.current, {
                yPercent: 0,
                rotate: 5
              });
            }
          }
        });
        
        gsap.to(titleRef.current, {
          y: hasLineBreak ? 550 : 350,
          ease: "expo.inOut",
          duration: 1.5
        });
      } else {
        // Moving down (prev case comes from above)
        gsap.to(imageRef.current, {
          yPercent: 0,
          rotate: -5,
          ease: "expo.inOut",
          duration: 2,
          onComplete: () => {
            if (isActive) {
              gsap.set(imageRef.current, {
                yPercent: 0,
                rotate: 5
              });
            }
          }
        });
        
        gsap.to(titleRef.current, {
          y: hasLineBreak ? -550 : -350,
          ease: "expo.inOut",
          duration: 1.5
        });
      }
    } else if (animationPhase === "animating" && isNextItem) {
      // Next case coming into view
      if (direction === "next") {
        // Coming from below
        gsap.set(imageRef.current, {
          top: "50%",
          yPercent: 50,
          rotate: 15
        });
        
        gsap.to(imageRef.current, {
          top: "50%",
          yPercent: -150,
          rotate: 2,
          ease: "expo.inOut",
          duration: 1.7
        });
        
        gsap.fromTo(titleRef.current, {
          y: hasLineBreak ? -550 : -350
        }, {
          y: 0,
          ease: "expo.inOut",
          duration: 1.5,
          delay: 0.5
        });
      } else {
        // Coming from above
        gsap.set(imageRef.current, {
          top: "50%",
          yPercent: -300,
          rotate: -15
        });
        
        gsap.to(imageRef.current, {
          top: "50%",
          yPercent: -150,
          rotate: 2,
          ease: "expo.inOut",
          duration: 1.7
        });
        
        gsap.fromTo(titleRef.current, {
          y: hasLineBreak ? 550 : 350
        }, {
          y: 0,
          ease: "expo.inOut",
          duration: 1.5,
          delay: 0.5
        });
      }
    }
  }, [isAnimating, isActive, isNextItem, direction, hasLineBreak, animationPhase]);

  // Improved cleanup with proper animation phase handling
  useEffect(() => {
    return () => {
      // Kill all GSAP animations related to this component
      gsap.killTweensOf([titleRef.current, imageRef.current, titleWrapperRef.current]);
    };
  }, []);

  // Reset navigation state when case changes
  useEffect(() => {
    setHasNavigated(false);
  }, [index]);

  // Helper function to check if mobile/tablet
  const isMobile = () => window.innerWidth <= 768;
  const isTablet = () => window.innerWidth > 768 && window.innerWidth <= 1024;

  // Click handler for navigation
  const handleCaseClick = () => {
    // Prevent clicks during animation phases that could cause conflicts
    if (hasNavigated || isAnimating || animationPhase !== "idle") return;
    
    document.body.style.cursor = "wait";
    
    const mobile = isMobile();
    const tablet = isTablet();
    
    // Animate title wrapper with responsive positioning
    const topValue = mobile 
      ? (hasLineBreak ? 47 : 55) 
      : tablet 
        ? (hasLineBreak ? -55 : -15) 
        : 25;
    
    gsap.to(titleWrapperRef.current, {
      top: topValue,
      ease: "expo.inOut",
      duration: 1.2
    });

    // Animate title with responsive sizing
    const fontSize = mobile ? "6rem" : tablet ? "15rem" : "25rem";
    const lineHeight = mobile ? "6rem" : tablet ? "12rem" : "20rem";
    
    gsap.to(titleRef.current, {
      fontSize: fontSize,
      lineHeight: lineHeight,
      color: project.isContrastColor ? "#1A1A1A" : "#fff",
      letterSpacing: 0,
      ease: "expo.inOut",
      duration: 1.2
    });

    // Animate image
    gsap.to(imageRef.current, {
      yPercent: 0,
      rotate: 5,
      ease: "expo.inOut",
      duration: 2,
      onUpdate: function() {
        // Navigate when animation is 80% complete
        if (this.progress() > 0.8 && !hasNavigated) {
          setHasNavigated(true);
          // For now, log the navigation or create a route later
          console.log(`Navigate to case ${project.id}`);
          // navigate(`/cases/${project.id}`);
        }
      },
      onComplete: () => {
        document.body.style.cursor = "none";
      }
    });
  };

  return (
    <>
      <div
        className={`case__title-wrapper ${
          hasLineBreak ? 'case__title-wrapper--extra' : ''
        }`}
        ref={titleWrapperRef}
      >
        <h2
          className={`case__title ${index === 0 ? 'case__title--off' : ''}`}
          ref={titleRef}
          dangerouslySetInnerHTML={{ __html: project.title }}
          onClick={handleCaseClick}
          style={{
            cursor: isAnimating || animationPhase !== "idle" ? 'default' : 'pointer', 
            transform: 'translate(0px, 450px)'
          }}
        />
      </div>

      <div className="case__img-wrapper" ref={imageRef}>
        <figure 
          className="case__figure" 
          onClick={handleCaseClick} 
          style={{
            cursor: isAnimating || animationPhase !== "idle" ? 'default' : 'pointer'
          }}
        >
          <img
            className={`case__img  ${
              project.containOverviewHeader ? 'case__img--contain' : ''
            }`}
            src={project.image}
            alt={project.title}
            aria-label={project.title}
          />
        </figure>
      </div>
    </>
  );
};

export default CaseImageDisplay;
