# Auto-Dissemination Feature PRD
## Product Requirements Document

**Version:** 1.0  
**Date:** June 1st, 2025  
**Author:** Based on real usage patterns from .specstory build logs

---

## 🎯 **Product Vision**

**"I say stuff → it gets disseminated into the right places automatically"**

Transform voice transcripts and conversational inputs into structured, actionable Trello updates without manual processing overhead.

---

## 📋 **Problem Statement**

**Current Pain Points:**
- Manual transcript processing takes 15-30 minutes per session
- Actionable items get lost in conversation flow
- Context switching between voice notes and Trello updates
- Inconsistent card placement and checklist creation
- No automatic cross-referencing with existing projects

**Opportunity:**
Build an intelligent system that understands conversational context and automatically updates the right Trello cards with relevant actionable items.

---

## 🎯 **Success Metrics**

**Primary KPIs:**
- **Time Saved:** 80% reduction in manual Trello updates (30min → 6min)
- **Capture Rate:** 95% of actionable items automatically extracted
- **Accuracy:** 90% correct card placement without manual correction
- **Adoption:** Daily usage within 1 week of deployment

**Secondary KPIs:**
- Reduced duplicate card creation
- Improved checklist completion rates
- Faster project momentum tracking

---

## 👥 **User Personas**

**Primary User: "Builder Nick"**
- Thinks through voice recordings while driving/walking
- Manages multiple active projects simultaneously
- Values execution over perfect documentation
- Prefers visual/structured organisation (Trello) over free-form notes
- British English speaker with technical vocabulary

---

## 🔧 **Core Features & Requirements**

### **Feature 1: Intelligent Transcript Processing**

**Requirements:**
- Parse voice transcripts for actionable items
- Identify project context from conversation keywords
- Extract specific tasks, decisions, and next steps
- Handle British English speech patterns and technical terminology

**Technical Specs:**
- Input: Text transcripts (via file upload or API)
- Processing: LLM-based extraction with project context awareness
- Output: Structured JSON with actionable items + project mappings

### **Feature 2: Smart Card Placement**

**Requirements:**
- Match actionable items to existing Trello cards by project context
- Create new cards when no existing match found
- Automatically determine appropriate list placement (Active, Review, Upcoming)
- Apply `pos: "top"` rule for new/updated cards

**Technical Specs:**
- Project matching algorithm using card titles, descriptions, keywords
- Fallback list determination logic
- Card positioning enforcement via Trello API

### **Feature 3: Checklist Auto-Generation**

