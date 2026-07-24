import React, { useState, useRef } from 'react';
import MobileStepper from '@mui/material/MobileStepper';
import { Box } from '@mui/material';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Swiper styles
import 'swiper/css';

export const ProductBanner = ({ images = [] }) => {
  const [activeStep, setActiveStep] = useState(0);
  const swiperRef = useRef(null);
  const maxSteps = images.length;

  return (
    <>
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveStep(swiper.activeIndex)}
        slidesPerView={1}
        loop={maxSteps > 1}
        style={{ width: '100%', height: '100%', overflow: 'hidden' }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} style={{ width: '100%', height: '100%' }}>
            <Box
              component="img"
              sx={{ width: '100%', objectFit: 'contain' }}
              src={image}
              alt={`Banner Image ${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div style={{ alignSelf: 'center' }}>
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
        />
      </div>
    </>
  );
};