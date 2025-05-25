import requests
import json
import os
import argparse # Import argparse
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

BOARD_ID = "67d1eaa9eed6766b5e421bd5"  # Default Projects board, can be overridden if needed
# CARD_ID_TO_MOVE = "68289260b63d7f779c91f94c" # Old: Develop Trello Voice OS
CARD_NAME_TO_MOVE = "Develop Trello Voice OS" # Card to find by name
TARGET_LIST_NAME = "Inbox 📥" # Target list to move the card to (its current list)
TARGET_POSITION = "bottom" # "top", "bottom", or a positive number

headers = {"Accept": "application/json"}
base_url = "https://api.trello.com/1"
auth_params = f"key={API_KEY}&token={TOKEN}"

# Function to find a card by name on a specific board (from delete_trello_card.py / update_trello_card.py)
def find_card_on_board(board_id, card_name, api_key, token):
    url = f"https://api.trello.com/1/boards/{board_id}/cards?key={api_key}&token={token}&filter=open&fields=id,name,idList"
    headers = {"Accept": "application/json"}
    response_content = None
    try:
        response = requests.get(url, headers=headers)
        response_content = response.content
        response.raise_for_status()
        cards = response.json()
        for card in cards:
            if card['name'] == card_name:
                print(f"Found card: '{card_name}' with ID: {card['id']} (current list ID: {card.get('idList')})")
                return card['id'], card.get('idList') # Return ID and current list ID
        print(f"Card named '{card_name}' not found on board '{board_id}'.")
        return None, None
    except requests.exceptions.RequestException as e:
        print(f"Error finding card: {e}")
        if response_content: print(f"Response content: {response_content.decode(errors='ignore')}")
        return None, None
    except json.JSONDecodeError as e:
        print(f"JSON decode error while finding card: {e}")
        if response_content: print(f"Response content: {response_content.decode(errors='ignore')}")
        return None, None

# Function to find a list ID by name on a specific board (from create_trello_card.py)
def find_list_id(board_id, list_name, api_key, token):
    lists_url = f"{base_url}/boards/{board_id}/lists?key={api_key}&token={token}&filter=open&fields=id,name"
    response_content = None
    try:
        response = requests.get(lists_url, headers=headers)
        response_content = response.content
        response.raise_for_status()
        lists = response.json()
        for lst in lists:
            if lst['name'] == list_name:
                print(f"Found target list: '{list_name}' with ID: {lst['id']}")
                return lst['id']
        print(f"Target list named '{list_name}' not found on board '{board_id}'.")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Error finding list: {e}")
        if response_content: print(f"Response content: {response_content.decode(errors='ignore')}")
        return None
    except json.JSONDecodeError as e:
        print(f"JSON decode error while finding list: {e}")
        if response_content: print(f"Response content: {response_content.decode(errors='ignore')}")
        return None

def get_card_details(card_id):
    url = f"{base_url}/cards/{card_id}?{auth_params}&fields=id,name,idList"
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching details for card {card_id}: {e}")
        return None

def move_card(card_id, target_list_id, position):
    url = f"{base_url}/cards/{card_id}?{auth_params}"
    payload = {
        'pos': position
    }
    # Only include idList in payload if it's different from the card's current list
    # or if explicitly provided (which means we intend to move it to this list or confirm it's in this list)
    current_card_details = get_card_details(card_id)
    if not current_card_details:
        print(f"Could not get current details for card {card_id}. Aborting move.")
        return False
        
    # If target_list_id is provided and is different from current, or if it is the same,
    # Trello API handles moving to a new list or reordering in the same list correctly if idList is present.
    # If target_list_id is None, it means reorder in current list, so don't send idList.
    if target_list_id:
        payload['idList'] = target_list_id
        
    response_content = None
    try:
        response = requests.put(url, headers=headers, json=payload)
        response_content = response.content
        response.raise_for_status()
        updated_card = response.json()
        msg = f"Successfully moved card '{updated_card['name']}' (ID: {card_id}) to position: {position}"
        if target_list_id:
            msg += f" in list ID {target_list_id}."
        else:
            msg += f" in its current list (ID: {updated_card['idList']})."
        print(msg)
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error moving card: {e} - {response.text if response is not None else 'No response text'}")
        return False
    except json.JSONDecodeError as e:
        print(f"JSON decode error while moving card: {e}")
        if response_content: print(f"Response content: {response_content.decode(errors='ignore')}")
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Move a Trello card to a specified list and/or position.")
    parser.add_argument("--card_id", required=True, help="The ID of the card to move.")
    parser.add_argument("--target_list_id", help="The ID of the target list. If not provided, card moves within its current list.")
    parser.add_argument("--position", required=True, choices=['top', 'bottom'] + [str(i) for i in range(1, 101)], help="Position to move to: 'top', 'bottom', or a positive integer.")

    args = parser.parse_args()

    card_details = get_card_details(args.card_id)
    if not card_details:
        print(f"Could not find card with ID '{args.card_id}'. Cannot move.")
        exit()
    
    card_name = card_details.get('name', args.card_id)
    current_list_id = card_details.get('idList')

    target_list_id_for_api = args.target_list_id
    
    if args.target_list_id:
        if args.target_list_id == current_list_id:
            print(f"Card '{card_name}' is already in the target list '{args.target_list_id}'. Will reorder within this list.")
        else:
            print(f"Moving card '{card_name}' to list '{args.target_list_id}' and position '{args.position}'.")
    else:
        print(f"Moving card '{card_name}' to position '{args.position}' within its current list '{current_list_id}'.")
        # When moving within the current list and target_list_id is not explicitly given as the current list,
        # the API expects idList to NOT be in the payload for reordering. 
        # However, our move_card function logic is better if we pass None here, and it won't include idList.
        target_list_id_for_api = None 

    move_card(args.card_id, target_list_id_for_api, args.position) 