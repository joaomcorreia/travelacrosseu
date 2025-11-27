"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

// Static hero images for the slider
const HERO_IMAGES = [
  "/images/hero/europe-hero.jpg",
  "/images/hero/test-slider.jpg",
  "/images/hero/plane-takeoff-fallback.jpg"
];

export default function TestHeroPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance the hero slider (pause on hover)
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % HERO_IMAGES.length
      );
    }, 3000); // Change image every 3 seconds for testing

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div style={{ backgroundColor: '#1e293b', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
        Hero Image Test Page
      </h1>
      
      <section 
        className="relative overflow-hidden min-h-[500px] flex items-center bg-red-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ position: 'relative', border: '2px solid yellow' }}
      >
        {/* Background Images with Transition */}
        {HERO_IMAGES.map((image, index) => (
          <Image
            key={image}
            src={image}
            alt={`TravelAcross EU Hero ${index + 1}`}
            fill
            className={`object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            priority={index === 0}
            style={{ zIndex: -1 }}
          />
        ))}
        
        {/* Content */}
        <div className="relative z-10 text-center text-white p-8">
          <h2 className="text-4xl font-bold mb-4">Hero Section Test</h2>
          <p className="text-lg">Current image: {currentImageIndex + 1} of {HERO_IMAGES.length}</p>
          <p className="text-lg">Image path: {HERO_IMAGES[currentImageIndex]}</p>
          <p className="text-sm mt-4">Hover to pause auto-rotation</p>
        </div>
        
        {/* Navigation dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to hero image ${index + 1}`}
            />
          ))}
        </div>
      </section>
      
      {/* Image existence test */}
      <div style={{ padding: '20px', color: 'white' }}>
        <h3>Direct Image Test:</h3>
        {HERO_IMAGES.map((imagePath, index) => (
          <div key={index} style={{ margin: '10px 0' }}>
            <p>Image {index + 1}: {imagePath}</p>
            <Image 
              src={imagePath} 
              alt={`Direct test ${index + 1}`} 
              width={200} 
              height={150}
              style={{ border: '1px solid white' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}