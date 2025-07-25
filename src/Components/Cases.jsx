import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import cases from "../Data/cases";
import SideBar from "./SideBar";
import CaseImageDisplay from "./CaseImageDisplay";
import { Z_INDEX } from '../Components/zIndex';

const Cases = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [targetIndex, setTargetIndex] = useState(1);
  const [direction, setDirection] = useState("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const wrapperRef = useRef(null);
  const currentIndexRef = useRef(0); // Add ref to track current index

  useEffect(() => {
    document.body.style.backgroundColor = cases[0].bgColor;
    document.documentElement.style.overflow = "hidden";
    currentIndexRef.current = 0; // Initialize ref
    
    // Add preload class to body to prevent premature animations
    document.body.classList.add("preload");
    
    // Initialize state properly
    setCurrentIndex(0);
    setNextIndex(1);
    setTargetIndex(1);

    // Set initial states for all cases to prevent flash
    cases.forEach((_, index) => {
      const caseElement = document.querySelector(`[data-attr="case-${index}"]`);
      if (caseElement) {
        if (index === 0) {
          // First case starts visible but with elements positioned off-screen
          caseElement.style.opacity = '1';
        } else {
          // Other cases start hidden
          caseElement.style.opacity = '0';
        }
      }
    });

    const timeout = setTimeout(() => {
      // Remove preload class and enable animations
      document.body.classList.remove("preload");
      setIsPreloaded(true);
      
      // Enable event listeners after initial animations
      setTimeout(() => {
        setupEventListeners();
      }, 2500); // Wait for initial animations to complete
    }, 100);

    return () => {
      clearTimeout(timeout);
      removeEventListeners();
      document.body.classList.remove("preload");
    };
  }, []);

  // Keep ref in sync with state
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const setupEventListeners = () => {
    if (wrapperRef.current) {
      wrapperRef.current.addEventListener("wheel", handleScroll, {
        passive: true,
      });
      wrapperRef.current.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      wrapperRef.current.addEventListener("touchmove", handleScroll, {
        passive: true,
      });
    }
  };

  const removeEventListeners = () => {
    if (wrapperRef.current) {
      wrapperRef.current.removeEventListener("wheel", handleScroll);
      wrapperRef.current.removeEventListener("touchmove", handleScroll);
    }
  };

  const animateTransition = (dir, targetIdx = null) => {
    setIsAnimating(true);
    setDirection(dir);

    // Calculate new indices immediately and update states to prevent flicker
    const currentIdx = currentIndexRef.current;
    let newCurrentIndex;
    
    if (dir === "next") {
      if (targetIdx !== null) {
        newCurrentIndex = targetIdx;
      } else {
        newCurrentIndex = (currentIdx + 1) % cases.length;
      }
    } else {
      if (targetIdx !== null) {
        newCurrentIndex = targetIdx;
      } else {
        newCurrentIndex = (currentIdx - 1 + cases.length) % cases.length;
      }
    }

    // Update states immediately to prevent flicker
    setCurrentIndex(newCurrentIndex);
    setTargetIndex(newCurrentIndex);
    if (dir === "next") {
      setNextIndex((newCurrentIndex + 1) % cases.length);
    } else {
      setNextIndex(newCurrentIndex);
    }

    // Update background color immediately
    document.body.style.backgroundColor = cases[newCurrentIndex].bgColor;
    
    const ease = "expo.inOut";

    gsap.set(".shape", {
      attr: {
        d:
          dir === "next"
            ? "M 0 1 Q 0.5 1 1 1 L 1 1 L 0 1 z"
            : "M 0 0 Q 0.5 0 1 0 L 1 1 L 0 1 z",
      },
    });

    gsap.to(".shape", {
      attr: {
        d:
          dir === "next"
            ? "M 0 0 Q 0.5 -0.2 1 0 L 1 1 L 0 1 z"
            : "M 0 1 Q 0.5 1.4 1 1 L 1 1 L 0 1 z",
      },
      duration: 1.5,
      ease,
      onComplete: () => {
        // Reset shape for next animation
        gsap.set(".shape", {
          attr: {
            d: dir === "next" 
              ? "M 0 1 Q 0.5 1.4 1 1 L 1 1 L 0 1 z"
              : "M 0 0 Q 0.5 0 1 0 L 1 1 L 0 1 z"
          },
        });
        
        // Small delay to ensure smooth transition
        setTimeout(() => {
          setIsAnimating(false);
          setupEventListeners();
        }, 50);
      },
    });
  };

    const handleScroll = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAnimating) {
      return;
    }

    let isScrollDown = false;
    if (e.type === "wheel") {
      isScrollDown = e.deltaY > 0;
    } else if (e.type === "touchmove" && e.touches && e.touches.length === 1) {
      isScrollDown = e.touches[0].clientY < touchStartY;
    }

    const currentIdx = currentIndexRef.current;
    
    if (isScrollDown) {
      // Scrolling down (next case)
      if (currentIdx < cases.length - 1) {
        animateTransition("next");
      } else {
        // Loop to first case
        jumpToCase(0);
      }
    } else {
      // Scrolling up (previous case)
      if (currentIdx > 0) {
        animateTransition("prev");
      } else {
        // Loop to last case
        jumpToCase(cases.length - 1);
      }
    }

    removeEventListeners();
  };

  const jumpToCase = (targetIdx) => {
    if (!isAnimating && targetIdx !== currentIndex) {
      setIsAnimating(true);
      const dir = targetIdx > currentIndex ? "next" : "prev";
      setDirection(dir);
      setTargetIndex(targetIdx);
      setNextIndex(targetIdx);
      animateTransition(dir, targetIdx);
      removeEventListeners();
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      setTouchStartY(e.touches[0].clientY);
    }
  };

  return (
    <>
      <main className="page page--cases" ref={wrapperRef}>
      <div className="page__container">
        <SideBar activeCase={currentIndex} setActiveCase={jumpToCase} style={{ zIndex: Z_INDEX.SIDEBAR }} />

                {cases.map((item, i) => {
          let caseClasses = "case";

          // Simplified class assignment to prevent flicker
          if (i === currentIndex) {
            // Current active case - always visible
          } else if (i === nextIndex && isAnimating) {
            // Case coming into view gets clip animation
            caseClasses += " case__clip";
          } else if (!isAnimating && i === (currentIndex + 1) % cases.length) {
            // Next case ready for clip animation when not animating
            caseClasses += " case__clip";
          } else {
            // All other cases are hidden
            caseClasses += " case__hide";
          }



          return (
            <section
              key={item.id}
              className={caseClasses}
              data-attr={`case-${i}`}
            >
              <div
                className="case__wrapper"
                style={{ backgroundColor: item.bgColor }}
              >
                                <CaseImageDisplay
                  project={item}
                  isActive={i === currentIndex}
                  isAnimating={isAnimating}
                  isNextItem={i === nextIndex || i === targetIndex}
                  direction={direction}
                  addClip={caseClasses.includes("case__clip")}
                  index={i}
                  isPreloaded={isPreloaded}
                />
              </div>
            </section>
          );
        })}
      </div>
    </main>
    <svg
      id="clip-svg"
      width="100%"
      height="100%"
    >
      <clipPath id="cases-clippath" clipPathUnits="objectBoundingBox">
        <path className="shape" d="M 0 1 Q 0.5 1.4 1 1 L 1 1 L 0 1 z" />
      </clipPath>
    </svg>
    </>
  );
};


export default Cases;