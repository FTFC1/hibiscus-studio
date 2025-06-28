#!/usr/bin/env python3
"""
Improved Nigerian News Scraper
This script uses Scrapy with rotating user agents and request delays to avoid 403 errors
while gathering energy news from Nigerian websites.
"""

import os
import json
import time
import random
import pandas as pd
from datetime import datetime
import argparse
from urllib.parse import urlparse
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("../Database/NewsData/scraper.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("NewsScraperImproved")

try:
    import scrapy
    from scrapy.crawler import CrawlerProcess
    from scrapy.utils.project import get_project_settings
    from w3lib.http import basic_auth_header
except ImportError:
    logger.error("Scrapy is not installed. Please install it with: pip install scrapy")
    logger.info("You may also need: pip install w3lib")
    exit(1)

# Create necessary directories
os.makedirs("../Database/NewsData", exist_ok=True)

# Common Nigerian news sites for energy news
NEWS_SOURCES = [
    {
        "name": "Premium Times",
        "url": "https://www.premiumtimesng.com/category/business",
        "article_selector": "article.jeg_post",
        "title_selector": "h3.jeg_post_title a::text",
        "link_selector": "h3.jeg_post_title a::attr(href)",
        "date_selector": "div.jeg_meta_date::text", 
        "summary_selector": "div.jeg_post_excerpt p::text"
    },
    {
        "name": "The Guardian Nigeria",
        "url": "https://guardian.ng/category/energy/",
        "article_selector": "div.item-list",
        "title_selector": "h3 a::text",
        "link_selector": "h3 a::attr(href)",
        "date_selector": "span.date::text",
        "summary_selector": "div.item-content p::text"
    },
    {
        "name": "Business Day",
        "url": "https://businessday.ng/category/energy/",
        "article_selector": "article.jeg_post",
        "title_selector": "h3.jeg_post_title a::text",
        "link_selector": "h3.jeg_post_title a::attr(href)",
        "date_selector": "div.jeg_meta_date::text",
        "summary_selector": "div.jeg_post_excerpt p::text"
    },
    {
        "name": "Punch Nigeria",
        "url": "https://punchng.com/topics/energy/",
        "article_selector": "div.entry-item",
        "title_selector": "h3.entry-title a::text",
        "link_selector": "h3.entry-title a::attr(href)",
        "date_selector": "span.entry-date::text",
        "summary_selector": "div.entry-excerpt::text"
    },
    {
        "name": "The Nation Nigeria",
        "url": "https://thenationonlineng.net/category/business/energy/",
        "article_selector": "article.jeg_post",
        "title_selector": "h3.jeg_post_title a::text",
        "link_selector": "h3.jeg_post_title a::attr(href)",
        "date_selector": "div.jeg_meta_date::text",
        "summary_selector": "div.jeg_post_excerpt p::text"
    }
]

# List of mobile and desktop user agents to rotate through
USER_AGENTS = [
    # Mobile User Agents
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Android 12; Mobile; rv:68.0) Gecko/68.0 Firefox/99.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/99.0.4844.59 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    
    # Desktop User Agents
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 Edg/99.0.1150.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
]

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

