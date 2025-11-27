# Image Assets for TravelAcross EU

## Required Images

### Hero Section
- **Path**: `/public/images/hero/plane-takeoff-fallback.jpg`
- **Dimensions**: Recommended 1920x1080px (16:9 aspect ratio)
- **Description**: Mobile fallback image for hero section (desktop uses video)
- **Content**: Plane takeoff or European travel scene

### Categories
- **Path**: `/public/images/categories/default.jpg`
- **Dimensions**: Flexible, will be displayed in 4:3 aspect ratio containers
- **Description**: Default fallback image for category cards when no specific category image is provided
- **Content**: Generic travel/destination imagery

### Destinations
- **Path**: `/public/images/destinations/default.jpg`
- **Dimensions**: Flexible, will be displayed in 4:3 aspect ratio containers
- **Description**: Default fallback image for destination cards when no hero image is provided
- **Content**: European city or landscape imagery

### Trip Styles
- **Path**: `/public/images/trip-styles/`
  - `city-breaks.jpg` - Urban cityscapes and architecture
  - `coastal-trips.jpg` - Beaches, coastlines, islands
  - `train-first.jpg` - Train stations, scenic railways
  - `slow-winter.jpg` - Cozy winter scenes, cafes
- **Dimensions**: Flexible, will be displayed in 4:3 aspect ratio containers
- **Description**: Images representing different travel styles and approaches

### Quick Ideas (Multi-city Routes)
- **Path**: `/public/images/quick-ideas/`
  - `lisbon-porto.jpg` - Portuguese cities combination
  - `barcelona-valencia.jpg` - Spanish coastal cities
  - `paris-lyon.jpg` - French cities combination
  - `amsterdam-berlin.jpg` - Northern European cities
- **Dimensions**: Flexible, will be displayed in 4:3 aspect ratio containers
- **Description**: Images showcasing popular multi-city European routes

### Flights & Transportation
- **Path**: `/public/images/flights/planes-over-europe.jpg`
- **Dimensions**: Flexible, will be displayed in 4:3 aspect ratio containers
- **Description**: Planes, airports, or aerial views of Europe

## Video Assets

### Hero Background Video (Desktop)
- **Paths**: 
  - `/public/videos/hero-plane-takeoff.mp4`
  - `/public/videos/hero-plane-takeoff.webm`
- **Dimensions**: Recommended 1920x1080px minimum
- **Requirements**: Optimized for web, autoplay-safe (no audio), loop-friendly
- **Description**: Plane takeoff or European travel montage for hero background

## Usage Notes

- All images should be optimized for web (compressed JPG/PNG)
- Images will be automatically resized by Next.js Image component
- Fallback images ensure no broken image displays if API data is missing
- Replace placeholder files with actual professional travel photography
- Video files should be compressed and web-optimized for smooth autoplay
- Consider providing WebM format for better compression alongside MP4