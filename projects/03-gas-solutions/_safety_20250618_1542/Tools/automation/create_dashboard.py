#!/usr/bin/env python3
"""
Script to create a dashboard-style summary of the Gas Leads data from Sheet3
"""
import pandas as pd
import os
import json
from datetime import datetime

def create_dashboard():
    """Create a dashboard-style summary of the Gas Leads data"""
    # Input file (the enriched database we created)
    input_file = "../Database/TestResults/gas_leads_database.csv"
    
    try:
        # Read the enriched database
        df = pd.read_csv(input_file)
        print(f"Loaded {len(df)} leads from the database")
        
        # Create a dashboard markdown file
        dashboard_md = "# Gas Leads Dashboard\n\n"
        dashboard_md += f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n"
        
        # Summary statistics
        dashboard_md += "## Summary\n\n"
        
        total_leads = len(df)
        total_power_mw = df['Size (MW)'].sum()
        total_cost = df['Annual Power Cost (₦)'].sum()
        total_savings = df['Potential Annual Savings (₦)'].sum()
        
        dashboard_md += f"- **Total Leads**: {total_leads}\n"
        dashboard_md += f"- **Total Power Requirement**: {total_power_mw:.2f} MW\n"
        dashboard_md += f"- **Total Annual Power Cost**: ₦{total_cost:,.0f}\n"
        dashboard_md += f"- **Total Potential Annual Savings**: ₦{total_savings:,.0f}\n\n"
        
        # Priority breakdown
        dashboard_md += "## Priority Leads\n\n"
        
        priority_counts = df['Priority'].value_counts()
        high_priority = priority_counts.get('A', 0)
        medium_priority = priority_counts.get('B', 0)
        low_priority = priority_counts.get('C', 0)
        
        dashboard_md += f"- **High Priority (A)**: {high_priority} leads\n"
        dashboard_md += f"- **Medium Priority (B)**: {medium_priority} leads\n"
        dashboard_md += f"- **Low Priority (C)**: {low_priority} leads\n\n"
        
        # Top 5 leads by power requirement
        dashboard_md += "## Top 5 Leads by Power Requirement\n\n"
        dashboard_md += "| Lead ID | Company | Location | Power (MW) | Annual Savings |\n"
        dashboard_md += "|---------|---------|----------|------------|----------------|\n"
        
        top_power = df.sort_values('Size (MW)', ascending=False).head(5)
        for _, row in top_power.iterrows():
            lead_id = row['Lead ID']
            company = row['CLIENT'] if pd.notna(row['CLIENT']) else 'N/A'
            location = row['LOCATION'] if pd.notna(row['LOCATION']) else 'N/A'
            power = row['Size (MW)'] if pd.notna(row['Size (MW)']) else 0
            savings = row['Potential Annual Savings (₦)'] if pd.notna(row['Potential Annual Savings (₦)']) else 0
            
            dashboard_md += f"| {lead_id} | {company} | {location} | {power:.2f} | ₦{savings:,.0f} |\n"
        
        # Regional distribution
        dashboard_md += "\n## Regional Distribution\n\n"
        
        # Define regions in Nigeria
        regions = {
            'Lagos': 'Southwest',
            'Ikeja': 'Southwest',
            'Ibadan': 'Southwest',
            'Sagamu': 'Southwest',
            'Ijebu': 'Southwest',
            'Abuja': 'FCT',
            'Nassarawa': 'North Central',
            'Kano': 'Northwest',
            'Enugu': 'Southeast',
            'Calabar': 'South-South',
            'Asaba': 'South-South',
            'Sunti': 'North Central'
        }
        
        # Map locations to regions
        def map_to_region(location):
            if pd.isna(location):
                return "Unknown"
            
            for key, region in regions.items():
                if key.lower() in location.lower():
                    return region
            
            return "Other"
        
        df['Region'] = df['LOCATION'].apply(map_to_region)
        
        # Create regional summary
        regional_summary = df.groupby('Region').agg({
            'Lead ID': 'count',
            'Size (MW)': 'sum',
            'Potential Annual Savings (₦)': 'sum'
        }).reset_index()
        
        regional_summary.rename(columns={
            'Lead ID': 'Number of Leads',
            'Size (MW)': 'Total Power (MW)',
            'Potential Annual Savings (₦)': 'Total Savings (₦)'
        }, inplace=True)
        
        # Sort by number of leads
        regional_summary.sort_values('Number of Leads', ascending=False, inplace=True)
        
        dashboard_md += "| Region | Number of Leads | Total Power (MW) | Total Savings |\n"
        dashboard_md += "|--------|----------------|------------------|---------------|\n"
        
        for _, row in regional_summary.iterrows():
            region = row['Region']
            num_leads = row['Number of Leads']
            power = row['Total Power (MW)'] if pd.notna(row['Total Power (MW)']) else 0
            savings = row['Total Savings (₦)'] if pd.notna(row['Total Savings (₦)']) else 0
            
            dashboard_md += f"| {region} | {num_leads} | {power:.2f} | ₦{savings:,.0f} |\n"
        
        # Industry distribution
        dashboard_md += "\n## Industry Distribution\n\n"
        
        industry_counts = df['Industry'].value_counts()
        
        dashboard_md += "| Industry | Number of Leads | Percentage |\n"
        dashboard_md += "|----------|----------------|------------|\n"
        
        for industry, count in industry_counts.items():
            percentage = count / total_leads * 100
            dashboard_md += f"| {industry} | {count} | {percentage:.1f}% |\n"
        
        # Current IPP providers
        dashboard_md += "\n## Current IPP Providers\n\n"
        
        ipp_counts = df['IPP Provider'].value_counts()
        
        dashboard_md += "| Provider | Number of Clients |\n"
        dashboard_md += "|----------|-------------------|\n"
        
        for provider, count in ipp_counts.items():
            if pd.notna(provider) and provider:
                dashboard_md += f"| {provider} | {count} |\n"
        
        # Power size distribution
        dashboard_md += "\n## Power Size Distribution\n\n"
        
        size_counts = df['Size Category'].value_counts()
        
        dashboard_md += "| Size Category | Count | Percentage |\n"
        dashboard_md += "|---------------|-------|------------|\n"
        
        for size, count in size_counts.items():
            if pd.notna(size):
                percentage = count / total_leads * 100
                dashboard_md += f"| {size} | {count} | {percentage:.1f}% |\n"
        
        # High-priority leads
        dashboard_md += "\n## High-Priority Leads\n\n"
        
        high_priority_leads = df[df['Priority'] == 'A'].sort_values('Size (MW)', ascending=False)
        
        dashboard_md += "| Lead ID | Company | Location | Power (MW) | Current Provider |\n"
        dashboard_md += "|---------|---------|----------|------------|------------------|\n"
        
        for _, row in high_priority_leads.iterrows():
            lead_id = row['Lead ID']
            company = row['CLIENT'] if pd.notna(row['CLIENT']) else 'N/A'
            location = row['LOCATION'] if pd.notna(row['LOCATION']) else 'N/A'
            power = row['Size (MW)'] if pd.notna(row['Size (MW)']) else 0
            provider = row['IPP Provider'] if pd.notna(row['IPP Provider']) else 'None'
            
            dashboard_md += f"| {lead_id} | {company} | {location} | {power:.2f} | {provider} |\n"
        
        # Write to file
        dashboard_file = "../Database/TestResults/gas_leads_dashboard.md"
        with open(dashboard_file, 'w') as f:
            f.write(dashboard_md)
        
        print(f"Created dashboard at {dashboard_file}")
        
        # Create a short executive summary
        create_executive_summary(df, high_priority)
        
        return dashboard_md
    
    except Exception as e:
        print(f"Error creating dashboard: {str(e)}")
        return None