class NewsSpider(scrapy.Spider):
    """Base spider for all news sites"""
    name = "news_spider"
    
    def __init__(self, source=None, article_limit=None, url=None, *args, **kwargs):
        super(NewsSpider, self).__init__(*args, **kwargs)
        self.source_info = next((s for s in NEWS_SOURCES if s["name"] == source), None)
        if url:
            self.start_urls = [url]
        elif self.source_info:
            self.start_urls = [self.source_info["url"]]
        else:
            self.start_urls = [s["url"] for s in NEWS_SOURCES]
            
        self.article_limit = int(article_limit) if article_limit else None
        self.articles_scraped = 0
        self.cache_file = kwargs.get('cache_file', "../Database/NewsData/news_cache.json")
        self.cached_urls = self._load_cached_urls()
        
    def _load_cached_urls(self):
        """Load previously scraped URLs from cache"""
        if os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, 'r') as f:
                    cached_data = json.load(f)
                    return {article.get("url") for article in cached_data}
            except Exception as e:
                logger.error(f"Error loading cache: {str(e)}")
                return set()
        else:
            return set()
    
    def _get_source_info(self, url):
        """Get source info based on URL domain"""
        domain = urlparse(url).netloc
        for source in NEWS_SOURCES:
            if domain in urlparse(source["url"]).netloc:
                return source
        return None
    
    def parse(self, response):
        """Parse the news site's listing page"""
        source_info = self._get_source_info(response.url)
        if not source_info:
            logger.warning(f"No source info for URL: {response.url}")
            return
            
        source_name = source_info["name"]
        article_selector = source_info["article_selector"]
        title_selector = source_info["title_selector"]
        link_selector = source_info["link_selector"]
        date_selector = source_info["date_selector"]
        summary_selector = source_info["summary_selector"]
        
        logger.info(f"Parsing articles from {source_name} at {response.url}")
        
        articles = response.css(article_selector)
        logger.info(f"Found {len(articles)} article elements")
        
        for article in articles:
            # Stop if we reached the article limit
            if self.article_limit and self.articles_scraped >= self.article_limit:
                logger.info(f"Reached article limit of {self.article_limit}")
                break
                
            try:
                title = article.css(title_selector).get()
                if not title:
                    continue
                    
                title = title.strip()
                link = article.css(link_selector).get()
                
                # Skip if URL already in cache
                if link in self.cached_urls:
                    logger.debug(f"Skipping already cached article: {title}")
                    continue
                
                date = article.css(date_selector).get()
                date = date.strip() if date else ""
                
                summary = article.css(summary_selector).get()
                summary = summary.strip() if summary else ""
                
                logger.info(f"Found article: {title}")
                
                # Add random delay before requesting article content
                delay = random.uniform(1.0, 3.0)
                time.sleep(delay)
                
                # Yield request to get the full article content
                yield scrapy.Request(
                    link, 
                    callback=self.parse_article,
                    meta={
                        'title': title,
                        'date': date,
                        'summary': summary,
                        'source': source_name
                    },
                    headers={
                        'User-Agent': random.choice(USER_AGENTS),
                        'Accept': 'text/html,application/xhtml+xml,application/xml',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Referer': response.url,
                        'DNT': '1',
                    }
                )
                
                self.articles_scraped += 1
                
            except Exception as e:
                logger.error(f"Error processing article: {str(e)}")
        
        # Look for pagination or "next page" links
        next_page = response.css('a.page-numbers.next::attr(href), a.next.page-numbers::attr(href)').get()
        if next_page and (not self.article_limit or self.articles_scraped < self.article_limit):
            logger.info(f"Following next page: {next_page}")
            yield scrapy.Request(
                next_page, 
                callback=self.parse,
                headers={
                    'User-Agent': random.choice(USER_AGENTS),
                    'Accept': 'text/html,application/xhtml+xml,application/xml',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Referer': response.url,
                    'DNT': '1',
                }
            )
    
    def parse_article(self, response):
        """Parse the full article page"""
        title = response.meta.get('title')
        date = response.meta.get('date')
        summary = response.meta.get('summary')
        source = response.meta.get('source')
        
        # Different sites have different content selectors
        content_selectors = [
            'div.content-inner p, div.jeg_post_content p, div.jeg_share_top ~ div p',
            'div.entry-content p',
            'div.text p',
            'div.jeg_share_top ~ div p',
            'article p',
            'div.content p, div.post-content p'
        ]
        
        content = ""
        for selector in content_selectors:
            paragraphs = response.css(selector).extract()
            if paragraphs:
                content = ' '.join([p.strip() for p in paragraphs])
                break
        
        # Create a dictionary with the article info
        article_dict = {
            'title': title,
            'url': response.url,
            'date': date,
            'summary': summary,
            'content': content,
            'source': source
        }
        
        logger.info(f"Parsed article content: {title}")
        
        yield article_dict

