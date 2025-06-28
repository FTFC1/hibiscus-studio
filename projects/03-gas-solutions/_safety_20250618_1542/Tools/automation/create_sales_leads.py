#!/usr/bin/env python3
"""
Create sales-focused lead sheets for the Mikano IPP sales team.
This script takes the enriched leads database and creates sales materials
with contact templates, ROI calculators, and regional assignments.
"""

import os
import json
import pandas as pd
import numpy as np
from datetime import datetime
import argparse

def create_directory_if_not_exists(directory):
    """Create a directory if it doesn't already exist."""
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"Created directory: {directory}")

def load_lead_database(file_path):
    """Load the enriched lead database from JSON or Excel."""
    if file_path.endswith('.json'):
        with open(file_path, 'r') as f:
            data = json.load(f)
        leads_df = pd.DataFrame(data)
    elif file_path.endswith(('.xlsx', '.xls')):
        leads_df = pd.read_excel(file_path)
    elif file_path.endswith('.csv'):
        leads_df = pd.read_csv(file_path)
    else:
        raise ValueError("Unsupported file format. Please provide JSON, Excel, or CSV.")
    
    print(f"Loaded {len(leads_df)} leads from {file_path}")
    return leads_df

def load_news_data(file_path=None):
    """Load news data from NewsAPI cache if available."""
    if not file_path:
        file_path = "../Database/NewsData/newsapi_cache.json"
    
    if not os.path.exists(file_path):
        print(f"No news data found at {file_path}")
        return []
    
    try:
        with open(file_path, 'r') as f:
            news_data = json.load(f)
        print(f"Loaded {len(news_data)} news articles")
        return news_data
    except Exception as e:
        print(f"Error loading news data: {str(e)}")
        return []

def find_company_news(company_name, news_data):
    """Find news articles mentioning a specific company."""
    company_name_lower = company_name.lower()
    
    # Handle special cases like "CBN (Printing & Minting)"
    if "(" in company_name:
        company_name_parts = company_name.split("(")
        company_name_lower = company_name_parts[0].lower().strip()
        
    company_news = []
    
    for article in news_data:
        title = article.get('title', '').lower()
        description = article.get('description', '').lower() if article.get('description') else ''
        content = article.get('content', '').lower() if article.get('content') else ''
        companies = [c.lower() for c in article.get('companies_mentioned', [])]
        
        if (company_name_lower in title or 
            company_name_lower in description or 
            company_name_lower in content or
            company_name_lower in companies):
            company_news.append(article)
    
    return company_news

def create_sales_sheets(leads_df, output_dir):
    """Create sales sheets organized by priority and region."""
    # Create subdirectories
    priority_dir = os.path.join(output_dir, "By_Priority")
    region_dir = os.path.join(output_dir, "By_Region")
    industry_dir = os.path.join(output_dir, "By_Industry")
    
    create_directory_if_not_exists(priority_dir)
    create_directory_if_not_exists(region_dir)
    create_directory_if_not_exists(industry_dir)
    
    # Generate by priority
    priority_values = leads_df['Priority'].dropna().unique()
    for priority in sorted(priority_values):
        priority_leads = leads_df[leads_df['Priority'] == priority]
        priority_file = os.path.join(priority_dir, f"Priority_{priority}_Leads.xlsx")
        priority_leads.to_excel(priority_file, index=False)
        print(f"Created priority sheet for {priority}: {len(priority_leads)} leads")
    
    # Generate by region
    region_values = leads_df['Region'].dropna().unique()
    for region in sorted(region_values):
        region_leads = leads_df[leads_df['Region'] == region]
        region_file = os.path.join(region_dir, f"{region}_Leads.xlsx")
        region_leads.to_excel(region_file, index=False)
        print(f"Created region sheet for {region}: {len(region_leads)} leads")
    
    # Generate by industry
    industry_values = leads_df['Industry'].dropna().unique()
    for industry in sorted(industry_values):
        industry_leads = leads_df[leads_df['Industry'] == industry]
        industry_file = os.path.join(industry_dir, f"{industry}_Leads.xlsx")
        industry_leads.to_excel(industry_file, index=False)
        print(f"Created industry sheet for {industry}: {len(industry_leads)} leads")
    
    # Create a combined priority A & B sheet
    high_priority_leads = leads_df[leads_df['Priority'].isin(['A', 'B'])]
    high_priority_file = os.path.join(priority_dir, "High_Priority_Leads.xlsx")
    high_priority_leads.to_excel(high_priority_file, index=False)
    print(f"Created high priority sheet: {len(high_priority_leads)} leads")
    
    return priority_dir, region_dir, industry_dir

