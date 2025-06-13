import os
from dotenv import load_dotenv
import requests
import json

load_dotenv()

# Credentials
API_KEY = os.environ.get('TRELLO_API_KEY')
TOKEN = os.environ.get('TRELLO_TOKEN')
# API_KEY = "bf371933fcd49ba099774ba087050e38" # Old
# TOKEN = "ATTA3f27a64d09d2ceef38759b7f1941ca024bc84c274224f592b84fe11c701398898D4A4EE9" # Old

CARD_ID = "68289260b63d7f779c91f94c"  # Develop Trello Voice OS

LINKS_TO_ATTACH = [
    {"name": "Trello Official Site", "url": "https://trello.com"},
    {"name": "Trello Developer Docs", "url": "https://developer.atlassian.com/cloud/trello/"},
    {"name": "Superwhisper Landing Page", "url": "https://superwhisper.com/"}
]

if not API_KEY or not TOKEN:
    print("Error: TRELLO_API_KEY and TRELLO_TOKEN must be set in your .env file.")
    exit()

headers = {"Accept": "application/json"}
base_url = "https://api.trello.com/1"
auth_params = f"key={API_KEY}&token={TOKEN}"

# Function to attach a URL link to a card
def attach_link(card_id, link_name, link_url):
    attach_url = f"{base_url}/cards/{card_id}/attachments?{auth_params}"
    payload = {
        'name': link_name,
        'url': link_url
    }
    response_content = None
    try:
        response = requests.post(attach_url, headers=headers, json=payload)
        response_content = response.content
        response.raise_for_status()
        added_attachment = response.json()
        print(f"Successfully attached link '{added_attachment['name']}' (URL: {added_attachment['url']}) to card ID {card_id}.")
        return added_attachment
    except requests.exceptions.RequestException as e:
        print(f"Error attaching link '{link_name}': {e}")
        if response_content: print(f"Response: {response_content.decode(errors='ignore')}")
        return None
    except json.JSONDecodeError as e:
        print(f"JSON decode error attaching link: {e}")
        if response_content: print(f"Response: {response_content.decode(errors='ignore')}")
        return None

if __name__ == "__main__":
    print(f"Attempting to attach links to card ID '{CARD_ID}'...")
    success_count = 0
    for link_info in LINKS_TO_ATTACH:
        if attach_link(CARD_ID, link_info["name"], link_info["url"]):
            success_count += 1
    print(f"Finished attaching links. {success_count}/{len(LINKS_TO_ATTACH)} successfully attached.") 