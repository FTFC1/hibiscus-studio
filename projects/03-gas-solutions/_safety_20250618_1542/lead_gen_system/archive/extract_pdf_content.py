import pdfplumber
import PyPDF2

def scan_pdf_for_text(pdf_path, max_scan=20):
    """Scan through PDF to find pages with actual text content"""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            total_pages = len(pdf.pages)
            print(f"📖 Scanning {min(max_scan, total_pages)} pages for text content...")
            
            text_pages = []
            for i in range(min(max_scan, total_pages)):
                try:
                    page = pdf.pages[i]
                    page_text = page.extract_text()
                    if page_text and len(page_text.strip()) > 50:  # Meaningful text
                        text_pages.append((i+1, len(page_text.strip())))
                        print(f"📝 Page {i+1}: {len(page_text.strip())} characters")
                except Exception as e:
                    print(f"❌ Error scanning page {i+1}: {e}")
            
            print(f"📊 Found text on {len(text_pages)} pages")
            return text_pages
    except Exception as e:
        print(f"❌ Error scanning PDF: {e}")
        return []

def extract_pdf_content(pdf_path, max_pages=5, start_page=0):
    """Extract text content from PDF using pdfplumber"""
    try:
        print(f"🔧 Opening PDF: {pdf_path}")
        with pdfplumber.open(pdf_path) as pdf:
            total_pages = len(pdf.pages)
            print(f"📖 PDF has {total_pages} pages")
            
            text = ""
            end_page = min(start_page + max_pages, total_pages)
            
            print(f"🔍 Extracting pages {start_page + 1} to {end_page}")
            
            for i in range(start_page, end_page):
                try:
                    page = pdf.pages[i]
                    page_text = page.extract_text()
                    char_count = len(page_text.strip()) if page_text else 0
                    print(f"📝 Page {i+1}: {char_count} characters")
                    
                    if page_text and char_count > 10:
                        text += f"=== PAGE {i + 1} ===\n"
                        text += page_text + "\n\n"
                    else:
                        text += f"=== PAGE {i + 1} ===\n[MINIMAL/NO TEXT: {char_count} chars]\n\n"
                except Exception as e:
                    print(f"❌ Error on page {i+1}: {e}")
                    text += f"=== PAGE {i + 1} ===\n[ERROR: {e}]\n\n"
            
            print(f"📄 Total extracted text length: {len(text)} characters")
            return text, total_pages
    except Exception as e:
        print(f"❌ Error with pdfplumber: {e}")
        return None, 0

def extract_specific_pages(pdf_path, page_numbers):
    """Extract specific pages by number"""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = ""
            for page_num in page_numbers:
                try:
                    page = pdf.pages[page_num - 1]  # Convert to 0-indexed
                    page_text = page.extract_text()
                    if page_text:
                        text += f"=== PAGE {page_num} ===\n"
                        text += page_text + "\n\n"
                        print(f"✅ Extracted page {page_num}: {len(page_text.strip())} chars")
                    else:
                        text += f"=== PAGE {page_num} ===\n[NO TEXT]\n\n"
                        print(f"❌ No text on page {page_num}")
                except Exception as e:
                    print(f"❌ Error extracting page {page_num}: {e}")
            return text
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def extract_table_of_contents(pdf_path):
    """Try to extract table of contents or first few pages"""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            # Look for TOC in first 10 pages
            for i in range(min(10, len(pdf.pages))):
                page_text = pdf.pages[i].extract_text()
                if page_text and any(keyword in page_text.lower() for keyword in 
                    ['contents', 'table of contents', 'chapter', 'part']):
                    return f"=== TABLE OF CONTENTS (Page {i+1}) ===\n{page_text}\n"
            return None
    except Exception as e:
        print(f"❌ TOC extraction error: {e}")
        return None

if __name__ == "__main__":
    tufte_path = "Documents/Tufte, Edward R - The visual display of quantitative information-Graphics Press (2001)_compressed.pdf"
    
    print("🎨 TUFTE'S VISUAL DISPLAY OF QUANTITATIVE INFORMATION")
    print("=" * 60)
    
    # First scan to find pages with text
    text_pages = scan_pdf_for_text(tufte_path, max_scan=30)
    
    if text_pages:
        print(f"\n📋 Pages with substantial text: {[p[0] for p in text_pages[:10]]}")
        
        # Extract from the first few pages that actually have text
        first_text_pages = [p[0] for p in text_pages[:3]]
        print(f"\n🔍 Extracting content from pages: {first_text_pages}")
        
        content = extract_specific_pages(tufte_path, first_text_pages)
        
        if content and len(content.strip()) > 100:
            print("\n" + "="*60)
            print(content)
        else:
            print("❌ Still no meaningful content extracted")
    else:
        print("\n❌ No text found in first 30 pages")
        print("🔍 Trying pages 10-15 anyway...")
        content, total = extract_pdf_content(tufte_path, max_pages=5, start_page=10)
        if content:
            print(content)

    # First, try to get TOC
    print("🔍 Looking for Table of Contents...")
    toc = extract_table_of_contents(tufte_path)
    if toc:
        print(toc)
    else:
        print("📋 No clear TOC found in first 10 pages")
    
    # Then extract first few pages
    print("\n🔍 Extracting content...")
    content, total_pages = extract_pdf_content(tufte_path, max_pages=3, start_page=0)
    
    if content and len(content.strip()) > 50:  # Check if we got meaningful content
        print("\n" + "="*50)
        print(content)
        print(f"\n📊 This is a {total_pages}-page book. Showing first 3 pages only.")
        print("💡 To see more pages, modify start_page and max_pages parameters")
    else:
        print("❌ Failed to extract meaningful content from Tufte PDF")
        if content:
            print(f"📝 Got {len(content)} characters: {content[:200]}...") 