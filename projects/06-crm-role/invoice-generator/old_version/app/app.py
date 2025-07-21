from flask import Flask, render_template, request, send_file, jsonify
from pdf_generator import create_pdf, parse_form_data, number_to_words
from io import BytesIO
import datetime
import re

def get_slice(text, start, end=None):
    """Helper for safe slicing"""
    if start >= len(text):
        return ""
    if end is None or end >= len(text):
        return text[start:]
    return text[start:end]

app = Flask(__name__)

def format_phone_display(phone):
    """Format phone number for better readability with safe string indexing"""
    if not phone:
        return phone
    
    # Remove any existing formatting
    digits = re.sub(r'[^\d+]', '', phone)
    
    if not digits: # Added check for empty digits
        return phone

    if digits.startswith('+234') and len(digits) >= 14:
        # Nigerian format: +234 803 123 4567
        return f"+234 {get_slice(digits, 4, 7)} {get_slice(digits, 7, 10)} {get_slice(digits, 10)}"
    elif digits.startswith('+44') and len(digits) >= 12:
        # UK format: +44 20 7946 0958
        if len(digits) == 13:
            return f"+44 {get_slice(digits, 3, 5)} {get_slice(digits, 5, 9)} {get_slice(digits, 9)}"
        else:
            return f"+44 {get_slice(digits, 3, 6)} {get_slice(digits, 6, 9)} {get_slice(digits, 9)}"
    elif digits.startswith('+1') and len(digits) >= 12:
        # US/CA format: +1 555 123 4567
        return f"+1 {get_slice(digits, 2, 5)} {get_slice(digits, 5, 8)} {get_slice(digits, 8)}"
    elif digits.startswith('+27') and len(digits) >= 12:
        # SA format: +27 82 123 4567
        return f"+27 {get_slice(digits, 3, 5)} {get_slice(digits, 5, 8)} {get_slice(digits, 8)}"
    elif digits.startswith('+233') and len(digits) >= 13:
        # Ghana format: +233 24 123 4567
        return f"+233 {get_slice(digits, 4, 6)} {get_slice(digits, 6, 9)} {get_slice(digits, 9)}"
    
    # Default formatting for other international numbers
    if digits.startswith('+') and len(digits) > 7:
        return f"{get_slice(digits, 0, 4)} {get_slice(digits, 4, 7)} {get_slice(digits, 7, 10)} {get_slice(digits, 10)}"
    
    return phone

def validate_phone_number(phone):
    """Validate and format international phone numbers"""
    if not phone:
        return None, "Phone number is required"
    
    # Remove all non-digits and plus signs
    cleaned = re.sub(r'[^\d+]', '', phone)
    
    # Safe string slicing function
    def safe_format(text, start_idx):
        return text[start_idx:] if start_idx < len(text) else text
    
    def safe_negative_slice(text, neg_idx):
        return text[neg_idx:] if len(text) >= abs(neg_idx) else text

    # International phone number patterns
    patterns = {
        # Nigeria
        'NG': {
            'pattern': r'^\+?234[789]\d{9}$',
            'format': lambda x: f"+234{safe_negative_slice(x, -10)}",
            'local_pattern': r'^0[789]\d{9}$',
            'local_format': lambda x: f"+234{safe_format(x, 1)}"
        },
        # United Kingdom  
        'GB': {
            'pattern': r'^\+?44[17]\d{8,9}$',
            'format': lambda x: f"+44{safe_negative_slice(x, -10) if len(x) == 13 else safe_negative_slice(x, -9)}",
            'local_pattern': r'^0[17]\d{8,9}$',
            'local_format': lambda x: f"+44{safe_format(x, 1)}"
        },
        # United States/Canada
        'US': {
            'pattern': r'^\+?1[2-9]\d{9}$',
            'format': lambda x: f"+1{safe_negative_slice(x, -10)}",
            'local_pattern': r'^[2-9]\d{9}$',
            'local_format': lambda x: f"+1{x}"
        },
        # South Africa
        'ZA': {
            'pattern': r'^\+?27[1-9]\d{8}$',
            'format': lambda x: f"+27{safe_negative_slice(x, -9)}",
            'local_pattern': r'^0[1-9]\d{8}$',
            'local_format': lambda x: f"+27{safe_format(x, 1)}"
        },
        # Ghana
        'GH': {
            'pattern': r'^\+?233[25]\d{8}$',
            'format': lambda x: f"+233{safe_negative_slice(x, -9)}",
            'local_pattern': r'^0[25]\d{8}$',
            'local_format': lambda x: f"+233{safe_format(x, 1)}"
        }
    }
    
    # Try to match international format first
    for country, config in patterns.items():
        if re.match(config['pattern'], cleaned):
            try:
                return config['format'](cleaned), None
            except:
                continue
    
    # Try to match local format
    for country, config in patterns.items():
        if 'local_pattern' in config and re.match(config['local_pattern'], cleaned):
            try:
                return config['local_format'](cleaned), None
            except:
                continue
    
    # Generic international format validation
    if re.match(r'^\+\d{7,15}$', cleaned):
        return cleaned, None
    
    return None, "Invalid phone number format. Use international format (+country code + number)"

