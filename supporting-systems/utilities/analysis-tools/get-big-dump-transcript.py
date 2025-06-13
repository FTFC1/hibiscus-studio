import requests
import json

# Trello API credentials
API_KEY = 'bf371933fcd49ba099774ba087050e38'
TOKEN = 'ATTA3f27a64d09d2ceef38759b7f1941ca024bc84c274224f592b84fe11c701398898D4A4EE9'

BIG_DUMP_CARD_ID = '68331d0fd76353aebe3e6c44'

def get_card_full_details(card_id):
    """Get full card details including description"""
    url = f"https://api.trello.com/1/cards/{card_id}"
    query = {
        'key': API_KEY,
        'token': TOKEN,
        'fields': 'all'
    }
    response = requests.get(url, params=query)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"❌ Error getting card: {response.status_code}")
        print(f"Response: {response.text}")
        return None

def main():
    print("🎯 Getting Big Dump card transcript...")
    
    card = get_card_full_details(BIG_DUMP_CARD_ID)
    if card:
        print(f"📝 Card Name: {card.get('name', 'N/A')}")
        print(f"🔗 Card URL: {card.get('shortUrl', 'N/A')}")
        print(f"📊 Has Description: {card.get('badges', {}).get('description', False)}")
        
        description = card.get('desc', '')
        if description:
            print(f"\n📄 Description Length: {len(description)} characters")
            print(f"📄 First 200 chars: {description[:200]}...")
            return description
        else:
            print("❌ No description found on card")
            return ""
    else:
        print("❌ Could not retrieve card")
        return ""

if __name__ == "__main__":
    transcript = main()
    if transcript:
        print(f"\n✅ Successfully retrieved transcript ({len(transcript)} chars)")
    else:
        print("\n❌ No transcript found") 