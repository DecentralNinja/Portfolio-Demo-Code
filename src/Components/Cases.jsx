import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import cases from "../Data/cases";
import SideBar from "./SideBar";
import CaseImageDisplay from "./CaseImageDisplay";
import { Z_INDEX } from '../Components/zIndex';

const Cases = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [direction, setDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [clipIndex, setClipIndex] = useState(0);
  const wrapperRef = useRef(null);

  useEffect(() => {
    document.body.style.backgroundColor = cases[0].bgColor;
    document.documentElement.style.overflow = "hidden";

    const timeout = setTimeout(() => {
      setupEventListeners();
    }, 1500);

    return () => {
      clearTimeout(timeout);
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

  const animateTransition = (dir) => {
    setIsAnimating(true);
    setDirection(dir);

    const ease = "expo.inOut";

    // Calculate the new current index before starting animation
    const newCurrentIndex = dir === "next"
      ? (currentIndex + 1) % cases.length
      : (currentIndex - 1 + cases.length) % cases.length;

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
      duration: 1.2,
      ease,
      onComplete: () => {
        // Update currentIndex to the pre-calculated value
        setCurrentIndex(newCurrentIndex);
        
        // Set nextIndex based on the new current index
        setNextIndex(
          dir === "next"
            ? (newCurrentIndex + 1) % cases.length
            : (newCurrentIndex - 1 + cases.length) % cases.length
        );

        setClipIndex(newCurrentIndex);

        // Update background color
        document.body.style.backgroundColor = cases[newCurrentIndex].bgColor;

        setIsAnimating(false);
        setupEventListeners();
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

    animateTransition(isScrollDown ? "next" : "prev");
    removeEventListeners();
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
        <SideBar activeCase={currentIndex} setActiveCase={setCurrentIndex} style={{ zIndex: Z_INDEX.SIDEBAR }} />

        {cases.map((item, i) => {
          let caseClasses = "case";

          if (direction === null) {
            if (i === currentIndex) {
              // Current case - no additional class
            } else if (i === (currentIndex + 1) % cases.length) {
              caseClasses += " case__clip";
            } else {
              caseClasses += " case__hide";
            }
          }
          else if (direction === "next") {
            if (i === currentIndex) {
              // Current case during next animation - no additional class
            } else if (i === nextIndex) {
              caseClasses += " case__clip";
            } else {
              caseClasses += " case__hide";
            }
          } 
          else if (direction === "prev") {
            if (i === currentIndex) {
              caseClasses += " case__clip";
            } else if (i === nextIndex) {
              // Next case during prev animation - no additional class
            } else {
              caseClasses += " case__hide";
            }
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
                  isNextItem={i === nextIndex}
                  direction={direction}
                  addClip={caseClasses.includes("case__clip")}
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