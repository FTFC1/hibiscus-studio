# 🌺 Hibiscus Studio Content Management System

## Overview
This system maintains consistent pricing, FAQs, and Terms & Conditions across:
- PDF price list
- Website 
- Acuity Scheduling (copy-paste format)

## Quick Start

### Update Everything
```bash
python update.py
```

### Manual Regeneration
```bash
python scripts/generate.py
```

## File Structure

```
├── data/
│   └── content.json          # Single source of truth for all content
├── templates/
│   ├── price-list.html       # PDF template
│   └── styles.css           # Styling for PDF
├── scripts/
│   └── generate.py          # Main generation script
├── output/                  # Generated files
│   ├── *.pdf               # Generated PDF
│   └── acuity-content.txt  # Copy-paste content for Acuity
└── update.py               # Easy update interface
```

## How It Works

### 1. Single Source of Truth
All content lives in `data/content.json`:
- Pricing for all services
- FAQ questions and answers  
- Terms & Conditions
- Business information

### 2. Automated Generation
The system generates:
- **PDF**: Professional price list with styling
- **Website Updates**: Updates pricing in current website
- **Acuity Content**: Copy-paste ready text for Acuity

### 3. Manual Acuity Updates
Since Acuity doesn't have an API for service updates, the system generates formatted text you can copy-paste into:
- Service descriptions (pricing)
- FAQ section
- Terms & Conditions

## Making Updates

### Change Pricing
1. Run `python update.py`
2. Choose option 1 (Update pricing)
3. Enter new base price (e.g., 50 for £50/hour)
4. System calculates all package prices automatically
5. Choose to regenerate content

### Add/Edit FAQs
1. Edit `data/content.json`
2. Add/modify entries in the `faqs` array
3. Run regeneration

### Update Terms & Conditions
1. Edit `data/content.json`
2. Modify `terms_and_conditions` array
3. Run regeneration

## Output Files

### PDF (`output/Hibiscus Studio - Price List & FAQ 005.pdf`)
- Professional formatted price list
- All pricing, FAQs, and T&Cs included
- Ready to send to clients

### Website Updates
- Automatically updates `current-june-28-2025/index.html`
- Updates pricing throughout the site
- Adds FAQ section
- Adds YouTube placeholder

### Acuity Content (`output/acuity-content.txt`)
- Formatted text for copy-paste into Acuity
- Separated sections for easy copying
- Includes all pricing, FAQs, and T&Cs

## Benefits

✅ **Single Update** - Change content once, update everywhere  
✅ **No Errors** - No manual copy-paste mistakes between platforms  
✅ **Version Control** - Track all changes with git  
✅ **Time Saving** - 5 minutes instead of 30 minutes for updates  
✅ **Consistency** - Same content across all platforms  
✅ **Professional** - Clean, styled PDF output  

## Dependencies

```bash
pip install jinja2 playwright
playwright install chromium
```

## Troubleshooting

### PDF Generation Issues
- Ensure Playwright and Chromium are installed
- Check that `output/` directory exists
- HTML fallback is generated if PDF fails

### Website Updates Not Working
- Check that `current-june-28-2025/index.html` exists
- Verify file permissions
- Review HTML structure matches expected format

### Acuity Manual Steps
Remember these are manual:
1. Copy pricing from `acuity-content.txt`
2. Paste into each service description in Acuity
3. Copy FAQ section into Acuity FAQ area
4. Copy T&Cs into Acuity Terms section

---

**Next Update**: When you need to change pricing or content, just run `python update.py` and follow the prompts! 