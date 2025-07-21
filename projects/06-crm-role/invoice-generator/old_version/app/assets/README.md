# Mikano Invoice Template Assets

## High-Quality Image Support

This directory contains the visual assets for the Mikano invoice template.

### Required Files:

1. **`mikano_logo.png`** - Company logo
   - **Recommended size**: 300x150 pixels (or higher)
   - **Format**: PNG with transparent background
   - **Usage**: Appears in top-left corner of invoices
   - **Colors**: Should match Mikano corporate blue theme

2. **`mikano_banner.png`** - Footer banner  
   - **Recommended size**: 1800x250 pixels (or higher)
   - **Format**: PNG or JPG
   - **Usage**: Appears at bottom of invoices
   - **Content**: Can include contact info, website, additional branding

### Fallback Behavior:

If image files are not present, the template will use:
- **Text-based logo**: "MIKANO" in corporate blue
- **Text-based footer**: Terms and conditions with corporate styling

### Corporate Colors Used:

- **Primary Blue**: RGB(0, 31, 91) - Main branding color
- **Light Blue**: RGB(41, 98, 180) - Accent color  
- **Corporate Gray**: RGB(88, 89, 91) - Text color
- **Light Gray**: RGB(235, 236, 237) - Background color

### Adding Your Assets:

1. Save your logo as `mikano_logo.png`
2. Save your banner as `mikano_banner.png` 
3. Place both files in this `assets/` directory
4. Restart the Flask application
5. Generate a new invoice to see the images

### Image Guidelines:

- Use high-resolution images (300 DPI minimum)
- Maintain aspect ratios for best appearance
- Ensure text in images is readable at invoice size
- Test PDF output for quality before finalizing 