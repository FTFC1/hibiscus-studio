#!/usr/bin/env python3
import json
import sys

def analyze_retailtm_cards():
    try:
        with open('/tmp/retailtm_cards_clean.json', 'r') as f:
            cards = json.load(f)
        
        print("🔍 RETAILTM ATTACHMENT ANALYSIS:")
        print("")
        print(f"📋 Total cards: {len(cards)}")
        print("")
        
        cards_with_attachments = 0
        total_attachments = 0
        
        for i, card in enumerate(cards, 1):
            name = card.get('name', 'Unknown')
            attachments = card.get('attachments', [])
            attach_count = len(attachments)
            total_attachments += attach_count
            
            if attach_count > 0:
                cards_with_attachments += 1
            
            print(f"{i}. {name}")
            if attach_count > 0:
                print(f"   📎 {attach_count} attachment(s):")
                for att in attachments:
                    att_name = att.get('name', 'Unknown')
                    att_url = att.get('url', '')
                    if 'trello.com' in att_url:
                        print(f"      🔗 {att_name} (Trello link)")
                    elif att_url.startswith('http'):
                        print(f"      🌐 {att_name} (External link)")
                    else:
                        print(f"      📄 {att_name}")
            else:
                print("   📎 No attachments")
            print("")
        
        print("📊 SUMMARY:")
        print(f"• {cards_with_attachments}/{len(cards)} cards have attachments")
        print(f"• {total_attachments} total attachments")
        
    except Exception as e:
        print(f"Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(analyze_retailtm_cards()) 