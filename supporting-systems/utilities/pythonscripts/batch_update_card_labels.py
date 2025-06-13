import requests
import os
import argparse
from dotenv import load_dotenv

load_dotenv()

TRELLO_API_KEY = os.environ.get('TRELLO_API_KEY')
TRELLO_TOKEN = os.environ.get('TRELLO_TOKEN')

if not TRELLO_API_KEY or not TRELLO_TOKEN:
    print("Error: TRELLO_API_KEY and TRELLO_TOKEN must be set in .env")
    exit()

BASE_URL = "https://api.trello.com/1"
AUTH_PARAMS = f"key={TRELLO_API_KEY}&token={TRELLO_TOKEN}"
HEADERS = {"Accept": "application/json"}

# Label IDs (ensure these are correct)
WAFFLE_SUMMARIZED_LABEL_ID = '6828a313a24a62461293eabe'
WAFFLE_ARCHIVED_LABEL_ID = '6828a16581fef01d8cee06d3'

CARD_IDS_TO_UPDATE = [
    '68227750678a9a4a1ac6ad51', # 'Dislexia App'
    '68283152a7596efcb6bd4def', # 'Version 2 - better layout'
    '68283178574c71983b84f9a1', # 'HMW keep the data updated'
    '68237ca2940e309643e8d28c', # 'Update Tejj'
    '681e938f0bdbbc96f5b9f4fa', # 'AR Bday Sunday'
    '681e939912d785db77e84528'  # 'Clothes from Grandma'
]

def remove_label_from_card(card_id, label_id):
    url = f"{BASE_URL}/cards/{card_id}/idLabels/{label_id}?{AUTH_PARAMS}"
    try:
        response = requests.delete(url, headers=HEADERS)
        response.raise_for_status()
        print(f"Successfully removed label ID '{label_id}' from card ID '{card_id}'.")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error removing label '{label_id}' from card {card_id}: {e}")
        if response is not None:
            print(f"Response: {response.text}")
        return False

def add_label_to_card(card_id, label_id):
    url = f"{BASE_URL}/cards/{card_id}/idLabels?value={label_id}&{AUTH_PARAMS}"
    try:
        response = requests.post(url, headers=HEADERS) # No params needed in URL if value is in query string
        response.raise_for_status()
        print(f"Successfully added label ID '{label_id}' to card ID '{card_id}'.")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error adding label '{label_id}' to card {card_id}: {e}")
        if response is not None:
            print(f"Response: {response.text}")
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Batch update labels on Trello cards.")
    parser.add_argument("--label_to_remove", default=WAFFLE_SUMMARIZED_LABEL_ID, help="ID of the label to remove.")
    parser.add_argument("--label_to_add", default=WAFFLE_ARCHIVED_LABEL_ID, help="ID of the label to add.")
    parser.add_argument("--card_ids", nargs='+', default=CARD_IDS_TO_UPDATE, help="List of card IDs to update.")

    args = parser.parse_args()

    print(f"Starting batch label update for {len(args.card_ids)} card(s)...")
    print(f"Attempting to REMOVE label: {args.label_to_remove}")
    print(f"Attempting to ADD label: {args.label_to_add}")

    for card_id in args.card_ids:
        print(f"\nProcessing card ID: {card_id}")
        removed_successfully = remove_label_from_card(card_id, args.label_to_remove)
        if removed_successfully: # Only add if removal was successful or if not present initially
            add_label_to_card(card_id, args.label_to_add)
        else:
            # If removing the label failed because it wasn't there, we should still try to add the new one.
            # The remove_label_from_card function prints errors, we check the response in more detail.
            # Let's try to get card details to see if the label_to_remove was actually there.
            # For now, we'll assume if removal fails, it might be because the label isn't present, and try adding.
            print(f"Attempting to add '{args.label_to_add}' to card {card_id} even if removal of '{args.label_to_remove}' seemed to fail (it might not have been there).")
            add_label_to_card(card_id, args.label_to_add)
            
    print("\nBatch label update finished.") 