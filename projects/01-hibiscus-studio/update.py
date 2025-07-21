#!/usr/bin/env python3
"""
Hibiscus Studio Content Updater
Simple script to update pricing and content across all platforms
"""

import os
import json
from scripts.generate import ContentGenerator

def main():
    print("🌺 Hibiscus Studio Content Updater")
    print("=" * 50)
    
    # Load current data
    data_file = 'data/content.json'
    with open(data_file, 'r') as f:
        data = json.load(f)
    
    print("\n🔹 Current Pricing:")
    print(f"Event Hire: £{data['pricing']['event_hire']['price']}/hour")
    print(f"Workshop Hire: £{data['pricing']['workshop_hire']['price']}/hour")
    print(f"Content Creation: £{data['pricing']['content_creation']['price']}/hour")
    
    print("\n🔹 Options:")
    print("1. Update pricing")
    print("2. Regenerate all content (PDF, Website, Acuity)")
    print("3. View current FAQ count:", len(data['faqs']))
    print("4. Exit")
    
    choice = input("\nEnter your choice (1-4): ").strip()
    
    if choice == "1":
        update_pricing(data, data_file)
    elif choice == "2":
        regenerate_content()
    elif choice == "3":
        show_faqs(data)
    elif choice == "4":
        print("👋 Goodbye!")
        return
    else:
        print("❌ Invalid choice")

def update_pricing(data, data_file):
    print("\n🔹 Update Pricing")
    print("Current base price: £", data['pricing']['event_hire']['price'])
    
    try:
        new_price = float(input("Enter new base price (£): "))
        
        # Update all pricing
        for service in ['event_hire', 'workshop_hire', 'content_creation']:
            data['pricing'][service]['price'] = new_price
            # Update options based on multipliers
            for option in data['pricing'][service]['options']:
                if option['duration'] == '1 hour':
                    option['price'] = new_price
                elif option['duration'] == '4 hours':
                    option['price'] = new_price * 4
                elif option['duration'] == '6 hours':
                    option['price'] = new_price * 6
                elif option['duration'] == '8 hours':
                    option['price'] = new_price * 8
                elif option['duration'] == 'Half Day':
                    option['price'] = new_price * 5
                elif option['duration'] == 'Full Day':
                    option['price'] = new_price * 10
        
        # Save updated data
        with open(data_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"✅ Pricing updated to £{new_price}")
        
        # Ask if they want to regenerate content
        regen = input("Regenerate all content now? (y/n): ").strip().lower()
        if regen == 'y':
            regenerate_content()
    
    except ValueError:
        print("❌ Invalid price entered")

def regenerate_content():
    print("\n🔹 Regenerating Content...")
    generator = ContentGenerator()
    generator.run_all()
    
    print("\n🎯 Next Steps:")
    print("1. Check the PDF in the 'output' folder")
    print("2. Review website changes")
    print("3. Copy content from 'output/acuity-content.txt' into Acuity")

def show_faqs(data):
    print("\n🔹 Current FAQs:")
    for i, faq in enumerate(data['faqs'], 1):
        print(f"{i}. {faq['question']}")

if __name__ == "__main__":
    main() 