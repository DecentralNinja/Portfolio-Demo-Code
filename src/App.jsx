import "./App.scss";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavCircle from "./Components/NavCircle";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";

function App() {
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(null);
  const ballRef = useRef(null);
  const circleRef = useRef(null);
  const nameRef = useRef(null);
  const titleRef = useRef(null);
  const circleGroupRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const scrollTriggered = useRef(false);
  const navCircleRef = useRef();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mainTimelineRef = useRef(null);
  const lastScrollTime = useRef(0);
  const scrollCooldown = 1500; // Prevent rapid scrolling

  gsap.registerPlugin(CustomEase);
  CustomEase.create("cubic-text", "0.25, 1, 0.5, 1");

  // Enhanced route transition handler
  const handleRouteTransition = (targetRoute) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const ball = document.querySelector(".menu__dot");
    
    if (!ball) {
      navigate(targetRoute);
      setIsTransitioning(false);
      return;
    }

    // Set transition color based on route
    let ballColor;
    switch (targetRoute) {
      case "/work":
        ballColor = "#ED472F";
        break;
      case "/about":
        ballColor = "#000000";
        break;
      default:
        ballColor = "#FFFFFF"; 
    }

    ball.style.setProperty("--ball-bg-color", ballColor);
    ball.style.zIndex = "9999";

    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(ball, { 
          scale: 1, 
          opacity: 1,
          clearProps: "transform"
        });
        ball.style.setProperty("--ball-bg-color", "#FFFFFF");
        ball.style.zIndex = "50";
        setIsTransitioning(false);
        // Reset scroll cooldown after transition
        setTimeout(() => {
          scrollTriggered.current = false;
        }, 500);
      }
    });

    // Smooth scale animation
    timeline.to(ball, {
      scale: 120,
      duration: 1.2,
      ease: "power2.inOut",
      transformOrigin: "center center",
      onUpdate: function() {
        // Navigate at 60% completion for smoother transition
        if (this.progress() > 0.6) {
          navigate(targetRoute);
        }
      }
    });

    // Fade out ball
    timeline.to(ball, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut"
    }, "-=0.3");
  };

  // Enhanced loading sequence
  useEffect(() => {
    if (loading) {
      // Kill any existing timeline
      if (mainTimelineRef.current) {
        mainTimelineRef.current.kill();
      }

      // Reset all elements
      gsap.set([nameRef.current, titleRef.current], { 
        opacity: 1, 
        y: 0 
      });
      gsap.set(ballRef.current, { 
        scale: 1,
        width: 20,
        height: 20
      });
      gsap.set(circleRef.current, { 
        strokeDashoffset: 283,
        scale: 1,
        strokeWidth: 1.5
      });

      // Main loading timeline
      mainTimelineRef.current = gsap.timeline({
        onComplete: () => {
          // Exit animation timeline
          const exitTimeline = gsap.timeline({
            onComplete: () => {
              gsap.delayedCall(0.1, () => {
                setLoading(false);
              });
            }
          });

          // Text exit animations
          exitTimeline.to([nameRef.current, titleRef.current], {
            y: (i) => i === 0 ? -80 : 80,
            opacity: 0,
            duration: 0.8,
            ease: "power3.in",
            stagger: 0.1
          });

          // Circle transforms to nav position
          exitTimeline.to(circleGroupRef.current, {
            bottom: "-50px",
            left: "50%",
            xPercent: -50,
            duration: 1.2,
            ease: "power3.out"
          }, "-=0.6");

          exitTimeline.to(circleRef.current, {
            scale: 3,
            strokeWidth: 2,
            opacity: 0.8,
            duration: 1,
            ease: "power2.inOut"
          }, "-=0.8");

          exitTimeline.to(ballRef.current, {
            width: 24,
            height: 24,
            duration: 0.8,
            ease: "power2.out"
          }, "-=0.6");
        }
      });

      // Circle progress animation
      mainTimelineRef.current.to(circleRef.current, {
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.inOut"
      });

    }

    return () => {
      if (mainTimelineRef.current) {
        mainTimelineRef.current.kill();
      }
    };
  }, [loading]);

  // Enhanced scroll navigation for homepage
  useEffect(() => {
    const handleScroll = (e) => {
      const now = Date.now();
      
      // Only handle scroll on homepage when not loading and not transitioning
      if (
        location.pathname !== "/" ||
        loading ||
        isTransitioning ||
        scrollTriggered.current ||
        (now - lastScrollTime.current) < scrollCooldown
      ) {
        return;
      }

      const isScrollDown = e.deltaY > 0;
      const isScrollUp = e.deltaY < 0;
      
      // Minimum scroll threshold to prevent accidental triggers
      const scrollThreshold = 50;
      if (Math.abs(e.deltaY) < scrollThreshold) {
        return;
      }

      lastScrollTime.current = now;
      scrollTriggered.current = true;

      if (isScrollDown) {
        // Scroll down - go to work page
        console.log("Scrolling down - navigating to /work");
        handleRouteTransition("/work");
      } else if (isScrollUp) {
        // Scroll up - go to about page
        console.log("Scrolling up - navigating to /about");
        handleRouteTransition("/about");
      }
    };

    // Use passive: false to allow preventDefault if needed
    window.addEventListener("wheel", handleScroll, { passive: true });
    return () => window.removeEventListener("wheel", handleScroll);
  }, [location.pathname, loading, isTransitioning]);

  // Enhanced touch handling for mobile
  useEffect(() => {
    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e) => {
      if (location.pathname !== "/" || loading || isTransitioning) return;
      
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e) => {
      if (
        location.pathname !== "/" ||
        loading ||
        isTransitioning ||
        scrollTriggered.current
      ) return;

      const touchEndY = e.changedTouches[0].clientY;
      const touchDuration = Date.now() - touchStartTime;
      const touchDistance = touchStartY - touchEndY;
      const velocity = Math.abs(touchDistance) / touchDuration;

      // Require minimum distance and velocity for gesture recognition
      if (Math.abs(touchDistance) < 100 || velocity < 0.5) return;

      const now = Date.now();
      if ((now - lastScrollTime.current) < scrollCooldown) return;

      lastScrollTime.current = now;
      scrollTriggered.current = true;

      if (touchDistance > 0) {
        // Swipe up - go to work page
        console.log("Swiping up - navigating to /work");
        handleRouteTransition("/work");
      } else {
        // Swipe down - go to about page
        console.log("Swiping down - navigating to /about");
        handleRouteTransition("/about");
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [location.pathname, loading, isTransitioning]);

  // Reset scroll trigger when leaving home
  useEffect(() => {
    if (location.pathname !== "/") {
      scrollTriggered.current = false;
    }
  }, [location.pathname]);

  return (
    <div className="app-container">
      {/* Enhanced Loading Screen */}
      {loading && (
        <div
          className="loading-container fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
          ref={loadingRef}
        >
          {/* Name */}
          <div className="mb-8">
            <div className="relative inline-block overflow-hidden">
              <span 
                className="block text-4xl md:text-5xl font-medium text-white"
                ref={nameRef}
              >
                SYED MAAZ HAMID
              </span>
            </div>
          </div>

          {/* Loading Circle */}
          <div className="relative mb-8" ref={circleGroupRef}>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg
                ref={circleRef}
                className="absolute inset-0"
                viewBox="0 0 100 100"
                style={{ width: "48px", height: "48px" }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeDasharray="283"
                  strokeLinecap="round"
                  style={{ transformOrigin: "center" }}
                />
              </svg>
              <div
                ref={ballRef}
                className="w-5 h-5 rounded-full bg-white"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <div className="relative inline-block overflow-hidden">
              <span 
                className="block text-xl md:text-2xl font-light text-white"
                ref={titleRef}
              >
                CREATIVE DEVELOPER
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`content-area transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}>
        <Outlet context={{ loading }} />
      </div>

      {/* Navigation Circle */}
      {!loading && (
        <NavCircle 
          ref={navCircleRef} 
          onRouteChange={handleRouteTransition}
        />
      )}
    </div>
  );
}

export default App;
