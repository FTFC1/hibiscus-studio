import requests
import json
import tempfile
import os
from datetime import datetime
import re

# Trello API credentials
API_KEY = 'bf371933fcd49ba099774ba087050e38'
TOKEN = 'ATTA3f27a64d09d2ceef38759b7f1941ca024bc84c274224f592b84fe11c701398898D4A4EE9'

BIG_DUMP_CARD_ID = '68331d0fd76353aebe3e6c44'

# Your actual voice transcript
VOICE_TRANSCRIPT = """Ok so, first things first, positioning, if you have a locked, what do you call it, if you have a locked screen, plugging into it is probably the thing that makes most people understand that it doesn't really sound unlocked, I don't want to do that, I don't want to allow you to do it in more places, that's the first thing, second thing, um, nicotine for like clearing your bowels as well, um, so, we have a number of projects, and I think one of the things is that, um, I need to have like a, either, I'm gonna go sometime and come back, give me something to help jog my memory of what we're doing, where we are, kind of thing, and then one for, oh I've just come back, can you remind me what this was, let's say I didn't know that my session was ending, so, I don't know, because obviously I'm, I'm promoting a lot of projects, and I'm going, I'm paying for my conversations, effectively I'm paying for my conversations, so, the quality of my conversations needs to improve, um, the quality of my presentations, of my conversations needs to improve, or my builds need to improve, you know, I'm applying from scratch every time, it's not really helpful, you know, like I remember there was a perplexity.mv, which like taught me about strings, and I don't use it anymore, and I'm even currently having an issue with MCP of perplexity, and Gemini models, but then I guess I'm using cloud 4 now, so it's a bit different, which actually leads me to the other point, which is that, um, cloud, cloud 4, is, is, is actually really, is done really well on like, the gas project, which is me trying to scale, um, gas cells via cold email, um, at the same time, I have, I have something, I have someone that wanted to buy a neighbourhood school, I could, I could do a whole thing, where, to outreach to, um, schools, and then I did it, yeah, I could go to educational generators for, I think Lagos Business School, generators for, um, yeah, yeah, and I think, I think generators is something that I'm more comfortable with, yeah, because it's, I don't really want to sell someone a car, because I feel that after sales is lacking, because, and it's not lacking necessarily, they have the people there, it's lacking because it's expensive, so people go elsewhere, but then, what I wonder is, how, how easy is it, like, is it, is it that it's completely fine to go to second-hand people, so, I think I should probably try and speak to, um, a customer, realistically, I asked them, I, I, we, we noticed that, um, we've had the car for some time, we haven't, um, been to after sales, we're just doing a little bit of research, um, I just wanted to ask why, if you'd found an, uh, an alternative, or you haven't had the car serviced, yeah, so, like, that's, that's the kind of thing that we want to send in the outreach, um, and then, um, I have like, a few other things that I need to be careful about, like, um, yeah, so, like, I, I, I need to make sure that, um, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not making sure that I'm actually doing, and that I'm getting that, I'm getting output rather than getting input, you know? And it's like, the way that I see it is that, my, my, my, my way to scale is to, if I, if I, if I can get people to, um, if I can learn how to, um, just send messages, and I can do that over a weekend, like, it's a good thing for me to do, yeah, because it's, it's, it's a bit like, it's, it's, it's, it's, it's a bit like, it's, it's, it's, it's actually something that's actually, it's actually something that's actually really cool. And, yeah, and the session, and I think I mentioned like a session wrap-up prompt thing, or like a something, but it's like, oh, I've done this today, let me create a profile that I can send to the next agent, whether it's the same agent, or whether it's a different agent tomorrow, you know, it's like, oh, here's, here's what we worked on today, here's where we stopped, here's the next steps, like, give me three options of where I can go to next, etc."""

