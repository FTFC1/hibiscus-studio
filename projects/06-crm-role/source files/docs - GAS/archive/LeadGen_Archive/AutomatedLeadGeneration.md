# Automated Lead Generation System

## System Architecture

This document outlines a practical system for automating the IPP lead generation process using Python scripts and web APIs. The goal is to create a solution that can run locally on your machine while delivering immediate results.

```
┌─────────────────┐     ┌───────────────┐     ┌──────────────────┐
│  News Sources   │────▶│ Python Script │────▶│ Google Sheet DB  │
└─────────────────┘     └───────────────┘     └──────────────────┘
        │                      │                       │
        │                      │                       │
        ▼                      ▼                       ▼
┌─────────────────┐     ┌───────────────┐     ┌──────────────────┐
│   Company Data  │────▶│  Email Draft  │────▶│  Activity Logger │
└─────────────────┘     └───────────────┘     └──────────────────┘
```

## Tech Stack

1. **Python** - Core automation language
   - Beautiful Soup (web scraping)
   - Pandas (data manipulation)
   - gspread (Google Sheets API)
   - requests (API calls)

2. **Google Sheets** - Data storage and visualization
   - Simplified structure (3 tabs only)
   - API access for automated updates

3. **Gmail API** - Email automation
   - Template-based personalization
   - Scheduling and tracking

## Core Scripts

### 1. News Scraper (`news_scraper.py`)

```python
import requests
from bs4 import BeautifulSoup
import pandas as pd
import datetime
import re

# News sources configuration
sources = [
    {
        "name": "BusinessDay Nigeria",
        "url": "https://businessday.ng/category/companies/",
        "article_selector": "article.post",
        "title_selector": "h2.entry-title a",
        "date_selector": "time.entry-date"
    },
    # Add more sources here
]

def scrape_news():
    """Scrape news from Nigerian business publications"""
    all_articles = []
    
    for source in sources:
        try:
            response = requests.get(source["url"], timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            articles = soup.select(source["article_selector"])
            
            for article in articles:
                title = article.select_one(source["title_selector"]).text.strip()
                url = article.select_one(source["title_selector"])['href']
                date = article.select_one(source["date_selector"]).text.strip()
                
                # Process article to extract companies and categorize
                companies = extract_companies(title)
                category = categorize_news(title)
                
                if companies and category:
                    all_articles.append({
                        "source": source["name"],
                        "title": title,
                        "url": url,
                        "date": date,
                        "companies": companies,
                        "category": category
                    })
        except Exception as e:
            print(f"Error scraping {source['name']}: {str(e)}")
            
    return all_articles

def extract_companies(title):
    """Extract company names from title using regex and known company list"""
    # Implementation depends on a database of Nigerian companies
    # This is a placeholder
    return []

def categorize_news(title):
    """Categorize news based on keywords in title"""
    categories = {
        "Expansion": ["expansion", "new facility", "new plant", "investment", "growth"],
        "Energy": ["power", "electricity", "energy", "outage", "diesel", "fuel"],
        "Funding": ["funding", "investment", "million", "billion", "capital"],
        "Regulatory": ["regulation", "policy", "government", "law", "compliance"],
        "Management": ["CEO", "appoints", "executive", "management", "leadership"],
        "M&A": ["acquisition", "merger", "buys", "acquires", "takeover"]
    }
    
    for category, keywords in categories.items():
        if any(keyword.lower() in title.lower() for keyword in keywords):
            return category
    
    return None

if __name__ == "__main__":
    articles = scrape_news()
    df = pd.DataFrame(articles)
    
    # Save to CSV for now (will integrate with Google Sheets later)
    df.to_csv(f"news_{datetime.date.today().strftime('%Y%m%d')}.csv", index=False)
    
    print(f"Scraped {len(articles)} relevant news articles")
```

### 2. Company Researcher (`company_researcher.py`)

