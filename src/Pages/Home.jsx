import React, { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import gsap from "gsap";

const Home = () => {
  const { loading } = useOutletContext(); 
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const homeContainerRef = useRef(null);
  const mouseTrackingRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);

  // Optimized mouse tracking with RAF
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseTrackingRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };

    // Smooth animation loop
    const animateMouseMovement = () => {
      setMousePosition(prev => ({
        x: prev.x + (mouseTrackingRef.current.x - prev.x) * 0.1,
        y: prev.y + (mouseTrackingRef.current.y - prev.y) * 0.1,
      }));
      animationFrameRef.current = requestAnimationFrame(animateMouseMovement);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(animateMouseMovement);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Enhanced text animations when loading completes
  useEffect(() => {
    if (!loading && homeContainerRef.current) {
      const timeline = gsap.timeline({ delay: 0.2 });

      // Animate words with stagger
      timeline.to(".home-word", {
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: {
          amount: 0.6,
          from: "start"
        }
      });

      // Animate profile image
      timeline.fromTo(".mainProfilePic img", {
        y: "30%",
        scale: 1.1
      }, {
        y: "0%",
        scale: 1,
        duration: 1.4,
        ease: "power3.out"
      }, "-=0.8");

      // Animate description with delay
      timeline.to(".homeDesc", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out"
      }, "-=0.4");

      // Animate background elements
      timeline.fromTo(".dark-ground-fade", {
        opacity: 0,
        y: 20
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=1");
    }
  }, [loading]);

  // Get optimized movement for different speeds
  const getMovement = (speedX, speedY) => ({
    transform: `translate3d(${mousePosition.x * speedX}px, ${mousePosition.y * speedY}px, 0)`,
    willChange: "transform"
  });

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* HOME MAIN CONTENT */}
      <div
        ref={homeContainerRef}
        className={`home-container h-screen overflow-hidden transition-opacity duration-700 ease-out ${
          loading ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="HomeSection left-1/2 -translate-x-1/2 relative h-screen">
          {/* Profile Image */}
          <div className="absolute maazProfile">
            <div 
              className="mainProfilePic overflow-hidden" 
              style={getMovement(25, 15)}
            >
              <img
                src="/maaz-try.png"
                alt="Syed Maaz Hamid Profile"
                className="maaz_Pic max-w-none relative"
                style={{ transform: "translateY(30%)" }}
              />
            </div>
          </div>

          {/* Name Elements */}
          <h2 className="absolute text-syedPosit">
            <span
              className="relative inline-block overflow-hidden text_Contain"
              style={getMovement(8, 5)}
            >
              <span 
                className="home-word text_syed block leading-none" 
                style={{ transform: "translateY(100%)" }}
              >
                SYED
              </span>
            </span>
          </h2>

          <h2 className="text-maazPosit absolute">
            <span
              className="relative inline-block overflow-hidden text_Contain text_Contain2"
              style={getMovement(10, 6)}
            >
              <span 
                className="home-word text_maaz block leading-none" 
                style={{ transform: "translateY(100%)" }}
              >
                MAAZ
              </span>
            </span>
          </h2>

          <h2 className="text-hamidPosit absolute">
            <span
              className="relative inline-block overflow-hidden text_Contain"
              style={getMovement(6, 4)}
            >
              <span 
                className="home-word block text_hamid leading-none" 
                style={{ transform: "translateY(100%)" }}
              >
                HAMID
              </span>
            </span>
          </h2>

          {/* Description */}
          <h2 className="text-DescPosit absolute">
            <span
              className="relative inline-block overflow-hidden descContain leading-none"
              style={getMovement(4, 3)}
            >
              <span 
                className="home-word homeDesc font-medium opacity-0"
                style={{ transform: "translateY(20px)" }}
              >
                UIUX DESIGNER & CREATIVE FRONTEND DEVELOPER FROM PAKISTAN
              </span>
            </span>
          </h2>
        </div>

        {/* Background Shadow */}
        <img 
          src="/shadow-2.png" 
          alt="Background Shadow" 
          className="dark-ground-fade pointer-events-none"
          style={{ opacity: 0 }}
        />
      </div>
    </div>
  );
};

export default Home;
