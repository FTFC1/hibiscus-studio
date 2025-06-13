import requests
import json
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Credentials and Board ID
API_KEY = os.environ.get('TRELLO_API_KEY')
TOKEN = os.environ.get('TRELLO_TOKEN')
# API_KEY = "bf371933fcd49ba099774ba087050e38" # Old
# TOKEN = "ATTA3f27a64d09d2ceef38759b7f1941ca024bc84c274224f592b84fe11c701398898D4A4EE9" # Old
BOARD_ID = "67d1eaa9eed6766b5e421bd5"  # Projects board

if not API_KEY or not TOKEN:
    print("Error: TRELLO_API_KEY and TRELLO_TOKEN must be set in your .env file.")
    exit()

headers = {"Accept": "application/json"}
base_url = "https://api.trello.com/1"
auth_params = f"key={API_KEY}&token={TOKEN}"

response = None # Initialize response for broader scope

# Helper function to format date strings
def format_date(date_str):
    if not date_str:
        return "No date"
    try:
        # Trello dates are UTC, usually end with 'Z'
        dt_obj = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        return dt_obj.strftime("%Y-%m-%d %H:%M:%S %Z")
    except ValueError:
        return date_str # Return original if parsing fails

# Get board name
board_name_url = f"{base_url}/boards/{BOARD_ID}?{auth_params}"
board_name = "Unknown Board"
try:
    board_response = requests.get(board_name_url, headers=headers)
    board_response.raise_for_status()
    board_data = board_response.json()
    board_name = board_data.get('name', board_name)
except requests.exceptions.RequestException as e:
    print(f"Error fetching board details: {e}")

print(f"--- Board: {board_name} (ID: {BOARD_ID}) ---")

# Get all members of the board for easier lookup
board_members = {}
try:
    members_url = f"{base_url}/boards/{BOARD_ID}/members?{auth_params}"
    members_response = requests.get(members_url, headers=headers)
    members_response.raise_for_status()
    for member in members_response.json():
        board_members[member['id']] = member.get('fullName', member.get('username', 'Unknown Member'))
except requests.exceptions.RequestException as e:
    print(f"Error fetching board members: {e}")

# Get lists on the board
lists_url = f"{base_url}/boards/{BOARD_ID}/lists?{auth_params}&cards=open&card_fields=name,desc,id,due,labels,dateLastActivity,idMembers,idAttachmentCover"

try:
    response = requests.get(lists_url, headers=headers)
    response.raise_for_status()
    lists_data = response.json()

    if not lists_data:
        print("No lists found on this board.")

    for trello_list in lists_data:
        list_name = trello_list.get('name', 'Unnamed List')
        list_id = trello_list.get('id')
        print(f"\n  -- List: {list_name} (ID: {list_id}) --")
        
        cards_in_list = trello_list.get('cards', [])
        if not cards_in_list:
            print("    No cards in this list.")
        else:
            for card_summary in cards_in_list:
                card_id = card_summary.get('id')
                card_name = card_summary.get('name', 'Unnamed Card')
                card_desc = card_summary.get('desc', 'No description.')
                card_due = format_date(card_summary.get('due'))
                card_labels = [label.get('name') for label in card_summary.get('labels', []) if label.get('name')]
                card_last_activity = format_date(card_summary.get('dateLastActivity'))
                card_member_ids = card_summary.get('idMembers', [])
                card_members_names = [board_members.get(m_id, 'Unknown') for m_id in card_member_ids]

                print(f"\n    - Card: {card_name} (ID: {card_id})")
                print(f"      Description: {card_desc.strip() if card_desc else 'No description.'}")
                print(f"      Due: {card_due}")
                print(f"      Last Activity: {card_last_activity}")
                if card_labels:
                    print(f"      Labels: {', '.join(card_labels)}")
                if card_members_names:
                    print(f"      Members: {', '.join(card_members_names)}")

                # Fetch Attachments for this card
                attachments_url = f"{base_url}/cards/{card_id}/attachments?{auth_params}"
                try:
                    attachments_response = requests.get(attachments_url, headers=headers)
                    attachments_response.raise_for_status()
                    attachments = attachments_response.json()
                    if attachments:
                        print("      Attachments:")
                        for att in attachments:
                            print(f"        - {att.get('name')} (Type: {att.get('mimeType', 'link')}, Uploaded: {format_date(att.get('date'))}, URL: {att.get('url')})")
                except requests.exceptions.RequestException as e_att:
                    print(f"        Error fetching attachments: {e_att}")

                # Fetch Comments (Actions) for this card
                comments_url = f"{base_url}/cards/{card_id}/actions?{auth_params}&filter=commentCard"
                try:
                    comments_response = requests.get(comments_url, headers=headers)
                    comments_response.raise_for_status()
                    comments_actions = comments_response.json()
                    if comments_actions:
                        print("      Comments:")
                        for action in comments_actions:
                            comment_text = action.get('data', {}).get('text', 'Empty comment')
                            comment_author = action.get('memberCreator', {}).get('fullName', 'Unknown author')
                            comment_date = format_date(action.get('date'))
                            print(f"        - \"{comment_text}\" (By: {comment_author} on {comment_date})")
                except requests.exceptions.RequestException as e_com:
                    print(f"        Error fetching comments: {e_com}")

                # Fetch Checklists for this card
                checklists_url = f"{base_url}/cards/{card_id}/checklists?{auth_params}"
                try:
                    checklists_response = requests.get(checklists_url, headers=headers)
                    checklists_response.raise_for_status()
                    checklists = checklists_response.json()
                    if checklists:
                        print("      Checklists:")
                        for cl in checklists:
                            print(f"        - Checklist: {cl.get('name', 'Unnamed Checklist')}")
                            for item in cl.get('checkItems', []):
                                status = "Completed" if item.get('state') == 'complete' else "Incomplete"
                                print(f"          - [{status}] {item.get('name', 'Unnamed item')}")
                except requests.exceptions.RequestException as e_chk:
                    print(f"        Error fetching checklists: {e_chk}")
                print("      ----")

except requests.exceptions.RequestException as e:
    print(f"Error fetching lists and cards: {e}")
    if response is not None and hasattr(response, 'content'):
        print(f"Response content: {response.content.decode(errors='ignore')}")
except json.JSONDecodeError as e:
    print(f"JSON decode error: {e}")
    if response is not None and hasattr(response, 'text'):
        print(f"Response content: {response.text}")
except Exception as e:
    print(f"An unexpected error occurred: {e}") 