```python
import pandas as pd
import requests
import re
import time
from bs4 import BeautifulSoup

def research_company(company_name):
    """Research basic company information"""
    company_data = {
        "name": company_name,
        "website": find_company_website(company_name),
        "industry": "",
        "size": "",
        "location": "",
        "power_estimate": 0
    }
    
    # If website found, extract more data
    if company_data["website"]:
        company_data.update(extract_company_data(company_data["website"]))
    
    # Estimate power requirements based on industry and size
    company_data["power_estimate"] = estimate_power_needs(
        company_data["industry"], 
        company_data["size"]
    )
    
    return company_data

def find_company_website(company_name):
    """Search for company website using a search engine"""
    # Implementation using a search API
    return ""

def extract_company_data(website_url):
    """Extract company data from their website"""
    # Implementation using BeautifulSoup
    return {
        "industry": "",
        "size": "",
        "location": ""
    }

def estimate_power_needs(industry, size):
    """Estimate power requirements based on industry benchmarks"""
    industry_benchmarks = {
        "Manufacturing": {
            "Small": 500,
            "Medium": 2000,
            "Large": 5000
        },
        "Hospitality": {
            "Small": 300,
            "Medium": 1000,
            "Large": 3000
        },
        # Add more industries
    }
    
    if industry in industry_benchmarks and size in industry_benchmarks[industry]:
        return industry_benchmarks[industry][size]
    
    return 0

if __name__ == "__main__":
    # Load companies from news scraper output
    news_df = pd.read_csv("news_20231001.csv")  # Example date
    
    companies = []
    for company_list in news_df["companies"].dropna():
        companies.extend(eval(company_list))
    
    # Remove duplicates
    companies = list(set(companies))
    
    # Research each company
    company_data = []
    for company in companies:
        print(f"Researching {company}...")
        data = research_company(company)
        company_data.append(data)
        time.sleep(2)  # Be nice to websites
    
    # Save results
    pd.DataFrame(company_data).to_csv("researched_companies.csv", index=False)
```

### 3. Google Sheet Connector (`sheets_connector.py`)

```python
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import pandas as pd
import datetime

def connect_to_sheets():
    """Connect to Google Sheets API"""
    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
    creds = ServiceAccountCredentials.from_json_keyfile_name("credentials.json", scope)
    client = gspread.authorize(creds)
    
    return client

def update_leads_sheet(client, companies_df):
    """Update the Leads tab with new companies"""
    sheet = client.open("Mikano IPP Pipeline").worksheet("Leads")
    
    # Get existing company IDs to avoid duplicates
    existing_data = sheet.get_all_records()
    existing_companies = {record["Company Name"] for record in existing_data}
    
    # Filter out existing companies
    new_companies = companies_df[~companies_df["name"].isin(existing_companies)]
    
    if new_companies.empty:
        print("No new companies to add")
        return
    
    # Generate new IDs
    last_id = 0
    if existing_data:
        last_id = max([int(record["Company ID"].replace("MIK", "")) for record in existing_data])
    
    # Prepare new records
    new_records = []
    for _, company in new_companies.iterrows():
        last_id += 1
        new_records.append([
            f"MIK{last_id:03d}",  # Company ID
            company["name"],
            company["industry"],
            company["location"],
            "",  # Address
            "Unknown",  # Gas Availability
            company["size"],
            company["power_estimate"],
            "Industry Average",  # Est. Basis
            "",  # Current IPP Provider
            "News",  # Lead Source
            "",  # News Trigger
            datetime.date.today().strftime("%Y-%m-%d"),  # News Date
            "",  # News URL
            "3",  # Priority Score
            "New",  # Status
            "",  # Last Activity Date
            "",  # Last Activity Type
            "",  # Decision Makers
            "",  # Notes
            "Research and identify decision makers",  # Next Steps
            (datetime.date.today() + datetime.timedelta(days=2)).strftime("%Y-%m-%d"),  # Next Steps Due
            "Script",  # Created By
            datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),  # Created Date
            datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Modified Date
        ])
    
    # Add new rows
    sheet.append_rows(new_records)
    print(f"Added {len(new_records)} new companies to the Leads sheet")

def update_news_sheet(client, news_df):
    """Update the News Triggers tab with new articles"""
    sheet = client.open("Mikano IPP Pipeline").worksheet("News Triggers")
    
    # Get existing URLs to avoid duplicates
    existing_data = sheet.get_all_records()
    existing_urls = {record["URL"] for record in existing_data}
    
    # Filter out existing news
    new_news = news_df[~news_df["url"].isin(existing_urls)]
    
    if new_news.empty:
        print("No new news articles to add")
        return
    
    # Generate new IDs
    last_id = 0
    if existing_data:
        last_id = max([int(record["News ID"].replace("NEWS", "")) for record in existing_data])
    
    # Prepare new records
    new_records = []
    for _, article in new_news.iterrows():
        last_id += 1
        new_records.append([
            f"NEWS{last_id:03d}",  # News ID
            article["date"],
            article["source"],
            article["url"],
            article["title"],
            article["category"],
            str(article["companies"]),  # Convert list to string
            "",  # Lead IDs
            "3",  # Relevance Score
            "",  # Summary
            "No Action",  # Action Taken
            "",  # Action Date
            "Script",  # Created By
            datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Created Date
        ])
    
    # Add new rows
    sheet.append_rows(new_records)
    print(f"Added {len(new_records)} new articles to the News Triggers sheet")

if __name__ == "__main__":
    client = connect_to_sheets()
    
    # Update leads
    companies_df = pd.read_csv("researched_companies.csv")
    update_leads_sheet(client, companies_df)
    
    # Update news
    news_df = pd.read_csv(f"news_{datetime.date.today().strftime('%Y%m%d')}.csv")
    update_news_sheet(client, news_df)
```

