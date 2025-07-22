import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import Brands from "../Components/Brands";
import HeartPulseSection from "../Components/HeartPulseSection";
import { useOutletContext } from "react-router-dom";
import GetInTouch from "../Components/GetInTouch";
import { Z_INDEX } from "../Components/zIndex";
import AnimatedLink from "../Components/AnimatedLink";


const About = () => {
  const infoBarRef = useRef();
  const location = useLocation();
  const [ShowCases, setShowCases] = useState(false);
  const { loading } = useOutletContext();
  const contentRef = useRef(null);
  const [activeElement, setActiveElement] = useState("header");
  const footerRef = useRef(null);
  const contactFormRef = useRef();
  const contactFormSectionRef = useRef();
  const [ShowForm, setShowForm] = useState(false)

  // New refs for content sections
  const aboutSectionRef = useRef();
  const brandsRef = useRef();
  const atWorkSectionRef = useRef();
  const inLifeSectionRef = useRef();
  const techniquesRef = useRef();
  const headerRef = useRef(null);

  // InfoBar UseEffect
  useEffect(() => {
    if (loading) return;
    if (!infoBarRef.current) return;

    setShowCases(false);

    gsap.set(infoBarRef.current, {
      y: -100,
      opacity: 0,
    });

    gsap.to(infoBarRef.current, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      onComplete: () => {
        setTimeout(() => setShowCases(true), 50);
      },
    });

    return () => {
      gsap.killTweensOf(infoBarRef.current);
    };
  }, [location.pathname, loading]);

  // About Content UseEffect
  useEffect(() => {
    if (loading) return;

    const timeout = setTimeout(() => {
      const masterTL = gsap.timeline();

    const animateContent = () => {
      const creative = document.querySelector(".creative_Word");
      const developer = document.querySelector(".Developer_Word");
      const pageContent = document.querySelector(".page__content--about");

      if (!creative || !developer || !pageContent) {
        setTimeout(animateContent, 50);
        return;
      }

      gsap.set([creative, developer], { y: "100%", opacity: 0 });
      gsap.set(pageContent, { opacity: 0, y: 50 });

      if (atWorkSectionRef.current) {
        const imgs = atWorkSectionRef.current.querySelectorAll("img");
        if (imgs.length > 0) {
          gsap.set(imgs, { y: 0, opacity: 1 });
        }
      }
      if (inLifeSectionRef.current) {
        const imgs = inLifeSectionRef.current.querySelectorAll("img");
        if (imgs.length > 0) {
          gsap.set(imgs, { x: -20, opacity: 1 });
        }
      }

      // Header animation
      masterTL
        .to(creative, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        })
        .to(
          developer,
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8"
        );

      // Page content animation
      masterTL.to(
        pageContent,
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.5"
      );

      if (aboutSectionRef.current) {
        const text = aboutSectionRef.current.querySelectorAll("h3, p");
        if (text.length > 0) {
          masterTL.from(
            text,
            {
              y: 50,
              opacity: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out",
            },
            "-=0.5"
          );
         
          masterTL.from(
            brandsRef.current,
            {
              y: 100,
              opacity: 0,
              duration: 1,
              ease: "elastic.out(1, 0.5)",
            },
            "+=0.3"
          );
        }
      }

      
      if (atWorkSectionRef.current) {
        const texts = atWorkSectionRef.current.querySelectorAll("h2, p");
        if (texts.length > 0) {
          masterTL
            .from(texts, {
              y: 80,
              opacity: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: "back.out(1.7)",
            })
        }
      }

      
      if (inLifeSectionRef.current) {
        const texts = inLifeSectionRef.current.querySelectorAll("h2, p");
        if (texts.length > 0) {
          masterTL
            .from(
              texts,
              {
                x: -100,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
              },
              "+=0.2"
            )
        }
      }

      
      if (techniquesRef.current) {
        const texts = techniquesRef.current.querySelectorAll("h3, li");
        if (texts.length > 0) {
          masterTL.from(
            texts,
            {
              y: 30,
              opacity: 0,
              duration: 0.6,
              stagger: 0.05,
              ease: "power2.out",
            },
            "-=0.3"
          );
        }
      }
    };
     animateContent();
    }, 50);

      return () => clearTimeout(timeout);

    }, [loading, location.pathname]);

  useEffect(() => {
    if (loading) return;

    const container = contentRef.current?.closest(".page--about") || window;
    if (!container) return;

    const handleScroll = () => {
      if (!contentRef.current || !footerRef.current) return;

      const scrollY = container.scrollTop;
      const contentTop = contentRef.current.offsetTop;
      const contentHeight = contentRef.current.offsetHeight;
      const triggerPoint = contentTop + contentHeight / 2;

      
      if (scrollY >= triggerPoint) {
        setActiveElement("footer");
      } else {
        setActiveElement("header");
      }

      const windowHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;

      const scrollPercentage = scrollY / (scrollHeight - windowHeight);

      if (scrollPercentage >= 0.99) {
        footerRef.current.classList.add("zindex-99");
        setActiveElement("footer");
      } else {
        footerRef.current.classList.remove("zindex-99");
      }

      // Also switch to footer when near bottom (original logic)
      if (scrollY + windowHeight >= scrollHeight - 100) {
        setActiveElement("footer");
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading]);

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

  return (
    <div>
      <div
        className="info-bar infoBarAbout"
        ref={infoBarRef}
        style={{ transform: "translateY(-100px)" }}
      >
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
      
      <section className="Aboutpage page--about">
        <header
          className={`header header--top ${
            activeElement === "header" ? "is-active" : ""
          }`}
          ref={headerRef}>
          <h2>
            <span className="about_text_Conta">
              <span className="creative_Word about_text">Creative</span>
            </span>
          </h2>
          <h2>
            <span className="about_text_Conta">
              <span className="Developer_Word about_text">Developer</span>
            </span>
          </h2>
        </header>

        <div
          className="Aboutpage__content page__content--about"
          ref={contentRef}>
          <section
            className="section--about"
            style={{ translate: "none", rotate: "none", scale: "none", opacity: 1, transform: "translate(0px, 0px)", }}>
            <div className="grid-container centered content-block">
              <div className="grid aboutSectiont" ref={aboutSectionRef}>
                <div className="col col-m--3">
                  <h3 className="content-block__title">About</h3>
                </div>
                <div className="col col-m--9">
                  <h3 className="content_About-Desc Intrument_sans"> I'm a Creative Full Stack Developer with 5+ years of expereince working with well known companies and creative agencies </h3>
                  <p className="content_About_smallDesc Intrument_sans"> I Design and Develop digital products and websites for , brands, and entrepreneurs with cool projects.{" "} </p>
                </div>
              </div>
              <div className="logo-block" ref={brandsRef}>
                <article className="flex flex-col relative z-50">
                  <Brands />
                </article>
              </div>

              <div className="flex items-center  workSection" ref={atWorkSectionRef} >
                <div className="flex justify-center w-full WorksectionImg">
                  <div className="w-full relative">
                    <img
                      src="/Aboutme/atWork4.svg"
                      alt="old3"
                      className="w-[59%] absolute z-10  left-1/2 translate-x-[-60%] translate-y-[50%] transition-all duration-500 hover:z-0 rotate-3 scale-[1] rounded-2xl"
                    />
                    <img
                      src="/Aboutme/atWork3.svg"
                      alt="old"
                      className="w-[60%] absolute z-0 left-1/2 translate-x-[-60%] translate-y-[50%] transition-all duration-500 hover:z-20 -rotate-3 scale-[0.9] rounded-2xl"
                    />
                  </div>
                </div>
                <div className="atWorkWidth">
                  <h2 className="content_AtWork">At Work</h2>
                  <p className="text-black Intrument_sans text-[20px] mt-10"> I ask many questions to grasp the issues my clients need to fix and the outcomes they hope to reach. I then direct designers to produce high-fidelity mockups that strive to meet those objectives. These mockups are transformed into polished user interfaces, occasionally enhanced with gentle motion, for prototyping and user testing. Once approved, they move to the development phase, which I manage. </p>
                </div>
              </div>

              <div
                className="flex flex-row-reverse items-center gap-22  lifeSection"
                ref={inLifeSectionRef}
              >
                <div className="flex justify-center w-full inLifesectionImg">
                  <div className="w-full relative">
                    <img
                      src="/Aboutme/atHome.svg"
                      alt="home1"
                      className="w-[66%] absolute z-10  left-[90%] translate-x-[0%] -translate-y-[50%] transition-all duration-500 hover:z-0 rotate-3 scale-[0.9] rounded-2xl"
                    />
                    <img
                      src="/Aboutme/atHome2.svg"
                      alt="home2"
                      className="w-[70%] absolute z-0 left-[90%] translate-x-[0%] -translate-y-[50%] transition-all duration-500 hover:z-20 -rotate-3 scale-[0.9] rounded-2xl"
                    />
                  </div>
                </div>
                <div className="atWorkWidth">
                  <h2 className="content_AtWork">In Life</h2>
                  <p className="text-black Intrument_sans text-[20px] mt-10"> I’m the guy who always organizes the holiday trips, and I usually send the most messages on my family’s WhatsApp group. I’m a passionate world traveler (40+ countries). I once tried to run a marathon with zero training. I made it to the snack table and called it a win. I don’t like to comb my hair—you’ll always find it messy. People often think I just woke up.{" "} </p>
                </div>
              </div>
              <HeartPulseSection/>

              <div
                className="mt-[70px] grid-container centered content-block"
                ref={techniquesRef}
              >
                <div className="grid">
                  <div className="col col-m--3">
                    <h3 className="content-block__title">Techniques</h3>
                  </div>
                  <div className="col col-m--9">
                    <div
                      className="content-block__lists"
                      style={{
                        translate: "none",
                        rotate: "none",
                        scale: "none",
                        transform: "translate3d(0px, 9.7414px, 0px)",
                        opacity: 0.6103,
                        willChange: "opacity",
                      }}
                    >
                      <ul className="content-block__list content-block__list--techniques text-black">
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            Javascript
                          </span>
                        </li>
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            ReactJS
                          </span>
                        </li>
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            AngularJS
                          </span>
                        </li>
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            MaterialUI
                          </span>
                        </li>
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            ShadCN
                          </span>
                        </li>
                      </ul>
                      <ul className="content-block__list content-block__list--techniques text-black">
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            Git Bitbucket
                          </span>
                        </li>
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            React Hooks
                          </span>
                        </li>
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            UI Designing
                          </span>
                        </li>
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            Figma
                          </span>
                        </li>
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            Sketch
                          </span>
                        </li>
                      </ul>
                      <ul className="content-block__list content-block__list--techniques text-black">
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            GSAP
                          </span>
                        </li>
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            HTML
                          </span>
                        </li>
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            SmoothScrolling
                          </span>
                        </li>
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            GSAp
                          </span>
                        </li>
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            UX Designing
                          </span>
                        </li>
                      </ul>
                      <ul className="content-block__list content-block__list--techniques text-black">
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            Balsamiq
                          </span>
                        </li>
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            Invision
                          </span>
                        </li>
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            Indesign
                          </span>
                        </li>
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            Adobe Photoshop
                          </span>
                        </li>
                        <li className="content-block__list-item">
                          <span className="content-block__list-item-title content-block__list-item-title--small Intrument_sans">
                            Adobe Illustrator
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer
          className={`contact-block ${
            activeElement === "footer" ? "is-active" : ""
          }`}
          ref={footerRef}
        >
          <div
            className="contact-block__container"
            style={{
              translate: "none",
              rotate: "none",
              scale: "none",
              transform: "translate3d(0px, -0.360px, 0px)",
            }}
          >
            <div
              className="contact-block__wrapper"
              style={{ marginBottom: "20px" }}
            >
              <h3 className="contact-block__heading">Let's</h3>
              <div className="contact-block__img-wrapper">
                <img
                  src="/Aboutme/Profile-Pic.svg"
                  alt="About me"
                  title="Contact"
                />
              </div>
              <h3 className="contact-block__heading">work</h3>
            </div>
            <div
              className="contact-block_wrapper contact-block__wrapper--reach-out"
              style={{ marginBottom: "0px" }}
            >
              <span className="contact-block__reach-out Intrument_sans">
                Feel free to reach out to me. I'm always open to discuss new
                oppertunities.
              </span>
              <div className="contact-block__details">
                <AnimatedLink href="mailto:maazhamid2561966@gmail.com">
                  <span
                    className="contact-block__label Intrument_sans"
                    data-content="maazhamid@2561966gmail.com"
                  >
                    maazhamid2561966@gmail.com
                  </span>
                </AnimatedLink>
                <AnimatedLink href="https://www.linkedin.com/in/maazuiux/" target="_blank" aria-label="LinkedIn">
                  <span className="contact-block__label Intrument_sans"> Linkdien </span>
                </AnimatedLink>
              </div>
            </div>
            <div
              className="contact-block__wrapper"
              style={{ marginBottom: "30px" }}
            >
              <h3 className="contact-block__heading">together</h3>
            </div>
          </div>
        </footer>

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
    </div>
  );
};

export default About;
