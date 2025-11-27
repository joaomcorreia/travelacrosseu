#!/usr/bin/env python3
"""
Create placeholder images for blog posts
"""

import os
import json
from PIL import Image, ImageDraw, ImageFont
import random

def create_placeholder_image(text, filename, width=800, height=400):
    """Create a placeholder image with text overlay"""
    # Random colors for variety
    colors = [
        ('#2C3E50', '#ECF0F1'),  # Dark blue/light gray
        ('#8E44AD', '#F8F9FA'),  # Purple/white
        ('#E74C3C', '#FFFFFF'),  # Red/white
        ('#3498DB', '#FFFFFF'),  # Blue/white
        ('#27AE60', '#FFFFFF'),  # Green/white
        ('#F39C12', '#2C3E50'),  # Orange/dark
        ('#34495E', '#BDC3C7'),  # Dark gray/light gray
        ('#16A085', '#FFFFFF'),  # Teal/white
    ]
    
    bg_color, text_color = random.choice(colors)
    
    # Create image
    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Try to use a system font, fallback to default
    try:
        font = ImageFont.truetype("arial.ttf", 36)
        small_font = ImageFont.truetype("arial.ttf", 24)
    except:
        try:
            font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 36)
            small_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 24)
        except:
            font = ImageFont.load_default()
            small_font = ImageFont.load_default()
    
    # Wrap text to fit image
    words = text.split()
    lines = []
    current_line = []
    
    for word in words:
        test_line = ' '.join(current_line + [word])
        bbox = draw.textbbox((0, 0), test_line, font=font)
        if bbox[2] - bbox[0] > width - 100:  # 50px padding on each side
            if current_line:
                lines.append(' '.join(current_line))
                current_line = [word]
            else:
                lines.append(word)  # Single word is too long, add anyway
        else:
            current_line.append(word)
    
    if current_line:
        lines.append(' '.join(current_line))
    
    # Limit to 3 lines max
    if len(lines) > 3:
        lines = lines[:2] + ['...']
    
    # Calculate total text height
    total_height = len(lines) * 50  # Approximate line height
    start_y = (height - total_height) // 2
    
    # Draw text lines
    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        y = start_y + i * 50
        draw.text((x, y), line, font=font, fill=text_color)
    
    # Add "Placeholder" watermark at bottom
    watermark = "Travel Across EU"
    bbox = draw.textbbox((0, 0), watermark, font=small_font)
    watermark_width = bbox[2] - bbox[0]
    draw.text((width - watermark_width - 20, height - 40), watermark, font=small_font, fill=text_color, anchor="lt")
    
    # Save image
    img.save(filename, 'JPEG', quality=85)
    print(f"Created: {filename}")

def main():
    # Load the travel stories JSON
    json_file = 'content/travel-stories-pt1.json'
    media_dir = 'media'
    
    if not os.path.exists(json_file):
        print(f"JSON file not found: {json_file}")
        return
    
    with open(json_file, 'r', encoding='utf-8') as f:
        stories = json.load(f)
    
    # Create images directory if it doesn't exist
    images_dir = os.path.join(media_dir, 'images', 'blog', 'travel-stories')
    os.makedirs(images_dir, exist_ok=True)
    
    # Create placeholder image for each story
    for story in stories:
        if story.get('hero_image'):
            # Extract filename from path
            image_path = story['hero_image'].lstrip('/')
            full_path = os.path.join(media_dir, image_path)
            
            # Skip if image already exists (don't overwrite uploaded images)
            if os.path.exists(full_path):
                print(f"Skipped: {full_path} (already exists)")
                continue
            
            # Create directory if needed
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            
            # Create placeholder image
            title = story.get('title', 'Travel Story')
            create_placeholder_image(title, full_path)

if __name__ == '__main__':
    main()