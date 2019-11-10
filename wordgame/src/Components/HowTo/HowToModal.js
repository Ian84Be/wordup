import React from 'react';
import HowTo from './HowTo';
const HowToModal = ({ showHowTo }) => {
  return (
    <>
      <span className="Modal" onClick={() => showHowTo(false)}></span>
      <HowTo />
    </>
  );
};

export default HowToModal;
