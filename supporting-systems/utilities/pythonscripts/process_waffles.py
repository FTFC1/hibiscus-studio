import requests
import os
import json
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

API_KEY = os.environ.get('TRELLO_API_KEY')
TOKEN = os.environ.get('TRELLO_TOKEN')
BOARD_ID = os.environ.get('TRELLO_BOARD_ID') or '67d1eaa9eed6766b5e421bd5'

WAFFLE_LABEL_NAME = 'WAFFLE'
WAFFLE_ARCHIVED_LABEL_NAME = 'WAFFLE ARCHIVED'

if not API_KEY or not TOKEN:
    print("Error: TRELLO_API_KEY and TRELLO_TOKEN must be set in your .env file.")
    exit()

headers = {"Accept": "application/json"}
base_url = "https://api.trello.com/1"
auth_params = f"key={API_KEY}&token={TOKEN}"

def get_label_id_by_name(board_id, label_name):
    url = f"{base_url}/boards/{board_id}/labels?{auth_params}"
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        labels = response.json()
        for label in labels:
            if label['name'].strip().lower() == label_name.strip().lower():
                return label['id']
        print(f"Label '{label_name}' not found on board '{board_id}'.")
        return None
    except Exception as e:
        print(f"Error fetching label '{label_name}': {e}")
        return None

def get_cards_on_board_with_label(board_id, label_id):
    url = f"{base_url}/boards/{board_id}/cards?{auth_params}&fields=id,name,desc,idLabels"
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        all_cards = response.json()
        cards_with_label = [card for card in all_cards if label_id in card.get('idLabels', [])]
        if not cards_with_label:
            print(f"No cards found with label ID '{label_id}' on board '{board_id}'.")
        return cards_with_label
    except requests.exceptions.RequestException as e:
        print(f"Error fetching cards from board {board_id}: {e}")
        return []

def attach_text_as_file_to_card(card_id, text_content, filename):
    temp_file_path = filename
    try:
        with open(temp_file_path, 'w') as f:
            f.write(text_content)
        url = f"{base_url}/cards/{card_id}/attachments?{auth_params}"
        with open(temp_file_path, 'rb') as file_to_upload:
            files = {'file': (filename, file_to_upload)}
            response = requests.post(url, files=files)
            response.raise_for_status()
        print(f"Successfully attached '{filename}' to card ID: {card_id}")
        return True
    except Exception as e:
        print(f"Error attaching file '{filename}' to card {card_id}: {e}")
        return False
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path) # Clean up temp file

def update_card_description(card_id, new_description):
    url = f"{base_url}/cards/{card_id}?{auth_params}"
    payload = {'desc': new_description}
    try:
        response = requests.put(url, headers=headers, json=payload)
        response.raise_for_status()
        print(f"Successfully updated description for card ID: {card_id}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error updating description for card {card_id}: {e}")
        return False

def remove_label_from_card(card_id, label_id):
    url = f"{base_url}/cards/{card_id}/idLabels/{label_id}?{auth_params}"
    try:
        response = requests.delete(url, headers=headers)
        response.raise_for_status()
        print(f"Successfully removed label ID '{label_id}' from card ID '{card_id}'.")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error removing label '{label_id}' from card {card_id}: {e}")
        return False

def add_label_to_card(card_id, label_id):
    url = f"{base_url}/cards/{card_id}/idLabels"
    query_params = {
        'key': API_KEY,
        'token': TOKEN,
        'value': label_id
    }
    try:
        response = requests.post(url, headers=headers, params=query_params)
        response.raise_for_status()
        print(f"Successfully added label ID '{label_id}' to card ID '{card_id}'.")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error adding label '{label_id}' to card {card_id}: {e}")
        return False

if __name__ == "__main__":
    print(f"Starting waffle processing for board ID '{BOARD_ID}'...")
    waffle_label_id = get_label_id_by_name(BOARD_ID, WAFFLE_LABEL_NAME)
    waffle_archived_label_id = get_label_id_by_name(BOARD_ID, WAFFLE_ARCHIVED_LABEL_NAME)

    if not waffle_label_id or not waffle_archived_label_id:
        print("Could not find both 'WAFFLE' and 'WAFFLE ARCHIVED' labels. Aborting.")
        exit(1)

    cards_to_process = get_cards_on_board_with_label(BOARD_ID, waffle_label_id)

    if not cards_to_process:
        print("No cards found with the 'WAFFLE' label. Nothing to do.")
    else:
        print(f"Found {len(cards_to_process)} card(s) to process.")

    for card in cards_to_process:
        card_id = card['id']
        card_name = card['name']
        card_desc = card.get('desc', '')
        print(f"\nProcessing card: '{card_name}' (ID: {card_id})")

        if not card_desc.strip():
            print(f"Card '{card_name}' has no description to archive. Skipping label change for this one, but removing 'WAFFLE' label if present.")
            if waffle_label_id in card.get('idLabels', []):
                remove_label_from_card(card_id, waffle_label_id)
            continue

        # Generate filename
        date_str = datetime.now().strftime("%d%b%y") # e.g., 17May24
        attachment_filename = f"waffle_archive_{date_str}.txt"

        print(f"Archiving description to '{attachment_filename}'...")
        if attach_text_as_file_to_card(card_id, card_desc, attachment_filename):
            print("Updating card description...")
            if update_card_description(card_id, "Original waffle archived. Summary pending."):
                print("Swapping labels...")
                if remove_label_from_card(card_id, waffle_label_id):
                    add_label_to_card(card_id, waffle_archived_label_id)
                else:
                    print(f"Could not remove 'WAFFLE' label from '{card_name}'. Archival label not added.")
            else:
                print(f"Could not update description for '{card_name}'. Labels not changed.")
        else:
            print(f"Could not attach waffle archive for '{card_name}'. Description and labels not changed.")
    
    print("\nWaffle processing finished.") 