**Requirements:**
- Convert actionable items into Trello checklist items
- Maintain existing checklist structure (append, don't replace)
- Add contextual details to checklist descriptions
- Handle deadline/priority extraction from conversation

**Technical Specs:**
- Checklist item formatting with context preservation
- Priority level detection and application
- Timestamp tracking for new items

### **Feature 4: Context Cross-Referencing**

**Requirements:**
- Reference existing project cards when mentioned in transcripts
- Update linked project status based on conversation insights
- Maintain project relationship mapping
- Handle project pivots and updates

**Technical Specs:**
- Card linking via Trello card attachment/mention system
- Relationship mapping database/JSON storage
- Update propagation across linked cards

---

## 🏗️ **Technical Architecture**

### **Components:**

**1. Transcript Processor (Node.js/TypeScript)**
```typescript
interface TranscriptInput {
  content: string;
  timestamp: Date;
  source: 'voice' | 'chat' | 'file';
}

interface ActionableItem {
  task: string;
  project: string;
  priority: 'high' | 'medium' | 'low';
  deadline?: Date;
  context: string;
}
```

**2. Project Matcher**
- Fuzzy matching algorithm for project identification
- Keyword-based project mapping
- Machine learning project classification

**3. Trello Orchestrator**
- MCP tool wrapper for Trello operations
- Batch update capabilities
- Error handling and rollback

**4. Context Manager**
- Project relationship tracking
- Historical context preservation
- Cross-reference maintenance

### **Integration Points:**
- **Trello MCP Server** (existing)
- **Voice Transcript APIs** (Otter.ai, Whisper)
- **LLM Processing** (Claude, GPT-4)
- **File Storage** (local, S3 for transcripts)

---

## 🚀 **Implementation Phases**

### **Phase 1: Core MVP (Week 1-2)**
- Basic transcript parsing for actionable items
- Simple project matching by keyword
- Manual trigger via MCP tool
- Single card update capability

**Deliverables:**
- `process_transcript` MCP tool
- Basic project matching algorithm
- Simple checklist item addition

### **Phase 2: Smart Placement (Week 3-4)**
- Automatic card placement logic
- List determination (Active/Review/Upcoming)
- Card positioning enforcement
- Batch processing capability

**Deliverables:**
- Enhanced project matching
- Automated list placement
- Bulk update functionality

### **Phase 3: Context Intelligence (Week 5-6)**
- Cross-project referencing
- Relationship mapping
- Historical context integration
- Priority/deadline extraction

**Deliverables:**
- Context cross-referencing
- Relationship tracking
- Advanced priority detection

### **Phase 4: Automation & Polish (Week 7-8)**
- Automatic transcript watching
- Error handling improvements
- Performance optimisation
- User feedback integration

**Deliverables:**
- Automated pipeline
- Production monitoring
- Performance metrics

---

## 📊 **User Experience Flow**

### **Current Workflow:**
1. Record voice notes during drive/walk
2. Manually transcribe or use Otter.ai
3. Read through transcript
4. Identify actionable items
5. Open Trello
6. Find relevant cards
7. Add checklist items manually
8. Update card descriptions
9. Move cards if needed

**Total Time:** 30-45 minutes per session

### **Target Workflow:**
1. Record voice notes during drive/walk
2. Upload transcript file or trigger processing
3. Review auto-generated updates (optional)
4. Approve/adjust via quick interface

**Total Time:** 5-10 minutes per session

---

## 🛡️ **Risk Assessment**

**Technical Risks:**
- **LLM accuracy for project matching** → Mitigation: Fallback to manual review
- **Trello API rate limits** → Mitigation: Batch operations, exponential backoff
- **Context drift over time** → Mitigation: Regular project mapping updates

**Product Risks:**
- **Over-automation reducing control** → Mitigation: Review interface before commit
- **Incorrect card updates** → Mitigation: Undo functionality, change tracking
- **Dependency on external LLM APIs** → Mitigation: Fallback to simpler keyword matching

---

## 🔗 **Integration Requirements**

**Existing Systems:**
- **Trello MCP Server** - Card creation, checklist management, positioning
- **Build Log System** - .specstory conversation tracking
- **Voice Processing** - Otter.ai, local transcription tools
- **Git Workflow** - Automatic commits for processed updates

**New Dependencies:**
- **LLM API** - Claude/GPT-4 for intelligent parsing
- **Project Database** - JSON/SQLite for project mapping
- **Queue System** - Background processing for large transcripts

---

## 📈 **Success Criteria**

**MVP Success (Phase 1):**
- Successfully process 1 transcript into Trello updates
- 80% accuracy in actionable item extraction
- Zero breaking changes to existing MCP tools

**Feature Complete Success (Phase 4):**
- Daily usage for transcript processing
- 90% accuracy in project matching
- 80% time saving vs manual process
- User satisfaction: "This saves me massive time"

**Long-term Success (3 months):**
- Integration with other data sources (Gmail, bookmarks)
- Predictive project suggestions
- Cross-platform availability (mobile, web)

---

## 💡 **Future Enhancements**

**V2 Features:**
- **Real-time processing** during voice recordings
- **Multi-language support** for international contexts
- **Visual project mapping** interface
- **AI-powered project suggestions**
- **Integration with calendar/scheduling**

**V3 Vision:**
- **Predictive project management** based on patterns
- **Automatic priority rebalancing**
- **Cross-platform synchronisation**
- **Team collaboration features**

---

## 📋 **Acceptance Criteria**

**For MVP Release:**
- [ ] Process transcript file via MCP tool
- [ ] Extract minimum 3 actionable items per transcript
- [ ] Match items to existing Trello cards with 80% accuracy
- [ ] Create checklist items in correct cards
- [ ] Apply card positioning rules
- [ ] Handle errors gracefully without breaking existing functionality
- [ ] Complete processing in under 2 minutes per transcript
- [ ] Maintain conversation context in updates

**For Production Release:**
- [ ] Automated processing pipeline
- [ ] Review interface for approving updates
- [ ] Undo/rollback functionality
- [ ] Performance monitoring and logging
- [ ] Error reporting and recovery
- [ ] Documentation and usage examples
- [ ] Integration tests with existing MCP tools

---

*This PRD is based on actual usage patterns extracted from .specstory build logs and real conversation transcripts to ensure product-market fit.* 