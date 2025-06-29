#!/usr/bin/env python3
"""
Vehicle Dispatch Report Generator - Flask Web App
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
import zipfile

# Import our processor functions
from custom_format_processor import (
    load_and_process_data, 
    create_combined_report,
    analyse_duplicate_issue
)

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

@app.route('/')
def index():
    """Main upload page."""
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload and processing."""
    try:
        # Check if file was uploaded
        if 'file' not in request.files:
            flash('No file selected')
            return redirect(request.url)
        
        file = request.files['file']
        
        if file.filename == '':
            flash('No file selected')
            return redirect(request.url)
        
        if file and allowed_file(file.filename):
            # Secure the filename
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"{timestamp}_{filename}"
            
            # Save uploaded file
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Process the file
            return process_uploaded_file(filepath, file.filename)
        else:
            flash('Invalid file type. Please upload .xls or .xlsx files only.')
            return redirect(request.url)
            
    except Exception as e:
        flash(f'Error processing file: {str(e)}')
        return redirect(request.url)

def process_uploaded_file(filepath, original_filename):
    """Process the uploaded Excel file and generate reports."""
    try:
        # Load and process data using our existing function
        df_changan, df_maxus = load_and_process_data(filepath)
        
        # Analyse duplicates
        duplicate_info = analyse_duplicate_issue(df_changan) if len(df_changan) > 0 else None
        
        # Create the combined report
        output_file = create_combined_report(df_changan, df_maxus, app.config['OUTPUT_FOLDER'])
        
        # Prepare results data
        results = {
            'original_filename': original_filename,
            'changan_count': len(df_changan),
            'maxus_count': len(df_maxus),
            'total_vehicles': len(df_changan) + len(df_maxus),
            'changan_unique_vins': df_changan['VIN'].nunique() if len(df_changan) > 0 else 0,
            'maxus_unique_vins': df_maxus['VIN'].nunique() if len(df_maxus) > 0 else 0,
            'duplicate_info': duplicate_info,
            'output_file': os.path.basename(output_file),
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return render_template('results.html', results=results)
        
    except Exception as e:
        # Clean up uploaded file on error
        if os.path.exists(filepath):
            os.remove(filepath)
        raise e

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

@app.route('/api/upload', methods=['POST'])
def api_upload():
    """API endpoint for file upload - returns JSON response."""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Process file in memory
        filename = secure_filename(file.filename)
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as tmp_file:
            file.save(tmp_file.name)
            
            # Process the file
            df_changan, df_maxus = load_and_process_data(tmp_file.name)
            
            # Generate report in memory
            output_buffer = BytesIO()
            timestamp = datetime.now().strftime('%B_%Y')
            
            # Create combined report (we'll need to modify this to work with BytesIO)
            # For now, create temp output file
            temp_output = tempfile.mktemp(suffix='.xlsx')
            output_file = create_combined_report(df_changan, df_maxus, os.path.dirname(temp_output))
            
            # Read the file into memory
            with open(output_file, 'rb') as f:
                output_buffer.write(f.read())
            output_buffer.seek(0)
            
            # Clean up temp files
            os.remove(tmp_file.name)
            os.remove(output_file)
            
            # Return file
            return send_file(
                output_buffer,
                as_attachment=True,
                download_name=f'Vehicle_Dispatch_Report_{timestamp}.xlsx',
                mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health')
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    print("🚀 Starting Vehicle Dispatch Report Generator...")
    print("📊 Upload Excel files to generate formatted reports")
    print("🌐 Access the app at: http://127.0.0.1:8000")
    app.run(debug=True, host='127.0.0.1', port=8000) 