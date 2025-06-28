import os
import requests
import pandas as pd
from bs4 import BeautifulSoup
import re
import time
import random
from datetime import datetime
from urllib.parse import urljoin, urlparse
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("power_crawler.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Configuration
OUTPUT_DIR = "../Database/SalesLeads"
MAX_PAGES_PER_SITE = 100  # Maximum number of pages to crawl per news site
MAX_DEPTH = 3  # Maximum depth of crawling from the root page

# Starting points for crawling
START_URLS = [
    # Original sources
    "https://businessday.ng/",
    # "https://nairametrics.com/", # Removed due to 403 error
    "https://punchng.com/",
    "https://guardian.ng/",
    "https://thenationonlineng.net/",
    "https://thisdaylive.com/",
    "https://www.premiumtimesng.com/",
    "https://leadership.ng/",
    "https://tribuneonlineng.com/",
    "https://www.blueprint.ng/",
    "https://newsdiaryonline.com/",
    
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
]

# Keywords related to power-intensive industries
POWER_KEYWORDS = [
    # Original keywords
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

# Section keywords on news sites
BUSINESS_SECTION_KEYWORDS = [
    # Original keywords
    "business", "economy", "companies", "industry", "corporate", "market", 
    "energy", "oil", "gas", "power", "manufacturing", "enterprise",
    
    # New section keywords
    "electricity", "renewable", "solar", "sustainability", "infrastructure",
    "real-estate", "industrial", "technology", "telecom", "construction",
    "mining", "cement", "steel", "food-beverage", "brewing", "pharmaceuticals",
    "data-center", "ipp", "independent-power", "power-sector", "energy-transition",
    "off-grid", "captive-power", "generators"
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
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36 Edg/93.0.961.38",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1"
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
    return "Unknown"

def extract_company_name(text):
    # Common Nigerian company name patterns
    company_patterns = [
        r'([A-Z][a-z]+ (Group|Industries|Manufacturing|Cement|Sugar|Mills|Foods|Nigeria|Limited|Ltd|Plc))',
        r'([A-Z][a-z]+ [A-Z][a-z]+ (Limited|Ltd|Plc|Group|Holdings|Industries))',
        r'([A-Z][A-Z]+ (Nigeria|Limited|Ltd|Plc))',
    ]
    
    for pattern in company_patterns:
        matches = re.findall(pattern, text)
        if matches:
            return matches[0][0] if isinstance(matches[0], tuple) else matches[0]
    
    # Look for known major Nigerian companies
    known_companies = [
        "Dangote", "BUA", "MTN", "Lafarge", "Flour Mills", "Nigerian Breweries",
        "Nestle", "Cadbury", "PZ Cussons", "Unilever", "WAPCO", "Guinness", 
        "International Breweries", "Champion Breweries", "GSK", "May & Baker",
        "Fidson", "Notore", "Oando", "Seplat", "Julius Berger", "UACN", 
        "Honeywell", "Transcorp", "Airtel", "Globacom", "Beta Glass", "CCNN",
        "Dangote Cement", "Dangote Sugar", "Dangote Refinery", "BUA Cement",
        "BUA Foods", "Lafarge Africa", "WAMCO", "FrieslandCampina", "Chi Limited",
        "International Breweries", "Forte Oil", "Total Nigeria", "11 Plc", "MRS Oil",
        "Conoil", "Eterna", "Ardova", "Mobil", "Unilever Nigeria", "Nestle Nigeria",
        "Cadbury Nigeria", "Flour Mills Nigeria", "Honeywell Flour", "Dangote Flour",
        "Golden Guinea", "Champion Breweries", "Nigerian Breweries", "Guinness Nigeria",
        "Presco", "Okomu Oil", "May & Baker Nigeria", "Fidson Healthcare",
        "Glaxo SmithKline", "Neimeth", "Pharma-Deko", "Beta Glass", "Cutix",
        "Berger Paints", "CAP", "Lafarge Cement", "Ashaka Cement", "Dangote Cement",
        "Notore Chemical", "Chemical & Allied Products", "Meyer", "Vitafoam",
        "Morison Industries", "Nascon Allied Industries", "Portland Paints",
        "Cement Company of Northern Nigeria", "Japaul Oil", "Capital Oil",
        "Northern Nigeria Flour Mills", "UAC Nigeria", "UAC Foods", "GlaxoSmithKline",
        "Omatek Ventures", "Chams", "Computer Warehouse Group", "Austin Laz",
        "NCR Nigeria", "Aso Savings", "C & I Leasing", "Abbey Building Society",
        "African Prudential", "Cornerstone Insurance", "AIICO Insurance",
        "Consolidated Hallmark Insurance", "Guinea Insurance", "Linkage Assurance",
        "Lasaco Assurance", "Law Union & Rock Insurance", "Mutual Benefits Assurance",
        "NEM Insurance", "Niger Insurance", "Prestige Assurance", "Regency Alliance Insurance",
        "Sovereign Trust Insurance", "Standard Alliance Insurance", "Universal Insurance",
        "Unity Kapital Assurance", "Wapic Insurance", "FCMB Group", "Fidelity Bank",
        "First Bank Nigeria", "Guaranty Trust Bank", "Access Bank", "Diamond Bank",
        "Ecobank Transnational", "Stanbic IBTC Holdings", "Sterling Bank", "UBA",
        "Union Bank Nigeria", "Unity Bank", "Wema Bank", "Zenith Bank"
    ]
    
    for company in known_companies:
        if re.search(r'\b' + company + r'\b', text):
            # Try to get the full name
            full_name_match = re.search(r'\b' + company + r'[A-Za-z\s]+(Limited|Ltd|Plc|Group|Nigeria)\b', text)
            if full_name_match:
                return full_name_match.group(0)
            return company
    
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
        logger.error(f"Error fetching {url}: {e}")
        return None

def is_valid_url(url, base_domain):
    """Check if a URL is valid and belongs to the same domain"""
    try:
        parsed_url = urlparse(url)
        parsed_base = urlparse(base_domain)
        
        # Check if it's the same domain
        if parsed_url.netloc and parsed_url.netloc != parsed_base.netloc:
            return False
        
        # Check if it's a proper URL (not a javascript or mailto link)
        if url.startswith('javascript:') or url.startswith('mailto:'):
            return False
        
        # Check if it's not a file extension we want to skip
        if url.endswith(('.jpg', '.jpeg', '.png', '.gif', '.pdf', '.zip', '.css', '.js')):
            return False
        
        return True
    except:
        return False

def normalize_url(url, base_url):
    """Convert relative URLs to absolute and handle URL joining edge cases"""
    if not url:
        return None
    
    # Skip anchors on the same page
    if url.startswith('#'):
        return None
    
    # Handle URLs that already absolute
    if url.startswith('http://') or url.startswith('https://'):
        return url
    
    # Join relative URLs with the base
    return urljoin(base_url, url)

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

def prioritize_business_links(links, base_url):
    """Sort links with priority to business sections"""
    business_links = []
    other_links = []
    
    for link in links:
        url = link.get('href', '')
        text = link.get_text().lower()
        
        # Skip if no href or not valid
        if not url or not is_valid_url(url, base_url):
            continue
            
        # Normalize the URL
        url = normalize_url(url, base_url)
        if not url:
            continue
            
        # Check if it's a business section
        if any(keyword in url.lower() or keyword in text for keyword in BUSINESS_SECTION_KEYWORDS):
            business_links.append(url)
        else:
            other_links.append(url)
    
    # Return business links first, then others
    return business_links + other_links

def crawl_site(start_url, max_pages=MAX_PAGES_PER_SITE, max_depth=MAX_DEPTH):
    """Crawl a news site to find articles"""
    logger.info(f"Starting crawl of {start_url}")
    visited_urls = set()
    to_visit = [(start_url, 0)]  # (url, depth)
    found_articles = []
    page_count = 0
    
    # Parse the base domain for link validation
    base_domain = urlparse(start_url).netloc
    if not base_domain.startswith('http'):
        base_domain = 'https://' + base_domain
    
    while to_visit and page_count < max_pages:
        # Get the next URL to visit and its depth
        current_url, depth = to_visit.pop(0)
        
        # Skip if we've already visited or gone too deep
        if current_url in visited_urls or depth > max_depth:
            continue
        
        # Mark as visited
        visited_urls.add(current_url)
        page_count += 1
        
        logger.info(f"Crawling page {page_count}/{max_pages}: {current_url} (depth {depth})")
        
        # Random delay to avoid overloading the server
        time.sleep(random.uniform(1, 3))
        
        # Fetch and parse the page
        soup = fetch_and_parse(current_url)
        if not soup:
            continue
        
        # Process the current page to check if it's an article
        process_page(soup, current_url, found_articles)
        
        # Don't look for more links if we're at max depth
        if depth >= max_depth:
            continue
        
        # Find all links on the page
        links = soup.find_all('a', href=True)
        
        # Prioritize business-related links
        prioritized_links = prioritize_business_links(links, current_url)
        
        # Add new links to visit
        for url in prioritized_links:
            if url not in visited_urls and len(to_visit) < max_pages * 2:  # Limit the queue size
                to_visit.append((url, depth + 1))
    
    logger.info(f"Crawl completed for {start_url}. Visited {len(visited_urls)} pages, found {len(found_articles)} articles.")
    return found_articles

def process_page(soup, url, found_articles):
    """Process a page to check if it's a news article"""
    # Extract text from the page
    page_text = soup.get_text(separator=' ', strip=True)
    
    # Skip if the page is too short to be an article
    if len(page_text) < 300:
        return
    
    # Check if the page contains power-related keywords
    if contains_power_keywords(page_text):
        # Extract company information
        company_info = CompanyInfo()
        company_info.news_url = url
        
        # Try to extract a title
        title = None
        h_tags = soup.find_all(['h1', 'h2'])
        if h_tags:
            title = h_tags[0].get_text(strip=True)
        
        if title:
            company_info.news_summary = title
        else:
            # Create a brief summary (first 200 characters)
            company_info.news_summary = page_text[:200] + "..."
        
        # Extract company name
        company_info.name = extract_company_name(page_text)
        
        # Only proceed if we found a company name
        if company_info.name:
            company_info.industry = extract_industry(page_text)
            company_info.location = extract_location(page_text)
            company_info.power_related_text = extract_power_related_text(page_text)
            company_info.power_mentions = sum(1 for keyword in POWER_KEYWORDS if re.search(r'\b' + keyword + r'\b', page_text, re.IGNORECASE))
            
            logger.info(f"Found company: {company_info.name} in {url}")
            found_articles.append(company_info)

def save_results(companies):
    if not companies:
        logger.info("No companies found.")
        return
    
    # Create output directory if it doesn't exist
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Convert company objects to dictionaries
    company_dicts = [company.to_dict() for company in companies]
    
    # Create DataFrame
    df = pd.DataFrame(company_dicts)
    
    # Remove duplicates
    df.drop_duplicates(subset=['Company Name'], keep='first', inplace=True)
    
    # Sort by power mentions (descending)
    df.sort_values(by=['Power Mentions'], ascending=False, inplace=True)
    
    # Save to CSV
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_path = os.path.join(OUTPUT_DIR, f"power_companies_{timestamp}.csv")
    df.to_csv(csv_path, index=False)
    
    # Save to Excel
    excel_path = os.path.join(OUTPUT_DIR, f"power_companies_{timestamp}.xlsx")
    df.to_excel(excel_path, index=False)
    
    # Generate a Markdown summary
    md_content = f"# Nigerian Companies with High Power Requirements\n\n"
    md_content += f"*Generated on {datetime.now().strftime('%Y-%m-%d')}*\n\n"
    md_content += f"## Top 100 Companies by Power Mentions\n\n"
    md_content += f"| Company | Industry | Location | Power Mentions | News Summary |\n"
    md_content += f"|---------|----------|----------|----------------|-------------|\n"
    
    for _, row in df.head(100).iterrows():
        md_content += f"| {row['Company Name']} | {row['Industry']} | {row['Location'] or 'Unknown'} | {row['Power Mentions']} | {row['News Summary'][:100]}... |\n"
    
    md_path = os.path.join(OUTPUT_DIR, f"power_companies_{timestamp}.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    
    logger.info(f"Found {len(df)} companies with power-related mentions.")
    logger.info(f"Results saved to {csv_path}, {excel_path}, and {md_path}")
    
    return df

def main():
    logger.info("Starting power company crawler...")
    
    start_time = time.time()
    all_companies = []
    
    # Crawl each site
    for url in START_URLS:
        site_companies = crawl_site(url)
        all_companies.extend(site_companies)
        
        # Add a longer delay between sites
        time.sleep(random.uniform(5, 10))
    
    # Remove duplicates (same company from different sources)
    unique_companies = []
    company_names = set()
    
    for company in all_companies:
        if company.name and company.name not in company_names:
            company_names.add(company.name)
            unique_companies.append(company)
    
    df = save_results(unique_companies)
    
    # Log completion
    elapsed_time = time.time() - start_time
    logger.info(f"Crawling completed in {elapsed_time:.2f} seconds.")
    logger.info(f"Found {len(unique_companies)} unique companies with power-related mentions.")

if __name__ == "__main__":
    main() 