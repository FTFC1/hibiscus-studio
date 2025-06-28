#!/usr/bin/env python3
"""
Simple Flask test app
"""

from flask import Flask, render_template_string

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template_string('''
    <!DOCTYPE html>
    <html>
    <head>
        <title>🚀 Vehicle Dispatch Processor</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; 
                text-align: center; 
                padding: 50px; 
            }
            .container {
                background: rgba(255,255,255,0.1);
                padding: 40px;
                border-radius: 20px;
                max-width: 600px;
                margin: 0 auto;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎉 Flask App is Working!</h1>
            <h2>🚗 Vehicle Dispatch Report Generator</h2>
            <p>✅ Flask server is running successfully</p>
            <p>🔧 Ready to process your Excel files</p>
            <p><strong>Next Step:</strong> Upload your dispatch register files</p>
        </div>
    </body>
    </html>
    ''')

@app.route('/health')
def health():
    return {'status': 'healthy', 'message': 'Flask app is running!'}

if __name__ == '__main__':
    print("🚀 Testing Flask App...")
    print("🌐 Open: http://localhost:8000")
    app.run(debug=True, host='0.0.0.0', port=8000) 