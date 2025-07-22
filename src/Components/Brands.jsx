import React from "react";

const logos = [
  { src: "/brands/logo1.svg", alt: "logo1", width: 150 },
  { src: "/brands/logo2.svg", alt: "logo2", width: 150 },
  { src: "/brands/logo5.svg", alt: "logo3", width: 150 },
  { src: "/brands/logo7.svg", alt: "logo6", width: 150 },
  { src: "/brands/logo6.svg", alt: "logo7", width: 100 },
  { src: "/brands/logo10.svg", alt: "logo8", width: 150 },
  { src: "/brands/logo8.svg", alt: "logo9", width: 100 },
  { src: "/brands/logo1.svg", alt: "logo10", width: 150 },
  { src: "/brands/logo2.svg", alt: "logo11", width: 150 },
  { src: "/brands/logo5.svg", alt: "logo12", width: 150 },
  { src: "/brands/logo7.svg", alt: "logo13", width: 150 },
  { src: "/brands/logo6.svg", alt: "logo14", width: 100 },
  { src: "/brands/logo10.svg", alt: "logo15", width: 150 },
  { src: "/brands/logo8.svg", alt: "logo16", width: 100 },
];

const Brands = () => {
  return (
    <div className="brandlogos z-50">
      <div className="flex items-center min-w-full logo-slide">
        {[...logos, ...logos].map((logo, index) => (
          <img
            key={index}
            src={logo.src}
            alt={logo.alt}
            className={`BrandLogos h-auto mx-10`}
          />
        ))}
      </div>
    </div>
  );
};

export default Brands;
