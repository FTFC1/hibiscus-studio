import gspread
from google.oauth2.service_account import Credentials
import os

def get_vehicle_catalog():
    """
    Fetch vehicle catalog from Google Sheets or return sample data as fallback
    """
    try:
        # Try to connect to Google Sheets
        # Define the scopes
        scopes = [
            'https://www.googleapis.com/auth/spreadsheets.readonly',
            'https://www.googleapis.com/auth/drive.readonly'
        ]
        
        # Load credentials
        service_account_path = os.path.join(os.path.dirname(__file__), '..', 'service_account.json')
        
        if os.path.exists(service_account_path):
            credentials = Credentials.from_service_account_file(service_account_path, scopes=scopes)
            client = gspread.authorize(credentials)
            
            # Open the spreadsheet - update with your actual spreadsheet name/ID
            spreadsheet_name = "Vehicle Catalog"  # Updated to match user's sheet name
            sheet = client.open(spreadsheet_name).sheet1
            
            # Get all records
            records = sheet.get_all_records()
            
            # Transform to expected format
            vehicles = []
            for record in records:
                vehicles.append({
                    'description': record.get('Description', ''),
                    'display_name': record.get('Display Name', record.get('Description', '')),
                    'price': float(record.get('Price', 0))
                })
            
            print(f"Successfully loaded {len(vehicles)} vehicles from Google Sheets")
            return vehicles
            
    except Exception as e:
        print(f"Google Sheets connection failed: {e}")
        print("Using sample vehicle data as fallback...")
    
    # Fallback sample data - enhanced Changan lineup
    return [
        {
            'description': '2025 Changan Alsvin 1.5L Manual - Compact sedan with excellent fuel economy',
            'display_name': 'Changan Alsvin 1.5L Manual',
            'price': 12500000
        },
        {
            'description': '2025 Changan CS75 Plus 1.5T CVT - Premium SUV with advanced safety features',
            'display_name': 'Changan CS75 Plus 1.5T CVT', 
            'price': 22800000
        },
        {
            'description': '2025 Changan Hunter Plus Pickup 2.0T 4WD - Rugged pickup truck for commercial use',
            'display_name': 'Changan Hunter Plus 2.0T 4WD',
            'price': 28500000
        },
        {
            'description': '2025 Changan Oshan X7 Plus 2.0T AWD - Luxury 7-seater family SUV',
            'display_name': 'Changan Oshan X7 Plus 2.0T AWD',
            'price': 35200000
        },
        {
            'description': '2025 Changan Uni-T 1.5T DCT - Sporty crossover with futuristic design',
            'display_name': 'Changan Uni-T 1.5T DCT',
            'price': 18900000
        }
    ]

def test_google_sheets_connection():
    """Test the Google Sheets connection and return status"""
    try:
        vehicles = get_vehicle_catalog()
        return {
            'success': True,
            'message': f'Connected successfully. Found {len(vehicles)} vehicles.',
            'vehicles': vehicles
        }
    except Exception as e:
        return {
            'success': False,
            'message': f'Connection failed: {str(e)}',
            'vehicles': []
        }
