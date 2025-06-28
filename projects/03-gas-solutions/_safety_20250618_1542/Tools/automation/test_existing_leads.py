#!/usr/bin/env python3
"""
Test script to find news about companies in the existing Gas Leads file
"""

import pandas as pd
import requests
from bs4 import BeautifulSoup
import time
import re
import os
import json
from datetime import datetime

# Create output directory if it doesn't exist
os.makedirs("../Database/TestResults", exist_ok=True)

def load_gas_leads():
    """Load the existing Gas Leads Excel file"""
    try:
        file_path = "../Database/Gas Leads.xlsx"
        df = pd.read_excel(file_path)
        print(f"Loaded {len(df)} leads from {file_path}")
        
        # Extract company names - adjust column name if needed
        if 'Client' in df.columns:
            companies = df['Client'].dropna().tolist()
        elif 'Company Name' in df.columns:
            companies = df['Company Name'].dropna().tolist()
        else:
            # Try to find a column that might contain company names
            possible_cols = ['Company', 'Name', 'Business']
            for col in possible_cols:
                if col in df.columns:
                    companies = df[col].dropna().tolist()
                    break
            else:
                print("Could not identify company name column in the Excel file")
                companies = []
        
        # Clean company names
        companies = [str(company).strip() for company in companies]
        return companies
    except Exception as e:
        print(f"Error loading file: {str(e)}")
        return []

def search_for_news(company_name):
    """Search for news about a company"""
    # Replace spaces with + for URL
    search_query = company_name.replace(" ", "+")
    search_url = f"https://www.google.com/search?q={search_query}+nigeria+news&tbm=nws"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(search_url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        news_results = []
        # Google News search results
        articles = soup.select('div.SoaBEf')
        
        for article in articles[:3]:  # Limit to first 3 results
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
                    
                    news_results.append({
                        'title': title,
                        'source': source,
                        'publication_date': pub_time,
                        'url': link,
                        'company': company_name
                    })
            except Exception as e:
                print(f"Error parsing article: {str(e)}")
        
        return news_results
    
    except Exception as e:
        print(f"Error searching for {company_name}: {str(e)}")
        return []

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
    print(f"Starting news search for existing leads at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Load companies from Gas Leads
    companies = load_gas_leads()
    
    if not companies:
        print("No companies found to search for.")
        return
    
    print(f"Found {len(companies)} companies to search for.")
    
    # Search for news about each company
    all_news = []
    for i, company in enumerate(companies):
        print(f"[{i+1}/{len(companies)}] Searching for news about: {company}")
        news_results = search_for_news(company)
        
        # Add category to each news item
        for news in news_results:
            news['category'] = categorize_news(news['title'])
        
        all_news.extend(news_results)
        print(f"Found {len(news_results)} news items")
        
        # Be nice to Google - pause between requests
        if i < len(companies) - 1:  # Don't sleep after the last company
            time.sleep(3)
    
    # Create a DataFrame from the news
    df_news = pd.DataFrame(all_news)
    
    # Save as CSV
    csv_path = "../Database/TestResults/existing_leads_news.csv"
    df_news.to_csv(csv_path, index=False)
    
    # Save as Markdown
    md_content = "# News for Existing Leads\n\n"
    md_content += f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n"
    
    # Group by company
    for company in sorted(df_news['company'].unique()):
        company_news = df_news[df_news['company'] == company]
        md_content += f"## {company}\n\n"
        
        if company_news.empty:
            md_content += "No news found.\n\n"
        else:
            for _, news in company_news.iterrows():
                md_content += f"### {news['title']}\n\n"
                md_content += f"**Source:** {news['source']} | **Date:** {news['publication_date']} | **Category:** {news['category']}\n\n"
                md_content += f"[Read Article]({news['url']})\n\n"
                md_content += "---\n\n"
    
    md_path = "../Database/TestResults/existing_leads_news.md"
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(md_content)
    
    # Save as JSON for potential later use
    json_path = "../Database/TestResults/existing_leads_news.json"
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(all_news, f, ensure_ascii=False, indent=2)
    
    print(f"\nSearch complete. Found {len(all_news)} news items for {len(companies)} companies.")
    print(f"Results saved to:")
    print(f"- CSV: {csv_path}")
    print(f"- Markdown: {md_path}")
    print(f"- JSON: {json_path}")

if __name__ == "__main__":
    main() 