#!/usr/bin/env python3
"""
News Scraper for Nigerian Energy and Industry News
This script scrapes relevant news about energy and industrial developments in Nigeria
to identify potential IPP leads and market intelligence.
"""
import os
import json
import pandas as pd
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import re
import time
import random

# Create necessary directories
os.makedirs("../Database/NewsData", exist_ok=True)

class NewsArticle:
    """Class to represent a news article"""
    def __init__(self, title, url, source, date, summary=None, content=None):
        self.title = title
        self.url = url
        self.source = source
        self.date = date
        self.summary = summary
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
            "summary": self.summary,
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
            summary=data.get("summary"),
            content=data.get("content")
        )
        article.lead_potential = data.get("lead_potential", False)
        article.companies_mentioned = data.get("companies_mentioned", [])
        article.locations_mentioned = data.get("locations_mentioned", [])
        article.power_mentioned = data.get("power_mentioned", False)
        article.tags = data.get("tags", [])
        return article

class NewsScraper:
    """Base class for all news scrapers"""
    def __init__(self, cache_file="../Database/NewsData/news_cache.json"):
        self.articles = []
        self.cache_file = cache_file
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
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
    
    def scrape(self):
        """Implement in subclasses"""
        pass
    
    def analyze_articles(self):
        """Analyze articles for potential leads"""
        # Nigerian companies that might be leads
        companies = [
            "Dangote", "BUA", "Flour Mills", "Lafarge", "Oando", "Seplat", 
            "MTN", "NNPC", "Shell", "Total", "Mobil", "Nestle", "Nigerian Breweries",
            "Cadbury", "PZ Cussons", "Unilever", "Guinness", "Honeywell", "Olam",
            "Dufil", "Indomie", "UAC", "Julius Berger", "FBN", "UBA", "Zenith", 
            "GTBank", "Access Bank", "Transcorp", "GlaxoSmithKline", "May & Baker"
        ]
        
        # Nigerian locations
        locations = [
            "Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Kaduna", 
            "Enugu", "Abeokuta", "Onitsha", "Warri", "Benin", "Calabar", 
            "Maiduguri", "Jos", "Ilorin", "Aba", "Ajaokuta", "Sokoto", 
            "Uyo", "Akure", "Osogbo", "Bauchi", "Asaba", "Yola", "Makurdi",
            "Owerri", "Yenagoa", "Sagamu", "Ijebu", "Ogbomosho", "Ota", "Agbara"
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
            if article.summary:
                text += article.summary + " "
            if article.content:
                text += article.content
            
            # Convert to lowercase for case-insensitive matching
            text_lower = text.lower()
            
            # Check for companies
            for company in companies:
                pattern = r'\b' + re.escape(company) + r'\b'
                if re.search(pattern, text, re.IGNORECASE):
                    if company not in article.companies_mentioned:
                        article.companies_mentioned.append(company)
            
            # Check for locations
            for location in locations:
                pattern = r'\b' + re.escape(location) + r'\b'
                if re.search(pattern, text, re.IGNORECASE):
                    if location not in article.locations_mentioned:
                        article.locations_mentioned.append(location)
            
            # Check for power terms
            for term in power_terms:
                pattern = r'\b' + re.escape(term) + r'\b'
                if re.search(pattern, text_lower):
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

    def export_to_excel(self, output_file="../Database/NewsData/news_analysis.xlsx"):
        """Export articles to Excel for analysis"""
        data = []
        for article in self.articles:
            data.append({
                "Title": article.title,
                "Source": article.source,
                "Date": article.date,
                "URL": article.url,
                "Summary": article.summary,
                "Lead Potential": "Yes" if article.lead_potential else "No",
                "Companies": ", ".join(article.companies_mentioned),
                "Locations": ", ".join(article.locations_mentioned),
                "Power Mentioned": "Yes" if article.power_mentioned else "No",
                "Tags": ", ".join(article.tags)
            })
        
        df = pd.DataFrame(data)
        
        # Sort by lead potential and date
        df.sort_values(by=["Lead Potential", "Date"], ascending=[False, False], inplace=True)
        
        # Save to Excel
        df.to_excel(output_file, index=False)
        print(f"Exported {len(data)} articles to {output_file}")
    
    def export_potential_leads(self, output_file="../Database/NewsData/potential_leads.md"):
        """Export potential leads to markdown"""
        lead_articles = [article for article in self.articles if article.lead_potential]
        
        # Sort by date (newest first)
        lead_articles.sort(key=lambda x: x.date if x.date else "", reverse=True)
        
        with open(output_file, 'w') as f:
            f.write("# Potential Leads from News Articles\n\n")
            f.write(f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n")
            f.write(f"Total potential leads found: {len(lead_articles)}\n\n")
            
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
                
                if article.summary:
                    f.write("**Summary**:\n\n")
                    f.write(f"{article.summary}\n\n")
                
                f.write("---\n\n")
        
        print(f"Exported {len(lead_articles)} potential leads to {output_file}")


class BusinessDayNewsScraper(NewsScraper):
    """Scraper for BusinessDay Nigeria"""
    def __init__(self, cache_file="../Database/NewsData/news_cache.json"):
        super().__init__(cache_file)
        self.base_url = "https://businessday.ng/category/energy/"
        
    def scrape(self, pages=3):
        """Scrape BusinessDay energy news"""
        print(f"Scraping BusinessDay Energy News ({pages} pages)...")
        
        for page in range(1, pages + 1):
            url = f"{self.base_url}/page/{page}/"
            try:
                response = requests.get(url, headers=self.headers)
                if response.status_code != 200:
                    print(f"Failed to fetch page {page}: Status code {response.status_code}")
                    continue
                
                soup = BeautifulSoup(response.text, 'html.parser')
                articles = soup.find_all('article', class_='jeg_post')
                
                for article in articles:
                    try:
                        title_tag = article.find('h3', class_='jeg_post_title')
                        if not title_tag:
                            continue
                        
                        title = title_tag.text.strip()
                        link = title_tag.find('a')['href']
                        
                        # Skip if already in cache
                        if self.url_exists(link):
                            continue
                        
                        date_tag = article.find('div', class_='jeg_meta_date')
                        date = date_tag.text.strip() if date_tag else ""
                        
                        excerpt_tag = article.find('div', class_='jeg_post_excerpt')
                        summary = excerpt_tag.text.strip() if excerpt_tag else ""
                        
                        # Create article object
                        new_article = NewsArticle(
                            title=title,
                            url=link,
                            source="BusinessDay",
                            date=date,
                            summary=summary
                        )
                        
                        # Get full content
                        self.get_article_content(new_article)
                        
                        # Add to list
                        self.articles.append(new_article)
                        
                        # Random delay to avoid overloading the server
                        time.sleep(random.uniform(1, 3))
                        
                    except Exception as e:
                        print(f"Error processing article: {str(e)}")
                
                print(f"Processed page {page}, found {len(articles)} articles")
                
                # Save after each page
                self.save_cache()
                
                # Random delay between pages
                time.sleep(random.uniform(2, 5))
                
            except Exception as e:
                print(f"Error scraping page {page}: {str(e)}")
        
        return self.articles
    
    def get_article_content(self, article):
        """Get full content of an article"""
        try:
            response = requests.get(article.url, headers=self.headers)
            if response.status_code != 200:
                return
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find article content
            content_div = soup.find('div', class_='content-inner')
            if not content_div:
                return
            
            # Extract paragraphs
            paragraphs = content_div.find_all('p')
            content = ' '.join([p.text.strip() for p in paragraphs])
            
            article.content = content
            
        except Exception as e:
            print(f"Error getting article content: {str(e)}")


class PunchNewsScraper(NewsScraper):
    """Scraper for Punch Nigeria's Energy section"""
    def __init__(self, cache_file="../Database/NewsData/news_cache.json"):
        super().__init__(cache_file)
        self.base_url = "https://punchng.com/topics/energy/"
    
    def scrape(self, pages=3):
        """Scrape Punch energy news"""
        print(f"Scraping Punch Energy News ({pages} pages)...")
        
        for page in range(1, pages + 1):
            url = f"{self.base_url}page/{page}/"
            try:
                response = requests.get(url, headers=self.headers)
                if response.status_code != 200:
                    print(f"Failed to fetch page {page}: Status code {response.status_code}")
                    continue
                
                soup = BeautifulSoup(response.text, 'html.parser')
                articles = soup.find_all('div', class_='entry-item')
                
                for article in articles:
                    try:
                        title_tag = article.find('h3', class_='entry-title')
                        if not title_tag:
                            continue
                        
                        link_tag = title_tag.find('a')
                        title = link_tag.text.strip()
                        link = link_tag['href']
                        
                        # Skip if already in cache
                        if self.url_exists(link):
                            continue
                        
                        date_tag = article.find('span', class_='entry-date')
                        date = date_tag.text.strip() if date_tag else ""
                        
                        excerpt_tag = article.find('div', class_='entry-excerpt')
                        summary = excerpt_tag.text.strip() if excerpt_tag else ""
                        
                        # Create article object
                        new_article = NewsArticle(
                            title=title,
                            url=link,
                            source="Punch",
                            date=date,
                            summary=summary
                        )
                        
                        # Get full content
                        self.get_article_content(new_article)
                        
                        # Add to list
                        self.articles.append(new_article)
                        
                        # Random delay to avoid overloading the server
                        time.sleep(random.uniform(1, 3))
                        
                    except Exception as e:
                        print(f"Error processing article: {str(e)}")
                
                print(f"Processed page {page}, found {len(articles)} articles")
                
                # Save after each page
                self.save_cache()
                
                # Random delay between pages
                time.sleep(random.uniform(2, 5))
                
            except Exception as e:
                print(f"Error scraping page {page}: {str(e)}")
        
        return self.articles
    
    def get_article_content(self, article):
        """Get full content of an article"""
        try:
            response = requests.get(article.url, headers=self.headers)
            if response.status_code != 200:
                return
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find article content
            content_div = soup.find('div', class_='entry-content')
            if not content_div:
                return
            
            # Extract paragraphs
            paragraphs = content_div.find_all('p')
            content = ' '.join([p.text.strip() for p in paragraphs])
            
            article.content = content
            
        except Exception as e:
            print(f"Error getting article content: {str(e)}")


class ThisDayNewsScraper(NewsScraper):
    """Scraper for ThisDay Nigeria's Business section"""
    def __init__(self, cache_file="../Database/NewsData/news_cache.json"):
        super().__init__(cache_file)
        # ThisDay doesn't have a specific energy section, so we use the business section
        self.base_url = "https://www.thisdaylive.com/index.php/business/"
    
    def scrape(self, pages=3):
        """Scrape ThisDay business news"""
        print(f"Scraping ThisDay Business News ({pages} pages)...")
        
        for page in range(1, pages + 1):
            url = f"{self.base_url}page/{page}/"
            try:
                response = requests.get(url, headers=self.headers)
                if response.status_code != 200:
                    print(f"Failed to fetch page {page}: Status code {response.status_code}")
                    continue
                
                soup = BeautifulSoup(response.text, 'html.parser')
                articles = soup.find_all('article', class_='jeg_post')
                
                for article in articles:
                    try:
                        title_tag = article.find('h3', class_='jeg_post_title')
                        if not title_tag:
                            continue
                        
                        link_tag = title_tag.find('a')
                        title = link_tag.text.strip()
                        link = link_tag['href']
                        
                        # Skip if already in cache
                        if self.url_exists(link):
                            continue
                        
                        date_tag = article.find('div', class_='jeg_meta_date')
                        date = date_tag.text.strip() if date_tag else ""
                        
                        excerpt_tag = article.find('div', class_='jeg_post_excerpt')
                        summary = excerpt_tag.text.strip() if excerpt_tag else ""
                        
                        # Create article object
                        new_article = NewsArticle(
                            title=title,
                            url=link,
                            source="ThisDay",
                            date=date,
                            summary=summary
                        )
                        
                        # Get full content
                        self.get_article_content(new_article)
                        
                        # Add to list
                        self.articles.append(new_article)
                        
                        # Random delay to avoid overloading the server
                        time.sleep(random.uniform(1, 3))
                        
                    except Exception as e:
                        print(f"Error processing article: {str(e)}")
                
                print(f"Processed page {page}, found {len(articles)} articles")
                
                # Save after each page
                self.save_cache()
                
                # Random delay between pages
                time.sleep(random.uniform(2, 5))
                
            except Exception as e:
                print(f"Error scraping page {page}: {str(e)}")
        
        return self.articles
    
    def get_article_content(self, article):
        """Get full content of an article"""
        try:
            response = requests.get(article.url, headers=self.headers)
            if response.status_code != 200:
                return
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find article content
            content_div = soup.find('div', class_='content-inner')
            if not content_div:
                return
            
            # Extract paragraphs
            paragraphs = content_div.find_all('p')
            content = ' '.join([p.text.strip() for p in paragraphs])
            
            article.content = content
            
        except Exception as e:
            print(f"Error getting article content: {str(e)}")


def main():
    """Main function to run scrapers"""
    print("Starting Nigerian Energy News Scraper")
    
    # Create scrapers
    business_day_scraper = BusinessDayNewsScraper()
    punch_scraper = PunchNewsScraper()
    this_day_scraper = ThisDayNewsScraper()
    
    # Run scrapers
    business_day_scraper.scrape(pages=2)
    punch_scraper.scrape(pages=2)
    this_day_scraper.scrape(pages=2)
    
    # Analyze articles
    business_day_scraper.analyze_articles()
    punch_scraper.analyze_articles()
    this_day_scraper.analyze_articles()
    
    # Save results
    business_day_scraper.save_cache()
    business_day_scraper.export_to_excel()
    business_day_scraper.export_potential_leads()
    
    print("News scraping completed successfully")


if __name__ == "__main__":
    main() 
"""
News Scraper for Nigerian Energy and Industry News
This script scrapes relevant news about energy and industrial developments in Nigeria
to identify potential IPP leads and market intelligence.
"""
import os
import json
import pandas as pd
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import re
import time
import random

# Create necessary directories
os.makedirs("../Database/NewsData", exist_ok=True)

class NewsArticle:
    """Class to represent a news article"""
    def __init__(self, title, url, source, date, summary=None, content=None):
        self.title = title
        self.url = url
        self.source = source
        self.date = date
        self.summary = summary
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
            "summary": self.summary,
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
            summary=data.get("summary"),
            content=data.get("content")
        )
        article.lead_potential = data.get("lead_potential", False)
        article.companies_mentioned = data.get("companies_mentioned", [])
        article.locations_mentioned = data.get("locations_mentioned", [])
        article.power_mentioned = data.get("power_mentioned", False)
        article.tags = data.get("tags", [])
        return article

class NewsScraper:
    """Base class for all news scrapers"""
    def __init__(self, cache_file="../Database/NewsData/news_cache.json"):
        self.articles = []
        self.cache_file = cache_file
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
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
    
    def scrape(self):
        """Implement in subclasses"""
        pass
    
    def analyze_articles(self):
        """Analyze articles for potential leads"""
        # Nigerian companies that might be leads
        companies = [
            "Dangote", "BUA", "Flour Mills", "Lafarge", "Oando", "Seplat", 
            "MTN", "NNPC", "Shell", "Total", "Mobil", "Nestle", "Nigerian Breweries",
            "Cadbury", "PZ Cussons", "Unilever", "Guinness", "Honeywell", "Olam",
            "Dufil", "Indomie", "UAC", "Julius Berger", "FBN", "UBA", "Zenith", 
            "GTBank", "Access Bank", "Transcorp", "GlaxoSmithKline", "May & Baker"
        ]
        
        # Nigerian locations
        locations = [
            "Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Kaduna", 
            "Enugu", "Abeokuta", "Onitsha", "Warri", "Benin", "Calabar", 
            "Maiduguri", "Jos", "Ilorin", "Aba", "Ajaokuta", "Sokoto", 
            "Uyo", "Akure", "Osogbo", "Bauchi", "Asaba", "Yola", "Makurdi",
            "Owerri", "Yenagoa", "Sagamu", "Ijebu", "Ogbomosho", "Ota", "Agbara"
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
            if article.summary:
                text += article.summary + " "
            if article.content:
                text += article.content
            
            # Convert to lowercase for case-insensitive matching
            text_lower = text.lower()
            
            # Check for companies
            for company in companies:
                pattern = r'\b' + re.escape(company) + r'\b'
                if re.search(pattern, text, re.IGNORECASE):
                    if company not in article.companies_mentioned:
                        article.companies_mentioned.append(company)
            
            # Check for locations
            for location in locations:
                pattern = r'\b' + re.escape(location) + r'\b'
                if re.search(pattern, text, re.IGNORECASE):
                    if location not in article.locations_mentioned:
                        article.locations_mentioned.append(location)
            
            # Check for power terms
            for term in power_terms:
                pattern = r'\b' + re.escape(term) + r'\b'
                if re.search(pattern, text_lower):
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

    def export_to_excel(self, output_file="../Database/NewsData/news_analysis.xlsx"):
        """Export articles to Excel for analysis"""
        data = []
        for article in self.articles:
            data.append({
                "Title": article.title,
                "Source": article.source,
                "Date": article.date,
                "URL": article.url,
                "Summary": article.summary,
                "Lead Potential": "Yes" if article.lead_potential else "No",
                "Companies": ", ".join(article.companies_mentioned),
                "Locations": ", ".join(article.locations_mentioned),
                "Power Mentioned": "Yes" if article.power_mentioned else "No",
                "Tags": ", ".join(article.tags)
            })
        
        df = pd.DataFrame(data)
        
        # Sort by lead potential and date
        df.sort_values(by=["Lead Potential", "Date"], ascending=[False, False], inplace=True)
        
        # Save to Excel
        df.to_excel(output_file, index=False)
        print(f"Exported {len(data)} articles to {output_file}")
    
    def export_potential_leads(self, output_file="../Database/NewsData/potential_leads.md"):
        """Export potential leads to markdown"""
        lead_articles = [article for article in self.articles if article.lead_potential]
        
        # Sort by date (newest first)
        lead_articles.sort(key=lambda x: x.date if x.date else "", reverse=True)
        
        with open(output_file, 'w') as f:
            f.write("# Potential Leads from News Articles\n\n")
            f.write(f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n")
            f.write(f"Total potential leads found: {len(lead_articles)}\n\n")
            
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
                
                if article.summary:
                    f.write("**Summary**:\n\n")
                    f.write(f"{article.summary}\n\n")
                
                f.write("---\n\n")
        
        print(f"Exported {len(lead_articles)} potential leads to {output_file}")


class BusinessDayNewsScraper(NewsScraper):
    """Scraper for BusinessDay Nigeria"""
    def __init__(self, cache_file="../Database/NewsData/news_cache.json"):
        super().__init__(cache_file)
        self.base_url = "https://businessday.ng/category/energy/"
        
    def scrape(self, pages=3):
        """Scrape BusinessDay energy news"""
        print(f"Scraping BusinessDay Energy News ({pages} pages)...")
        
        for page in range(1, pages + 1):
            url = f"{self.base_url}/page/{page}/"
            try:
                response = requests.get(url, headers=self.headers)
                if response.status_code != 200:
                    print(f"Failed to fetch page {page}: Status code {response.status_code}")
                    continue
                
                soup = BeautifulSoup(response.text, 'html.parser')
                articles = soup.find_all('article', class_='jeg_post')
                
                for article in articles:
                    try:
                        title_tag = article.find('h3', class_='jeg_post_title')
                        if not title_tag:
                            continue
                        
                        title = title_tag.text.strip()
                        link = title_tag.find('a')['href']
                        
                        # Skip if already in cache
                        if self.url_exists(link):
                            continue
                        
                        date_tag = article.find('div', class_='jeg_meta_date')
                        date = date_tag.text.strip() if date_tag else ""
                        
                        excerpt_tag = article.find('div', class_='jeg_post_excerpt')
                        summary = excerpt_tag.text.strip() if excerpt_tag else ""
                        
                        # Create article object
                        new_article = NewsArticle(
                            title=title,
                            url=link,
                            source="BusinessDay",
                            date=date,
                            summary=summary
                        )
                        
                        # Get full content
                        self.get_article_content(new_article)
                        
                        # Add to list
                        self.articles.append(new_article)
                        
                        # Random delay to avoid overloading the server
                        time.sleep(random.uniform(1, 3))
                        
                    except Exception as e:
                        print(f"Error processing article: {str(e)}")
                
                print(f"Processed page {page}, found {len(articles)} articles")
                
                # Save after each page
                self.save_cache()
                
                # Random delay between pages
                time.sleep(random.uniform(2, 5))
                
            except Exception as e:
                print(f"Error scraping page {page}: {str(e)}")
        
        return self.articles
    
    def get_article_content(self, article):
        """Get full content of an article"""
        try:
            response = requests.get(article.url, headers=self.headers)
            if response.status_code != 200:
                return
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find article content
            content_div = soup.find('div', class_='content-inner')
            if not content_div:
                return
            
            # Extract paragraphs
            paragraphs = content_div.find_all('p')
            content = ' '.join([p.text.strip() for p in paragraphs])
            
            article.content = content
            
        except Exception as e:
            print(f"Error getting article content: {str(e)}")


class PunchNewsScraper(NewsScraper):
    """Scraper for Punch Nigeria's Energy section"""
    def __init__(self, cache_file="../Database/NewsData/news_cache.json"):
        super().__init__(cache_file)
        self.base_url = "https://punchng.com/topics/energy/"
    
    def scrape(self, pages=3):
        """Scrape Punch energy news"""
        print(f"Scraping Punch Energy News ({pages} pages)...")
        
        for page in range(1, pages + 1):
            url = f"{self.base_url}page/{page}/"
            try:
                response = requests.get(url, headers=self.headers)
                if response.status_code != 200:
                    print(f"Failed to fetch page {page}: Status code {response.status_code}")
                    continue
                
                soup = BeautifulSoup(response.text, 'html.parser')
                articles = soup.find_all('div', class_='entry-item')
                
                for article in articles:
                    try:
                        title_tag = article.find('h3', class_='entry-title')
                        if not title_tag:
                            continue
                        
                        link_tag = title_tag.find('a')
                        title = link_tag.text.strip()
                        link = link_tag['href']
                        
                        # Skip if already in cache
                        if self.url_exists(link):
                            continue
                        
                        date_tag = article.find('span', class_='entry-date')
                        date = date_tag.text.strip() if date_tag else ""
                        
                        excerpt_tag = article.find('div', class_='entry-excerpt')
                        summary = excerpt_tag.text.strip() if excerpt_tag else ""
                        
                        # Create article object
                        new_article = NewsArticle(
                            title=title,
                            url=link,
                            source="Punch",
                            date=date,
                            summary=summary
                        )
                        
                        # Get full content
                        self.get_article_content(new_article)
                        
                        # Add to list
                        self.articles.append(new_article)
                        
                        # Random delay to avoid overloading the server
                        time.sleep(random.uniform(1, 3))
                        
                    except Exception as e:
                        print(f"Error processing article: {str(e)}")
                
                print(f"Processed page {page}, found {len(articles)} articles")
                
                # Save after each page
                self.save_cache()
                
                # Random delay between pages
                time.sleep(random.uniform(2, 5))
                
            except Exception as e:
                print(f"Error scraping page {page}: {str(e)}")
        
        return self.articles
    
    def get_article_content(self, article):
        """Get full content of an article"""
        try:
            response = requests.get(article.url, headers=self.headers)
            if response.status_code != 200:
                return
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find article content
            content_div = soup.find('div', class_='entry-content')
            if not content_div:
                return
            
            # Extract paragraphs
            paragraphs = content_div.find_all('p')
            content = ' '.join([p.text.strip() for p in paragraphs])
            
            article.content = content
            
        except Exception as e:
            print(f"Error getting article content: {str(e)}")


class ThisDayNewsScraper(NewsScraper):
    """Scraper for ThisDay Nigeria's Business section"""
    def __init__(self, cache_file="../Database/NewsData/news_cache.json"):
        super().__init__(cache_file)
        # ThisDay doesn't have a specific energy section, so we use the business section
        self.base_url = "https://www.thisdaylive.com/index.php/business/"
    
    def scrape(self, pages=3):
        """Scrape ThisDay business news"""
        print(f"Scraping ThisDay Business News ({pages} pages)...")
        
        for page in range(1, pages + 1):
            url = f"{self.base_url}page/{page}/"
            try:
                response = requests.get(url, headers=self.headers)
                if response.status_code != 200:
                    print(f"Failed to fetch page {page}: Status code {response.status_code}")
                    continue
                
                soup = BeautifulSoup(response.text, 'html.parser')
                articles = soup.find_all('article', class_='jeg_post')
                
                for article in articles:
                    try:
                        title_tag = article.find('h3', class_='jeg_post_title')
                        if not title_tag:
                            continue
                        
                        link_tag = title_tag.find('a')
                        title = link_tag.text.strip()
                        link = link_tag['href']
                        
                        # Skip if already in cache
                        if self.url_exists(link):
                            continue
                        
                        date_tag = article.find('div', class_='jeg_meta_date')
                        date = date_tag.text.strip() if date_tag else ""
                        
                        excerpt_tag = article.find('div', class_='jeg_post_excerpt')
                        summary = excerpt_tag.text.strip() if excerpt_tag else ""
                        
                        # Create article object
                        new_article = NewsArticle(
                            title=title,
                            url=link,
                            source="ThisDay",
                            date=date,
                            summary=summary
                        )
                        
                        # Get full content
                        self.get_article_content(new_article)
                        
                        # Add to list
                        self.articles.append(new_article)
                        
                        # Random delay to avoid overloading the server
                        time.sleep(random.uniform(1, 3))
                        
                    except Exception as e:
                        print(f"Error processing article: {str(e)}")
                
                print(f"Processed page {page}, found {len(articles)} articles")
                
                # Save after each page
                self.save_cache()
                
                # Random delay between pages
                time.sleep(random.uniform(2, 5))
                
            except Exception as e:
                print(f"Error scraping page {page}: {str(e)}")
        
        return self.articles
    
    def get_article_content(self, article):
        """Get full content of an article"""
        try:
            response = requests.get(article.url, headers=self.headers)
            if response.status_code != 200:
                return
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find article content
            content_div = soup.find('div', class_='content-inner')
            if not content_div:
                return
            
            # Extract paragraphs
            paragraphs = content_div.find_all('p')
            content = ' '.join([p.text.strip() for p in paragraphs])
            
            article.content = content
            
        except Exception as e:
            print(f"Error getting article content: {str(e)}")


def main():
    """Main function to run scrapers"""
    print("Starting Nigerian Energy News Scraper")
    
    # Create scrapers
    business_day_scraper = BusinessDayNewsScraper()
    punch_scraper = PunchNewsScraper()
    this_day_scraper = ThisDayNewsScraper()
    
    # Run scrapers
    business_day_scraper.scrape(pages=2)
    punch_scraper.scrape(pages=2)
    this_day_scraper.scrape(pages=2)
    
    # Analyze articles
    business_day_scraper.analyze_articles()
    punch_scraper.analyze_articles()
    this_day_scraper.analyze_articles()
    
    # Save results
    business_day_scraper.save_cache()
    business_day_scraper.export_to_excel()
    business_day_scraper.export_potential_leads()
    
    print("News scraping completed successfully")


if __name__ == "__main__":
    main() 