import React, { useState, useEffect, useRef } from "react";
import Cases from "../Components/Cases.jsx";
import gsap from "gsap";
import { useLocation } from "react-router-dom";
import GetInTouch from "../Components/GetInTouch";
import { Z_INDEX } from "../Components/zIndex.js";

const Work = () => {
  const infoBarRef = useRef();
  const location = useLocation();
  const contactFormRef = useRef();
  const contactFormSectionRef = useRef();
  const [showCases, setShowCases] = useState(false);
  const [ShowForm, setShowForm] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
  if (!infoBarRef.current) return;

  setShowCases(false);

  const tl = gsap.timeline();
  
  tl.fromTo(
    infoBarRef.current,
    { y: -100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out"
    }
  ).call(() => {
    setShowCases(true);
  }, [], "+=0.2"); // Add a small delay before showing cases

  return () => {
    tl.kill();
  };
}, [location.pathname]);

  useEffect(() => {
      if (ShowForm && contactFormRef.current && contactFormSectionRef.current) {
        const form = contactFormRef.current;
        const backdrop = contactFormSectionRef.current;
        
        // Initial state
        gsap.set(backdrop, {
          opacity: 0,
          backdropFilter: "blur(0px)",
          backgroundColor: "rgba(0,0,0,0)"
        });

        // Initial state
        gsap.set(form, {
          y: 100,
          opacity: 0,
        });
        
        // Animation sequence
      const tl = gsap.timeline();

      tl.to(backdrop, {
        opacity: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(10px)",
        duration: 0.4,
        ease: "power2.out"
      })
      .to(form, {
        y: -10, 
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.3")
      .to(form, {
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
      }
    }, [ShowForm]);


    

    const handleCloseForm = () => {
       if (contactFormRef.current && contactFormSectionRef.current) {
      const form = contactFormRef.current;
      const backdrop = contactFormSectionRef.current;

      const tl = gsap.timeline(); 
        
          tl.to(form, {
            y: -15, 
            duration: 0.2,
            ease: "sine.inOut"
          })
          .to(form, {
            y: 100, 
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
          })
          .to(backdrop, {
          opacity: 0,
          backgroundColor: "rgba(0,0,0,0)",
          backdropFilter: "blur(0px)",
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => setShowForm(false)
        }, "-=0.2");
      } else {
        setShowForm(false);
      }
    }


    // Add this new useEffect for click outside detection
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          ShowForm && 
          contactFormRef.current && 
          contactFormSectionRef.current &&
          !contactFormRef.current.contains(event.target) &&
          contactFormSectionRef.current.contains(event.target))
        {
          handleCloseForm();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ShowForm]);


  return (
    <>
      <section className="w-full">
        <div className="info-bar" ref={infoBarRef} style={{ transform: "translateY(-100px)" }}>
          <div className="info-bar__wrapper">
            <a href="/" className="info-bar__link" aria-label="Go to Home">
              <img src="/logo.svg" alt="" width={100} />
            </a>
            <span className="infoBar_title Intrument_sans">
              Creative FullStack Developer
            </span>
          </div>

          <div className="info-bar__wrapper">
            <span className="infoBar_title Intrument_sans">
              Available for Roles from July 2025
            </span>
            <GetInTouch ShowForm={ShowForm} setShowForm={setShowForm}/>
          </div>
        </div>
        {showCases && (
            <Cases key={location.key} />
        )}

        {ShowForm && (
        <div className="fixed inset-0 h-screen flex justify-center items-center bg-black opacity-0 bg-opacity-0 backdrop-blur-none" ref={contactFormSectionRef} style={{zIndex: Z_INDEX.MAX}}>
          <div className="relative bg-[#131414] text-white  max-w-[550px] px-[64px] py-[20px] rounded-xl shadow-xl" ref={contactFormRef} style={{ opacity: 0 }}>
            {/* Close Button */}
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="text-[100px] h-[120px] text-center">GET IN TOUCH</h2>
            <p className="my-5 text-[17px] text-center Intrument_sans" style={{color: 'hsla(0, 0%, 100%, .5)'}}>
              Feel free to reach out to me. I'm always open to discuss new projects.
            </p>

            {/* Form */}
            <form className="space-y-4 Intrument_sans flex flex-col">
              <input
                type="text"
                placeholder="*What is your name?"
                className="FormInputField"
              />
              <input
                type="email"
                placeholder="*What is your email?"
                className="FormInputField"
              />
              <input
                type="tel"
                placeholder="*What is your phone number?"
                className="FormInputField"
              />
              <textarea
                rows={4}
                placeholder="Would you like to leave a message?"
                className="FormInputField msgField"
              ></textarea>

              {/* Send Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-white text-black font-bold py-2 px-6 rounded-full Intrument_sans  hover:bg-gray-300 transition"
                >
                  SEND
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </section>
    </>
  );
};

export default Work;
