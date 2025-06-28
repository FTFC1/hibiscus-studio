import pandas as pd
import re
from datetime import datetime
from thefuzz import fuzz

# --- Constants and Configuration ---

# Load product list once and prepare for matching
PRODUCT_LIST_PATH = 'Files/Product List - Sheet1.csv'
try:
    PRODUCT_LIST = pd.read_csv(PRODUCT_LIST_PATH)
except FileNotFoundError:
    print(f"FATAL: Product list not found at {PRODUCT_LIST_PATH}")
    # In a real app, you might fall back to a default or raise an exception
    PRODUCT_LIST = pd.DataFrame(columns=['BRAND', 'MODEL', 'TRIM'])


# --- Normalization Helpers ---

NORMALISE_REGEX = re.compile(r'[^A-Z0-9\s]')

def _norm(text: str) -> str:
    """Normalises text by making it uppercase and removing special chars except spaces."""
    return NORMALISE_REGEX.sub('', str(text).upper()).strip() if text else ''

# Build a more efficient, normalised model list for matching
NORMALISED_MODEL_LIST = []
for _, row in PRODUCT_LIST.iterrows():
    brand = _norm(row['BRAND'])
    model = _norm(row['MODEL'])
    trim = _norm(row['TRIM']) if pd.notna(row['TRIM']) else ''
    
    key = f"{model} {trim}".strip()

    full_name = f"{row['BRAND'].strip()} {row['MODEL'].strip()}"
    if pd.notna(row['TRIM']):
        full_name += f" {row['TRIM'].strip()}"
    
    NORMALISED_MODEL_LIST.append({
        'brand': brand,
        'key': key,
        'words': set(key.split()),
        'full_name': full_name
    })

# --- Core Data Cleaning and Transformation Functions ---

def determine_brand_from_vin(vin):
    """Determines vehicle brand from VIN prefix."""
    if pd.isna(vin) or not isinstance(vin, str):
        return 'Unknown'
    vin = vin.strip().upper()
    if any(vin.startswith(p) for p in ['LS5', 'LS4', 'LDC', 'LGX', 'LFV']): return 'Changan'
    if any(vin.startswith(p) for p in ['WMZ', 'LYV', 'WMA', 'LSV', 'LSG', 'LWV']): return 'Maxus'
    if any(vin.startswith(p) for p in ['L6T', 'LB3', 'LGH']): return 'Geely'
    return 'Unknown'

def determine_brand_from_description(description):
    """Determines vehicle brand from keywords in the item description."""
    if not description: return 'Unknown'
    desc = str(description).upper()
    if 'MAXUS' in desc or 'MAX US' in desc: return 'Maxus'
    if 'GWM' in desc or 'GREAT WALL' in desc: return 'GWM'
    if 'CHANGAN' in desc or 'CHANG AN' in desc: return 'Changan'
    if 'GEELY' in desc: return 'Geely'
    if 'HYUNDAI' in desc or 'FORKLIFT' in desc: return 'Hyundai'
    if 'ZNA' in desc: return 'ZNA'
    return 'Unknown'

def get_clean_model_name(description, brand):
    """
    Finds the best matching clean model name using fuzzy string matching.
    """
    if not all(isinstance(i, str) for i in [description, brand]):
        return description

    norm_desc = _norm(description)
    norm_brand = _norm(brand)

    brand_models = [m for m in NORMALISED_MODEL_LIST if m['brand'] == norm_brand]

    if not brand_models:
        return description

    # Use thefuzz to find the best match. token_set_ratio is robust against
    # extra words and different word orders.
    best_match = max(
        brand_models,
        key=lambda model: (fuzz.token_set_ratio(norm_desc, model['key']), -len(model['key']))
    )

    return best_match['full_name']

def standardize_columns(df):
    """Renames DataFrame columns to a standard format using a search map."""
    COLUMN_SEARCH_MAP = {
        'ItemCode': ['Item Code'],
        'CustomerName': ['Customer Name'],
        'Branch': ['Branch', 'City'],
        'EngineVin': ['Engine-Alternator No.', 'Engine', 'VIN', 'Engine-VIN', 'Engine No', 'Engine No.'],
        'RetailDate': ['Invoice Date'],
        'ItemDescription': ['Item Description'],
        'InvoiceNo': ['Invoice No'],
        'Quantity': ['Desp. Qty', 'Qty', 'Inv. Qty']
    }
    rename_dict = {}
    df_columns_lower = {col.lower().strip(): col for col in df.columns}

    for standard_name, potential_names in COLUMN_SEARCH_MAP.items():
        for potential_name in potential_names:
            if potential_name.lower() in df_columns_lower:
                original_name = df_columns_lower[potential_name.lower()]
                rename_dict[original_name] = standard_name
                break
    
    df.rename(columns=rename_dict, inplace=True)
    return df

