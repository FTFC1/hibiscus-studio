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
# Due date should be YYYY-MM-DD or ISO 8601 format for Trello
# Trello API often prefers ISO 8601 with time, e.g., YYYY-MM-DDTHH:MM:SS.mmmZ
# For simplicity, sending YYYY-MM-DD often works, Trello might set a default time.
# Let's set it for noon UTC on that day for clarity.
NEW_DUE_DATE = "2025-05-24T12:00:00.000Z" 

if not API_KEY or not TOKEN:
    print("Error: TRELLO_API_KEY and TRELLO_TOKEN must be set in your .env file.")
    exit()

headers = {"Accept": "application/json"}
base_url = "https://api.trello.com/1"
auth_params = f"key={API_KEY}&token={TOKEN}"

def set_due_date(card_id, due_date):
    url = f"{base_url}/cards/{card_id}?{auth_params}"
    payload = {
        'due': due_date
    }
    response_content = None
    try:
        response = requests.put(url, headers=headers, json=payload)
        response_content = response.content
        response.raise_for_status()
        updated_card = response.json()
        print(f"Successfully set due date for card '{updated_card['name']}' (ID: {card_id}) to {updated_card.get('due')}.")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error setting due date: {e}")
        if response_content:
            print(f"Response content: {response_content.decode(errors='ignore')}")
        return False
    except json.JSONDecodeError as e:
        print(f"JSON decode error while setting due date: {e}")
        if response_content:
            print(f"Response content: {response_content.decode(errors='ignore')}")
        return False

if __name__ == "__main__":
    print(f"Attempting to set due date for card ID: {CARD_ID} to '{NEW_DUE_DATE}'...")
    set_due_date(CARD_ID, NEW_DUE_DATE) 