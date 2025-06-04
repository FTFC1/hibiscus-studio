# 🔧 MCP Server Setup Blueprint

**Date:** May 2025  
**Source:** Live coding session with Yassen  
**Tags:** MCP, Trello, JavaScript, TypeScript, Cursor IDE

---

## 🎯 Session Objectives Achieved

- ✅ Successfully set up Trello MCP server
- ✅ Learned MCP architecture fundamentals  
- ✅ Created custom MCP tools (process_waffle_cards)
- ✅ Configured Cursor IDE with MCP integration
- ✅ Built foundation MCP server template

---

## 🏗️ MCP Architecture Overview

### Core Components
- **Tools**: JavaScript functions that take inputs → return outputs
- **MCP Server**: Hosts tools and listens for LLM requests
- **Configuration**: `mcp.json` file connects Cursor to MCP servers

### Example Tool Structure
```javascript
// Basic tool: takes A + B, returns sum
function addTool(a, b) {
  return `${a} + ${b} = ${a + b}`;
}
```

---

## 📋 Step-by-Step Setup Process

### 🔧 Prerequisites
- Node.js installed
- Cursor IDE with MCP support
- API credentials (Trello key + token)

### 🚀 Initial Setup
1. **Clone Repository**
   ```bash
   mkdir mcp-project
   cd mcp-project
   git clone [trello-mcp-repo]
   cd trello-mcp-server
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Create `.env` file
   - Add Trello API key and token
   - Add board ID (from URL: `/b/[BOARD_ID]/`)

### 🔨 Build Process
1. **Compile TypeScript**
   ```bash
   tsc src/index.ts
   # OR
   npm run build
   ```

2. **Install Cursor Command** *(if needed)*
   - Cmd+Shift+P → "Install cursor command"

---

## ⚙️ Cursor Configuration

### 🔗 MCP Settings Setup
1. **Open MCP Settings**
   - Cursor Settings → MCP → Add new global server

2. **Server Configuration**
   ```json
   {
     "trello-server": {
       "command": "node",
       "args": ["./build/index.js"],
       "env": {
         "TRELLO_API_KEY": "your_key",
         "TRELLO_TOKEN": "your_token",
         "TRELLO_BOARD_ID": "your_board_id"
       }
     }
   }
   ```

3. **Verification**
   - Green indicator = successful connection
   - Available tools visible in chat

---

## 🛠️ Troubleshooting Guide

### ❌ Common Issues & Fixes

**Yellow Circle/"No Tools"**
- Check file paths in `mcp.json`
- Verify build completed successfully
- Ensure dependencies installed

**Build Errors**
- Run `npm install` first
- Check TypeScript compilation
- Use chat to fix dependency issues: "Run this command and fix all issues"

**Connection Failures**
- Test command manually in terminal
- Copy exact error to chat for AI assistance
- Refresh MCP settings after fixes

---

## 📦 Creating New MCP Server

### 🏃‍♂️ Quick Start Template
1. **Initialize Project**
   ```bash
   mkdir new-mcp-server
   cd new-mcp-server
   npm init -y
   ```

2. **Create Core Files**
   - `tools.js` - Define your tools
   - `mcp-server.js` - Server setup
   - Reference: [MCP Examples Repo]

3. **Add to Cursor**
   - Configure in `mcp.json`
   - Test with simple tools first

---

## 💡 Business Applications Discussed

### 🎯 Lead Generation System
- **Concept**: Scrape news → identify business opportunities
- **Example**: Insurance companies monitoring crime news
- **Technical**: News API + filtering + email automation

### 🗣️ Transcription & Routing
- **Concept**: Voice-first customer support triage
- **Application**: Banks, hospitals, hotels
- **Technical**: Speech-to-text + intent recognition + routing

### 📊 Social Listening Tools
- **Concept**: Twitter/Reddit trend monitoring
- **Market**: Marketing agencies, trend analysis
- **Technical**: API scraping + sentiment analysis

---

## 📈 Next Steps & Action Items

### 🔄 Immediate (This Week)
- [ ] Convert existing Python scripts to MCP tools
- [ ] Test Trello MCP with voice note workflows
- [ ] Document personal MCP tool library

### 🚀 Short-term (This Month)
- [ ] Build news scraping MCP prototype
- [ ] Create transcription processing pipeline
- [ ] Deploy MCP servers to cloud infrastructure

### 🌟 Long-term (Next Quarter)
- [ ] Package MCP tools as SaaS products
- [ ] Explore Chrome extension integrations
- [ ] Build Shopify app marketplace tools

---

## 📚 Key Resources

### 🔗 Essential Links
- [Model Context Protocol GitHub](https://github.com/modelcontextprotocol)
- [MCP Heroes Repository](https://github.com/modelcontextprotocol/heroes)
- [Quick Start Examples](https://docs.modelcontextprotocol.io)

### 🧠 Mental Models
- **Tools = Functions**: Input → Processing → Output
- **MCP = Tool Router**: LLM requests → appropriate tool
- **Configuration = Glue**: Connects everything together

---

**💡 Key Insight**: MCP success depends on proper file paths and dependency management. Use chat-based debugging over manual troubleshooting for faster resolution. 