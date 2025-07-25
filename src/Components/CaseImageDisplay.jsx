import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { Z_INDEX } from '../Components/zIndex';

const CaseImageDisplay = ({
  index = 0,
  project = {},
  isActive = false,
  isAnimating = false,
  isNextItem = false,
  direction = "next",
  isPreloaded = false,
}) => {
  const titleWrapperRef = useRef(null);
  const titleRef = useRef(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();
  const [hasNavigated, setHasNavigated] = useState(false);

  const hasLineBreak = project.title?.includes('<br/>');

  // Initial load animations
  useEffect(() => {
    if (!titleRef.current || !imageRef.current) return;

    if (isActive && index === 0) {
      // Set initial hidden state for first case
      gsap.set(titleWrapperRef.current, {
        y: 100,
        opacity: 0
      });
      
      gsap.set(titleRef.current, {
        y: hasLineBreak ? 550 : 350,
        opacity: 0
      });
      
      gsap.set(imageRef.current, {
        yPercent: 50,
        rotate: 15,
        opacity: 0
      });
    } else if (isActive) {
      // Set normal state for other active cases
      gsap.set(titleWrapperRef.current, { y: 0, opacity: 1 });
      gsap.set(titleRef.current, { y: 0, opacity: 1 });
      gsap.set(imageRef.current, { yPercent: -150, rotate: 2, opacity: 1 });
    } else {
      // Set hidden state for inactive cases
      gsap.set(titleWrapperRef.current, { opacity: 0 });
      gsap.set(titleRef.current, { opacity: 0 });
      gsap.set(imageRef.current, { opacity: 0 });
    }
  }, [isActive, index, hasLineBreak]);

  // Trigger entrance animations when preloaded
  useEffect(() => {
    if (!isPreloaded || !titleRef.current || !imageRef.current) return;

    if (isActive && index === 0) {
      // Create entrance timeline
      const tl = gsap.timeline();
      
      // Animate title wrapper first (if it exists)
      if (titleWrapperRef.current) {
        gsap.set(titleWrapperRef.current, {
          y: 100,
          opacity: 0
        });
        
        tl.to(titleWrapperRef.current, {
          y: 0,
          opacity: 1,
          ease: "expo.out",
          duration: 1.2,
          delay: 0.2
        });
      }

      // Animate title coming up from bottom
      tl.to(titleRef.current, {
        y: 0,
        opacity: 1,
        ease: "expo.inOut",
        duration: 1.5
      }, "-=0.8");

      // Animate image coming up from bottom to center with rotation
      tl.to(imageRef.current, {
        yPercent: -150,
        rotate: 2,
        opacity: 1,
        ease: "expo.inOut",
        duration: 2.2
      }, "-=1.0");
    }
  }, [isPreloaded, isActive, index, hasLineBreak]);

  // Animation when cases transition
  useEffect(() => {
    if (isAnimating && isActive) {
      // Current case being replaced
      if (direction === "next") {
        // Moving up (next case comes from below)
        gsap.to(imageRef.current, {
          yPercent: -235,
          rotate: -5,
          ease: "expo.inOut",
          duration: 1.7,
          onComplete: () => {
            gsap.set(imageRef.current, {
              yPercent: 0,
              rotate: 5
            });
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
            gsap.set(imageRef.current, {
              yPercent: 0,
              rotate: 5
            });
          }
        });
        
        gsap.to(titleRef.current, {
          y: hasLineBreak ? -550 : -350,
          ease: "expo.inOut",
          duration: 1.5
        });
      }
    } else if (isAnimating && isNextItem) {
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
  }, [isAnimating, isActive, isNextItem, direction, hasLineBreak]);

  // Cleanup animations on unmount
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
    if (hasNavigated) return;
    
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
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className="case__img-wrapper" ref={imageRef}>
        <figure className="case__figure" onClick={handleCaseClick} style={{ cursor: 'pointer' }}>
          <img
            className={`case__img ${
              project.containOverviewHeader ? 'case__img--contain' : ''
            }`}
            src={project.overviewHeader || project.image}
            alt={project.origTitle || project.title}
            aria-label={project.origTitle || project.title}
          />
        </figure>
      </div>
    </>
  );
};


export default CaseImageDisplay;