def create_sales_templates(leads_df, output_dir, news_data=None):
    """Create individual sales templates for each lead."""
    templates_dir = os.path.join(output_dir, "Sales_Templates")
    create_directory_if_not_exists(templates_dir)
    
    # Create a template for each lead
    for idx, lead in leads_df.iterrows():
        lead_id = lead.get('Lead ID', f"LEAD{idx+1}")
        client = lead.get('CLIENT', 'Unknown').replace('/', '_')
        location = lead.get('LOCATION', 'Unknown')
        
        # Create a directory for each lead
        lead_dir = os.path.join(templates_dir, f"{lead_id}_{client}")
        create_directory_if_not_exists(lead_dir)
        
        # Create a lead profile markdown file
        profile_path = os.path.join(lead_dir, "Lead_Profile.md")
        
        # Calculate ROI information
        power_size = lead.get('Size (MW)', 0)
        annual_cost = lead.get('Annual Power Cost', 0)
        potential_savings = lead.get('Potential Annual Savings', 0)
        payback_period = "N/A"
        
        if potential_savings and potential_savings > 0:
            # Assuming capex of $1M per MW
            capex = power_size * 1000000 * 950  # Convert to Naira at approx 950 NGN/USD
            payback_period = f"{capex / potential_savings:.1f} years" if potential_savings > 0 else "N/A"
        
        # Find relevant news about this company
        company_news = []
        if news_data:
            company_news = find_company_news(client, news_data)
        
        with open(profile_path, 'w') as f:
            f.write(f"# {client} - Lead Profile\n\n")
            f.write(f"**Lead ID:** {lead_id}\n")
            f.write(f"**Location:** {location}\n")
            f.write(f"**Region:** {lead.get('Region', 'Unknown')}\n")
            f.write(f"**Industry:** {lead.get('Industry', 'Unknown')}\n")
            f.write(f"**Priority:** {lead.get('Priority', 'Unknown')}\n\n")
            
            f.write("## Power Requirements\n\n")
            f.write(f"**Current Size:** {power_size} MW\n")
            f.write(f"**Current Provider:** {lead.get('IPP Provider', 'Unknown')}\n")
            f.write(f"**Engines Required:** {lead.get('Engines Required', 'Unknown')}\n\n")
            
            f.write("## Financial Analysis\n\n")
            f.write(f"**Current Annual Power Cost:** ₦{annual_cost:,.2f}\n")
            f.write(f"**Potential Annual Savings:** ₦{potential_savings:,.2f}\n")
            f.write(f"**Estimated Payback Period:** {payback_period}\n\n")
            
            # Add recent news section if available
            if company_news:
                f.write("## Recent News\n\n")
                f.write(f"Found {len(company_news)} news articles mentioning {client}:\n\n")
                
                # List up to 3 most recent news articles
                for article in company_news[:3]:
                    title = article.get('title', 'No title')
                    source = article.get('source', 'Unknown source')
                    date = article.get('published_at', 'Unknown date')
                    url = article.get('url', '#')
                    
                    f.write(f"- [{title}]({url}) - {source}, {date}\n")
                
                f.write("\n")
            
            f.write("## Contact Information\n\n")
            f.write("*To be filled by sales team*\n\n")
            f.write("- **Key Decision Maker:**\n")
            f.write("- **Contact Email:**\n")
            f.write("- **Contact Phone:**\n")
            f.write("- **Last Contact Date:**\n\n")
            
            f.write("## Notes\n\n")
            f.write("*Add client-specific notes here*\n\n")
            
            f.write("## Next Steps\n\n")
            f.write("1. Schedule initial meeting\n")
            f.write("2. Conduct site assessment\n")
            f.write("3. Present tailored IPP proposal\n")
            f.write("4. Follow up on decision timeline\n")
            
            print(f"Created sales template for {client} in {location}")
    
    return templates_dir

