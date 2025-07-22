import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const GetInTouch = ({ShowForm, setShowForm}) => {
  const buttonRef = useRef(null);
  const ballRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    const ball = ballRef.current;

    const handleEnter = () => {
      gsap.to(ball, {
        width: "130px",
        height: "100%",
        left: '-10px',
        borderRadius: "40px",
        backgroundColor: "#fff",
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to(button, {
        color: "#000",
        background: 'none',
        duration: 0.3,
      });
    };

    const handleLeave = () => {
      gsap.to(ball, {
        width: "10px",
        height: "10px",
        left: '-19px',
        borderRadius: "9999px",
        duration: 0.4,
        ease: "power2.inOut",
      });
      gsap.to(button, {
        color: "#fff",
        background: 'rgba(0, 0, 0, .3)',
        duration: 0.3,
      });
    };

    button.addEventListener("mouseenter", handleEnter);
    button.addEventListener("mouseleave", handleLeave);

    return () => {
      button.removeEventListener("mouseenter", handleEnter);
      button.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <>
    <div className="flex items-center ml-[30px] relative">
      <div
        ref={ballRef}
        className="h-[10px] w-[10px] round_ball bg-white rounded-full absolute left-[-19px] top-1/2 transform -translate-y-1/2 z-0"
      ></div>
      <button
        ref={buttonRef}
         onClick={() => setShowForm(true)}
        className="info-bar__btn relative"
      >
        <span className="Intrument_sans translate-y-full">Get in Touch</span>
      </button>
    </div>
    </>
  );
};

export default GetInTouch;
