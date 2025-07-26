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
}) => {
  const titleWrapperRef = useRef(null); // g in Vue
  const titleRef = useRef(null); // o in Vue
  const imageRef = useRef(null); // i in Vue
  const navigate = useNavigate();
  const [hasNavigated, setHasNavigated] = useState(false); // y in Vue
  const { loading } = useOutletContext(); 

  const hasLineBreak = project.title?.includes('<br/>');

  // This matches the x function in Vue exactly
  const initialSetup = () => {
    if (isActive) {
      gsap.to(imageRef.current, {
        yPercent: -150,
        rotate: 2,
        ease: "expo.inOut",
        duration: 1.7
      });
    }
    
    if (isActive && index === 0) {
      gsap.to(titleRef.current, {
        y: 0,
        rotate: 0,
        ease: "elastic.out(1, 1)",
        duration: 1.5
      });
    }
  };

  // Watch for loading state change - matches Vue watcher
  useEffect(() => {
    if (!loading) {
      initialSetup();
    }
  }, [loading]);

  // This matches the Vue watchEffect exactly
  useEffect(() => {
    if (isAnimating && isActive) {
      // Current case being replaced
      if (direction === "next") {
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

  // Initial setup on mount - matches Vue onMounted
  useEffect(() => {
    if (!loading) {
      initialSetup();
    }
  }, []);

  // Reset navigation state when case changes
  useEffect(() => {
    setHasNavigated(false);
  }, [index]);

  // Helper functions for responsive design
  const isMobile = () => window.innerWidth <= 768;
  const isTablet = () => window.innerWidth > 768 && window.innerWidth <= 1024;

  // This matches the b function in Vue exactly
  const handleCaseClick = () => {
    if (hasNavigated || !isActive) return;
    
    document.body.style.cursor = "wait";
    
    const mobile = isMobile();
    const tablet = isTablet();
    
    gsap.to(titleWrapperRef.current, {
      top: mobile 
        ? (hasLineBreak ? 47 : 55) 
        : tablet 
          ? (hasLineBreak ? -55 : -15) 
          : 25,
      ease: "expo.inOut",
      duration: 1.2
    });

    gsap.to(titleRef.current, {
      fontSize: mobile ? `${60 / 10}rem` : tablet ? `${150 / 10}rem` : `${250 / 10}rem`,
      lineHeight: mobile ? `${60 / 10}rem` : tablet ? `${120 / 10}rem` : `${200 / 10}rem`,
      color: project.isContrastColor ? "#1A1A1A" : "#fff",
      letterSpacing: 0,
      ease: "expo.inOut",
      duration: 1.2
    });

    gsap.to(imageRef.current, {
      yPercent: 0,
      rotate: 5,
      ease: "expo.inOut",
      duration: 2,
      onUpdate: function() {
        if (this.progress() > 0.8 && !hasNavigated) {
          setHasNavigated(true);
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
            cursor: 'pointer',
            transform: 'translate(0px, 450px)'
          }}
        />
      </div>

      <div className="case__img-wrapper" ref={imageRef}>
        <figure 
          className="case__figure" 
          onClick={handleCaseClick} 
          style={{ cursor: 'pointer' }}
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