def create_summary_report(leads_df, output_dir, news_data=None):
    """Create a summary report for the sales team."""
    summary_path = os.path.join(output_dir, "Sales_Team_Summary.md")
    
    # Calculate key metrics
    total_leads = len(leads_df)
    total_power = leads_df['Size (MW)'].sum() if 'Size (MW)' in leads_df.columns else 0
    total_savings = leads_df['Potential Annual Savings'].sum() if 'Potential Annual Savings' in leads_df.columns else 0
    
    # Priority breakdown
    priority_counts = leads_df['Priority'].value_counts().to_dict() if 'Priority' in leads_df.columns else {}
    
    # Region breakdown
    region_data = []
    if 'Region' in leads_df.columns:
        for region in sorted(leads_df['Region'].unique()):
            if pd.isna(region):
                continue
            
            region_leads = leads_df[leads_df['Region'] == region]
            region_power = region_leads['Size (MW)'].sum() if 'Size (MW)' in region_leads.columns else 0
            region_savings = region_leads['Potential Annual Savings'].sum() if 'Potential Annual Savings' in region_leads.columns else 0
            
            region_data.append({
                'Region': region,
                'Leads': len(region_leads),
                'Power': region_power,
                'Savings': region_savings
            })
    
    # Find companies with recent news
    companies_with_news = {}
    if news_data:
        for idx, lead in leads_df.iterrows():
            client = lead.get('CLIENT', 'Unknown')
            news = find_company_news(client, news_data)
            if news:
                companies_with_news[client] = len(news)
    
    # Write the summary report
    with open(summary_path, 'w') as f:
        f.write("# Mikano IPP Sales Team Summary\n\n")
        f.write(f"*Generated on {datetime.now().strftime('%Y-%m-%d')}*\n\n")
        
        f.write("## Overview\n\n")
        f.write(f"- **Total Leads:** {total_leads}\n")
        f.write(f"- **Total Power Requirement:** {total_power:.2f} MW\n")
        f.write(f"- **Total Potential Annual Savings:** ₦{total_savings:,.2f}\n\n")
        
        f.write("## Priority Breakdown\n\n")
        f.write("| Priority | Number of Leads |\n")
        f.write("|----------|----------------|\n")
        for priority, count in sorted(priority_counts.items()):
            if pd.isna(priority):
                continue
            f.write(f"| {priority} | {count} |\n")
        f.write("\n")
        
        f.write("## Regional Breakdown\n\n")
        f.write("| Region | Number of Leads | Total Power (MW) | Potential Savings (₦) |\n")
        f.write("|--------|----------------|-------------------|----------------------|\n")
        for region in sorted(region_data, key=lambda x: x['Leads'], reverse=True):
            f.write(f"| {region['Region']} | {region['Leads']} | {region['Power']:.2f} | ₦{region['Savings']:,.2f} |\n")
        
        f.write("\n## Top 5 Opportunities by Savings\n\n")
        if 'Potential Annual Savings' in leads_df.columns:
            top_leads = leads_df.sort_values(by='Potential Annual Savings', ascending=False).head(5)
            f.write("| Client | Location | Power (MW) | Potential Savings (₦) |\n")
            f.write("|--------|----------|------------|----------------------|\n")
            for _, lead in top_leads.iterrows():
                client = lead.get('CLIENT', 'Unknown')
                location = lead.get('LOCATION', 'Unknown')
                power = lead.get('Size (MW)', 0)
                savings = lead.get('Potential Annual Savings', 0)
                f.write(f"| {client} | {location} | {power:.2f} | ₦{savings:,.2f} |\n")
        
        # Add news section if available
        if companies_with_news:
            f.write("\n## Companies with Recent News\n\n")
            f.write("The following leads have recent news mentions that may provide engagement opportunities:\n\n")
            f.write("| Company | Number of News Mentions |\n")
            f.write("|---------|-------------------------|\n")
            
            # Sort by number of news mentions
            sorted_companies = sorted(companies_with_news.items(), key=lambda x: x[1], reverse=True)
            for company, count in sorted_companies:
                f.write(f"| {company} | {count} |\n")
            
            f.write("\n*Review the individual lead profiles for news details*\n\n")
        
        f.write("\n## Sales Team Assignments\n\n")
        f.write("*To be filled by sales management*\n\n")
        
        f.write("| Region | Assigned Sales Representative | Target Completion Date |\n")
        f.write("|--------|--------------------------------|-----------------------|\n")
        if 'Region' in leads_df.columns:
            for region in sorted(leads_df['Region'].unique()):
                if pd.isna(region):
                    continue
                f.write(f"| {region} | | |\n")
        
    print(f"Created sales team summary at {summary_path}")
    return summary_path

