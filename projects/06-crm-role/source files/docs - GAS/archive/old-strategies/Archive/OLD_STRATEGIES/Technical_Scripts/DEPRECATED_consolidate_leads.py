#!/usr/bin/env python3
import os
import pandas as pd
import numpy as np
from datetime import datetime
import glob

# Get the current directory and define absolute paths
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)  # Parent directory of current directory

# Define paths with absolute paths
BACKUP_DIR = os.path.join(PROJECT_ROOT, "Database", "Backup")
SALES_LEADS_DIR = os.path.join(PROJECT_ROOT, "Database", "SalesLeads")
NEWS_DATA_DIR = os.path.join(PROJECT_ROOT, "Database", "NewsData")
TEST_RESULTS_DIR = os.path.join(PROJECT_ROOT, "Database", "TestResults")

print(f"Using BACKUP_DIR: {BACKUP_DIR}")
print(f"Using SALES_LEADS_DIR: {SALES_LEADS_DIR}")

# Create consolidated lead list
def create_consolidated_lead_list():
    """Create a consolidated lead list from available data files."""
    # Try to use properly_enriched_leads.csv first
    leads_path = os.path.join(BACKUP_DIR, "properly_enriched_leads.csv")
    
    if os.path.exists(leads_path):
        print(f"Using properly_enriched_leads.csv from {BACKUP_DIR}")
        df = pd.read_csv(leads_path)
    else:
        # Fall back to other files
        print(f"properly_enriched_leads.csv not found at {leads_path}, looking for other files...")
        
        # List all files in the backup directory
        print(f"Files in {BACKUP_DIR}:")
        if os.path.exists(BACKUP_DIR):
            for file in os.listdir(BACKUP_DIR):
                print(f"  - {file}")
        
        scraped_files = glob.glob(os.path.join(SALES_LEADS_DIR, "scraped_companies_*.csv"))
        if not scraped_files:
            scraped_files = glob.glob(os.path.join(BACKUP_DIR, "*.csv"))
        
        if not scraped_files:
            print("Error: No data files found.")
            return None
        
        # Get the most recent file
        latest_file = max(scraped_files, key=os.path.getctime)
        print(f"Using data file: {latest_file}")
        df = pd.read_csv(latest_file)
    
    # Check and rename columns if needed
    if 'Company' in df.columns and 'Company Name' not in df.columns:
        df = df.rename(columns={'Company': 'Company Name'})
    
    # Filter out unwanted companies (big names like Dangote, BUA, MTN, etc.)
    unwanted_companies = ['Dangote', 'BUA', 'MTN', 'Nestle', 'Cadbury', 'Bank', 
                          'Government', 'Agency', 'Nigeria', 'National', 'Federal',
                          'Ministry', 'Corporation', 'Media', 'News', 'Times']
    
    # Create a regex pattern to match any unwanted company name
    pattern = '|'.join(unwanted_companies)
    
    # Filter companies that don't match the pattern
    filtered_df = df
    if 'Company Name' in df.columns:
        filtered_df = df[~df['Company Name'].str.contains(pattern, case=False, na=False)]
    
    # If we have a file with Power Mentions, use that for ranking
    if 'Power Mentions' in filtered_df.columns:
        filtered_df = filtered_df.sort_values(by='Power Mentions', ascending=False)
    
    # Add missing columns
    if 'Industry' not in filtered_df.columns:
        filtered_df['Industry'] = "Manufacturing"
    
    if 'Location' not in filtered_df.columns:
        filtered_df['Location'] = "Lagos"
    
    if 'Priority' not in filtered_df.columns:
        filtered_df['Priority'] = "Medium"
    
    if 'Required Power' not in filtered_df.columns:
        filtered_df['Required Power'] = 1.5  # Default 1.5 MW
    
    if 'Annual Power Cost (₦)' not in filtered_df.columns:
        # Estimate annual power cost: 1.5 MW * 24 hours * 365 days * ₦95.6/kWh * 1000 kW/MW
        filtered_df['Annual Power Cost (₦)'] = filtered_df['Required Power'] * 24 * 365 * 95.6 * 1000
    
    # Save consolidated list
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = os.path.join(SALES_LEADS_DIR, f"consolidated_leads_{timestamp}.csv")
    filtered_df.to_csv(output_path, index=False)
    print(f"Consolidated lead list saved to {output_path}")
    
    # Create categorized lists
    create_categorized_lists(filtered_df)
    
    return filtered_df

