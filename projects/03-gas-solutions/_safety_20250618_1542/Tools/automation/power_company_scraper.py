import os
import requests
import re
from bs4 import BeautifulSoup
from datetime import datetime
import random

# Configuration
OUTPUT_DIR = "../Database/SalesLeads"

# Keywords related to power-intensive industries
POWER_KEYWORDS = [
    "factory", "manufacturing", "cement", "steel", "mining", "industrial", 
    "refinery", "sugar", "flour", "beverage", "brewery", "dairy", "plastic", 
    "textile", "glass", "aluminium", "aluminum", "smelting", "processing", 
    "production", "plant", "MW", "megawatts", "gigawatts", "GW", "kilowatts", 
    "KW", "power supply", "electricity", "energy", "diesel generator", 
    "gas turbine", "power plant", "outage", "grid", "IPP", "independent power",
    
    # New power-specific keywords
    "captive power", "power generation", "power consumption", "energy transition",
    "power deficit", "power capacity", "standby generator", "backup power",
    "power purchase agreement", "PPA", "self-generation", "off-grid", 
    "on-site generation", "distributed generation", "power reliability",
    "power infrastructure", "energy efficiency", "uninterrupted power",
    "power solution", "renewable energy", "solar power", "gas-to-power",
    "power availability", "load shedding", "blackout", "brownout", 
    "power instability", "energy cost", "power cost", "fuel cost",
    "captive generation", "power requirement"
]

# Industry sectors that tend to have high power consumption
POWER_INTENSIVE_INDUSTRIES = [
    "Manufacturing", "Cement", "Steel", "Mining", "Oil & Gas", "Food Processing",
    "Beverages", "Telecommunications", "Data Centers", "Pharmaceuticals", 
    "Chemicals", "Textiles", "Plastics", "Paper", "Aluminum", "Glass"
]

class CompanyInfo:
    def __init__(self):
        self.name = ""
        self.industry = ""
        self.power_mentions = 0
        self.location = ""
        self.news_summary = ""
        self.news_url = ""
        self.date_found = datetime.now().strftime("%Y-%m-%d")
        self.power_related_text = ""
    
    def to_dict(self):
        return {
            "Company Name": self.name,
            "Industry": self.industry,
            "Power Mentions": self.power_mentions,
            "Location": self.location,
            "News Summary": self.news_summary,
            "News URL": self.news_url,
            "Date Found": self.date_found,
            "Power Related Text": self.power_related_text
        }

def get_random_user_agent():
    user_agents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36"
    ]
    return random.choice(user_agents)

def extract_location(text):
    # Common Nigerian cities and states
    locations = [
        "Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Benin", "Kaduna", 
        "Ogun", "Oyo", "Rivers", "Edo", "Ondo", "Enugu", "Abia", "Anambra", 
        "Akwa Ibom", "Bauchi", "Borno", "Cross River", "Delta", "Ebonyi", 
        "Ekiti", "Gombe", "Imo", "Jigawa", "Katsina", "Kebbi", "Kogi", 
        "Kwara", "Nasarawa", "Niger", "Osun", "Plateau", "Sokoto", "Taraba", 
        "Yobe", "Zamfara", "FCT"
    ]
    
    for location in locations:
        if re.search(r'\b' + location + r'\b', text, re.IGNORECASE):
            return location
    return ""

def extract_industry(text):
    for industry in POWER_INTENSIVE_INDUSTRIES:
        if re.search(r'\b' + industry + r'\b', text, re.IGNORECASE):
            return industry
    return "Manufacturing"  # Default to Manufacturing if nothing is found

