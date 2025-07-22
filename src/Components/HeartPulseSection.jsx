import React from "react";

const HeartPulseSection = () => {
  return (
    <>
      <div className="h-[130px] w-full my-[100px] mb-0 relative HeartPulseSect">
        <div className="absolute left-1/2 -top-3  -translate-x-[50%] ">
          <img
            src="/loveIcon.png"
            className="heart-icon "
            alt="heart-icon"
            width={36}
          />
        </div>
        <div className="h-full slider w-[128%] relative left-1/2 -translate-x-1/2 flex gap-12 items-center">
          {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-12 slider-Bar text-[12px]">
                <h5 className="Intrument_sans">Working next to a developer</h5>
                <h5 className="Intrument_sans">Launch day</h5>
                <h5 className="Intrument_sans">Escape Games</h5>
                <h5 className="Intrument_sans">Easing curves</h5>
                <h5 className="Intrument_sans">Mario</h5>
                <h5 className="Intrument_sans">Acai Bowl</h5>
                <h5 className="Intrument_sans">Soccerr</h5>
                <h5 className="Intrument_sans">Team Driven Enviorment</h5>
              </div>
            ))}
        </div>
        <div className="top-lef"></div>
        <div className="top-Rigt"></div>
        <div className="bott"></div>
      </div>
    </>
  );
};

export default HeartPulseSection;