def validate_form_data(data):
    """Comprehensive form validation"""
    errors = []
    
    # Required fields
    required_fields = {
        'customer_name': 'Customer name',
        'invoice_date': 'Invoice date',
        'invoice_type': 'Invoice type'
    }
    
    for field, label in required_fields.items():
        if not data.get(field, '').strip():
            errors.append(f"{label} is required")
    
    # Email OR phone validation (at least one required)
    email = data.get('customer_email', '').strip()
    phone = data.get('customer_phone', '').strip()
    
    if not email and not phone:
        errors.append("Either email address or phone number is required")
    
    # Email validation (if provided)
    if email and not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
        errors.append("Please enter a valid email address")
    
    # Phone validation (if provided)
    if phone:
        formatted_phone, phone_error = validate_phone_number(phone)
        if phone_error:
            errors.append(phone_error)
        else:
            # Format for display
            data['customer_phone'] = format_phone_display(formatted_phone)
    
    # Line items validation - match frontend field names
    line_items = []
    item_index = 1
    
    while f'vehicle_{item_index}' in data:
        vehicle = data.get(f'vehicle_{item_index}', '').strip()
        quantity = data.get(f'quantity_{item_index}', '').strip()
        price = data.get(f'price_{item_index}', '').strip()
        
        if vehicle or quantity or price:  # If any field has data
            if not vehicle:
                errors.append(f"Vehicle {item_index}: Please select a vehicle")
            if not quantity or not quantity.isdigit() or int(quantity) <= 0:
                errors.append(f"Vehicle {item_index}: Valid quantity is required")
            if not price or not is_valid_price(price.replace(',', '')):\
                errors.append(f"Vehicle {item_index}: Valid price is required")
            
            if vehicle and quantity and price:
                try:
                    qty = int(quantity)
                    # Remove formatting from price
                    price_clean = price.replace(',', '').replace('₦', '').strip()
                    unit_price = float(price_clean)
                    total = qty * unit_price
                    line_items.append({
                        'description': vehicle,
                        'quantity': qty,
                        'unit_price': unit_price,
                        'total': total
                    })
                except ValueError:
                    errors.append(f"Vehicle {item_index}: Invalid quantity or price format")
        
        item_index += 1
    
    if not line_items:
        errors.append("At least one vehicle is required")
    
    data['line_items'] = line_items
    
    return errors

def is_valid_price(price_str):
    """Check if price string is a valid positive number"""
    try:
        price = float(price_str)
        return price > 0
    except ValueError:
        return False

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
        html_content = render_template('invoice_template.html', invoice_data=invoice_data).encode('utf-8')
        
        # Generate PDF from HTML
        pdf_content = create_pdf(html_content, request.base_url) # Pass base_url for asset resolution
        
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
        html_content = render_template('invoice_template.html', invoice_data=invoice_data).encode('utf-8')
        
        # Generate PDF from HTML
        pdf_content = create_pdf(html_content, request.base_url) # Pass base_url for asset resolution
        
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