class NewsScraper:
    """Manager class for running the scrapers and analyzing the results"""
    def __init__(self, cache_file="../Database/NewsData/news_cache.json"):
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
                logger.info(f"Loaded {len(self.articles)} articles from cache")
            except Exception as e:
                logger.error(f"Error loading cache: {str(e)}")
                self.articles = []
        else:
            self.articles = []
    
    def save_cache(self):
        """Save scraped articles to cache"""
        try:
            with open(self.cache_file, 'w') as f:
                json.dump([article.to_dict() for article in self.articles], f, indent=2)
            logger.info(f"Saved {len(self.articles)} articles to cache")
        except Exception as e:
            logger.error(f"Error saving cache: {str(e)}")
    
    def url_exists(self, url):
        """Check if a URL already exists in the articles list"""
        return any(article.url == url for article in self.articles)
    
    def scrape(self, sources=None, article_limit=None):
        """Run the scrapers for all or specified sources"""
        # Create a file to store the scraped articles
        results_file = "../Database/NewsData/scraped_articles.json"
        
        # Set up a crawler process
        settings = get_project_settings()
        settings.update({
            'USER_AGENT': random.choice(USER_AGENTS),
            'ROBOTSTXT_OBEY': True,
            'CONCURRENT_REQUESTS': 1,  # Low concurrency to avoid being detected
            'DOWNLOAD_DELAY': 5,  # 5 second delay between requests
            'RANDOMIZE_DOWNLOAD_DELAY': True,
            'COOKIES_ENABLED': False,  # Disable cookies
            'FEEDS': {
                results_file: {
                    'format': 'json',
                    'overwrite': True,
                },
            },
            'LOG_LEVEL': 'INFO',
            'RETRY_TIMES': 3,
            'RETRY_HTTP_CODES': [500, 502, 503, 504, 408, 403, 429],
        })
        
        process = CrawlerProcess(settings)
        
        # Determine which sources to scrape
        sources_to_scrape = []
        if sources:
            if sources.lower() == "all":
                sources_to_scrape = [s["name"] for s in NEWS_SOURCES]
            else:
                sources_to_scrape = sources.split(",")
        else:
            sources_to_scrape = [NEWS_SOURCES[0]["name"]]  # Default to first source
            
        logger.info(f"Setting up scrapers for: {', '.join(sources_to_scrape)}")
        
        # Set up a spider for each source
        for source in sources_to_scrape:
            process.crawl(
                NewsSpider, 
                source=source, 
                article_limit=article_limit,
                cache_file=self.cache_file
            )
        
        logger.info("Starting scrapers...")
        process.start()  # Blocking operation until crawling is finished
        
        # Load the results
        if os.path.exists(results_file):
            try:
                with open(results_file, 'r') as f:
                    new_articles_data = json.load(f)
                    
                logger.info(f"Loaded {len(new_articles_data)} new articles from scraper")
                
                # Convert to NewsArticle objects and add to the list
                for article_data in new_articles_data:
                    if not self.url_exists(article_data.get('url', '')):
                        article = NewsArticle(
                            title=article_data.get('title', ''),
                            url=article_data.get('url', ''),
                            source=article_data.get('source', ''),
                            date=article_data.get('date', ''),
                            summary=article_data.get('summary', ''),
                            content=article_data.get('content', '')
                        )
                        self.articles.append(article)
                
                # Save to cache
                self.save_cache()
                
            except Exception as e:
                logger.error(f"Error processing scraped articles: {str(e)}")
        else:
            logger.error(f"No results file found at {results_file}")
        
        return self.articles
    
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
        
        logger.info(f"Analyzed {len(self.articles)} articles")
        logger.info(f"Found {sum(1 for article in self.articles if article.lead_potential)} potential leads")

        # Save after analysis
        self.save_cache()
    
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
        logger.info(f"Exported {len(data)} articles to {output_file}")
    
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
        
        logger.info(f"Exported {len(lead_articles)} potential leads to {output_file}")

def main():
    parser = argparse.ArgumentParser(description="Improved Nigerian News Scraper")
    parser.add_argument('--sources', default="all", 
                      help="Comma-separated list of news sources to scrape, or 'all' (default: all)")
    parser.add_argument('--limit', type=int, default=10,
                      help="Maximum number of articles to scrape per source (default: 10)")
    parser.add_argument('--no-analyze', action='store_true',
                      help="Skip article analysis")
    parser.add_argument('--no-export', action='store_true',
                      help="Skip exporting to Excel and markdown")
    
    args = parser.parse_args()
    
    scraper = NewsScraper()
    
    # Run the scrapers
    logger.info("Starting the scraping process...")
    scraper.scrape(sources=args.sources, article_limit=args.limit)
    
    # Analyze the articles
    if not args.no_analyze:
        logger.info("Analyzing articles...")
        scraper.analyze_articles()
    
    # Export the results
    if not args.no_export:
        logger.info("Exporting results...")
        scraper.export_to_excel()
        scraper.export_potential_leads()
    
    logger.info("Scraping completed successfully")

