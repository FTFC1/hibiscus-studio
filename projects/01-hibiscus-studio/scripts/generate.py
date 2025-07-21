#!/usr/bin/env python3
import json
import os
import shutil
from datetime import datetime
# import weasyprint
from jinja2 import Environment, FileSystemLoader

class ContentGenerator:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.data_file = os.path.join(self.base_dir, 'data', 'content.json')
        self.templates_dir = os.path.join(self.base_dir, 'templates')
        self.output_dir = os.path.join(self.base_dir, 'output')
        self.website_dir = os.path.join(self.base_dir, 'current-june-28-2025')
        
        # Ensure output directory exists
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Setup Jinja2 environment
        self.env = Environment(loader=FileSystemLoader(self.templates_dir))
        
        # Load content data
        with open(self.data_file, 'r') as f:
            self.data = json.load(f)
    
    def generate_pdf(self):
        """Generate PDF from HTML template"""
        print("🔹 Generating PDF...")
        
        # Load template
        template = self.env.get_template('price-list.html')
        
        # Render HTML with data
        html_content = template.render(**self.data)
        
        # Create temporary HTML file with embedded CSS
        temp_html = os.path.join(self.output_dir, 'temp_price_list.html')
        
        # Read CSS file
        css_file = os.path.join(self.templates_dir, 'styles.css')
        with open(css_file, 'r') as f:
            css_content = f.read()
        
        # Embed CSS in HTML
        html_with_css = html_content.replace(
            '<link rel="stylesheet" href="styles.css">',
            f'<style>{css_content}</style>'
        )
        
        # Write temporary HTML file
        with open(temp_html, 'w') as f:
            f.write(html_with_css)
        
        # Generate PDF
        pdf_filename = f"Hibiscus Studio - Price List & FAQ 005.pdf"
        pdf_path = os.path.join(self.output_dir, pdf_filename)
        
        # Use Playwright for PDF generation
        from playwright.sync_api import sync_playwright
        
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch()
                page = browser.new_page()
                page.goto(f"file://{os.path.abspath(temp_html)}")
                page.pdf(
                    path=pdf_path,
                    format='A4',
                    margin={'top': '1cm', 'bottom': '1cm', 'left': '1cm', 'right': '1cm'},
                    print_background=True
                )
                browser.close()
        except Exception as e:
            # Fallback: just save HTML and let user know
            html_path = pdf_path.replace('.pdf', '.html')
            shutil.copy(temp_html, html_path)
            print(f"⚠️  PDF generation failed: {e}")
            print(f"   HTML saved as: {os.path.basename(html_path)}")
            return html_path
        
        # Clean up temporary file
        os.remove(temp_html)
        
        print(f"✅ PDF generated: {pdf_filename}")
        return pdf_path
    
    def update_website(self):
        """Update website with new pricing and content"""
        print("🔹 Updating website...")
        
        # Read current index.html
        index_file = os.path.join(self.website_dir, 'index.html')
        with open(index_file, 'r') as f:
            html_content = f.read()
        
        # Update pricing in the HTML (this is a simplified approach)
        # In practice, you'd want more sophisticated HTML parsing
        updated_html = self._update_website_pricing(html_content)
        updated_html = self._add_faq_section(updated_html)
        updated_html = self._add_youtube_placeholder(updated_html)
        
        # Write updated HTML
        with open(index_file, 'w') as f:
            f.write(updated_html)
        
        print("✅ Website updated")
    
    def _update_website_pricing(self, html_content):
        """Update pricing in website HTML"""
        # This is a basic implementation - you'd want more robust HTML parsing
        # For now, let's just update the specific pricing values
        
        # Update the booking options with £45 pricing
        pricing_updates = {
            '£100': '£45',
            '£300': '£180',  # 4 hours
            '£420': '£270',  # 6 hours  
            '£600': '£360',  # 8 hours
            '£840': '£450',  # Full day
        }
        
        for old_price, new_price in pricing_updates.items():
            html_content = html_content.replace(old_price, new_price)
        
        return html_content
    
    def _add_faq_section(self, html_content):
        """Add FAQ section to website"""
        faq_html = '\n        <!-- FAQ Section -->\n'
        faq_html += '        <section id="faq" class="py-20 bg-gray-50">\n'
        faq_html += '            <div class="container mx-auto px-6">\n'
        faq_html += '                <h2 class="text-4xl font-bold text-center mb-16 text-gray-800">Frequently Asked Questions</h2>\n'
        faq_html += '                <div class="max-w-4xl mx-auto space-y-6">\n'
        
        for faq in self.data['faqs']:
            faq_html += '                    <div class="bg-white rounded-lg shadow-md p-6">\n'
            faq_html += f'                        <h3 class="text-xl font-semibold mb-3 text-gray-800">{faq["question"]}</h3>\n'
            # Handle multi-line answers
            answer_lines = faq["answer"].split('\n')
            faq_html += '                        <div class="text-gray-600">\n'
            for line in answer_lines:
                if line.strip():
                    faq_html += f'                            <p class="mb-2">{line.strip()}</p>\n'
            faq_html += '                        </div>\n'
            faq_html += '                    </div>\n'
        
        faq_html += '                </div>\n'
        faq_html += '            </div>\n'
        faq_html += '        </section>\n'
        
        # Insert before the footer
        footer_start = html_content.find('<footer')
        if footer_start != -1:
            html_content = html_content[:footer_start] + faq_html + '\n        ' + html_content[footer_start:]
        
        return html_content
    
    def _add_youtube_placeholder(self, html_content):
        """Add YouTube virtual tour placeholder"""
        youtube_html = '\n                    <div class="text-center mt-8">\n'
        youtube_html += '                        <h3 class="text-xl font-semibold mb-4 text-gray-800">Virtual Tour</h3>\n'
        youtube_html += '                        <p class="text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200">\n'
        youtube_html += '                            🎥 Virtual tour coming soon! Check back 11th-15th August for our studio walkthrough.\n'
        youtube_html += '                        </p>\n'
        youtube_html += '                    </div>\n'
        
        # Find a good place to insert this (after the hero section)
        hero_end = html_content.find('</section>', html_content.find('hero'))
        if hero_end != -1:
            html_content = html_content[:hero_end] + youtube_html + '\n            ' + html_content[hero_end:]
        
        return html_content
    
    def generate_acuity_content(self):
        """Generate copy-paste ready content for Acuity"""
        print("🔹 Generating Acuity content...")
        
        acuity_file = os.path.join(self.output_dir, 'acuity-content.txt')
        
        with open(acuity_file, 'w') as f:
            f.write("ACUITY SCHEDULING UPDATES\n")
            f.write("=" * 50 + "\n\n")
            
            f.write("PRICING UPDATES (Copy these into your service descriptions):\n")
            f.write("-" * 30 + "\n\n")
            
            # Event Hire
            f.write("EVENT HIRE:\n")
            for option in self.data['pricing']['event_hire']['options']:
                f.write(f"  {option['duration']}: £{option['price']}\n")
            f.write("\n")
            
            # Workshop Hire  
            f.write("WORKSHOP HIRE:\n")
            for option in self.data['pricing']['workshop_hire']['options']:
                f.write(f"  {option['duration']}: £{option['price']}\n")
            f.write("\n")
            
            # Content Creation
            f.write("CONTENT CREATION:\n")
            for option in self.data['pricing']['content_creation']['options']:
                f.write(f"  {option['duration']}: £{option['price']}\n")
            f.write("\n\n")
            
            f.write("FAQ CONTENT (Copy into Acuity FAQ section):\n")
            f.write("-" * 30 + "\n\n")
            
            for faq in self.data['faqs']:
                f.write(f"Q: {faq['question']}\n")
                f.write(f"A: {faq['answer']}\n")
                f.write("\n" + "⸻" + "\n\n")
            
            f.write("TERMS & CONDITIONS (Copy into Acuity Terms section):\n")
            f.write("-" * 30 + "\n\n")
            
            for term in self.data['terms_and_conditions']:
                f.write(f"{term['title']}:\n")
                f.write(f"{term['content']}\n\n")
        
        print(f"✅ Acuity content generated: acuity-content.txt")
        return acuity_file
    
    def run_all(self):
        """Run all generation tasks"""
        print("🚀 Starting content generation...\n")
        
        pdf_path = self.generate_pdf()
        self.update_website()
        acuity_path = self.generate_acuity_content()
        
        print(f"\n🎉 All content generated successfully!")
        print(f"📁 Check the output folder: {self.output_dir}")
        print(f"📄 PDF: {os.path.basename(pdf_path)}")
        print(f"🌐 Website: Updated in place")
        print(f"📋 Acuity: {os.path.basename(acuity_path)}")

if __name__ == "__main__":
    generator = ContentGenerator()
    generator.run_all() 