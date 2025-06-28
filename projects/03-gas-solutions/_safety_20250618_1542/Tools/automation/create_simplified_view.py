#!/usr/bin/env python3
"""
Script to create a simplified version of the leads database for business users
"""
import pandas as pd
import os
from datetime import datetime

def create_simplified_view():
    """Create a simplified view of the Gas Leads Database"""
    # Input file (the enriched database we created)
    input_file = "../Database/TestResults/gas_leads_database.csv"
    
    try:
        # Read the enriched database
        df = pd.read_csv(input_file)
        print(f"Loaded {len(df)} leads from the database")
        
        # Create a simplified version with just the essential columns
        simplified = df[[
            'Lead ID', 
            'CLIENT', 
            'Industry',
            'LOCATION', 
            'Size (MW)',
            'Size Category',
            'Annual Power Cost (₦)',
            'Potential Annual Savings (₦)',
            'IPP Provider',
            'Priority',
            'Status'
        ]].copy()
        
        # Rename columns to more business-friendly names
        simplified.rename(columns={
            'CLIENT': 'Company Name',
            'LOCATION': 'Location',
            'Size (MW)': 'Power Needed (MW)',
            'IPP Provider': 'Current Provider',
            'Annual Power Cost (₦)': 'Annual Power Cost (₦)',
            'Potential Annual Savings (₦)': 'Annual Savings (₦)'
        }, inplace=True)
        
        # Format the financial columns to be more readable
        def format_naira(value):
            if pd.isna(value):
                return ""
            return f"₦{value:,.0f}"
        
        simplified['Annual Power Cost (₦)'] = simplified['Annual Power Cost (₦)'].apply(format_naira)
        simplified['Annual Savings (₦)'] = simplified['Annual Savings (₦)'].apply(format_naira)
        
        # Format power values
        def format_power(value):
            if pd.isna(value):
                return ""
            return f"{value:,.1f}"
        
        simplified['Power Needed (MW)'] = simplified['Power Needed (MW)'].apply(format_power)
        
        # Add a simpler status column
        def format_status(status, priority):
            if pd.isna(status) or pd.isna(priority):
                return "New Lead"
            
            if priority == 'A':
                return "High Priority"
            elif priority == 'B':
                return "Medium Priority"
            elif priority == 'C':
                return "Low Priority"
            else:
                return "New Lead"
        
        simplified['Business Status'] = simplified.apply(
            lambda row: format_status(row['Status'], row['Priority']), axis=1
        )
        
        # Sort by priority and power needed
        simplified.sort_values(['Priority', 'Power Needed (MW)'], 
                              ascending=[True, False], 
                              na_position='last', 
                              inplace=True)
        
        # Save to Excel with formatting
        output_file = "../Database/TestResults/gas_leads_business_view.xlsx"
        simplified.to_excel(output_file, index=False)
        print(f"Saved simplified business view to {output_file}")
        
        # Also save as CSV
        csv_file = "../Database/TestResults/gas_leads_business_view.csv"
        simplified.to_csv(csv_file, index=False)
        print(f"Saved CSV version to {csv_file}")
        
        # Create a regional breakdown
        create_regional_breakdown(df)
        
        return simplified
    
    except Exception as e:
        print(f"Error creating simplified view: {str(e)}")
        return None

def create_regional_breakdown(df):
    """Create a regional breakdown of leads"""
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
        'Potential Annual Savings (₦)': 'Total Potential Savings (₦)'
    }, inplace=True)
    
    # Format numbers
    regional_summary['Total Power (MW)'] = regional_summary['Total Power (MW)'].apply(
        lambda x: f"{x:,.2f}" if pd.notna(x) else "0.00"
    )
    
    regional_summary['Total Potential Savings (₦)'] = regional_summary['Total Potential Savings (₦)'].apply(
        lambda x: f"₦{x:,.0f}" if pd.notna(x) else "₦0"
    )
    
    # Sort by number of leads
    regional_summary.sort_values('Number of Leads', ascending=False, inplace=True)
    
    # Save to Excel
    output_file = "../Database/TestResults/gas_leads_regional_breakdown.xlsx"
    regional_summary.to_excel(output_file, index=False)
    print(f"Saved regional breakdown to {output_file}")
    
    # Create a markdown report
    md_content = "# Regional Breakdown of Gas Leads\n\n"
    md_content += f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n"
    
    md_content += "| Region | Number of Leads | Total Power (MW) | Total Potential Savings |\n"
    md_content += "|--------|----------------|------------------|-------------------------|\n"
    
    for _, row in regional_summary.iterrows():
        md_content += f"| {row['Region']} | {row['Number of Leads']} | {row['Total Power (MW)']} | {row['Total Potential Savings (₦)']} |\n"
    
    # Save markdown report
    md_file = "../Database/TestResults/gas_leads_regional_breakdown.md"
    with open(md_file, 'w') as f:
        f.write(md_content)
    
    print(f"Saved regional breakdown report to {md_file}")

def main():
    print("Creating simplified business view of Gas Leads Database...\n")
    create_simplified_view()