### 4. Email Generator (`email_generator.py`)

```python
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import pandas as pd
import datetime
import re
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def connect_to_sheets():
    """Connect to Google Sheets API"""
    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
    creds = ServiceAccountCredentials.from_json_keyfile_name("credentials.json", scope)
    client = gspread.authorize(creds)
    
    return client

def generate_email_content(company, news_item=None, template_type="general"):
    """Generate email content based on company data and news if available"""
    templates = {
        "expansion": """
Dear [Name],

I recently read in {source} about {company}'s plans to {expansion_detail}. Congratulations on this significant growth milestone.

For {industry} facilities in {location}, power infrastructure often becomes a critical challenge during expansion, typically adding 15-20% to project costs and causing delays in commissioning.

Mikano has developed an Independent Power Plant solution that requires:
• Zero capital investment from your company
• No operational management burden
• 35% lower energy costs than grid + generator backup
• 27% increased production uptime

We recently implemented a similar solution for a comparable {industry} company, allowing them to commission their new facility on schedule while avoiding significant power infrastructure costs.

Would you be open to a 15-minute discussion about how this approach might benefit your expansion project?

Regards,

Nicholas Folarin-Coker
Mikano International
""",
        "general": """
Dear [Name],

I'm reaching out regarding {company}'s power infrastructure in {location}.

Companies in the {industry} sector typically face significant challenges with power reliability and costs in Nigeria, often losing 15-22% in production efficiency and facing 30-40% higher energy costs due to instability.

Mikano has developed an Independent Power Plant solution specifically for {industry} companies that:
• Requires zero capital investment
• Reduces energy costs by approximately 35%
• Increases production uptime by 27%
• Eliminates operational burden of power management

Would you be open to a brief conversation about how this approach might benefit {company}?

Regards,

Nicholas Folarin-Coker
Mikano International
"""
    }
    
    template = templates.get(template_type, templates["general"])
    
    # Personalize template
    email_content = template.format(
        company=company["Company Name"],
        industry=company["Industry"] or "your industry",
        location=company["Region"] or "Nigeria",
        source=news_item["source"] if news_item else "recent news",
        expansion_detail="expand operations" if news_item else "grow your business"
    )
    
    return email_content

def generate_subject_line(company, news_item=None, template_type="general"):
    """Generate email subject line"""
    subjects = {
        "expansion": "Power your new facility with zero capital investment",
        "energy": "Addressing power challenges for {company}",
        "funding": "Protect your investment with reliable power infrastructure",
        "regulatory": "New opportunities for {company} from recent regulations",
        "general": "Reliable power solution for {company} - 35% cost reduction"
    }
    
    subject_template = subjects.get(template_type, subjects["general"])
    
    return subject_template.format(company=company["Company Name"])

def send_email(to_email, subject, content):
    """Send email using SMTP"""
    # This is a placeholder - in production would use Gmail API or similar
    print(f"Would send email to {to_email}:")
    print(f"Subject: {subject}")
    print(content)
    print("---")
    
    # Return True if successful
    return True

def log_email_activity(client, company_id, email_content, subject):
    """Log email activity in the Activity tab"""
    sheet = client.open("Mikano IPP Pipeline").worksheet("Activity")
    
    # Get last activity ID
    existing_data = sheet.get_all_records()
    last_id = 0
    if existing_data:
        last_id = max([int(record["Activity ID"].replace("ACT", "")) for record in existing_data])
    
    # Create new activity record
    new_activity = [
        f"ACT{last_id+1:03d}",  # Activity ID
        datetime.date.today().strftime("%Y-%m-%d"),  # Date
        company_id,  # Company ID
        "",  # Company Name - will be filled by formula
        "[Decision Maker]",  # Contact Person
        "",  # Role/Title
        "Email",  # Activity Type
        "Initial Outreach",  # Activity Trigger
        "Initial outreach email sent",  # Summary
        "Awaiting Response",  # Outcomes
        "Follow up in 5 days if no response",  # Next Steps
        (datetime.date.today() + datetime.timedelta(days=5)).strftime("%Y-%m-%d"),  # Follow-up Date
        "Script",  # Created By
        datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Created Date
    ]
    
    # Add new activity
    sheet.append_row(new_activity)
    print(f"Logged email activity for company {company_id}")

if __name__ == "__main__":
    client = connect_to_sheets()
    
    # Get leads that need outreach
    leads_sheet = client.open("Mikano IPP Pipeline").worksheet("Leads")
    leads = pd.DataFrame(leads_sheet.get_all_records())
    
    # Filter for leads in "New" status with decision makers identified
    leads_for_outreach = leads[
        (leads["Status"] == "New") & 
        (leads["Decision Makers"] != "") &
        (leads["Next Steps Due"] <= datetime.date.today().strftime("%Y-%m-%d"))
    ]
    
    if leads_for_outreach.empty:
        print("No leads ready for outreach")
        exit()
    
    # Get news triggers for context
    news_sheet = client.open("Mikano IPP Pipeline").worksheet("News Triggers")
    news = pd.DataFrame(news_sheet.get_all_records())
    
    # Process each lead
    for _, lead in leads_for_outreach.iterrows():
        print(f"Generating email for {lead['Company Name']}...")
        
        # Find related news if available
        related_news = None
        if lead["News Trigger"]:
            related_news = news[news["News ID"] == lead["News Trigger"]].iloc[0] if not news[news["News ID"] == lead["News Trigger"]].empty else None
        
        # Determine template type
        template_type = "general"
        if related_news is not None:
            template_type = related_news["Category"].lower() if related_news["Category"] else "general"
        
        # Generate email
        email_content = generate_email_content(lead, related_news, template_type)
        subject = generate_subject_line(lead, related_news, template_type)
        
        # Send email (would need decision maker email here)
        to_email = "decision_maker@example.com"  # Placeholder
        if send_email(to_email, subject, email_content):
            # Log activity
            log_email_activity(client, lead["Company ID"], email_content, subject)
            
            # Update lead status
            lead_row = leads_sheet.find(lead["Company ID"]).row
            leads_sheet.update_cell(lead_row, leads.columns.get_loc("Status") + 1, "Contacted")
            leads_sheet.update_cell(lead_row, leads.columns.get_loc("Last Activity Date") + 1, datetime.date.today().strftime("%Y-%m-%d"))
            leads_sheet.update_cell(lead_row, leads.columns.get_loc("Last Activity Type") + 1, "Email")
```

