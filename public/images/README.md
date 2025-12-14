# Image Management Guide

This directory contains all the images used in your wedding website. All images are served locally from this repository, ensuring your privacy.

## Directory Structure

```
public/
└── images/
    ├── gallery/       # Gallery section images
    │   ├── 1.jpg
    │   ├── 2.jpg
    │   ├── 3.jpg
    │   ├── 4.jpg
    │   ├── 5.jpg
    │   ├── 6.jpg
    │   ├── 7.jpg
    │   └── 8.jpg
    └── timeline/      # Timeline section images
        ├── first-meet.jpg
        ├── engagement.jpg
        └── wedding-day.jpg
```

## How to Add Your Own Images

### Gallery Images (8 images)

1. Place your photos in `public/images/gallery/`
2. Name them as: `1.jpg`, `2.jpg`, `3.jpg`, etc. (up to `8.jpg`)
3. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`

**Note:** If you want to use different names or add/remove images, edit the `defaultGalleryImages` array in `app/page.jsx` (around line 35).

### Timeline Images (3 images)

1. Place your photos in `public/images/timeline/`
2. Use these names:
   - `first-meet.jpg` - First meeting photo (Juni 2022)
   - `engagement.jpg` - Engagement/proposal photo (Desember 2023)
   - `wedding-day.jpg` - Wedding day photo (Desember 2025)

## Recommended Image Specifications

- **Format**: JPG or WebP (for better compression)
- **Aspect Ratio**: 
  - Gallery: Square (1:1) or Portrait (3:4) works best
  - Timeline: Landscape (4:3) or Square (1:1)
- **Resolution**: 1200x1200px or higher
- **File Size**: Keep under 500KB per image for faster loading

## Tips for Best Results

1. **Compress your images** before adding them
   - Use tools like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
   
2. **Consistent sizing** helps maintain a clean gallery layout

3. **Test locally** after adding images:
   ```bash
   npm run dev
   ```
   Then visit http://localhost:3000

4. **Backup originals** - Keep your original high-resolution photos elsewhere

## Privacy & Git

Your images will be stored in this repository. If you're pushing to a public GitHub repo:

- **Option 1**: Make the repository private (recommended)
- **Option 2**: Add images to `.gitignore` and deploy them separately to your hosting platform
- **Option 3**: Only use images you're comfortable sharing publicly

To exclude images from git:
```bash
# Add to .gitignore
echo "public/images/**" >> .gitignore
```

## Storage with localStorage

The gallery also supports localStorage. Image URLs stored in localStorage will override the default paths. This allows you to:
- Update gallery dynamically
- Use external URLs for some images
- Mix local and remote images

To clear localStorage and use default paths:
```javascript
localStorage.removeItem('weddingGalleryImages');
```
