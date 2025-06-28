#!/usr/bin/env python3
"""
Vehicle Dispatch Report Generator - Fixed Flask Web App
Upload Excel files and generate formatted reports for Changan and Maxus brands.
"""

from flask import Flask, request, render_template, send_file, flash, redirect, url_for, jsonify
import pandas as pd
import os
import sys
from datetime import datetime
from werkzeug.utils import secure_filename
import tempfile
from io import BytesIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['OUTPUT_FOLDER'] = 'Files/output'

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)

ALLOWED_EXTENSIONS = {'xls', 'xlsx'}

def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_vehicle_data(filepath):
    """Process the vehicle dispatch data - simplified version."""
    print(f"Processing file: {filepath}")
    
    try:
        # Read the Excel file
        df = pd.read_excel(filepath)
        print(f"File loaded: {len(df)} rows, {len(df.columns)} columns")
        
        # Initialize results
        df_changan = pd.DataFrame()
        df_maxus = pd.DataFrame()
        
        # Look for Engine-VIN data in various columns
        engine_vin_columns = [col for col in df.columns if 'engine' in col.lower() or 'vin' in col.lower() or 'no' in col.lower()]
        print(f"Found potential Engine-VIN columns: {engine_vin_columns}")
        
        # Process the data
        for _, row in df.iterrows():
            for col in df.columns:
                value = str(row[col])
                
                # Look for comma-separated Engine-VIN pairs
                if ',' in value and '-' in value and len(value) > 20:
                    pairs = value.split(',')
                    
                    for pair in pairs:
                        if '-' in pair and len(pair.strip()) > 15:
                            parts = pair.strip().split('-')
                            if len(parts) >= 2:
                                engine = parts[0].strip()
                                vin = parts[1].strip()
                                
                                # Determine brand based on VIN patterns
                                if vin.startswith(('LS5', 'LDC', 'LGX')):  # Changan patterns
                                    new_row = {
                                        'VIN': vin,
                                        'Engine': engine,
                                        'Customer Name': row.get('Customer Name', row.get('Sold-to-Party', 'N/A')),
                                        'Branch': row.get('Branch', 'N/A'),
                                        'Desp. Warehouse': row.get('Desp. Warehouse', 'N/A'),
                                        'Del. Contact No': row.get('Del. Contact No', 'N/A'),
                                        'Delivery Date': row.get('Delivery Date', datetime.now().strftime('%Y-%m-%d'))
                                    }
                                    df_changan = pd.concat([df_changan, pd.DataFrame([new_row])], ignore_index=True)
                                
                                elif vin.startswith(('WMZ', 'LYV')):  # Maxus patterns
                                    new_row = {
                                        'VIN': vin,
                                        'Engine': engine,
                                        'Customer Name': row.get('Customer Name', row.get('Sold-to-Party', 'N/A')),
                                        'Branch': row.get('Branch', 'N/A'),
                                        'Desp. Warehouse': row.get('Desp. Warehouse', 'N/A'),
                                        'Del. Contact No': row.get('Del. Contact No', 'N/A'),
                                        'Delivery Date': row.get('Delivery Date', datetime.now().strftime('%Y-%m-%d')),
                                        'Item Description': row.get('Item Description', 'N/A'),
                                        'Invoice No': row.get('Invoice No', 'N/A'),
                                        'Desp. Qty': row.get('Desp. Qty', 1)
                                    }
                                    df_maxus = pd.concat([df_maxus, pd.DataFrame([new_row])], ignore_index=True)
        
        print(f"Processed: {len(df_changan)} Changan, {len(df_maxus)} Maxus vehicles")
        return df_changan, df_maxus
        
    except Exception as e:
        print(f"Error processing file: {e}")
        raise e

