import os
import requests
from dotenv import load_dotenv
import io

load_dotenv()

TRELLO_API_KEY = os.environ.get('TRELLO_API_KEY')
TRELLO_TOKEN = os.environ.get('TRELLO_TOKEN')
TRELLO_BOARD_ID = os.environ.get('TRELLO_BOARD_ID')

BASE_URL = "https://api.trello.com/1"
AUTH_PARAMS = f"key={TRELLO_API_KEY}&token={TRELLO_TOKEN}"

INBOX_LIST_NAME = "Inbox"  # Change if your list is named differently
WAFFLE_LABEL = "WAFFLE ARCHIVED"

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
    url = f"{BASE_URL}/lists/{list_id}/cards?{AUTH_PARAMS}&fields=name,desc,labels"
    resp = requests.get(url)
    resp.raise_for_status()
    return resp.json()

def detect_waffle(desc):
    # Simple detection: length and keywords
    if not desc or len(desc) < 500:
        return False
    keywords = ["waffle", "voice note", "transcript"]
    if any(kw in desc.lower() for kw in keywords):
        return True
    # TODO: Add AI-based detection here
    return False

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

def attach_txt_to_card(card_id, txt_content):
    files = {'file': ('waffle_archive.txt', io.BytesIO(txt_content.encode('utf-8')))}
    url = f"{BASE_URL}/cards/{card_id}/attachments?{AUTH_PARAMS}"
    resp = requests.post(url, files=files)
    resp.raise_for_status()
    return resp.json()

def add_label_to_card(card_id, label_id):
    url = f"{BASE_URL}/cards/{card_id}/idLabels?{AUTH_PARAMS}"
    resp = requests.post(url, data={"value": label_id})
    resp.raise_for_status()
    return resp.json()

def clear_card_description(card_id):
    url = f"{BASE_URL}/cards/{card_id}?{AUTH_PARAMS}"
    resp = requests.put(url, data={"desc": ""})
    resp.raise_for_status()
    return resp.json()

def archive_description(card, board_id):
    desc = card['desc']
    card_id = card['id']
    print(f"  - Archiving description as .txt...")
    attach_txt_to_card(card_id, desc)
    print(f"  - Attaching file to card...")
    label_id = get_label_id(board_id, WAFFLE_LABEL)
    print(f"  - Adding label [{WAFFLE_LABEL}]...")
    add_label_to_card(card_id, label_id)
    print(f"  - Clearing description...")
    clear_card_description(card_id)
    print(f"  - Done!\n")

def main():
    board_id = TRELLO_BOARD_ID
    if not board_id:
        print("Set TRELLO_BOARD_ID in your .env file.")
        return
    list_id = get_list_id(board_id, INBOX_LIST_NAME)
    if not list_id:
        print(f"Inbox list '{INBOX_LIST_NAME}' not found.")
        return
    cards = get_cards_in_list(list_id)
    for card in cards:
        if detect_waffle(card['desc']):
            print(f"[DETECTED] {card['name']} ({card['id']})")
            archive_description(card, board_id)
        else:
            print(f"[SKIP] {card['name']}")

if __name__ == "__main__":
    main() 