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

CHECKLIST_ID = "682893b96dbe45e369003232"  # Core Script Functionality checklist
NEW_ITEM_NAME = "Define initial set of voice commands"
NEW_ITEM_CHECKED_STATUS = False # It's a new to-do

if not API_KEY or not TOKEN:
    print("Error: TRELLO_API_KEY and TRELLO_TOKEN must be set in your .env file.")
    exit()

headers = {"Accept": "application/json"}
base_url = "https://api.trello.com/1"
auth_params = f"key={API_KEY}&token={TOKEN}"

# Function to add a single item to a checklist
def add_item_to_checklist(checklist_id, item_name, checked_status):
    add_item_url = f"{base_url}/checklists/{checklist_id}/checkItems?{auth_params}"
    payload = {
        'name': item_name,
        'checked': str(checked_status).lower(),
        'pos': 'bottom'
    }
    response_content = None
    try:
        response = requests.post(add_item_url, headers=headers, json=payload)
        response_content = response.content
        response.raise_for_status()
        added_item = response.json()
        print(f"Successfully added item '{added_item['name']}' (Checked: {added_item['state']}) to checklist ID {checklist_id}.")
        return added_item
    except requests.exceptions.RequestException as e:
        print(f"Error adding item '{item_name}' to checklist {checklist_id}: {e}")
        if response_content: print(f"Response: {response_content.decode(errors='ignore')}")
        return None
    except json.JSONDecodeError as e:
        print(f"JSON decode error adding checklist item: {e}")
        if response_content: print(f"Response: {response_content.decode(errors='ignore')}")
        return None

if __name__ == "__main__":
    print(f"Attempting to add item '{NEW_ITEM_NAME}' to checklist ID '{CHECKLIST_ID}'...")
    add_item_to_checklist(CHECKLIST_ID, NEW_ITEM_NAME, NEW_ITEM_CHECKED_STATUS) 