#!/usr/bin/env python3
"""
Nigeria Energy News API Scraper
This script uses the NewsAPI.org service to gather relevant news about energy and 
industrial developments in Nigeria to identify potential IPP leads.

Benefits over web scraping:
1. No 403 Forbidden errors or anti-scraping measures
2. Reliable access to multiple news sources
3. Structured data with source attribution
4. Simple API with rate limiting built in
"""
import os
import json
import pandas as pd
import requests
from datetime import datetime, timedelta
import argparse
import time

# Create necessary directories
os.makedirs("../Database/NewsData", exist_ok=True)

# NewsAPI requires an API key
# You can get a free API key at https://newsapi.org/register
# Free tier allows 100 requests per day and news from the last month
DEFAULT_API_KEY = "YOUR_API_KEY_HERE"  # Replace with your actual API key

class NewsArticle:
    """Class to represent a news article"""
    def __init__(self, title, url, source, published_at, description=None, content=None):
        self.title = title
        self.url = url
        self.source = source
        self.published_at = published_at
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
            "published_at": self.published_at,
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
            published_at=data["published_at"],
            description=data.get("description"),
            content=data.get("content")
        )
        article.lead_potential = data.get("lead_potential", False)
        article.companies_mentioned = data.get("companies_mentioned", [])
        article.locations_mentioned = data.get("locations_mentioned", [])
        article.power_mentioned = data.get("power_mentioned", False)
        article.tags = data.get("tags", [])
        return article

