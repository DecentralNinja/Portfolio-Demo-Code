import "./App.scss";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavCircle from "./Components/NavCircle";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function App() {
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  gsap.registerPlugin(ScrollTrigger);

  const loadingRef = useRef(null);
  const ballRef = useRef(null);
  const circleRef = useRef(null);
  const nameRef = useRef(null);
  const titleRef = useRef(null);
  const transitionScreenRef = useRef(null);
  const tlRef = useRef();
  const circleGroupRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const scrollTriggered = useRef(false);
  const navCircleRef = useRef();
  const [isTransitioning, setIsTransitioning] = useState(false);

  gsap.registerPlugin(CustomEase);
  CustomEase.create("cubic-text", "0.25, 1, 0.5, 1");

  const animateMainContent = () => {
    const wordElements = document.querySelectorAll(".home-word");
    const imageEl = document.querySelector(".mainProfilePic img");
    const descEl = document.querySelector(".homeDesc");

    const tl = gsap.timeline();

    wordElements.forEach((word, i) => {
      const delay = i * 0.08;
      tl.to(
        word,
        {
          y: 0,
          duration: 1.5,
          ease: "cubic-text",
        },
        delay
      );
    });

    // Animate description separately with delay
    tl.to(
      descEl,
      {
        y: 0,
        duration: 1.6,
        ease: "cubic-text",
      },
      "+=0.8" // ⬅️ delay after other words
    );

    // Animate the image reveal after the words
    tl.fromTo(
      imageEl,
      {
        y: "100%",
      },
      {
        y: "0%",
        ease: "power3.out",
        duration: 0.9,
      },
      "-=4" // overlaps slightly with the last word animation
    );
  };


  const handleRouteTransition = (targetRoute) => {
    setIsTransitioning(true);
    const ball = document.querySelector(".menu__dot");

    if (!ball) return;

      
      ball.style.zIndex = "60"; 

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
      ballColor = "#000000"; 
  }

    // Apply the color change IMMEDIATELY (before animation)
    ball.style.setProperty("--ball-bg-color", ballColor);

    if (ball) {
      const tl = gsap.timeline();

      // 1. Animate ball expansion
      tl.to(
        ball,
        {
          scale: 100,
          duration: 0.6,
          ease: "none",
          transformOrigin: "center center",
          onComplete: () => {
            navigate(targetRoute);
          }
        }
      );

      // 2. Fade out ball
      tl.to(
        ball,
        {
          opacity: 0,
          duration: 0.4,
        },
        ">0.1"
      );

      // Reset after everything
    tl.call(() => {
      gsap.set(ball, { scale: 1, opacity: 1 , immediateRender: false});
      ball.style.setProperty("--ball-bg-color", "#FFFFFF"); 
      ball.style.zIndex = "50";
      setIsTransitioning(false);
    });
    }
  };

  // Update the NavCircle component usage

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    if (loading) {
      if (tlRef.current) tlRef.current.kill();

      
      gsap.set([nameRef.current, titleRef.current], { opacity: 1, y: 0 });
      gsap.set(ballRef.current, { scale: 1 });
      gsap.set(circleRef.current, { strokeDashoffset: 283 });

      tlRef.current = gsap.timeline({
        onComplete: () => {
          const tl = gsap.timeline({
            onComplete: () => {
              
              gsap.delayedCall(0.1, () => {
                setLoading(false);
                animateMainContent();
              });
            },
          });

          
          tl.to(
            nameRef.current,
            {
              y: -60,
              opacity: 0,
              duration: 0.6,
              ease: "power2.in",
            },
            0
          );

          tl.to(
            titleRef.current,
            {
              y: 60,
              opacity: 0,
              duration: 0.6,
              ease: "power2.in",
            },
            0
          );

          
          tl.to(
            circleGroupRef.current,
            {
              bottom: "-50%", 
              x: "50%",
              xPercent: -50,
              duration: 0.8,
              ease: "power2.out",
            },
            0
          );

          
          tl.to(
            circleRef.current,
            {
              scale: 5,
              strokeWidth: 4, 
              duration: 0.6,
              ease: "power2.inOut",
            },
            "<0.4"
          );

          
          tl.to(
            ballRef.current,
            {
              width: 24,
              height: 24,
              duration: 0.5,
              ease: "power2.out",
            },
            "<0.3"
          );
        },
      });


      tlRef.current.to(circleRef.current, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: "power2.inOut",
      });
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (tlRef.current) tlRef.current.kill();
    };
  }, [loading]);

  useEffect(() => {
    const handleScroll = (e) => {
      if (
        location.pathname === "/" &&
        !scrollTriggered.current &&
        e.deltaY > 0
      ) {
        scrollTriggered.current = true;

        const ball = document.querySelector(".menu__dot");
        const navCircle = navCircleRef.current;

        if (ball && navCircle) {
          const tl = gsap.timeline();
         
          tl.add(() => {
            navCircle.triggerPageTransition("/work");
          }, 0);

          tl.call(() => {
            ball.style.setProperty("--ball-bg-color", "#FFFFFF");
          }, 0);
          
          tl.to(
            ball,
            {
              scale: 100,
              duration: 1, 
              ease: "none", 
              transformOrigin: "center center",
            },
            0
          );

          tl.to(
            ball,
            {
              opacity: 0,
              duration: 0.4,
            },
            ">0.2"
          ); 

        }
      }
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [location.pathname, navigate]);

  return (
    <>
      <div className="home-layout">
        {loading && (
          <div
            className="loading-container fixed top-0 left-0 w-full h-full bg-black"
            ref={transitionScreenRef}
          >
            <h2>
              <span className="relative inline-block overflow-hidden h-[64px] loadingName">
                <span className="block text-[36px] loadingName" ref={nameRef}>
                  SYED MAAZ HAMID
                </span>
              </span>
            </h2>

            <div className="relative" ref={circleGroupRef}>
              <div className="relative w-[44px] h-[44px] flex items-center justify-center">
                <svg
                  ref={circleRef}
                  className="absolute top-0 left-0 scale-150"
                  viewBox="0 0 100 100"
                  style={{ width: "44px", height: "44px" }}
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
                  />
                </svg>
                <div
                  ref={ballRef}
                  className="ball h-5 w-5 rounded-full bg-white"
                ></div>
              </div>
            </div>

            <h2>
              <span className="relative inline-block overflow-hidden h-[64px] ">
                <span className="block text-[36px] loadingName" ref={titleRef}>
                  CREATIVE DEVELOPER
                </span>
              </span>
            </h2>
          </div>
        )}

        <div className={`content-area ${loading ? "hidden" : ""}`}>
          <Outlet context={{ loading }} />
        </div>

        {!loading && (
          <NavCircle ref={navCircleRef} onRouteChange={handleRouteTransition} />
        )}
      </div>
    </>
  );
}

export default App;
