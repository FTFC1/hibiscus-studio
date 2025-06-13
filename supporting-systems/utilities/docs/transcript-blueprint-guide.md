# 🔹 **Transcript to Blueprint Guide**

## **Quick Start**

```bash
# Process any transcript file
node scripts/transcript-to-blueprint.js your-transcript.txt

# Custom output location  
node scripts/transcript-to-blueprint.js input.txt output-blueprint.md
```

## **What It Extracts**

**⚡ Immediate Actions** - Categorised by urgency:
- This Week (🔥 High Priority) - Blockers and urgent items
- Next 30 Days (⚡ Medium Priority) - Important but not urgent  
- When Energy Available (💡 Low Friction) - Optimisations and nice-to-haves

**🔗 Cross-Project Themes** - Patterns affecting multiple projects:
- Root cause analysis
- Leverage points for maximum impact
- Specific next actions to test across projects

**💎 Strategic Insights** - System-level truths:
- Market dynamics and positioning insights
- Counter-intuitive patterns  
- Leverage opportunities
- Filters out tactical/tool tips

**📋 Structured Sections** - Properly formatted with:
- Major headings with emojis and bold
- Subsections with bold, no emoji
- Consistent bullet formatting

## **Input Format Tips**

Works best with:
- Natural speech transcripts
- Meeting notes with clear topics
- Strategy sessions
- Interviews and demos

**Optimise extraction by including:**
- Clear section breaks
- Action-oriented language ("need to", "should", "will")
- Context around decisions ("because", "since", "due to")
- Project names and relationships
- Strategic observations and insights

## **Output Structure**

1. **Metadata** - Date, source, tags, length
2. **Main Content** - Structured sections with proper formatting
3. **Cross-Project Themes** - Connections and leverage points  
4. **Immediate Actions** - Priority-grouped with impact ratings
5. **Strategic Insights** - High-level patterns and dynamics
6. **Quality Check Questions** - For validation and reflection

## **Integration Notes**

- Exports `TranscriptToBlueprint` class for programmatic use
- Follows your exact formatting specifications
- Handles various transcript types and sources
- Maintains context and proper noun references
- Suggests transcript splitting for large files

Perfect for converting voice recordings, meeting notes, or strategy sessions into actionable blueprints. 🤖 