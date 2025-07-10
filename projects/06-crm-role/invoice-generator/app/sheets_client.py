import gspread
from google.oauth2.service_account import Credentials

# --- Google Sheets Setup ---
# Assumes 'service_account.json' is in the 'invoice-generator' directory.
# The Google Sheet should be shared with the service account's email.

SCOPE = ['https://www.googleapis.com/auth/spreadsheets']
# Path is relative to where the app is run from (invoice-generator directory)
SERVICE_ACCOUNT_FILE = 'service_account.json'
# This should be the name of your Google Sheet
SHEET_NAME = 'Vehicle Catalog'

def get_sample_catalog():
    """Fallback sample vehicle catalog data"""
    return [
        {
            'display_name': 'Changan Alsvin - 1.5L - Standard',
            'description': 'Changan Alsvin 1.5L Manual Transmission',
            'price': 15000000.00
        },
        {
            'display_name': 'Changan CS75 - 2.0L - Luxury',
            'description': 'Changan CS75 2.0L Turbo Luxury Package',
            'price': 28000000.00
        },
        {
            'display_name': 'Changan Hunter - 2.4L - Standard',
            'description': 'Changan Hunter 2.4L Pickup Truck',
            'price': 32000000.00
        },
        {
            'display_name': 'Changan Oshan X7 - 1.5L - Plus',
            'description': 'Changan Oshan X7 1.5L Turbo Plus',
            'price': 24000000.00
        },
        {
            'display_name': 'Changan Uni-T - 1.5L - Smart',
            'description': 'Changan Uni-T 1.5L Turbo Smart Package',
            'price': 26000000.00
        }
    ]

def get_vehicle_catalog():
    """Fetches and parses the vehicle catalog from the Google Sheet."""
    print(f"Attempting to connect to Google Sheet: '{SHEET_NAME}'")
    try:
        creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPE)
        client = gspread.authorize(creds)

        sheet = client.open(SHEET_NAME).sheet1
        records = sheet.get_all_records()

        print(f"Successfully fetched {len(records)} records from the sheet.")

        processed_catalog = []
        for record in records:
            # Create a display name from brand, model, and trim
            display_parts = [
                record.get('brand'),
                record.get('model'),
                record.get('trim')
            ]
            display_name = ' - '.join(filter(None, display_parts))

            # Get the price, cleaning it up
            price_str = record.get('price - ex VAT', '0')
            price = 0.0
            if isinstance(price_str, str):
                try:
                    price = float(price_str.replace(',', ''))
                except ValueError:
                    price = 0.0
            elif isinstance(price_str, (int, float)):
                price = float(price_str)

            processed_catalog.append({
                'display_name': display_name,
                'description': record.get('item description', display_name), # Fallback to display_name
                'price': price
            })

        return processed_catalog
    except FileNotFoundError:
        print(f"ERROR: Service account file not found at '{SERVICE_ACCOUNT_FILE}'. Using sample data.")
        return get_sample_catalog()
    except gspread.exceptions.SpreadsheetNotFound:
        print(f"ERROR: Google Sheet named '{SHEET_NAME}' not found. Using sample data.")
        return get_sample_catalog()
    except Exception as e:
        print(f"Google Sheets error: {e}")
        print("Using sample data as fallback.")
        return get_sample_catalog()
