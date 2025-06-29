#!/usr/bin/env python3
"""
Vehicle Dispatch Report API - Pure API (no web UI)
Accepts Excel files and returns processed multi-brand reports.
"""

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import pandas as pd
import os
import tempfile
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
                df = pd.read_csv(tmp_file.name)
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
                
                # Individual brand sheets
                for brand, brand_df in processed_data.items():
                    if len(brand_df) > 0:  # Only create sheet if data exists
                        brand_df.to_excel(writer, sheet_name=brand[:31], index=False)  # Excel sheet name limit
            
            output_buffer.seek(0)
            
            return send_file(
                output_buffer,
                as_attachment=True,
                download_name=f'Vehicle_Dispatch_Report_{timestamp}.xlsx',
                mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            
    except Exception as e:
        return jsonify({'error': f'Processing failed: {str(e)}'}), 500

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
            '/api/process': 'POST - Upload file, get processed Excel report',
            '/health': 'GET - Health check',
            '/api/info': 'GET - API information'
        }
    })

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 8000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print("🚀 Starting Vehicle Dispatch API Server...")
    print("📊 API Endpoints:")
    print("   POST /api/process - Upload & process files")
    print("   GET  /health - Health check")
    print("   GET  /api/info - API info")
    print(f"🌐 Server running on port: {port}")
    
    app.run(debug=debug, host='0.0.0.0', port=port) 