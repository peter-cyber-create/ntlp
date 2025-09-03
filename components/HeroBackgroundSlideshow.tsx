"use client"
import React, { useState, useEffect } from 'react';

const images = [
  '/images/JPEG-image-464A-BA7E-61-0.jpeg',
  '/images/Panelists-at-the-High-Level-engagement-on-Immunization-during-Dr-Sania-visit-to-Kampala--scaled.jpg',
];

export default function HeroBackgroundSlideshow({ className = "" }: { className?: string }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      {images.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt="Conference background"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === current ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      {/* Overlay for darkening and readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
    </div>
  );
}