def main():
    parser = argparse.ArgumentParser(description='Create sales leads sheets from the enriched database')
    parser.add_argument('input_file', help='Path to the enriched leads database (JSON, Excel, or CSV)')
    parser.add_argument('--output_dir', default='../Database/SalesLeads', 
                        help='Directory to save the sales leads (default: ../Database/SalesLeads)')
    parser.add_argument('--news_data', default='../Database/NewsData/newsapi_cache.json',
                        help='Path to the news data file (default: ../Database/NewsData/newsapi_cache.json)')
    parser.add_argument('--no_news', action='store_true',
                        help='Skip including news data even if available')
    args = parser.parse_args()
    
    # Ensure output directory exists
    create_directory_if_not_exists(args.output_dir)
    
    # Load the lead database
    leads_df = load_lead_database(args.input_file)
    
    # Load news data if available and requested
    news_data = None
    if not args.no_news:
        news_data = load_news_data(args.news_data)
    
    # Create sales sheets by priority and region
    priority_dir, region_dir, industry_dir = create_sales_sheets(leads_df, args.output_dir)
    
    # Create sales templates for each lead
    templates_dir = create_sales_templates(leads_df, args.output_dir, news_data)
    
    # Create a summary report
    summary_path = create_summary_report(leads_df, args.output_dir, news_data)
    
    print("\nSales lead materials created successfully!")
    print(f"- Sales sheets by priority: {priority_dir}")
    print(f"- Sales sheets by region: {region_dir}")
    print(f"- Sales sheets by industry: {industry_dir}")
    print(f"- Individual sales templates: {templates_dir}")
    print(f"- Sales team summary: {summary_path}")

if __name__ == "__main__":
    main() 
"""
Create sales-focused lead sheets for the Mikano IPP sales team.
This script takes the enriched leads database and creates sales materials
with contact templates, ROI calculators, and regional assignments.
"""

import os
import json
import pandas as pd
import numpy as np
from datetime import datetime
import argparse

def create_directory_if_not_exists(directory):
    """Create a directory if it doesn't already exist."""
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"Created directory: {directory}")

def load_lead_database(file_path):
    """Load the enriched lead database from JSON or Excel."""
    if file_path.endswith('.json'):
        with open(file_path, 'r') as f:
            data = json.load(f)
        leads_df = pd.DataFrame(data)
    elif file_path.endswith(('.xlsx', '.xls')):
        leads_df = pd.read_excel(file_path)
    elif file_path.endswith('.csv'):
        leads_df = pd.read_csv(file_path)
    else:
        raise ValueError("Unsupported file format. Please provide JSON, Excel, or CSV.")
    
    print(f"Loaded {len(leads_df)} leads from {file_path}")
    return leads_df

def load_news_data(file_path=None):
    """Load news data from NewsAPI cache if available."""
    if not file_path:
        file_path = "../Database/NewsData/newsapi_cache.json"
    
    if not os.path.exists(file_path):
        print(f"No news data found at {file_path}")
        return []
    
    try:
        with open(file_path, 'r') as f:
            news_data = json.load(f)
        print(f"Loaded {len(news_data)} news articles")
        return news_data
    except Exception as e:
        print(f"Error loading news data: {str(e)}")
        return []

def find_company_news(company_name, news_data):
    """Find news articles mentioning a specific company."""
    company_name_lower = company_name.lower()
    
    # Handle special cases like "CBN (Printing & Minting)"
    if "(" in company_name:
        company_name_parts = company_name.split("(")
        company_name_lower = company_name_parts[0].lower().strip()
        
    company_news = []
    
    for article in news_data:
        title = article.get('title', '').lower()
        description = article.get('description', '').lower() if article.get('description') else ''
        content = article.get('content', '').lower() if article.get('content') else ''
        companies = [c.lower() for c in article.get('companies_mentioned', [])]
        
        if (company_name_lower in title or 
            company_name_lower in description or 
            company_name_lower in content or
            company_name_lower in companies):
            company_news.append(article)
    
    return company_news

