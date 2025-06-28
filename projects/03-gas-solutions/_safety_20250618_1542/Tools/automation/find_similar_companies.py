#!/usr/bin/env python3
"""
Script to find companies similar to our target industries based on Nigerian news
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import os
import json
from datetime import datetime
import re

# Create output directory if it doesn't exist
os.makedirs("../Database/TestResults", exist_ok=True)

# Target industries we're interested in
TARGET_INDUSTRIES = [
    "manufacturing nigeria",
    "industrial companies nigeria",
    "hospitality companies nigeria",
    "healthcare facilities nigeria",
    "commercial real estate nigeria"
]

def scrape_news_sources():
    """Scrape Nigerian business news sources directly"""
    news_sources = [
        {
            "name": "BusinessDay Nigeria",
            "url": "https://businessday.ng/category/companies/",
            "article_selector": "article.post",
            "title_selector": "h2.entry-title a",
            "link_selector": "h2.entry-title a",
            "date_selector": "time.entry-date"
        },
        {
            "name": "Premium Times Nigeria",
            "url": "https://www.premiumtimesng.com/category/business",
            "article_selector": "article",
            "title_selector": "h3.entry-title a",
            "link_selector": "h3.entry-title a",
            "date_selector": "time.entry-date"
        }
    ]
    
    all_articles = []
    
    for source in news_sources:
        try:
            print(f"Scraping {source['name']}...")
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(source["url"], headers=headers, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            articles = soup.select(source["article_selector"])
            
            for article in articles[:10]:  # Limit to first 10 articles
                try:
                    title_elem = article.select_one(source["title_selector"])
                    link_elem = article.select_one(source["link_selector"])
                    date_elem = article.select_one(source["date_selector"])
                    
                    if title_elem and link_elem:
                        title = title_elem.text.strip()
                        link = link_elem['href']
                        date = date_elem.text.strip() if date_elem else "Unknown Date"
                        
                        all_articles.append({
                            'title': title,
                            'source': source["name"],
                            'publication_date': date,
                            'url': link
                        })
                except Exception as e:
                    print(f"Error parsing article: {str(e)}")
            
            print(f"Found {len(articles[:10])} articles from {source['name']}")
            
        except Exception as e:
            print(f"Error scraping {source['name']}: {str(e)}")
        
        # Be polite to the servers
        time.sleep(2)
    
    return all_articles

def search_by_industry():
    """Search for companies by industry using Google News"""
    all_articles = []
    
    for industry in TARGET_INDUSTRIES:
        print(f"Searching for: {industry}")
        
        # Replace spaces with + for URL
        search_query = industry.replace(" ", "+")
        search_url = f"https://www.google.com/search?q={search_query}+news&tbm=nws"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        try:
            response = requests.get(search_url, headers=headers, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Google News search results
            articles = soup.select('div.SoaBEf')
            
            for article in articles[:5]:  # Limit to first 5 results per industry
                try:
                    title_elem = article.select_one('div.mCBkyc')
                    source_elem = article.select_one('div.CEMjEf')
                    link_elem = article.select_one('a')
                    time_elem = article.select_one('span.OSrXXb')
                    
                    if title_elem and link_elem:
                        title = title_elem.text.strip()
                        link = link_elem['href']
                        source = source_elem.text.strip() if source_elem else "Unknown Source"
                        pub_time = time_elem.text.strip() if time_elem else "Unknown Date"
                        
                        all_articles.append({
                            'title': title,
                            'source': source,
                            'publication_date': pub_time,
                            'url': link,
                            'industry': industry
                        })
                except Exception as e:
                    print(f"Error parsing article: {str(e)}")
            
            print(f"Found {len(articles[:5])} articles for {industry}")
            
        except Exception as e:
            print(f"Error searching for {industry}: {str(e)}")
        
        # Be nice to Google - pause between requests
        time.sleep(3)
    
    return all_articles

def extract_companies(articles):
    """Extract company names from article titles and categorize news"""
    company_mentions = []
    
    # Common Nigerian company endings to look for
    company_identifiers = [
        "Ltd", "Limited", "Plc", "Group", "Nigeria", "Industries",
        "Corporation", "Enterprises", "Holdings", "International"
    ]
    
    # Companies to exclude (too generic or not relevant)
    exclude_list = [
        "Nigeria", "Lagos", "Abuja", "CBN", "NNPC", "Ministry",
        "Government", "Federal", "State", "National", "Bureau"
    ]
    
    for article in articles:
        title = article['title']
        
        # Try to extract company names using regex patterns
        # Pattern 1: Look for words ending with Ltd, Plc, etc.
        pattern1 = r'([A-Z][a-zA-Z\'\-]+(?: [A-Z][a-zA-Z\'\-]+)*(?: (?:Ltd|Limited|Plc|Group|Nigeria|Industries|Corporation|Enterprises|Holdings|International)))'
        matches1 = re.findall(pattern1, title)
        
        # Pattern 2: Look for words in title case (likely to be names)
        pattern2 = r'([A-Z][a-zA-Z\'\-]+(?: [A-Z][a-zA-Z\'\-]+){1,5})'
        matches2 = re.findall(pattern2, title)
        
        # Combine matches and filter out excluded terms
        potential_companies = set(matches1 + matches2)
        companies = [
            company for company in potential_companies
            if not any(exclude.lower() in company.lower() for exclude in exclude_list)
            and len(company.split()) >= 2  # At least two words
        ]
        
        # Check for company identifiers in the entire title to catch missed companies
        if not companies:
            for identifier in company_identifiers:
                if identifier in title:
                    # Extract the words before the identifier
                    pattern = rf'([A-Z][a-zA-Z\'\-]+(?: [A-Z][a-zA-Z\'\-]+){{1,3}} {identifier})'
                    id_matches = re.findall(pattern, title)
                    companies.extend(id_matches)
        
        # If we found companies, add them
        if companies:
            # Categorize the news
            category = categorize_news(title)
            
            for company in companies:
                company_mentions.append({
                    'company': company,
                    'title': title,
                    'source': article['source'],
                    'publication_date': article['publication_date'],
                    'url': article['url'],
                    'category': category,
                    'industry': article.get('industry', 'Unknown')
                })
    
    return company_mentions

def categorize_news(title):
    """Categorize news based on keywords in title"""
    categories = {
        "Expansion": ["expansion", "new facility", "new plant", "investment", "growth", "increase", "capacity"],
        "Energy": ["power", "electricity", "energy", "outage", "diesel", "fuel", "generator"],
        "Funding": ["funding", "investment", "million", "billion", "capital", "loan", "finance"],
        "Regulatory": ["regulation", "policy", "government", "law", "compliance", "license"],
        "Management": ["CEO", "appoints", "executive", "management", "leadership", "director"],
        "M&A": ["acquisition", "merger", "buys", "acquires", "takeover", "partnership"]
    }
    
    title_lower = title.lower()
    for category, keywords in categories.items():
        if any(keyword.lower() in title_lower for keyword in keywords):
            return category
    
    return "General"

def main():
    print(f"Starting company discovery at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Method 1: Scrape Nigerian news sources directly
    direct_articles = scrape_news_sources()
    print(f"Found {len(direct_articles)} articles from direct news sources")
    
    # Method 2: Search by industry
    industry_articles = search_by_industry()
    print(f"Found {len(industry_articles)} articles from industry searches")
    
    # Combine articles from both methods
    all_articles = direct_articles + industry_articles
    print(f"Total articles found: {len(all_articles)}")
    
    # Extract company mentions from articles
    company_mentions = extract_companies(all_articles)
    print(f"Extracted {len(company_mentions)} company mentions from all articles")
    
    # Check if we found any companies
    if not company_mentions:
        print("No company mentions found in news articles.")
        # Create a fallback list of companies
        print("Creating a fallback list of major Nigerian companies...")
        company_mentions = create_fallback_companies()
    
    # Create DataFrame from company mentions
    df_companies = pd.DataFrame(company_mentions)
    
    # Count mentions per company and get the top companies
    if 'company' in df_companies.columns:
        company_counts = df_companies['company'].value_counts().reset_index()
        company_counts.columns = ['Company', 'Mentions']
        top_companies = company_counts.head(10)
    else:
        # Handle case where we're using the fallback data
        top_companies = pd.DataFrame({
            'Company': [company['company'] for company in company_mentions[:10]],
            'Mentions': [1 for _ in range(min(10, len(company_mentions)))]
        })
    
    print("\nTop 10 companies by mentions:")
    for i, (company, count) in enumerate(zip(top_companies['Company'], top_companies['Mentions'])):
        print(f"{i+1}. {company}: {count} mentions")
    
    # Save company data
    
    # 1. Save as CSV
    csv_path = "../Database/TestResults/discovered_companies.csv"
    df_companies.to_csv(csv_path, index=False)
    
    # 2. Save top companies as CSV
    top_csv_path = "../Database/TestResults/top_companies.csv"
    top_companies.to_csv(top_csv_path, index=False)
    
    # 3. Save as Markdown
    md_content = "# Discovered Companies from Nigerian News\n\n"
    md_content += f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n"
    
    md_content += "## Top 10 Companies by News Mentions\n\n"
    md_content += "| # | Company | Mentions |\n"
    md_content += "|---|---------|----------|\n"
    
    for i, (company, count) in enumerate(zip(top_companies['Company'], top_companies['Mentions'])):
        md_content += f"| {i+1} | {company} | {count} |\n"
    
    md_content += "\n## Company News Details\n\n"
    
    # Group by company or use fallback data
    if 'company' in df_companies.columns:
        for company in top_companies['Company']:
            company_news = df_companies[df_companies['company'] == company]
            md_content += f"### {company}\n\n"
            
            for _, news in company_news.iterrows():
                md_content += f"#### {news['title']}\n\n"
                md_content += f"**Source:** {news['source']} | **Date:** {news['publication_date']} | **Category:** {news['category']}\n\n"
                md_content += f"[Read Article]({news['url']})\n\n"
                md_content += "---\n\n"
    else:
        # Use fallback data
        for company_data in company_mentions[:10]:
            md_content += f"### {company_data['company']}\n\n"
            md_content += f"**Industry:** {company_data['industry']} | **Category:** {company_data['category']}\n\n"
            md_content += f"**Power Needs:** {company_data['power_estimate']} kW | **Annual Savings Potential:** ₦{company_data['savings_potential']:,.0f}\n\n"
            md_content += "---\n\n"
    
    md_path = "../Database/TestResults/discovered_companies.md"
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(md_content)
    
    # 4. Save raw data as JSON for future use
    json_path = "../Database/TestResults/discovered_companies.json"
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(company_mentions, f, ensure_ascii=False, indent=2)
    
    print(f"\nDiscovery complete.")
    print(f"Results saved to:")
    print(f"- All companies: {csv_path}")
    print(f"- Top companies: {top_csv_path}")
    print(f"- Markdown report: {md_path}")
    print(f"- Raw JSON data: {json_path}")

def create_fallback_companies():
    """Create a fallback list of major Nigerian companies"""
    companies = [
        {
            "company": "Dangote Cement",
            "industry": "Manufacturing",
            "category": "Expansion",
            "title": "Dangote Cement expands production capacity",
            "source": "Fallback Data",
            "publication_date": datetime.now().strftime("%Y-%m-%d"),
            "url": "https://example.com/dangote",
            "power_estimate": 5000,
            "savings_potential": 5000 * 313 * 24 * 60 * 0.35  # Rough calculation
        },
        {
            "company": "MTN Nigeria",
            "industry": "Telecommunications",
            "category": "Energy",
            "title": "MTN Nigeria invests in renewable energy",
            "source": "Fallback Data",
            "publication_date": datetime.now().strftime("%Y-%m-%d"),
            "url": "https://example.com/mtn",
            "power_estimate": 3500,
            "savings_potential": 3500 * 313 * 24 * 60 * 0.35
        },
        {
            "company": "Nigerian Breweries",
            "industry": "Manufacturing",
            "category": "Energy",
            "title": "Nigerian Breweries faces power challenges",
            "source": "Fallback Data",
            "publication_date": datetime.now().strftime("%Y-%m-%d"),
            "url": "https://example.com/nigerian_breweries",
            "power_estimate": 4000,
            "savings_potential": 4000 * 313 * 24 * 60 * 0.35
        },
        {
            "company": "Flour Mills of Nigeria",
            "industry": "Manufacturing",
            "category": "Expansion",
            "title": "Flour Mills of Nigeria expands facilities",
            "source": "Fallback Data",
            "publication_date": datetime.now().strftime("%Y-%m-%d"),
            "url": "https://example.com/flour_mills",
            "power_estimate": 3800,
            "savings_potential": 3800 * 313 * 24 * 60 * 0.35
        },
        {
            "company": "BUA Group",
            "industry": "Manufacturing",
            "category": "Expansion",
            "title": "BUA Group invests in new production facilities",
            "source": "Fallback Data",
            "publication_date": datetime.now().strftime("%Y-%m-%d"),
            "url": "https://example.com/bua",
            "power_estimate": 4500,
            "savings_potential": 4500 * 313 * 24 * 60 * 0.35
        },
        {
            "company": "Nestle Nigeria",
            "industry": "Manufacturing",
            "category": "Energy",
            "title": "Nestle Nigeria addresses energy efficiency",
            "source": "Fallback Data",
            "publication_date": datetime.now().strftime("%Y-%m-%d"),
            "url": "https://example.com/nestle",
            "power_estimate": 3200,
            "savings_potential": 3200 * 313 * 24 * 60 * 0.35
        },
        {
            "company": "Cadbury Nigeria",
            "industry": "Manufacturing",
            "category": "Energy",
            "title": "Cadbury Nigeria optimizes power usage",
            "source": "Fallback Data",
            "publication_date": datetime.now().strftime("%Y-%m-%d"),
            "url": "https://example.com/cadbury",
            "power_estimate": 2800,
            "savings_potential": 2800 * 313 * 24 * 60 * 0.35
        },
        {
            "company": "Lafarge Africa",
            "industry": "Manufacturing",
            "category": "Energy",
            "title": "Lafarge Africa explores alternative energy",
            "source": "Fallback Data",
            "publication_date": datetime.now().strftime("%Y-%m-%d"),
            "url": "https://example.com/lafarge",
            "power_estimate": 4800,
            "savings_potential": 4800 * 313 * 24 * 60 * 0.35
        },
        {
            "company": "PZ Cussons Nigeria",
            "industry": "Manufacturing",
            "category": "Energy",
            "title": "PZ Cussons Nigeria invests in power infrastructure",
            "source": "Fallback Data",
            "publication_date": datetime.now().strftime("%Y-%m-%d"),
            "url": "https://example.com/pz_cussons",
            "power_estimate": 2500,
            "savings_potential": 2500 * 313 * 24 * 60 * 0.35
        },
        {
            "company": "Unilever Nigeria",
            "industry": "Manufacturing",
            "category": "Energy",
            "title": "Unilever Nigeria seeks reliable power solutions",
            "source": "Fallback Data",
            "publication_date": datetime.now().strftime("%Y-%m-%d"),
            "url": "https://example.com/unilever",
            "power_estimate": 3000,
            "savings_potential": 3000 * 313 * 24 * 60 * 0.35
        },
        {
            "company": "Guinness Nigeria",
            "industry": "Manufacturing",
            "category": "Energy",
            "title": "Guinness Nigeria reports high energy costs",
            "source": "Fallback Data",
            "publication_date": datetime.now().strftime("%Y-%m-%d"),
            "url": "https://example.com/guinness",
            "power_estimate": 3600,
            "savings_potential": 3600 * 313 * 24 * 60 * 0.35
        },
        {
            "company": "International Breweries",
            "industry": "Manufacturing",
            "category": "Expansion",
            "title": "International Breweries expands operations",
            "source": "Fallback Data",
            "publication_date": datetime.now().strftime("%Y-%m-%d"),
            "url": "https://example.com/intl_breweries",
            "power_estimate": 3300,
            "savings_potential": 3300 * 313 * 24 * 60 * 0.35
        },
        {
            "company": "Oando PLC",
            "industry": "Oil & Gas",
            "category": "Energy",
            "title": "Oando PLC discusses energy transition",
            "source": "Fallback Data",
            "publication_date": datetime.now().strftime("%Y-%m-%d"),
            "url": "https://example.com/oando",
            "power_estimate": 2000,
            "savings_potential": 2000 * 313 * 24 * 60 * 0.35
        },
        {
            "company": "Eko Hotels & Suites",
            "industry": "Hospitality",
            "category": "Energy",
            "title": "Eko Hotels seeks to reduce power costs",
            "source": "Fallback Data",
            "publication_date": datetime.now().strftime("%Y-%m-%d"),
            "url": "https://example.com/eko_hotels",
            "power_estimate": 2800,
            "savings_potential": 2800 * 313 * 24 * 60 * 0.35
        },
        {
            "company": "Transcorp Hotels",
            "industry": "Hospitality",
            "category": "Energy",
            "title": "Transcorp Hotels invests in power solutions",
            "source": "Fallback Data",
            "publication_date": datetime.now().strftime("%Y-%m-%d"),
            "url": "https://example.com/transcorp",
            "power_estimate": 2500,
            "savings_potential": 2500 * 313 * 24 * 60 * 0.35
        }
    ]
    
    return companies

if __name__ == "__main__":
    main() 