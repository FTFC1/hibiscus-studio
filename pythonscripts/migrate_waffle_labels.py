import os
import requests
from dotenv import load_dotenv

load_dotenv()

TRELLO_API_KEY = os.environ.get('TRELLO_API_KEY')
TRELLO_TOKEN = os.environ.get('TRELLO_TOKEN')
BASE_URL = "https://api.trello.com/1"
AUTH_PARAMS = f"key={TRELLO_API_KEY}&token={TRELLO_TOKEN}"
INBOX_LIST_NAME = "Inbox 📥"

OLD_LABELS = ["waffle content", "waffle archive", "waffle"]
NEW_LABELS = {"waffle content": "WAFFLE", "waffle archive": "WAFFLE ARCHIVED", "waffle": "WAFFLE"}

# --- Helper Functions ---
def get_list_id(board_id, list_name):
    url = f"{BASE_URL}/boards/{board_id}/lists?{AUTH_PARAMS}"
    resp = requests.get(url)
    resp.raise_for_status()
    for lst in resp.json():
        if lst['name'].lower() == list_name.lower():
            return lst['id']
    return None

def get_cards_in_list(list_id):
    url = f"{BASE_URL}/lists/{list_id}/cards?{AUTH_PARAMS}&fields=name,labels"
    resp = requests.get(url)
    resp.raise_for_status()
    return resp.json()

def get_label_id(board_id, label_name):
    url = f"{BASE_URL}/boards/{board_id}/labels?{AUTH_PARAMS}"
    resp = requests.get(url)
    resp.raise_for_status()
    for label in resp.json():
        if label['name'].lower() == label_name.lower():
            return label['id']
    # Create label if not found
    payload = {"name": label_name, "color": "purple"}
    create_url = f"{BASE_URL}/labels?{AUTH_PARAMS}&idBoard={board_id}"
    create_resp = requests.post(create_url, json=payload)
    create_resp.raise_for_status()
    return create_resp.json()['id']

def update_card_labels(card_id, new_label_ids):
    url = f"{BASE_URL}/cards/{card_id}?{AUTH_PARAMS}"
    resp = requests.put(url, data={"idLabels": ",".join(new_label_ids)})
    resp.raise_for_status()
    return resp.json()

def migrate_labels(card, board_id):
    card_labels = card['labels']
    card_label_names = [l['name'].lower() for l in card_labels]
    card_id = card['id']
    new_labels = []
    migrated = False
    # Only add new label if old one is present
    for old in OLD_LABELS:
        if old in card_label_names:
            new = NEW_LABELS[old]
            new_id = get_label_id(board_id, new)
            new_labels.append(new_id)
            migrated = True
    # Keep non-waffle labels (remove all legacy waffle tags)
    for l in card_labels:
        if l['name'].lower() not in OLD_LABELS:
            new_labels.append(l['id'])
    if migrated:
        update_card_labels(card_id, new_labels)
        print(f"[UPDATED] {card['name']} ({card_id}) -> {', '.join([NEW_LABELS.get(n, n) for n in card_label_names if n in OLD_LABELS])}")
    elif any(l in card_label_names for l in OLD_LABELS):
        # Remove old waffle labels if present but not mapped
        update_card_labels(card_id, new_labels)
        print(f"[REMOVED OLD TAGS] {card['name']} ({card_id})")
    else:
        print(f"[SKIP] {card['name']}")

def main():
    board_id = os.environ.get('TRELLO_BOARD_ID')
    if not board_id:
        print("Set TRELLO_BOARD_ID in your .env file.")
        return
    list_id = get_list_id(board_id, INBOX_LIST_NAME)
    if not list_id:
        print(f"Inbox list '{INBOX_LIST_NAME}' not found.")
        return
    cards = get_cards_in_list(list_id)
    for card in cards:
        migrate_labels(card, board_id)

if __name__ == "__main__":
    main() 