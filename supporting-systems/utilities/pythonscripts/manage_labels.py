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

BOARD_ID = "67d1eaa9eed6766b5e421bd5"  # Projects board
CARD_ID = "68289260b63d7f779c91f94c"  # Develop Trello Voice OS
LABEL_NAME = "Productivity"
LABEL_COLOR = "green" # A common color, Trello has a set of named colors

if not API_KEY or not TOKEN:
    print("Error: TRELLO_API_KEY and TRELLO_TOKEN must be set in your .env file.")
    exit()

headers = {"Accept": "application/json"}
base_url = "https://api.trello.com/1"
auth_params = f"key={API_KEY}&token={TOKEN}"

# Function to find or create a label on the board
def get_or_create_label_id(board_id, label_name, label_color):
    labels_url = f"{base_url}/boards/{board_id}/labels?{auth_params}"
    response_content = None
    try:
        response = requests.get(labels_url, headers=headers)
        response_content = response.content
        response.raise_for_status()
        labels = response.json()
        for label in labels:
            if label['name'] == label_name:
                print(f"Found existing label '{label_name}' with ID: {label['id']}")
                return label['id']
        
        # Label not found, create it
        print(f"Label '{label_name}' not found. Creating it...")
        create_label_url = f"{base_url}/labels?{auth_params}"
        payload = {
            'name': label_name,
            'color': label_color,
            'idBoard': board_id
        }
        response = requests.post(create_label_url, headers=headers, json=payload)
        response_content = response.content
        response.raise_for_status()
        new_label = response.json()
        print(f"Successfully created label '{new_label['name']}' with ID: {new_label['id']}")
        return new_label['id']
    except requests.exceptions.RequestException as e:
        print(f"Error finding or creating label: {e}")
        if response_content: print(f"Response: {response_content.decode(errors='ignore')}")
        return None
    except json.JSONDecodeError as e:
        print(f"JSON decode error with labels: {e}")
        if response_content: print(f"Response: {response_content.decode(errors='ignore')}")
        return None

# Function to add a label to a card
def add_label_to_card(card_id, label_id):
    add_label_url = f"{base_url}/cards/{card_id}/idLabels?{auth_params}"
    payload = {'value': label_id}
    response_content = None
    try:
        response = requests.post(add_label_url, headers=headers, json=payload) # Trello API uses POST for adding labels by ID via query param or body
        response_content = response.content
        response.raise_for_status()
        print(f"Successfully added label ID {label_id} to card ID {card_id}.")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error adding label to card: {e}")
        # Check if it's because the label is already on the card (Trello might return an error or do nothing)
        # For simplicity, we'll just report error here. A more robust check would be to get card labels first.
        if response_content: print(f"Response: {response_content.decode(errors='ignore')}")
        return False
    except json.JSONDecodeError as e:
        print(f"JSON decode error adding label: {e}")
        if response_content: print(f"Response: {response_content.decode(errors='ignore')}")
        return False

if __name__ == "__main__":
    print(f"Attempting to find or create label '{LABEL_NAME}' on board ID '{BOARD_ID}'...")
    label_id_to_add = get_or_create_label_id(BOARD_ID, LABEL_NAME, LABEL_COLOR)

    if label_id_to_add:
        print(f"Attempting to add label '{LABEL_NAME}' (ID: {label_id_to_add}) to card ID '{CARD_ID}'...")
        add_label_to_card(CARD_ID, label_id_to_add)
    else:
        print(f"Could not add label as the label ID was not found or created.") 