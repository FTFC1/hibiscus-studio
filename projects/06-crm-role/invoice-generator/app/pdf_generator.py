from weasyprint import HTML
import datetime

def create_pdf(html_content, invoice_data):
    """Generates a PDF from HTML content using WeasyPrint."""
    # WeasyPrint can handle relative paths for assets if base_url is provided
    # For now, we'll assume all assets are embedded or absolute URLs
    
    # You can add custom CSS here if needed, or embed it directly in the HTML template
    # css = CSS(string='body { font-family: sans-serif; }')

    # Generate PDF
    pdf_bytes = HTML(string=html_content).write_pdf()
    return pdf_bytes

def parse_form_data(form_data):
    """Parses form data into a structured dictionary for the invoice template."""
    parsed = {
        'invoice_type': form_data.get('invoice_type', ['standard'])[0],
        'invoice_date': form_data.get('invoice_date', [datetime.date.today().strftime('%Y-%m-%d')])[0],
        'invoice_number': form_data.get('invoice_number', ['PFI-2025-001'])[0],
        'customer_info': {
            'name': form_data.get('customer_name', [''])[0],
            'phone': form_data.get('customer_phone', [''])[0],
            'address': form_data.get('customer_address', [''])[0],
            'email': form_data.get('customer_email', [''])[0],
        },
        'transport_cost': float(form_data.get('transport_cost', [0])[0] or 0),
        'registration_cost': float(form_data.get('registration_cost', [0])[0] or 0),
        'items': []
    }

    item_keys = sorted([k for k in form_data if k.startswith('vehicle_')])
    for key in item_keys:
        if '_' in key:  # Safe check for split operation
            index = key.split('_')[1]
            vehicle_description = form_data.get(f'vehicle_{index}', [''])[0]
            if vehicle_description:
                price_str = form_data.get(f'price_{index}', ['0'])[0]
                # Handle comma-separated numbers
                if isinstance(price_str, str):
                    price_str = price_str.replace(',', '')
                
                parsed['items'].append({
                    'description': vehicle_description,
                    'quantity': int(form_data.get(f'quantity_{index}', [1])[0]),
                    'unit_price': float(price_str) if price_str else 0.0,
                })
    return parsed

def number_to_words(amount):
    """Convert number to words (simplified version for Nigerian Naira)"""
    # This is a placeholder. A full implementation would be more complex.
    if amount >= 1000000:
        millions = int(amount / 1000000)
        remainder = amount % 1000000
        if remainder > 0:
            if remainder >= 1000:
                thousands = int(remainder / 1000)
                return f"{millions:,} million {thousands:,} thousand Naira"
            else:
                return f"{millions:,} million {int(remainder):,} Naira"
        else:
            return f"{millions:,} million Naira"
    elif amount >= 1000:
        thousands = int(amount / 1000)
        remainder = amount % 1000
        if remainder > 0:
            return f"{thousands:,} thousand {int(remainder):,} Naira"
        else:
            return f"{thousands:,} thousand Naira"
    else:
        return f"{int(amount):,} Naira"