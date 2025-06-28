#!/usr/bin/env python3
"""
RSS Business Intelligence Gatherer
This tool gathers business intelligence from Nigerian business RSS feeds,
which are more reliable to access than web scraping.
"""

import os
import json
import time
import pandas as pd
from datetime import datetime
import logging
import requests
import re
import feedparser
import random

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("../Database/NewsData/rss_intelligence.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("RSSBusinessIntel")

# Create necessary directories
os.makedirs("../Database/NewsData/Intelligence", exist_ok=True)

# Nigerian business RSS feeds
RSS_FEEDS = [
    {
        "name": "BusinessDay",
        "url": "https://businessday.ng/feed/",
        "categories": ["companies", "energy", "industry"]
    },
    {
        "name": "Nairametrics",
        "url": "https://nairametrics.com/feed/",
        "categories": ["companies", "business", "industry"]
    },
    {
        "name": "Punch Business",
        "url": "https://punchng.com/topics/business/feed/",
        "categories": ["business"]
    },
    {
        "name": "Vanguard Business",
        "url": "https://www.vanguardngr.com/category/business/feed/",
        "categories": ["business"]
    },
    {
        "name": "This Day Business",
        "url": "https://www.thisdaylive.com/index.php/business/feed/",
        "categories": ["business"]
    }
]

# Key Nigerian companies to look for
KEY_COMPANIES = [
    # Manufacturing/Industrial
    {"name": "Dangote Group", "sector": "Manufacturing/Energy"},
    {"name": "BUA Group", "sector": "Manufacturing/Cement"},
    {"name": "Lafarge Africa", "sector": "Manufacturing/Cement"},
    {"name": "Nigerian Breweries", "sector": "Manufacturing/Beverages"},
    {"name": "Guinness Nigeria", "sector": "Manufacturing/Beverages"},
    {"name": "Nestle Nigeria", "sector": "Manufacturing/Food"},
    {"name": "Cadbury Nigeria", "sector": "Manufacturing/Food"},
    {"name": "PZ Cussons", "sector": "Manufacturing/Consumer Goods"},
    {"name": "Unilever Nigeria", "sector": "Manufacturing/Consumer Goods"},
    {"name": "Flour Mills of Nigeria", "sector": "Manufacturing/Food"},
    {"name": "Honeywell Flour Mills", "sector": "Manufacturing/Food"},
    
    # Oil & Gas
    {"name": "NNPC", "sector": "Oil & Gas"},
    {"name": "Total Nigeria", "sector": "Oil & Gas"},
    {"name": "Oando", "sector": "Oil & Gas"},
    {"name": "Seplat", "sector": "Oil & Gas"},
    {"name": "Conoil", "sector": "Oil & Gas"},
    {"name": "MRS Oil", "sector": "Oil & Gas"},
    {"name": "11 Plc", "sector": "Oil & Gas"},
    
    # Banking/Finance
    {"name": "Access Bank", "sector": "Banking"},
    {"name": "First Bank", "sector": "Banking"},
    {"name": "Zenith Bank", "sector": "Banking"},
    {"name": "GTBank", "sector": "Banking"},
    {"name": "UBA", "sector": "Banking"},
    {"name": "FCMB", "sector": "Banking"},
    {"name": "Fidelity Bank", "sector": "Banking"},
    {"name": "Sterling Bank", "sector": "Banking"},
    {"name": "Wema Bank", "sector": "Banking"},
    
    # Telecommunications
    {"name": "MTN Nigeria", "sector": "Telecommunications"},
    {"name": "Airtel", "sector": "Telecommunications"},
    {"name": "Globacom", "sector": "Telecommunications"},
    {"name": "9mobile", "sector": "Telecommunications"},
    
    # Construction
    {"name": "Julius Berger", "sector": "Construction"},
    
    # Conglomerates
    {"name": "Transcorp", "sector": "Conglomerate"},
    {"name": "UACN", "sector": "Conglomerate"}
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
    def __init__(self, company_name, sector=""):
        self.company_name = company_name
        self.sector = sector
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

class RSSBusinessIntelligence:
    """RSS business intelligence gathering class"""
    def __init__(self):
        self.companies = {}
        self.load_existing_data()
        
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
    
    def find_company_matches(self, text):
        """Find companies mentioned in text"""
        matches = []
        
        for company in KEY_COMPANIES:
            # Create regex pattern to match company name as whole word
            pattern = r'\b' + re.escape(company["name"]) + r'\b'
            if re.search(pattern, text, re.IGNORECASE):
                matches.append(company)
        
        return matches
    
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
    
    def fetch_rss_feed(self, feed_info, limit=20):
        """Fetch articles from an RSS feed"""
        try:
            logger.info(f"Fetching RSS feed: {feed_info['name']} from {feed_info['url']}")
            
            # Parse the feed
            feed = feedparser.parse(feed_info['url'])
            
            if feed.bozo:
                logger.warning(f"Feed parsing error: {feed.bozo_exception}")
            
            # Process entries
            for i, entry in enumerate(feed.entries[:limit]):
                if i >= limit:
                    break
                
                try:
                    # Extract entry data
                    title = entry.title
                    link = entry.link
                    
                    # Get date (published or updated)
                    if hasattr(entry, 'published'):
                        date = entry.published
                    elif hasattr(entry, 'updated'):
                        date = entry.updated
                    else:
                        date = datetime.now().strftime("%Y-%m-%d")
                    
                    # Get summary/content
                    if hasattr(entry, 'summary'):
                        summary = entry.summary
                    elif hasattr(entry, 'description'):
                        summary = entry.description
                    else:
                        summary = ""
                    
                    # Get full content if available
                    content = ""
                    if hasattr(entry, 'content'):
                        for content_item in entry.content:
                            if 'value' in content_item:
                                content += content_item.value
                    
                    # If no content, use summary
                    if not content:
                        content = summary
                    
                    # Process the entry
                    self.process_entry(title, link, date, summary, content)
                    
                    # Add a small delay
                    time.sleep(random.uniform(0.2, 0.5))
                    
                except Exception as e:
                    logger.error(f"Error processing entry: {str(e)}")
            
            logger.info(f"Processed {min(limit, len(feed.entries))} entries from {feed_info['name']}")
            
        except Exception as e:
            logger.error(f"Error fetching feed {feed_info['name']}: {str(e)}")
    
    def process_entry(self, title, url, date, summary, content):
        """Process a feed entry"""
        # Combine title, summary and content for analysis
        full_text = f"{title} {summary} {content}"
        
        # Find companies mentioned
        company_matches = self.find_company_matches(full_text)
        
        if not company_matches:
            return
        
        # Extract intelligence
        intelligence_items = self.extract_intelligence(full_text, url, date)
        
        # Process each company
        for company in company_matches:
            name = company["name"]
            sector = company["sector"]
            
            if name not in self.companies:
                self.companies[name] = CompanyIntelligence(name, sector)
            
            company_intel = self.companies[name]
            
            # Make sure sector is set
            if not company_intel.sector and sector:
                company_intel.sector = sector
            
            # Add the article
            company_intel.add_article(title, url, date, summary)
            
            # Add intelligence items
            for item in intelligence_items:
                company_intel.add_intelligence(
                    item["category"],
                    item["text"],
                    item["priority"],
                    url,
                    date
                )
    
    def run(self, feeds=None, limit=20):
        """Run the intelligence gathering on RSS feeds"""
        if feeds:
            feeds_to_process = [f for f in RSS_FEEDS if f["name"] in feeds]
        else:
            feeds_to_process = RSS_FEEDS
        
        logger.info(f"Starting intelligence gathering from {len(feeds_to_process)} RSS feeds")
        
        for feed in feeds_to_process:
            self.fetch_rss_feed(feed, limit)
            
            # Add a delay between feeds
            time.sleep(random.uniform(1, 3))
        
        # Save the results
        self.save_data()
        
        # Create reports
        self.generate_reports()
    
    def generate_reports(self):
        """Generate reports from the gathered intelligence"""
        # Get companies sorted by intelligence score
        sorted_companies = sorted(
            self.companies.values(),
            key=lambda x: x.calculate_intelligence_score(),
            reverse=True
        )
        
        # Generate the full markdown report
        self.generate_markdown_report(sorted_companies)
        
        # Generate the excel report
        self.generate_excel_report(sorted_companies)
        
        # Generate the qualified leads list
        self.generate_qualified_leads(sorted_companies)
    
    def generate_markdown_report(self, sorted_companies):
        """Generate a markdown report with the intelligence data"""
        report = "# Nigerian Companies Business Intelligence Report\n\n"
        report += f"*Generated on {datetime.now().strftime('%Y-%m-%d')}*\n\n"
        
        # Summary
        report += "## Summary\n\n"
        report += f"This report contains business intelligence gathered from RSS feeds about {len(sorted_companies)} Nigerian companies.\n\n"
        report += f"The data focuses on energy usage, expansion plans, and operational challenges to identify potential IPP clients.\n\n"
        
        # Top companies by intelligence score
        report += "## Top Companies by Intelligence\n\n"
        
        for i, company in enumerate(sorted_companies[:15], 1):
            score = company.calculate_intelligence_score()
            if score == 0:
                continue  # Skip companies with no intelligence
                
            report += f"### {i}. {company.company_name} ({company.sector})\n\n"
            report += f"**Intelligence Score:** {score}/100\n\n"
            
            # Key stats
            report += "**Key Metrics:**\n"
            report += f"- Power-related mentions: {company.power_related_mentions}\n"
            report += f"- Expansion mentions: {company.expansion_mentions}\n"
            report += f"- Financial mentions: {company.financial_mentions}\n"
            
            # Value proposition
            energy_needs = "high" if company.power_related_mentions >= 2 else "potential"
            growth_status = "expanding" if company.expansion_mentions >= 1 else "operational"
            
            report += "\n**IPP Value Proposition:** "
            if score >= 80:
                report += f"With {energy_needs} energy needs and {growth_status} focus, {company.company_name} is an ideal IPP client that would benefit from stable, reliable power to support their critical operations and growth plans.\n\n"
            elif score >= 60:
                report += f"{company.company_name}'s {energy_needs} energy requirements and {growth_status} status make them a strong prospect for IPP solutions that can reduce costs while improving reliability.\n\n"
            else:
                report += f"{company.company_name} shows {energy_needs} indicators for IPP conversion with their current {growth_status} profile indicating potential for energy optimization.\n\n"
            
            # High priority intelligence
            high_priority = [item for item in company.intelligence_items if item["priority"] == "High"]
            if high_priority:
                report += "**Key Energy Intelligence:**\n\n"
                for item in high_priority[:3]:
                    report += f"- {item['category']}: \"{item['text']}\"\n"
                report += "\n"
            
            # Recent articles
            if company.articles:
                report += "**Recent Coverage:**\n\n"
                for article in company.articles[:3]:
                    report += f"- [{article['title']}]({article['url']})\n"
                report += "\n"
            
            report += "---\n\n"
        
        # Write to file
        output_file = "../Database/NewsData/Intelligence/business_intelligence_report.md"
        with open(output_file, 'w') as f:
            f.write(report)
        
        logger.info(f"Generated markdown report: {output_file}")
    
    def generate_excel_report(self, sorted_companies):
        """Generate an Excel report with the intelligence data"""
        # Prepare data for DataFrame
        data = []
        for company in sorted_companies:
            score = company.calculate_intelligence_score()
            if score == 0:
                continue  # Skip companies with no intelligence
                
            # Estimate power needs based on mentions and sector
            estimated_mw = 0
            if company.sector == "Manufacturing/Cement":
                estimated_mw = 40
            elif company.sector == "Manufacturing/Food":
                estimated_mw = 25
            elif company.sector == "Manufacturing/Beverages":
                estimated_mw = 30
            elif company.sector == "Oil & Gas":
                estimated_mw = 50
            elif company.sector == "Banking":
                estimated_mw = 20
            elif company.sector == "Telecommunications":
                estimated_mw = 80
            elif "Manufacturing" in company.sector:
                estimated_mw = 35
            else:
                estimated_mw = 15
                
            # Adjust based on intelligence
            if company.power_related_mentions > 2:
                estimated_mw *= 1.2
            elif company.expansion_mentions > 2:
                estimated_mw *= 1.1
                
            # Cost calculations (₦65,000 per MWh)
            annual_cost = estimated_mw * 24 * 365 * 65000 / 1000000000  # in billions
            potential_savings = annual_cost * 0.35
            
            # Determine priority
            if score >= 80:
                priority = "A"
            elif score >= 60:
                priority = "B"
            else:
                priority = "C"
                
            # Energy needs assessment
            if estimated_mw >= 50:
                energy_needs = "Very High"
            elif estimated_mw >= 30:
                energy_needs = "High"
            elif estimated_mw >= 15:
                energy_needs = "Medium"
            else:
                energy_needs = "Low"
                
            # Value proposition
            energy_term = "high" if company.power_related_mentions >= 2 else "potential"
            growth_term = "expanding" if company.expansion_mentions >= 1 else "operational"
            
            if score >= 80:
                value_prop = f"With {energy_term} energy needs and {growth_term} focus, an ideal IPP client that would benefit from stable, reliable power."
            elif score >= 60:
                value_prop = f"{energy_term.capitalize()} energy requirements and {growth_term} status make them a strong prospect for IPP solutions that reduce costs."
            else:
                value_prop = f"Shows {energy_term} indicators for IPP conversion with current {growth_term} profile indicating potential for energy optimization."
            
            # Add to data
            data.append({
                "Company": company.company_name,
                "Sector": company.sector,
                "Priority": priority,
                "Lead Score": score,
                "Energy Needs": energy_needs,
                "Power Mentions": company.power_related_mentions,
                "Expansion Mentions": company.expansion_mentions,
                "Financial Mentions": company.financial_mentions,
                "Est. Power Need (MW)": round(estimated_mw, 1),
                "Annual Power Cost (₦ Billion)": round(annual_cost, 2),
                "Potential Savings (₦ Billion)": round(potential_savings, 2),
                "Value Proposition": value_prop,
                "Articles": len(company.articles),
                "Last Updated": company.last_updated
            })
        
        # Check if we have any data
        if not data:
            logger.warning("No company data to generate Excel report")
            return
            
        # Create DataFrame
        df = pd.DataFrame(data)
        
        # Sort by priority and lead score
        if 'Priority' in df.columns and 'Lead Score' in df.columns and not df.empty:
            df = df.sort_values(['Priority', 'Lead Score'], ascending=[True, False])
        
        # Write to Excel
        output_file = "../Database/NewsData/Intelligence/business_intelligence.xlsx"
        df.to_excel(output_file, index=False)
        
        logger.info(f"Generated Excel report: {output_file}")
    
    def generate_qualified_leads(self, sorted_companies):
        """Generate a simple qualified leads list in markdown format"""
        leads = []
        for company in sorted_companies:
            score = company.calculate_intelligence_score()
            if score == 0:
                continue  # Skip companies with no intelligence
            
            # Estimate power needs based on mentions and sector
            estimated_mw = 0
            if company.sector == "Manufacturing/Cement":
                estimated_mw = 40
            elif company.sector == "Manufacturing/Food":
                estimated_mw = 25
            elif company.sector == "Manufacturing/Beverages":
                estimated_mw = 30
            elif company.sector == "Oil & Gas":
                estimated_mw = 50
            elif company.sector == "Banking":
                estimated_mw = 20
            elif company.sector == "Telecommunications":
                estimated_mw = 80
            elif "Manufacturing" in company.sector:
                estimated_mw = 35
            else:
                estimated_mw = 15
                
            # Adjust based on intelligence
            if company.power_related_mentions > 2:
                estimated_mw *= 1.2
            elif company.expansion_mentions > 2:
                estimated_mw *= 1.1
                
            # Priority
            if score >= 80:
                priority = "A"
            elif score >= 60:
                priority = "B"
            else:
                priority = "C"
            
            # Value proposition - keep it to one concise sentence
            if company.power_related_mentions >= 2:
                value_prop = f"Demonstrated power needs of {estimated_mw:.1f} MW could be efficiently met with IPP solution, providing immediate operational benefits and cost savings of ~₦{estimated_mw * 24 * 365 * 65000 * 0.35 / 1000000000:.1f} billion annually."
            elif company.expansion_mentions >= 2:
                value_prop = f"Expanding operations require reliable power solutions; IPP offering could save ~₦{estimated_mw * 24 * 365 * 65000 * 0.35 / 1000000000:.1f} billion annually while supporting their growth initiatives."
            elif company.financial_mentions >= 2:
                value_prop = f"Financial indicators suggest ability to invest in power infrastructure; IPP could deliver ₦{estimated_mw * 24 * 365 * 65000 * 0.35 / 1000000000:.1f} billion annual savings with strong ROI."
            else:
                value_prop = f"{company.sector} operations typically require reliable power; IPP solution could provide significant cost benefits with estimated savings of ₦{estimated_mw * 24 * 365 * 65000 * 0.35 / 1000000000:.1f} billion annually."
            
            # Add to leads
            leads.append({
                "Company": company.company_name,
                "Sector": company.sector,
                "Priority": priority,
                "Lead Score": score,
                "Est. MW": round(estimated_mw, 1),
                "Value Proposition": value_prop
            })
        
        # Check if we have any leads
        if not leads:
            logger.warning("No qualified leads to generate report")
            return
            
        # Create the report
        report = "# Top Qualified IPP Leads from Business Intelligence\n\n"
        report += f"*Generated on {datetime.now().strftime('%Y-%m-%d')}*\n\n"
        
        report += "| Company | Sector | Priority | Score | Est. MW | One-Sentence Value Proposition |\n"
        report += "|---------|--------|----------|-------|---------|--------------------------------|\n"
        
        # Add sorted leads
        for lead in sorted(leads, key=lambda x: (x["Priority"], -x["Lead Score"]))[:10]:
            report += f"| {lead['Company']} | {lead['Sector']} | {lead['Priority']} | {lead['Lead Score']} | {lead['Est. MW']} | {lead['Value Proposition']} |\n"
        
        # Write to file
        output_file = "../Database/NewsData/Intelligence/qualified_leads_list.md"
        with open(output_file, 'w') as f:
            f.write(report)
        
        logger.info(f"Generated qualified leads list: {output_file}")

def main():
    """Main function to run the intelligence gathering"""
    import argparse
    
    parser = argparse.ArgumentParser(description="RSS Business Intelligence Gatherer")
    parser.add_argument('--feeds', help='Comma-separated list of feed names to process (default: all)')
    parser.add_argument('--limit', type=int, default=20, help='Maximum number of entries per feed (default: 20)')
    
    args = parser.parse_args()
    
    feeds = args.feeds.split(',') if args.feeds else None
    
    # Start the intelligence gathering
    gatherer = RSSBusinessIntelligence()
    gatherer.run(feeds=feeds, limit=args.limit)

if __name__ == "__main__":
    main() 
"""
RSS Business Intelligence Gatherer
This tool gathers business intelligence from Nigerian business RSS feeds,
which are more reliable to access than web scraping.
"""

import os
import json
import time
import pandas as pd
from datetime import datetime
import logging
import requests
import re
import feedparser
import random

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("../Database/NewsData/rss_intelligence.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("RSSBusinessIntel")

# Create necessary directories
os.makedirs("../Database/NewsData/Intelligence", exist_ok=True)

# Nigerian business RSS feeds
RSS_FEEDS = [
    {
        "name": "BusinessDay",
        "url": "https://businessday.ng/feed/",
        "categories": ["companies", "energy", "industry"]
    },
    {
        "name": "Nairametrics",
        "url": "https://nairametrics.com/feed/",
        "categories": ["companies", "business", "industry"]
    },
    {
        "name": "Punch Business",
        "url": "https://punchng.com/topics/business/feed/",
        "categories": ["business"]
    },
    {
        "name": "Vanguard Business",
        "url": "https://www.vanguardngr.com/category/business/feed/",
        "categories": ["business"]
    },
    {
        "name": "This Day Business",
        "url": "https://www.thisdaylive.com/index.php/business/feed/",
        "categories": ["business"]
    }
]

# Key Nigerian companies to look for
KEY_COMPANIES = [
    # Manufacturing/Industrial
    {"name": "Dangote Group", "sector": "Manufacturing/Energy"},
    {"name": "BUA Group", "sector": "Manufacturing/Cement"},
    {"name": "Lafarge Africa", "sector": "Manufacturing/Cement"},
    {"name": "Nigerian Breweries", "sector": "Manufacturing/Beverages"},
    {"name": "Guinness Nigeria", "sector": "Manufacturing/Beverages"},
    {"name": "Nestle Nigeria", "sector": "Manufacturing/Food"},
    {"name": "Cadbury Nigeria", "sector": "Manufacturing/Food"},
    {"name": "PZ Cussons", "sector": "Manufacturing/Consumer Goods"},
    {"name": "Unilever Nigeria", "sector": "Manufacturing/Consumer Goods"},
    {"name": "Flour Mills of Nigeria", "sector": "Manufacturing/Food"},
    {"name": "Honeywell Flour Mills", "sector": "Manufacturing/Food"},
    
    # Oil & Gas
    {"name": "NNPC", "sector": "Oil & Gas"},
    {"name": "Total Nigeria", "sector": "Oil & Gas"},
    {"name": "Oando", "sector": "Oil & Gas"},
    {"name": "Seplat", "sector": "Oil & Gas"},
    {"name": "Conoil", "sector": "Oil & Gas"},
    {"name": "MRS Oil", "sector": "Oil & Gas"},
    {"name": "11 Plc", "sector": "Oil & Gas"},
    
    # Banking/Finance
    {"name": "Access Bank", "sector": "Banking"},
    {"name": "First Bank", "sector": "Banking"},
    {"name": "Zenith Bank", "sector": "Banking"},
    {"name": "GTBank", "sector": "Banking"},
    {"name": "UBA", "sector": "Banking"},
    {"name": "FCMB", "sector": "Banking"},
    {"name": "Fidelity Bank", "sector": "Banking"},
    {"name": "Sterling Bank", "sector": "Banking"},
    {"name": "Wema Bank", "sector": "Banking"},
    
    # Telecommunications
    {"name": "MTN Nigeria", "sector": "Telecommunications"},
    {"name": "Airtel", "sector": "Telecommunications"},
    {"name": "Globacom", "sector": "Telecommunications"},
    {"name": "9mobile", "sector": "Telecommunications"},
    
    # Construction
    {"name": "Julius Berger", "sector": "Construction"},
    
    # Conglomerates
    {"name": "Transcorp", "sector": "Conglomerate"},
    {"name": "UACN", "sector": "Conglomerate"}
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
    def __init__(self, company_name, sector=""):
        self.company_name = company_name
        self.sector = sector
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

class RSSBusinessIntelligence:
    """RSS business intelligence gathering class"""
    def __init__(self):
        self.companies = {}
        self.load_existing_data()
        
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
    
    def find_company_matches(self, text):
        """Find companies mentioned in text"""
        matches = []
        
        for company in KEY_COMPANIES:
            # Create regex pattern to match company name as whole word
            pattern = r'\b' + re.escape(company["name"]) + r'\b'
            if re.search(pattern, text, re.IGNORECASE):
                matches.append(company)
        
        return matches
    
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
    
    def fetch_rss_feed(self, feed_info, limit=20):
        """Fetch articles from an RSS feed"""
        try:
            logger.info(f"Fetching RSS feed: {feed_info['name']} from {feed_info['url']}")
            
            # Parse the feed
            feed = feedparser.parse(feed_info['url'])
            
            if feed.bozo:
                logger.warning(f"Feed parsing error: {feed.bozo_exception}")
            
            # Process entries
            for i, entry in enumerate(feed.entries[:limit]):
                if i >= limit:
                    break
                
                try:
                    # Extract entry data
                    title = entry.title
                    link = entry.link
                    
                    # Get date (published or updated)
                    if hasattr(entry, 'published'):
                        date = entry.published
                    elif hasattr(entry, 'updated'):
                        date = entry.updated
                    else:
                        date = datetime.now().strftime("%Y-%m-%d")
                    
                    # Get summary/content
                    if hasattr(entry, 'summary'):
                        summary = entry.summary
                    elif hasattr(entry, 'description'):
                        summary = entry.description
                    else:
                        summary = ""
                    
                    # Get full content if available
                    content = ""
                    if hasattr(entry, 'content'):
                        for content_item in entry.content:
                            if 'value' in content_item:
                                content += content_item.value
                    
                    # If no content, use summary
                    if not content:
                        content = summary
                    
                    # Process the entry
                    self.process_entry(title, link, date, summary, content)
                    
                    # Add a small delay
                    time.sleep(random.uniform(0.2, 0.5))
                    
                except Exception as e:
                    logger.error(f"Error processing entry: {str(e)}")
            
            logger.info(f"Processed {min(limit, len(feed.entries))} entries from {feed_info['name']}")
            
        except Exception as e:
            logger.error(f"Error fetching feed {feed_info['name']}: {str(e)}")
    
    def process_entry(self, title, url, date, summary, content):
        """Process a feed entry"""
        # Combine title, summary and content for analysis
        full_text = f"{title} {summary} {content}"
        
        # Find companies mentioned
        company_matches = self.find_company_matches(full_text)
        
        if not company_matches:
            return
        
        # Extract intelligence
        intelligence_items = self.extract_intelligence(full_text, url, date)
        
        # Process each company
        for company in company_matches:
            name = company["name"]
            sector = company["sector"]
            
            if name not in self.companies:
                self.companies[name] = CompanyIntelligence(name, sector)
            
            company_intel = self.companies[name]
            
            # Make sure sector is set
            if not company_intel.sector and sector:
                company_intel.sector = sector
            
            # Add the article
            company_intel.add_article(title, url, date, summary)
            
            # Add intelligence items
            for item in intelligence_items:
                company_intel.add_intelligence(
                    item["category"],
                    item["text"],
                    item["priority"],
                    url,
                    date
                )
    
    def run(self, feeds=None, limit=20):
        """Run the intelligence gathering on RSS feeds"""
        if feeds:
            feeds_to_process = [f for f in RSS_FEEDS if f["name"] in feeds]
        else:
            feeds_to_process = RSS_FEEDS
        
        logger.info(f"Starting intelligence gathering from {len(feeds_to_process)} RSS feeds")
        
        for feed in feeds_to_process:
            self.fetch_rss_feed(feed, limit)
            
            # Add a delay between feeds
            time.sleep(random.uniform(1, 3))
        
        # Save the results
        self.save_data()
        
        # Create reports
        self.generate_reports()
    
    def generate_reports(self):
        """Generate reports from the gathered intelligence"""
        # Get companies sorted by intelligence score
        sorted_companies = sorted(
            self.companies.values(),
            key=lambda x: x.calculate_intelligence_score(),
            reverse=True
        )
        
        # Generate the full markdown report
        self.generate_markdown_report(sorted_companies)
        
        # Generate the excel report
        self.generate_excel_report(sorted_companies)
        
        # Generate the qualified leads list
        self.generate_qualified_leads(sorted_companies)
    
    def generate_markdown_report(self, sorted_companies):
        """Generate a markdown report with the intelligence data"""
        report = "# Nigerian Companies Business Intelligence Report\n\n"
        report += f"*Generated on {datetime.now().strftime('%Y-%m-%d')}*\n\n"
        
        # Summary
        report += "## Summary\n\n"
        report += f"This report contains business intelligence gathered from RSS feeds about {len(sorted_companies)} Nigerian companies.\n\n"
        report += f"The data focuses on energy usage, expansion plans, and operational challenges to identify potential IPP clients.\n\n"
        
        # Top companies by intelligence score
        report += "## Top Companies by Intelligence\n\n"
        
        for i, company in enumerate(sorted_companies[:15], 1):
            score = company.calculate_intelligence_score()
            if score == 0:
                continue  # Skip companies with no intelligence
                
            report += f"### {i}. {company.company_name} ({company.sector})\n\n"
            report += f"**Intelligence Score:** {score}/100\n\n"
            
            # Key stats
            report += "**Key Metrics:**\n"
            report += f"- Power-related mentions: {company.power_related_mentions}\n"
            report += f"- Expansion mentions: {company.expansion_mentions}\n"
            report += f"- Financial mentions: {company.financial_mentions}\n"
            
            # Value proposition
            energy_needs = "high" if company.power_related_mentions >= 2 else "potential"
            growth_status = "expanding" if company.expansion_mentions >= 1 else "operational"
            
            report += "\n**IPP Value Proposition:** "
            if score >= 80:
                report += f"With {energy_needs} energy needs and {growth_status} focus, {company.company_name} is an ideal IPP client that would benefit from stable, reliable power to support their critical operations and growth plans.\n\n"
            elif score >= 60:
                report += f"{company.company_name}'s {energy_needs} energy requirements and {growth_status} status make them a strong prospect for IPP solutions that can reduce costs while improving reliability.\n\n"
            else:
                report += f"{company.company_name} shows {energy_needs} indicators for IPP conversion with their current {growth_status} profile indicating potential for energy optimization.\n\n"
            
            # High priority intelligence
            high_priority = [item for item in company.intelligence_items if item["priority"] == "High"]
            if high_priority:
                report += "**Key Energy Intelligence:**\n\n"
                for item in high_priority[:3]:
                    report += f"- {item['category']}: \"{item['text']}\"\n"
                report += "\n"
            
            # Recent articles
            if company.articles:
                report += "**Recent Coverage:**\n\n"
                for article in company.articles[:3]:
                    report += f"- [{article['title']}]({article['url']})\n"
                report += "\n"
            
            report += "---\n\n"
        
        # Write to file
        output_file = "../Database/NewsData/Intelligence/business_intelligence_report.md"
        with open(output_file, 'w') as f:
            f.write(report)
        
        logger.info(f"Generated markdown report: {output_file}")
    
    def generate_excel_report(self, sorted_companies):
        """Generate an Excel report with the intelligence data"""
        # Prepare data for DataFrame
        data = []
        for company in sorted_companies:
            score = company.calculate_intelligence_score()
            if score == 0:
                continue  # Skip companies with no intelligence
                
            # Estimate power needs based on mentions and sector
            estimated_mw = 0
            if company.sector == "Manufacturing/Cement":
                estimated_mw = 40
            elif company.sector == "Manufacturing/Food":
                estimated_mw = 25
            elif company.sector == "Manufacturing/Beverages":
                estimated_mw = 30
            elif company.sector == "Oil & Gas":
                estimated_mw = 50
            elif company.sector == "Banking":
                estimated_mw = 20
            elif company.sector == "Telecommunications":
                estimated_mw = 80
            elif "Manufacturing" in company.sector:
                estimated_mw = 35
            else:
                estimated_mw = 15
                
            # Adjust based on intelligence
            if company.power_related_mentions > 2:
                estimated_mw *= 1.2
            elif company.expansion_mentions > 2:
                estimated_mw *= 1.1
                
            # Cost calculations (₦65,000 per MWh)
            annual_cost = estimated_mw * 24 * 365 * 65000 / 1000000000  # in billions
            potential_savings = annual_cost * 0.35
            
            # Determine priority
            if score >= 80:
                priority = "A"
            elif score >= 60:
                priority = "B"
            else:
                priority = "C"
                
            # Energy needs assessment
            if estimated_mw >= 50:
                energy_needs = "Very High"
            elif estimated_mw >= 30:
                energy_needs = "High"
            elif estimated_mw >= 15:
                energy_needs = "Medium"
            else:
                energy_needs = "Low"
                
            # Value proposition
            energy_term = "high" if company.power_related_mentions >= 2 else "potential"
            growth_term = "expanding" if company.expansion_mentions >= 1 else "operational"
            
            if score >= 80:
                value_prop = f"With {energy_term} energy needs and {growth_term} focus, an ideal IPP client that would benefit from stable, reliable power."
            elif score >= 60:
                value_prop = f"{energy_term.capitalize()} energy requirements and {growth_term} status make them a strong prospect for IPP solutions that reduce costs."
            else:
                value_prop = f"Shows {energy_term} indicators for IPP conversion with current {growth_term} profile indicating potential for energy optimization."
            
            # Add to data
            data.append({
                "Company": company.company_name,
                "Sector": company.sector,
                "Priority": priority,
                "Lead Score": score,
                "Energy Needs": energy_needs,
                "Power Mentions": company.power_related_mentions,
                "Expansion Mentions": company.expansion_mentions,
                "Financial Mentions": company.financial_mentions,
                "Est. Power Need (MW)": round(estimated_mw, 1),
                "Annual Power Cost (₦ Billion)": round(annual_cost, 2),
                "Potential Savings (₦ Billion)": round(potential_savings, 2),
                "Value Proposition": value_prop,
                "Articles": len(company.articles),
                "Last Updated": company.last_updated
            })
        
        # Check if we have any data
        if not data:
            logger.warning("No company data to generate Excel report")
            return
            
        # Create DataFrame
        df = pd.DataFrame(data)
        
        # Sort by priority and lead score
        if 'Priority' in df.columns and 'Lead Score' in df.columns and not df.empty:
            df = df.sort_values(['Priority', 'Lead Score'], ascending=[True, False])
        
        # Write to Excel
        output_file = "../Database/NewsData/Intelligence/business_intelligence.xlsx"
        df.to_excel(output_file, index=False)
        
        logger.info(f"Generated Excel report: {output_file}")
    
    def generate_qualified_leads(self, sorted_companies):
        """Generate a simple qualified leads list in markdown format"""
        leads = []
        for company in sorted_companies:
            score = company.calculate_intelligence_score()
            if score == 0:
                continue  # Skip companies with no intelligence
            
            # Estimate power needs based on mentions and sector
            estimated_mw = 0
            if company.sector == "Manufacturing/Cement":
                estimated_mw = 40
            elif company.sector == "Manufacturing/Food":
                estimated_mw = 25
            elif company.sector == "Manufacturing/Beverages":
                estimated_mw = 30
            elif company.sector == "Oil & Gas":
                estimated_mw = 50
            elif company.sector == "Banking":
                estimated_mw = 20
            elif company.sector == "Telecommunications":
                estimated_mw = 80
            elif "Manufacturing" in company.sector:
                estimated_mw = 35
            else:
                estimated_mw = 15
                
            # Adjust based on intelligence
            if company.power_related_mentions > 2:
                estimated_mw *= 1.2
            elif company.expansion_mentions > 2:
                estimated_mw *= 1.1
                
            # Priority
            if score >= 80:
                priority = "A"
            elif score >= 60:
                priority = "B"
            else:
                priority = "C"
            
            # Value proposition - keep it to one concise sentence
            if company.power_related_mentions >= 2:
                value_prop = f"Demonstrated power needs of {estimated_mw:.1f} MW could be efficiently met with IPP solution, providing immediate operational benefits and cost savings of ~₦{estimated_mw * 24 * 365 * 65000 * 0.35 / 1000000000:.1f} billion annually."
            elif company.expansion_mentions >= 2:
                value_prop = f"Expanding operations require reliable power solutions; IPP offering could save ~₦{estimated_mw * 24 * 365 * 65000 * 0.35 / 1000000000:.1f} billion annually while supporting their growth initiatives."
            elif company.financial_mentions >= 2:
                value_prop = f"Financial indicators suggest ability to invest in power infrastructure; IPP could deliver ₦{estimated_mw * 24 * 365 * 65000 * 0.35 / 1000000000:.1f} billion annual savings with strong ROI."
            else:
                value_prop = f"{company.sector} operations typically require reliable power; IPP solution could provide significant cost benefits with estimated savings of ₦{estimated_mw * 24 * 365 * 65000 * 0.35 / 1000000000:.1f} billion annually."
            
            # Add to leads
            leads.append({
                "Company": company.company_name,
                "Sector": company.sector,
                "Priority": priority,
                "Lead Score": score,
                "Est. MW": round(estimated_mw, 1),
                "Value Proposition": value_prop
            })
        
        # Check if we have any leads
        if not leads:
            logger.warning("No qualified leads to generate report")
            return
            
        # Create the report
        report = "# Top Qualified IPP Leads from Business Intelligence\n\n"
        report += f"*Generated on {datetime.now().strftime('%Y-%m-%d')}*\n\n"
        
        report += "| Company | Sector | Priority | Score | Est. MW | One-Sentence Value Proposition |\n"
        report += "|---------|--------|----------|-------|---------|--------------------------------|\n"
        
        # Add sorted leads
        for lead in sorted(leads, key=lambda x: (x["Priority"], -x["Lead Score"]))[:10]:
            report += f"| {lead['Company']} | {lead['Sector']} | {lead['Priority']} | {lead['Lead Score']} | {lead['Est. MW']} | {lead['Value Proposition']} |\n"
        
        # Write to file
        output_file = "../Database/NewsData/Intelligence/qualified_leads_list.md"
        with open(output_file, 'w') as f:
            f.write(report)
        
        logger.info(f"Generated qualified leads list: {output_file}")

def main():
    """Main function to run the intelligence gathering"""
    import argparse
    
    parser = argparse.ArgumentParser(description="RSS Business Intelligence Gatherer")
    parser.add_argument('--feeds', help='Comma-separated list of feed names to process (default: all)')
    parser.add_argument('--limit', type=int, default=20, help='Maximum number of entries per feed (default: 20)')
    
    args = parser.parse_args()
    
    feeds = args.feeds.split(',') if args.feeds else None
    
    # Start the intelligence gathering
    gatherer = RSSBusinessIntelligence()
    gatherer.run(feeds=feeds, limit=args.limit)

if __name__ == "__main__":
    main() 