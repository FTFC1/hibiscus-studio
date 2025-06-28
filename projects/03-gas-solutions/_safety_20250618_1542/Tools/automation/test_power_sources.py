#!/usr/bin/env python3
"""
Test script for verifying connectivity to the new power sector news sources.
"""

import os
import sys
import time
import requests
from bs4 import BeautifulSoup
import random

# Ensure the Tools directory is in the Python path
script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(script_dir)

# Import user agents function from the crawler
try:
    from power_company_crawler import get_random_user_agent
    print("✅ Successfully imported functions from power_company_crawler.py")
except ImportError as e:
    print(f"❌ Failed to import from power_company_crawler.py: {e}")
    # Define a fallback if the import fails
    def get_random_user_agent():
        user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
        ]
        return random.choice(user_agents)

# List of news sources to test
NEWS_SOURCES = [
    # Original sources
    "https://businessday.ng/",
    # "https://nairametrics.com/", # Removed due to 403 error
    "https://punchng.com/",
    "https://guardian.ng/",
    "https://thenationonlineng.net/",
    "https://thisdaylive.com/",
    
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

def test_connectivity(url):
    """Test connectivity to a URL and check if it can be parsed."""
    print(f"\nTesting: {url}")
    
    headers = {
        "User-Agent": get_random_user_agent(),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive",
    }
    
    try:
        # Try to fetch the URL
        print(f"  Connecting to {url}...")
        start_time = time.time()
        response = requests.get(url, headers=headers, timeout=30)
        elapsed = time.time() - start_time
        
        print(f"  Response time: {elapsed:.2f} seconds")
        print(f"  Status code: {response.status_code}")
        
        if response.status_code == 200:
            print(f"  ✅ Successfully connected to {url}")
            
            # Try to parse the HTML
            try:
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Check for title
                title = soup.title.string.strip() if soup.title else "No title found"
                print(f"  Title: {title}")
                
                # Count links on the page
                links = soup.find_all('a', href=True)
                print(f"  Links found: {len(links)}")
                
                # Try to extract some text content
                paragraphs = soup.find_all('p')
                text_sample = paragraphs[0].get_text().strip() if paragraphs else "No paragraph text found"
                print(f"  Text sample: {text_sample[:100]}...")
                
                print(f"  ✅ Successfully parsed HTML from {url}")
                return True
            except Exception as e:
                print(f"  ❌ Failed to parse HTML from {url}: {e}")
                return False
        else:
            print(f"  ❌ Failed to connect to {url}: Status code {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"  ❌ Failed to connect to {url}: {e}")
        return False

def main():
    """Run tests on all news sources."""
    print("="*80)
    print("Testing connectivity to power sector news sources")
    print("="*80)
    
    successful = 0
    failed = 0
    
    for url in NEWS_SOURCES:
        if test_connectivity(url):
            successful += 1
        else:
            failed += 1
        
        # Add a delay between requests to avoid overwhelming servers
        time.sleep(2)
    
    print("\n"+"="*80)
    print(f"Results: {successful} successful, {failed} failed out of {len(NEWS_SOURCES)} sources")
    print("="*80)
    
    if successful > 0:
        print("\n✅ Some news sources can be accessed and parsed successfully!")
        return 0
    else:
        print("\n❌ All news sources failed. Check internet connection or source URLs.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 