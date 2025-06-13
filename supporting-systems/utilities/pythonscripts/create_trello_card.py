import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

# Credentials and Board ID
API_KEY = os.environ.get('TRELLO_API_KEY')
TOKEN = os.environ.get('TRELLO_TOKEN')
# API_KEY = "bf371933fcd49ba099774ba087050e38" # Old
# TOKEN = "ATTA3f27a64d09d2ceef38759b7f1941ca024bc84c274224f592b84fe11c701398898D4A4EE9" # Old
BOARD_ID = "67d1eaa9eed6766b5e421bd5"  # Projects board

if not API_KEY or not TOKEN:
    print("Error: TRELLO_API_KEY and TRELLO_TOKEN must be set in your .env file.")
    exit()

TARGET_LIST_NAME = "Inbox 📥"
NEW_CARD_TITLE = "Develop Trello Voice OS"
NEW_CARD_DESCRIPTION = "System to manage Trello via voice commands, integrating Superwhisper, Python scripts, and potentially n8n. Key features: capture voice notes ('waffles'), refine into actionable tasks, AI-assisted planning, and keep Trello as a living source of truth. Initial focus on core CRUD operations and waffle attachment."

headers = {"Accept": "application/json"}
base_url = "https://api.trello.com/1"
auth_params = f"key={API_KEY}&token={TOKEN}"

# Function to find a list ID by name on a specific board
def find_list_id(board_id, list_name):
    lists_url = f"{base_url}/boards/{board_id}/lists?{auth_params}&filter=open"
    response_content = None
    try:
        response = requests.get(lists_url, headers=headers)
        response_content = response.content
        response.raise_for_status()
        lists = response.json()
        for lst in lists:
            if lst['name'] == list_name:
                print(f"Found list: '{list_name}' with ID: {lst['id']}")
                return lst['id']
        print(f"List named '{list_name}' not found on board {board_id}.")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Error finding list: {e}")
        if response_content:
            print(f"Response content: {response_content.decode(errors='ignore')}")
        return None
    except json.JSONDecodeError as e:
        print(f"JSON decode error while finding list: {e}")
        if response_content:
            print(f"Response content: {response_content.decode(errors='ignore')}")
        return None

# Function to create a new card
def create_card(list_id, name, desc):
    cards_url = f"{base_url}/cards?{auth_params}"
    payload = {
        'idList': list_id,
        'name': name,
        'desc': desc
    }
    response_content = None
    try:
        response = requests.post(cards_url, headers=headers, json=payload)
        response_content = response.content
        response.raise_for_status()
        new_card = response.json()
        print(f"Successfully created card '{new_card['name']}' with ID: {new_card['id']} in list ID {list_id}")
        return new_card
    except requests.exceptions.RequestException as e:
        print(f"Error creating card: {e}")
        if response_content:
            print(f"Response content: {response_content.decode(errors='ignore')}")
        return None
    except json.JSONDecodeError as e:
        print(f"JSON decode error while creating card: {e}")
        if response_content:
            print(f"Response content: {response_content.decode(errors='ignore')}")
        return None

if __name__ == "__main__":
    print(f"Searching for list '{TARGET_LIST_NAME}' on board ID '{BOARD_ID}'...")
    target_list_id = find_list_id(BOARD_ID, TARGET_LIST_NAME)

    if target_list_id:
        print(f"Attempting to create card '{NEW_CARD_TITLE}' in list ID: {target_list_id}...")
        created_card = create_card(target_list_id, NEW_CARD_TITLE, NEW_CARD_DESCRIPTION)
        if created_card:
            print("Card creation process completed.")
        else:
            print("Card creation failed.")
    else:
        print("Cannot create card because target list was not found.") 