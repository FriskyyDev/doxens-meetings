# Favicon Generation Instructions

The Doxens.png logo is now used as the favicon for the website. For optimal browser compatibility, you may want to generate additional favicon formats.

## Current Setup
- Primary favicon: `Doxens.png` (PNG format)
- Fallback favicon: `favicon.ico` (ICO format)
- Apple touch icon: `Doxens.png`

## Optional: Generate Additional Favicon Formats

If you want to create a proper favicon.ico from your PNG file, you can use online tools or command-line tools:

### Online Tools:
- https://favicon.io/favicon-converter/
- https://realfavicongenerator.net/

### Command Line (if you have ImageMagick installed):
```bash
# Generate favicon.ico from PNG
magick Doxens.png -resize 32x32 favicon.ico

# Generate different sizes
magick Doxens.png -resize 16x16 favicon-16x16.png
magick Doxens.png -resize 32x32 favicon-32x32.png
magick Doxens.png -resize 192x192 android-chrome-192x192.png
magick Doxens.png -resize 512x512 android-chrome-512x512.png
```

## Files Updated:
- `src/index.html` - Updated favicon references
- `src/app/app.component.ts` - Added logo to navigation bar
