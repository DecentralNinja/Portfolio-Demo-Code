import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import cases from "../Data/cases";
import SideBar from "./SideBar";
import CaseImageDisplay from "./CaseImageDisplay";
import { Z_INDEX } from '../Components/zIndex';

const Cases = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState("next");
  const [touchStartY, setTouchStartY] = useState(0);
  const wrapperRef = useRef(null);
  const animationTimeoutRef = useRef(null);

  useEffect(() => {
    document.body.style.backgroundColor = cases[0].bgColor;
    document.documentElement.style.overflow = "hidden";

    const timeout = setTimeout(() => {
      setupEventListeners();
    }, 1500);

    return () => {
      clearTimeout(timeout);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      removeEventListeners();
    };
  }, []);

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

  const animateTransition = (dir, targetIdx) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection(dir);
    removeEventListeners();

    const ease = "expo.inOut";

    // Set initial shape state
    gsap.set(".shape", {
      attr: {
        d: dir === "next"
          ? "M 0 1 Q 0.5 1 1 1 L 1 1 L 0 1 z"
          : "M 0 0 Q 0.5 0 1 0 L 1 1 L 0 1 z",
      },
    });

    // Animate the shape
    gsap.to(".shape", {
      attr: {
        d: dir === "next"
          ? "M 0 0 Q 0.5 -0.2 1 0 L 1 1 L 0 1 z"
          : "M 0 1 Q 0.5 1.4 1 1 L 1 1 L 0 1 z",
      },
      duration: 1.5,
      ease,
      onComplete: () => {
        // Update the current index only after animation completes
        setCurrentIndex(targetIdx);
        
        // Update background color
        document.body.style.backgroundColor = cases[targetIdx].bgColor;
        
        // Reset shape for next animation
        gsap.set(".shape", {
          attr: {
            d: dir === "next" 
              ? "M 0 1 Q 0.5 1.4 1 1 L 1 1 L 0 1 z"
              : "M 0 0 Q 0.5 0 1 0 L 1 1 L 0 1 z"
          },
        });

        // Add a small delay before allowing new animations
        animationTimeoutRef.current = setTimeout(() => {
          setIsAnimating(false);
          setupEventListeners();
        }, 200);
      },
    });
  };

  const handleScroll = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAnimating) return;

    let isScrollDown = false;
    if (e.type === "wheel") {
      isScrollDown = e.deltaY > 0;
    } else if (e.type === "touchmove" && e.touches && e.touches.length === 1) {
      isScrollDown = e.touches[0].clientY < touchStartY;
    }

    let targetIdx;
    let dir;

    if (isScrollDown) {
      // Scrolling down (next case)
      if (currentIndex < cases.length - 1) {
        targetIdx = currentIndex + 1;
        dir = "next";
      } else {
        // Loop to first case
        targetIdx = 0;
        dir = "next";
      }
    } else {
      // Scrolling up (previous case)
      if (currentIndex > 0) {
        targetIdx = currentIndex - 1;
        dir = "prev";
      } else {
        // Loop to last case
        targetIdx = cases.length - 1;
        dir = "prev";
      }
    }

    animateTransition(dir, targetIdx);
  };

  const jumpToCase = (targetIdx) => {
    if (isAnimating || targetIdx === currentIndex) return;
    
    const dir = targetIdx > currentIndex ? "next" : "prev";
    animateTransition(dir, targetIdx);
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      setTouchStartY(e.touches[0].clientY);
    }
  };

  // Calculate which cases should be visible
  const getVisibleCases = () => {
    if (!isAnimating) {
      return [currentIndex];
    }
    
    // During animation, show both current and target cases
    const nextIdx = direction === "next" 
      ? (currentIndex + 1) % cases.length 
      : (currentIndex - 1 + cases.length) % cases.length;
    
    return [currentIndex, nextIdx];
  };

  const visibleCases = getVisibleCases();

  return (
    <>
      <main className="page page--cases" ref={wrapperRef}>
        <div className="page__container">
          <SideBar activeCase={currentIndex} setActiveCase={jumpToCase} style={{ zIndex: Z_INDEX.SIDEBAR }} />

          {cases.map((item, i) => {
            const isVisible = visibleCases.includes(i);
            const isCurrentCase = i === currentIndex;
            const shouldClip = isAnimating && !isCurrentCase && isVisible;

            let caseClasses = "case";
            if (!isVisible) {
              caseClasses += " case__hide";
            }
            if (shouldClip) {
              caseClasses += " case__clip";
            }

            return (
              <section
                key={item.id}
                className={caseClasses}
                data-attr={`case-${i}`}
                style={{ zIndex: isCurrentCase ? 2 : 1 }}
              >
                <div
                  className="case__wrapper"
                  style={{ backgroundColor: item.bgColor }}
                >
                  <CaseImageDisplay
                    project={item}
                    isActive={isCurrentCase}
                    isAnimating={isAnimating}
                    direction={direction}
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