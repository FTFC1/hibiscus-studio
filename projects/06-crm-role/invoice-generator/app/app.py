from flask import Flask, render_template, request, send_file
from pdf_generator import create_pdf
from sheets_client import get_vehicle_catalog
from io import BytesIO

app = Flask(__name__)

@app.route('/')
def index():
    vehicles = get_vehicle_catalog()
    return render_template('index.html', vehicles=vehicles)

@app.route('/generate', methods=['POST'])
def generate_invoice():
    data = request.form.to_dict(flat=False)
    # The PDF generator now also needs access to the vehicle data to correctly map prices
    # This is a temporary solution; a better approach would be to pass all needed data explicitly.
    pdf_data = create_pdf(data)
    
    return send_file(
        BytesIO(pdf_data),
        mimetype='application/pdf',
        as_attachment=True,
        download_name='invoice.pdf'
    )

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
