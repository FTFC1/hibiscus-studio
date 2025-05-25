import requests
import os

# Hardcoded API credentials and Card ID for this test
API_KEY = 'bf371933fcd49ba099774ba087050e38'
TOKEN = 'ATTA3f27a64d09d2ceef38759b7f1941ca024bc84c274224f592b84fe11c701398898D4A4EE9'
CARD_ID = '68289260b63d7f779c91f94c'  # ID of "Develop Trello Voice OS" card
FILE_TO_ATTACH = 'test_attachment.txt'
ATTACHMENT_NAME = 'Test Document from Script' # Optional: name for the attachment in Trello

def attach_file_to_card(card_id, file_path, attachment_name, api_key, token):
    """Attaches a local file to the specified Trello card."""
    url = f"https://api.trello.com/1/cards/{card_id}/attachments"
    
    query = {
        'key': api_key,
        'token': token,
        'name': attachment_name
    }
    
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return False

    try:
        with open(file_path, 'rb') as file_to_upload:
            files = {
                'file': (os.path.basename(file_path), file_to_upload)
            }
            response = requests.post(url, params=query, files=files)
            response.raise_for_status()  # Raises an exception for 4XX/5XX errors
        print(f"Successfully attached '{os.path.basename(file_path)}' to card ID: {card_id} as '{attachment_name}'")
        # print(f"Response: {response.json()}") # Optional: print full response
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error attaching file to card {card_id}: {e}")
        # Check if response object exists before trying to access its attributes
        if 'response' in locals() and response is not None:
            print(f"Response status: {response.status_code}")
            print(f"Response content: {response.text}")
        else:
            print("No response object available for error details.")
        return False
    except FileNotFoundError:
        # This is already caught by os.path.exists, but good for robustness
        print(f"Error: The file '{file_path}' was not found.")
        return False
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return False

if __name__ == "__main__":
    if not all([API_KEY, TOKEN, CARD_ID, FILE_TO_ATTACH]):
        print("Error: API_KEY, TOKEN, CARD_ID, and FILE_TO_ATTACH must be set directly in the script.")
        exit()

    print(f"Attempting to attach file '{FILE_TO_ATTACH}' to card ID: {CARD_ID} with name '{ATTACHMENT_NAME}'...")
    success = attach_file_to_card(CARD_ID, FILE_TO_ATTACH, ATTACHMENT_NAME, API_KEY, TOKEN)
    if success:
        print("Attachment process completed successfully.")
    else:
        print("Attachment process failed.") 