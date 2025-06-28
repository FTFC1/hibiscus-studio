#!/usr/bin/env python3
"""
News API Scraper for Nigerian Energy and Industry News
This script uses NewsAPI.org to gather relevant news about energy and 
industrial developments in Nigeria to identify potential IPP leads.
"""
import os
import json
import pandas as pd
import requests
from datetime import datetime, timedelta
import time

# Create necessary directories
os.makedirs("../Database/NewsData", exist_ok=True)

# Using a free demo API key from NewsAPI.org
# In production, you should use your own API key
# NOTE: Free API key has limitations (100 requests per day, limited historical data)
API_KEY = "dbc966e6952545b3a5c5de1f24d32f26"  # This is a demo key with limited usage

class NewsArticle:
    """Class to represent a news article"""
    def __init__(self, title, url, source, date, description=None, content=None):
        self.title = title
        self.url = url
        self.source = source
        self.date = date
        self.description = description
        self.content = content
        self.lead_potential = False
        self.companies_mentioned = []
        self.locations_mentioned = []
        self.power_mentioned = False
        self.tags = []
        
    def to_dict(self):
        return {
            "title": self.title,
            "url": self.url,
            "source": self.source,
            "date": self.date,
            "description": self.description,
            "content": self.content,
            "lead_potential": self.lead_potential,
            "companies_mentioned": self.companies_mentioned,
            "locations_mentioned": self.locations_mentioned,
            "power_mentioned": self.power_mentioned,
            "tags": self.tags
        }
    
    @classmethod
    def from_dict(cls, data):
        article = cls(
            title=data["title"],
            url=data["url"],
            source=data["source"],
            date=data["date"],
            description=data.get("description"),
            content=data.get("content")
        )
        article.lead_potential = data.get("lead_potential", False)
        article.companies_mentioned = data.get("companies_mentioned", [])
        article.locations_mentioned = data.get("locations_mentioned", [])
        article.power_mentioned = data.get("power_mentioned", False)
        article.tags = data.get("tags", [])
        return article