if __name__ == "__main__":
    main() 
"""
Script to create a simplified version of the leads database for business users
"""
import pandas as pd
import os
from datetime import datetime

def create_simplified_view():
    """Create a simplified view of the Gas Leads Database"""
    # Input file (the enriched database we created)
    input_file = "../Database/TestResults/gas_leads_database.csv"
    
    try:
        # Read the enriched database
        df = pd.read_csv(input_file)
        print(f"Loaded {len(df)} leads from the database")
        
        # Create a simplified version with just the essential columns
        simplified = df[[
            'Lead ID', 
            'CLIENT', 
            'Industry',
            'LOCATION', 
            'Size (MW)',
            'Size Category',
            'Annual Power Cost (₦)',
            'Potential Annual Savings (₦)',
            'IPP Provider',
            'Priority',
            'Status'
        ]].copy()
        
        # Rename columns to more business-friendly names
        simplified.rename(columns={
            'CLIENT': 'Company Name',
            'LOCATION': 'Location',
            'Size (MW)': 'Power Needed (MW)',
            'IPP Provider': 'Current Provider',
            'Annual Power Cost (₦)': 'Annual Power Cost (₦)',
            'Potential Annual Savings (₦)': 'Annual Savings (₦)'
        }, inplace=True)
        
        # Format the financial columns to be more readable
        def format_naira(value):
            if pd.isna(value):
                return ""
            return f"₦{value:,.0f}"
        
        simplified['Annual Power Cost (₦)'] = simplified['Annual Power Cost (₦)'].apply(format_naira)
        simplified['Annual Savings (₦)'] = simplified['Annual Savings (₦)'].apply(format_naira)
        
        # Format power values
        def format_power(value):
            if pd.isna(value):
                return ""
            return f"{value:,.1f}"
        
        simplified['Power Needed (MW)'] = simplified['Power Needed (MW)'].apply(format_power)
        
        # Add a simpler status column
        def format_status(status, priority):
            if pd.isna(status) or pd.isna(priority):
                return "New Lead"
            
            if priority == 'A':
                return "High Priority"
            elif priority == 'B':
                return "Medium Priority"
            elif priority == 'C':
                return "Low Priority"
            else:
                return "New Lead"
        
        simplified['Business Status'] = simplified.apply(
            lambda row: format_status(row['Status'], row['Priority']), axis=1
        )
        
        # Sort by priority and power needed
        simplified.sort_values(['Priority', 'Power Needed (MW)'], 
                              ascending=[True, False], 
                              na_position='last', 
                              inplace=True)
        
        # Save to Excel with formatting
        output_file = "../Database/TestResults/gas_leads_business_view.xlsx"
        simplified.to_excel(output_file, index=False)
        print(f"Saved simplified business view to {output_file}")
        
        # Also save as CSV
        csv_file = "../Database/TestResults/gas_leads_business_view.csv"
        simplified.to_csv(csv_file, index=False)
        print(f"Saved CSV version to {csv_file}")
        
        # Create a regional breakdown
        create_regional_breakdown(df)
        
        return simplified
    
    except Exception as e:
        print(f"Error creating simplified view: {str(e)}")
        return None

def create_regional_breakdown(df):
    """Create a regional breakdown of leads"""
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
        'Potential Annual Savings (₦)': 'Total Potential Savings (₦)'
    }, inplace=True)
    
    # Format numbers
    regional_summary['Total Power (MW)'] = regional_summary['Total Power (MW)'].apply(
        lambda x: f"{x:,.2f}" if pd.notna(x) else "0.00"
    )
    
    regional_summary['Total Potential Savings (₦)'] = regional_summary['Total Potential Savings (₦)'].apply(
        lambda x: f"₦{x:,.0f}" if pd.notna(x) else "₦0"
    )
    
    # Sort by number of leads
    regional_summary.sort_values('Number of Leads', ascending=False, inplace=True)
    
    # Save to Excel
    output_file = "../Database/TestResults/gas_leads_regional_breakdown.xlsx"
    regional_summary.to_excel(output_file, index=False)
    print(f"Saved regional breakdown to {output_file}")
    
    # Create a markdown report
    md_content = "# Regional Breakdown of Gas Leads\n\n"
    md_content += f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n"
    
    md_content += "| Region | Number of Leads | Total Power (MW) | Total Potential Savings |\n"
    md_content += "|--------|----------------|------------------|-------------------------|\n"
    
    for _, row in regional_summary.iterrows():
        md_content += f"| {row['Region']} | {row['Number of Leads']} | {row['Total Power (MW)']} | {row['Total Potential Savings (₦)']} |\n"
    
    # Save markdown report
    md_file = "../Database/TestResults/gas_leads_regional_breakdown.md"
    with open(md_file, 'w') as f:
        f.write(md_content)
    
    print(f"Saved regional breakdown report to {md_file}")

def main():
    print("Creating simplified business view of Gas Leads Database...\n")
    create_simplified_view()

if __name__ == "__main__":
    main() 