def create_executive_summary(df, high_priority_count):
    """Create a short executive summary for management"""
    
    summary_md = "# Gas IPP Leads - Executive Summary\n\n"
    summary_md += f"*Generated on {datetime.now().strftime('%Y-%m-%d')}*\n\n"
    
    # Key metrics
    total_leads = len(df)
    total_power_mw = df['Size (MW)'].sum()
    total_savings = df['Potential Annual Savings (₦)'].sum()
    
    summary_md += "## Overview\n\n"
    summary_md += f"We have identified **{total_leads} potential clients** for our gas IPP solutions, "
    summary_md += f"with a combined power requirement of **{total_power_mw:.2f} MW**.\n\n"
    
    summary_md += f"These clients currently spend approximately **₦{df['Annual Power Cost (₦)'].sum():,.0f}** "
    summary_md += f"annually on power. By implementing our solutions, we can help them save "
    summary_md += f"about **₦{total_savings:,.0f}** per year.\n\n"
    
    summary_md += "## Key Opportunities\n\n"
    
    # Get top 3 clients by power
    top_clients = df.sort_values('Size (MW)', ascending=False).head(3)
    
    summary_md += "Our top 3 opportunities by power requirement are:\n\n"
    
    for _, row in top_clients.iterrows():
        company = row['CLIENT'] if pd.notna(row['CLIENT']) else 'Unnamed Client'
        power = row['Size (MW)'] if pd.notna(row['Size (MW)']) else 0
        savings = row['Potential Annual Savings (₦)'] if pd.notna(row['Potential Annual Savings (₦)']) else 0
        
        summary_md += f"- **{company}** ({power:.2f} MW) - Potential annual savings of ₦{savings:,.0f}\n"
    
    # Regional focus
    summary_md += "\n## Regional Focus\n\n"
    
    # Define regions in Nigeria
    regions = {
        'Lagos': 'Southwest',
        'Ikeja': 'Southwest',
        'Ibadan': 'Southwest',
        'Sagamu': 'Southwest',
        'Ijebu': 'Southwest',
        'Abuja': 'FCT',
        'Nassarawa': 'North Central',
        'Kano': 'Northwest',
        'Enugu': 'Southeast',
        'Calabar': 'South-South',
        'Asaba': 'South-South',
        'Sunti': 'North Central'
    }
    
    # Map locations to regions
    df['Region'] = df['LOCATION'].apply(lambda loc: 
        next((region for key, region in regions.items() if pd.notna(loc) and key.lower() in loc.lower()), "Other"))
    
    # Get top region
    top_region = df.groupby('Region')['Size (MW)'].sum().idxmax()
    region_power = df[df['Region'] == top_region]['Size (MW)'].sum()
    region_count = len(df[df['Region'] == top_region])
    
    summary_md += f"The **{top_region}** region represents our strongest market with "
    summary_md += f"**{region_count} clients** and total power requirement of **{region_power:.2f} MW**.\n\n"
    
    # Next steps
    summary_md += "## Recommended Next Steps\n\n"
    
    summary_md += f"1. **Prioritize high-value leads**: Focus on the {high_priority_count} high-priority leads identified\n"
    summary_md += f"2. **Regional expansion**: Leverage our strong presence in the {top_region} to expand to neighboring regions\n"
    summary_md += "3. **Competition analysis**: Develop strategies to win clients from current providers, especially Junaid\n"
    summary_md += "4. **Custom solutions**: Develop tailored proposals for each high-priority client\n"
    
    # Save to file
    summary_file = "../Database/TestResults/gas_leads_executive_summary.md"
    with open(summary_file, 'w') as f:
        f.write(summary_md)
    
    print(f"Created executive summary at {summary_file}")

