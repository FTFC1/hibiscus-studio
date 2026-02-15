# /video — Video Knowledge Base

Process YouTube videos into knowledge base with analysis and frames.

## Usage

| Command | Action |
|---------|--------|
| `/video` | Show video-kb dashboard (what's processed, what's pending) |
| `/video process <url>` | Download + extract frames + create analysis |
| `/video search <query>` | Search across all video analyses |
| `/video insights` | Show parking lot (actionable items) |

## Instructions

### `/video` (Dashboard - Default)

1. Read `/projects/video-kb/STATUS.md` for system status
2. Glob `/projects/video-kb/bookmarks/*.md` to list all processed videos
3. Read `/projects/video-kb/INSIGHTS-PARKING.md` for pending actions
4. Output dashboard:

```
═══════════════════════════════════════════════
VIDEO KNOWLEDGE BASE
═══════════════════════════════════════════════
Status: ✅ Operational

PROCESSED ({count}):
• {date}: {video title}
• {date}: {video title}
...

PENDING ACTIONS ({count}):
• {insight summary} → {project}
• {insight summary} → {project}

PATTERNS ({count}):
• {pattern name}
...

Commands: /video process <url> | /video search <query> | /video insights
═══════════════════════════════════════════════
```

---

### `/video process <url>`

Process a YouTube video into the knowledge base.

**Download with fallbacks (try in order until success):**

```bash
# Create temp directory
cd /private/tmp

# Fallback 1: Android client (usually works)
yt-dlp --extractor-args "youtube:player_client=android" "<url>" -o "video.mp4"

# Fallback 2: Web client
yt-dlp --extractor-args "youtube:player_client=web" "<url>" -o "video.mp4"

# Fallback 3: Lower quality
yt-dlp -f "bestvideo[height<=720]+bestaudio/best" "<url>" -o "video.mp4"

# Fallback 4: Live stream handling
yt-dlp --live-from-start "<url>" -o "video.mp4"
```

**If ALL downloads fail:**
- Add to INSIGHTS-PARKING.md as "⏸️ Blocked - Download failed"
- Include URL and error message
- Notify user: "Download blocked. Added to parking lot for manual retrieval."

**After successful download:**

1. Extract frames using the script:
```bash
/projects/video-kb/extract-frames.sh video.mp4 /projects/video-kb/bookmarks/{date}-{slug}/ 20
```

2. Analyze the video:
   - Read transcript (if available via yt-dlp `--write-auto-sub`)
   - View key frames
   - Extract: main concepts, patterns, techniques, quotable moments

3. Create analysis file: `/projects/video-kb/bookmarks/{YYYY-MM-DD}-{slug}.md`

```markdown
---
source_url: {url}
processed_date: {YYYY-MM-DD}
duration: {duration}
channel: {channel name}
---

# {Video Title}

## Summary
{2-3 sentence summary}

## Key Concepts
- {concept 1}
- {concept 2}

## Patterns Extracted
- {pattern 1}: {description}

## Quotable Moments
> "{quote}" — {timestamp}

## Relevance
- **{PROJECT}**: {how it applies}

## Frames
{count} frames extracted to: /projects/video-kb/bookmarks/{slug}/
```

4. Delete source video (save storage)

5. Ask user: "Add insight to parking lot?"
   - If yes: append to INSIGHTS-PARKING.md with project tags

---

### `/video search <query>`

Search across all video analyses.

1. Grep `/projects/video-kb/bookmarks/*.md` for query
2. Grep `/projects/video-kb/patterns/*.md` for query
3. Output matches with file paths and context

```
═══════════════════════════════════════════════
SEARCH: "{query}"
═══════════════════════════════════════════════

FOUND IN ANALYSES:
• {video title} ({date})
  "{matching line}"
  Path: /projects/video-kb/bookmarks/{file}.md

FOUND IN PATTERNS:
• {pattern name}
  "{matching line}"
  Path: /projects/video-kb/patterns/{file}.md

Total: {count} matches
═══════════════════════════════════════════════
```

---

### `/video insights`

Show the insights parking lot.

1. Read `/projects/video-kb/INSIGHTS-PARKING.md`
2. Parse all insight entries
3. Group by project tag
4. Highlight unchecked action items

```
═══════════════════════════════════════════════
VIDEO INSIGHTS PARKING LOT
═══════════════════════════════════════════════

BY PROJECT:

[HB] (2 items)
• Camera pipeline: n8n → WaveSpeed → Kling
  - [ ] Explore WaveSpeed API pricing
  - [ ] Test Kling for product videos

[INFRA] (1 item)
• Daily Manifest: Macro/Mezzo/Micro framework
  - [ ] Credit Visualize Value in template
  - [ ] Add Macro/Mezzo/Micro labels

BLOCKED (0 items)
{Items that couldn't be downloaded}

Total: {count} insights, {unchecked} action items pending
═══════════════════════════════════════════════
```

---

## Data Structure

```
/projects/video-kb/
├── bookmarks/              # .md analyses + frame folders
│   ├── YYYY-MM-DD-slug.md
│   └── YYYY-MM-DD-slug/    # frames folder
├── patterns/               # Reusable patterns extracted
├── INSIGHTS-PARKING.md     # Actionable items from videos
├── STATUS.md               # System status
├── README.md               # Structure docs
└── extract-frames.sh       # ffmpeg tool
```

## Cost Profile

- Video download: free (local)
- Frame extraction: free (local ffmpeg)
- Transcript analysis: ~10-15k tokens per video
- Pattern extraction: ~5k tokens
- **Total per video: ~15-20k tokens** (very cheap)

Storage deleted: source videos (~10-50MB each)
Storage kept: .md files + key frames (~2-5MB each)

## When to Use

- `/video` — Quick status check
- `/video process <url>` — When user shares a YouTube video to analyze
- `/video search <query>` — Find insights across processed videos
- `/video insights` — Review what needs actioning from videos
