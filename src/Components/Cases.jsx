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
  
  // Use refs to avoid closure issues - this is key!
  const currentIndexRef = useRef(0);
  const directionRef = useRef("next");

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

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

  // Fixed animation function - uses current values from refs
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
            document.body.style.backgroundColor = cases[targetIdx].bgColor;
          } else {
            const newIndex = currentIndexRef.current + 1;
            setCurrentIndex(newIndex);
            setNextIndex(newIndex + 1);
            document.body.style.backgroundColor = cases[newIndex].bgColor;
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
            document.body.style.backgroundColor = cases[targetIdx].bgColor;
          } else {
            const newIndex = currentIndexRef.current - 1;
            setCurrentIndex(newIndex);
            setNextIndex(newIndex - 1);
            document.body.style.backgroundColor = cases[newIndex].bgColor;
          }
        }
        
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

  const jumpToCase = (targetIdx) => {
    if (!isAnimating && targetIdx !== currentIndexRef.current) {
      setIsAnimating(true);
      setDirection(targetIdx > currentIndexRef.current ? "next" : "prev");
      setTargetIndex(targetIdx);
      setNextIndex(targetIdx);
      animateTransition(targetIdx > currentIndexRef.current ? "next" : "prev", targetIdx);
      removeEventListeners();
    }
  };

  const handleScroll = (e) => {
    if (typeof window !== 'undefined' && !isAnimating) {
      const isScrollDown = e.deltaY > 0 || (e.touches && e.touches[0].clientY < touchStartY);
      const currentIdx = currentIndexRef.current;
      
      if (isScrollDown) {
        if (currentIdx < cases.length - 1) {
          setIsAnimating(true);
          setDirection("next");
          setTargetIndex(currentIdx + 1);
          setNextIndex(currentIdx + 1);
          animateTransition("next");
          removeEventListeners();
        } else {
          jumpToCase(0);
        }
      } else {
        if (currentIdx > 0) {
          setIsAnimating(true);
          setDirection("prev");
          setNextIndex(currentIdx);
          setTargetIndex(currentIdx - 1);
          animateTransition("prev");
          removeEventListeners();
        } else {
          jumpToCase(cases.length - 1);
        }
      }
    }
  };

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