if __name__ == "__main__":
    main() 
"""
Improved Nigerian News Scraper
This script uses Scrapy with rotating user agents and request delays to avoid 403 errors
while gathering energy news from Nigerian websites.
"""

import os
import json
import time
import random
import pandas as pd
from datetime import datetime
import argparse
from urllib.parse import urlparse
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("../Database/NewsData/scraper.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("NewsScraperImproved")

try:
    import scrapy
    from scrapy.crawler import CrawlerProcess
    from scrapy.utils.project import get_project_settings
    from w3lib.http import basic_auth_header
except ImportError:
    logger.error("Scrapy is not installed. Please install it with: pip install scrapy")
    logger.info("You may also need: pip install w3lib")
    exit(1)

# Create necessary directories
os.makedirs("../Database/NewsData", exist_ok=True)

# Common Nigerian news sites for energy news
NEWS_SOURCES = [
    {
        "name": "Premium Times",
        "url": "https://www.premiumtimesng.com/category/business",
        "article_selector": "article.jeg_post",
        "title_selector": "h3.jeg_post_title a::text",
        "link_selector": "h3.jeg_post_title a::attr(href)",
        "date_selector": "div.jeg_meta_date::text", 
        "summary_selector": "div.jeg_post_excerpt p::text"
    },
    {
        "name": "The Guardian Nigeria",
        "url": "https://guardian.ng/category/energy/",
        "article_selector": "div.item-list",
        "title_selector": "h3 a::text",
        "link_selector": "h3 a::attr(href)",
        "date_selector": "span.date::text",
        "summary_selector": "div.item-content p::text"
    },
    {
        "name": "Business Day",
        "url": "https://businessday.ng/category/energy/",
        "article_selector": "article.jeg_post",
        "title_selector": "h3.jeg_post_title a::text",
        "link_selector": "h3.jeg_post_title a::attr(href)",
        "date_selector": "div.jeg_meta_date::text",
        "summary_selector": "div.jeg_post_excerpt p::text"
    },
    {
        "name": "Punch Nigeria",
        "url": "https://punchng.com/topics/energy/",
        "article_selector": "div.entry-item",
        "title_selector": "h3.entry-title a::text",
        "link_selector": "h3.entry-title a::attr(href)",
        "date_selector": "span.entry-date::text",
        "summary_selector": "div.entry-excerpt::text"
    },
    {
        "name": "The Nation Nigeria",
        "url": "https://thenationonlineng.net/category/business/energy/",
        "article_selector": "article.jeg_post",
        "title_selector": "h3.jeg_post_title a::text",
        "link_selector": "h3.jeg_post_title a::attr(href)",
        "date_selector": "div.jeg_meta_date::text",
        "summary_selector": "div.jeg_post_excerpt p::text"
    }
]

# List of mobile and desktop user agents to rotate through
USER_AGENTS = [
    # Mobile User Agents
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Android 12; Mobile; rv:68.0) Gecko/68.0 Firefox/99.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/99.0.4844.59 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    
    # Desktop User Agents
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.3 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 Edg/99.0.1150.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
]

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

