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

# Specific IDs for the "Develop Trello Voice OS" card and its checklist
CARD_ID = "68289260b63d7f779c91f94c"
CHECKLIST_ID = "682893b96dbe45e369003232" # "Core Script Functionality"

ITEMS_TO_MARK_COMPLETE_BY_NAME = [
    "Attach File to Card Script",
    "Delete Card Script",
    "Advanced Summarization (Questions, Goals, Actions)",
    "Automatic Checklist Creation from AI Actions"
]

ITEMS_TO_DELETE_BY_NAME = [
    "Voice Command Parser (Assistant Logic)", # Should be gone already
    "Define initial set of voice commands", # Should be gone already
    "Mac Shortcut: In progress, file handling issues",
    "Telegram Bot (n8n) for Transcription: Planning phase"
]

NEW_ITEMS_TO_ADD = [
    {"name": "Advanced Summarization (Questions, Goals, Actions)", "pos": "bottom", "checked": False}, # Will be marked complete by name
    {"name": "Automatic Checklist Creation from AI Actions", "pos": "bottom", "checked": False}, # Will be marked complete by name
    {"name": "Mac Shortcut for Transcription: Paused (OS instability)", "pos": "bottom", "checked": False},
    {"name": "Telegram Bot for Transcription: Viable alternative, low priority", "pos": "bottom", "checked": False}
]

def get_checklist_items_details(checklist_id):
    """Gets all items from a specific checklist with their details."""
    url = f"{BASE_URL}/checklists/{checklist_id}/checkItems?{AUTH_PARAMS}"
    try:
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        return response.json() # Returns a list of item objects
    except requests.exceptions.RequestException as e:
        print(f"Error fetching items for checklist {checklist_id}: {e}")
        return None

def update_check_item_state(card_id, check_item_id, state):
    """Updates the state of a specific check item."""
    # Note: Trello API uses idChecklist in path for this, but card_id for context
    url = f"{BASE_URL}/cards/{card_id}/checkItem/{check_item_id}?state={state}&{AUTH_PARAMS}"
    try:
        response = requests.put(url, headers=HEADERS)
        response.raise_for_status()
        print(f"Successfully updated item {check_item_id} to state '{state}'.")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error updating item {check_item_id} on card {card_id}: {e}")
        print(f"Response text: {response.text if response is not None else 'No response'}")
        return False

def add_item_to_checklist(checklist_id, name, pos="bottom", checked=False):
    """Adds an item to a checklist."""
    encoded_name = requests.utils.quote(name)
    checked_str = str(checked).lower()
    url = f"{BASE_URL}/checklists/{checklist_id}/checkItems?name={encoded_name}&pos={pos}&checked={checked_str}&{AUTH_PARAMS}"
    try:
        response = requests.post(url, headers=HEADERS)
        response.raise_for_status()
        print(f"Successfully added item '{name}' to checklist {checklist_id}.")
        return response.json() # Returns the created item
    except requests.exceptions.RequestException as e:
        print(f"Error adding item '{name}' to checklist {checklist_id}: {e}")
        return None

def delete_check_item(checklist_id, item_id):
    """Deletes a specific check item from a checklist."""
    url = f"{BASE_URL}/checklists/{checklist_id}/checkItems/{item_id}?{AUTH_PARAMS}"
    try:
        response = requests.delete(url, headers=HEADERS)
        response.raise_for_status()
        print(f"Successfully deleted item {item_id} from checklist {checklist_id}.")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error deleting item {item_id} from checklist {checklist_id}: {e}")
        return False

if __name__ == "__main__":
    print(f"Updating checklist '{CHECKLIST_ID}' on card '{CARD_ID}'...")
    current_items_details = get_checklist_items_details(CHECKLIST_ID)

    if current_items_details is None:
        print("Could not fetch current checklist items. Aborting.")
        exit()
    
    current_item_names_map = {item['name']: item for item in current_items_details}

    # Delete specified items
    print("\nDeleting specified items...")
    for item_name_to_delete in ITEMS_TO_DELETE_BY_NAME:
        if item_name_to_delete in current_item_names_map:
            item_id_to_delete = current_item_names_map[item_name_to_delete]['id']
            print(f"Found item to delete: '{item_name_to_delete}' (ID: {item_id_to_delete})")
            delete_check_item(CHECKLIST_ID, item_id_to_delete)
        else:
            print(f"Item to delete '{item_name_to_delete}' not found on checklist.")

    # Refresh items after deletion before adding to prevent adding already existing items that were meant to be deleted and re-added
    current_items_details = get_checklist_items_details(CHECKLIST_ID)
    if current_items_details is None:
        print("Could not fetch current checklist items after deletion. Aborting additions.")
        exit()
    current_item_names_after_deletion = [item['name'] for item in current_items_details]

    # Add new items if they don't exist
    print("\nAdding new items...")
    for new_item_data in NEW_ITEMS_TO_ADD:
        item_name = new_item_data["name"]
        if item_name not in current_item_names_after_deletion:
            added_item = add_item_to_checklist(CHECKLIST_ID, item_name, new_item_data["pos"], new_item_data["checked"])
            if added_item:
                # If this new item is also in the list to be marked complete, update its entry in current_item_names_map for the next step
                 current_item_names_map[added_item['name']] = added_item 
        else:
            print(f"Item '{item_name}' already exists. Skipping.")
    
    # Refresh items again after additions before marking complete
    current_items_details = get_checklist_items_details(CHECKLIST_ID)
    if current_items_details is None:
        print("Could not fetch current checklist items after additions. Aborting marking complete.")
        exit()
    current_item_names_map = {item['name']: item for item in current_items_details}

    # Mark specified items as complete
    print("\nMarking specified items as complete...")
    for item_name_to_complete in ITEMS_TO_MARK_COMPLETE_BY_NAME:
        if item_name_to_complete in current_item_names_map:
            item_detail = current_item_names_map[item_name_to_complete]
            if item_detail['state'] != 'complete':
                update_check_item_state(CARD_ID, item_detail['id'], 'complete')
            else:
                print(f"Item '{item_name_to_complete}' is already complete.")
        else:
            print(f"Item to complete '{item_name_to_complete}' not found on checklist.")
     
    print("\nChecklist update process finished.")

    # The following was for debug, removing for final version
    # print(f"Current items on checklist {CHECKLIST_ID}:")
    # for item in current_items_details:
    #     print(f"  - {item['name']} (ID: {item['id']}, Checked: {item['state']})")
    # exit() # Exit after printing 