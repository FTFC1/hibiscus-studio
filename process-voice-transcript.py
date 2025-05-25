import requests
import json
import tempfile
import os
from datetime import datetime

# Trello API credentials
API_KEY = 'bf371933fcd49ba099774ba087050e38'
TOKEN = 'ATTA3f27a64d09d2ceef38759b7f1941ca024bc84c274224f592b84fe11c701398898D4A4EE9'

BIG_DUMP_CARD_ID = '68331d0fd76353aebe3e6c44'

# Your actual voice transcript from the conversation
VOICE_TRANSCRIPT = """Ok so, first things first, positioning, if you have a locked, what do you call it, if you have a locked screen, plugging into it is probably the thing that makes most people understand that it doesn't really sound unlocked, I don't want to do that, I don't want to allow you to do it in more places, that's the first thing, second thing, um, nicotine for like clearing your bowels as well, um, so, we have a number of projects, and I think one of the things is that, um, I need to have like a, either, I'm gonna go sometime and come back, give me something to help jog my memory of what we're doing, where we are, kind of thing, and then one for, oh I've just come back, can you remind me what this was, let's say I didn't know that my session was ending, so, I don't know, because obviously I'm, I'm promoting a lot of projects, and I'm going, I'm paying for my conversations, effectively I'm paying for my conversations, so, the quality of my conversations needs to improve, um, the quality of my presentations, of my conversations needs to improve, or my builds need to improve, you know, I'm applying from scratch every time, it's not really helpful, you know, like I remember there was a perplexity.mv, which like taught me about strings, and I don't use it anymore, and I'm even currently having an issue with MCP of perplexity, and Gemini models, but then I guess I'm using cloud 4 now, so it's a bit different, which actually leads me to the other point, which is that, um, cloud, cloud 4, is, is, is actually really, is done really well on like, the gas project, which is me trying to scale, um, gas cells via cold email, um, at the same time, I have, I have something, I have someone that wanted to buy a neighbourhood school, I could, I could do a whole thing, where, to outreach to, um, schools, and then I did it, yeah, I could go to educational generators for, I think Lagos Business School, generators for, um, yeah, yeah, and I think, I think generators is something that I'm more comfortable with, yeah, because it's, I don't really want to sell someone a car, because I feel that after sales is lacking, because, and it's not lacking necessarily, they have the people there, it's lacking because it's expensive, so people go elsewhere, but then, what I wonder is, how, how easy is it, like, is it, is it that it's completely fine to go to second-hand people, so, I think I should probably try and speak to, um, a customer, realistically, I asked them, I, I, we, we noticed that, um, we've had the car for some time, we haven't, um, been to after sales, we're just doing a little bit of research, um, I just wanted to ask why, if you'd found an, uh, an alternative, or you haven't had the car serviced, yeah, so, like, that's, that's the kind of thing that we want to send in the outreach, um, and then, um, I have like, a few other things that I need to be careful about, like, um, yeah, so, like, I, I, I need to make sure that, um, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not, I'm not making sure that I'm actually doing, and that I'm getting that, I'm getting output rather than getting input, you know? And it's like, the way that I see it is that, my, my, my, my way to scale is to, if I, if I, if I can get people to, um, if I can learn how to, um, just send messages, and I can do that over a weekend, like, it's a good thing for me to do, yeah, because it's, it's, it's a bit like, it's, it's, it's, it's, it's a bit like, it's, it's, it's, it's actually something that's actually, it's actually something that's actually really cool. And, yeah, and the session, and I think I mentioned like a session wrap-up prompt thing, or like a something, but it's like, oh, I've done this today, let me create a profile that I can send to the next agent, whether it's the same agent, or whether it's a different agent tomorrow, you know, it's like, oh, here's, here's what we worked on today, here's where we stopped, here's the next steps, like, give me three options of where I can go to next, etc."""

