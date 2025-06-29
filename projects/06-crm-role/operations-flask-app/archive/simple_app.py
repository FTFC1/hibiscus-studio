#!/usr/bin/env python3
"""
Simple Flask app for vehicle dispatch processing
"""

from flask import Flask, request, render_template, send_file, flash, redirect, url_for, jsonify
import pandas as pd
import os
from datetime import datetime
from werkzeug.utils import secure_filename

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
            
            # Simple processing (just read the file)
            df = pd.read_excel(filepath)
            
            # Prepare results data
            results = {
                'original_filename': file.filename,
                'total_rows': len(df),
                'columns': list(df.columns),
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
            # Clean up uploaded file
            os.remove(filepath)
            
            return render_template('results.html', results=results)
        else:
            flash('Invalid file type. Please upload .xls or .xlsx files only.')
            return redirect(request.url)
            
    except Exception as e:
        flash(f'Error processing file: {str(e)}')
        return redirect(request.url)

@app.route('/health')
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    print("🚀 Starting Simple Vehicle Dispatch Processor...")
    print("🌐 Access the app at: http://127.0.0.1:8000")
    app.run(debug=True, host='127.0.0.1', port=8000) 