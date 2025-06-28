#!/usr/bin/env python3
"""
Enhanced Business Intelligence Scraper
This tool scrapes Nigerian business news sources for intelligence on company operations,
focusing on details about energy usage, expansion plans, and operational challenges.
"""

import os
import json
import time
import random
import pandas as pd
from datetime import datetime
import logging
import requests
from bs4 import BeautifulSoup
import re

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("../Database/NewsData/business_intelligence.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("EnhancedBusinessIntel")

# Create necessary directories
os.makedirs("../Database/NewsData/Intelligence", exist_ok=True)

# Nigerian business news sources with high-quality company reporting
BUSINESS_SOURCES = [
    {
        "name": "BusinessDay",
        "url": "https://businessday.ng/category/companies/",
        "article_selector": "article.jeg_post",
        "title_selector": "h3.jeg_post_title a",
        "link_selector": "h3.jeg_post_title a",
        "date_selector": "div.jeg_meta_date",
        "summary_selector": "div.jeg_post_excerpt p"
    },
    {
        "name": "Nairametrics",
        "url": "https://nairametrics.com/category/companies/",
        "article_selector": "article.jeg_post",
        "title_selector": "h3.jeg_post_title a",
        "link_selector": "h3.jeg_post_title a",
        "date_selector": "div.jeg_meta_date",
        "summary_selector": "div.jeg_post_excerpt p"
    },
    {
        "name": "TheGuardian",
        "url": "https://guardian.ng/category/business-services/",
        "article_selector": "div.list-article",
        "title_selector": "h3 a",
        "link_selector": "h3 a",
        "date_selector": "span.article-date",
        "summary_selector": "p.synopsis"
    }
]

# Business intelligence extraction criteria
INTELLIGENCE_PATTERNS = [
    # Energy usage patterns
    {
        "pattern": r"power (requirement|consumption|usage|demand|need|supply)",
        "category": "Energy Usage",
        "priority": "High"
    },
    {
        "pattern": r"(diesel|gas) generator",
        "category": "Current Power Solution",
        "priority": "High"
    },
    {
        "pattern": r"(MW|megawatt|gigawatt)",
        "category": "Power Capacity",
        "priority": "High"
    },
    
    # Business operations
    {
        "pattern": r"(expansion|expanding|growth) (plan|strategy)",
        "category": "Expansion Plans",
        "priority": "Medium"
    },
    {
        "pattern": r"(production|manufacturing) (capacity|facility|plant)",
        "category": "Production Capacity",
        "priority": "Medium"
    },
    {
        "pattern": r"(operational|operation) (cost|challenge|efficiency)",
        "category": "Operational Challenges",
        "priority": "Medium"
    },
    
    # Financial indicators
    {
        "pattern": r"(investment|investing|invested) [\w\s]+(billion|million)",
        "category": "Investment Plans",
        "priority": "Medium"
    },
    {
        "pattern": r"(profit|revenue|earnings) [\w\s]+(up|down|increased|decreased)",
        "category": "Financial Performance",
        "priority": "Low"
    },
    
    # Leadership and decision-makers
    {
        "pattern": r"(CEO|Chief Executive|Managing Director|Chairman) [\w\s]+ said",
        "category": "Leadership Statement",
        "priority": "Medium"
    },
    {
        "pattern": r"board (appointed|elected|named)",
        "category": "Leadership Change",
        "priority": "Low"
    }
]

class CompanyIntelligence:
    """Class to store company intelligence information"""
    def __init__(self, company_name):
        self.company_name = company_name
        self.sector = ""
        self.intelligence_items = []
        self.articles = []
        self.power_related_mentions = 0
        self.expansion_mentions = 0
        self.financial_mentions = 0
        self.leadership_mentions = []
        self.last_updated = datetime.now().strftime("%Y-%m-%d")
        
    def add_intelligence(self, category, text, priority, source_url, date):
        """Add an intelligence item"""
        self.intelligence_items.append({
            "category": category,
            "text": text,
            "priority": priority,
            "source_url": source_url,
            "date": date
        })
        
        # Track specific types of mentions
        if category in ["Energy Usage", "Current Power Solution", "Power Capacity"]:
            self.power_related_mentions += 1
        elif category in ["Expansion Plans", "Production Capacity"]:
            self.expansion_mentions += 1
        elif category in ["Financial Performance", "Investment Plans"]:
            self.financial_mentions += 1
        elif category in ["Leadership Statement", "Leadership Change"]:
            # Extract the leader's name
            match = re.search(r"(CEO|Chief Executive|Managing Director|Chairman) ([\w\s]+) said", text)
            if match:
                leader = match.group(2).strip()
                if leader not in [item.get('name') for item in self.leadership_mentions]:
                    self.leadership_mentions.append({
                        "name": leader,
                        "title": match.group(1),
                        "quote": text
                    })
    
    def add_article(self, title, url, date, summary):
        """Add an article reference"""
        self.articles.append({
            "title": title,
            "url": url,
            "date": date,
            "summary": summary
        })
    
    def calculate_intelligence_score(self):
        """Calculate an intelligence score based on available information"""
        score = 0
        
        # Base score from number of intelligence items
        score += min(50, len(self.intelligence_items) * 5)
        
        # Bonus for power-related mentions (our primary interest)
        score += self.power_related_mentions * 10
        
        # Bonus for expansion mentions (indicates future power needs)
        score += self.expansion_mentions * 7
        
        # Bonus for financial mentions (indicates ability to invest)
        score += self.financial_mentions * 3
        
        # Bonus for leadership mentions (indicates decision-makers)
        score += len(self.leadership_mentions) * 5
        
        # Normalize to 0-100 scale
        return min(100, score)
    
    def to_dict(self):
        """Convert to dictionary for serialization"""
        return {
            "company_name": self.company_name,
            "sector": self.sector,
            "intelligence_score": self.calculate_intelligence_score(),
            "intelligence_items": self.intelligence_items,
            "articles": self.articles,
            "power_related_mentions": self.power_related_mentions,
            "expansion_mentions": self.expansion_mentions,
            "financial_mentions": self.financial_mentions,
            "leadership_mentions": self.leadership_mentions,
            "last_updated": self.last_updated
        }
    
    @classmethod
    def from_dict(cls, data):
        """Create from dictionary"""
        company = cls(data["company_name"])
        company.sector = data.get("sector", "")
        company.intelligence_items = data.get("intelligence_items", [])
        company.articles = data.get("articles", [])
        company.power_related_mentions = data.get("power_related_mentions", 0)
        company.expansion_mentions = data.get("expansion_mentions", 0)
        company.financial_mentions = data.get("financial_mentions", 0)
        company.leadership_mentions = data.get("leadership_mentions", [])
        company.last_updated = data.get("last_updated", datetime.now().strftime("%Y-%m-%d"))
        return company

class BusinessIntelligenceScraper:
    """Business intelligence scraper class"""
    def __init__(self):
        self.companies = {}
        self.load_existing_data()
        
        # User agents for rotation
        self.user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Safari/605.1.15',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        ]
    
    def load_existing_data(self):
        """Load existing company intelligence data"""
        data_file = "../Database/NewsData/Intelligence/company_intelligence.json"
        if os.path.exists(data_file):
            try:
                with open(data_file, 'r') as f:
                    companies_data = json.load(f)
                
                for company_data in companies_data:
                    company = CompanyIntelligence.from_dict(company_data)
                    self.companies[company.company_name] = company
                    
                logger.info(f"Loaded intelligence data for {len(self.companies)} companies")
            except Exception as e:
                logger.error(f"Error loading existing data: {str(e)}")
                self.companies = {}
    
    def save_data(self):
        """Save company intelligence data"""
        try:
            companies_data = [company.to_dict() for company in self.companies.values()]
            data_file = "../Database/NewsData/Intelligence/company_intelligence.json"
            with open(data_file, 'w') as f:
                json.dump(companies_data, f, indent=2)
            logger.info(f"Saved intelligence data for {len(self.companies)} companies")
        except Exception as e:
            logger.error(f"Error saving data: {str(e)}")
    
    def get_random_user_agent(self):
        """Get a random user agent"""
        return random.choice(self.user_agents)
    
    def extract_company_mentions(self, text):
        """Extract company mentions from text using known Nigerian companies"""
        companies = [
            "Dangote", "BUA Group", "MTN Nigeria", "Flour Mills of Nigeria", 
            "Lafarge Africa", "Nigerian Breweries", "Guinness Nigeria", "Nestle Nigeria", 
            "Cadbury Nigeria", "PZ Cussons", "Unilever Nigeria", "Honeywell Flour Mills",
            "Julius Berger", "Total Nigeria", "Oando", "Seplat", "FBN Holdings", 
            "FCMB Group", "UBA", "Access Bank", "Zenith Bank", "GTBank", "Fidelity Bank",
            "Transcorp", "UACN", "Beta Glass", "Champion Breweries", "International Breweries",
            "Berger Paints", "CAP Plc", "Cutix", "Dangote Cement", "Dangote Sugar", "NASCON",
            "Ecobank", "Nigerian Aviation Handling Company", "May & Baker", "GlaxoSmithKline",
            "NNPC", "Airtel", "Globacom", "9mobile", "Wema Bank", "Unity Bank", "Sterling Bank",
            "Stanbic IBTC", "First Bank", "United Capital", "AIICO Insurance", "AXA Mansard",
            "Continental Reinsurance", "Cornerstone Insurance", "Custodian Investment",
            "NEM Insurance", "NSIA Insurance", "Prestige Assurance", "Sovereign Trust Insurance",
            "Royal Exchange", "Japaul Oil", "Okomu Oil", "Presco", "Eterna", "MRS", "Conoil",
            "11 Plc", "Ikeja Hotel", "Transnational Corporation", "UACN Property Development",
            "Vitafoam", "Beta Glass", "Notore Chemical", "Fidson Healthcare", "Neimeth",
            "Morison Industries", "AG Leventis", "C&I Leasing", "Courteville Business Solutions",
            "E-Tranzact", "NCR Nigeria", "Tripple Gee", "Chams", "CWG", "Austin Laz & Company",
            "Ellah Lakes", "Livestock Feeds", "Ekocorp", "Medview Airline", "Learn Africa",
            "Omatek Ventures", "Forte Oil", "Mobil", "Consolidated Hallmark", "Guinea Insurance",
            "Law Union & Rock", "Niger Insurance", "Regency Alliance Insurance", "Universal Insurance",
            "Daar Communications", "Caverton Offshore Support Group", "Eunisell", "FTN Cocoa Processors",
            "McNichols", "Multi-Trex Integrated Foods", "Tantalizers", "Union Dicon Salt"
        ]
        
        found_companies = []
        for company in companies:
            # Use regex to find whole word matches
            pattern = r'\b' + re.escape(company) + r'\b'
            if re.search(pattern, text, re.IGNORECASE):
                found_companies.append(company)
        
        return found_companies
    
    def extract_intelligence(self, text, url, date):
        """Extract business intelligence from text"""
        intelligence_items = []
        
        for pattern_info in INTELLIGENCE_PATTERNS:
            pattern = pattern_info["pattern"]
            matches = re.finditer(pattern, text, re.IGNORECASE)
            
            for match in matches:
                # Get context around the match (100 characters before and after)
                start = max(0, match.start() - 100)
                end = min(len(text), match.end() + 100)
                context = text[start:end].strip()
                
                intelligence_items.append({
                    "category": pattern_info["category"],
                    "text": context,
                    "priority": pattern_info["priority"],
                    "source_url": url,
                    "date": date
                })
        
        return intelligence_items
    
    def scrape_source(self, source_info, limit=10):
        """Scrape a single news source"""
        headers = {
            'User-Agent': self.get_random_user_agent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.google.com/',
            'DNT': '1',
        }
        
        try:
            logger.info(f"Scraping {source_info['name']}: {source_info['url']}")
            response = requests.get(source_info['url'], headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            articles = soup.select(source_info['article_selector'])
            
            logger.info(f"Found {len(articles)} articles on {source_info['name']}")
            
            articles_processed = 0
            for article in articles[:limit]:  # Limit the number of articles
                try:
                    # Extract article information
                    title_elem = article.select_one(source_info['title_selector'])
                    if not title_elem:
                        continue
                        
                    title = title_elem.get_text().strip()
                    
                    link_elem = article.select_one(source_info['link_selector'])
                    if not link_elem:
                        continue
                        
                    link = link_elem.get('href')
                    if not link:
                        continue
                    
                    date_elem = article.select_one(source_info['date_selector'])
                    date = date_elem.get_text().strip() if date_elem else "N/A"
                    
                    summary_elem = article.select_one(source_info['summary_selector'])
                    summary = summary_elem.get_text().strip() if summary_elem else ""
                    
                    # Get article content
                    article_content = self.fetch_article_content(link, headers)
                    
                    # Process the article content
                    self.process_article(title, link, date, summary, article_content)
                    
                    articles_processed += 1
                    
                    # Add a delay between article requests to avoid overloading
                    time.sleep(random.uniform(2, 5))
                    
                except Exception as e:
                    logger.error(f"Error processing article: {str(e)}")
            
            logger.info(f"Processed {articles_processed} articles from {source_info['name']}")
            
        except Exception as e:
            logger.error(f"Error scraping {source_info['name']}: {str(e)}")
    
    def fetch_article_content(self, url, headers):
        """Fetch and parse article content"""
        try:
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Try different selectors for article content
            content_selectors = [
                'div.content p', 'div.entry-content p', 
                'article p', 'div.jeg_share_top ~ div p',
                'div.jeg_post_content p', 'div.article-body p'
            ]
            
            content = ""
            for selector in content_selectors:
                paragraphs = soup.select(selector)
                if paragraphs:
                    content = ' '.join([p.get_text().strip() for p in paragraphs])
                    break
            
            return content
            
        except Exception as e:
            logger.error(f"Error fetching article content from {url}: {str(e)}")
            return ""
    
    def process_article(self, title, url, date, summary, content):
        """Process an article to extract companies and intelligence"""
        # Combine all text for analysis
        all_text = f"{title} {summary} {content}"
        
        # Extract companies mentioned
        companies = self.extract_company_mentions(all_text)
        
        if not companies:
            logger.debug(f"No companies found in article: {title}")
            return
        
        # Extract intelligence
        intelligence_items = self.extract_intelligence(all_text, url, date)
        
        # Process each company
        for company_name in companies:
            if company_name not in self.companies:
                self.companies[company_name] = CompanyIntelligence(company_name)
            
            company = self.companies[company_name]
            
            # Add the article reference
            company.add_article(title, url, date, summary)
            
            # Add intelligence items
            for item in intelligence_items:
                company.add_intelligence(
                    item["category"],
                    item["text"],
                    item["priority"],
                    url,
                    date
                )
    
    def run(self, sources=None, limit=10):
        """Run the scraper on all or specified sources"""
        if sources:
            sources_to_scrape = [s for s in BUSINESS_SOURCES if s["name"] in sources]
        else:
            sources_to_scrape = BUSINESS_SOURCES
        
        logger.info(f"Starting business intelligence scraping for {len(sources_to_scrape)} sources")
        
        for source in sources_to_scrape:
            self.scrape_source(source, limit)
            
            # Add a delay between sources
            time.sleep(random.uniform(5, 10))
        
        # Save the results
        self.save_data()
        
        # Export analytics
        self.export_analytics()
    
    def export_analytics(self):
        """Export analytics about the scraped data"""
        # Create a DataFrame for the company intelligence
        data = []
        for company in self.companies.values():
            data.append({
                "Company": company.company_name,
                "Intelligence Score": company.calculate_intelligence_score(),
                "Articles": len(company.articles),
                "Power Mentions": company.power_related_mentions,
                "Expansion Mentions": company.expansion_mentions,
                "Financial Mentions": company.financial_mentions,
                "Leadership Contacts": len(company.leadership_mentions),
                "Last Updated": company.last_updated
            })
        
        df = pd.DataFrame(data)
        
        # Sort by intelligence score
        df = df.sort_values('Intelligence Score', ascending=False)
        
        # Export to Excel
        output_file = "../Database/NewsData/Intelligence/company_analytics.xlsx"
        df.to_excel(output_file, index=False)
        logger.info(f"Exported company analytics to {output_file}")
        
        # Export markdown report
        self.export_markdown_report()
    
    def export_markdown_report(self):
        """Export a markdown report with detailed company insights"""
        # Get top companies sorted by intelligence score
        top_companies = sorted(
            self.companies.values(),
            key=lambda x: x.calculate_intelligence_score(),
            reverse=True
        )
        
        # Create the report
        report = "# Company Business Intelligence Report\n\n"
        report += f"*Generated on {datetime.now().strftime('%Y-%m-%d')}*\n\n"
        
        # Summary section
        report += "## Summary\n\n"
        report += f"This report contains business intelligence on {len(self.companies)} Nigerian companies, "
        report += "with a focus on energy usage, expansion plans, and operational details.\n\n"
        
        # Top companies section
        report += "## Top Companies by Intelligence Score\n\n"
        
        for i, company in enumerate(top_companies[:15], 1):
            report += f"### {i}. {company.company_name} (Score: {company.calculate_intelligence_score()})\n\n"
            
            # Key stats
            report += "**Key Intelligence:**\n"
            report += f"- Power-related mentions: {company.power_related_mentions}\n"
            report += f"- Expansion mentions: {company.expansion_mentions}\n"
            report += f"- Financial mentions: {company.financial_mentions}\n"
            report += f"- Leadership contacts: {len(company.leadership_mentions)}\n\n"
            
            # One-line value proposition
            energy_focus = "high" if company.power_related_mentions > 3 else "moderate" if company.power_related_mentions > 1 else "unknown"
            expansion_focus = "active expansion" if company.expansion_mentions > 2 else "some growth" if company.expansion_mentions > 0 else "stable operations"
            
            report += "**IPP Value Proposition:** "
            report += f"With {energy_focus} energy needs and {expansion_focus}, {company.company_name} is an "
            
            if company.calculate_intelligence_score() > 80:
                report += "ideal target for IPP solutions that can provide reliable power at scale while supporting their growth trajectory.\n\n"
            elif company.calculate_intelligence_score() > 60:
                report += "excellent prospect for IPP solutions that can reduce operational costs and improve reliability.\n\n"
            else:
                report += "potential candidate for IPP solutions that align with their current operational needs.\n\n"
            
            # Top intelligence items
            high_priority_items = [item for item in company.intelligence_items if item["priority"] == "High"]
            if high_priority_items:
                report += "**Critical Business Intelligence:**\n\n"
                for item in high_priority_items[:3]:  # Top 3 high priority items
                    report += f"- {item['category']}: \"{item['text']}\"\n"
                report += "\n"
            
            # Leadership mentions
            if company.leadership_mentions:
                report += "**Key Decision Makers:**\n\n"
                for leader in company.leadership_mentions[:2]:  # Top 2 leaders
                    report += f"- {leader.get('name', 'Unknown')} ({leader.get('title', 'Leader')})\n"
                report += "\n"
            
            # Recent articles
            if company.articles:
                report += "**Recent Coverage:**\n\n"
                for article in company.articles[:2]:  # Top 2 articles
                    report += f"- [{article['title']}]({article['url']})\n"
                report += "\n"
            
            report += "---\n\n"
        
        # Write the report
        output_file = "../Database/NewsData/Intelligence/company_intelligence_report.md"
        with open(output_file, 'w') as f:
            f.write(report)
        
        logger.info(f"Exported markdown report to {output_file}")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Business Intelligence Scraper")
    parser.add_argument('--sources', help='Comma-separated list of sources to scrape (default: all)')
    parser.add_argument('--limit', type=int, default=10, help='Maximum number of articles per source (default: 10)')
    
    args = parser.parse_args()
    
    sources = args.sources.split(',') if args.sources else None
    
    scraper = BusinessIntelligenceScraper()
    scraper.run(sources=sources, limit=args.limit)

if __name__ == "__main__":
    main() 
"""
Enhanced Business Intelligence Scraper
This tool scrapes Nigerian business news sources for intelligence on company operations,
focusing on details about energy usage, expansion plans, and operational challenges.
"""

import os
import json
import time
import random
import pandas as pd
from datetime import datetime
import logging
import requests
from bs4 import BeautifulSoup
import re

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("../Database/NewsData/business_intelligence.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("EnhancedBusinessIntel")

# Create necessary directories
os.makedirs("../Database/NewsData/Intelligence", exist_ok=True)

# Nigerian business news sources with high-quality company reporting
BUSINESS_SOURCES = [
    {
        "name": "BusinessDay",
        "url": "https://businessday.ng/category/companies/",
        "article_selector": "article.jeg_post",
        "title_selector": "h3.jeg_post_title a",
        "link_selector": "h3.jeg_post_title a",
        "date_selector": "div.jeg_meta_date",
        "summary_selector": "div.jeg_post_excerpt p"
    },
    {
        "name": "Nairametrics",
        "url": "https://nairametrics.com/category/companies/",
        "article_selector": "article.jeg_post",
        "title_selector": "h3.jeg_post_title a",
        "link_selector": "h3.jeg_post_title a",
        "date_selector": "div.jeg_meta_date",
        "summary_selector": "div.jeg_post_excerpt p"
    },
    {
        "name": "TheGuardian",
        "url": "https://guardian.ng/category/business-services/",
        "article_selector": "div.list-article",
        "title_selector": "h3 a",
        "link_selector": "h3 a",
        "date_selector": "span.article-date",
        "summary_selector": "p.synopsis"
    }
]

# Business intelligence extraction criteria
INTELLIGENCE_PATTERNS = [
    # Energy usage patterns
    {
        "pattern": r"power (requirement|consumption|usage|demand|need|supply)",
        "category": "Energy Usage",
        "priority": "High"
    },
    {
        "pattern": r"(diesel|gas) generator",
        "category": "Current Power Solution",
        "priority": "High"
    },
    {
        "pattern": r"(MW|megawatt|gigawatt)",
        "category": "Power Capacity",
        "priority": "High"
    },
    
    # Business operations
    {
        "pattern": r"(expansion|expanding|growth) (plan|strategy)",
        "category": "Expansion Plans",
        "priority": "Medium"
    },
    {
        "pattern": r"(production|manufacturing) (capacity|facility|plant)",
        "category": "Production Capacity",
        "priority": "Medium"
    },
    {
        "pattern": r"(operational|operation) (cost|challenge|efficiency)",
        "category": "Operational Challenges",
        "priority": "Medium"
    },
    
    # Financial indicators
    {
        "pattern": r"(investment|investing|invested) [\w\s]+(billion|million)",
        "category": "Investment Plans",
        "priority": "Medium"
    },
    {
        "pattern": r"(profit|revenue|earnings) [\w\s]+(up|down|increased|decreased)",
        "category": "Financial Performance",
        "priority": "Low"
    },
    
    # Leadership and decision-makers
    {
        "pattern": r"(CEO|Chief Executive|Managing Director|Chairman) [\w\s]+ said",
        "category": "Leadership Statement",
        "priority": "Medium"
    },
    {
        "pattern": r"board (appointed|elected|named)",
        "category": "Leadership Change",
        "priority": "Low"
    }
]

class CompanyIntelligence:
    """Class to store company intelligence information"""
    def __init__(self, company_name):
        self.company_name = company_name
        self.sector = ""
        self.intelligence_items = []
        self.articles = []
        self.power_related_mentions = 0
        self.expansion_mentions = 0
        self.financial_mentions = 0
        self.leadership_mentions = []
        self.last_updated = datetime.now().strftime("%Y-%m-%d")
        
    def add_intelligence(self, category, text, priority, source_url, date):
        """Add an intelligence item"""
        self.intelligence_items.append({
            "category": category,
            "text": text,
            "priority": priority,
            "source_url": source_url,
            "date": date
        })
        
        # Track specific types of mentions
        if category in ["Energy Usage", "Current Power Solution", "Power Capacity"]:
            self.power_related_mentions += 1
        elif category in ["Expansion Plans", "Production Capacity"]:
            self.expansion_mentions += 1
        elif category in ["Financial Performance", "Investment Plans"]:
            self.financial_mentions += 1
        elif category in ["Leadership Statement", "Leadership Change"]:
            # Extract the leader's name
            match = re.search(r"(CEO|Chief Executive|Managing Director|Chairman) ([\w\s]+) said", text)
            if match:
                leader = match.group(2).strip()
                if leader not in [item.get('name') for item in self.leadership_mentions]:
                    self.leadership_mentions.append({
                        "name": leader,
                        "title": match.group(1),
                        "quote": text
                    })
    
    def add_article(self, title, url, date, summary):
        """Add an article reference"""
        self.articles.append({
            "title": title,
            "url": url,
            "date": date,
            "summary": summary
        })
    
    def calculate_intelligence_score(self):
        """Calculate an intelligence score based on available information"""
        score = 0
        
        # Base score from number of intelligence items
        score += min(50, len(self.intelligence_items) * 5)
        
        # Bonus for power-related mentions (our primary interest)
        score += self.power_related_mentions * 10
        
        # Bonus for expansion mentions (indicates future power needs)
        score += self.expansion_mentions * 7
        
        # Bonus for financial mentions (indicates ability to invest)
        score += self.financial_mentions * 3
        
        # Bonus for leadership mentions (indicates decision-makers)
        score += len(self.leadership_mentions) * 5
        
        # Normalize to 0-100 scale
        return min(100, score)
    
    def to_dict(self):
        """Convert to dictionary for serialization"""
        return {
            "company_name": self.company_name,
            "sector": self.sector,
            "intelligence_score": self.calculate_intelligence_score(),
            "intelligence_items": self.intelligence_items,
            "articles": self.articles,
            "power_related_mentions": self.power_related_mentions,
            "expansion_mentions": self.expansion_mentions,
            "financial_mentions": self.financial_mentions,
            "leadership_mentions": self.leadership_mentions,
            "last_updated": self.last_updated
        }
    
    @classmethod
    def from_dict(cls, data):
        """Create from dictionary"""
        company = cls(data["company_name"])
        company.sector = data.get("sector", "")
        company.intelligence_items = data.get("intelligence_items", [])
        company.articles = data.get("articles", [])
        company.power_related_mentions = data.get("power_related_mentions", 0)
        company.expansion_mentions = data.get("expansion_mentions", 0)
        company.financial_mentions = data.get("financial_mentions", 0)
        company.leadership_mentions = data.get("leadership_mentions", [])
        company.last_updated = data.get("last_updated", datetime.now().strftime("%Y-%m-%d"))
        return company

class BusinessIntelligenceScraper:
    """Business intelligence scraper class"""
    def __init__(self):
        self.companies = {}
        self.load_existing_data()
        
        # User agents for rotation
        self.user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Safari/605.1.15',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        ]
    
    def load_existing_data(self):
        """Load existing company intelligence data"""
        data_file = "../Database/NewsData/Intelligence/company_intelligence.json"
        if os.path.exists(data_file):
            try:
                with open(data_file, 'r') as f:
                    companies_data = json.load(f)
                
                for company_data in companies_data:
                    company = CompanyIntelligence.from_dict(company_data)
                    self.companies[company.company_name] = company
                    
                logger.info(f"Loaded intelligence data for {len(self.companies)} companies")
            except Exception as e:
                logger.error(f"Error loading existing data: {str(e)}")
                self.companies = {}
    
    def save_data(self):
        """Save company intelligence data"""
        try:
            companies_data = [company.to_dict() for company in self.companies.values()]
            data_file = "../Database/NewsData/Intelligence/company_intelligence.json"
            with open(data_file, 'w') as f:
                json.dump(companies_data, f, indent=2)
            logger.info(f"Saved intelligence data for {len(self.companies)} companies")
        except Exception as e:
            logger.error(f"Error saving data: {str(e)}")
    
    def get_random_user_agent(self):
        """Get a random user agent"""
        return random.choice(self.user_agents)
    
    def extract_company_mentions(self, text):
        """Extract company mentions from text using known Nigerian companies"""
        companies = [
            "Dangote", "BUA Group", "MTN Nigeria", "Flour Mills of Nigeria", 
            "Lafarge Africa", "Nigerian Breweries", "Guinness Nigeria", "Nestle Nigeria", 
            "Cadbury Nigeria", "PZ Cussons", "Unilever Nigeria", "Honeywell Flour Mills",
            "Julius Berger", "Total Nigeria", "Oando", "Seplat", "FBN Holdings", 
            "FCMB Group", "UBA", "Access Bank", "Zenith Bank", "GTBank", "Fidelity Bank",
            "Transcorp", "UACN", "Beta Glass", "Champion Breweries", "International Breweries",
            "Berger Paints", "CAP Plc", "Cutix", "Dangote Cement", "Dangote Sugar", "NASCON",
            "Ecobank", "Nigerian Aviation Handling Company", "May & Baker", "GlaxoSmithKline",
            "NNPC", "Airtel", "Globacom", "9mobile", "Wema Bank", "Unity Bank", "Sterling Bank",
            "Stanbic IBTC", "First Bank", "United Capital", "AIICO Insurance", "AXA Mansard",
            "Continental Reinsurance", "Cornerstone Insurance", "Custodian Investment",
            "NEM Insurance", "NSIA Insurance", "Prestige Assurance", "Sovereign Trust Insurance",
            "Royal Exchange", "Japaul Oil", "Okomu Oil", "Presco", "Eterna", "MRS", "Conoil",
            "11 Plc", "Ikeja Hotel", "Transnational Corporation", "UACN Property Development",
            "Vitafoam", "Beta Glass", "Notore Chemical", "Fidson Healthcare", "Neimeth",
            "Morison Industries", "AG Leventis", "C&I Leasing", "Courteville Business Solutions",
            "E-Tranzact", "NCR Nigeria", "Tripple Gee", "Chams", "CWG", "Austin Laz & Company",
            "Ellah Lakes", "Livestock Feeds", "Ekocorp", "Medview Airline", "Learn Africa",
            "Omatek Ventures", "Forte Oil", "Mobil", "Consolidated Hallmark", "Guinea Insurance",
            "Law Union & Rock", "Niger Insurance", "Regency Alliance Insurance", "Universal Insurance",
            "Daar Communications", "Caverton Offshore Support Group", "Eunisell", "FTN Cocoa Processors",
            "McNichols", "Multi-Trex Integrated Foods", "Tantalizers", "Union Dicon Salt"
        ]
        
        found_companies = []
        for company in companies:
            # Use regex to find whole word matches
            pattern = r'\b' + re.escape(company) + r'\b'
            if re.search(pattern, text, re.IGNORECASE):
                found_companies.append(company)
        
        return found_companies
    
    def extract_intelligence(self, text, url, date):
        """Extract business intelligence from text"""
        intelligence_items = []
        
        for pattern_info in INTELLIGENCE_PATTERNS:
            pattern = pattern_info["pattern"]
            matches = re.finditer(pattern, text, re.IGNORECASE)
            
            for match in matches:
                # Get context around the match (100 characters before and after)
                start = max(0, match.start() - 100)
                end = min(len(text), match.end() + 100)
                context = text[start:end].strip()
                
                intelligence_items.append({
                    "category": pattern_info["category"],
                    "text": context,
                    "priority": pattern_info["priority"],
                    "source_url": url,
                    "date": date
                })
        
        return intelligence_items
    
    def scrape_source(self, source_info, limit=10):
        """Scrape a single news source"""
        headers = {
            'User-Agent': self.get_random_user_agent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.google.com/',
            'DNT': '1',
        }
        
        try:
            logger.info(f"Scraping {source_info['name']}: {source_info['url']}")
            response = requests.get(source_info['url'], headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            articles = soup.select(source_info['article_selector'])
            
            logger.info(f"Found {len(articles)} articles on {source_info['name']}")
            
            articles_processed = 0
            for article in articles[:limit]:  # Limit the number of articles
                try:
                    # Extract article information
                    title_elem = article.select_one(source_info['title_selector'])
                    if not title_elem:
                        continue
                        
                    title = title_elem.get_text().strip()
                    
                    link_elem = article.select_one(source_info['link_selector'])
                    if not link_elem:
                        continue
                        
                    link = link_elem.get('href')
                    if not link:
                        continue
                    
                    date_elem = article.select_one(source_info['date_selector'])
                    date = date_elem.get_text().strip() if date_elem else "N/A"
                    
                    summary_elem = article.select_one(source_info['summary_selector'])
                    summary = summary_elem.get_text().strip() if summary_elem else ""
                    
                    # Get article content
                    article_content = self.fetch_article_content(link, headers)
                    
                    # Process the article content
                    self.process_article(title, link, date, summary, article_content)
                    
                    articles_processed += 1
                    
                    # Add a delay between article requests to avoid overloading
                    time.sleep(random.uniform(2, 5))
                    
                except Exception as e:
                    logger.error(f"Error processing article: {str(e)}")
            
            logger.info(f"Processed {articles_processed} articles from {source_info['name']}")
            
        except Exception as e:
            logger.error(f"Error scraping {source_info['name']}: {str(e)}")
    
    def fetch_article_content(self, url, headers):
        """Fetch and parse article content"""
        try:
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Try different selectors for article content
            content_selectors = [
                'div.content p', 'div.entry-content p', 
                'article p', 'div.jeg_share_top ~ div p',
                'div.jeg_post_content p', 'div.article-body p'
            ]
            
            content = ""
            for selector in content_selectors:
                paragraphs = soup.select(selector)
                if paragraphs:
                    content = ' '.join([p.get_text().strip() for p in paragraphs])
                    break
            
            return content
            
        except Exception as e:
            logger.error(f"Error fetching article content from {url}: {str(e)}")
            return ""
    
    def process_article(self, title, url, date, summary, content):
        """Process an article to extract companies and intelligence"""
        # Combine all text for analysis
        all_text = f"{title} {summary} {content}"
        
        # Extract companies mentioned
        companies = self.extract_company_mentions(all_text)
        
        if not companies:
            logger.debug(f"No companies found in article: {title}")
            return
        
        # Extract intelligence
        intelligence_items = self.extract_intelligence(all_text, url, date)
        
        # Process each company
        for company_name in companies:
            if company_name not in self.companies:
                self.companies[company_name] = CompanyIntelligence(company_name)
            
            company = self.companies[company_name]
            
            # Add the article reference
            company.add_article(title, url, date, summary)
            
            # Add intelligence items
            for item in intelligence_items:
                company.add_intelligence(
                    item["category"],
                    item["text"],
                    item["priority"],
                    url,
                    date
                )
    
    def run(self, sources=None, limit=10):
        """Run the scraper on all or specified sources"""
        if sources:
            sources_to_scrape = [s for s in BUSINESS_SOURCES if s["name"] in sources]
        else:
            sources_to_scrape = BUSINESS_SOURCES
        
        logger.info(f"Starting business intelligence scraping for {len(sources_to_scrape)} sources")
        
        for source in sources_to_scrape:
            self.scrape_source(source, limit)
            
            # Add a delay between sources
            time.sleep(random.uniform(5, 10))
        
        # Save the results
        self.save_data()
        
        # Export analytics
        self.export_analytics()
    
    def export_analytics(self):
        """Export analytics about the scraped data"""
        # Create a DataFrame for the company intelligence
        data = []
        for company in self.companies.values():
            data.append({
                "Company": company.company_name,
                "Intelligence Score": company.calculate_intelligence_score(),
                "Articles": len(company.articles),
                "Power Mentions": company.power_related_mentions,
                "Expansion Mentions": company.expansion_mentions,
                "Financial Mentions": company.financial_mentions,
                "Leadership Contacts": len(company.leadership_mentions),
                "Last Updated": company.last_updated
            })
        
        df = pd.DataFrame(data)
        
        # Sort by intelligence score
        df = df.sort_values('Intelligence Score', ascending=False)
        
        # Export to Excel
        output_file = "../Database/NewsData/Intelligence/company_analytics.xlsx"
        df.to_excel(output_file, index=False)
        logger.info(f"Exported company analytics to {output_file}")
        
        # Export markdown report
        self.export_markdown_report()
    
    def export_markdown_report(self):
        """Export a markdown report with detailed company insights"""
        # Get top companies sorted by intelligence score
        top_companies = sorted(
            self.companies.values(),
            key=lambda x: x.calculate_intelligence_score(),
            reverse=True
        )
        
        # Create the report
        report = "# Company Business Intelligence Report\n\n"
        report += f"*Generated on {datetime.now().strftime('%Y-%m-%d')}*\n\n"
        
        # Summary section
        report += "## Summary\n\n"
        report += f"This report contains business intelligence on {len(self.companies)} Nigerian companies, "
        report += "with a focus on energy usage, expansion plans, and operational details.\n\n"
        
        # Top companies section
        report += "## Top Companies by Intelligence Score\n\n"
        
        for i, company in enumerate(top_companies[:15], 1):
            report += f"### {i}. {company.company_name} (Score: {company.calculate_intelligence_score()})\n\n"
            
            # Key stats
            report += "**Key Intelligence:**\n"
            report += f"- Power-related mentions: {company.power_related_mentions}\n"
            report += f"- Expansion mentions: {company.expansion_mentions}\n"
            report += f"- Financial mentions: {company.financial_mentions}\n"
            report += f"- Leadership contacts: {len(company.leadership_mentions)}\n\n"
            
            # One-line value proposition
            energy_focus = "high" if company.power_related_mentions > 3 else "moderate" if company.power_related_mentions > 1 else "unknown"
            expansion_focus = "active expansion" if company.expansion_mentions > 2 else "some growth" if company.expansion_mentions > 0 else "stable operations"
            
            report += "**IPP Value Proposition:** "
            report += f"With {energy_focus} energy needs and {expansion_focus}, {company.company_name} is an "
            
            if company.calculate_intelligence_score() > 80:
                report += "ideal target for IPP solutions that can provide reliable power at scale while supporting their growth trajectory.\n\n"
            elif company.calculate_intelligence_score() > 60:
                report += "excellent prospect for IPP solutions that can reduce operational costs and improve reliability.\n\n"
            else:
                report += "potential candidate for IPP solutions that align with their current operational needs.\n\n"
            
            # Top intelligence items
            high_priority_items = [item for item in company.intelligence_items if item["priority"] == "High"]
            if high_priority_items:
                report += "**Critical Business Intelligence:**\n\n"
                for item in high_priority_items[:3]:  # Top 3 high priority items
                    report += f"- {item['category']}: \"{item['text']}\"\n"
                report += "\n"
            
            # Leadership mentions
            if company.leadership_mentions:
                report += "**Key Decision Makers:**\n\n"
                for leader in company.leadership_mentions[:2]:  # Top 2 leaders
                    report += f"- {leader.get('name', 'Unknown')} ({leader.get('title', 'Leader')})\n"
                report += "\n"
            
            # Recent articles
            if company.articles:
                report += "**Recent Coverage:**\n\n"
                for article in company.articles[:2]:  # Top 2 articles
                    report += f"- [{article['title']}]({article['url']})\n"
                report += "\n"
            
            report += "---\n\n"
        
        # Write the report
        output_file = "../Database/NewsData/Intelligence/company_intelligence_report.md"
        with open(output_file, 'w') as f:
            f.write(report)
        
        logger.info(f"Exported markdown report to {output_file}")

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Business Intelligence Scraper")
    parser.add_argument('--sources', help='Comma-separated list of sources to scrape (default: all)')
    parser.add_argument('--limit', type=int, default=10, help='Maximum number of articles per source (default: 10)')
    
    args = parser.parse_args()
    
    sources = args.sources.split(',') if args.sources else None
    
    scraper = BusinessIntelligenceScraper()
    scraper.run(sources=sources, limit=args.limit)

if __name__ == "__main__":
    main() 