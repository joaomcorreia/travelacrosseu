"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type HeroSlide = {
  image: string;
  caption: string;
  order: number;
};

type HeroSliderProps = {
  slides: HeroSlide[];
  fallbackImage?: string | null;
  height?: string;
  autoplay?: boolean;
  autoplayInterval?: number;
};

export default function HeroSlider({ 
  slides, 
  fallbackImage, 
  height = "h-96",
  autoplay = true,
  autoplayInterval = 5000 
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Use slides if available, otherwise fall back to single image
  const imageSlides = slides.length > 0 
    ? slides.filter(slide => slide.image && typeof slide.image === 'string' && slide.image.trim() !== "").sort((a, b) => a.order - b.order)
    : fallbackImage && typeof fallbackImage === 'string' && fallbackImage.trim() !== "" 
      ? [{ image: fallbackImage, caption: "", order: 0 }]
      : [];

  const hasMultipleSlides = imageSlides.length > 1;

  // Auto-advance slides
  useEffect(() => {
    if (!autoplay || !hasMultipleSlides) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imageSlides.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, hasMultipleSlides, imageSlides.length]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? imageSlides.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % imageSlides.length);
  };

  // Return null if no images available
  if (imageSlides.length === 0) {
    return null;
  }

  // Single image - no carousel needed
  if (!hasMultipleSlides) {
    const slide = imageSlides[0];
    return (
      <div className={`relative w-full ${height} overflow-hidden`}>
        <Image
          src={slide.image}
          alt={slide.caption || "Hero image"}
          fill
          className="object-cover"
          priority
        />
        {slide.caption && (
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        )}
        {slide.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-white text-lg font-medium drop-shadow-lg">
              {slide.caption}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Multiple images - full carousel
  return (
    <div className={`relative w-full ${height} overflow-hidden group`}>
      {/* Images */}
      <div className="relative w-full h-full">
        {imageSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.caption || `Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {slide.caption && (
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            )}
            {slide.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white text-lg font-medium drop-shadow-lg">
                  {slide.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows - only show on hover for clean look */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-6 h-6 text-white" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="w-6 h-6 text-white" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {imageSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? "bg-white scale-110" 
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 right-4 bg-slate-900/50 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
        {currentSlide + 1} / {imageSlides.length}
      </div>
    </div>
  );
}