class IntelligentVoiceProcessor:
    def __init__(self):
        self.themes = {
            'memory_systems': {
                'keywords': ['memory', 'jog', 'remind', 'session', 'come back', 'where we are', 'what we were doing'],
                'content': [],
                'priority': 5
            },
            'conversation_quality': {
                'keywords': ['quality', 'conversations', 'paying for', 'improve', 'builds', 'from scratch', 'not helpful'],
                'content': [],
                'priority': 4
            },
            'technical_stack': {
                'keywords': ['perplexity', 'MCP', 'Gemini', 'cloud 4', 'Claude', 'models'],
                'content': [],
                'priority': 3
            },
            'business_ventures': {
                'keywords': ['gas', 'generators', 'Lagos Business School', 'neighbourhood school', 'car', 'after sales'],
                'content': [],
                'priority': 4
            },
            'scaling_strategy': {
                'keywords': ['scale', 'cold email', 'outreach', 'weekend', 'messages', 'output', 'input'],
                'content': [],
                'priority': 5
            },
            'session_management': {
                'keywords': ['session wrap-up', 'profile', 'next agent', 'worked on today', 'next steps', 'three options'],
                'content': [],
                'priority': 5
            }
        }
    
    def extract_sentences(self, text):
        """Extract sentences from text"""
        # Split on periods, but be smart about it
        sentences = re.split(r'[.!?]+(?:\s+|$)', text)
        return [s.strip() for s in sentences if s.strip()]
    
    def analyze_sentence_themes(self, sentence):
        """Analyze which themes a sentence belongs to"""
        sentence_lower = sentence.lower()
        matched_themes = []
        
        for theme_name, theme_data in self.themes.items():
            for keyword in theme_data['keywords']:
                if keyword.lower() in sentence_lower:
                    matched_themes.append(theme_name)
                    break
        
        return matched_themes if matched_themes else ['general']
    
    def process_transcript(self, transcript):
        """Process transcript into themed sections"""
        sentences = self.extract_sentences(transcript)
        
        # Reset content
        for theme in self.themes.values():
            theme['content'] = []
        
        # Analyze each sentence
        for sentence in sentences:
            if len(sentence) < 10:  # Skip very short fragments
                continue
                
            themes = self.analyze_sentence_themes(sentence)
            
            # Add sentence to relevant themes
            for theme_name in themes:
                if theme_name in self.themes:
                    self.themes[theme_name]['content'].append(sentence)
        
        return self.themes
    
    def extract_action_items(self, transcript):
        """Extract action items from transcript"""
        action_patterns = [
            r'I need to (.+?)(?:[,.!]|$)',
            r'I should (.+?)(?:[,.!]|$)', 
            r'I want to (.+?)(?:[,.!]|$)',
            r'I think I should (.+?)(?:[,.!]|$)',
            r'let me (.+?)(?:[,.!]|$)',
            r'give me (.+?)(?:[,.!]|$)'
        ]
        
        actions = []
        for pattern in action_patterns:
            matches = re.findall(pattern, transcript, re.IGNORECASE)
            actions.extend(matches)
        
        # Clean and categorize actions
        high_priority = []
        medium_priority = []
        low_priority = []
        
        for action in actions:
            action = action.strip()
            if len(action) < 5:
                continue
                
            if any(word in action.lower() for word in ['need', 'must', 'should']):
                high_priority.append(action)
            elif any(word in action.lower() for word in ['want', 'could', 'maybe']):
                medium_priority.append(action)
            else:
                low_priority.append(action)
        
        return {
            'high': high_priority[:3],  # Top 3
            'medium': medium_priority[:3],
            'low': low_priority[:2]
        }
    
    def extract_cross_project_themes(self, analyzed_themes):
        """Extract themes that affect multiple projects"""
        cross_themes = {}
        
        # Memory/Session Management affects all projects
        if analyzed_themes['memory_systems']['content'] or analyzed_themes['session_management']['content']:
            cross_themes['Memory & Session Continuity'] = {
                'affects': ['All projects'],
                'insight': 'Need for consistent context preservation across sessions'
            }
        
        # Conversation Quality affects all AI interactions
        if analyzed_themes['conversation_quality']['content']:
            cross_themes['AI Conversation Optimization'] = {
                'affects': ['All AI-powered projects'],
                'insight': 'Quality outputs require better context and conversation structure'
            }
        
        # Scaling Strategy affects all business ventures
        if analyzed_themes['scaling_strategy']['content']:
            cross_themes['Weekend Scaling Strategy'] = {
                'affects': ['Gas cells', 'Generators', 'Car sales research'],
                'insight': 'Systematic outreach approach for business development'
            }
        
        return cross_themes

