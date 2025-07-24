
'use client'
import React, { useState, useEffect } from 'react';

const images = [
  '/images/JPEG-image-464A-BA7E-61-0.jpeg',
  '/images/Panelists-at-the-High-Level-engagement-on-Immunization-during-Dr-Sania-visit-to-Kampala--scaled.jpg',
  '/images/uganda-coat-of-arms.png',
];

export default function HomeSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-64 sm:h-96 lg:h-[32rem] relative overflow-hidden rounded-xl mb-8">
      {images.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt="Conference slideshow"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === current ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`block w-3 h-3 rounded-full bg-white/70 border border-primary-500 transition-all duration-300 ${idx === current ? 'scale-125 bg-primary-500' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