def create_sales_sheets(leads_df, output_dir):
    """Create sales sheets organized by priority and region."""
    # Create subdirectories
    priority_dir = os.path.join(output_dir, "By_Priority")
    region_dir = os.path.join(output_dir, "By_Region")
    industry_dir = os.path.join(output_dir, "By_Industry")
    
    create_directory_if_not_exists(priority_dir)
    create_directory_if_not_exists(region_dir)
    create_directory_if_not_exists(industry_dir)
    
    # Generate by priority
    priority_values = leads_df['Priority'].dropna().unique()
    for priority in sorted(priority_values):
        priority_leads = leads_df[leads_df['Priority'] == priority]
        priority_file = os.path.join(priority_dir, f"Priority_{priority}_Leads.xlsx")
        priority_leads.to_excel(priority_file, index=False)
        print(f"Created priority sheet for {priority}: {len(priority_leads)} leads")
    
    # Generate by region
    region_values = leads_df['Region'].dropna().unique()
    for region in sorted(region_values):
        region_leads = leads_df[leads_df['Region'] == region]
        region_file = os.path.join(region_dir, f"{region}_Leads.xlsx")
        region_leads.to_excel(region_file, index=False)
        print(f"Created region sheet for {region}: {len(region_leads)} leads")
    
    # Generate by industry
    industry_values = leads_df['Industry'].dropna().unique()
    for industry in sorted(industry_values):
        industry_leads = leads_df[leads_df['Industry'] == industry]
        industry_file = os.path.join(industry_dir, f"{industry}_Leads.xlsx")
        industry_leads.to_excel(industry_file, index=False)
        print(f"Created industry sheet for {industry}: {len(industry_leads)} leads")
    
    # Create a combined priority A & B sheet
    high_priority_leads = leads_df[leads_df['Priority'].isin(['A', 'B'])]
    high_priority_file = os.path.join(priority_dir, "High_Priority_Leads.xlsx")
    high_priority_leads.to_excel(high_priority_file, index=False)
    print(f"Created high priority sheet: {len(high_priority_leads)} leads")
    
    return priority_dir, region_dir, industry_dir