class NewsAPIClient:
    """Client for interacting with NewsAPI.org"""
    def __init__(self, api_key=DEFAULT_API_KEY, cache_file="../Database/NewsData/newsapi_cache.json"):
        self.api_key = api_key
        self.articles = []
        self.cache_file = cache_file
        self.base_url = "https://newsapi.org/v2"
        self.load_cache()
        
    def load_cache(self):
        """Load previously fetched articles from cache"""
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
        """Save fetched articles to cache"""
        try:
            with open(self.cache_file, 'w') as f:
                json.dump([article.to_dict() for article in self.articles], f, indent=2)
            print(f"Saved {len(self.articles)} articles to cache")
        except Exception as e:
            print(f"Error saving cache: {str(e)}")
    
    def url_exists(self, url):
        """Check if a URL already exists in the articles list"""
        return any(article.url == url for article in self.articles)
    
    def fetch_everything(self, query, days_back=30, language='en'):
        """
        Use the 'everything' endpoint to search for articles
        
        Args:
            query (str): Search query
            days_back (int): How many days back to search
            language (str): Language of articles
        """
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)
        
        # Format dates for API
        from_date = start_date.strftime('%Y-%m-%d')
        to_date = end_date.strftime('%Y-%m-%d')
        
        url = f"{self.base_url}/everything"
        
        params = {
            'q': query,
            'from': from_date,
            'to': to_date,
            'language': language,
            'sortBy': 'publishedAt',
            'pageSize': 100,
            'apiKey': self.api_key
        }
        
        print(f"Searching for news about: {query} (past {days_back} days)")
        
        try:
            response = requests.get(url, params=params)
            
            if response.status_code != 200:
                print(f"Error fetching articles: {response.status_code}")
                print(response.text)
                return self.articles
            
            data = response.json()
            
            if data['status'] != 'ok':
                print(f"API error: {data.get('message', 'Unknown error')}")
                return self.articles
            
            articles_data = data['articles']
            total_results = data['totalResults']
            
            print(f"Found {total_results} total results, processing {len(articles_data)} articles")
            
            new_articles_count = 0
            
            for article_data in articles_data:
                # Extract data
                title = article_data.get('title', '')
                url = article_data.get('url', '')
                
                # Skip if no URL or already in cache
                if not url or self.url_exists(url):
                    continue
                
                source_name = article_data.get('source', {}).get('name', 'Unknown')
                published_at = article_data.get('publishedAt', '')
                description = article_data.get('description', '')
                content = article_data.get('content', '')
                
                # Create article object
                new_article = NewsArticle(
                    title=title,
                    url=url,
                    source=source_name,
                    published_at=published_at,
                    description=description,
                    content=content
                )
                
                # Add to list
                self.articles.append(new_article)
                new_articles_count += 1
            
            print(f"Added {new_articles_count} new articles")
            
            # Save to cache
            self.save_cache()
            
            return self.articles
            
        except Exception as e:
            print(f"Error during API request: {str(e)}")
            return self.articles
    
    def fetch_top_headlines(self, country='ng', category=None, query=None):
        """
        Use the 'top-headlines' endpoint to get headlines from Nigeria
        
        Args:
            country (str): Country code (default: 'ng' for Nigeria)
            category (str): News category (business, entertainment, health, science, sports, technology)
            query (str): Keyword or phrase to search for
        """
        url = f"{self.base_url}/top-headlines"
        
        params = {
            'country': country,
            'apiKey': self.api_key,
            'pageSize': 100
        }
        
        if category:
            params['category'] = category
            
        if query:
            params['q'] = query
        
        category_str = f" in category '{category}'" if category else ""
        query_str = f" containing '{query}'" if query else ""
        print(f"Fetching top headlines from {country.upper()}{category_str}{query_str}")
        
        try:
            response = requests.get(url, params=params)
            
            if response.status_code != 200:
                print(f"Error fetching headlines: {response.status_code}")
                print(response.text)
                return self.articles
            
            data = response.json()
            
            if data['status'] != 'ok':
                print(f"API error: {data.get('message', 'Unknown error')}")
                return self.articles
            
            articles_data = data['articles']
            total_results = data['totalResults']
            
            print(f"Found {total_results} headlines, processing {len(articles_data)} articles")
            
            new_articles_count = 0
            
            for article_data in articles_data:
                # Extract data
                title = article_data.get('title', '')
                url = article_data.get('url', '')
                
                # Skip if no URL or already in cache
                if not url or self.url_exists(url):
                    continue
                
                source_name = article_data.get('source', {}).get('name', 'Unknown')
                published_at = article_data.get('publishedAt', '')
                description = article_data.get('description', '')
                content = article_data.get('content', '')
                
                # Create article object
                new_article = NewsArticle(
                    title=title,
                    url=url,
                    source=source_name,
                    published_at=published_at,
                    description=description,
                    content=content
                )
                
                # Add to list
                self.articles.append(new_article)
                new_articles_count += 1
            
            print(f"Added {new_articles_count} new headlines")
            
            # Save to cache
            self.save_cache()
            
            return self.articles
            
        except Exception as e:
            print(f"Error during API request: {str(e)}")
            return self.articles
    
    def analyze_articles(self):
        """Analyze articles for potential IPP leads"""
        # Nigerian energy companies that might be leads
        companies = [
            "Dangote", "BUA", "Flour Mills", "Lafarge", "Oando", "Seplat", 
            "MTN Nigeria", "NNPC", "Shell", "Total", "Mobil", "Nestle", "Nigerian Breweries",
            "Cadbury", "PZ Cussons", "Unilever", "Guinness", "Honeywell", "Olam",
            "Dufil", "Indomie", "UAC", "Julius Berger", "FBN", "UBA", "Zenith", 
            "GTBank", "Access Bank", "Transcorp", "GlaxoSmithKline", "May & Baker",
            "First Bank", "Mikano", "Ibeto", "Stallion", "Mouka", "Eko Electric", 
            "Ikeja Electric", "Sahara Group", "Eko Gas", "Oriental Energy", "Forte Oil",
            "Ibom Power", "Egbin Power", "Niger Delta Power"
        ]
        
        # Nigerian locations
        locations = [
            "Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Kaduna", 
            "Enugu", "Abeokuta", "Onitsha", "Warri", "Benin", "Calabar", 
            "Maiduguri", "Jos", "Ilorin", "Aba", "Ajaokuta", "Sokoto", 
            "Uyo", "Akure", "Osogbo", "Bauchi", "Asaba", "Yola", "Makurdi",
            "Owerri", "Yenagoa", "Sagamu", "Ijebu", "Ogbomosho", "Ota", "Agbara",
            "Delta", "Rivers", "Anambra"
        ]
        
        # Power-related terms
        power_terms = [
            "megawatt", "MW", "gigawatt", "GW", "power plant", "power generation",
            "electricity", "energy", "generator", "IPP", "gas power", "gas turbine",
            "solar power", "renewable energy", "diesel generator", "outage", "blackout",
            "gas-to-power", "independent power producer", "power supply", "electricity tariff"
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
    
    def export_to_excel(self, output_file="../Database/NewsData/nigeria_energy_news.xlsx"):
        """Export articles to Excel for analysis"""
        data = []
        for article in self.articles:
            data.append({
                "Title": article.title,
                "Source": article.source,
                "Date": article.published_at,
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
    
    def export_potential_leads(self, output_file="../Database/NewsData/nigeria_energy_leads.md"):
        """Export potential leads to markdown"""
        lead_articles = [article for article in self.articles if article.lead_potential]
        
        # Sort by date (newest first)
        lead_articles.sort(key=lambda x: x.published_at if x.published_at else "", reverse=True)
        
        with open(output_file, 'w') as f:
            f.write("# Potential Energy Leads in Nigeria\n\n")
            f.write(f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n")
            f.write(f"Total potential leads found: {len(lead_articles)}\n\n")
            
            if not lead_articles:
                f.write("No potential leads found yet. Try adjusting search parameters or expanding the company/location lists.")
                return
                
            for idx, article in enumerate(lead_articles, 1):
                f.write(f"## {idx}. {article.title}\n\n")
                f.write(f"**Source**: {article.source}\n\n")
                f.write(f"**Date**: {article.published_at}\n\n")
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
    
    def generate_executive_summary(self, output_file="../Database/NewsData/nigeria_energy_executive_summary.md"):
        """Generate an executive summary of potential leads"""
        lead_articles = [article for article in self.articles if article.lead_potential]
        
        if not lead_articles:
            print("No potential leads to summarize")
            return
            
        # Sort by date (newest first)
        lead_articles.sort(key=lambda x: x.published_at if x.published_at else "", reverse=True)
        
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
            f.write("# Executive Summary: Potential IPP Leads in Nigeria\n\n")
            f.write(f"*Generated on {datetime.now().strftime('%Y-%m-%d')}*\n\n")
            f.write(f"## Overview\n\n")
            f.write(f"Our news monitoring has identified **{len(lead_articles)} potential IPP leads** ")
            f.write(f"from recent Nigerian news. These leads mention both power/energy topics ")
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
                f.write(f"{idx}. **{article.title}** ({article.source}, {article.published_at})\n")
                
                companies_text = ", ".join(article.companies_mentioned) if article.companies_mentioned else "No specific company"
                locations_text = ", ".join(article.locations_mentioned) if article.locations_mentioned else "No specific location"
                
                f.write(f"   - Companies: {companies_text}\n")
                f.write(f"   - Locations: {locations_text}\n")
                f.write(f"   - URL: {article.url}\n\n")
            
            # Recommendations section
            f.write("## Recommended Actions\n\n")
            f.write("1. **Follow up on high-potential leads**: Especially those mentioning major energy companies\n")
            f.write("2. **Regional focus**: Concentrate on locations with multiple mentions\n")
            f.write("3. **Monitor industry developments**: Track news about expansions and new facilities\n")
            f.write("4. **Develop targeted outreach**: Create tailored sales approaches for each identified company\n")
        
        print(f"Generated executive summary at {output_file}")

def main():
    parser = argparse.ArgumentParser(description='Nigeria Energy News API Scraper')
    parser.add_argument('--api_key', help='NewsAPI API key (get one at https://newsapi.org/register)')
    parser.add_argument('--query', default='(energy OR power OR electricity OR gas) (Nigeria OR Lagos OR Abuja)',
                        help='Search query for everything endpoint')
    parser.add_argument('--days', type=int, default=30,
                        help='Number of days back to search (max 30 for free API)')
    parser.add_argument('--headlines', action='store_true',
                        help='Fetch top headlines from Nigeria')
    parser.add_argument('--category', choices=['business', 'technology', 'science'],
                        help='Category for top headlines')
    parser.add_argument('--analyze', action='store_true',
                        help='Analyze articles for potential leads')
    parser.add_argument('--export', action='store_true',
                        help='Export results to Excel and markdown')
    
    args = parser.parse_args()
    
    # Initialize client
    api_key = args.api_key if args.api_key else DEFAULT_API_KEY
    client = NewsAPIClient(api_key=api_key)
    
    # Fetch articles
    if args.headlines:
        client.fetch_top_headlines(category=args.category, query=args.query)
    else:
        client.fetch_everything(query=args.query, days_back=args.days)
    
    # Analyze articles
    if args.analyze or args.export:
        client.analyze_articles()
    
    # Export results
    if args.export:
        client.export_to_excel()
        client.export_potential_leads()
        client.generate_executive_summary()
    
if __name__ == "__main__":
    main() 
"""
Nigeria Energy News API Scraper
This script uses the NewsAPI.org service to gather relevant news about energy and 
industrial developments in Nigeria to identify potential IPP leads.

Benefits over web scraping:
1. No 403 Forbidden errors or anti-scraping measures
2. Reliable access to multiple news sources
3. Structured data with source attribution
4. Simple API with rate limiting built in
"""
import os
import json
import pandas as pd
import requests
from datetime import datetime, timedelta
import argparse
import time

# Create necessary directories
os.makedirs("../Database/NewsData", exist_ok=True)

# NewsAPI requires an API key
# You can get a free API key at https://newsapi.org/register
# Free tier allows 100 requests per day and news from the last month
DEFAULT_API_KEY = "YOUR_API_KEY_HERE"  # Replace with your actual API key

class NewsArticle:
    """Class to represent a news article"""
    def __init__(self, title, url, source, published_at, description=None, content=None):
        self.title = title
        self.url = url
        self.source = source
        self.published_at = published_at
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
            "published_at": self.published_at,
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
            published_at=data["published_at"],
            description=data.get("description"),
            content=data.get("content")
        )
        article.lead_potential = data.get("lead_potential", False)
        article.companies_mentioned = data.get("companies_mentioned", [])
        article.locations_mentioned = data.get("locations_mentioned", [])
        article.power_mentioned = data.get("power_mentioned", False)
        article.tags = data.get("tags", [])
        return article

class NewsAPIClient:
    """Client for interacting with NewsAPI.org"""
    def __init__(self, api_key=DEFAULT_API_KEY, cache_file="../Database/NewsData/newsapi_cache.json"):
        self.api_key = api_key
        self.articles = []
        self.cache_file = cache_file
        self.base_url = "https://newsapi.org/v2"
        self.load_cache()
        
    def load_cache(self):
        """Load previously fetched articles from cache"""
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
        """Save fetched articles to cache"""
        try:
            with open(self.cache_file, 'w') as f:
                json.dump([article.to_dict() for article in self.articles], f, indent=2)
            print(f"Saved {len(self.articles)} articles to cache")
        except Exception as e:
            print(f"Error saving cache: {str(e)}")
    
    def url_exists(self, url):
        """Check if a URL already exists in the articles list"""
        return any(article.url == url for article in self.articles)
    
    def fetch_everything(self, query, days_back=30, language='en'):
        """
        Use the 'everything' endpoint to search for articles
        
        Args:
            query (str): Search query
            days_back (int): How many days back to search
            language (str): Language of articles
        """
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days_back)
        
        # Format dates for API
        from_date = start_date.strftime('%Y-%m-%d')
        to_date = end_date.strftime('%Y-%m-%d')
        
        url = f"{self.base_url}/everything"
        
        params = {
            'q': query,
            'from': from_date,
            'to': to_date,
            'language': language,
            'sortBy': 'publishedAt',
            'pageSize': 100,
            'apiKey': self.api_key
        }
        
        print(f"Searching for news about: {query} (past {days_back} days)")
        
        try:
            response = requests.get(url, params=params)
            
            if response.status_code != 200:
                print(f"Error fetching articles: {response.status_code}")
                print(response.text)
                return self.articles
            
            data = response.json()
            
            if data['status'] != 'ok':
                print(f"API error: {data.get('message', 'Unknown error')}")
                return self.articles
            
            articles_data = data['articles']
            total_results = data['totalResults']
            
            print(f"Found {total_results} total results, processing {len(articles_data)} articles")
            
            new_articles_count = 0
            
            for article_data in articles_data:
                # Extract data
                title = article_data.get('title', '')
                url = article_data.get('url', '')
                
                # Skip if no URL or already in cache
                if not url or self.url_exists(url):
                    continue
                
                source_name = article_data.get('source', {}).get('name', 'Unknown')
                published_at = article_data.get('publishedAt', '')
                description = article_data.get('description', '')
                content = article_data.get('content', '')
                
                # Create article object
                new_article = NewsArticle(
                    title=title,
                    url=url,
                    source=source_name,
                    published_at=published_at,
                    description=description,
                    content=content
                )
                
                # Add to list
                self.articles.append(new_article)
                new_articles_count += 1
            
            print(f"Added {new_articles_count} new articles")
            
            # Save to cache
            self.save_cache()
            
            return self.articles
            
        except Exception as e:
            print(f"Error during API request: {str(e)}")
            return self.articles
    
    def fetch_top_headlines(self, country='ng', category=None, query=None):
        """
        Use the 'top-headlines' endpoint to get headlines from Nigeria
        
        Args:
            country (str): Country code (default: 'ng' for Nigeria)
            category (str): News category (business, entertainment, health, science, sports, technology)
            query (str): Keyword or phrase to search for
        """
        url = f"{self.base_url}/top-headlines"
        
        params = {
            'country': country,
            'apiKey': self.api_key,
            'pageSize': 100
        }
        
        if category:
            params['category'] = category
            
        if query:
            params['q'] = query
        
        category_str = f" in category '{category}'" if category else ""
        query_str = f" containing '{query}'" if query else ""
        print(f"Fetching top headlines from {country.upper()}{category_str}{query_str}")
        
        try:
            response = requests.get(url, params=params)
            
            if response.status_code != 200:
                print(f"Error fetching headlines: {response.status_code}")
                print(response.text)
                return self.articles
            
            data = response.json()
            
            if data['status'] != 'ok':
                print(f"API error: {data.get('message', 'Unknown error')}")
                return self.articles
            
            articles_data = data['articles']
            total_results = data['totalResults']
            
            print(f"Found {total_results} headlines, processing {len(articles_data)} articles")
            
            new_articles_count = 0
            
            for article_data in articles_data:
                # Extract data
                title = article_data.get('title', '')
                url = article_data.get('url', '')
                
                # Skip if no URL or already in cache
                if not url or self.url_exists(url):
                    continue
                
                source_name = article_data.get('source', {}).get('name', 'Unknown')
                published_at = article_data.get('publishedAt', '')
                description = article_data.get('description', '')
                content = article_data.get('content', '')
                
                # Create article object
                new_article = NewsArticle(
                    title=title,
                    url=url,
                    source=source_name,
                    published_at=published_at,
                    description=description,
                    content=content
                )
                
                # Add to list
                self.articles.append(new_article)
                new_articles_count += 1
            
            print(f"Added {new_articles_count} new headlines")
            
            # Save to cache
            self.save_cache()
            
            return self.articles
            
        except Exception as e:
            print(f"Error during API request: {str(e)}")
            return self.articles
    
    def analyze_articles(self):
        """Analyze articles for potential IPP leads"""
        # Nigerian energy companies that might be leads
        companies = [
            "Dangote", "BUA", "Flour Mills", "Lafarge", "Oando", "Seplat", 
            "MTN Nigeria", "NNPC", "Shell", "Total", "Mobil", "Nestle", "Nigerian Breweries",
            "Cadbury", "PZ Cussons", "Unilever", "Guinness", "Honeywell", "Olam",
            "Dufil", "Indomie", "UAC", "Julius Berger", "FBN", "UBA", "Zenith", 
            "GTBank", "Access Bank", "Transcorp", "GlaxoSmithKline", "May & Baker",
            "First Bank", "Mikano", "Ibeto", "Stallion", "Mouka", "Eko Electric", 
            "Ikeja Electric", "Sahara Group", "Eko Gas", "Oriental Energy", "Forte Oil",
            "Ibom Power", "Egbin Power", "Niger Delta Power"
        ]
        
        # Nigerian locations
        locations = [
            "Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Kaduna", 
            "Enugu", "Abeokuta", "Onitsha", "Warri", "Benin", "Calabar", 
            "Maiduguri", "Jos", "Ilorin", "Aba", "Ajaokuta", "Sokoto", 
            "Uyo", "Akure", "Osogbo", "Bauchi", "Asaba", "Yola", "Makurdi",
            "Owerri", "Yenagoa", "Sagamu", "Ijebu", "Ogbomosho", "Ota", "Agbara",
            "Delta", "Rivers", "Anambra"
        ]
        
        # Power-related terms
        power_terms = [
            "megawatt", "MW", "gigawatt", "GW", "power plant", "power generation",
            "electricity", "energy", "generator", "IPP", "gas power", "gas turbine",
            "solar power", "renewable energy", "diesel generator", "outage", "blackout",
            "gas-to-power", "independent power producer", "power supply", "electricity tariff"
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
    
    def export_to_excel(self, output_file="../Database/NewsData/nigeria_energy_news.xlsx"):
        """Export articles to Excel for analysis"""
        data = []
        for article in self.articles:
            data.append({
                "Title": article.title,
                "Source": article.source,
                "Date": article.published_at,
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
    
    def export_potential_leads(self, output_file="../Database/NewsData/nigeria_energy_leads.md"):
        """Export potential leads to markdown"""
        lead_articles = [article for article in self.articles if article.lead_potential]
        
        # Sort by date (newest first)
        lead_articles.sort(key=lambda x: x.published_at if x.published_at else "", reverse=True)
        
        with open(output_file, 'w') as f:
            f.write("# Potential Energy Leads in Nigeria\n\n")
            f.write(f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n")
            f.write(f"Total potential leads found: {len(lead_articles)}\n\n")
            
            if not lead_articles:
                f.write("No potential leads found yet. Try adjusting search parameters or expanding the company/location lists.")
                return
                
            for idx, article in enumerate(lead_articles, 1):
                f.write(f"## {idx}. {article.title}\n\n")
                f.write(f"**Source**: {article.source}\n\n")
                f.write(f"**Date**: {article.published_at}\n\n")
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
    
    def generate_executive_summary(self, output_file="../Database/NewsData/nigeria_energy_executive_summary.md"):
        """Generate an executive summary of potential leads"""
        lead_articles = [article for article in self.articles if article.lead_potential]
        
        if not lead_articles:
            print("No potential leads to summarize")
            return
            
        # Sort by date (newest first)
        lead_articles.sort(key=lambda x: x.published_at if x.published_at else "", reverse=True)
        
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
            f.write("# Executive Summary: Potential IPP Leads in Nigeria\n\n")
            f.write(f"*Generated on {datetime.now().strftime('%Y-%m-%d')}*\n\n")
            f.write(f"## Overview\n\n")
            f.write(f"Our news monitoring has identified **{len(lead_articles)} potential IPP leads** ")
            f.write(f"from recent Nigerian news. These leads mention both power/energy topics ")
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
                f.write(f"{idx}. **{article.title}** ({article.source}, {article.published_at})\n")
                
                companies_text = ", ".join(article.companies_mentioned) if article.companies_mentioned else "No specific company"
                locations_text = ", ".join(article.locations_mentioned) if article.locations_mentioned else "No specific location"
                
                f.write(f"   - Companies: {companies_text}\n")
                f.write(f"   - Locations: {locations_text}\n")
                f.write(f"   - URL: {article.url}\n\n")
            
            # Recommendations section
            f.write("## Recommended Actions\n\n")
            f.write("1. **Follow up on high-potential leads**: Especially those mentioning major energy companies\n")
            f.write("2. **Regional focus**: Concentrate on locations with multiple mentions\n")
            f.write("3. **Monitor industry developments**: Track news about expansions and new facilities\n")
            f.write("4. **Develop targeted outreach**: Create tailored sales approaches for each identified company\n")
        
        print(f"Generated executive summary at {output_file}")

def main():
    parser = argparse.ArgumentParser(description='Nigeria Energy News API Scraper')
    parser.add_argument('--api_key', help='NewsAPI API key (get one at https://newsapi.org/register)')
    parser.add_argument('--query', default='(energy OR power OR electricity OR gas) (Nigeria OR Lagos OR Abuja)',
                        help='Search query for everything endpoint')
    parser.add_argument('--days', type=int, default=30,
                        help='Number of days back to search (max 30 for free API)')
    parser.add_argument('--headlines', action='store_true',
                        help='Fetch top headlines from Nigeria')
    parser.add_argument('--category', choices=['business', 'technology', 'science'],
                        help='Category for top headlines')
    parser.add_argument('--analyze', action='store_true',
                        help='Analyze articles for potential leads')
    parser.add_argument('--export', action='store_true',
                        help='Export results to Excel and markdown')
    
    args = parser.parse_args()
    
    # Initialize client
    api_key = args.api_key if args.api_key else DEFAULT_API_KEY
    client = NewsAPIClient(api_key=api_key)
    
    # Fetch articles
    if args.headlines:
        client.fetch_top_headlines(category=args.category, query=args.query)
    else:
        client.fetch_everything(query=args.query, days_back=args.days)
    
    # Analyze articles
    if args.analyze or args.export:
        client.analyze_articles()
    
    # Export results
    if args.export:
        client.export_to_excel()
        client.export_potential_leads()
        client.generate_executive_summary()
    
if __name__ == "__main__":
    main() 