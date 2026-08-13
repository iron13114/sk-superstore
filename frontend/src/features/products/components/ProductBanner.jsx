import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { useTranslation } from 'react-i18next';

export const ProductBanner = ({ images = [] }) => {
  const [activeStep, setActiveStep] = useState(0);
  const swiperRef = useRef(null);
  const maxSteps = images.length;
  const { t } = useTranslation();

  return (
    <div className="w-full h-full flex flex-col">
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
        className="w-full h-full overflow-hidden"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="w-full h-full">
            <img
              className="w-full h-full object-contain"
              src={image}
              alt={t('productBanner.imageAlt', { number: index + 1 })}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {maxSteps > 1 && (
        <div className="self-center flex items-center gap-2 py-3">
          {Array.from({ length: maxSteps }, (_, i) => (
            <button
              key={i}
              onClick={() => swiperRef.current?.slideTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeStep
                  ? 'w-6 h-2 bg-black'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={t('productBanner.goToSlide', { number: i + 1 })}
            />
          ))}
        </div>
      )}
    </div>
  );
};