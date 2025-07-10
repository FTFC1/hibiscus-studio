import datetime
import os
from fpdf import FPDF

class MikanoPDF(FPDF):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.currency_symbol = "NGN " # Default to Naira with space
        
        # Set margins and calculate content width
        self.set_margins(15, 20, 15)
        self.left_margin = 15
        self.right_margin = 15 
        self.top_margin = 20
        self.content_width = 210 - self.left_margin - self.right_margin  # A4 width minus margins
        
        # Mikano Corporate Colors (CORRECT - RED theme, not blue!)
        self.mikano_red = (220, 38, 38)        # Primary Mikano red 
        self.mikano_dark_red = (185, 28, 28)   # Darker red accent
        self.mikano_light_red = (248, 113, 113) # Light red for highlights
        self.mikano_gray = (88, 89, 91)        # Corporate gray
        self.mikano_light_gray = (235, 236, 237) # Light gray backgrounds
        self.mikano_dark_gray = (55, 65, 81)   # Dark gray for text
        
        # Asset paths - using actual provided images
        self.assets_path = os.path.join(os.path.dirname(__file__), 'assets')
        self.header_path = os.path.join(self.assets_path, 'Header Mikano.png')
        self.footer_path = os.path.join(self.assets_path, 'Footer Mikano.png')

    def set_currency(self, currency):
        if currency.upper() == 'USD':
            self.currency_symbol = "$"
        else:
            self.currency_symbol = "NGN "

    def safe_text(self, x, y, text, max_width=None, line_height=5):
        """Add text with proper wrapping and overflow protection"""
        if not text:
            return y
            
        text = str(text).encode('latin-1', 'ignore').decode('latin-1')
        
        if max_width:
            lines = self.wrap_text(text, max_width)
            for line in lines:
                if y > 270:  # Near bottom of page
                    self.add_page()
                    y = 20
                self.text(x, y, line)
                y += line_height
        else:
            self.text(x, y, text)
            y += line_height
        return y

    def wrap_text(self, text, max_width):
        """Wrap text to fit within specified width"""
        words = text.split(' ')
        lines = []
        current_line = []
        
        for word in words:
            test_line = ' '.join(current_line + [word])
            if self.get_string_width(test_line) <= max_width:
                current_line.append(word)
            else:
                if current_line:
                    lines.append(' '.join(current_line))
                    current_line = [word]
                else:
                    lines.append(word)
        
        if current_line:
            lines.append(' '.join(current_line))
        
        return lines

    def multi_cell_safe(self, w, h, text, border=0, align='L', fill=False, max_lines=None):
        """Enhanced multi_cell with overflow protection"""
        if not text:
            self.cell(w, h, '', border, 1, align, fill)
            return
        
        # Store current position
        start_y = self.get_y()
        start_x = self.get_x()
        
        # Calculate text that fits
        words = text.split()
        lines = []
        current_line = ""
        
        for word in words:
            test_line = current_line + (" " if current_line else "") + word
            if self.get_string_width(test_line) <= w - 4:  # 4mm padding
                current_line = test_line
            else:
                if current_line:
                    lines.append(current_line)
                    current_line = word
                else:
                    # Single word too long, truncate it
                    lines.append(word[:15] + "...")
                    current_line = ""
        
        if current_line:
            lines.append(current_line)
        
        # Limit number of lines if specified
        if max_lines and len(lines) > max_lines:
            lines = lines[:max_lines-1] + [lines[max_lines-1][:20] + "..."]
        
        # Draw the multi-cell
        for i, line in enumerate(lines):
            if i == 0:
                self.cell(w, h, line, border if len(lines) == 1 else (border & ~8), 0 if len(lines) > 1 else 1, align, fill)
            elif i == len(lines) - 1:
                self.set_xy(start_x, start_y + (h * i))
                self.cell(w, h, line, border if len(lines) == 1 else (border & ~2), 1, align, fill)
            else:
                self.set_xy(start_x, start_y + (h * i))
                self.cell(w, h, line, border & ~10, 0, align, fill)  # Remove top and bottom borders
        
        if len(lines) == 0:
            self.cell(w, h, '', border, 1, align, fill)

    def header(self):
        # Try to use actual Mikano header image
        if os.path.exists(self.header_path):
            try:
                # Add header image - full width
                self.image(self.header_path, x=10, y=8, w=190)
                self.ln(35)  # Space after header
            except Exception as e:
                print(f"Could not load header image: {e}")
                self._fallback_header()
        else:
            self._fallback_header()
    
    def _fallback_header(self):
        """Fallback header with Mikano red branding"""
        # Red header bar
        self.set_fill_color(*self.mikano_red)
        self.rect(10, 10, 190, 25, 'F')
        
        # Company name in white
        self.set_font('Arial', 'B', 20)
        self.set_text_color(255, 255, 255)
        self.text(15, 28, 'MIKANO INTERNATIONAL LIMITED')
        
        # Subtitle
        self.set_font('Arial', '', 12)
        self.text(15, 35, 'MOTORS DIVISION')
        
        # Contact info in dark gray
        self.set_text_color(*self.mikano_dark_gray)
        self.set_font('Arial', '', 10)
        self.text(140, 28, '65 Adeola Odeku Street,')
        self.text(140, 32, 'Victoria Island, Lagos.')
        self.text(140, 36, '0800 765 43 21')
        
        self.ln(35)

    def footer(self):
        # Try to use actual Mikano footer image
        if os.path.exists(self.footer_path):
            try:
                self.set_y(-25)
                self.image(self.footer_path, x=10, y=self.get_y(), w=190)
            except Exception as e:
                print(f"Could not load footer image: {e}")
                self._fallback_footer()
        else:
            self._fallback_footer()
    
    def _fallback_footer(self):
        """Fallback footer with terms and conditions"""
        self.set_y(-30)
        self.set_fill_color(*self.mikano_light_gray)
        self.rect(10, self.get_y(), 190, 25, 'F')
        
        self.set_font('Arial', 'B', 10)
        self.set_text_color(*self.mikano_red)
        self.text(15, self.get_y() + 8, 'TERMS & CONDITIONS:')
        
        self.set_font('Arial', '', 8)
        self.set_text_color(*self.mikano_dark_gray)
        terms = [
            "• Prices are valid for 30 days from date of quotation",
            "• Payment terms: 50% deposit, balance on delivery",
            "• Delivery: 2-4 weeks from receipt of deposit"
        ]
        
        y_pos = self.get_y() + 12
        for term in terms:
            self.text(15, y_pos, term)
            y_pos += 4

    def create_invoice_content(self, invoice_data):
        # Invoice title with red accent
        self.set_font('Arial', 'B', 16)
        self.set_text_color(*self.mikano_red)
        title = f"PRO FORMA INVOICE - {invoice_data['invoice_type'].upper()}"
        
        # Center the title
        title_width = self.get_string_width(title)
        self.text((210 - title_width) / 2, 50, title)
        
        # Invoice details section
        self.ln(25)
        self._add_invoice_details(invoice_data)
        
        # Customer details section
        self.ln(10)
        self._add_customer_details(invoice_data)
        
        # Line items table
        self.ln(15)
        self._add_line_items_table(invoice_data)
        
        # Totals section
        self.ln(10)
        self._add_totals_section(invoice_data)

    def _add_invoice_details(self, invoice_data):
        """Add invoice number, date, and reference details"""
        y_start = self.get_y()
        
        # Left column
        self.set_font('Arial', 'B', 10)
        self.set_text_color(*self.mikano_dark_gray)
        self.text(15, y_start, 'Invoice No:')
        self.text(15, y_start + 6, 'Date:')
        self.text(15, y_start + 12, 'Valid Until:')
        
        # Right column values
        self.set_font('Arial', '', 10)
        self.text(55, y_start, invoice_data.get('invoice_number', 'PFI-2025-001'))
        self.text(55, y_start + 6, invoice_data.get('invoice_date', datetime.date.today().strftime('%d/%m/%Y')))
        
        # Calculate valid until date (30 days from invoice date)
        valid_until = datetime.date.today() + datetime.timedelta(days=30)
        self.text(55, y_start + 12, valid_until.strftime('%d/%m/%Y'))

    def _add_customer_details(self, invoice_data):
        """Add customer information in a bordered box"""
        y_start = self.get_y()
        
        # Customer details box
        self.set_fill_color(*self.mikano_light_gray)
        self.rect(15, y_start, 180, 30, 'F')
        self.rect(15, y_start, 180, 30)
        
        # Header
        self.set_font('Arial', 'B', 12)
        self.set_text_color(*self.mikano_red)
        self.text(20, y_start + 8, 'BILL TO:')
        
        # Customer details
        self.set_font('Arial', '', 10)
        self.set_text_color(*self.mikano_dark_gray)
        y_pos = y_start + 15
        
        details = [
            invoice_data.get('customer_name', ''),
            invoice_data.get('customer_address', ''),
            f"Phone: {invoice_data.get('customer_phone', '')}",
            f"Email: {invoice_data.get('customer_email', '')}"
        ]
        
        for detail in details:
            if detail.strip():
                self.safe_text(20, y_pos, detail, max_width=170)
                y_pos += 5
        
        self.ln(35)

    def _add_line_items_table(self, invoice_data):
        """Add professional table with line items"""
        line_items = invoice_data.get('line_items', [])
        if not line_items:
            return
        
        y_start = self.get_y()
        
        # Table headers
        self.set_fill_color(*self.mikano_red)
        self.rect(15, y_start, 180, 12, 'F')
        
        # Header text in white
        self.set_font('Arial', 'B', 10)
        self.set_text_color(255, 255, 255)
        
        headers = ['Description', 'Qty', 'Unit Price', 'Total']
        x_positions = [20, 140, 160, 175]
        
        for i, header in enumerate(headers):
            self.text(x_positions[i], y_start + 8, header)
        
        # Table rows
        self.set_text_color(*self.mikano_dark_gray)
        self.set_font('Arial', '', 9)
        
        y_pos = y_start + 15
        for i, item in enumerate(line_items):
            # Alternating row colors
            if i % 2 == 0:
                self.set_fill_color(250, 250, 250)
                self.rect(15, y_pos - 3, 180, 10, 'F')
            
            # Row border
            self.rect(15, y_pos - 3, 180, 10)
            
            # Item data with proper formatting
            description = item.get('description', '')[:35] + ('...' if len(item.get('description', '')) > 35 else '')
            quantity = str(item.get('quantity', 1))
            unit_price = f"{self.currency_symbol}{float(item.get('unit_price', 0)):,.2f}"
            total = f"{self.currency_symbol}{float(item.get('total', 0)):,.2f}"
            
            self.text(20, y_pos + 4, description)
            self.text(145, y_pos + 4, quantity)
            self.text(160, y_pos + 4, unit_price)
            self.text(175, y_pos + 4, total)
            
            y_pos += 10
        
        # Table border
        self.rect(15, y_start, 180, y_pos - y_start)
        self.set_y(y_pos + 5)

    def _add_totals_section(self, invoice_data):
        """Add totals with VAT calculations"""
        subtotal = float(invoice_data.get('subtotal', 0))
        vat_rate = float(invoice_data.get('vat_rate', 7.5))
        vat_amount = subtotal * (vat_rate / 100)
        total = subtotal + vat_amount
        
        y_start = self.get_y()
        
        # Totals box
        self.set_fill_color(*self.mikano_light_gray)
        self.rect(130, y_start, 65, 25, 'F')
        self.rect(130, y_start, 65, 25)
        
        self.set_font('Arial', '', 10)
        self.set_text_color(*self.mikano_dark_gray)
        
        # Subtotal
        self.text(135, y_start + 8, 'Subtotal:')
        self.text(170, y_start + 8, f"{self.currency_symbol}{subtotal:,.2f}")
        
        # VAT
        self.text(135, y_start + 14, f'VAT ({vat_rate}%):')
        self.text(170, y_start + 14, f"{self.currency_symbol}{vat_amount:,.2f}")
        
        # Total
        self.set_font('Arial', 'B', 11)
        self.set_text_color(*self.mikano_red)
        self.text(135, y_start + 21, 'TOTAL:')
        self.text(170, y_start + 21, f"{self.currency_symbol}{total:,.2f}")

    def invoice_details(self, invoice_date, customer_info, invoice_type, invoice_number=None):
        # Enhanced two-column layout with better sizing
        col_width = (self.content_width - 5) / 2  # Split content width with small gap
        
        # Section headers with background
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(255, 255, 255)
        self.set_fill_color(*self.mikano_red)
        
        # Left header
        self.cell(col_width, 10, 'INVOICE DETAILS', 1, 0, 'C', True)
        # Right header with gap
        self.cell(5, 10, '', 0, 0, 'C', False)  # Gap
        self.cell(col_width, 10, 'CUSTOMER INFORMATION', 1, 1, 'C', True)
        
        # Content area backgrounds
        current_y = self.get_y()
        
        # Left column background
        self.set_fill_color(*self.mikano_light_gray)
        self.cell(col_width, 40, '', 1, 0, 'L', True)  # Increased height
        
        # Gap
        self.cell(5, 40, '', 0, 0, 'C', False)
        
        # Right column background
        self.cell(col_width, 40, '', 1, 1, 'L', True)
        
        # Reset position for content
        self.set_xy(self.left_margin, current_y + 3)
        
        # Invoice details (left side)
        self.set_font('Helvetica', '', 9)
        self.set_text_color(*self.mikano_gray)
        
        # Date
        self.cell(25, 6, "Date:", 0, 0)
        self.set_font('Helvetica', 'B', 9)
        self.set_text_color(0, 0, 0)
        self.cell(col_width - 25, 6, invoice_date, 0, 1)
        
        # Invoice number
        if invoice_number:
            self.set_xy(self.left_margin, self.get_y())
            self.set_font('Helvetica', '', 9)
            self.set_text_color(*self.mikano_gray)
            self.cell(25, 6, "Invoice #:", 0, 0)
            self.set_font('Helvetica', 'B', 9)
            self.set_text_color(0, 0, 0)
            safe_number = self.safe_text(self.left_margin, self.get_y(), invoice_number, max_width=col_width - 25)
            self.cell(col_width - 25, 6, safe_number, 0, 1)
        
        # Invoice type
        self.set_xy(self.left_margin, self.get_y())
        self.set_font('Helvetica', '', 9)
        self.set_text_color(*self.mikano_gray)
        self.cell(25, 6, "Type:", 0, 0)
        self.set_font('Helvetica', 'B', 9)
        self.set_text_color(0, 0, 0)
        
        invoice_type_display = {
            'standard': 'Standard (VAT Inclusive)',
            'government': 'Government (VAT Exempt)', 
            'usd': 'USD Export',
            'discount': 'Discount Price',
            'aftersales': 'Aftersales Service'
        }.get(invoice_type, 'Standard')
        
        safe_type = self.safe_text(self.left_margin, self.get_y(), invoice_type_display, max_width=col_width - 25)
        self.cell(col_width - 25, 6, safe_type, 0, 1)
        
        # Customer details (right side)
        right_x = self.left_margin + col_width + 5
        self.set_xy(right_x, current_y + 3)
        
        # Customer name
        self.set_font('Helvetica', '', 9)
        self.set_text_color(*self.mikano_gray)
        label = "Attn:" if invoice_type == 'government' else "Name:"
        self.cell(20, 6, label, 0, 0)
        self.set_font('Helvetica', 'B', 9)
        self.set_text_color(0, 0, 0)
        safe_name = self.safe_text(right_x, self.get_y(), customer_info.get('name', ''), max_width=col_width - 20)
        self.cell(col_width - 20, 6, safe_name, 0, 1)
        
        # Phone
        self.set_xy(right_x, self.get_y())
        self.set_font('Helvetica', '', 9)
        self.set_text_color(*self.mikano_gray)
        self.cell(20, 6, "Phone:", 0, 0)
        self.set_font('Helvetica', '', 9)
        self.set_text_color(0, 0, 0)
        safe_phone = self.safe_text(right_x, self.get_y(), customer_info.get('phone', ''), max_width=col_width - 20)
        self.cell(col_width - 20, 6, safe_phone, 0, 1)
        
        # Email (if provided)
        if customer_info.get('email'):
            self.set_xy(right_x, self.get_y())
            self.set_font('Helvetica', '', 9)
            self.set_text_color(*self.mikano_gray)
            self.cell(20, 6, "Email:", 0, 0)
            self.set_font('Helvetica', '', 9)
            self.set_text_color(0, 0, 0)
            safe_email = self.safe_text(right_x, self.get_y(), customer_info.get('email', ''), max_width=col_width - 20)
            self.cell(col_width - 20, 6, safe_email, 0, 1)
        
        # Address (multi-line with proper wrapping)
        self.set_xy(right_x, self.get_y())
        self.set_font('Helvetica', '', 9)
        self.set_text_color(*self.mikano_gray)
        self.cell(20, 6, "Address:", 0, 0)
        
        # Handle long addresses properly
        address = customer_info.get('address', '')
        if address:
            # Move to address content area
            self.set_xy(right_x, self.get_y() + 6)
            self.set_font('Helvetica', '', 8)
            self.set_text_color(0, 0, 0)
            
            # Use multi-cell for address with line limit
            current_x = self.get_x()
            current_y = self.get_y()
            self.multi_cell_safe(col_width - 5, 4, address, 0, 'L', False, max_lines=3)
        
        self.ln(15)

    def invoice_table(self, items):
        # Enhanced table with responsive column widths
        available_width = self.content_width
        
        # Dynamic column widths based on content
        col_widths = {
            'desc': available_width * 0.50,  # 50% for description
            'qty': available_width * 0.12,   # 12% for quantity
            'unit': available_width * 0.19,  # 19% for unit price
            'total': available_width * 0.19  # 19% for total
        }
        
        self.set_font('Helvetica', 'B', 10)
        self.set_fill_color(*self.mikano_red)
        self.set_text_color(255, 255, 255)
        self.set_draw_color(*self.mikano_red)
        
        # Table header
        self.cell(col_widths['desc'], 12, 'VEHICLE DESCRIPTION', 1, 0, 'L', True)
        self.cell(col_widths['qty'], 12, 'QTY', 1, 0, 'C', True)
        self.cell(col_widths['unit'], 12, 'UNIT PRICE', 1, 0, 'R', True)
        self.cell(col_widths['total'], 12, 'TOTAL AMOUNT', 1, 1, 'R', True)

        # Table rows with enhanced styling and overflow protection
        self.set_font('Helvetica', '', 9)
        self.set_text_color(0, 0, 0)
        self.set_draw_color(*self.mikano_gray)
        
        for i, item in enumerate(items):
            # Check if we need a new page
            if self.get_y() > 250:
                self.add_page()
            
            # Alternate row colors for better readability
            if i % 2 == 0:
                self.set_fill_color(250, 250, 250)  # Very light gray
            else:
                self.set_fill_color(255, 255, 255)  # White
            
            # Description with proper text wrapping
            desc = item['description']
            safe_desc = self.safe_text(self.left_margin, self.get_y(), desc, max_width=col_widths['desc'] - 2)
            
            if 'Changan' in desc or any(model in desc for model in ['Alsvin', 'CS75', 'Hunter', 'Oshan', 'Uni-T']):
                self.set_font('Helvetica', 'B', 9)
            else:
                self.set_font('Helvetica', '', 9)
                
            self.cell(col_widths['desc'], 10, safe_desc, 1, 0, 'L', True)
            
            # Quantity
            self.set_font('Helvetica', '', 9)
            self.cell(col_widths['qty'], 10, str(item['quantity']), 1, 0, 'C', True)
            
            # Unit price
            unit_price_text = f"{self.currency_symbol}{item['unit_price']:,.0f}"
            safe_unit_price = self.safe_text(self.left_margin, self.get_y(), unit_price_text, max_width=col_widths['unit'] - 2)
            self.cell(col_widths['unit'], 10, safe_unit_price, 1, 0, 'R', True)
            
            # Total amount in bold
            self.set_font('Helvetica', 'B', 9)
            total_text = f"{self.currency_symbol}{item['total']:,.0f}"
            safe_total = self.safe_text(self.left_margin, self.get_y(), total_text, max_width=col_widths['total'] - 2)
            self.cell(col_widths['total'], 10, safe_total, 1, 1, 'R', True)
        
        self.ln(8)

    def totals_section(self, subtotal, vat, grand_total, invoice_type):
        # Professional totals section with responsive design
        total_col_width = self.content_width * 0.25  # 25% of content width
        label_col_width = self.content_width * 0.25  # 25% of content width
        start_x = self.content_width - total_col_width - label_col_width
        
        self.set_font('Helvetica', '', 10)
        self.set_text_color(*self.mikano_gray)
        
        # Subtotal
        self.cell(start_x, 8, '')
        self.cell(label_col_width, 8, 'Subtotal:', 0, 0, 'R')
        self.set_font('Helvetica', 'B', 10)
        self.set_text_color(0, 0, 0)
        subtotal_text = f"{self.currency_symbol}{subtotal:,.0f}"
        safe_subtotal = self.safe_text(start_x, self.get_y(), subtotal_text, max_width=total_col_width)
        self.cell(total_col_width, 8, safe_subtotal, 1, 1, 'R')

        # VAT (if applicable)
        if invoice_type != 'government':
            self.set_font('Helvetica', '', 10)
            self.set_text_color(*self.mikano_gray)
            self.cell(start_x, 8, '')
            self.cell(label_col_width, 8, 'VAT (7.5%):', 0, 0, 'R')
            self.set_font('Helvetica', 'B', 10)
            self.set_text_color(0, 0, 0)
            vat_text = f"{self.currency_symbol}{vat:,.0f}"
            safe_vat = self.safe_text(start_x, self.get_y(), vat_text, max_width=total_col_width)
            self.cell(total_col_width, 8, safe_vat, 1, 1, 'R')

        # Grand total with emphasis
        self.ln(2)
        self.set_font('Helvetica', 'B', 12)
        self.set_fill_color(*self.mikano_red)
        self.set_text_color(255, 255, 255)
        self.cell(start_x, 12, '')
        self.cell(label_col_width, 12, 'GRAND TOTAL:', 1, 0, 'R', True)
        
        grand_total_text = f"{self.currency_symbol}{grand_total:,.0f}"
        safe_grand_total = self.safe_text(start_x, self.get_y(), grand_total_text, max_width=total_col_width)
        self.cell(total_col_width, 12, safe_grand_total, 1, 1, 'R', True)
        
        # Amount in words (professional touch)
        self.ln(5)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(*self.mikano_gray)
        amount_words = self.number_to_words(grand_total)
        words_text = f"Amount in words: {amount_words} only"
        safe_words = self.safe_text(self.left_margin, self.get_y(), words_text, max_width=self.content_width)
        self.cell(0, 6, safe_words, 0, 1, 'L')
        
        self.ln(5)

    def number_to_words(self, amount):
        """Convert number to words (simplified version for Nigerian Naira)"""
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

