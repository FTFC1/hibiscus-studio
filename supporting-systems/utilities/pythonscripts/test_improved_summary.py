import requests
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

# Trello API Credentials
TRELLO_API_KEY = os.environ.get('TRELLO_API_KEY')
TRELLO_TOKEN = os.environ.get('TRELLO_TOKEN')
OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY')

# Test card details
CARD_ID = "68237ca2940e309643e8d28c"  # Update Tejj (FinTech UI project)
BOARD_ID = "67d1eaa9eed6766b5e421bd5"

# API setup
client = OpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)

headers = {"Accept": "application/json"}
base_url = "https://api.trello.com/1"
trello_auth_params = f"key={TRELLO_API_KEY}&token={TRELLO_TOKEN}"

def get_card_details(card_id):
    """Get card name, list name, and existing checklist items."""
    url = f"{base_url}/cards/{card_id}?{trello_auth_params}&fields=name,idList&checklists=all"
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        card = response.json()
        
        # Get list name
        list_url = f"{base_url}/lists/{card['idList']}?{trello_auth_params}&fields=name"
        list_response = requests.get(list_url, headers=headers)
        list_response.raise_for_status()
        list_name = list_response.json()['name']
        
        # Get existing checklist items
        existing_items = []
        for checklist in card.get('checklists', []):
            for item in checklist.get('checkItems', []):
                existing_items.append(item['name'])
        
        return {
            'card_name': card['name'],
            'list_name': list_name,
            'existing_items': existing_items
        }
    except Exception as e:
        print(f"Error getting card details: {e}")
        return None

def get_waffle_content(card_id):
    """Get the waffle attachment content."""
    url = f"{base_url}/cards/{card_id}/attachments?{trello_auth_params}"
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        attachments = response.json()
        
        for att in attachments:
            if att['name'].startswith("waffle_archive_") and att['name'].endswith(".txt"):
                # Download attachment
                download_headers = {
                    'Authorization': f'OAuth oauth_consumer_key="{TRELLO_API_KEY}", oauth_token="{TRELLO_TOKEN}"'
                }
                content_response = requests.get(att['url'], headers=download_headers)
                content_response.raise_for_status()
                return content_response.text
    except Exception as e:
        print(f"Error getting waffle content: {e}")
        return None

def summarize_with_improved_prompt(text, card_details):
    """Summarize text with our improved prompt."""
    if not text or not card_details:
        return None
        
    system_prompt = f"""You are an AI assistant helping process my Trello card content. This is from my voice note (waffle) in card: "{card_details['card_name']}" in list: "{card_details['list_name']}".

First, identify the content type:
1. Personal reflection
2. Practical/Project task
3. Mixed (both personal and practical)

Then use the appropriate structure:

FOR PRIMARILY PERSONAL:
### Core Insights
- What you realized
- How you feel about it
- Patterns you noticed

### Growth & Next Steps
- What you want to develop
- Actions to consider
- People to connect with

FOR PRIMARILY PRACTICAL:
### Quick Summary
- Key decisions/insights
- Main objectives
- Any breakthroughs

### Action Items
[P1/P2/P3] Task description
Where:
P1 = Must do soon
P2 = Should do
P3 = Nice to have

FOR MIXED CONTENT:
### Context & Insights
- Personal context
- Key realizations
- Important feelings/concerns

### Action Plan
[P1/P2/P3] Task description [PERSONAL/PRACTICAL]
- Include both practical steps and personal growth items
- Tag each with [PERSONAL] or [PRACTICAL]
- Preserve emotional context while being action-oriented

If task relates to existing checklist items: {card_details['existing_items']}, note with [RELATED].

Remember:
- Use "you" language (e.g., "You want to..." not "The speaker...")
- Be direct but empathetic
- Keep it concise and scannable
"""

    try:
        completion = client.chat.completions.create(
            model="openai/gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Please process this waffle text:\n\n{text}"}
            ]
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error in summarization: {e}")
        return None

def main():
    print("🔍 Getting card details...")
    card_details = get_card_details(CARD_ID)
    if not card_details:
        print("❌ Failed to get card details")
        return

    print("\n📝 Getting waffle content...")
    waffle_content = get_waffle_content(CARD_ID)
    if not waffle_content:
        print("❌ Failed to get waffle content")
        return

    print("\n🤖 Generating improved summary...")
    improved_summary = summarize_with_improved_prompt(waffle_content, card_details)
    if not improved_summary:
        print("❌ Failed to generate summary")
        return

    print("\n✨ Improved Summary:")
    print("-" * 80)
    print(improved_summary)
    print("-" * 80)

if __name__ == "__main__":
    main() 