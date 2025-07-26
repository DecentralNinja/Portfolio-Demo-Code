import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import cases from "../Data/cases";
import SideBar from "./SideBar";
import CaseImageDisplay from "./CaseImageDisplay";
import { Z_INDEX } from '../Components/zIndex';

const Cases = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // t in Vue
  const [nextIndex, setNextIndex] = useState(1); // n in Vue  
  const [targetIndex, setTargetIndex] = useState(1); // d in Vue
  const [isAnimating, setIsAnimating] = useState(false); // v in Vue
  const [direction, setDirection] = useState("next"); // u in Vue
  const [touchStartY, setTouchStartY] = useState(0); // k in Vue
  const wrapperRef = useRef(null); // a in Vue
  const timeoutRef = useRef(null); // h in Vue

  useEffect(() => {
    document.body.style.backgroundColor = cases[0].bgColor;
    document.documentElement.style.overflow = "hidden";
    
    timeoutRef.current = setTimeout(() => {
      setupEventListeners();
    }, 1500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      removeEventListeners();
    };
  }, []);

  const setupEventListeners = () => {
    if (typeof window !== 'undefined' && wrapperRef.current) {
      wrapperRef.current.addEventListener("wheel", handleScroll, { passive: true });
      wrapperRef.current.addEventListener("touchstart", handleTouchStart, { passive: true });
      wrapperRef.current.addEventListener("touchmove", handleScroll, { passive: true });
    }
  };

  const removeEventListeners = () => {
    if (typeof window !== 'undefined' && wrapperRef.current) {
      wrapperRef.current.removeEventListener("wheel", handleScroll);
      wrapperRef.current.removeEventListener("touchmove", handleScroll);
    }
  };

  // This matches the _ function in Vue exactly
  const animateTransition = (dir, targetIdx = "") => {
    const timeline = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        
        if (dir === "next") {
          gsap.set(".shape", {
            attr: {
              d: "M 0 1 Q 0.5 1.4 1 1 L 1 1 L 0 1 z"
            }
          });
          
          if (targetIdx !== "") {
            setCurrentIndex(targetIdx);
            setNextIndex(targetIdx + 1);
          } else {
            setCurrentIndex(prev => prev + 1);
            setNextIndex(prev => prev + 1);
          }
        } else {
          gsap.set(".shape", {
            attr: {
              d: "M 0 0 Q 0.5 0 1 0 L 1 1 L 0 1 z"
            }
          });
          
          if (targetIdx !== "") {
            setCurrentIndex(targetIdx);
            setNextIndex(targetIdx - 1);
          } else {
            setCurrentIndex(prev => prev - 1);
            setNextIndex(prev => prev - 1);
          }
        }
        
        document.body.style.backgroundColor = cases[targetIdx !== "" ? targetIdx : (dir === "next" ? currentIndex + 1 : currentIndex - 1)].bgColor;
        setupEventListeners();
      }
    });

    if (dir === "next") {
      gsap.set(".shape", {
        attr: {
          d: "M 0 1 Q 0.5 1 1 1 L 1 1 L 0 1 z"
        }
      });
      
      timeline.to(".shape", {
        attr: {
          d: "M 0 0 Q 0.5 -0.2 1 0 L 1 1 L 0 1 z"
        },
        duration: 1.5,
        ease: "expo.inOut"
      });
    } else {
      gsap.set(".shape", {
        attr: {
          d: "M 0 0 Q 0.5 0 1 0 L 1 1 L 0 1 z"
        }
      });
      
      timeline.to(".shape", {
        attr: {
          d: "M 0 1 Q 0.5 1.4 1 1 L 1 1 L 0 1 z"
        },
        duration: 1.5,
        ease: "expo.inOut"
      });
    }
  };

  // This matches the L function in Vue exactly
  const jumpToCase = (targetIdx) => {
    if (!isAnimating && targetIdx !== currentIndex) {
      setIsAnimating(true);
      setDirection(targetIdx > currentIndex ? "next" : "prev");
      setTargetIndex(targetIdx);
      setNextIndex(targetIdx);
      animateTransition(targetIdx > currentIndex ? "next" : "prev", targetIdx);
      removeEventListeners();
    }
  };

  // This matches the s function in Vue exactly
  const handleScroll = (e) => {
    if (typeof window !== 'undefined' && !isAnimating) {
      const isScrollDown = e.deltaY > 0 || (e.touches && e.touches[0].clientY < touchStartY);
      
      if (isScrollDown) {
        if (currentIndex < cases.length - 1) {
          setIsAnimating(true);
          setDirection("next");
          setTargetIndex(currentIndex + 1);
          setNextIndex(currentIndex + 1);
          animateTransition("next");
          removeEventListeners();
        } else {
          jumpToCase(0);
        }
      } else {
        if (currentIndex > 0) {
          setIsAnimating(true);
          setDirection("prev");
          setNextIndex(currentIndex);
          setTargetIndex(currentIndex - 1);
          animateTransition("prev");
          removeEventListeners();
        } else {
          jumpToCase(cases.length - 1);
        }
      }
    }
  };

  // This matches the Q function in Vue exactly
  const handleTouchStart = (e) => {
    if (typeof window !== 'undefined' && e.touches && e.touches.length === 1) {
      setTouchStartY(e.touches[0].clientY);
    }
  };

  return (
    <>
      <main className="page page--cases" ref={wrapperRef}>
        <div className="page__container">
          <SideBar activeCase={currentIndex} setActiveCase={jumpToCase} style={{ zIndex: Z_INDEX.SIDEBAR }} />

          {cases.map((item, i) => {
            // This matches the exact class logic from Vue
            const shouldClip = direction === "next" ? i === nextIndex : i === currentIndex;
            const shouldHide = i !== currentIndex && i !== nextIndex && i !== targetIndex;

            let caseClasses = "case";
            if (shouldClip) {
              caseClasses += " case__clip";
            }
            if (shouldHide) {
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
                    index={i}
                    isActive={i === currentIndex}
                    isAnimating={isAnimating}
                    isNextItem={i === targetIndex}
                    direction={direction}
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