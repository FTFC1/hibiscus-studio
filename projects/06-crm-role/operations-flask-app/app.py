#!/usr/bin/env python3
"""
Vehicle Dispatch Report App - Web UI and API
"""

from flask import Flask, request, send_file, jsonify, render_template
from flask_cors import CORS
import pandas as pd
import os
import tempfile
import shutil
from datetime import datetime
from werkzeug.utils import secure_filename
from io import BytesIO

# Import existing processor functions
from simpler_processor import (
    process_brands, 
    generate_combined_report, 
    process_engine_vin_cell,
    find_header_rows,
    fix_column_names,
    KNOWN_COLUMN_NAMES
)

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

ALLOWED_EXTENSIONS = {'xls', 'xlsx', 'csv'}

# Updated brand list (all 11 brands)
TARGET_BRANDS = {
    "CHANGAN": ["changan", "chang'an"],
    "MAXUS": ["maxus"],
    "GEELY": ["geely"],
    "GWM": ["gwm", "great wall"],
    "ZNA": ["zna"],
    "DFAC": ["dfac"],
    "KMC": ["kmc"],
    "HYUNDAI": ["hyundai"],
    "LOVOL": ["lovol"],
    "FOTON": ["foton"],
    "DINGZHOU": ["dingzhou"],
}

# Define brand categories
BRAND_CATEGORIES = {
    "Passenger/Fleet Vehicles": ["CHANGAN", "MAXUS", "GEELY", "GWM", "ZNA"],
    "Light Heavy Duty Vehicles (LHCVs)": ["DFAC", "KMC", "HYUNDAI", "LOVOL", "FOTON", "DINGZHOU"]
}

# Load valid products from CSV for model validation
VALID_PRODUCTS = set()
PRODUCT_LIST_PATH = os.path.join(os.path.dirname(__file__), 'Files', 'Product List - Sheet1.csv')
try:
    product_df = pd.read_csv(PRODUCT_LIST_PATH)
    for _, row in product_df.iterrows():
        brand = str(row['BRAND']).strip().upper()
        model = str(row['MODEL']).strip().upper()
        VALID_PRODUCTS.add((brand, model))
    print(f"Loaded {len(VALID_PRODUCTS)} valid (BRAND, MODEL) pairs from product list.")
except FileNotFoundError:
    print(f"WARNING: Product list not found at {PRODUCT_LIST_PATH}. Model validation will be skipped.")
except Exception as e:
    print(f"ERROR loading product list: {e}. Model validation will be skipped.")

