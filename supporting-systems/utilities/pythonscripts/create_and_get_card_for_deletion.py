import requests
import json
import os
from dotenv import load_dotenv

load_dotenv() # Load variables from .env file

# Retrieve API credentials from environment variables
API_KEY = os.environ.get('TRELLO_API_KEY')
TOKEN = os.environ.get('TRELLO_TOKEN')

# API_KEY = 'bf371933fcd49ba099774ba087050e38' # Old hardcoded
# TOKEN = 'ATTA3f27a64d09d2ceef38759b7f1941ca024bc84c274224f592b84fe11c701398898D4A4EE9' # Old hardcoded

BOARD_ID = '67d1eaa9eed6766b5e421bd5'  # Your "Projects" board ID
TARGET_LIST_NAME = 'Inbox 📥'
NEW_CARD_NAME = 'DeleteMe Card'

if not API_KEY or not TOKEN:
    print("Error: TRELLO_API_KEY and TRELLO_TOKEN environment variables must be set.")
    exit()

def get_list_id(board_id, list_name, api_key, token):
    """Fetches the ID of a list on a board by its name."""
    url = f"https://api.trello.com/1/boards/{board_id}/lists"
    query = {
        'key': api_key,
        'token': token,
        'cards': 'none', # Don't need card details for this
        'fields': 'name,id'
    }
    try:
        response = requests.get(url, params=query)
        response.raise_for_status()  # Raises an exception for 4XX/5XX errors
        lists = response.json()
        for lst in lists:
            if lst['name'] == list_name:
                return lst['id']
        print(f"Error: List named '{list_name}' not found on board '{board_id}'.")
        print("Available lists:")
        for lst in lists:
            print(f"- {lst['name']} (ID: {lst['id']})")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Error fetching lists: {e}")
        return None

def create_card(list_id, card_name, api_key, token):
    """Creates a new card in the specified list."""
    url = "https://api.trello.com/1/cards"
    query = {
        'key': api_key,
        'token': token,
        'idList': list_id,
        'name': card_name,
        'desc': 'This card is created for testing the delete functionality.'
    }
    try:
        response = requests.post(url, params=query)
        response.raise_for_status()
        card_data = response.json()
        print(f"Successfully created card '{card_name}' with ID: {card_data['id']}")
        return card_data['id']
    except requests.exceptions.RequestException as e:
        print(f"Error creating card: {e}")
        if response is not None:
            print(f"Response content: {response.text}")
        return None

if __name__ == "__main__":
    print(f"Attempting to find list ID for '{TARGET_LIST_NAME}' on board '{BOARD_ID}'...")
    list_id = get_list_id(BOARD_ID, TARGET_LIST_NAME, API_KEY, TOKEN)

    if list_id:
        print(f"Found list ID for '{TARGET_LIST_NAME}': {list_id}")
        print(f"Creating card '{NEW_CARD_NAME}' in list '{TARGET_LIST_NAME}'...")
        created_card_id = create_card(list_id, NEW_CARD_NAME, API_KEY, TOKEN)
        if created_card_id:
            # This print is crucial for the next step
            print(f"NEXT_STEP_CARD_ID:{created_card_id}")
    else:
        print(f"Could not proceed with card creation as list '{TARGET_LIST_NAME}' was not found.") 