import React, { useState, useEffect } from 'react';
import LeftArrow from './LeftArrow';
import RightArrow from './RightArrow';
import Hero1 from '../../assets/hero1.png';
import Hero2 from '../../assets/hero2.png';
import Hero3 from '../../assets/hero3.png';
import Hero4 from '../../assets/hero4.png';

function HeroSection() {
  const images = [
    Hero1,
    Hero2,
    Hero3,
    Hero4
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Increment current image index
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [images.length]); // Depend on images.length to re-trigger useEffect when images change

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  return (
    <div style={{ position: 'relative' }}>

      <button
        onClick={goToPrevImage}
        style={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          zIndex: '1',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
        }}
      >
        <LeftArrow />
      </button>
      <button
        onClick={goToNextImage}
        style={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          zIndex: '1',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
        }}
      >
        <RightArrow />
      </button>

      {images.map((imageUrl, index) => (
        <img
          key={index}
          src={imageUrl}
          alt=""
          style={{
            display: index === currentImageIndex ? 'block' : 'none',
            width: '100%',
            height: '100%',
          }}
        />
      ))}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
      }}>
        {images.map((_, index) => (
          <div
            key={index}
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: index === currentImageIndex ? 'white' : 'gray',
              borderRadius: '50%',
              margin: '0 5px',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroSection;
