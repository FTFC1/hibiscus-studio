from flask import Flask, render_template, request, send_file, jsonify
from pdf_generator import create_pdf, parse_form_data, number_to_words
from io import BytesIO
import datetime

app = Flask(__name__)

@app.route('/')
def index():
    vehicles = [
        {"display_name": "Toyota Camry", "description": "Toyota Camry Sedan", "price": 25000},
        {"display_name": "Honda Civic", "description": "Honda Civic Hatchback", "price": 22000}
    ]
    return render_template('index.html', vehicles=vehicles)

@app.route('/preview', methods=['POST'])
def preview_pdf():
    try:
        form_data = request.form.to_dict(flat=False)
        
        # Parse and prepare data for the template
        invoice_data = parse_form_data(form_data)

        # Calculate totals and add to invoice_data
        subtotal = sum(item['quantity'] * item['unit_price'] for item in invoice_data['items'])
        
        # Add transport and registration costs
        transport_cost = invoice_data.get('transport_cost', 0)
        registration_cost = invoice_data.get('registration_cost', 0)
        subtotal += transport_cost + registration_cost

        vat = 0 if invoice_data['invoice_type'] == 'government' else subtotal * 0.075
        grand_total = subtotal + vat

        invoice_data['subtotal'] = subtotal
        invoice_data['vat_amount'] = vat
        invoice_data['total'] = grand_total
        invoice_data['amount_in_words'] = number_to_words(grand_total)
        invoice_data['valid_until'] = (datetime.date.today() + datetime.timedelta(days=30)).strftime('%d/%m/%Y')
        invoice_data['currency_symbol'] = "$" if invoice_data['invoice_type'] == 'usd' else "₦"

        # Render HTML template with data
        html_content = render_template('invoice_template.html', invoice_data=invoice_data)
        
        # Generate PDF from HTML
        pdf_content = create_pdf(html_content, invoice_data) # invoice_data is passed for potential future use in create_pdf
        
        # Return PDF for preview in browser
        pdf_file = BytesIO(pdf_content)
        return send_file(
            pdf_file, 
            mimetype='application/pdf',
            as_attachment=False,  # Preview in browser
            download_name=f'preview_invoice_{invoice_data["invoice_number"]}.pdf'
        )
        
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({'success': False, 'errors': [f'Error generating preview: {str(e)}']}), 500

@app.route('/generate', methods=['POST'])
def generate_invoice():
    try:
        form_data = request.form.to_dict(flat=False)
        
        # Parse and prepare data for the template
        invoice_data = parse_form_data(form_data)

        # Calculate totals and add to invoice_data
        subtotal = sum(item['quantity'] * item['unit_price'] for item in invoice_data['items'])
        
        # Add transport and registration costs
        transport_cost = invoice_data.get('transport_cost', 0)
        registration_cost = invoice_data.get('registration_cost', 0)
        subtotal += transport_cost + registration_cost

        vat = 0 if invoice_data['invoice_type'] == 'government' else subtotal * 0.075
        grand_total = subtotal + vat

        invoice_data['subtotal'] = subtotal
        invoice_data['vat_amount'] = vat
        invoice_data['total'] = grand_total
        invoice_data['amount_in_words'] = number_to_words(grand_total)
        invoice_data['valid_until'] = (datetime.date.today() + datetime.timedelta(days=30)).strftime('%d/%m/%Y')
        invoice_data['currency_symbol'] = "$" if invoice_data['invoice_type'] == 'usd' else "₦"

        # Render HTML template with data
        html_content = render_template('invoice_template.html', invoice_data=invoice_data)
        
        # Generate PDF from HTML
        pdf_content = create_pdf(html_content, invoice_data) # invoice_data is passed for potential future use in create_pdf
        
        # Return PDF for download
        pdf_file = BytesIO(pdf_content)
        return send_file(
            pdf_file, 
            mimetype='application/pdf',
            as_attachment=True,  # Download file
            download_name=f'invoice_{invoice_data["invoice_number"]}.pdf'
        )
        
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({'success': False, 'errors': [f'Error generating invoice: {str(e)}']}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)