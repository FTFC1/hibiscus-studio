from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    return '<h1>🎉 Flask Working!</h1><p>Port 8000 is working perfectly!</p><p><a href="/health">Check Health</a></p>'

@app.route('/health')
def health():
    return {'status': 'healthy'}

if __name__ == '__main__':
    print('🚀 Minimal Flask starting on port 8000...')
    app.run(debug=True, host='127.0.0.1', port=8000) 