class NewsSpider(scrapy.Spider):
    """Base spider for all news sites"""
    name = "news_spider"
    
    def __init__(self, source=None, article_limit=None, url=None, *args, **kwargs):
        super(NewsSpider, self).__init__(*args, **kwargs)
        self.source_info = next((s for s in NEWS_SOURCES if s["name"] == source), None)
        if url:
            self.start_urls = [url]
        elif self.source_info:
            self.start_urls = [self.source_info["url"]]
        else:
            self.start_urls = [s["url"] for s in NEWS_SOURCES]
            
        self.article_limit = int(article_limit) if article_limit else None
        self.articles_scraped = 0
        self.cache_file = kwargs.get('cache_file', "../Database/NewsData/news_cache.json")
        self.cached_urls = self._load_cached_urls()
        
    def _load_cached_urls(self):
        """Load previously scraped URLs from cache"""
        if os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, 'r') as f:
                    cached_data = json.load(f)
                    return {article.get("url") for article in cached_data}
            except Exception as e:
                logger.error(f"Error loading cache: {str(e)}")
                return set()
        else:
            return set()
    
    def _get_source_info(self, url):
        """Get source info based on URL domain"""
        domain = urlparse(url).netloc
        for source in NEWS_SOURCES:
            if domain in urlparse(source["url"]).netloc:
                return source
        return None
    
    def parse(self, response):
        """Parse the news site's listing page"""
        source_info = self._get_source_info(response.url)
        if not source_info:
            logger.warning(f"No source info for URL: {response.url}")
            return
            
        source_name = source_info["name"]
        article_selector = source_info["article_selector"]
        title_selector = source_info["title_selector"]
        link_selector = source_info["link_selector"]
        date_selector = source_info["date_selector"]
        summary_selector = source_info["summary_selector"]
        
        logger.info(f"Parsing articles from {source_name} at {response.url}")
        
        articles = response.css(article_selector)
        logger.info(f"Found {len(articles)} article elements")
        
        for article in articles:
            # Stop if we reached the article limit
            if self.article_limit and self.articles_scraped >= self.article_limit:
                logger.info(f"Reached article limit of {self.article_limit}")
                break
                
            try:
                title = article.css(title_selector).get()
                if not title:
                    continue
                    
                title = title.strip()
                link = article.css(link_selector).get()
                
                # Skip if URL already in cache
                if link in self.cached_urls:
                    logger.debug(f"Skipping already cached article: {title}")
                    continue
                
                date = article.css(date_selector).get()
                date = date.strip() if date else ""
                
                summary = article.css(summary_selector).get()
                summary = summary.strip() if summary else ""
                
                logger.info(f"Found article: {title}")
                
                # Add random delay before requesting article content
                delay = random.uniform(1.0, 3.0)
                time.sleep(delay)
                
                # Yield request to get the full article content
                yield scrapy.Request(
                    link, 
                    callback=self.parse_article,
                    meta={
                        'title': title,
                        'date': date,
                        'summary': summary,
                        'source': source_name
                    },
                    headers={
                        'User-Agent': random.choice(USER_AGENTS),
                        'Accept': 'text/html,application/xhtml+xml,application/xml',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Referer': response.url,
                        'DNT': '1',
                    }
                )
                
                self.articles_scraped += 1
                
            except Exception as e:
                logger.error(f"Error processing article: {str(e)}")
        
        # Look for pagination or "next page" links
        next_page = response.css('a.page-numbers.next::attr(href), a.next.page-numbers::attr(href)').get()
        if next_page and (not self.article_limit or self.articles_scraped < self.article_limit):
            logger.info(f"Following next page: {next_page}")
            yield scrapy.Request(
                next_page, 
                callback=self.parse,
                headers={
                    'User-Agent': random.choice(USER_AGENTS),
                    'Accept': 'text/html,application/xhtml+xml,application/xml',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Referer': response.url,
                    'DNT': '1',
                }
            )
    
    def parse_article(self, response):
        """Parse the full article page"""
        title = response.meta.get('title')
        date = response.meta.get('date')
        summary = response.meta.get('summary')
        source = response.meta.get('source')
        
        # Different sites have different content selectors
        content_selectors = [
            'div.content-inner p, div.jeg_post_content p, div.jeg_share_top ~ div p',
            'div.entry-content p',
            'div.text p',
            'div.jeg_share_top ~ div p',
            'article p',
            'div.content p, div.post-content p'
        ]
        
        content = ""
        for selector in content_selectors:
            paragraphs = response.css(selector).extract()
            if paragraphs:
                content = ' '.join([p.strip() for p in paragraphs])
                break
        
        # Create a dictionary with the article info
        article_dict = {
            'title': title,
            'url': response.url,
            'date': date,
            'summary': summary,
            'content': content,
            'source': source
        }
        
        logger.info(f"Parsed article content: {title}")
        
        yield article_dict