class NewsAPIScraper:
    """NewsAPI.org Scraper"""
    def __init__(self, api_key=API_KEY, cache_file="../Database/NewsData/news_api_cache.json"):
        self.api_key = api_key
        self.articles = []
        self.cache_file = cache_file
        self.load_cache()
        
    def load_cache(self):
        """Load previously scraped articles from cache"""
        if os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, 'r') as f:
                    cached_data = json.load(f)
                    self.articles = [NewsArticle.from_dict(article) for article in cached_data]
                print(f"Loaded {len(self.articles)} articles from cache")
            except Exception as e:
                print(f"Error loading cache: {str(e)}")
                self.articles = []
        else:
            self.articles = []
    
    def save_cache(self):
        """Save scraped articles to cache"""
        try:
            with open(self.cache_file, 'w') as f:
                json.dump([article.to_dict() for article in self.articles], f, indent=2)
            print(f"Saved {len(self.articles)} articles to cache")
        except Exception as e:
            print(f"Error saving cache: {str(e)}")
    
    def url_exists(self, url):
        """Check if a URL already exists in the articles list"""
        return any(article.url == url for article in self.articles)
    
    def scrape_everything(self, query, days_back=7, max_pages=5):
        """
        Use the 'everything' endpoint to search for articles
        
        Args:
            query (str): Search query
            days_back (int): How many days back to search
            max_pages (int): Maximum number of pages to fetch (each page has 100 articles)
        """
        print(f"Searching for news about: {query} (past {days_back} days)")
        
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)
        
        # Format dates for API
        from_date = start_date.strftime('%Y-%m-%d')
        to_date = end_date.strftime('%Y-%m-%d')
        
        base_url = "https://newsapi.org/v2/everything"
        
        page = 1
        total_results = 0
        new_articles_count = 0
        
        while page <= max_pages:
            params = {
                'q': query,
                'from': from_date,
                'to': to_date,
                'language': 'en',
                'sortBy': 'publishedAt',
                'pageSize': 100,
                'page': page,
                'apiKey': self.api_key
            }
            
            try:
                response = requests.get(base_url, params=params)
                
                if response.status_code != 200:
                    print(f"Error fetching articles: {response.status_code}")
                    print(response.text)
                    break
                
                data = response.json()
                
                if data['status'] != 'ok':
                    print(f"API error: {data.get('message', 'Unknown error')}")
                    break
                
                articles_data = data['articles']
                total_results = data['totalResults']
                
                if not articles_data:
                    print(f"No more articles found after page {page}")
                    break
                
                print(f"Processing page {page} ({len(articles_data)} articles)")
                
                for article_data in articles_data:
                    # Extract data
                    title = article_data.get('title', '')
                    url = article_data.get('url', '')
                    
                    # Skip if no URL or already in cache
                    if not url or self.url_exists(url):
                        continue
                    
                    source = article_data.get('source', {}).get('name', 'Unknown')
                    published_at = article_data.get('publishedAt', '')
                    description = article_data.get('description', '')
                    content = article_data.get('content', '')
                    
                    # Create article object
                    new_article = NewsArticle(
                        title=title,
                        url=url,
                        source=source,
                        date=published_at,
                        description=description,
                        content=content
                    )
                    
                    # Add to list
                    self.articles.append(new_article)
                    new_articles_count += 1
                
                # Check if we've reached the end
                if len(articles_data) < 100 or page * 100 >= total_results:
                    break
                
                page += 1
                
                # Rate limiting - 10 requests per minute for free accounts
                time.sleep(6)
                
            except Exception as e:
                print(f"Error during API request: {str(e)}")
                break
        
        print(f"Fetched {new_articles_count} new articles")
        print(f"Total articles in cache: {len(self.articles)}")
        
        # Save to cache
        self.save_cache()
        
        return self.articles
    
    def analyze_articles(self):
        """Analyze articles for potential leads"""
        # Nigerian companies that might be leads
        companies = [
            "Dangote", "BUA", "Flour Mills", "Lafarge", "Oando", "Seplat", 
            "MTN", "NNPC", "Shell", "Total", "Mobil", "Nestle", "Nigerian Breweries",
            "Cadbury", "PZ Cussons", "Unilever", "Guinness", "Honeywell", "Olam",
            "Dufil", "Indomie", "UAC", "Julius Berger", "FBN", "UBA", "Zenith", 
            "GTBank", "Access Bank", "Transcorp", "GlaxoSmithKline", "May & Baker",
            "First Bank", "Mikano", "Ibeto", "Stallion", "Ekiti", "Mouka", "Eko", "Dunlop"
        ]
        
        # Nigerian locations
        locations = [
            "Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Kaduna", 
            "Enugu", "Abeokuta", "Onitsha", "Warri", "Benin", "Calabar", 
            "Maiduguri", "Jos", "Ilorin", "Aba", "Ajaokuta", "Sokoto", 
            "Uyo", "Akure", "Osogbo", "Bauchi", "Asaba", "Yola", "Makurdi",
            "Owerri", "Yenagoa", "Sagamu", "Ijebu", "Ogbomosho", "Ota", "Agbara",
            "Nigeria"
        ]
        
        # Power-related terms
        power_terms = [
            "megawatt", "MW", "gigawatt", "GW", "power plant", "power generation",
            "electricity", "energy", "generator", "IPP", "gas power", "gas turbine",
            "solar power", "renewable energy", "diesel generator", "outage", "blackout"
        ]
        
        for article in self.articles:
            # Skip already analyzed articles
            if article.lead_potential or article.companies_mentioned or article.locations_mentioned:
                continue
            
            # Combined text for analysis
            text = ""
            if article.title:
                text += article.title + " "
            if article.description:
                text += article.description + " "
            if article.content:
                text += article.content
            
            # Skip articles without relevant text
            if not text.strip():
                continue
                
            # Convert to lowercase for case-insensitive matching
            text_lower = text.lower()
            
            # Check for companies
            for company in companies:
                if company.lower() in text_lower:
                    if company not in article.companies_mentioned:
                        article.companies_mentioned.append(company)
            
            # Check for locations
            for location in locations:
                if location.lower() in text_lower:
                    if location not in article.locations_mentioned:
                        article.locations_mentioned.append(location)
            
            # Check for power terms
            for term in power_terms:
                if term.lower() in text_lower:
                    article.power_mentioned = True
                    break
            
            # Determine lead potential
            if (article.power_mentioned and 
                (len(article.companies_mentioned) > 0 or len(article.locations_mentioned) > 0)):
                article.lead_potential = True
                # Add appropriate tags
                if "power" not in article.tags:
                    article.tags.append("power")
                if len(article.companies_mentioned) > 0 and "company" not in article.tags:
                    article.tags.append("company")
            
            # Add industry tags
            industrial_terms = ["factory", "manufacturing", "production", "industry", "plant"]
            if any(term in text_lower for term in industrial_terms):
                if "industry" not in article.tags:
                    article.tags.append("industry")
            
            # Add expansion tags
            expansion_terms = ["expansion", "new facility", "investment", "growing", "development"]
            if any(term in text_lower for term in expansion_terms):
                if "expansion" not in article.tags:
                    article.tags.append("expansion")
        
        print(f"Analyzed {len(self.articles)} articles")
        print(f"Found {sum(1 for article in self.articles if article.lead_potential)} potential leads")
        
        # Save updated analysis to cache
        self.save_cache()

    def export_to_excel(self, output_file="../Database/NewsData/news_api_analysis.xlsx"):
        """Export articles to Excel for analysis"""
        data = []
        for article in self.articles:
            data.append({
                "Title": article.title,
                "Source": article.source,
                "Date": article.date,
                "URL": article.url,
                "Description": article.description,
                "Lead Potential": "Yes" if article.lead_potential else "No",
                "Companies": ", ".join(article.companies_mentioned),
                "Locations": ", ".join(article.locations_mentioned),
                "Power Mentioned": "Yes" if article.power_mentioned else "No",
                "Tags": ", ".join(article.tags)
            })
        
        if not data:
            print("No articles to export")
            return
            
        df = pd.DataFrame(data)
        
        # Sort by lead potential first
        df['Lead Potential'] = df['Lead Potential'].apply(lambda x: 0 if x == "Yes" else 1)
        df = df.sort_values(by=['Lead Potential', 'Date'], ascending=[True, False])
        df['Lead Potential'] = df['Lead Potential'].apply(lambda x: "Yes" if x == 0 else "No")
        
        # Save to Excel
        df.to_excel(output_file, index=False)
        print(f"Exported {len(data)} articles to {output_file}")
    
    def export_potential_leads(self, output_file="../Database/NewsData/potential_api_leads.md"):
        """Export potential leads to markdown"""
        lead_articles = [article for article in self.articles if article.lead_potential]
        
        # Sort by date (newest first)
        lead_articles.sort(key=lambda x: x.date if x.date else "", reverse=True)
        
        with open(output_file, 'w') as f:
            f.write("# Potential Leads from News API\n\n")
            f.write(f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n")
            f.write(f"Total potential leads found: {len(lead_articles)}\n\n")
            
            if not lead_articles:
                f.write("No potential leads found yet. Try adjusting search parameters or expanding the company/location lists.")
                return
                
            for idx, article in enumerate(lead_articles, 1):
                f.write(f"## {idx}. {article.title}\n\n")
                f.write(f"**Source**: {article.source}\n\n")
                f.write(f"**Date**: {article.date}\n\n")
                f.write(f"**URL**: {article.url}\n\n")
                
                if article.companies_mentioned:
                    f.write(f"**Companies Mentioned**: {', '.join(article.companies_mentioned)}\n\n")
                
                if article.locations_mentioned:
                    f.write(f"**Locations**: {', '.join(article.locations_mentioned)}\n\n")
                
                if article.tags:
                    f.write(f"**Tags**: {', '.join(article.tags)}\n\n")
                
                if article.description:
                    f.write("**Description**:\n\n")
                    f.write(f"{article.description}\n\n")
                
                f.write("---\n\n")
        
        print(f"Exported {len(lead_articles)} potential leads to {output_file}")
        
    def generate_lead_summary(self, output_file="../Database/NewsData/leads_executive_summary.md"):
        """Generate an executive summary of potential leads"""
        lead_articles = [article for article in self.articles if article.lead_potential]
        
        if not lead_articles:
            print("No potential leads to summarize")
            return
            
        # Sort by date (newest first)
        lead_articles.sort(key=lambda x: x.date if x.date else "", reverse=True)
        
        # Companies mentioned
        all_companies = []
        for article in lead_articles:
            all_companies.extend(article.companies_mentioned)
        
        company_counts = {}
        for company in all_companies:
            company_counts[company] = company_counts.get(company, 0) + 1
        
        # Sort by frequency
        top_companies = sorted(company_counts.items(), key=lambda x: x[1], reverse=True)
        
        # Locations mentioned
        all_locations = []
        for article in lead_articles:
            all_locations.extend(article.locations_mentioned)
        
        location_counts = {}
        for location in all_locations:
            location_counts[location] = location_counts.get(location, 0) + 1
        
        # Sort by frequency
        top_locations = sorted(location_counts.items(), key=lambda x: x[1], reverse=True)
        
        # Write summary
        with open(output_file, 'w') as f:
            f.write("# Executive Summary: Potential IPP Leads from News\n\n")
            f.write(f"*Generated on {datetime.now().strftime('%Y-%m-%d')}*\n\n")
            f.write(f"## Overview\n\n")
            f.write(f"Our news monitoring has identified **{len(lead_articles)} potential IPP leads** ")
            f.write(f"from recent news articles. These leads mention both power/energy topics ")
            f.write(f"and specific companies or locations in Nigeria.\n\n")
            
            # Top companies section
            f.write("## Top Companies Mentioned\n\n")
            if top_companies:
                for company, count in top_companies[:10]:  # Top 10 companies
                    f.write(f"- **{company}**: {count} mentions\n")
            else:
                f.write("No companies identified yet.\n")
            
            # Top locations section
            f.write("\n## Top Locations Mentioned\n\n")
            if top_locations:
                for location, count in top_locations[:10]:  # Top 10 locations
                    f.write(f"- **{location}**: {count} mentions\n")
            else:
                f.write("No specific locations identified yet.\n")
            
            # Latest leads section
            f.write("\n## Latest Potential Leads\n\n")
            for idx, article in enumerate(lead_articles[:5], 1):  # Top 5 latest leads
                f.write(f"{idx}. **{article.title}** ({article.source}, {article.date})\n")
                
                companies_text = ", ".join(article.companies_mentioned) if article.companies_mentioned else "No specific company"
                locations_text = ", ".join(article.locations_mentioned) if article.locations_mentioned else "No specific location"
                
                f.write(f"   - Companies: {companies_text}\n")
                f.write(f"   - Locations: {locations_text}\n\n")
            
            # Recommendations section
            f.write("## Recommended Actions\n\n")
            f.write("1. **Follow up on high-potential leads**: Especially those mentioning major companies\n")
            f.write("2. **Regional focus**: Concentrate on locations with multiple mentions\n")
            f.write("3. **Monitor industry developments**: Track news about expansions and new facilities\n")
            f.write("4. **Develop targeted outreach**: Create tailored messages for each identified company\n")
        
        print(f"Generated executive summary at {output_file}")


def main():
    """Main function to run NewsAPI search"""
    print("Starting Nigerian Energy News Search using NewsAPI")
    
    scraper = NewsAPIScraper()
    
    # Search for energy news in Nigeria
    scraper.scrape_everything("Nigeria (energy OR power OR electricity OR generator) (company OR industry OR factory)", days_back=30, max_pages=5)
    
    # Analyze the articles
    scraper.analyze_articles()
    
    # Export the results
    scraper.export_to_excel()
    scraper.export_potential_leads()
    scraper.generate_lead_summary()
    
    print("News search completed successfully")


if __name__ == "__main__":
    main() 
"""
News API Scraper for Nigerian Energy and Industry News
This script uses NewsAPI.org to gather relevant news about energy and 
industrial developments in Nigeria to identify potential IPP leads.
"""
import os
import json
import pandas as pd
import requests
from datetime import datetime, timedelta
import time

# Create necessary directories
os.makedirs("../Database/NewsData", exist_ok=True)

# Using a free demo API key from NewsAPI.org
# In production, you should use your own API key
# NOTE: Free API key has limitations (100 requests per day, limited historical data)
API_KEY = "dbc966e6952545b3a5c5de1f24d32f26"  # This is a demo key with limited usage

class NewsArticle:
    """Class to represent a news article"""
    def __init__(self, title, url, source, date, description=None, content=None):
        self.title = title
        self.url = url
        self.source = source
        self.date = date
        self.description = description
        self.content = content
        self.lead_potential = False
        self.companies_mentioned = []
        self.locations_mentioned = []
        self.power_mentioned = False
        self.tags = []
        
    def to_dict(self):
        return {
            "title": self.title,
            "url": self.url,
            "source": self.source,
            "date": self.date,
            "description": self.description,
            "content": self.content,
            "lead_potential": self.lead_potential,
            "companies_mentioned": self.companies_mentioned,
            "locations_mentioned": self.locations_mentioned,
            "power_mentioned": self.power_mentioned,
            "tags": self.tags
        }
    
    @classmethod
    def from_dict(cls, data):
        article = cls(
            title=data["title"],
            url=data["url"],
            source=data["source"],
            date=data["date"],
            description=data.get("description"),
            content=data.get("content")
        )
        article.lead_potential = data.get("lead_potential", False)
        article.companies_mentioned = data.get("companies_mentioned", [])
        article.locations_mentioned = data.get("locations_mentioned", [])
        article.power_mentioned = data.get("power_mentioned", False)
        article.tags = data.get("tags", [])
        return article

class NewsAPIScraper:
    """NewsAPI.org Scraper"""
    def __init__(self, api_key=API_KEY, cache_file="../Database/NewsData/news_api_cache.json"):
        self.api_key = api_key
        self.articles = []
        self.cache_file = cache_file
        self.load_cache()
        
    def load_cache(self):
        """Load previously scraped articles from cache"""
        if os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, 'r') as f:
                    cached_data = json.load(f)
                    self.articles = [NewsArticle.from_dict(article) for article in cached_data]
                print(f"Loaded {len(self.articles)} articles from cache")
            except Exception as e:
                print(f"Error loading cache: {str(e)}")
                self.articles = []
        else:
            self.articles = []
    
    def save_cache(self):
        """Save scraped articles to cache"""
        try:
            with open(self.cache_file, 'w') as f:
                json.dump([article.to_dict() for article in self.articles], f, indent=2)
            print(f"Saved {len(self.articles)} articles to cache")
        except Exception as e:
            print(f"Error saving cache: {str(e)}")
    
    def url_exists(self, url):
        """Check if a URL already exists in the articles list"""
        return any(article.url == url for article in self.articles)
    
    def scrape_everything(self, query, days_back=7, max_pages=5):
        """
        Use the 'everything' endpoint to search for articles
        
        Args:
            query (str): Search query
            days_back (int): How many days back to search
            max_pages (int): Maximum number of pages to fetch (each page has 100 articles)
        """
        print(f"Searching for news about: {query} (past {days_back} days)")
        
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)
        
        # Format dates for API
        from_date = start_date.strftime('%Y-%m-%d')
        to_date = end_date.strftime('%Y-%m-%d')
        
        base_url = "https://newsapi.org/v2/everything"
        
        page = 1
        total_results = 0
        new_articles_count = 0
        
        while page <= max_pages:
            params = {
                'q': query,
                'from': from_date,
                'to': to_date,
                'language': 'en',
                'sortBy': 'publishedAt',
                'pageSize': 100,
                'page': page,
                'apiKey': self.api_key
            }
            
            try:
                response = requests.get(base_url, params=params)
                
                if response.status_code != 200:
                    print(f"Error fetching articles: {response.status_code}")
                    print(response.text)
                    break
                
                data = response.json()
                
                if data['status'] != 'ok':
                    print(f"API error: {data.get('message', 'Unknown error')}")
                    break
                
                articles_data = data['articles']
                total_results = data['totalResults']
                
                if not articles_data:
                    print(f"No more articles found after page {page}")
                    break
                
                print(f"Processing page {page} ({len(articles_data)} articles)")
                
                for article_data in articles_data:
                    # Extract data
                    title = article_data.get('title', '')
                    url = article_data.get('url', '')
                    
                    # Skip if no URL or already in cache
                    if not url or self.url_exists(url):
                        continue
                    
                    source = article_data.get('source', {}).get('name', 'Unknown')
                    published_at = article_data.get('publishedAt', '')
                    description = article_data.get('description', '')
                    content = article_data.get('content', '')
                    
                    # Create article object
                    new_article = NewsArticle(
                        title=title,
                        url=url,
                        source=source,
                        date=published_at,
                        description=description,
                        content=content
                    )
                    
                    # Add to list
                    self.articles.append(new_article)
                    new_articles_count += 1
                
                # Check if we've reached the end
                if len(articles_data) < 100 or page * 100 >= total_results:
                    break
                
                page += 1
                
                # Rate limiting - 10 requests per minute for free accounts
                time.sleep(6)
                
            except Exception as e:
                print(f"Error during API request: {str(e)}")
                break
        
        print(f"Fetched {new_articles_count} new articles")
        print(f"Total articles in cache: {len(self.articles)}")
        
        # Save to cache
        self.save_cache()
        
        return self.articles
    
    def analyze_articles(self):
        """Analyze articles for potential leads"""
        # Nigerian companies that might be leads
        companies = [
            "Dangote", "BUA", "Flour Mills", "Lafarge", "Oando", "Seplat", 
            "MTN", "NNPC", "Shell", "Total", "Mobil", "Nestle", "Nigerian Breweries",
            "Cadbury", "PZ Cussons", "Unilever", "Guinness", "Honeywell", "Olam",
            "Dufil", "Indomie", "UAC", "Julius Berger", "FBN", "UBA", "Zenith", 
            "GTBank", "Access Bank", "Transcorp", "GlaxoSmithKline", "May & Baker",
            "First Bank", "Mikano", "Ibeto", "Stallion", "Ekiti", "Mouka", "Eko", "Dunlop"
        ]
        
        # Nigerian locations
        locations = [
            "Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Kaduna", 
            "Enugu", "Abeokuta", "Onitsha", "Warri", "Benin", "Calabar", 
            "Maiduguri", "Jos", "Ilorin", "Aba", "Ajaokuta", "Sokoto", 
            "Uyo", "Akure", "Osogbo", "Bauchi", "Asaba", "Yola", "Makurdi",
            "Owerri", "Yenagoa", "Sagamu", "Ijebu", "Ogbomosho", "Ota", "Agbara",
            "Nigeria"
        ]
        
        # Power-related terms
        power_terms = [
            "megawatt", "MW", "gigawatt", "GW", "power plant", "power generation",
            "electricity", "energy", "generator", "IPP", "gas power", "gas turbine",
            "solar power", "renewable energy", "diesel generator", "outage", "blackout"
        ]
        
        for article in self.articles:
            # Skip already analyzed articles
            if article.lead_potential or article.companies_mentioned or article.locations_mentioned:
                continue
            
            # Combined text for analysis
            text = ""
            if article.title:
                text += article.title + " "
            if article.description:
                text += article.description + " "
            if article.content:
                text += article.content
            
            # Skip articles without relevant text
            if not text.strip():
                continue
                
            # Convert to lowercase for case-insensitive matching
            text_lower = text.lower()
            
            # Check for companies
            for company in companies:
                if company.lower() in text_lower:
                    if company not in article.companies_mentioned:
                        article.companies_mentioned.append(company)
            
            # Check for locations
            for location in locations:
                if location.lower() in text_lower:
                    if location not in article.locations_mentioned:
                        article.locations_mentioned.append(location)
            
            # Check for power terms
            for term in power_terms:
                if term.lower() in text_lower:
                    article.power_mentioned = True
                    break
            
            # Determine lead potential
            if (article.power_mentioned and 
                (len(article.companies_mentioned) > 0 or len(article.locations_mentioned) > 0)):
                article.lead_potential = True
                # Add appropriate tags
                if "power" not in article.tags:
                    article.tags.append("power")
                if len(article.companies_mentioned) > 0 and "company" not in article.tags:
                    article.tags.append("company")
            
            # Add industry tags
            industrial_terms = ["factory", "manufacturing", "production", "industry", "plant"]
            if any(term in text_lower for term in industrial_terms):
                if "industry" not in article.tags:
                    article.tags.append("industry")
            
            # Add expansion tags
            expansion_terms = ["expansion", "new facility", "investment", "growing", "development"]
            if any(term in text_lower for term in expansion_terms):
                if "expansion" not in article.tags:
                    article.tags.append("expansion")
        
        print(f"Analyzed {len(self.articles)} articles")
        print(f"Found {sum(1 for article in self.articles if article.lead_potential)} potential leads")
        
        # Save updated analysis to cache
        self.save_cache()

    def export_to_excel(self, output_file="../Database/NewsData/news_api_analysis.xlsx"):
        """Export articles to Excel for analysis"""
        data = []
        for article in self.articles:
            data.append({
                "Title": article.title,
                "Source": article.source,
                "Date": article.date,
                "URL": article.url,
                "Description": article.description,
                "Lead Potential": "Yes" if article.lead_potential else "No",
                "Companies": ", ".join(article.companies_mentioned),
                "Locations": ", ".join(article.locations_mentioned),
                "Power Mentioned": "Yes" if article.power_mentioned else "No",
                "Tags": ", ".join(article.tags)
            })
        
        if not data:
            print("No articles to export")
            return
            
        df = pd.DataFrame(data)
        
        # Sort by lead potential first
        df['Lead Potential'] = df['Lead Potential'].apply(lambda x: 0 if x == "Yes" else 1)
        df = df.sort_values(by=['Lead Potential', 'Date'], ascending=[True, False])
        df['Lead Potential'] = df['Lead Potential'].apply(lambda x: "Yes" if x == 0 else "No")
        
        # Save to Excel
        df.to_excel(output_file, index=False)
        print(f"Exported {len(data)} articles to {output_file}")
    
    def export_potential_leads(self, output_file="../Database/NewsData/potential_api_leads.md"):
        """Export potential leads to markdown"""
        lead_articles = [article for article in self.articles if article.lead_potential]
        
        # Sort by date (newest first)
        lead_articles.sort(key=lambda x: x.date if x.date else "", reverse=True)
        
        with open(output_file, 'w') as f:
            f.write("# Potential Leads from News API\n\n")
            f.write(f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n")
            f.write(f"Total potential leads found: {len(lead_articles)}\n\n")
            
            if not lead_articles:
                f.write("No potential leads found yet. Try adjusting search parameters or expanding the company/location lists.")
                return
                
            for idx, article in enumerate(lead_articles, 1):
                f.write(f"## {idx}. {article.title}\n\n")
                f.write(f"**Source**: {article.source}\n\n")
                f.write(f"**Date**: {article.date}\n\n")
                f.write(f"**URL**: {article.url}\n\n")
                
                if article.companies_mentioned:
                    f.write(f"**Companies Mentioned**: {', '.join(article.companies_mentioned)}\n\n")
                
                if article.locations_mentioned:
                    f.write(f"**Locations**: {', '.join(article.locations_mentioned)}\n\n")
                
                if article.tags:
                    f.write(f"**Tags**: {', '.join(article.tags)}\n\n")
                
                if article.description:
                    f.write("**Description**:\n\n")
                    f.write(f"{article.description}\n\n")
                
                f.write("---\n\n")
        
        print(f"Exported {len(lead_articles)} potential leads to {output_file}")
        
    def generate_lead_summary(self, output_file="../Database/NewsData/leads_executive_summary.md"):
        """Generate an executive summary of potential leads"""
        lead_articles = [article for article in self.articles if article.lead_potential]
        
        if not lead_articles:
            print("No potential leads to summarize")
            return
            
        # Sort by date (newest first)
        lead_articles.sort(key=lambda x: x.date if x.date else "", reverse=True)
        
        # Companies mentioned
        all_companies = []
        for article in lead_articles:
            all_companies.extend(article.companies_mentioned)
        
        company_counts = {}
        for company in all_companies:
            company_counts[company] = company_counts.get(company, 0) + 1
        
        # Sort by frequency
        top_companies = sorted(company_counts.items(), key=lambda x: x[1], reverse=True)
        
        # Locations mentioned
        all_locations = []
        for article in lead_articles:
            all_locations.extend(article.locations_mentioned)
        
        location_counts = {}
        for location in all_locations:
            location_counts[location] = location_counts.get(location, 0) + 1
        
        # Sort by frequency
        top_locations = sorted(location_counts.items(), key=lambda x: x[1], reverse=True)
        
        # Write summary
        with open(output_file, 'w') as f:
            f.write("# Executive Summary: Potential IPP Leads from News\n\n")
            f.write(f"*Generated on {datetime.now().strftime('%Y-%m-%d')}*\n\n")
            f.write(f"## Overview\n\n")
            f.write(f"Our news monitoring has identified **{len(lead_articles)} potential IPP leads** ")
            f.write(f"from recent news articles. These leads mention both power/energy topics ")
            f.write(f"and specific companies or locations in Nigeria.\n\n")
            
            # Top companies section
            f.write("## Top Companies Mentioned\n\n")
            if top_companies:
                for company, count in top_companies[:10]:  # Top 10 companies
                    f.write(f"- **{company}**: {count} mentions\n")
            else:
                f.write("No companies identified yet.\n")
            
            # Top locations section
            f.write("\n## Top Locations Mentioned\n\n")
            if top_locations:
                for location, count in top_locations[:10]:  # Top 10 locations
                    f.write(f"- **{location}**: {count} mentions\n")
            else:
                f.write("No specific locations identified yet.\n")
            
            # Latest leads section
            f.write("\n## Latest Potential Leads\n\n")
            for idx, article in enumerate(lead_articles[:5], 1):  # Top 5 latest leads
                f.write(f"{idx}. **{article.title}** ({article.source}, {article.date})\n")
                
                companies_text = ", ".join(article.companies_mentioned) if article.companies_mentioned else "No specific company"
                locations_text = ", ".join(article.locations_mentioned) if article.locations_mentioned else "No specific location"
                
                f.write(f"   - Companies: {companies_text}\n")
                f.write(f"   - Locations: {locations_text}\n\n")
            
            # Recommendations section
            f.write("## Recommended Actions\n\n")
            f.write("1. **Follow up on high-potential leads**: Especially those mentioning major companies\n")
            f.write("2. **Regional focus**: Concentrate on locations with multiple mentions\n")
            f.write("3. **Monitor industry developments**: Track news about expansions and new facilities\n")
            f.write("4. **Develop targeted outreach**: Create tailored messages for each identified company\n")
        
        print(f"Generated executive summary at {output_file}")


def main():
    """Main function to run NewsAPI search"""
    print("Starting Nigerian Energy News Search using NewsAPI")
    
    scraper = NewsAPIScraper()
    
    # Search for energy news in Nigeria
    scraper.scrape_everything("Nigeria (energy OR power OR electricity OR generator) (company OR industry OR factory)", days_back=30, max_pages=5)
    
    # Analyze the articles
    scraper.analyze_articles()
    
    # Export the results
    scraper.export_to_excel()
    scraper.export_potential_leads()
    scraper.generate_lead_summary()
    
    print("News search completed successfully")


if __name__ == "__main__":
    main() 