def create_intelligent_voice_context(processor, theme_name, theme_data, actions, cross_themes, full_transcript):
    """Create an intelligent voice context file using the blueprint approach"""
    timestamp = datetime.now().isoformat()
    
    # Build action sections
    action_sections = ""
    if actions['high']:
        action_sections += "\n**🔥 This Week (High Priority)**\n"
        for action in actions['high']:
            action_sections += f"• {action} - Impact: 4/5 🔥\n"
    
    if actions['medium']:
        action_sections += "\n**⚡ Next 30 Days (Medium Priority)**\n"
        for action in actions['medium']:
            action_sections += f"• {action} - Impact: 3/5 ⚡\n"
    
    if actions['low']:
        action_sections += "\n**💡 When Energy Available (Low Friction)**\n"
        for action in actions['low']:
            action_sections += f"• {action} - Impact: 2/5 💡\n"
    
    # Build cross-themes section
    cross_themes_section = ""
    if cross_themes:
        cross_themes_section = "\n\n🔗 **Cross-Project Themes**\n\n"
        for theme_name, theme_info in cross_themes.items():
            cross_themes_section += f"**{theme_name}** (affects {len(theme_info['affects'])} project areas)\n"
            cross_themes_section += f"- Projects: {', '.join(theme_info['affects'])}\n"
            cross_themes_section += f"- Strategic insight: {theme_info['insight']}\n\n"
    
    # Main content for this theme
    theme_content = "\n".join(theme_data['content']) if theme_data['content'] else "Content extracted from cross-cutting analysis."
    
    attachment_content = f"""# 🎙️ **Voice Context Blueprint - {theme_name.replace('_', ' ').title()}**

**📅 Timestamp:** {timestamp}
**🎯 Theme:** {theme_name.replace('_', ' ').title()}
**📊 Priority:** {theme_data.get('priority', 3)}/5
**📝 Content Length:** {len(theme_content)} characters


## 💎 **Strategic Insights**

• **Context Preservation Challenge**: Need systematic approach to maintain project context across sessions
• **Quality vs Efficiency Trade-off**: Paying for AI conversations requires optimized interaction patterns  
• **Multi-Project Scaling**: Weekend outreach strategy could work across multiple business ventures
• **Technical Stack Evolution**: Claude 4 performing well, but MCP integration needs attention


## ⚡ **Immediate Actions**
{action_sections}

{cross_themes_section}

## 📋 **Raw Transcript Section**

{theme_content}


## 🏷️ **Context Tags**

- {theme_name.replace('_', '-')}
- voice-to-blueprint
- session-continuity  
- multi-project-strategy
- ai-conversation-optimization


## 🔄 **Session Metadata**

- **Source:** Voice transcript processing
- **Processing Method:** Intelligent semantic analysis
- **Cross-Theme Connections:** {len(cross_themes)} identified
- **Action Items Extracted:** {len(actions['high']) + len(actions['medium']) + len(actions['low'])}


---
*Generated by Intelligent Voice Context Manager - Following Transcript to Blueprint methodology*
"""
    
    return attachment_content

def upload_file_to_card(card_id, file_path, attachment_name):
    """Upload file to Trello card"""
    url = f"https://api.trello.com/1/cards/{card_id}/attachments"
    
    query = {
        'key': API_KEY,
        'token': TOKEN,
        'name': attachment_name
    }
    
    with open(file_path, 'rb') as file:
        files = {'file': file}
        response = requests.post(url, params=query, files=files)
    
    return response.status_code == 200, response.json() if response.status_code == 200 else response.text

