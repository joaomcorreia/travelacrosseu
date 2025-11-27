# Fallback Image for Categories Section

This directory contains the fallback image for the categories section.

## Required File

- **default.jpg** - A default category image (1200x800px recommended) to be used when category.image is null or empty

## Usage

The fallback image is used in `components/home/CategoriesSection.tsx` when:
1. `category.image` is `null`
2. `category.image` is an empty string
3. `category.image.trim()` returns an empty string

## Implementation

```typescript
const FALLBACK_IMAGE = "/images/categories/default.jpg";

const src = category.image && category.image.trim() !== "" 
  ? category.image 
  : FALLBACK_IMAGE;
```

## Recommended Image Specifications

- **Format**: JPG or WebP
- **Dimensions**: 1200x800px (3:2 aspect ratio)
- **File size**: < 200KB for optimal performance
- **Content**: Generic European travel scene or abstract design that works for all categories