class NewsScraper:
    """Manager class for running the scrapers and analyzing the results"""
    def __init__(self, cache_file="../Database/NewsData/news_cache.json"):
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
                logger.info(f"Loaded {len(self.articles)} articles from cache")
            except Exception as e:
                logger.error(f"Error loading cache: {str(e)}")
                self.articles = []
        else:
            self.articles = []
    
    def save_cache(self):
        """Save scraped articles to cache"""
        try:
            with open(self.cache_file, 'w') as f:
                json.dump([article.to_dict() for article in self.articles], f, indent=2)
            logger.info(f"Saved {len(self.articles)} articles to cache")
        except Exception as e:
            logger.error(f"Error saving cache: {str(e)}")
    
    def url_exists(self, url):
        """Check if a URL already exists in the articles list"""
        return any(article.url == url for article in self.articles)
    
    def scrape(self, sources=None, article_limit=None):
        """Run the scrapers for all or specified sources"""
        # Create a file to store the scraped articles
        results_file = "../Database/NewsData/scraped_articles.json"
        
        # Set up a crawler process
        settings = get_project_settings()
        settings.update({
            'USER_AGENT': random.choice(USER_AGENTS),
            'ROBOTSTXT_OBEY': True,
            'CONCURRENT_REQUESTS': 1,  # Low concurrency to avoid being detected
            'DOWNLOAD_DELAY': 5,  # 5 second delay between requests
            'RANDOMIZE_DOWNLOAD_DELAY': True,
            'COOKIES_ENABLED': False,  # Disable cookies
            'FEEDS': {
                results_file: {
                    'format': 'json',
                    'overwrite': True,
                },
            },
            'LOG_LEVEL': 'INFO',
            'RETRY_TIMES': 3,
            'RETRY_HTTP_CODES': [500, 502, 503, 504, 408, 403, 429],
        })
        
        process = CrawlerProcess(settings)
        
        # Determine which sources to scrape
        sources_to_scrape = []
        if sources:
            if sources.lower() == "all":
                sources_to_scrape = [s["name"] for s in NEWS_SOURCES]
            else:
                sources_to_scrape = sources.split(",")
        else:
            sources_to_scrape = [NEWS_SOURCES[0]["name"]]  # Default to first source
            
        logger.info(f"Setting up scrapers for: {', '.join(sources_to_scrape)}")
        
        # Set up a spider for each source
        for source in sources_to_scrape:
            process.crawl(
                NewsSpider, 
                source=source, 
                article_limit=article_limit,
                cache_file=self.cache_file
            )
        
        logger.info("Starting scrapers...")
        process.start()  # Blocking operation until crawling is finished
        
        # Load the results
        if os.path.exists(results_file):
            try:
                with open(results_file, 'r') as f:
                    new_articles_data = json.load(f)
                    
                logger.info(f"Loaded {len(new_articles_data)} new articles from scraper")
                
                # Convert to NewsArticle objects and add to the list
                for article_data in new_articles_data:
                    if not self.url_exists(article_data.get('url', '')):
                        article = NewsArticle(
                            title=article_data.get('title', ''),
                            url=article_data.get('url', ''),
                            source=article_data.get('source', ''),
                            date=article_data.get('date', ''),
                            summary=article_data.get('summary', ''),
                            content=article_data.get('content', '')
                        )
                        self.articles.append(article)
                
                # Save to cache
                self.save_cache()
                
            except Exception as e:
                logger.error(f"Error processing scraped articles: {str(e)}")
        else:
            logger.error(f"No results file found at {results_file}")
        
        return self.articles
    
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
        
        logger.info(f"Analyzed {len(self.articles)} articles")
        logger.info(f"Found {sum(1 for article in self.articles if article.lead_potential)} potential leads")

        # Save after analysis
        self.save_cache()
    
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
        logger.info(f"Exported {len(data)} articles to {output_file}")
    
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
        
        logger.info(f"Exported {len(lead_articles)} potential leads to {output_file}")

def main():
    parser = argparse.ArgumentParser(description="Improved Nigerian News Scraper")
    parser.add_argument('--sources', default="all", 
                      help="Comma-separated list of news sources to scrape, or 'all' (default: all)")
    parser.add_argument('--limit', type=int, default=10,
                      help="Maximum number of articles to scrape per source (default: 10)")
    parser.add_argument('--no-analyze', action='store_true',
                      help="Skip article analysis")
    parser.add_argument('--no-export', action='store_true',
                      help="Skip exporting to Excel and markdown")
    
    args = parser.parse_args()
    
    scraper = NewsScraper()
    
    # Run the scrapers
    logger.info("Starting the scraping process...")
    scraper.scrape(sources=args.sources, article_limit=args.limit)
    
    # Analyze the articles
    if not args.no_analyze:
        logger.info("Analyzing articles...")
        scraper.analyze_articles()
    
    # Export the results
    if not args.no_export:
        logger.info("Exporting results...")
        scraper.export_to_excel()
        scraper.export_potential_leads()
    
    logger.info("Scraping completed successfully")

if __name__ == "__main__":
    main() 