def main():
    print("Creating Gas Leads Dashboard...\n")
    create_dashboard()

if __name__ == "__main__":
    main() 
"""
Script to create a dashboard-style summary of the Gas Leads data from Sheet3
"""
import pandas as pd
import os
import json
from datetime import datetime

def create_dashboard():
    """Create a dashboard-style summary of the Gas Leads data"""
    # Input file (the enriched database we created)
    input_file = "../Database/TestResults/gas_leads_database.csv"
    
    try:
        # Read the enriched database
        df = pd.read_csv(input_file)
        print(f"Loaded {len(df)} leads from the database")
        
        # Create a dashboard markdown file
        dashboard_md = "# Gas Leads Dashboard\n\n"
        dashboard_md += f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n"
        
        # Summary statistics
        dashboard_md += "## Summary\n\n"
        
        total_leads = len(df)
        total_power_mw = df['Size (MW)'].sum()
        total_cost = df['Annual Power Cost (₦)'].sum()
        total_savings = df['Potential Annual Savings (₦)'].sum()
        
        dashboard_md += f"- **Total Leads**: {total_leads}\n"
        dashboard_md += f"- **Total Power Requirement**: {total_power_mw:.2f} MW\n"
        dashboard_md += f"- **Total Annual Power Cost**: ₦{total_cost:,.0f}\n"
        dashboard_md += f"- **Total Potential Annual Savings**: ₦{total_savings:,.0f}\n\n"
        
        # Priority breakdown
        dashboard_md += "## Priority Leads\n\n"
        
        priority_counts = df['Priority'].value_counts()
        high_priority = priority_counts.get('A', 0)
        medium_priority = priority_counts.get('B', 0)
        low_priority = priority_counts.get('C', 0)
        
        dashboard_md += f"- **High Priority (A)**: {high_priority} leads\n"
        dashboard_md += f"- **Medium Priority (B)**: {medium_priority} leads\n"
        dashboard_md += f"- **Low Priority (C)**: {low_priority} leads\n\n"
        
        # Top 5 leads by power requirement
        dashboard_md += "## Top 5 Leads by Power Requirement\n\n"
        dashboard_md += "| Lead ID | Company | Location | Power (MW) | Annual Savings |\n"
        dashboard_md += "|---------|---------|----------|------------|----------------|\n"
        
        top_power = df.sort_values('Size (MW)', ascending=False).head(5)
        for _, row in top_power.iterrows():
            lead_id = row['Lead ID']
            company = row['CLIENT'] if pd.notna(row['CLIENT']) else 'N/A'
            location = row['LOCATION'] if pd.notna(row['LOCATION']) else 'N/A'
            power = row['Size (MW)'] if pd.notna(row['Size (MW)']) else 0
            savings = row['Potential Annual Savings (₦)'] if pd.notna(row['Potential Annual Savings (₦)']) else 0
            
            dashboard_md += f"| {lead_id} | {company} | {location} | {power:.2f} | ₦{savings:,.0f} |\n"
        
        # Regional distribution
        dashboard_md += "\n## Regional Distribution\n\n"
        
        # Define regions in Nigeria
        regions = {
            'Lagos': 'Southwest',
            'Ikeja': 'Southwest',
            'Ibadan': 'Southwest',
            'Sagamu': 'Southwest',
            'Ijebu': 'Southwest',
            'Abuja': 'FCT',
            'Nassarawa': 'North Central',
            'Kano': 'Northwest',
            'Enugu': 'Southeast',
            'Calabar': 'South-South',
            'Asaba': 'South-South',
            'Sunti': 'North Central'
        }
        
        # Map locations to regions
        def map_to_region(location):
            if pd.isna(location):
                return "Unknown"
            
            for key, region in regions.items():
                if key.lower() in location.lower():
                    return region
            
            return "Other"
        
        df['Region'] = df['LOCATION'].apply(map_to_region)
        
        # Create regional summary
        regional_summary = df.groupby('Region').agg({
            'Lead ID': 'count',
            'Size (MW)': 'sum',
            'Potential Annual Savings (₦)': 'sum'
        }).reset_index()
        
        regional_summary.rename(columns={
            'Lead ID': 'Number of Leads',
            'Size (MW)': 'Total Power (MW)',
            'Potential Annual Savings (₦)': 'Total Savings (₦)'
        }, inplace=True)
        
        # Sort by number of leads
        regional_summary.sort_values('Number of Leads', ascending=False, inplace=True)
        
        dashboard_md += "| Region | Number of Leads | Total Power (MW) | Total Savings |\n"
        dashboard_md += "|--------|----------------|------------------|---------------|\n"
        
        for _, row in regional_summary.iterrows():
            region = row['Region']
            num_leads = row['Number of Leads']
            power = row['Total Power (MW)'] if pd.notna(row['Total Power (MW)']) else 0
            savings = row['Total Savings (₦)'] if pd.notna(row['Total Savings (₦)']) else 0
            
            dashboard_md += f"| {region} | {num_leads} | {power:.2f} | ₦{savings:,.0f} |\n"
        
        # Industry distribution
        dashboard_md += "\n## Industry Distribution\n\n"
        
        industry_counts = df['Industry'].value_counts()
        
        dashboard_md += "| Industry | Number of Leads | Percentage |\n"
        dashboard_md += "|----------|----------------|------------|\n"
        
        for industry, count in industry_counts.items():
            percentage = count / total_leads * 100
            dashboard_md += f"| {industry} | {count} | {percentage:.1f}% |\n"
        
        # Current IPP providers
        dashboard_md += "\n## Current IPP Providers\n\n"
        
        ipp_counts = df['IPP Provider'].value_counts()
        
        dashboard_md += "| Provider | Number of Clients |\n"
        dashboard_md += "|----------|-------------------|\n"
        
        for provider, count in ipp_counts.items():
            if pd.notna(provider) and provider:
                dashboard_md += f"| {provider} | {count} |\n"
        
        # Power size distribution
        dashboard_md += "\n## Power Size Distribution\n\n"
        
        size_counts = df['Size Category'].value_counts()
        
        dashboard_md += "| Size Category | Count | Percentage |\n"
        dashboard_md += "|---------------|-------|------------|\n"
        
        for size, count in size_counts.items():
            if pd.notna(size):
                percentage = count / total_leads * 100
                dashboard_md += f"| {size} | {count} | {percentage:.1f}% |\n"
        
        # High-priority leads
        dashboard_md += "\n## High-Priority Leads\n\n"
        
        high_priority_leads = df[df['Priority'] == 'A'].sort_values('Size (MW)', ascending=False)
        
        dashboard_md += "| Lead ID | Company | Location | Power (MW) | Current Provider |\n"
        dashboard_md += "|---------|---------|----------|------------|------------------|\n"
        
        for _, row in high_priority_leads.iterrows():
            lead_id = row['Lead ID']
            company = row['CLIENT'] if pd.notna(row['CLIENT']) else 'N/A'
            location = row['LOCATION'] if pd.notna(row['LOCATION']) else 'N/A'
            power = row['Size (MW)'] if pd.notna(row['Size (MW)']) else 0
            provider = row['IPP Provider'] if pd.notna(row['IPP Provider']) else 'None'
            
            dashboard_md += f"| {lead_id} | {company} | {location} | {power:.2f} | {provider} |\n"
        
        # Write to file
        dashboard_file = "../Database/TestResults/gas_leads_dashboard.md"
        with open(dashboard_file, 'w') as f:
            f.write(dashboard_md)
        
        print(f"Created dashboard at {dashboard_file}")
        
        # Create a short executive summary
        create_executive_summary(df, high_priority)
        
        return dashboard_md
    
    except Exception as e:
        print(f"Error creating dashboard: {str(e)}")
        return None