# Get port from environment variable or use 8001 as a default
port = int(os.environ.get("PORT", 8001))

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def auto_detect_columns(df, df_raw=None):
    """
    Auto-detect engine-VIN and brand columns using the same logic as simpler_processor.py
    """
    engine_vin_col = None
    brand_col = None
    
    # Find the Engine-VIN column
    for i, col in enumerate(df.columns):
        # Look for specific column name
        if col == "Engine-Alternator No.":
            engine_vin_col = col
            break
        
        # Look for column with 'Engine-Alternator' in header
        if 'engine' in str(col).lower() and ('alternator' in str(col).lower() or 'no' in str(col).lower()):
            engine_vin_col = col
            break
        
        # Analyze data patterns in this column
        sample_data = df[col].astype(str).str.strip().dropna().head(25)
        sample_data = [s for s in sample_data if len(s) > 3 and s.lower() != 'nan']
        
        if sample_data:
            hyphen_count = sum(1 for s in sample_data if '-' in s)
            long_values = sum(1 for s in sample_data if len(s) > 20)
            
            # This is likely our Engine-VIN column if it has hyphens and long values
            if hyphen_count > 0 and long_values > 0 and i >= 9:  # Usually column 10+
                engine_vin_col = col
                break
    
    # Find the Brand column  
    for i, col in enumerate(df.columns):
        if col == "Item Description":
            brand_col = col
            break
        
        col_str = str(col).lower()
        if ('item' in col_str and 'description' in col_str) or 'brand' in col_str:
            brand_col = col
            break
    
    # Fallback: use early columns for brand detection
    if not brand_col and len(df.columns) > 2:
        # Look for brand keywords in early columns
        for i in range(min(5, len(df.columns))):
            col = df.columns[i]
            samples = df[col].astype(str).dropna().head(20).tolist()
            samples = [s for s in samples if len(s) > 3 and s.lower() != 'nan']
            
            if samples:
                found_brands = []
                for brand, variations in TARGET_BRANDS.items():
                    for variation in variations:
                        matches = sum(1 for s in samples if variation in s.lower())
                        if matches > 0:
                            found_brands.append(brand)
                
                if found_brands:
                    brand_col = col
                    break
    
    return engine_vin_col, brand_col

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/process', methods=['POST'])
def process_file():
    """
    Main API endpoint: Upload Excel → Get processed report
    """
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Use .xls, .xlsx, or .csv'}), 400

        # Process in memory - no disk storage
        with tempfile.NamedTemporaryFile(suffix='.xlsx') as tmp_file:
            file.save(tmp_file.name)
            
            # Load data with robust handling
            df = None
            df_raw = None
            
            if file.filename.lower().endswith('.csv'):
                # Robust CSV reading with automatic delimiter detection
                try:
                    # First, try to detect delimiter
                    import csv
                    with open(tmp_file.name, 'r', encoding='utf-8') as f:
                        sample = f.read(1024)
                        sniffer = csv.Sniffer()
                        delimiter = sniffer.sniff(sample).delimiter
                    
                    # Read with detected delimiter
                    df = pd.read_csv(tmp_file.name, delimiter=delimiter, encoding='utf-8')
                except:
                    # Fallback: try common delimiters
                    for delimiter in [',', ';', '\t', '|']:
                        try:
                            df = pd.read_csv(tmp_file.name, delimiter=delimiter, encoding='utf-8')
                            if len(df.columns) > 1:  # If we got multiple columns, probably correct
                                break
                        except:
                            continue
                    
                    # Last resort: try with different encodings
                    if df is None:
                        for encoding in ['latin1', 'cp1252', 'iso-8859-1']:
                            try:
                                df = pd.read_csv(tmp_file.name, encoding=encoding)
                                break
                            except:
                                continue
            else:
                # Try different approaches for Excel files
                try:
                    # First try with xlrd for .xls files
                    if file.filename.lower().endswith('.xls'):
                        try:
                            # Load raw data first to analyze structure
                            df_raw = pd.read_excel(tmp_file.name, sheet_name=0, header=None, nrows=15, engine='xlrd')
                            
                            # Find header row
                            header_row, potential_header_rows = find_header_rows(df_raw)
                            
                            # Load with proper header
                            df = pd.read_excel(tmp_file.name, sheet_name=0, header=header_row, engine='xlrd')
                            
                            # Apply column name mapping if needed
                            if len(potential_header_rows) > 0:
                                column_name_mapping = {}
                                for row_idx in potential_header_rows:
                                    row_values = df_raw.iloc[row_idx].astype(str)
                                    matches = 0
                                    for known_name in KNOWN_COLUMN_NAMES:
                                        for i, val in enumerate(row_values):
                                            if pd.notna(val) and known_name.lower() in val.lower():
                                                matches += 1
                                                column_name_mapping[i] = known_name
                                    if matches >= 3:
                                        df = fix_column_names(df, column_name_mapping)
                                        break
                        except:
                            # Fallback to basic reading
                            df = pd.read_excel(tmp_file.name, sheet_name=0, engine='xlrd')
                    else:
                        # For .xlsx files
                        df = pd.read_excel(tmp_file.name, sheet_name=0)
                        
                except Exception as e:
                    return jsonify({'error': f'Failed to read Excel file: {str(e)}'}), 400
            
            if df is None or len(df) == 0:
                return jsonify({'error': 'No data found in file'}), 400
            
            # Auto-detect the correct columns
            engine_vin_col, brand_col = auto_detect_columns(df, df_raw)
            
            if not engine_vin_col:
                return jsonify({'error': 'Could not find Engine-VIN column in the data'}), 400
            
            if not brand_col:
                # Use a fallback approach - process all data without brand filtering
                brand_col = df.columns[0] if len(df.columns) > 0 else None
            
            # Process by brands
            processed_data = process_brands(
                df, 
                engine_vin_col=engine_vin_col,
                brand_col=brand_col,
                target_brands=TARGET_BRANDS
            )
            
            # Generate combined Excel report in memory
            output_buffer = BytesIO()
            timestamp = datetime.now().strftime('%B_%Y')
            
            # Create Excel with multiple sheets
            with pd.ExcelWriter(output_buffer, engine='openpyxl') as writer:
                # Summary sheet
                summary_data = []
                total_vehicles = 0
                for brand, brand_df in processed_data.items():
                    count = len(brand_df)
                    total_vehicles += count
                    summary_data.append({
                        'Brand': brand,
                        'Vehicle Count': count,
                        'Unique VINs': brand_df['VIN'].nunique() if 'VIN' in brand_df.columns else 0
                    })
                
                summary_df = pd.DataFrame(summary_data)
                summary_df.to_excel(writer, sheet_name='Summary', index=False)
                
                # Prepare brand breakdown data for frontend
                brand_breakdown = []
                for brand, brand_df in processed_data.items():
                    count = len(brand_df)
                    percentage = (count / total_vehicles * 100) if total_vehicles > 0 else 0
                    brand_breakdown.append({
                        'name': brand,
                        'count': count,
                        'percentage': round(percentage, 2)
                    })
                
                # Categorize brands
                categorized_brand_breakdown = {
                    "Passenger/Fleet Vehicles": [],
                    "Light Heavy Duty Vehicles (LHCVs)": []
                }

                for brand_info in brand_breakdown:
                    assigned = False
                    for category, brands_in_category in BRAND_CATEGORIES.items():
                        if brand_info['name'].upper() in brands_in_category:
                            categorized_brand_breakdown[category].append(brand_info)
                            assigned = True
                            break
                    if not assigned:
                        # Fallback for any unassigned brands
                        if "Other" not in categorized_brand_breakdown:
                            categorized_brand_breakdown["Other"] = []
                        categorized_brand_breakdown["Other"].append(brand_info)

                # Sort brands within each category by count (descending)
                for category in categorized_brand_breakdown:
                    categorized_brand_breakdown[category].sort(key=lambda x: x['count'], reverse=True)

                # Individual brand sheets
                for brand, brand_df in processed_data.items():
                    if len(brand_df) > 0:  # Only create sheet if data exists
                        brand_df.to_excel(writer, sheet_name=brand[:31], index=False)  # Excel sheet name limit
            
            output_buffer.seek(0)
            
            # Save the file to a temporary location
            temp_dir = tempfile.mkdtemp()
            
            # Dynamic filename
            current_month_year = datetime.now().strftime('%B %Y')
            output_filename = f'Mikano Motors Vehicle Dispatch Report - Monthly Vehicle Discharge Report - {current_month_year}.xlsx'
            
            output_path = os.path.join(temp_dir, output_filename)
            
            with open(output_path, 'wb') as f:
                f.write(output_buffer.getvalue())

            # Prepare summary data for frontend
            total_vins_processed = 0
            valid_unique_models = set()
            for brand, brand_df in processed_data.items():
                if 'VIN' in brand_df.columns:
                    total_vins_processed += brand_df['VIN'].nunique()
                
                # Validate models against the loaded product list
                if 'Item Description' in brand_df.columns:
                    for item_desc in brand_df['Item Description'].dropna().unique():
                        # Attempt to extract model from item description or use a direct model column if available
                        # This is a simplified approach; a more robust parsing might be needed
                        model_from_desc = item_desc.split(' ')[1].strip().upper() if len(item_desc.split(' ')) > 1 else ""
                        
                        # Check if the (BRAND, MODEL) pair is in our valid products list
                        # Use the brand name from processed_data.items() as it's already standardized
                        if (brand.upper(), model_from_desc) in VALID_PRODUCTS:
                            valid_unique_models.add(model_from_desc)
                        else:
                            # Fallback: if model_from_desc is not found, try to match just the brand
                            # This handles cases where the model name might be inconsistent
                            for valid_brand, valid_model in VALID_PRODUCTS:
                                if valid_brand == brand.upper() and model_from_desc in valid_model:
                                    valid_unique_models.add(model_from_desc)
                                    break

            summary_stats = {
                'total_vehicles': total_vehicles,
                'brands_count': len(processed_data),
                'unique_models': len(valid_unique_models),
                'total_vins_processed': total_vins_processed
            }
            print(f"Calculated total_vins_processed: {total_vins_processed}")
            print(f"Calculated unique_models: {len(valid_unique_models)}")

            # Return JSON response with filename and summary data
            return jsonify({
                'message': 'File processed successfully',
                'filename': output_filename,
                'temp_dir': temp_dir,
                'summary_stats': summary_stats,
                'brand_breakdown': categorized_brand_breakdown # Send categorized data
            })
            
    except Exception as e:
        return jsonify({'error': f'Processing failed: {str(e)}'}), 500

