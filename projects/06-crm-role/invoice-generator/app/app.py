from flask import Flask, render_template, request, send_file, jsonify
from pdf_generator import create_pdf
from sheets_client import get_vehicle_catalog
from io import BytesIO
import re

app = Flask(__name__)

def validate_phone_number(phone):
    """Validate and format international phone numbers"""
    if not phone:
        return None, "Phone number is required"
    
    # Remove all non-digits and plus signs
    cleaned = re.sub(r'[^\d+]', '', phone)
    
    # International phone number patterns
    patterns = {
        # Nigeria
        'NG': {
            'pattern': r'^\+?234[789]\d{9}$',
            'format': lambda x: f"+234{x[-10:]}",
            'local_pattern': r'^0[789]\d{9}$',
            'local_format': lambda x: f"+234{x[1:]}"
        },
        # United Kingdom  
        'GB': {
            'pattern': r'^\+?44[17]\d{8,9}$',
            'format': lambda x: f"+44{x[-10:] if len(x) == 13 else x[-9:]}",
            'local_pattern': r'^0[17]\d{8,9}$',
            'local_format': lambda x: f"+44{x[1:]}"
        },
        # United States/Canada
        'US': {
            'pattern': r'^\+?1[2-9]\d{9}$',
            'format': lambda x: f"+1{x[-10:]}",
            'local_pattern': r'^[2-9]\d{9}$',
            'local_format': lambda x: f"+1{x}"
        },
        # South Africa
        'ZA': {
            'pattern': r'^\+?27[1-9]\d{8}$',
            'format': lambda x: f"+27{x[-9:]}",
            'local_pattern': r'^0[1-9]\d{8}$',
            'local_format': lambda x: f"+27{x[1:]}"
        },
        # Ghana
        'GH': {
            'pattern': r'^\+?233[25]\d{8}$',
            'format': lambda x: f"+233{x[-9:]}",
            'local_pattern': r'^0[25]\d{8}$',
            'local_format': lambda x: f"+233{x[1:]}"
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
        'customer_phone': 'Phone number',
        'customer_email': 'Email address',
        'invoice_date': 'Invoice date',
        'invoice_type': 'Invoice type'
    }
    
    for field, label in required_fields.items():
        if not data.get(field, '').strip():
            errors.append(f"{label} is required")
    
    # Email validation
    email = data.get('customer_email', '').strip()
    if email and not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
        errors.append("Please enter a valid email address")
    
    # Phone validation
    phone = data.get('customer_phone', '').strip()
    if phone:
        formatted_phone, phone_error = validate_phone_number(phone)
        if phone_error:
            errors.append(phone_error)
        else:
            data['customer_phone'] = formatted_phone
    
    # Line items validation
    line_items = []
    item_index = 0
    while f'description_{item_index}' in data:
        description = data.get(f'description_{item_index}', '').strip()
        quantity = data.get(f'quantity_{item_index}', '').strip()
        unit_price = data.get(f'unit_price_{item_index}', '').strip()
        
        if description or quantity or unit_price:  # If any field has data
            if not description:
                errors.append(f"Line item {item_index + 1}: Description is required")
            if not quantity or not quantity.isdigit() or int(quantity) <= 0:
                errors.append(f"Line item {item_index + 1}: Valid quantity is required")
            if not unit_price or not is_valid_price(unit_price):
                errors.append(f"Line item {item_index + 1}: Valid unit price is required")
            
            if description and quantity and unit_price:
                try:
                    qty = int(quantity)
                    price = float(unit_price)
                    total = qty * price
                    line_items.append({
                        'description': description,
                        'quantity': qty,
                        'unit_price': price,
                        'total': total
                    })
                except ValueError:
                    errors.append(f"Line item {item_index + 1}: Invalid quantity or price format")
        
        item_index += 1
    
    if not line_items:
        errors.append("At least one line item is required")
    
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
    vehicles = get_vehicle_catalog()
    return render_template('index.html', vehicles=vehicles)

@app.route('/preview', methods=['POST'])
def preview_pdf():
    """Generate and preview PDF in browser"""
    try:
        # Get form data
        form_data = request.form.to_dict()
        
        # Validate form data
        errors = validate_form_data(form_data)
        
        if errors:
            return jsonify({'success': False, 'errors': errors}), 400
        
        # Calculate totals from validated line items
        line_items = form_data['line_items']
        subtotal = sum(item['total'] for item in line_items)
        vat_rate = 7.5
        vat_amount = subtotal * (vat_rate / 100)
        total = subtotal + vat_amount
        
        # Prepare invoice data
        invoice_data = {
            'customer_name': form_data.get('customer_name'),
            'customer_address': form_data.get('customer_address', ''),
            'customer_phone': form_data.get('customer_phone'),
            'customer_email': form_data.get('customer_email'),
            'invoice_date': form_data.get('invoice_date'),
            'invoice_number': form_data.get('invoice_number', 'PFI-2025-001'),
            'invoice_type': form_data.get('invoice_type', 'standard'),
            'line_items': line_items,
            'subtotal': subtotal,
            'vat_rate': vat_rate,
            'vat_amount': vat_amount,
            'total': total
        }
        
        # Generate PDF
        pdf_content = create_pdf(invoice_data)
        
        # Return PDF for preview in browser
        pdf_file = BytesIO(pdf_content)
        return send_file(
            pdf_file, 
            mimetype='application/pdf',
            as_attachment=False,  # Preview in browser
            download_name=f'preview_invoice_{invoice_data["invoice_number"]}.pdf'
        )
        
    except Exception as e:
        return jsonify({'success': False, 'errors': [f'Error generating preview: {str(e)}']}), 500

@app.route('/generate', methods=['POST'])
def generate_invoice():
    """Generate and download PDF"""
    try:
        # Get form data
        form_data = request.form.to_dict()
        
        # Validate form data
        errors = validate_form_data(form_data)
        
        if errors:
            return jsonify({'success': False, 'errors': errors}), 400
        
        # Calculate totals from validated line items
        line_items = form_data['line_items']
        subtotal = sum(item['total'] for item in line_items)
        vat_rate = 7.5
        vat_amount = subtotal * (vat_rate / 100)
        total = subtotal + vat_amount
        
        # Prepare invoice data
        invoice_data = {
            'customer_name': form_data.get('customer_name'),
            'customer_address': form_data.get('customer_address', ''),
            'customer_phone': form_data.get('customer_phone'),
            'customer_email': form_data.get('customer_email'),
            'invoice_date': form_data.get('invoice_date'),
            'invoice_number': form_data.get('invoice_number', 'PFI-2025-001'),
            'invoice_type': form_data.get('invoice_type', 'standard'),
            'line_items': line_items,
            'subtotal': subtotal,
            'vat_rate': vat_rate,
            'vat_amount': vat_amount,
            'total': total
        }
        
        # Generate PDF
        pdf_content = create_pdf(invoice_data)
        
        # Return PDF for download
        pdf_file = BytesIO(pdf_content)
        return send_file(
            pdf_file, 
            mimetype='application/pdf',
            as_attachment=True,  # Download file
            download_name=f'invoice_{invoice_data["invoice_number"]}.pdf'
        )
        
    except Exception as e:
        return jsonify({'success': False, 'errors': [f'Error generating invoice: {str(e)}']}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)
