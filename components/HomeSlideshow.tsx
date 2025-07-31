

'use client'
import React, { useState, useEffect } from 'react';

const slides = [
  {
    src: '/images/home1.jpeg',
    alt: 'Conference day 1',
    caption: 'Keynote: Dr. Charles Ouma',
    title: 'Keynote speaker',
    name: 'Dr. Charles Ouma',
  },
  {
    src: '/images/home2.jpg',
    alt: 'Conference day 2',
    caption: 'Panel: Dr. Diana Nambatya',
    title: 'Panelist',
    name: 'Dr. Diana Nambatya',
  },
];

function toSentenceCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function nameToSentenceCase(str: string) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

export default function HomeSlideshow() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[40vh] sm:h-[60vh] lg:h-[80vh] relative overflow-hidden">
      {slides.map((slide, idx) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === current ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`block w-3 h-3 rounded-full bg-white/70 border border-primary-500 transition-all duration-300 ${idx === current ? 'scale-125 bg-primary-500' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
