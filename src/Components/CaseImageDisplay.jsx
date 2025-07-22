import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { Z_INDEX } from '../Components/zIndex';

const CaseImageDisplay = ({
  index = 0,
  project = {},
  isActive = false,
}) => {
  const titleWrapperRef = useRef(null);
  const titleRef = useRef(null);
  const imageRef = useRef(null);

  const hasLineBreak = project.title?.includes('<br/>');

  return (
    <>
      <div
        className={`case__title-wrapper ${
          hasLineBreak ? 'case__title-wrapper--extra' : ''
        }`}
        ref={titleWrapperRef}
      >
        <h2
          className="case__title"
          ref={titleRef}
          dangerouslySetInnerHTML={{ __html: project.title }}
        />
      </div>

      <div className="case__img-wrapper" ref={imageRef}>
        <figure className="case__figure">
          <img
            className={`case__img rotate-2 ${
              project.containOverviewHeader ? 'case__img--contain' : ''
            }`}
            src={project.image}
            alt={project.origTitle || project.title}
          />
        </figure>
      </div>
    </>
  );
};


export default CaseImageDisplay;