def create_executive_summary(df, high_priority_count):
    """Create a short executive summary for management"""
    
    summary_md = "# Gas IPP Leads - Executive Summary\n\n"
    summary_md += f"*Generated on {datetime.now().strftime('%Y-%m-%d')}*\n\n"
    
    # Key metrics
    total_leads = len(df)
    total_power_mw = df['Size (MW)'].sum()
    total_savings = df['Potential Annual Savings (₦)'].sum()
    
    summary_md += "## Overview\n\n"
    summary_md += f"We have identified **{total_leads} potential clients** for our gas IPP solutions, "
    summary_md += f"with a combined power requirement of **{total_power_mw:.2f} MW**.\n\n"
    
    summary_md += f"These clients currently spend approximately **₦{df['Annual Power Cost (₦)'].sum():,.0f}** "
    summary_md += f"annually on power. By implementing our solutions, we can help them save "
    summary_md += f"about **₦{total_savings:,.0f}** per year.\n\n"
    
    summary_md += "## Key Opportunities\n\n"
    
    # Get top 3 clients by power
    top_clients = df.sort_values('Size (MW)', ascending=False).head(3)
    
    summary_md += "Our top 3 opportunities by power requirement are:\n\n"
    
    for _, row in top_clients.iterrows():
        company = row['CLIENT'] if pd.notna(row['CLIENT']) else 'Unnamed Client'
        power = row['Size (MW)'] if pd.notna(row['Size (MW)']) else 0
        savings = row['Potential Annual Savings (₦)'] if pd.notna(row['Potential Annual Savings (₦)']) else 0
        
        summary_md += f"- **{company}** ({power:.2f} MW) - Potential annual savings of ₦{savings:,.0f}\n"
    
    # Regional focus
    summary_md += "\n## Regional Focus\n\n"
    
    # Define regions in Nigeria
    regions = {
        'Lagos': 'Southwest',
        'Ikeja': 'Southwest',
        'Ibadan': 'Southwest',
        'Sagamu': 'Southwest',
        'Ijebu': 'Southwest',
        'Abuja': 'FCT',
        'Nassarawa': 'North Central',
        'Kano': 'Northwest',
        'Enugu': 'Southeast',
        'Calabar': 'South-South',
        'Asaba': 'South-South',
        'Sunti': 'North Central'
    }
    
    # Map locations to regions
    df['Region'] = df['LOCATION'].apply(lambda loc: 
        next((region for key, region in regions.items() if pd.notna(loc) and key.lower() in loc.lower()), "Other"))
    
    # Get top region
    top_region = df.groupby('Region')['Size (MW)'].sum().idxmax()
    region_power = df[df['Region'] == top_region]['Size (MW)'].sum()
    region_count = len(df[df['Region'] == top_region])
    
    summary_md += f"The **{top_region}** region represents our strongest market with "
    summary_md += f"**{region_count} clients** and total power requirement of **{region_power:.2f} MW**.\n\n"
    
    # Next steps
    summary_md += "## Recommended Next Steps\n\n"
    
    summary_md += f"1. **Prioritize high-value leads**: Focus on the {high_priority_count} high-priority leads identified\n"
    summary_md += f"2. **Regional expansion**: Leverage our strong presence in the {top_region} to expand to neighboring regions\n"
    summary_md += "3. **Competition analysis**: Develop strategies to win clients from current providers, especially Junaid\n"
    summary_md += "4. **Custom solutions**: Develop tailored proposals for each high-priority client\n"
    
    # Save to file
    summary_file = "../Database/TestResults/gas_leads_executive_summary.md"
    with open(summary_file, 'w') as f:
        f.write(summary_md)
    
    print(f"Created executive summary at {summary_file}")

def main():
    print("Creating Gas Leads Dashboard...\n")
    create_dashboard()

if __name__ == "__main__":
    main() 