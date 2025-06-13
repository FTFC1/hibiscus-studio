import requests
import os
import json
from dotenv import load_dotenv
from openai import OpenAI # Use OpenAI library, compatible with OpenRouter
# import google.generativeai as genai # Remove Google GenAI import

load_dotenv()

# Trello API Credentials and IDs
TRELLO_API_KEY = os.environ.get('TRELLO_API_KEY')
TRELLO_TOKEN = os.environ.get('TRELLO_TOKEN')
BOARD_ID = '67d1eaa9eed6766b5e421bd5'
WAFFLE_ARCHIVED_LABEL_ID = '6828a16581fef01d8cee06d3'
WAFFLE_SUMMARIZED_LABEL_ID = '6828a313a24a62461293eabe'

# OpenRouter API Key
OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY')

if not TRELLO_API_KEY or not TRELLO_TOKEN or not OPENROUTER_API_KEY:
    print("Error: TRELLO_API_KEY, TRELLO_TOKEN, and OPENROUTER_API_KEY must be set in your .env file.")
    exit()

# Configure OpenAI client for OpenRouter
client = OpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)

headers = {"Accept": "application/json"}
base_url = "https://api.trello.com/1"
trello_auth_params = f"key={TRELLO_API_KEY}&token={TRELLO_TOKEN}"

def get_cards_on_board_with_label(board_id, label_id):
    url = f"{base_url}/boards/{board_id}/cards?{trello_auth_params}&fields=id,name,idLabels,desc"
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        all_cards = response.json()
        return [card for card in all_cards if label_id in card.get('idLabels', [])]
    except requests.exceptions.RequestException as e:
        print(f"Error fetching cards from board {board_id}: {e}")
        return []

def get_card_attachments(card_id):
    url = f"{base_url}/cards/{card_id}/attachments?{trello_auth_params}&fields=id,name,url,mimeType"
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching attachments for card {card_id}: {e}")
        return []

def download_attachment_text(attachment_url):
    try:
        download_headers = {
            'Authorization': f'OAuth oauth_consumer_key="{TRELLO_API_KEY}", oauth_token="{TRELLO_TOKEN}"'
        }
        response = requests.get(attachment_url, headers=download_headers)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Error downloading attachment content from {attachment_url}: {e}")
        return None