def create_voice_context_file(content, filename, context_type="planning"):
    """Create a voice context file"""
    timestamp = datetime.now().isoformat()
    
    attachment_content = f"""# Voice Context Entry - {context_type.title()}

**Timestamp:** {timestamp}
**Type:** {context_type}
**Length:** {len(content)} characters

## Summary
This voice transcript covers key areas around project continuity, memory jogging systems, conversation quality improvements, and business scaling strategies including gas cells, generators, and car sales customer research.

## Key Themes Identified
- **Project Continuity**: Need for memory jogging and session resumption tools
- **Conversation Quality**: Paying for AI conversations, need better outputs
- **Business Ventures**: Gas cells scaling, generators (Lagos Business School), car sales after-sales research
- **Technical Stack**: Claude 4 performance, MCP issues with Perplexity/Gemini, Trello MCP development
- **Scaling Strategy**: Weekend outreach campaigns, message automation

## Raw Transcript
{content}

## Extracted Entities
- **People**: Lagos Business School contacts
- **Projects**: Gas cells, generators, car sales research
- **Tools**: Claude 4, MCP, Perplexity, Gemini, Trello
- **Concepts**: Session wrap-up prompts, memory jogging, conversation quality

## Action Items Identified
1. Create memory jogging system for project continuity
2. Develop session wrap-up prompt template
3. Research car sales after-sales customer feedback approach
4. Scale gas cells outreach via weekend campaigns
5. Improve conversation quality and output focus

## Context Tags
- project-continuity
- conversation-optimization
- business-scaling
- technical-infrastructure
- session-management

---
Generated by Voice Context Manager - Trello MCP Integration
"""
    
    # Create temporary file
    temp_dir = tempfile.mkdtemp(prefix='voice_context_')
    file_path = os.path.join(temp_dir, filename)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(attachment_content)
    
    return file_path, len(attachment_content)

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

def process_voice_transcript():
    """Process the voice transcript and create context attachments"""
    print("🎙️ Processing Real Voice Transcript...")
    print(f"📄 Transcript length: {len(VOICE_TRANSCRIPT)} characters")
    
    # Create different context segments
    contexts = [
        {
            'content': VOICE_TRANSCRIPT[:len(VOICE_TRANSCRIPT)//3],
            'type': 'project-continuity',
            'filename': f'voice_context_project_continuity_{datetime.now().strftime("%Y%m%d_%H%M")}.txt'
        },
        {
            'content': VOICE_TRANSCRIPT[len(VOICE_TRANSCRIPT)//3:2*len(VOICE_TRANSCRIPT)//3],
            'type': 'business-scaling', 
            'filename': f'voice_context_business_scaling_{datetime.now().strftime("%Y%m%d_%H%M")}.txt'
        },
        {
            'content': VOICE_TRANSCRIPT[2*len(VOICE_TRANSCRIPT)//3:],
            'type': 'session-management',
            'filename': f'voice_context_session_mgmt_{datetime.now().strftime("%Y%m%d_%H%M")}.txt'
        }
    ]
    
    # Also create a full context file
    contexts.append({
        'content': VOICE_TRANSCRIPT,
        'type': 'complete-transcript',
        'filename': f'voice_context_full_transcript_{datetime.now().strftime("%Y%m%d_%H%M")}.txt'
    })
    
    uploaded_count = 0
    
    for context in contexts:
        print(f"\n📎 Creating {context['type']} context...")
        
        # Create file
        file_path, content_size = create_voice_context_file(
            context['content'], 
            context['filename'], 
            context['type']
        )
        
        print(f"📁 Created file: {context['filename']} ({content_size} bytes)")
        
        # Upload to Trello
        success, response = upload_file_to_card(
            BIG_DUMP_CARD_ID,
            file_path,
            context['filename']
        )
        
        if success:
            print(f"✅ Uploaded: {context['filename']}")
            uploaded_count += 1
        else:
            print(f"❌ Failed to upload: {context['filename']}")
            print(f"Error: {response}")
        
        # Clean up temp file
        os.remove(file_path)
    
    print(f"\n🎯 Successfully uploaded {uploaded_count}/{len(contexts)} voice context attachments!")
    print(f"📋 Big Dump card now has voice context attachments ready for 'read the attachments' pattern")
    
    return uploaded_count

if __name__ == "__main__":
    process_voice_transcript() 