@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    try:
        # Assuming files are stored in a temporary directory
        # In a real application, you'd want more robust security and cleanup
        temp_dir = request.args.get('temp_dir') # Get temp_dir from query parameter
        if not temp_dir or not os.path.exists(temp_dir):
            return jsonify({'error': 'Temporary directory not found'}), 404

        file_path = os.path.join(temp_dir, filename)
        if os.path.exists(file_path):
            return send_file(file_path, as_attachment=True, download_name=filename)
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': f'Download failed: {str(e)}'}), 500

@app.route('/api/cleanup', methods=['POST'])
def cleanup_temp_dir():
    temp_dir = request.json.get('temp_dir')
    if temp_dir and os.path.exists(temp_dir):
        try:
            shutil.rmtree(temp_dir)
            return jsonify({'message': f'Temporary directory {temp_dir} cleaned up.'}), 200
        except Exception as e:
            return jsonify({'error': f'Failed to clean up temporary directory: {str(e)}'}), 500
    return jsonify({'message': 'No temporary directory to clean up.'}), 200

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'supported_brands': list(TARGET_BRANDS.keys())
    })

@app.route('/api/info', methods=['GET'])
def api_info():
    return jsonify({
        'service': 'Vehicle Dispatch Report API',
        'version': '2.0',
        'supported_formats': list(ALLOWED_EXTENSIONS),
        'supported_brands': list(TARGET_BRANDS.keys()),
        'max_file_size': '16MB',
        'endpoints': {
            '/': 'GET - Main application page',
            '/api/process': 'POST - Upload file, get processed Excel report',
            '/health': 'GET - Health check',
            '/api/info': 'GET - API information'
        }
    })

if __name__ == '__main__':
    print("🚀 Starting Vehicle Dispatch App Server...")
    print(f"🌐 Server running on port: {port}")
    app.run(host='0.0.0.0', port=port, debug=False)