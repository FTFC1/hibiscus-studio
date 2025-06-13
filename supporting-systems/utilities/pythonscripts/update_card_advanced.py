import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

# Credentials
API_KEY = os.environ.get('TRELLO_API_KEY')
TOKEN = os.environ.get('TRELLO_TOKEN')
# API_KEY = "bf371933fcd49ba099774ba087050e38" # Old
# TOKEN = "ATTA3f27a64d09d2ceef38759b7f1941ca024bc84c274224f592b84fe11c701398898D4A4EE9" # Old

if not API_KEY or not TOKEN:
    print("Error: TRELLO_API_KEY and TRELLO_TOKEN must be set in your .env file.")
    exit()

CARD_ID = "68289260b63d7f779c91f94c"  # ID of "Develop Trello Voice OS" card

NEW_CONCISE_DESCRIPTION = "Voice-driven Trello management system. Python scripts for CRUD operations, superwhisper integration for voice input. Future: n8n, advanced AI."
CHECKLIST_NAME = "Core Script Functionality"
CHECKLIST_ITEMS = [
    {"name": "Connection Test Script (trello_connection_test.py)", "checked": True},
    {"name": "View Board Details Script (view_board_details.py)", "checked": True},
    {"name": "Update Card Script (update_trello_card.py)", "checked": True},
    {"name": "Create Card Script (create_trello_card.py)", "checked": True},
    {"name": "Attach File to Card Script", "checked": False},
    {"name": "Delete Card Script", "checked": False},
    {"name": "Voice Command Parser (Assistant Logic)", "checked": False}
]

headers = {"Accept": "application/json"}
base_url = "https://api.trello.com/1"
auth_params = f"key={API_KEY}&token={TOKEN}"

# 1. Update Card Description
def update_card_description(card_id, new_desc):
    url = f"{base_url}/cards/{card_id}?{auth_params}"
    payload = {'desc': new_desc}
    try:
        response = requests.put(url, headers=headers, json=payload)
        response.raise_for_status()
        print(f"Successfully updated description for card ID {card_id}.")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error updating card description: {e}")
        if hasattr(response, 'content'): print(f"Response: {response.content.decode(errors='ignore')}")
        return False

# 2. Create Checklist (if it doesn't exist) or get existing one
def get_or_create_checklist(card_id, checklist_name):
    # First, check if checklist already exists
    checklists_url = f"{base_url}/cards/{card_id}/checklists?{auth_params}"
    try:
        response = requests.get(checklists_url, headers=headers)
        response.raise_for_status()
        existing_checklists = response.json()
        for clist in existing_checklists:
            if clist['name'] == checklist_name:
                print(f"Found existing checklist '{checklist_name}' with ID {clist['id']}.")
                # Clear existing items before adding new ones to avoid duplicates if re-run
                for item in clist.get('checkItems', []):
                    delete_item_url = f"{base_url}/checklists/{clist['id']}/checkItems/{item['id']}?{auth_params}"
                    requests.delete(delete_item_url, headers=headers) # Best effort deletion
                return clist['id']
        
        # If not found, create it
        create_checklist_url = f"{base_url}/checklists?{auth_params}&idCard={card_id}&name={requests.utils.quote(checklist_name)}"
        response = requests.post(create_checklist_url, headers=headers)
        response.raise_for_status()
        new_checklist = response.json()
        print(f"Successfully created checklist '{new_checklist['name']}' with ID {new_checklist['id']}.")
        return new_checklist['id']
    except requests.exceptions.RequestException as e:
        print(f"Error getting/creating checklist: {e}")
        if hasattr(response, 'content'): print(f"Response: {response.content.decode(errors='ignore')}")
        return None

# 3. Add Items to Checklist
def add_items_to_checklist(checklist_id, items):
    item_success_count = 0
    for item_data in items:
        item_name = item_data['name']
        item_checked = item_data['checked']
        add_item_url = f"{base_url}/checklists/{checklist_id}/checkItems?{auth_params}&name={requests.utils.quote(item_name)}&checked={str(item_checked).lower()}&pos=bottom"
        try:
            response = requests.post(add_item_url, headers=headers)
            response.raise_for_status()
            item_success_count += 1
        except requests.exceptions.RequestException as e:
            print(f"Error adding item '{item_name}' to checklist {checklist_id}: {e}")
            if hasattr(response, 'content'): print(f"Response: {response.content.decode(errors='ignore')}")
    print(f"Successfully added {item_success_count}/{len(items)} items to checklist ID {checklist_id}.")

if __name__ == "__main__":
    print(f"Updating card ID: {CARD_ID}")
    if update_card_description(CARD_ID, NEW_CONCISE_DESCRIPTION):
        checklist_id = get_or_create_checklist(CARD_ID, CHECKLIST_NAME)
        if checklist_id:
            add_items_to_checklist(checklist_id, CHECKLIST_ITEMS)
    print("Card update process finished.") 