def create_report(df_changan, df_maxus, output_dir):
    """Create Excel report with three tabs."""
    print("Creating Excel report...")
    
    # Remove duplicates
    df_changan = df_changan.drop_duplicates(subset=['VIN'], keep='first')
    df_maxus = df_maxus.drop_duplicates(subset=['VIN'], keep='first')
    
    # Prepare Changan data
    changan_formatted = pd.DataFrame({
        'VIN': df_changan['VIN'] if len(df_changan) > 0 else [],
        'Retail Date': datetime.now().strftime('%Y-%m-%d'),
        'Dealer Code': df_changan.get('Branch', 'N/A') if len(df_changan) > 0 else [],
        'Customer Name': df_changan['Customer Name'] if len(df_changan) > 0 else [],
        'Purpose': 'Dispatch',
        'Mobile': df_changan.get('Del. Contact No', 'N/A') if len(df_changan) > 0 else [],
        'City': 'N/A',
        'Showroom': df_changan.get('Desp. Warehouse', 'N/A') if len(df_changan) > 0 else []
    })
    
    # Prepare Maxus data
    maxus_formatted = pd.DataFrame({
        'S/N': range(1, len(df_maxus) + 1) if len(df_maxus) > 0 else [],
        'VIN': df_maxus['VIN'] if len(df_maxus) > 0 else [],
        'Engine No': df_maxus['Engine'] if len(df_maxus) > 0 else [],
        'Model': df_maxus.get('Item Description', 'N/A') if len(df_maxus) > 0 else [],
        'Customer Name': df_maxus['Customer Name'] if len(df_maxus) > 0 else [],
        'Delivery Date': df_maxus.get('Delivery Date', datetime.now().strftime('%Y-%m-%d')) if len(df_maxus) > 0 else [],
        'Status': 'Dispatched'
    })
    
    # Create Excel file
    filename = f"Vehicle_Dispatch_Report_{datetime.now().strftime('%B_%Y')}.xlsx"
    filepath = os.path.join(output_dir, filename)
    
    with pd.ExcelWriter(filepath, engine='openpyxl') as writer:
        # Summary sheet
        summary_data = {
            'Metric': ['Total Vehicles', 'Changan Count', 'Maxus Count', 'Report Date'],
            'Value': [len(df_changan) + len(df_maxus), len(df_changan), len(df_maxus), datetime.now().strftime('%Y-%m-%d %H:%M')]
        }
        pd.DataFrame(summary_data).to_excel(writer, sheet_name='Summary', index=False)
        
        # Changan sheet
        changan_formatted.to_excel(writer, sheet_name='Changan', index=False)
        
        # Maxus sheet
        maxus_formatted.to_excel(writer, sheet_name='Maxus', index=False)
    
    print(f"Report saved: {filepath}")
    return filepath

@app.route('/')
def index():
    """Main upload page."""
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload and processing."""
    try:
        print("Upload request received")
        
        # Check if file was uploaded
        if 'file' not in request.files:
            flash('No file selected')
            return redirect(request.url)
        
        file = request.files['file']
        
        if file.filename == '':
            flash('No file selected')
            return redirect(request.url)
        
        if file and allowed_file(file.filename):
            print(f"Processing file: {file.filename}")
            
            # Secure the filename
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"{timestamp}_{filename}"
            
            # Save uploaded file
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            print(f"File saved to: {filepath}")
            
            # Process the file
            df_changan, df_maxus = process_vehicle_data(filepath)
            
            # Create report
            output_file = create_report(df_changan, df_maxus, app.config['OUTPUT_FOLDER'])
            
            # Prepare results data
            results = {
                'original_filename': file.filename,
                'changan_count': len(df_changan),
                'maxus_count': len(df_maxus),
                'total_vehicles': len(df_changan) + len(df_maxus),
                'changan_unique_vins': df_changan['VIN'].nunique() if len(df_changan) > 0 else 0,
                'maxus_unique_vins': df_maxus['VIN'].nunique() if len(df_maxus) > 0 else 0,
                'output_file': os.path.basename(output_file),
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
            # Clean up uploaded file
            os.remove(filepath)
            print("Processing completed successfully")
            
            return render_template('results.html', results=results)
        else:
            flash('Invalid file type. Please upload .xls or .xlsx files only.')
            return redirect(request.url)
            
    except Exception as e:
        print(f"Error in upload_file: {e}")
        flash(f'Error processing file: {str(e)}')
        return redirect(request.url)

@app.route('/download/<filename>')
def download_file(filename):
    """Download generated report file."""
    try:
        filepath = os.path.join(app.config['OUTPUT_FOLDER'], filename)
        if os.path.exists(filepath):
            return send_file(filepath, as_attachment=True)
        else:
            flash('File not found')
            return redirect(url_for('index'))
    except Exception as e:
        flash(f'Error downloading file: {str(e)}')
        return redirect(url_for('index'))

@app.route('/health')
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    print("🚀 Starting Vehicle Dispatch Report Generator (Fixed)...")
    print("📊 Upload Excel files to generate formatted reports")
    print("🌐 Access the app at: http://127.0.0.1:8000")
    app.run(debug=True, host='127.0.0.1', port=8000) 