def extract_company_name(text):
    # List of companies to exclude
    excluded_companies = [
        "Dangote", "BUA", "MTN", "Nestle", "Cadbury", "Access Bank",
        "Government", "Agency", "Ministry", "Nigeria", "National", "Federal"
    ]
    
    # Known mid-sized Nigerian companies
    known_mid_sized_companies = {
        "Coleman Wires": ["Coleman Wires", "Coleman"],
        "Cutix PLC": ["Cutix"],
        "GZ Industries": ["GZ Industries", "GZI"],
        "Berger Paints": ["Berger Paints"],
        "Premier Paints": ["Premier Paints"],
        "DN Meyer": ["DN Meyer"],
        "Chi Limited": ["Chi Limited", "Chi"],
        "Presco PLC": ["Presco"],
        "UACN": ["UACN"],
        "Vitafoam": ["Vitafoam"],
        "May & Baker": ["May & Baker"],
        "Fidson Healthcare": ["Fidson"],
        "Euro Global Foods": ["Euro Global"],
        "Leventis Foods": ["Leventis"],
        "Aarti Steel": ["Aarti Steel"],
        "Olam Nigeria": ["Olam"],
        "Golden Sugar Company": ["Golden Sugar"],
        "Dufil Prima Foods": ["Dufil", "Prima Foods"],
        "Honeywell Flour": ["Honeywell Flour"],
        "Sunti Golden Sugar": ["Sunti Golden"],
        "Promasidor": ["Promasidor"],
        "Notore Chemical": ["Notore"],
        "PZ Cussons": ["PZ Cussons", "PZ"],
        "Beta Glass": ["Beta Glass"],
        "Lafarge": ["Lafarge"],
        "Champion Breweries": ["Champion Breweries"],
        "International Breweries": ["International Breweries"],
        "Sona Group": ["Sona Group", "Sona"],
        "FrieslandCampina WAMCO": ["FrieslandCampina", "WAMCO"],
        "Ajeast Nigeria": ["Ajeast"],
        "Mamuda Group": ["Mamuda"],
        "Stallion Group": ["Stallion"],
        "Krones Group": ["Krones"],
        "Big Treat": ["Big Treat"],
        "Rite Foods": ["Rite Foods"],
        "Conserveria Africana": ["Conserveria"],
        "De-United Foods": ["De-United Foods"],
        "Erisco Foods": ["Erisco"],
        "OK Foods": ["OK Foods"],
        "Ecart Internet Services": ["Ecart"],
        "Gokana Restaurants": ["Gokana"],
        "UAC Restaurants": ["UAC Restaurants"],
        "Zartech": ["Zartech"],
        "PowerGas": ["PowerGas"],
        "Dantata & Sawoe": ["Dantata & Sawoe", "Dantata"],
        "Julius Berger": ["Julius Berger"],
        "Setraco Nigeria": ["Setraco"],
        "Reynolds Construction": ["Reynolds"],
        "Osun Ceramics": ["Osun Ceramics"],
        "Royal Ceramics": ["Royal Ceramics"],
        "West African Ceramics": ["West African Ceramics"],
        "Veetee Rice": ["Veetee"],
        "Popular Foods": ["Popular Foods"],
        "Aarti Steel": ["Aarti Steel"],
        "African Foundries": ["African Foundries"],
        "Ikorodu Steel": ["Ikorodu Steel"],
        "Phoenix Steel": ["Phoenix Steel"],
        "Kam Steel": ["Kam Steel"],
        "Universal Steel": ["Universal Steel"],
        "Midland Rolling Mills": ["Midland Rolling"],
        "Sumo Steel": ["Sumo Steel"],
        "Chellco Industries": ["Chellco"],
        "Crystal Steel": ["Crystal Steel"]
    }
    
    # Check for mid-sized companies first
    for company_name, keywords in known_mid_sized_companies.items():
        for keyword in keywords:
            if re.search(r'\b' + keyword + r'\b', text):
                return company_name
    
    # Common Nigerian company name patterns
    company_patterns = [
        r'([A-Z][a-z]+ (Group|Industries|Manufacturing|Cement|Sugar|Mills|Foods|Nigeria|Limited|Ltd|Plc))',
        r'([A-Z][a-z]+ [A-Z][a-z]+ (Limited|Ltd|Plc|Group|Holdings|Industries))',
        r'([A-Z][A-Z]+ (Nigeria|Limited|Ltd|Plc))',
    ]
    
    for pattern in company_patterns:
        matches = re.findall(pattern, text)
        if matches:
            potential_name = matches[0][0] if isinstance(matches[0], tuple) else matches[0]
            # Check if the potential name contains any of the excluded companies
            if not any(excluded in potential_name for excluded in excluded_companies):
                return potential_name
    
    return ""