def summarize_text_with_openrouter(text_to_summarize, model_name="openai/gpt-4o"):
    if not text_to_summarize.strip():
        print("No text provided to summarize.")
        return {"full_summary": "No content to summarize.", "action_items": []}
    try:
        # Using the OpenAI-compatible chat completions endpoint
        system_prompt = """You are a helpful assistant. Summarize the following text.
Structure your response with these exact headings:
### Overall Summary
(Provide a concise bullet-point summary of the key topics and discussion points)

### Key Questions/Ponderings
(Identify any underlying questions, open loops, or areas the user is contemplating)

### Suggested Goal(s)
(Based on the text, suggest the primary goal or objective the user might be aiming for. If multiple, list them.)

### Actionable Tasks
(List specific, actionable tasks derived from the text. If no direct tasks are mentioned, state "None identified". Each task should be on a new line.)
"""
        user_prompt = f"Please process the following text according to the structured format described in the system prompt:\\n\\n---\\n{text_to_summarize}\\n---"
        
        completion = client.chat.completions.create(
            model=model_name, 
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        full_response_text = completion.choices[0].message.content.strip()
        print(f"Successfully received structured response from OpenRouter using model {model_name}.")
        
        # Parse action items
        action_items = []
        in_actions_section = False
        for line in full_response_text.split('\\n'):
            if line.strip().lower() == "### actionable tasks":
                in_actions_section = True
                continue
            if line.strip().lower().startswith("###"): # Reached another section
                in_actions_section = False
                continue
            if in_actions_section and line.strip() and line.strip().lower() != "none identified":
                # Remove potential leading characters like "-", "*", or numbering like "1. "
                cleaned_line = line.strip()
                if cleaned_line.startswith(("- ", "* ")):
                    cleaned_line = cleaned_line[2:]
                elif len(cleaned_line) > 2 and cleaned_line[1] == '.' and cleaned_line[0].isdigit(): # e.g. "1. Task"
                     cleaned_line = cleaned_line[cleaned_line.find('.')+1:].strip()
                action_items.append(cleaned_line.strip())
                
        return {"full_summary": full_response_text, "action_items": action_items}
    except Exception as e:
        print(f"Error summarizing text with OpenRouter (model: {model_name}): {e}")
        return {"full_summary": "Error during summarization.", "action_items": []}

def get_or_create_checklist(card_id, checklist_name):
    """Gets a checklist ID by name or creates it if it doesn't exist."""
    url_get = f"{base_url}/cards/{card_id}/checklists?{trello_auth_params}"
    try:
        response = requests.get(url_get, headers=headers)
        response.raise_for_status()
        checklists = response.json()
        for cl in checklists:
            if cl['name'] == checklist_name:
                print(f"Found existing checklist '{checklist_name}' (ID: {cl['id']}) on card {card_id}.")
                return cl['id']
        
        # If not found, create it
        url_create = f"{base_url}/checklists?idCard={card_id}&name={checklist_name}&{trello_auth_params}"
        response_create = requests.post(url_create, headers=headers)
        response_create.raise_for_status()
        new_checklist = response_create.json()
        print(f"Created new checklist '{checklist_name}' (ID: {new_checklist['id']}) on card {card_id}.")
        return new_checklist['id']
    except requests.exceptions.RequestException as e:
        print(f"Error getting or creating checklist '{checklist_name}' on card {card_id}: {e}")
        return None

def get_checklist_items(checklist_id):
    """Gets all items from a specific checklist."""
    url = f"{base_url}/checklists/{checklist_id}/checkItems?{trello_auth_params}"
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return [item['name'] for item in response.json()]
    except requests.exceptions.RequestException as e:
        print(f"Error fetching items for checklist {checklist_id}: {e}")
        return None


def add_item_to_checklist(checklist_id, name, pos="bottom", checked=False):
    """Adds an item to a checklist."""
    encoded_name = requests.utils.quote(name)
    checked_str = str(checked).lower()
    url = f"{base_url}/checklists/{checklist_id}/checkItems?name={encoded_name}&pos={pos}&checked={checked_str}&{trello_auth_params}"
    try:
        response = requests.post(url, headers=headers)
        response.raise_for_status()
        print(f"Successfully added item '{name}' to checklist {checklist_id}.")
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error adding item '{name}' to checklist {checklist_id}: {e}")
        return None

def update_card_description(card_id, new_description):
    url = f"{base_url}/cards/{card_id}?{trello_auth_params}"
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
    url = f"{base_url}/cards/{card_id}/idLabels/{label_id}?{trello_auth_params}"
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
    query_params = {'key': TRELLO_API_KEY, 'token': TRELLO_TOKEN, 'value': label_id}
    try:
        response = requests.post(url, headers=headers, params=query_params)
        response.raise_for_status()
        print(f"Successfully added label ID '{label_id}' to card ID '{card_id}'.")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error adding label '{label_id}' to card {card_id}: {e}")
        return False

if __name__ == "__main__":
    print(f"Starting waffle summarization for board ID '{BOARD_ID}' using OpenRouter...")
    cards_to_summarize = get_cards_on_board_with_label(BOARD_ID, WAFFLE_ARCHIVED_LABEL_ID)

    if not cards_to_summarize:
        print("No cards found with the 'Waffle Archived' label. Nothing to do.")
    else:
        print(f"Found {len(cards_to_summarize)} card(s) to summarize.")

    for card in cards_to_summarize:
        card_id = card['id']
        card_name = card['name']
        print(f"\nProcessing card: '{card_name}' (ID: {card_id})")

        attachments = get_card_attachments(card_id)
        waffle_texts = []
        for att in attachments:
            if att['name'].startswith("waffle_archive_") and att['name'].endswith(".txt") and att.get('url'):
                print(f"Found waffle attachment: {att['name']}. Downloading...")
                text_content = download_attachment_text(att['url'])
                if text_content:
                    waffle_texts.append(text_content)
            
        if not waffle_texts:
            print(f"No relevant 'waffle_archive_*.txt' attachments found on card '{card_name}'. Skipping.")
            continue
        
        combined_waffle_text = "\n\n---\n\n".join(waffle_texts)
        print(f"Combined text from {len(waffle_texts)} attachment(s) for summarization.")

        summary_data = summarize_text_with_openrouter(combined_waffle_text)
        summary_text = summary_data["full_summary"]
        action_items = summary_data["action_items"]

        if summary_text and summary_text not in ["Error during summarization.", "No content to summarize."]:
            print("Updating card description with summary...")
            if update_card_description(card_id, summary_text):
                print("Swapping labels...")
                if remove_label_from_card(card_id, WAFFLE_ARCHIVED_LABEL_ID):
                    add_label_to_card(card_id, WAFFLE_SUMMARIZED_LABEL_ID)
                else:
                    print(f"Could not remove 'Waffle Archived' label from '{card_name}'. Summarized label not added.")
                
                if action_items:
                    print(f"Found {len(action_items)} action item(s) to add to checklist.")
                    checklist_id = get_or_create_checklist(card_id, "AI Suggested Actions")
                    if checklist_id:
                        existing_checklist_items = get_checklist_items(checklist_id)
                        if existing_checklist_items is None: # Error fetching items
                             print(f"Could not fetch existing items for checklist {checklist_id}. Skipping adding new items to avoid duplicates.")
                        else:
                            for item_name in action_items:
                                if item_name not in existing_checklist_items:
                                    add_item_to_checklist(checklist_id, item_name)
                                else:
                                    print(f"Action item '{item_name}' already exists in checklist. Skipping.")
                    else:
                        print(f"Could not get or create checklist for card '{card_name}'. Action items not added.")

            else:
                print(f"Could not update description for '{card_name}' with summary. Labels not changed.")
        else:
            print(f"Failed to get a valid summary for '{card_name}'. Description and labels not changed.")
            
    print("\nWaffle summarization finished.") 