### 5. Master Script (`run_lead_generation.py`)

```python
import subprocess
import datetime
import time

def run_step(script, message):
    """Run a Python script and log results"""
    print(f"\n{'='*50}")
    print(f"STEP: {message}")
    print(f"{'='*50}")
    
    start_time = time.time()
    result = subprocess.run(["python", script], capture_output=True, text=True)
    end_time = time.time()
    
    print(result.stdout)
    
    if result.returncode != 0:
        print("ERROR:")
        print(result.stderr)
        return False
    
    print(f"Completed in {end_time - start_time:.2f} seconds")
    return True

if __name__ == "__main__":
    print(f"Starting automated lead generation process at {datetime.datetime.now()}")
    
    # Step 1: Scrape news
    if not run_step("news_scraper.py", "Scraping news from Nigerian business publications"):
        print("News scraping failed, stopping process")
        exit(1)
    
    # Step 2: Research companies
    if not run_step("company_researcher.py", "Researching companies mentioned in news"):
        print("Company research failed, stopping process")
        exit(1)
    
    # Step 3: Update Google Sheets
    if not run_step("sheets_connector.py", "Updating Google Sheets with new data"):
        print("Sheet update failed, stopping process")
        exit(1)
    
    # Step 4: Generate and send emails
    if not run_step("email_generator.py", "Generating and sending emails"):
        print("Email generation failed, stopping process")
        exit(1)
    
    print(f"\nLead generation process completed successfully at {datetime.datetime.now()}")
```