def create_sales_templates(leads_df, output_dir, news_data=None):
    """Create individual sales templates for each lead."""
    templates_dir = os.path.join(output_dir, "Sales_Templates")
    create_directory_if_not_exists(templates_dir)
    
    # Create a template for each lead
    for idx, lead in leads_df.iterrows():
        lead_id = lead.get('Lead ID', f"LEAD{idx+1}")
        client = lead.get('CLIENT', 'Unknown').replace('/', '_')
        location = lead.get('LOCATION', 'Unknown')
        
        # Create a directory for each lead
        lead_dir = os.path.join(templates_dir, f"{lead_id}_{client}")
        create_directory_if_not_exists(lead_dir)
        
        # Create a lead profile markdown file
        profile_path = os.path.join(lead_dir, "Lead_Profile.md")
        
        # Calculate ROI information
        power_size = lead.get('Size (MW)', 0)
        annual_cost = lead.get('Annual Power Cost', 0)
        potential_savings = lead.get('Potential Annual Savings', 0)
        payback_period = "N/A"
        
        if potential_savings and potential_savings > 0:
            # Assuming capex of $1M per MW
            capex = power_size * 1000000 * 950  # Convert to Naira at approx 950 NGN/USD
            payback_period = f"{capex / potential_savings:.1f} years" if potential_savings > 0 else "N/A"
        
        # Find relevant news about this company
        company_news = []
        if news_data:
            company_news = find_company_news(client, news_data)
        
        with open(profile_path, 'w') as f:
            f.write(f"# {client} - Lead Profile\n\n")
            f.write(f"**Lead ID:** {lead_id}\n")
            f.write(f"**Location:** {location}\n")
            f.write(f"**Region:** {lead.get('Region', 'Unknown')}\n")
            f.write(f"**Industry:** {lead.get('Industry', 'Unknown')}\n")
            f.write(f"**Priority:** {lead.get('Priority', 'Unknown')}\n\n")
            
            f.write("## Power Requirements\n\n")
            f.write(f"**Current Size:** {power_size} MW\n")
            f.write(f"**Current Provider:** {lead.get('IPP Provider', 'Unknown')}\n")
            f.write(f"**Engines Required:** {lead.get('Engines Required', 'Unknown')}\n\n")
            
            f.write("## Financial Analysis\n\n")
            f.write(f"**Current Annual Power Cost:** ₦{annual_cost:,.2f}\n")
            f.write(f"**Potential Annual Savings:** ₦{potential_savings:,.2f}\n")
            f.write(f"**Estimated Payback Period:** {payback_period}\n\n")
            
            # Add recent news section if available
            if company_news:
                f.write("## Recent News\n\n")
                f.write(f"Found {len(company_news)} news articles mentioning {client}:\n\n")
                
                # List up to 3 most recent news articles
                for article in company_news[:3]:
                    title = article.get('title', 'No title')
                    source = article.get('source', 'Unknown source')
                    date = article.get('published_at', 'Unknown date')
                    url = article.get('url', '#')
                    
                    f.write(f"- [{title}]({url}) - {source}, {date}\n")
                
                f.write("\n")
            
            f.write("## Contact Information\n\n")
            f.write("*To be filled by sales team*\n\n")
            f.write("- **Key Decision Maker:**\n")
            f.write("- **Contact Email:**\n")
            f.write("- **Contact Phone:**\n")
            f.write("- **Last Contact Date:**\n\n")
            
            f.write("## Notes\n\n")
            f.write("*Add client-specific notes here*\n\n")
            
            f.write("## Next Steps\n\n")
            f.write("1. Schedule initial meeting\n")
            f.write("2. Conduct site assessment\n")
            f.write("3. Present tailored IPP proposal\n")
            f.write("4. Follow up on decision timeline\n")
            
            print(f"Created sales template for {client} in {location}")
    
    return templates_dir