def process_engine_vin_cell(cell_value):
    """Processes a single cell that may contain one or more Engine-VIN pairs."""
    if pd.isna(cell_value) or not isinstance(cell_value, str):
            return []
            
    pairs = []
    # Split by common delimiters: comma, newline, or multiple spaces
    entries = re.split(r'[,\n\s]{2,}', str(cell_value).strip())
    
    for entry in entries:
        entry = entry.strip()
        if '-' in entry and len(entry) > 15:
            parts = entry.split('-', 1)
            if len(parts) == 2:
                engine, vin = parts[0].strip(), parts[1].strip()
                if len(engine) > 5 and len(vin) > 10:
                    pairs.append({'Engine': engine, 'VIN': vin})
    return pairs

def process_uploaded_file(filepath):
    """
    The main processing pipeline. Reads an Excel file, cleans the data,
    and returns a clean DataFrame and a results dictionary for the frontend.
    """
    # 1. Read Data
    # Headers are expected on the 3rd row (index 2)
    try:
        # Let pandas auto-detect the engine to support both .xls and .xlsx
        df = pd.read_excel(filepath, header=2)
    except Exception as e:
        # Add more specific error handling if needed
        raise ValueError(f"Could not read the Excel file: {e}")

    # 2. Standardize Columns
    df = standardize_columns(df)
    if 'EngineVin' not in df.columns:
        raise KeyError("Mandatory 'Engine-VIN' column not found after standardization.")

    # 3. Process Engine-VIN pairs and Explode Rows
    # This creates a separate row for each vehicle
    df['parsed_vehicles'] = df['EngineVin'].apply(process_engine_vin_cell)
    df = df.explode('parsed_vehicles').dropna(subset=['parsed_vehicles']).reset_index(drop=True)
    
    # 4. Expand Parsed Data into Columns
    vehicle_details = pd.json_normalize(df['parsed_vehicles'])
    df = pd.concat([df.drop(columns=['parsed_vehicles', 'EngineVin']), vehicle_details], axis=1)

    # 5. Determine Brand
    df['Brand'] = df.apply(
        lambda row: determine_brand_from_vin(row.get('VIN')) if pd.notna(row.get('VIN')) else determine_brand_from_description(row.get('ItemDescription')),
        axis=1
    )

    # 6. Clean Model Name
    df['Model'] = df.apply(
        lambda row: get_clean_model_name(row.get('ItemDescription'), row.get('Brand')),
        axis=1
    )

    # 7. Add Purpose Column
    df['Purpose'] = 'Dispatch'

    # 8. Final Data Formatting
    df.drop_duplicates(subset=['VIN'], keep='first', inplace=True)
    if 'RetailDate' in df.columns:
        df['RetailDate'] = pd.to_datetime(df['RetailDate'], errors='coerce').dt.strftime('%d-%m-%y').fillna('N/A')

    # 9. Prepare Results for Frontend
    # Ensure all required columns exist for the JSON output
    frontend_cols = ['Brand', 'Model', 'VIN', 'Engine', 'RetailDate', 'CustomerName', 'Purpose', 'ItemCode', 'InvoiceNo']
    for col in frontend_cols:
        if col not in df.columns:
            df[col] = 'N/A'
            
    # Replace NaN/NaT with None for JSON compatibility
    df_for_json = df[frontend_cols].where(pd.notna(df), None)

    # Ensure Quantity, City, and Showroom columns for template compatibility
    for extra_col in ['Quantity', 'City', 'Showroom']:
        if extra_col not in df_for_json.columns:
            df_for_json[extra_col] = None
    if 'City' in df_for_json.columns and df_for_json['City'].isna().all() and 'Branch' in df.columns:
        df_for_json['City'] = df['Branch']

    return df_for_json 