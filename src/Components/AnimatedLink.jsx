import { useEffect, useRef } from "react";
import gsap from "gsap";

const AnimatedLink = ({ href, children, target, ariaLabel }) => {
  const linkRef = useRef(null);
  const ballRef = useRef(null);

  useEffect(() => {
    const link = linkRef.current;
    const ball = ballRef.current;

    if (!link || !ball) return;

    const handleEnter = () => {
      gsap.to(ball, {
        width: "100%",
        height: "70%",
        borderRadius: "40px",
        backgroundColor: "#fff",
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to(link, {
        color: "#000",
        duration: 0.1,
      });
    };

    const handleLeave = () => {
      gsap.to(ball, {
        width: "12px",
        height: "12px",
        borderRadius: "9999px",
        duration: 0.4,
        ease: "power2.inOut",
      });
      gsap.to(link, {
        color: "#fff",
        duration: 0.3,
      });
    };

    link.addEventListener("mouseenter", handleEnter);
    link.addEventListener("mouseleave", handleLeave);

    return () => {
      link.removeEventListener("mouseenter", handleEnter);
      link.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 relative h-[30px">
      <div
        ref={ballRef}
        className="h-[8px] w-3 round_ball bg-white rounded-full absolute left-[-10px] top-1/2 transform -translate-y-1/2 z-0"
      ></div>
      <a
        ref={linkRef}
        href={href}
        target={target}
        aria-label={ariaLabel}
        className="contact-block__link relative z-10 Intrument_sans"
      >
        {children}
      </a>
    </div>
  );
};

export default AnimatedLink;