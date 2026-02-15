# Deploying PUMA Presentation to GitHub Pages

## Quick Setup (5 minutes)

### 1. Create GitHub Repo
```bash
cd /Users/nicholasfeyintolafolarin-coker/trellomcp/trello-mcp/projects/1_Projects/PUMA-Training-Pilot-2026/slides

# Initialize git if not already done
git init

# Create .gitignore if needed
echo "*.DS_Store" > .gitignore

# Add files
git add puma-pilot-presentation-v2.html README.md
git commit -m "Initial presentation commit"

# Create repo on GitHub (via gh CLI or web)
gh repo create puma-pilot-2026 --public --source=. --remote=origin --push

# OR if you prefer creating on GitHub.com:
# 1. Go to github.com/new
# 2. Create repo named "puma-pilot-2026"
# 3. Run these commands:
git remote add origin https://github.com/YOUR_USERNAME/puma-pilot-2026.git
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Pages
```bash
# Via gh CLI (fastest):
gh repo edit --enable-pages --pages-branch main --pages-path /

# OR manually:
# 1. Go to your repo on GitHub
# 2. Settings → Pages
# 3. Source: Deploy from branch
# 4. Branch: main, folder: / (root)
# 5. Save
```

### 3. Set index.html as Homepage
```bash
# Rename v2 to index.html (GitHub Pages serves index.html by default)
cp puma-pilot-presentation-v2.html index.html
git add index.html
git commit -m "Add index.html for GitHub Pages"
git push
```

### 4. Get Your URL
Your presentation will be live at:
```
https://YOUR_USERNAME.github.io/puma-pilot-2026/
```

Wait 2-3 minutes for first deployment, then share this URL.

## Updating the Presentation

When you make changes:
```bash
# Edit the file locally
# Then:
git add index.html
git commit -m "Update presentation with Timi's feedback"
git push

# Live in ~1 minute
# Timi just refreshes the URL - no new link needed
```

## Alternative: Use HTML file directly

If GitHub Pages is too much setup:
1. Upload `puma-pilot-presentation-v2.html` to any folder
2. Share file path with Timi
3. He opens in browser
4. When you update, he re-opens the file

**Trade-off:** He needs file access vs. just a URL.

## Recommended Approach

**For Timi (before PUMA presentation):**
- Use local HTML file or Netlify (faster than GitHub Pages setup)
- Get his feedback first

**For PUMA leadership:**
- Deploy to GitHub Pages or generate PDF
- More professional delivery
