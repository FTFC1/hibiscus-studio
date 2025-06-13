import requests
import os
from dotenv import load_dotenv
import json # Added for find_card_on_board

load_dotenv()

# Hardcoded API credentials and Card ID for this test
API_KEY = os.environ.get('TRELLO_API_KEY')
TOKEN = os.environ.get('TRELLO_TOKEN')
# API_KEY = 'bf371933fcd49ba099774ba087050e38' # Old
# TOKEN = 'ATTA3f27a64d09d2ceef38759b7f1941ca024bc84c274224f592b84fe11c701398898D4A4EE9' # Old

if not API_KEY or not TOKEN:
    print("Error: TRELLO_API_KEY and TRELLO_TOKEN must be set in your .env file.")
    exit()

BOARD_ID = '67d1eaa9eed6766b5e421bd5'  # Your "Projects" board ID
# CARD_ID_TO_DELETE = '68289878a1c0b53dc2948222' # Old hardcoded ID of 'DeleteMe Card'
CARD_NAME_TO_DELETE = "Card Scheduled for Dynamic Deletion" # Name of the card to find and delete

# Function to find a card by name on a specific board (adapted from update_trello_card.py)
def find_card_on_board(board_id, card_name, api_key, token):
    url = f"https://api.trello.com/1/boards/{board_id}/cards?key={api_key}&token={token}&filter=open"
    headers = {"Accept": "application/json"}
    response_content = None
    try:
        response = requests.get(url, headers=headers)
        response_content = response.content
        response.raise_for_status()
        cards = response.json()
        for card in cards:
            if card['name'] == card_name:
                print(f"Found card: '{card_name}' with ID: {card['id']}")
                return card['id']
        print(f"Card named '{card_name}' not found on board '{board_id}'.")
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

def delete_card(card_id, api_key, token):
    """Deletes the specified card."""
    url = f"https://api.trello.com/1/cards/{card_id}"
    query = {
        'key': api_key,
        'token': token
    }
    response = None # Initialize for broader scope in error handling
    try:
        response = requests.delete(url, params=query)
        response.raise_for_status()  # Raises an exception for 4XX/5XX errors
        print(f"Successfully deleted card with ID: {card_id}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error deleting card {card_id}: {e}")
        if response is not None:
            print(f"Response status: {response.status_code}")
            print(f"Response content: {response.text}")
        return False

if __name__ == "__main__":
    print(f"Attempting to find card named '{CARD_NAME_TO_DELETE}' on board '{BOARD_ID}'...")
    card_id_to_delete = find_card_on_board(BOARD_ID, CARD_NAME_TO_DELETE, API_KEY, TOKEN)
    
    if card_id_to_delete:
        print(f"Attempting to delete card '{CARD_NAME_TO_DELETE}' (ID: {card_id_to_delete})...")
        # For safety, you might want to add a confirmation step here in a real scenario
        # confirmation = input(f"Are you sure you want to delete '{CARD_NAME_TO_DELETE}'? (yes/no): ")
        # if confirmation.lower() == 'yes':
        #     delete_card(card_id_to_delete, API_KEY, TOKEN)
        # else:
        #     print("Deletion cancelled.")
        delete_card(card_id_to_delete, API_KEY, TOKEN) # Direct deletion for now
    else:
        print(f"Card '{CARD_NAME_TO_DELETE}' not found. Nothing to delete.") 