import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

# IMPORTANT: Replace with your actual API Key and Token
API_KEY = os.environ.get('TRELLO_API_KEY')
TOKEN = os.environ.get('TRELLO_TOKEN')
# API_KEY = "bf371933fcd49ba099774ba087050e38"  # API Key updated
# TOKEN = "ATTA3f27a64d09d2ceef38759b7f1941ca024bc84c274224f592b84fe11c701398898D4A4EE9"    # Token updated

if not API_KEY or not TOKEN:
    print("Error: TRELLO_API_KEY and TRELLO_TOKEN must be set in your .env file.")
    exit()

BOARD_ID = "67d1eaa9eed6766b5e421bd5"  # The ID of the "Projects" board
TARGET_CARD_NAME = "Version 2"  # Updated to correct capitalization
NEW_CARD_NAME = "Version 2 - better layout"
NEW_CARD_DESC = "Thank you."

# Function to find a card by name on a specific board
def find_card_on_board(board_id, card_name):
    url = f"https://api.trello.com/1/boards/{board_id}/cards?key={API_KEY}&token={TOKEN}&filter=open"
    headers = {"Accept": "application/json"}
    response_content = None  # Initialize in case of early exception
    try:
        response = requests.get(url, headers=headers)
        response_content = response.content # Store content for potential error reporting
        response.raise_for_status()
        cards = response.json()
        for card in cards:
            if card['name'] == card_name:
                print(f"Found card: '{card_name}' with ID: {card['id']}")
                return card['id']
        print(f"Card named '{card_name}' not found on board {board_id}.")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Error finding card: {e}")
        if response_content:
            print(f"Response content: {response_content.decode(errors='ignore')}")
        return None
    except json.JSONDecodeError as e:
        print(f"JSON decode error while finding card: {e}")
        if response_content:
            print(f"Response content: {response_content.decode(errors='ignore')}")
        return None        

# Function to update a card's name and description
def update_card(card_id, new_name, new_desc):
    url = f"https://api.trello.com/1/cards/{card_id}?key={API_KEY}&token={TOKEN}"
    headers = {"Accept": "application/json"}
    payload = {
        'name': new_name,
        'desc': new_desc
    }
    response_content = None # Initialize
    try:
        response = requests.put(url, headers=headers, json=payload)
        response_content = response.content
        response.raise_for_status()
        print(f"Successfully updated card ID {card_id} to name '{new_name}' and description '{new_desc}'")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error updating card: {e}")
        if response_content:
            print(f"Response content: {response_content.decode(errors='ignore')}")
        return False
    except json.JSONDecodeError as e:
        print(f"JSON decode error while updating card: {e}")
        if response_content:
            print(f"Response content: {response_content.decode(errors='ignore')}")
        return False

if __name__ == "__main__":
    if API_KEY == "YOUR_API_KEY_HERE" or TOKEN == "YOUR_TOKEN_HERE": # This check is technically redundant now but safe
        print("API_KEY or TOKEN might not be correctly set in the script.") 
    else:
        print(f"Searching for card '{TARGET_CARD_NAME}' on board ID '{BOARD_ID}'...")
        card_to_update_id = find_card_on_board(BOARD_ID, TARGET_CARD_NAME)

        if card_to_update_id:
            print(f"Attempting to update card ID: {card_to_update_id}...")
            update_card(card_to_update_id, NEW_CARD_NAME, NEW_CARD_DESC) 