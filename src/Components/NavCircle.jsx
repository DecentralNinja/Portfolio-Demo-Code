import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState, } from "react";
import gsap from "gsap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";

const NavCircle = React.forwardRef(({ loading, onRouteChange }, ballRef) => {
  const location = useLocation();
  const navCircleRef = useRef(null);
  const navCircleBorderRef = useRef(null);
  const navCircleImg = useRef(null);
  const indicatorRef = useRef(null);
  const [visible, setvisible] = useState(false);
  const navigate = useNavigate();

  useImperativeHandle(ballRef, () => ({
    triggerPageTransition: (targetRoute) => {
      let hasMidRotationPassed = false;
      let hasNavigated = false

      const tl = gsap.timeline();

      
      tl.to([navCircleImg.current, indicatorRef.current], {
        rotation: + 360,
        duration: 3,
        ease: "none",
        onUpdate: function () {
          const newRotation = gsap.getProperty(indicatorRef.current, "rotation") % 360;
          if (!hasMidRotationPassed && newRotation >= 170 && newRotation <= 190 ) {
            setIndicatorPos(getIndicatorPosition(targetRoute));
            hasMidRotationPassed = true;

            // Call the passed transition handler
            if (!hasNavigated && onRouteChange) {
              onRouteChange(targetRoute);
              hasNavigated = true;
            }
          }
        },
      });

      return tl;
    },
  }));

  useEffect(() => {
    
    gsap.set(navCircleImg.current, {
      rotation: -180,
    });

    gsap.set(indicatorRef.current, {
      rotation: -180,
    });

    if (!loading) {
      setvisible(true);
      const tl = gsap.timeline();

      tl.to(
        navCircleBorderRef.current,
        {
          opacity: 1,
          pointerEvents: "none",
        },
        0
      );

      // Animate both SVGs together
      tl.to(
        [navCircleImg.current, indicatorRef.current], // Target both SVGs
        {
          rotation: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        0.1
      );

      // Step 3: Optionally hide the original circle (navCircleRef)
      tl.set(
        navCircleRef.current,
        {
          opacity: 0,
          pointerEvents: "none",
        },
        ">-0.3"
      );
    } else {
      setvisible(false);
    }
  }, [loading]);

  const getIndicatorPosition = useCallback((path) => {
    switch (path) {
      case "/":
        return { x: "-38%", y: "2%", rotate: "-50deg" };
      case "/work":
        return { x: "-40%", y: "15%", rotate: "0deg" };
      case "/about":
        return { x: "-55%", y: "15%", rotate: "50deg" };
      default:
        return { x: "-38%", y: "2%", rotate: "-50deg" };
    }
  }, []);

  const [indicatorPos, setIndicatorPos] = useState(() =>
    getIndicatorPosition(location.pathname)
  );

  const handleNavigation = useCallback((path) => {
      if (path === location.pathname) return;

      const currentRotation = gsap.getProperty(
        indicatorRef.current,
        "rotation"
      );
      let hasMidRotationPassed = false;

      if (onRouteChange) {
        onRouteChange(path);
      }

      if (!navCircleImg.current || !indicatorRef.current) return;

      gsap.to([navCircleImg.current, indicatorRef.current], {
        rotation: currentRotation + 360,
        duration: 2,
        ease: "power2.out",
        onUpdate: function () {
          const newRotation =
            gsap.getProperty(indicatorRef.current, "rotation") % 360;
          if (
            !hasMidRotationPassed &&
            newRotation >= 170 &&
            newRotation <= 190
          ) {
            setIndicatorPos(getIndicatorPosition(path));
            hasMidRotationPassed = true;
          }
        },
      });
    },
    [navigate, location.pathname, getIndicatorPosition, onRouteChange]
  );
  

  return (
    <div className="nav-circle-container">
      <section
        className="fixed bottom-0 left-0 w-full pointer-events-none z-50"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div
          ref={navCircleRef}
          className="absolute -bottom-[100px] left-[49.3%] -translate-x-1/2 z-50 w-fit pointer-events-auto"
          style={{
            width: "200px",
            height: "200px",
          }}
        >
          
          <div
            ref={navCircleBorderRef}
            className="relative h-full w-full flex items-center justify-center"
          ></div>
        </div>
        <div className="menu__dot relative"></div>
        <article className={`NavBarSvgs`}>
          <svg
            width="200"
            height="203"
            viewBox="0 0 200 203"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute -bottom-[107px] left-[49.4%] -translate-x-1/2 z-40"
            ref={navCircleImg}
          >
            <g clipPath="url(#clip0_192_195)">
              
              <g>
                <Link
                  to="/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/");
                  }}
                >
                  <path
                    transform="translate(5,20) scale(1)"
                    d="M13.5662 46.1399C12.2801 47.5169 8.83183 46.5621 5.51194 43.7742C1.88414 40.7507 -0.24829 36.7541 0.742054 34.8144C8.0168 20.6192 18.7696 8.91695 32.2287 0.471252C34.0649 -0.678472 38.1794 1.13293 41.4565 4.53193C44.7336 7.93092 45.891 11.5899 44.0549 12.7397C31.1368 20.8573 20.7997 32.1144 13.8283 45.7336C13.7427 45.8881 13.6701 46.0286 13.5662 46.1399Z"
                    fill="none"
                    style={{
                      pointerEvents: "all",
                      cursor: "pointer",
                      position: "relative",
                      zIndex: 3,
                      opacity: 0,
                    }}
                  />
                </Link>
                <path
                  d="M18.5368 62.4298L14.3219 60.2314L16.1897 56.6364L20.4128 58.843L21.793 56.2066L11.3136 50.7355L9.94175 53.3719L14.0409 55.5124L12.1649 59.0992L8.06571 56.9587L6.68555 59.595L17.1566 65.0661L18.5368 62.4298Z"
                  fill="currentcolor"
                  style={{ pointerEvents: "none" }}
                />
                <path
                  d="M17.4961 51.8099C20.4135 53.8678 23.7606 53.6529 25.9176 50.5785C28.0581 47.5372 27.149 44.2893 24.2317 42.2397C21.3226 40.1984 17.9672 40.438 15.8267 43.4794C13.6697 46.5455 14.5953 49.7686 17.5044 51.8099H17.4961ZM17.8102 44.8761C19.0498 43.1157 20.8019 43.5455 22.4796 44.7273C24.1655 45.9174 25.1655 47.4298 23.9341 49.1818C22.6862 50.9504 20.9424 50.5124 19.2482 49.3223C17.5705 48.1405 16.5622 46.6446 17.8102 44.8761Z"
                  fill="currentcolor"
                  style={{ pointerEvents: "none" }}
                />
                <path
                  d="M31.6857 42.7355L26.3386 37.6859L26.3634 37.6612L33.2146 41.1157L34.6444 39.6033L30.8097 32.9504L30.8345 32.9256L36.1816 37.9752L38.1072 35.9421L29.5204 27.8182L27.0245 30.4628L30.8345 37.405L30.8097 37.4297L23.6692 34.0165L21.165 36.6612L29.7518 44.7769L31.6857 42.7355Z"
                  fill="currentcolor"
                  style={{ pointerEvents: "none" }}
                />
                <path
                  d="M46.4217 29.2232L44.8928 27.3306L40.1655 31.1653L38.6366 29.2727L42.6449 26.0248L41.1159 24.1405L37.1077 27.3884L35.7854 25.7521L40.4382 21.9917L38.9093 20.0992L31.9424 25.7355L39.3804 34.9256L46.4217 29.2232Z"
                  fill="currentcolor"
                  style={{ pointerEvents: "none" }}
                />
              </g>
              {/* Group 2 (Top-right section) */}
              <g>
                <Link
                  to="/work"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/work");
                  }}
                >
                  <path
                    transform="translate(70,-5)"
                    d="M4.56907 22.3369C2.68623 22.4079 0.912068 19.3007 0.520677 14.9831C0.076709 10.2815 1.37959 5.94301 3.44901 5.26444C18.6132 0.317307 34.4888 -0.410155 49.9903 3.08011C52.1033 3.55803 53.7467 7.74256 53.6772 12.4635C53.6077 17.1845 51.8508 20.5965 49.7378 20.1186C34.8514 16.7767 19.5843 17.4812 5.0413 22.2333C4.87175 22.2826 4.72122 22.3312 4.56907 22.3369Z"
                    fill="currentcolor"
                    style={{
                      pointerEvents: "all",
                      cursor: "pointer",
                      position: "relative",
                      zIndex: 3,
                      opacity: 0,
                    }}
                  />
                </Link>
                <path
                  d="M79.3639 14.281L79.5539 6.70248L79.587 6.69421L82.8515 13.5372L85.7688 12.9174L86.2399 0.735535L83.3308 1.35537L83.5209 9.51239H83.4878L80.0167 2.05785L77.2729 2.64463L77.149 10.8678L77.1159 10.876L73.9589 3.34711L71.0498 3.96694L76.4548 14.9008L79.3639 14.281Z"
                  fill="currentcolor"
                  style={{ pointerEvents: "none" }}
                />
                <path
                  d="M94.5537 12.3388C98.2644 12.1157 100.24 9.3719 100.017 5.80991C99.8016 2.26446 97.5124 -0.214881 93.8016 0.00825942C90.0578 0.239664 88.1157 2.96694 88.3306 6.52066C88.5454 10.0826 90.8016 12.562 94.5454 12.3388H94.5537ZM93.9504 2.43801C96.0991 2.30578 96.8595 3.95041 96.9834 6C97.1074 8.06611 96.5537 9.78512 94.4049 9.91735C92.2396 10.0496 91.4958 8.40495 91.3719 6.33884C91.2479 4.28925 91.7851 2.57024 93.9504 2.43801Z"
                  fill="currentcolor"
                  style={{ pointerEvents: "none" }}
                />
                <path
                  d="M104.761 7.89254L106.604 8.0165C109.124 8.19006 107.81 11.7272 108.347 12.2644L111.43 12.471V12.3058C110.777 12.0578 112.166 7.57022 109.248 6.85121V6.81816C110.744 6.58675 111.728 5.67766 111.843 4.03303C111.992 1.89254 110.488 0.561959 107.868 0.380141L102.323 0.00823975L101.513 11.8016L104.48 12.0082L104.761 7.9008V7.89254ZM105.124 2.62807L107.133 2.76857C108.323 2.85121 108.918 3.32229 108.852 4.31402C108.785 5.30576 108.124 5.68593 106.942 5.61155L104.934 5.47105L105.133 2.63634L105.124 2.62807Z"
                  fill="currentcolor"
                  style={{ pointerEvents: "none" }}
                />
                <path
                  d="M116.033 10.0744L117.504 8.90909L119.637 14.0248L123.05 14.6777L119.612 7.24793L124.959 3.00826L121.827 2.40496L116.719 6.55372L117.67 1.6033L114.744 1.04132L112.513 12.6446L115.43 13.2149L116.033 10.0744Z"
                  fill="currentcolor"
                  style={{ pointerEvents: "none" }}
                />
              </g>

              <g>
                <Link
                  to="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/about");
                  }}
                >
                  <path
                    transform="translate(148, 15)"
                    d="M0.795309 12.6643C-0.591112 10.9539 0.714692 7.40479 3.9918 4.40489C7.54789 1.12159 12.0373 -0.313027 14.0553 1.20033C28.822 12.3052 40.6178 26.6484 48.6788 43.2174C49.7758 45.4773 47.4912 49.5622 43.557 52.379C39.6228 55.1958 35.5758 55.6421 34.4787 53.3822C26.7295 37.4766 15.3817 23.6863 1.21364 13.0409C1.05349 12.9131 0.907343 12.8025 0.795309 12.6643Z"
                    fill="currentcolor"
                    style={{
                      pointerEvents: "all",
                      cursor: "pointer",
                      position: "relative",
                      zIndex: 3,
                      opacity: 0,
                    }}
                  />
                </Link>
                <path
                  d="M154.099 26.6859L157.347 29.0992L156.487 31.5289L159.099 33.4711L162.512 21.281L160.107 19.4958L149.454 26.2975L152.016 28.1983L154.09 26.6777L154.099 26.6859ZM159.669 22.5702L159.694 22.5868L158.165 26.8843L155.991 25.2644L159.669 22.562V22.5702Z"
                  fill="currentcolor"
                  style={{ pointerEvents: "none" }}
                />
                <path
                  d="M163.752 37.9835C165.521 39.6777 167.356 40.0827 169.091 38.2645C170.314 36.9835 170.124 35.6612 169.372 34.6446L169.397 34.6198C170.331 35.0579 171.455 35.124 172.463 34.0744C173.86 32.6198 173.587 31.0331 171.81 29.3306L167.67 25.3636L159.496 33.9008L163.761 37.9835H163.752ZM168.132 29.1736L169.57 30.5455C170.166 31.1157 170.504 31.719 169.835 32.4215C169.157 33.124 168.546 32.8099 167.951 32.2397L166.521 30.8678L168.141 29.1736H168.132ZM166.744 33.6116C167.637 34.4711 167.901 35.1074 167.132 35.9091C166.364 36.7108 165.703 36.4876 164.81 35.6364L163.314 34.2066L165.248 32.1901L166.744 33.6198V33.6116Z"
                  fill="currentcolor"
                  style={{ pointerEvents: "none" }}
                />
                <path
                  d="M170.579 45.9256C172.909 48.8182 176.281 48.843 179.058 46.6033C181.827 44.3719 182.521 41.0744 180.19 38.1818C177.835 35.2562 174.488 35.2645 171.719 37.4959C168.943 39.7356 168.224 43.0083 170.579 45.9256ZM173.628 39.8595C175.224 38.5785 176.943 38.0166 178.298 39.7025C179.645 41.3719 178.744 42.9504 177.149 44.2314C175.538 45.5289 173.81 46.0661 172.463 44.3967C171.108 42.7108 172.017 41.1488 173.62 39.8595H173.628Z"
                  fill="currentcolor"
                  style={{ pointerEvents: "none" }}
                />
                <path
                  d="M177.347 55.562C179.207 58.6115 181.273 58.9587 183.793 57.4215L190.248 53.4876L188.702 50.9504L182.248 54.8843C180.934 55.6859 180.107 55.4132 179.43 54.2975C178.752 53.1818 178.884 52.3223 180.198 51.5206L186.653 47.5868L185.099 45.0496L178.645 48.9834C176.132 50.5124 175.488 52.5124 177.347 55.562Z"
                  fill="currentcolor"
                  style={{ pointerEvents: "none" }}
                />
                <path
                  d="M190.496 59.562L181.967 63.4876L183.206 66.1901L191.735 62.2645L193.173 65.3719L195.38 64.3554L191.264 55.4215L189.058 56.438L190.496 59.562Z"
                  fill="currentcolor"
                  style={{ pointerEvents: "none" }}
                />
              </g>
             
              <Link
                to="/work"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/work");
                }}
              >
                <path
                  d="M57.2067 20.9008C59.9453 20.9008 62.1654 18.6807 62.1654 15.9421C62.1654 13.2035 59.9453 10.9835 57.2067 10.9835C54.4681 10.9835 52.248 13.2035 52.248 15.9421C52.248 18.6807 54.4681 20.9008 57.2067 20.9008Z"
                  fill="currentcolor"
                />
              </Link>
              {/* Bottom decorative paths */}
              <path
                d="M195.727 73.8347C195.463 72.9587 194.545 72.4711 193.669 72.7356C192.793 73 192.306 73.9256 192.57 74.7934C195.314 83.8513 196.702 93.2893 196.702 102.843C196.702 156.157 153.322 199.537 100.008 199.537C46.6942 199.537 3.30579 156.157 3.30579 102.843C3.30579 91.6942 5.19008 80.7603 8.90083 70.3554C9.20661 69.4959 8.76033 68.5537 7.90083 68.2397C7.04132 67.9339 6.09917 68.3802 5.78512 69.2397C1.94215 80.0083 0 91.3058 0 102.843C0 157.983 44.8595 202.843 100 202.843C155.141 202.843 200 157.983 200 102.843C200 92.9587 198.562 83.1984 195.727 73.8347Z"
                fill="currentcolor"
              />
              <path
                d="M139.347 18.9421C142.086 18.9421 144.306 16.7221 144.306 13.9835C144.306 11.2449 142.086 9.02478 139.347 9.02478C136.609 9.02478 134.389 11.2449 134.389 13.9835C134.389 16.7221 136.609 18.9421 139.347 18.9421Z"
                fill="currentcolor"
              />
            </g>
          </svg>
          {/* Indicator SVG */}
          <div
            className="absolute -bottom-[100px] left-[49.3%] -translate-x-1/2 w-fit pointer-events-auto"
            style={{
              width: "200px",
              height: "200px",
              transform: `translate(${indicatorPos.x} , ${indicatorPos.y}) rotate(${indicatorPos.rotate})`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <svg
              ref={indicatorRef}
              width="200"
              height="203"
              viewBox="0 0 200 203"
              fill="none"
              className="z-30"
              style={{
                transform: `rotate(${indicatorPos.rotate})`,
                transformOrigin: "center",
              }}
            >
              <path
                d="M70.3979 3.82364C69.6059 3.82364 68.9099 3.23164 68.8139 2.42364C68.7019 1.54364 69.3179 0.743643 70.1979 0.631643C76.6459 -0.184357 83.3259 -0.208357 89.7819 0.551643C90.6619 0.655643 91.2859 1.44764 91.1819 2.32764C91.0779 3.20764 90.2859 3.83164 89.4059 3.72764C83.2059 2.99964 76.7819 3.02364 70.5979 3.80764C70.5259 3.81564 70.4619 3.82364 70.3979 3.82364Z"
                fill="currentcolor"
              />
            </svg>
          </div>
        </article>
      </section>
    </div>
  );
});

export default NavCircle;
