import requests
import json

# Trello API credentials
API_KEY = 'bf371933fcd49ba099774ba087050e38'
TOKEN = 'ATTA3f27a64d09d2ceef38759b7f1941ca024bc84c274224f592b84fe11c701398898D4A4EE9'

BIG_DUMP_CARD_ID = '68331d0fd76353aebe3e6c44'

def get_card_attachments(card_id):
    """Get all attachments on a card"""
    url = f"https://api.trello.com/1/cards/{card_id}/attachments"
    query = {
        'key': API_KEY,
        'token': TOKEN
    }
    response = requests.get(url, params=query)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"❌ Error getting attachments: {response.status_code}")
        return []

def delete_attachment(card_id, attachment_id):
    """Delete a specific attachment"""
    url = f"https://api.trello.com/1/cards/{card_id}/attachments/{attachment_id}"
    query = {
        'key': API_KEY,
        'token': TOKEN
    }
    response = requests.delete(url, params=query)
    return response.status_code == 200

def clean_big_dump_card():
    """Clean all attachments from Big Dump card while preserving description"""
    print("🧹 Cleaning Big Dump card...")
    
    # Get current attachments
    attachments = get_card_attachments(BIG_DUMP_CARD_ID)
    print(f"📎 Found {len(attachments)} attachments to clean")
    
    # Delete each attachment
    deleted_count = 0
    for attachment in attachments:
        attachment_id = attachment['id']
        attachment_name = attachment['name']
        
        if delete_attachment(BIG_DUMP_CARD_ID, attachment_id):
            print(f"✅ Deleted: {attachment_name}")
            deleted_count += 1
        else:
            print(f"❌ Failed to delete: {attachment_name}")
    
    print(f"\n🎯 Successfully cleaned {deleted_count}/{len(attachments)} attachments")
    print("📝 Card description preserved for transcript re-processing")
    return deleted_count

if __name__ == "__main__":
    clean_big_dump_card() 