def fetch_and_parse(url):
    headers = {
        "User-Agent": get_random_user_agent(),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Cache-Control": "max-age=0"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        return BeautifulSoup(response.text, 'html.parser')
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return None

def contains_power_keywords(text):
    for keyword in POWER_KEYWORDS:
        if re.search(r'\b' + keyword + r'\b', text, re.IGNORECASE):
            return True
    return False

def extract_power_related_text(text):
    sentences = re.split(r'(?<=[.!?])\s+', text)
    power_sentences = []
    
    for sentence in sentences:
        if contains_power_keywords(sentence):
            power_sentences.append(sentence)
    
    return " ".join(power_sentences)

def main():
    print("Starting power company scraper...")
    
    # List of Nigerian news sources to scrape
    news_sources = [
        # Original sources
        "https://businessday.ng/",
        # "https://nairametrics.com/", # Removed due to 403 error
        "https://punchng.com/",
        "https://guardian.ng/",
        "https://thenationonlineng.net/",
        "https://thisdaylive.com/",
        "https://www.premiumtimesng.com/",
        
        # New specialized power sector sources
        "https://nerc.gov.ng/",
        # "https://www.vanguardngr.com/", # Removed due to 403 error
        "https://www.premiumtimesng.com/category/business/energy-business",
        "https://punchng.com/topics/energy/",
        "https://kpmg.com/ng/en/home/insights/",
        "https://energypedia.info/wiki/Nigeria_Electricity_Sector",
        "https://www.africanpowerplatform.org/",
        "https://www.energytransition.gov.ng/",
        "https://rea.gov.ng/",
        
        # Industry-specific sources
        "https://www.manufacturersnigeria.org/",
        "https://www.smedan.gov.ng/",
        "https://www.nafdac.gov.ng/",
        "https://www.nipc.gov.ng/",
    ]
    
    # Track all discovered companies
    all_companies = []
    
    # Process each news source
    for source_url in news_sources:
        print(f"Processing {source_url}...")
        
        # Fetch and parse the main page
        soup = fetch_and_parse(source_url)
        if not soup:
            print(f"Failed to fetch {source_url}, skipping...")
            continue
        
        # Extract all article links from the main page
        article_links = []
        for link in soup.find_all('a', href=True):
            href = link['href']
            
            # Make sure we have absolute URLs
            if not href.startswith('http'):
                href = source_url.rstrip('/') + '/' + href.lstrip('/')
            
            # Avoid non-HTML content
            if href.endswith(('.pdf', '.jpg', '.png', '.mp4', '.zip')):
                continue
                
            # Skip social media links
            if any(domain in href for domain in ['facebook.com', 'twitter.com', 'instagram.com']):
                continue
                
            article_links.append(href)
        
        # Limit to 20 articles per source to avoid overloading
        article_links = article_links[:20]
        
        # Process each article
        for article_url in article_links:
            print(f"  Analyzing article: {article_url}")
            article_soup = fetch_and_parse(article_url)
            if not article_soup:
                continue
            
            # Get all text from the article
            article_text = article_soup.get_text(separator=' ', strip=True)
            
            # Skip if article is too short
            if len(article_text) < 300:
                continue
            
            # Check if article contains power-related keywords
            if contains_power_keywords(article_text):
                # Extract company information
                company_info = CompanyInfo()
                company_info.news_url = article_url
                
                # Try to extract title
                title_tag = article_soup.find('h1') or article_soup.find('h2')
                if title_tag:
                    company_info.news_summary = title_tag.get_text(strip=True)
                else:
                    company_info.news_summary = article_text[:200] + "..."
                
                # Extract company name
                company_info.name = extract_company_name(article_text)
                
                # Only proceed if we found a company name
                if company_info.name:
                    company_info.industry = extract_industry(article_text)
                    company_info.location = extract_location(article_text)
                    company_info.power_related_text = extract_power_related_text(article_text)
                    company_info.power_mentions = sum(1 for keyword in POWER_KEYWORDS if re.search(r'\b' + keyword + r'\b', article_text, re.IGNORECASE))
                    
                    print(f"    Found company: {company_info.name} in {article_url}")
                    all_companies.append(company_info)
    
    # Save the results
    if all_companies:
        # Create the output directory if it doesn't exist
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        
        # Convert companies to dictionaries
        company_dicts = [company.to_dict() for company in all_companies]
        
        # Create DataFrame and remove duplicates
        import pandas as pd
        df = pd.DataFrame(company_dicts)
        df.drop_duplicates(subset=['Company Name'], keep='first', inplace=True)
        
        # Sort by power mentions
        df.sort_values(by=['Power Mentions'], ascending=False, inplace=True)
        
        # Save to CSV and Excel
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        csv_path = os.path.join(OUTPUT_DIR, f"scraped_companies_{timestamp}.csv")
        excel_path = os.path.join(OUTPUT_DIR, f"scraped_companies_{timestamp}.xlsx")
        
        df.to_csv(csv_path, index=False)
        print(f"Results saved to {csv_path}")
        
        # Save to Excel if pandas has the ExcelWriter
        try:
            df.to_excel(excel_path, index=False)
            print(f"Results saved to {excel_path}")
        except Exception as e:
            print(f"Could not save Excel file: {e}")
            
        print(f"Found {len(df)} companies with power-related mentions.")
    else:
        print("No companies found with power-related mentions.")

if __name__ == "__main__":
    main() 