## Simplified Google Sheet Structure

The Google Sheet structure has been simplified to three essential tabs:

### 1. Leads Tab
Essential columns only:
- Company ID
- Company Name
- Industry
- Region
- Power Est. (kW)
- Lead Source
- Status
- Decision Makers
- Next Steps
- Next Steps Due

### 2. Activity Tab
Streamlined columns:
- Activity ID
- Date
- Company ID
- Activity Type (Email, Call, Meeting)
- Summary
- Next Steps
- Follow-up Date

### 3. News Triggers Tab
Key columns only:
- News ID
- Date
- Source
- Headline
- Category
- Companies Mentioned
- Action Taken

## Immediate Value Enhancement

To provide immediate value from the existing Gas Leads Excel file, we'll:

1. **Enrich the existing data** with:
   - Industry benchmarks for power consumption
   - Estimated cost savings with IPP solution
   - Decision-maker contact information (from LinkedIn/web research)
   - Competitor information

2. **Create a visual dashboard** showing:
   - Geographic distribution of leads
   - Power requirement breakdown by industry
   - Prioritized leads based on potential value
   - Timeline of outreach activities

## Implementation Timeline

### Day 1: Setup & Import
- Set up Python environment with required libraries
- Create Google Sheet with simplified structure
- Import and clean existing Gas Leads data

### Day 2-3: Core Scripts
- Build and test news scraper script
- Implement company research functionality
- Create Google Sheets connector

### Day 4-5: Email System & Integration
- Build email generation scripts
- Create master orchestration script
- Test full process with small sample

### Week 2: Enhancements
- Add additional news sources
- Improve company research depth
- Implement email tracking
- Build reporting dashboard

## Next Steps for Automation

Once the Python scripts are working reliably, we can explore:
1. Setting up scheduled runs (e.g., using cron jobs)
2. Adding a simple UI using Flask or Streamlit
3. Implementing Claude's MCP for more advanced reasoning 