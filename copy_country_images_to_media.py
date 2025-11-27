#!/usr/bin/env python3
"""
Copy country images from frontend/public/images/countries/ to Django media directory
"""

import os
import shutil
from pathlib import Path

def copy_country_images():
    """Copy country images to Django media directory"""
    
    # Define paths
    frontend_images_dir = Path('frontend/public/images/countries')
    django_media_dir = Path('media/images/countries')
    
    # Create Django media directory if it doesn't exist
    django_media_dir.mkdir(parents=True, exist_ok=True)
    
    if not frontend_images_dir.exists():
        print(f"Frontend images directory not found: {frontend_images_dir}")
        return
    
    # Copy each image file
    copied_count = 0
    for image_file in frontend_images_dir.glob('*.jpg'):
        dest_file = django_media_dir / image_file.name
        
        try:
            shutil.copy2(image_file, dest_file)
            print(f"✅ Copied {image_file.name}")
            copied_count += 1
        except Exception as e:
            print(f"❌ Error copying {image_file.name}: {e}")
    
    print(f"\nCopied {copied_count} country images to Django media directory")
    print(f"Django media directory: {django_media_dir.absolute()}")

if __name__ == "__main__":
    copy_country_images()