def create_categorized_lists(df):
    """Create categorized lead lists by industry, region, and priority."""
    # By Industry
    if 'Industry' in df.columns:
        industry_groups = df.groupby('Industry')
        for industry, group in industry_groups:
            if pd.notna(industry) and industry:
                safe_industry = str(industry).replace('/', '_').replace(' ', '_')
                output_path = os.path.join(SALES_LEADS_DIR, "By_Industry", f"{safe_industry}_leads.csv")
                group.to_csv(output_path, index=False)
                print(f"Industry lead list saved to {output_path}")
    
    # By Region
    if 'Location' in df.columns:
        location_groups = df.groupby('Location')
        for location, group in location_groups:
            if pd.notna(location) and location:
                safe_location = str(location).replace('/', '_').replace(' ', '_')
                output_path = os.path.join(SALES_LEADS_DIR, "By_Region", f"{safe_location}_leads.csv")
                group.to_csv(output_path, index=False)
                print(f"Region lead list saved to {output_path}")
    
    # By Priority
    if 'Priority' in df.columns:
        priority_groups = df.groupby('Priority')
        for priority, group in priority_groups:
            if pd.notna(priority) and priority:
                safe_priority = str(priority).replace('/', '_').replace(' ', '_')
                output_path = os.path.join(SALES_LEADS_DIR, "By_Priority", f"{safe_priority}_leads.csv")
                group.to_csv(output_path, index=False)
                print(f"Priority lead list saved to {output_path}")

def create_top_leads_md():
    """Create a markdown file with the top leads."""
    # Read the consolidated lead list
    files = [f for f in os.listdir(SALES_LEADS_DIR) if f.startswith('consolidated_leads_') and f.endswith('.csv')]
    if not files:
        print("No consolidated lead lists found.")
        return
    
    latest_file = sorted(files)[-1]
    df = pd.read_csv(os.path.join(SALES_LEADS_DIR, latest_file))
    
    # Take top 20 leads
    top_leads = df.head(20)
    
    # Create markdown file
    md_content = "# Top Leads for IPP Solutions\n\n"
    md_content += "This document contains the top leads for Independent Power Plant (IPP) solutions.\n\n"
    md_content += "## Summary\n\n"
    md_content += f"- **Total Leads**: {len(df)}\n"
    
    # Add industry distribution
    if 'Industry' in df.columns:
        industry_counts = df['Industry'].value_counts()
        md_content += "- **Top Industries**:\n"
        for industry, count in industry_counts.head(5).items():
            md_content += f"  - {industry}: {count} leads\n"
    
    # Add region distribution
    if 'Location' in df.columns:
        location_counts = df['Location'].value_counts()
        md_content += "- **Top Regions**:\n"
        for location, count in location_counts.head(5).items():
            md_content += f"  - {location}: {count} leads\n"
    
    # Add top leads table
    md_content += "\n## Top 20 Leads\n\n"
    md_content += "| Company | Industry | Location | Required Power | Annual Power Cost |\n"
    md_content += "|---------|----------|----------|----------------|------------------|\n"
    
    for _, row in top_leads.iterrows():
        company = row.get('Company Name', 'N/A')
        industry = row.get('Industry', 'N/A')
        location = row.get('Location', 'N/A')
        
        # Get required power
        if 'Power_MW' in row and pd.notna(row['Power_MW']):
            power = f"{row['Power_MW']} MW"
        elif 'Required Power' in row and pd.notna(row['Required Power']):
            power = f"{row['Required Power']} MW"
        elif 'Power (kW)' in row and pd.notna(row['Power (kW)']):
            power = f"{row['Power (kW)']/1000:.2f} MW"
        else:
            power = 'N/A'
        
        # Get annual power cost
        if 'Annual Power Cost (₦)' in row and pd.notna(row['Annual Power Cost (₦)']):
            cost = f"₦{row['Annual Power Cost (₦)']:,.2f}"
        else:
            cost = 'N/A'
        
        md_content += f"| {company} | {industry} | {location} | {power} | {cost} |\n"
    
    # Write to file
    with open(os.path.join(SALES_LEADS_DIR, "top_leads.md"), 'w') as f:
        f.write(md_content)
    
    print(f"Top leads markdown file created at {os.path.join(SALES_LEADS_DIR, 'top_leads.md')}")

def main():
    """Main function."""
    print("Starting consolidation of leads...")
    consolidated_df = create_consolidated_lead_list()
    if consolidated_df is not None:
        create_top_leads_md()
    print("Consolidation complete.")

if __name__ == "__main__":