def create_summary_report(leads_df, output_dir, news_data=None):
    """Create a summary report for the sales team."""
    summary_path = os.path.join(output_dir, "Sales_Team_Summary.md")
    
    # Calculate key metrics
    total_leads = len(leads_df)
    total_power = leads_df['Size (MW)'].sum() if 'Size (MW)' in leads_df.columns else 0
    total_savings = leads_df['Potential Annual Savings'].sum() if 'Potential Annual Savings' in leads_df.columns else 0
    
    # Priority breakdown
    priority_counts = leads_df['Priority'].value_counts().to_dict() if 'Priority' in leads_df.columns else {}
    
    # Region breakdown
    region_data = []
    if 'Region' in leads_df.columns:
        for region in sorted(leads_df['Region'].unique()):
            if pd.isna(region):
                continue
            
            region_leads = leads_df[leads_df['Region'] == region]
            region_power = region_leads['Size (MW)'].sum() if 'Size (MW)' in region_leads.columns else 0
            region_savings = region_leads['Potential Annual Savings'].sum() if 'Potential Annual Savings' in region_leads.columns else 0
            
            region_data.append({
                'Region': region,
                'Leads': len(region_leads),
                'Power': region_power,
                'Savings': region_savings
            })
    
    # Find companies with recent news
    companies_with_news = {}
    if news_data:
        for idx, lead in leads_df.iterrows():
            client = lead.get('CLIENT', 'Unknown')
            news = find_company_news(client, news_data)
            if news:
                companies_with_news[client] = len(news)
    
    # Write the summary report
    with open(summary_path, 'w') as f:
        f.write("# Mikano IPP Sales Team Summary\n\n")
        f.write(f"*Generated on {datetime.now().strftime('%Y-%m-%d')}*\n\n")
        
        f.write("## Overview\n\n")
        f.write(f"- **Total Leads:** {total_leads}\n")
        f.write(f"- **Total Power Requirement:** {total_power:.2f} MW\n")
        f.write(f"- **Total Potential Annual Savings:** ₦{total_savings:,.2f}\n\n")
        
        f.write("## Priority Breakdown\n\n")
        f.write("| Priority | Number of Leads |\n")
        f.write("|----------|----------------|\n")
        for priority, count in sorted(priority_counts.items()):
            if pd.isna(priority):
                continue
            f.write(f"| {priority} | {count} |\n")
        f.write("\n")
        
        f.write("## Regional Breakdown\n\n")
        f.write("| Region | Number of Leads | Total Power (MW) | Potential Savings (₦) |\n")
        f.write("|--------|----------------|-------------------|----------------------|\n")
        for region in sorted(region_data, key=lambda x: x['Leads'], reverse=True):
            f.write(f"| {region['Region']} | {region['Leads']} | {region['Power']:.2f} | ₦{region['Savings']:,.2f} |\n")
        
        f.write("\n## Top 5 Opportunities by Savings\n\n")
        if 'Potential Annual Savings' in leads_df.columns:
            top_leads = leads_df.sort_values(by='Potential Annual Savings', ascending=False).head(5)
            f.write("| Client | Location | Power (MW) | Potential Savings (₦) |\n")
            f.write("|--------|----------|------------|----------------------|\n")
            for _, lead in top_leads.iterrows():
                client = lead.get('CLIENT', 'Unknown')
                location = lead.get('LOCATION', 'Unknown')
                power = lead.get('Size (MW)', 0)
                savings = lead.get('Potential Annual Savings', 0)
                f.write(f"| {client} | {location} | {power:.2f} | ₦{savings:,.2f} |\n")
        
        # Add news section if available
        if companies_with_news:
            f.write("\n## Companies with Recent News\n\n")
            f.write("The following leads have recent news mentions that may provide engagement opportunities:\n\n")
            f.write("| Company | Number of News Mentions |\n")
            f.write("|---------|-------------------------|\n")
            
            # Sort by number of news mentions
            sorted_companies = sorted(companies_with_news.items(), key=lambda x: x[1], reverse=True)
            for company, count in sorted_companies:
                f.write(f"| {company} | {count} |\n")
            
            f.write("\n*Review the individual lead profiles for news details*\n\n")
        
        f.write("\n## Sales Team Assignments\n\n")
        f.write("*To be filled by sales management*\n\n")
        
        f.write("| Region | Assigned Sales Representative | Target Completion Date |\n")
        f.write("|--------|--------------------------------|-----------------------|\n")
        if 'Region' in leads_df.columns:
            for region in sorted(leads_df['Region'].unique()):
                if pd.isna(region):
                    continue
                f.write(f"| {region} | | |\n")
        
    print(f"Created sales team summary at {summary_path}")
    return summary_path

def main():
    parser = argparse.ArgumentParser(description='Create sales leads sheets from the enriched database')
    parser.add_argument('input_file', help='Path to the enriched leads database (JSON, Excel, or CSV)')
    parser.add_argument('--output_dir', default='../Database/SalesLeads', 
                        help='Directory to save the sales leads (default: ../Database/SalesLeads)')
    parser.add_argument('--news_data', default='../Database/NewsData/newsapi_cache.json',
                        help='Path to the news data file (default: ../Database/NewsData/newsapi_cache.json)')
    parser.add_argument('--no_news', action='store_true',
                        help='Skip including news data even if available')
    args = parser.parse_args()
    
    # Ensure output directory exists
    create_directory_if_not_exists(args.output_dir)
    
    # Load the lead database
    leads_df = load_lead_database(args.input_file)
    
    # Load news data if available and requested
    news_data = None
    if not args.no_news:
        news_data = load_news_data(args.news_data)
    
    # Create sales sheets by priority and region
    priority_dir, region_dir, industry_dir = create_sales_sheets(leads_df, args.output_dir)
    
    # Create sales templates for each lead
    templates_dir = create_sales_templates(leads_df, args.output_dir, news_data)
    
    # Create a summary report
    summary_path = create_summary_report(leads_df, args.output_dir, news_data)
    
    print("\nSales lead materials created successfully!")
    print(f"- Sales sheets by priority: {priority_dir}")
    print(f"- Sales sheets by region: {region_dir}")
    print(f"- Sales sheets by industry: {industry_dir}")
    print(f"- Individual sales templates: {templates_dir}")
    print(f"- Sales team summary: {summary_path}")

if __name__ == "__main__":
    main() 