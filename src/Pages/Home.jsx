import React, {useEffect, useState } from "react";
import NavCircle from "../Components/NavCircle";
import { useOutletContext } from "react-router-dom";
import gsap from "gsap";

const Home = () => {
   const { loading } = useOutletContext(); 
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
  if (!loading) {
    gsap.to(".home-word", {
      y: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.1,
    });
    gsap.to(".mainProfilePic img", {
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.2,
    });
  }
}, [loading]);

  const getMovement = (speedX, speedY) => ({
    transform: `translate(${mousePosition.x * speedX}px, ${
      mousePosition.y * speedY
    }px)`,
    transition: "transform 0.4s cubic-bezier(0.15, 0.75, 0.5, 1)",
  });


  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* HOME MAINCONTENT */}
      <div
        className={`home-container  h-screen overflow-hidden transition-opacity duration-500 ease-out ${
          loading ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div>
          <div className="HomeSection left-1/2 -translate-x-1/2 relative h-screen ">
          <div className="absolute maazProfile">
            <div className="mainProfilePic overflow-hidden" style={getMovement(30, 20)} >
              <img
                src="/maaz-try.png"
                alt="maazPic"
                className="maaz_Pic max-w-none relative z-[3]"
              />
            </div>
          </div>
            <h2 className="absolute text-syedPosit">
              <span
                className=" relative inline-block overflow-hidden text_Contain"
                style={getMovement(12, 8)}
              >
                <span className="home-word text_syed block leading-none" style={{transform: "translateY(100%)"}}>
                  SYED
                </span>
              </span>
            </h2>

            <h2 className="text-maazPosit absolute">
              <span
                className="relative inline-block overflow-hidden text_Contain text_Contain2"
                style={getMovement(12, 8)}
              >
                <span className="home-word text_maaz block leading-none" style={{transform: "translateY(100%)"}}>
                  MAAZ
                </span>
              </span>
            </h2>

            <h2 className="text-hamidPosit absolute z-[3]">
              <span
                className=" relative inline-block overflow-hidden text_Contain"
                style={getMovement(12, 8)}
              >
                <span className="home-word block text_hamid leading-none" style={{transform: "translateY(100%)"}}>
                  HAMID
                </span>
              </span>
            </h2>

            <h2 className="text-DescPosit absolute z-[3]">
              <span
                className=" relative inline-block overflow-hidden descContain leading-none"
                style={getMovement(12, 8)}
              >
                <span className="home-word homeDesc font-medium translate-y-full">
                  UIUX DESIGNER & CREATIVE FRONTEND DEVELOPER FROM PAKISTAN
                </span>
              </span>
            </h2>
          </div>
        </div>
          <img src="/shadow-2.png" alt="shadow-2" className="dark-ground-fade" />
      </div>
    </div>
  );
};

export default Home;
