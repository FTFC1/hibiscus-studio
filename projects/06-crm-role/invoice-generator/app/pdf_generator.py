import datetime
from fpdf import FPDF

class PDF(FPDF):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.currency_symbol = "NGN " # Default to Naira with space

    def set_currency(self, currency):
        if currency.upper() == 'USD':
            self.currency_symbol = "$"
        else:
            self.currency_symbol = "NGN "

    def header(self):
        # In a real scenario, you'd use a logo image: self.image('logo.png', 10, 8, 33)
        self.set_font('Helvetica', 'B', 18)
        self.cell(0, 8, 'MIKANO INTERNATIONAL LIMITED', 0, 1, 'C')
        self.set_font('Helvetica', '', 9)
        self.cell(0, 5, 'Plot 34/35, Acme Road, Ogba Industrial Scheme, Ikeja, Lagos', 0, 1, 'C')
        self.cell(0, 5, 'Phone: +234-803-123-4567 | Email: motors@mikano-intl.com', 0, 1, 'C')
        self.ln(8)
        self.set_font('Helvetica', 'B', 14)
        self.set_fill_color(230, 230, 230)
        self.cell(0, 10, 'PRO-FORMA INVOICE', 0, 1, 'C', True)
        self.ln(5)

    def footer(self):
        self.set_y(-30)
        self.set_font('Helvetica', 'I', 8)
        self.cell(0, 5, 'Make all cheques payable to MIKANO INTERNATIONAL LIMITED', 0, 1, 'C')
        self.cell(0, 5, 'This is a computer-generated invoice and requires no signature.', 0, 1, 'C')
        self.set_font('Helvetica', '', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

    def invoice_details(self, invoice_date, customer_info, invoice_type):
        self.set_font('Helvetica', 'B', 10)
        self.cell(40, 6, "Invoice Date:", 0, 0)
        self.set_font('Helvetica', '', 10)
        self.cell(40, 6, invoice_date, 0, 1)
        self.ln(5)

        self.set_font('Helvetica', 'B', 10)
        self.cell(40, 6, 'BILL TO:')
        self.ln()
        self.set_font('Helvetica', '', 10)
        
        label = "Attn:" if invoice_type == 'government' else "Name:"
        self.cell(20, 6, label)
        self.cell(80, 6, customer_info.get('name', ''))
        self.ln()
        self.cell(20, 6, "Address:")
        self.cell(80, 6, customer_info.get('address', ''))
        self.ln()
        self.cell(20, 6, "Phone:")
        self.cell(80, 6, customer_info.get('phone', ''))
        self.ln(12)

    def invoice_table(self, items):
        self.set_font('Helvetica', 'B', 10)
        self.set_fill_color(220, 220, 220)
        col_widths = {'desc': 95, 'qty': 25, 'unit': 35, 'total': 35}
        
        self.cell(col_widths['desc'], 8, 'Description', 1, 0, 'L', 1)
        self.cell(col_widths['qty'], 8, 'Quantity', 1, 0, 'C', 1)
        self.cell(col_widths['unit'], 8, 'Unit Price', 1, 0, 'R', 1)
        self.cell(col_widths['total'], 8, 'Total', 1, 1, 'R', 1)

        self.set_font('Helvetica', '', 10)
        for item in items:
            self.cell(col_widths['desc'], 7, item['description'], 'LR')
            self.cell(col_widths['qty'], 7, str(item['quantity']), 'LR', 0, 'C')
            self.cell(col_widths['unit'], 7, f"{self.currency_symbol}{item['unit_price']:,.2f}", 'LR', 0, 'R')
            self.cell(col_widths['total'], 7, f"{self.currency_symbol}{item['total']:,.2f}", 'LR', 1, 'R')
        
        self.cell(sum(col_widths.values()), 0, '', 'T')
        self.ln()

    def totals_section(self, subtotal, vat, grand_total, invoice_type):
        self.set_font('Helvetica', '', 10)
        total_col_width = 35
        label_col_width = 35
        
        self.cell(190 - total_col_width - label_col_width, 6, '')
        self.cell(label_col_width, 6, 'Subtotal', 0, 0, 'R')
        self.cell(total_col_width, 6, f"{self.currency_symbol}{subtotal:,.2f}", 1, 1, 'R')

        if invoice_type != 'government':
            self.cell(190 - total_col_width - label_col_width, 6, '')
            self.cell(label_col_width, 6, 'VAT (7.5%)', 0, 0, 'R')
            self.cell(total_col_width, 6, f"{self.currency_symbol}{vat:,.2f}", 1, 1, 'R')

        self.set_font('Helvetica', 'B', 11)
        self.cell(190 - total_col_width - label_col_width, 8, '')
        self.cell(label_col_width, 8, 'Grand Total', 1, 0, 'R', 1)
        self.cell(total_col_width, 8, f"{self.currency_symbol}{grand_total:,.2f}", 1, 1, 'R', 1)

def parse_form_data(form_data):
    parsed = {
        'invoice_type': form_data.get('invoice_type', ['standard'])[0],
        'invoice_date': form_data.get('invoice_date', [datetime.date.today().strftime('%Y-%m-%d')])[0],
        'customer_info': {
            'name': form_data.get('customer_name', [''])[0],
            'phone': form_data.get('customer_phone', [''])[0],
            'address': form_data.get('customer_address', [''])[0],
        },
        'transport_cost': float(form_data.get('transport_cost', [0])[0] or 0),
        'registration_cost': float(form_data.get('registration_cost', [0])[0] or 0),
        'items': []
    }

    item_keys = sorted([k for k in form_data if k.startswith('vehicle_')])
    for key in item_keys:
        index = key.split('_')[1]
        vehicle_description = form_data.get(f'vehicle_{index}', [''])[0]
        if vehicle_description:
            price_str = form_data.get(f'price_{index}', ['0'])[0]
            parsed['items'].append({
                'description': vehicle_description,
                'quantity': int(form_data.get(f'quantity_{index}', [1])[0]),
                'unit_price': float(price_str) if price_str else 0.0,
            })
    return parsed

def create_pdf(form_data):
    data = parse_form_data(form_data)
    invoice_type = data['invoice_type']

    pdf = PDF(orientation='P', unit='mm', format='A4')
    if invoice_type == 'usd':
        pdf.set_currency('USD')
    
    pdf.add_page()
    pdf.invoice_details(data['invoice_date'], data['customer_info'], invoice_type)

    subtotal = 0
    for item in data['items']:
        item['total'] = item['quantity'] * item['unit_price']
        subtotal += item['total']

    if data['transport_cost'] > 0:
        data['items'].append({'description': 'Transport Cost', 'quantity': 1, 'unit_price': data['transport_cost'], 'total': data['transport_cost']})
        subtotal += data['transport_cost']
    if data['registration_cost'] > 0:
        data['items'].append({'description': 'Registration Cost', 'quantity': 1, 'unit_price': data['registration_cost'], 'total': data['registration_cost']})
        subtotal += data['registration_cost']

    pdf.invoice_table(data['items'])

    vat = 0 if invoice_type == 'government' else subtotal * 0.075
    grand_total = subtotal + vat

    pdf.totals_section(subtotal, vat, grand_total, invoice_type)

    return pdf.output(dest='S')