def main():
    """Main processing function"""
    print("🧠 Intelligent Voice Transcript Processing...")
    print(f"📄 Transcript length: {len(VOICE_TRANSCRIPT)} characters")
    
    # Initialize processor
    processor = IntelligentVoiceProcessor()
    
    # Analyze transcript
    analyzed_themes = processor.process_transcript(VOICE_TRANSCRIPT)
    actions = processor.extract_action_items(VOICE_TRANSCRIPT)
    cross_themes = processor.extract_cross_project_themes(analyzed_themes)
    
    print(f"🎯 Identified {len([t for t in analyzed_themes.values() if t['content']])} active themes")
    print(f"⚡ Extracted {sum(len(v) for v in actions.values())} action items")
    print(f"🔗 Found {len(cross_themes)} cross-project themes")
    
    # Create context files for themes with content
    uploaded_count = 0
    
    for theme_name, theme_data in analyzed_themes.items():
        if theme_data['content']:  # Only create files for themes with actual content
            print(f"\n📎 Creating {theme_name} context...")
            
            # Generate intelligent content
            content = create_intelligent_voice_context(
                processor, theme_name, theme_data, actions, cross_themes, VOICE_TRANSCRIPT
            )
            
            # Create temporary file
            temp_dir = tempfile.mkdtemp(prefix='voice_context_')
            filename = f'voice_blueprint_{theme_name}_{datetime.now().strftime("%Y%m%d_%H%M")}.txt'
            file_path = os.path.join(temp_dir, filename)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"📁 Created: {filename} ({len(content)} bytes)")
            
            # Upload to Trello
            success, response = upload_file_to_card(
                BIG_DUMP_CARD_ID,
                file_path,
                filename
            )
            
            if success:
                print(f"✅ Uploaded: {filename}")
                uploaded_count += 1
            else:
                print(f"❌ Failed: {filename}")
                print(f"Error: {response}")
            
            # Clean up
            os.remove(file_path)
    
    # Also create a master blueprint
    print(f"\n📎 Creating master blueprint...")
    master_content = f"""# 🎯 **Master Voice Blueprint**

**📅 Timestamp:** {datetime.now().isoformat()}
**🎙️ Full Transcript Length:** {len(VOICE_TRANSCRIPT)} characters
**🧠 Analysis Method:** Intelligent semantic processing


## 🏗️ **Project Architecture Overview**

**Active Themes Identified:**
{chr(10).join([f"• **{name.replace('_', ' ').title()}** - {len(data['content'])} insights" for name, data in analyzed_themes.items() if data['content']])}


## 🔗 **Cross-Project Themes**

{chr(10).join([f"**{name}**{chr(10)}- Affects: {', '.join(info['affects'])}{chr(10)}- Insight: {info['insight']}{chr(10)}" for name, info in cross_themes.items()])}


## 🎯 **Complete Action Matrix**

**🔥 High Priority (This Week)**
{chr(10).join([f"• {action}" for action in actions['high']])}

**⚡ Medium Priority (Next 30 Days)**  
{chr(10).join([f"• {action}" for action in actions['medium']])}

**💡 Low Friction (When Energy Available)**
{chr(10).join([f"• {action}" for action in actions['low']])}


## 📋 **Full Raw Transcript**

{VOICE_TRANSCRIPT}


---
*Master blueprint generated by Intelligent Voice Context Manager*
"""
    
    # Upload master blueprint
    temp_dir = tempfile.mkdtemp(prefix='voice_context_')
    master_filename = f'voice_master_blueprint_{datetime.now().strftime("%Y%m%d_%H%M")}.txt'
    master_file_path = os.path.join(temp_dir, master_filename)
    
    with open(master_file_path, 'w', encoding='utf-8') as f:
        f.write(master_content)
    
    success, response = upload_file_to_card(
        BIG_DUMP_CARD_ID,
        master_file_path,
        master_filename
    )
    
    if success:
        print(f"✅ Master blueprint uploaded: {master_filename}")
        uploaded_count += 1
    
    os.remove(master_file_path)
    
    print(f"\n🎯 Intelligent processing complete!")
    print(f"📊 Successfully uploaded {uploaded_count} voice context blueprints")
    print(f"🔗 Cross-project themes: {len(cross_themes)}")
    print(f"⚡ Total action items: {sum(len(v) for v in actions.values())}")

if __name__ == "__main__":
    main() 