def parse_form_data(form_data):
    # Enhanced parsing with better price handling
    parsed = {
        'invoice_type': form_data.get('invoice_type', ['standard'])[0],
        'invoice_date': form_data.get('invoice_date', [datetime.date.today().strftime('%Y-%m-%d')])[0],
        'invoice_number': form_data.get('invoice_number', [None])[0],
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

def create_pdf(form_data):
    data = parse_form_data(form_data)
    invoice_type = data['invoice_type']

    pdf = MikanoPDF(orientation='P', unit='mm', format='A4')
    if invoice_type == 'usd':
        pdf.set_currency('USD')
    
    pdf.add_page()
    pdf.create_invoice_content(data)

    subtotal = 0
    for item in data['items']:
        item['total'] = item['quantity'] * item['unit_price']
        subtotal += item['total']

    if data['transport_cost'] > 0:
        data['items'].append({
            'description': 'Transport & Delivery Service', 
            'quantity': 1, 
            'unit_price': data['transport_cost'], 
            'total': data['transport_cost']
        })
        subtotal += data['transport_cost']
        
    if data['registration_cost'] > 0:
        data['items'].append({
            'description': 'Vehicle Registration & Documentation', 
            'quantity': 1, 
            'unit_price': data['registration_cost'], 
            'total': data['registration_cost']
        })
        subtotal += data['registration_cost']

    pdf.invoice_table(data['items'])

    vat = 0 if invoice_type == 'government' else subtotal * 0.075
    grand_total = subtotal + vat

    pdf.totals_section(subtotal, vat, grand_total, invoice_type)

    return pdf.output(dest='S')
