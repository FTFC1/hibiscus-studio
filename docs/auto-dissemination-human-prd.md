# Auto-Dissemination Feature PRD (Human)
**Version:** 1.0 | **Date:** June 1st, 2025

---

## 🎯 **Vision**
*"I say stuff → it gets disseminated into the right places automatically"*

Transform Whisper memos voice transcripts into structured Trello updates without manual processing.

---

## 📋 **The Problem**
- 30+ minutes manually processing voice transcripts into Trello
- Actionable items get lost in conversation flow
- No automatic project context matching

## 🚀 **The Solution**
Voice transcript → AI extraction → confidence scoring → auto-update Trello cards

---

## ⚡ **Core Flow**
```
📱 Whisper Memos → 🤖 Process Transcript → 📋 Blueprint JSON → 🎯 Trello Updates
```

**Confidence System:**
- **High (>90%)**: Auto-apply
- **Medium (70-90%)**: Quick select review (`a1`, `a2`, `a3`)
- **Low (<70%)**: Manual approval

---

## 🔧 **Key Features**

### 1. **Smart Processing**
- Extract actionable items from transcripts
- Match to existing project cards
- Generate new project cards when needed

### 2. **Quick Review Interface**
```
📋 Review Required:
a1. "Schedule interview" → FORJE Card ✅
a2. "Debug deployment" → Inventory Tool ✅  
a3. "Call about event" → Gas Project ❌ (suggest: WHX Event)

Quick select: a1,a2 or a3=whx
```

### 3. **Cross-Project Intelligence**
- Detect relationships between projects
- Update linked cards automatically
- Consider: Cross-project swim lane for relationships

### 4. **Bulk Processing**
- Upload multiple transcript files
- Sequential processing (avoid API limits)
- Batch summary of changes

---

## 🏗️ **Implementation Phases**

**Phase 1 (Week 1-2)**: Basic `process_transcript` MCP tool
**Phase 2 (Week 3-4)**: Smart card placement + quick select UI
**Phase 3 (Week 5-6)**: Cross-project context + relationship mapping  
**Phase 4 (Week 7-8)**: Bulk processing + performance optimization

---

## ✅ **Success Metrics**
- **80% time saving** (30min → 6min per session)
- **90% accuracy** in project matching
- **Daily usage** within 1 week

---

## 🎯 **Ready to Build**
Start with Phase 1: `process_transcript` MCP tool that takes Whisper transcript and outputs structured actionable items with confidence scores.

*This PRD is designed for human readability. See `auto-dissemination-llm-prd.md` for detailed technical specifications.* 