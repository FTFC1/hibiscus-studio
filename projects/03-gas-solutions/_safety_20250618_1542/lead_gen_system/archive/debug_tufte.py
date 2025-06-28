import PyPDF2
import pdfplumber

def try_pypdf2(pdf_path, page_num=1):
    """Try PyPDF2 extraction method"""
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            print(f"📚 PyPDF2: {len(reader.pages)} pages")
            
            if page_num <= len(reader.pages):
                page = reader.pages[page_num - 1]
                text = page.extract_text()
                print(f"📝 PyPDF2 Page {page_num}: {len(text)} characters")
                if text.strip():
                    return text
                else:
                    print("❌ PyPDF2: No text extracted")
            return None
    except Exception as e:
        print(f"❌ PyPDF2 error: {e}")
        return None

def try_pdfplumber_detailed(pdf_path, page_num=1):
    """Try pdfplumber with detailed analysis"""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            print(f"📚 pdfplumber: {len(pdf.pages)} pages")
            
            if page_num <= len(pdf.pages):
                page = pdf.pages[page_num - 1]
                
                # Try different extraction methods
                text1 = page.extract_text()
                text2 = page.extract_text(layout=True)
                
                # Check for text objects
                chars = page.chars
                words = page.extract_words() if hasattr(page, 'extract_words') else []
                
                print(f"📝 pdfplumber Page {page_num}:")
                print(f"   - extract_text(): {len(text1) if text1 else 0} chars")
                print(f"   - extract_text(layout=True): {len(text2) if text2 else 0} chars") 
                print(f"   - char objects: {len(chars)}")
                print(f"   - word objects: {len(words)}")
                
                if chars:
                    # Try to reconstruct text from char objects
                    char_text = ''.join([c['text'] for c in chars[:500]])  # First 500 chars
                    print(f"   - char reconstruction: {len(char_text)} chars")
                    if char_text.strip():
                        return char_text
                
                if text1 and text1.strip():
                    return text1
                elif text2 and text2.strip():
                    return text2
                    
            return None
    except Exception as e:
        print(f"❌ pdfplumber error: {e}")
        return None

if __name__ == "__main__":
    pdf_path = "Documents/Tufte, Edward R - The visual display of quantitative information-Graphics Press (2001)_compressed.pdf"
    
    print("🔍 DEBUGGING TUFTE PDF EXTRACTION")
    print("=" * 50)
    
    # Try different pages
    for page_num in [1, 5, 10, 15, 20, 25]:
        print(f"\n🔍 Testing page {page_num}:")
        
        # Try PyPDF2
        text1 = try_pypdf2(pdf_path, page_num)
        
        # Try pdfplumber
        text2 = try_pdfplumber_detailed(pdf_path, page_num)
        
        if text1 or text2:
            print(f"✅ SUCCESS on page {page_num}!")
            if text1:
                print(f"PyPDF2 result (first 200 chars):\n{text1[:200]}...")
            if text2:
                print(f"pdfplumber result (first 200 chars):\n{text2[:200]}...")
            break
        else:
            print(f"❌ No text found on page {page_num}")
    
    print("\n🤔 If all pages fail, this PDF might have text as graphics/vectors") 