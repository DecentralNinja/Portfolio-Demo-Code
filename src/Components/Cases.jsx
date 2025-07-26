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
  const [animationPhase, setAnimationPhase] = useState("idle"); // Track animation phases
  const [touchStartY, setTouchStartY] = useState(0);
  const wrapperRef = useRef(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    document.body.style.backgroundColor = cases[0].bgColor;
    document.documentElement.style.overflow = "hidden";
    currentIndexRef.current = 0;

    // Initialize state properly
    setCurrentIndex(0);
    setNextIndex(1);
    setTargetIndex(1);
    setAnimationPhase("idle");

    const timeout = setTimeout(() => {
      setupEventListeners();
    }, 1500);

    return () => {
      clearTimeout(timeout);
      removeEventListeners();
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
    setAnimationPhase("starting");
    setDirection(dir);

    const ease = "expo.inOut";

    // Set initial shape state without flickering
    gsap.set(".shape", {
      attr: {
        d:
          dir === "next"
            ? "M 0 1 Q 0.5 1 1 1 L 1 1 L 0 1 z"
            : "M 0 0 Q 0.5 0 1 0 L 1 1 L 0 1 z",
      },
    });

    // Wait a frame before starting the main animation to prevent flickering
    gsap.delayedCall(0.02, () => {
      setAnimationPhase("animating");
      
      gsap.to(".shape", {
        attr: {
          d:
            dir === "next"
              ? "M 0 0 Q 0.5 -0.2 1 0 L 1 1 L 0 1 z"
              : "M 0 1 Q 0.5 1.4 1 1 L 1 1 L 0 1 z",
        },
        duration: 1.5,
        ease,
        onUpdate: function() {
          // Apply state changes mid-animation to reduce flickering
          if (this.progress() > 0.6 && animationPhase === "animating") {
            setAnimationPhase("completing");
          }
        },
        onComplete: () => {
          setAnimationPhase("completing");
          
          // Reset shape for next animation
          gsap.set(".shape", {
            attr: {
              d: dir === "next" 
                ? "M 0 1 Q 0.5 1.4 1 1 L 1 1 L 0 1 z"
                : "M 0 0 Q 0.5 0 1 0 L 1 1 L 0 1 z"
            },
          });

          let newCurrentIndex;
          
          if (dir === "next") {
            if (targetIdx !== null) {
              newCurrentIndex = targetIdx;
              setCurrentIndex(targetIdx);
              setNextIndex((targetIdx + 1) % cases.length);
            } else {
              newCurrentIndex = (currentIndexRef.current + 1) % cases.length;
              setCurrentIndex(newCurrentIndex);
              setNextIndex((newCurrentIndex + 1) % cases.length);
            }
          } else {
            if (targetIdx !== null) {
              newCurrentIndex = targetIdx;
              setCurrentIndex(targetIdx);
              setNextIndex(targetIdx);
            } else {
              newCurrentIndex = (currentIndexRef.current - 1 + cases.length) % cases.length;
              setCurrentIndex(newCurrentIndex);
              setNextIndex(newCurrentIndex);
            }
          }

          // Update background color
          document.body.style.backgroundColor = cases[newCurrentIndex].bgColor;
          
          // Delay the reset to prevent flickering
          gsap.delayedCall(0.1, () => {
            setIsAnimating(false);
            setAnimationPhase("idle");
            setupEventListeners();
          });
        },
      });
    });
  };

  const handleScroll = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAnimating || animationPhase !== "idle") {
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
        setDirection("next");
        setTargetIndex(currentIdx + 1);
        setNextIndex(currentIdx + 1);
        animateTransition("next");
      } else {
        // Loop to first case
        jumpToCase(0);
      }
    } else {
      // Scrolling up (previous case)
      if (currentIdx > 0) {
        setDirection("prev");
        setNextIndex(currentIdx);
        setTargetIndex(currentIdx - 1);
        animateTransition("prev");
      } else {
        // Loop to last case
        jumpToCase(cases.length - 1);
      }
    }

    removeEventListeners();
  };

  const jumpToCase = (targetIdx) => {
    if (!isAnimating && targetIdx !== currentIndex && animationPhase === "idle") {
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

          // Only apply clip class during specific animation phases to prevent flickering
          if (animationPhase === "animating" || animationPhase === "completing") {
            if (direction === "next" ? i === nextIndex : i === currentIndex) {
              caseClasses += " case__clip";
            }
          }
          
          // Apply hide class more intelligently
          if (animationPhase === "idle" && i !== currentIndex) {
            caseClasses += " case__hide";
          } else if (animationPhase !== "idle" && i !== currentIndex && i !== nextIndex && i !== targetIndex) {
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
                  animationPhase={animationPhase}
                  index={i}
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