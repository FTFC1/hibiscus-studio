import requests
import os
from dotenv import load_dotenv
import json

load_dotenv() # Load variables from .env file

# Retrieve API credentials from environment variables
API_KEY = os.environ.get('TRELLO_API_KEY')
TOKEN = os.environ.get('TRELLO_TOKEN')
BOARD_ID = '67d1eaa9eed6766b5e421bd5'  # Your "Projects" board ID

LABELS_TO_SETUP = [
    {"name": "Waffle Content", "color": "yellow"},
    {"name": "Waffle Archived", "color": "blue"},
    {"name": "Waffle Summarized", "color": "green"}
]

if not API_KEY or not TOKEN:
    print("Error: TRELLO_API_KEY and TRELLO_TOKEN must be set in your .env file.")
    exit()

headers = {"Accept": "application/json"}
base_url = "https://api.trello.com/1"
auth_params = f"key={API_KEY}&token={TOKEN}"

def get_or_create_label(board_id, label_name, label_color):
    labels_url = f"{base_url}/boards/{board_id}/labels?{auth_params}"
    response_content = None
    try:
        response = requests.get(labels_url, headers=headers)
        response_content = response.content
        response.raise_for_status()
        labels = response.json()
        for label in labels:
            if label['name'] == label_name:
                print(f"Label '{label_name}' already exists with ID: {label['id']} and color: {label['color']}.")
                # Optional: Check if color matches and update if needed, for now, we just report.
                if label['color'] != label_color:
                    print(f"Note: Existing label '{label_name}' has color '{label['color']}', desired color was '{label_color}'.")
                return label['id']
        
        print(f"Label '{label_name}' not found. Creating it with color '{label_color}'...")
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
        print(f"Successfully created label '{new_label['name']}' with ID: {new_label['id']} and color: {new_label['color']}.")
        return new_label['id']

    except requests.exceptions.RequestException as e:
        print(f"Error finding or creating label '{label_name}': {e}")
        if response_content: print(f"Response: {response_content.decode(errors='ignore')}")
        return None
    except json.JSONDecodeError as e:
        print(f"JSON decode error with label '{label_name}': {e}")
        if response_content: print(f"Response: {response_content.decode(errors='ignore')}")
        return None

if __name__ == "__main__":
    print(f"Setting up labels for board ID '{BOARD_ID}'...")
    all_successful = True
    for label_info in LABELS_TO_SETUP:
        label_id = get_or_create_label(BOARD_ID, label_info["name"], label_info["color"])
        if not label_id:
            all_successful = False
            print(f"Failed to setup label: {label_info['name']}")
    
    if all_successful:
        print("All specified labels checked/created successfully.")
    else:
        print("Some labels could not be set up. Please check errors above.") 