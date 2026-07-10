import React from 'react';
import Lottie from 'lottie-react';
import loaderAnimation from '../../assets/loader-3dots.json';

const Loader = ({ width = 150, height = 150, className = "" }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Lottie
        animationData={loaderAnimation}
        loop={true}
        autoplay={true}
        style={{ width, height }}
      />
    </div>
  );
};
export default Loader;