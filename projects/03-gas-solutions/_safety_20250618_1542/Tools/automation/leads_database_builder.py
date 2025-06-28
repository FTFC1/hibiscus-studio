#!/usr/bin/env python3
"""
Script to build a proper leads database from Sheet3 of Gas Leads.xlsx
"""
import pandas as pd
import os
import json
from datetime import datetime

# Industry mappings for Nigerian companies
INDUSTRY_MAPPINGS = {
    'printing': 'Manufacturing',
    'minting': 'Manufacturing',
    'wood': 'Manufacturing',
    'fmn': 'Manufacturing',
    'flour': 'Manufacturing',
    'hotel': 'Hospitality',
    'radisson': 'Hospitality',
    'dangote': 'Manufacturing',
    'cement': 'Manufacturing',
    'textile': 'Manufacturing',
    'military': 'Government',
    'defence': 'Government',
    'immigration': 'Government',
    'airport': 'Transportation',
    'aviation': 'Transportation',
    'hospital': 'Healthcare',
    'bank': 'Financial Services',
    'cbn': 'Financial Services',
    'power': 'Utilities',
    'oil': 'Oil & Gas',
    'gas': 'Oil & Gas',
}

def infer_industry(company_name):
    """Infer industry from company name"""
    if pd.isna(company_name) or not company_name:
        return "Other"
    
    company_lower = str(company_name).lower()
    
    for keyword, industry in INDUSTRY_MAPPINGS.items():
        if keyword in company_lower:
            return industry
    
    return "Other"

def estimate_annual_cost(power_mw):
    """Estimate annual power cost based on MW requirement"""
    if pd.isna(power_mw):
        return None
    
    # Convert MW to kW
    power_kw = float(power_mw) * 1000
    
    # Assumptions
    HOURS_PER_DAY = 24
    DAYS_PER_YEAR = 365
    AVG_LOAD_FACTOR = 0.75  # Most industrial clients don't run at 100% capacity all the time
    
    # Cost per kWh in Nigeria (in Naira)
    GRID_COST_PER_KWH = 60  # Average grid rate for industrial users
    DIESEL_COST_PER_KWH = 150  # Estimated cost when running diesel generators
    
    # Assume Nigerian businesses face grid outages and rely on diesel generators
    GRID_AVAILABILITY = 0.3  # 30% of the time on grid
    DIESEL_BACKUP = 0.7  # 70% of the time on diesel backup
    
    # Calculate annual cost
    grid_cost = power_kw * HOURS_PER_DAY * DAYS_PER_YEAR * AVG_LOAD_FACTOR * GRID_AVAILABILITY * GRID_COST_PER_KWH
    diesel_cost = power_kw * HOURS_PER_DAY * DAYS_PER_YEAR * AVG_LOAD_FACTOR * DIESEL_BACKUP * DIESEL_COST_PER_KWH
    
    total_annual_cost = grid_cost + diesel_cost
    return total_annual_cost

def estimate_ipp_savings(annual_cost):
    """Estimate potential savings from IPP solution"""
    if pd.isna(annual_cost) or not annual_cost:
        return None
    
    # Assumption: IPP provides ~35% savings compared to current mixed grid/diesel
    IPP_DISCOUNT = 0.35
    return annual_cost * IPP_DISCOUNT

def enrich_leads(df):
    """Enrich the leads data with additional valuable information"""
    if df is None or len(df) == 0:
        print("No data to enrich")
        return df
    
    # Create a copy to avoid modifying the original
    enriched_df = df.copy()
    
    # Add unique ID for each lead
    enriched_df['Lead ID'] = [f"MIK{i+1:03d}" for i in range(len(enriched_df))]
    
    # Add industry based on company name
    enriched_df['Industry'] = enriched_df['CLIENT'].apply(infer_industry)
    
    # Add size category based on power requirement
    def categorize_size(power_mw):
        if pd.isna(power_mw):
            return "Unknown"
        if power_mw < 5:
            return "Small"
        elif power_mw < 20:
            return "Medium"
        else:
            return "Large"
    
    enriched_df['Size Category'] = enriched_df['Size (MW)'].apply(categorize_size)
    
    # Add power in kilowatts for easier calculations
    enriched_df['Power (kW)'] = enriched_df['Size (MW)'].apply(lambda x: x * 1000 if pd.notna(x) else None)
    
    # Add financial information
    enriched_df['Annual Power Cost (₦)'] = enriched_df['Size (MW)'].apply(estimate_annual_cost)
    enriched_df['Potential Annual Savings (₦)'] = enriched_df['Annual Power Cost (₦)'].apply(estimate_ipp_savings)
    
    # Add status and date information
    enriched_df['Status'] = 'New Lead'
    enriched_df['Created Date'] = datetime.now().strftime("%Y-%m-%d")
    enriched_df['Last Updated'] = datetime.now().strftime("%Y-%m-%d")
    
    # Add competition status based on IPP Provider
    def get_competition_status(provider):
        if pd.isna(provider) or not provider:
            return "No current IPP"
        return f"Current provider: {provider}"
    
    enriched_df['Competition Status'] = enriched_df['IPP Provider'].apply(get_competition_status)
    
    # Add notes field for additional information
    enriched_df['Notes'] = ""
    
    # Reorder columns for better readability
    column_order = [
        'Lead ID', 'CLIENT', 'Industry', 'LOCATION', 'Size (MW)', 'Power (kW)', 
        'Size Category', 'Annual Power Cost (₦)', 'Potential Annual Savings (₦)',
        'IPP Provider', 'Competition Status', 'Engines Required', 'Priority', 
        'Status', 'Created Date', 'Last Updated', 'Notes'
    ]
    
    # Filter to only include columns that exist
    final_columns = [col for col in column_order if col in enriched_df.columns]
    
    return enriched_df[final_columns]

def extract_and_enrich():
    """Extract data from Sheet3 and create an enriched database"""
    input_file = "../Database/Gas Leads.xlsx"
    
    try:
        # Read Sheet3 with header=1
        df = pd.read_excel(input_file, sheet_name=1, header=1)
        print(f"Successfully read {len(df)} leads from Sheet3")
        
        # Enrich the data
        enriched_df = enrich_leads(df)
        print(f"Enriched {len(enriched_df)} leads with additional data")
        
        # Create output directory
        os.makedirs("../Database/TestResults", exist_ok=True)
        
        # Save to multiple formats for different uses
        # Excel file for general use
        excel_file = "../Database/TestResults/gas_leads_database.xlsx"
        enriched_df.to_excel(excel_file, index=False)
        print(f"Saved enriched database to {excel_file}")
        
        # CSV for data importing
        csv_file = "../Database/TestResults/gas_leads_database.csv"
        enriched_df.to_csv(csv_file, index=False)
        print(f"Saved CSV version to {csv_file}")
        
        # JSON for API/web use
        json_file = "../Database/TestResults/gas_leads_database.json"
        
        # Convert to dict with proper handling of NaN values
        leads_data = enriched_df.replace({pd.NA: None}).to_dict('records')
        
        with open(json_file, 'w') as f:
            json.dump(leads_data, f, indent=2)
        
        print(f"Saved JSON version to {json_file}")
        
        # Create a summary
        generate_summary(enriched_df)
        
        return enriched_df
    
    except Exception as e:
        print(f"Error creating leads database: {str(e)}")
        return None

def generate_summary(df):
    """Generate a summary of the leads database"""
    if df is None or len(df) == 0:
        return
    
    # Create a markdown summary report
    summary_md = "# Gas Leads Database Summary\n\n"
    summary_md += f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n"
    
    # Basic statistics
    summary_md += "## Overview\n\n"
    summary_md += f"- **Total Leads**: {len(df)}\n"
    
    if 'Size (MW)' in df.columns:
        total_power = df['Size (MW)'].sum()
        summary_md += f"- **Total Power Requirement**: {total_power:.2f} MW\n"
    
    if 'Annual Power Cost (₦)' in df.columns:
        total_cost = df['Annual Power Cost (₦)'].sum()
        summary_md += f"- **Total Annual Power Cost**: ₦{total_cost:,.2f}\n"
    
    if 'Potential Annual Savings (₦)' in df.columns:
        total_savings = df['Potential Annual Savings (₦)'].sum()
        summary_md += f"- **Total Potential Annual Savings**: ₦{total_savings:,.2f}\n"
    
    # Industry breakdown
    if 'Industry' in df.columns:
        summary_md += "\n## Industry Breakdown\n\n"
        summary_md += "| Industry | Count | Total Power (MW) | Potential Savings (₦) |\n"
        summary_md += "|----------|-------|-----------------|----------------------|\n"
        
        industry_groups = df.groupby('Industry').agg({
            'Industry': 'count',
            'Size (MW)': 'sum',
            'Potential Annual Savings (₦)': 'sum'
        }).rename(columns={'Industry': 'Count'})
        
        for industry, row in industry_groups.iterrows():
            power = row['Size (MW)'] if pd.notna(row['Size (MW)']) else 0
            savings = row['Potential Annual Savings (₦)'] if pd.notna(row['Potential Annual Savings (₦)']) else 0
            summary_md += f"| {industry} | {row['Count']} | {power:.2f} | ₦{savings:,.2f} |\n"
    
    # Location breakdown
    if 'LOCATION' in df.columns:
        summary_md += "\n## Location Breakdown\n\n"
        summary_md += "| Location | Count | Total Power (MW) |\n"
        summary_md += "|----------|-------|------------------|\n"
        
        location_groups = df.groupby('LOCATION').agg({
            'LOCATION': 'count',
            'Size (MW)': 'sum'
        }).rename(columns={'LOCATION': 'Count'})
        
        for location, row in location_groups.iterrows():
            power = row['Size (MW)'] if pd.notna(row['Size (MW)']) else 0
            summary_md += f"| {location} | {row['Count']} | {power:.2f} |\n"
    
    # Size category breakdown
    if 'Size Category' in df.columns:
        summary_md += "\n## Size Category Breakdown\n\n"
        summary_md += "| Size Category | Count | Total Power (MW) |\n"
        summary_md += "|---------------|-------|------------------|\n"
        
        size_groups = df.groupby('Size Category').agg({
            'Size Category': 'count',
            'Size (MW)': 'sum'
        }).rename(columns={'Size Category': 'Count'})
        
        for size, row in size_groups.iterrows():
            power = row['Size (MW)'] if pd.notna(row['Size (MW)']) else 0
            summary_md += f"| {size} | {row['Count']} | {power:.2f} |\n"
    
    # Priority breakdown
    if 'Priority' in df.columns:
        summary_md += "\n## Priority Breakdown\n\n"
        summary_md += "| Priority | Count | Total Power (MW) |\n"
        summary_md += "|----------|-------|------------------|\n"
        
        priority_groups = df.groupby('Priority').agg({
            'Priority': 'count',
            'Size (MW)': 'sum'
        }).rename(columns={'Priority': 'Count'})
        
        for priority, row in priority_groups.iterrows():
            if pd.notna(priority):
                power = row['Size (MW)'] if pd.notna(row['Size (MW)']) else 0
                summary_md += f"| {priority} | {row['Count']} | {power:.2f} |\n"
    
    # Top clients by power requirement
    summary_md += "\n## Top 10 Clients by Power Requirement\n\n"
    summary_md += "| Client | Industry | Location | Power (MW) | Annual Savings (₦) |\n"
    summary_md += "|--------|----------|----------|------------|-------------------|\n"
    
    top_power = df.sort_values('Size (MW)', ascending=False).head(10)
    for _, row in top_power.iterrows():
        client = row['CLIENT'] if pd.notna(row['CLIENT']) else 'N/A'
        industry = row['Industry'] if pd.notna(row['Industry']) else 'N/A'
        location = row['LOCATION'] if pd.notna(row['LOCATION']) else 'N/A'
        power = row['Size (MW)'] if pd.notna(row['Size (MW)']) else 0
        savings = row['Potential Annual Savings (₦)'] if pd.notna(row['Potential Annual Savings (₦)']) else 0
        
        summary_md += f"| {client} | {industry} | {location} | {power:.2f} | ₦{savings:,.2f} |\n"
    
    # Write summary to file
    summary_file = "../Database/TestResults/gas_leads_database_summary.md"
    with open(summary_file, 'w') as f:
        f.write(summary_md)
    
    print(f"Generated summary report at {summary_file}")

def main():
    print("Building Gas Leads Database from Sheet3...\n")
    extract_and_enrich()

if __name__ == "__main__":
    main() 
"""
Script to build a proper leads database from Sheet3 of Gas Leads.xlsx
"""
import pandas as pd
import os
import json
from datetime import datetime

# Industry mappings for Nigerian companies
INDUSTRY_MAPPINGS = {
    'printing': 'Manufacturing',
    'minting': 'Manufacturing',
    'wood': 'Manufacturing',
    'fmn': 'Manufacturing',
    'flour': 'Manufacturing',
    'hotel': 'Hospitality',
    'radisson': 'Hospitality',
    'dangote': 'Manufacturing',
    'cement': 'Manufacturing',
    'textile': 'Manufacturing',
    'military': 'Government',
    'defence': 'Government',
    'immigration': 'Government',
    'airport': 'Transportation',
    'aviation': 'Transportation',
    'hospital': 'Healthcare',
    'bank': 'Financial Services',
    'cbn': 'Financial Services',
    'power': 'Utilities',
    'oil': 'Oil & Gas',
    'gas': 'Oil & Gas',
}

def infer_industry(company_name):
    """Infer industry from company name"""
    if pd.isna(company_name) or not company_name:
        return "Other"
    
    company_lower = str(company_name).lower()
    
    for keyword, industry in INDUSTRY_MAPPINGS.items():
        if keyword in company_lower:
            return industry
    
    return "Other"

def estimate_annual_cost(power_mw):
    """Estimate annual power cost based on MW requirement"""
    if pd.isna(power_mw):
        return None
    
    # Convert MW to kW
    power_kw = float(power_mw) * 1000
    
    # Assumptions
    HOURS_PER_DAY = 24
    DAYS_PER_YEAR = 365
    AVG_LOAD_FACTOR = 0.75  # Most industrial clients don't run at 100% capacity all the time
    
    # Cost per kWh in Nigeria (in Naira)
    GRID_COST_PER_KWH = 60  # Average grid rate for industrial users
    DIESEL_COST_PER_KWH = 150  # Estimated cost when running diesel generators
    
    # Assume Nigerian businesses face grid outages and rely on diesel generators
    GRID_AVAILABILITY = 0.3  # 30% of the time on grid
    DIESEL_BACKUP = 0.7  # 70% of the time on diesel backup
    
    # Calculate annual cost
    grid_cost = power_kw * HOURS_PER_DAY * DAYS_PER_YEAR * AVG_LOAD_FACTOR * GRID_AVAILABILITY * GRID_COST_PER_KWH
    diesel_cost = power_kw * HOURS_PER_DAY * DAYS_PER_YEAR * AVG_LOAD_FACTOR * DIESEL_BACKUP * DIESEL_COST_PER_KWH
    
    total_annual_cost = grid_cost + diesel_cost
    return total_annual_cost

def estimate_ipp_savings(annual_cost):
    """Estimate potential savings from IPP solution"""
    if pd.isna(annual_cost) or not annual_cost:
        return None
    
    # Assumption: IPP provides ~35% savings compared to current mixed grid/diesel
    IPP_DISCOUNT = 0.35
    return annual_cost * IPP_DISCOUNT

def enrich_leads(df):
    """Enrich the leads data with additional valuable information"""
    if df is None or len(df) == 0:
        print("No data to enrich")
        return df
    
    # Create a copy to avoid modifying the original
    enriched_df = df.copy()
    
    # Add unique ID for each lead
    enriched_df['Lead ID'] = [f"MIK{i+1:03d}" for i in range(len(enriched_df))]
    
    # Add industry based on company name
    enriched_df['Industry'] = enriched_df['CLIENT'].apply(infer_industry)
    
    # Add size category based on power requirement
    def categorize_size(power_mw):
        if pd.isna(power_mw):
            return "Unknown"
        if power_mw < 5:
            return "Small"
        elif power_mw < 20:
            return "Medium"
        else:
            return "Large"
    
    enriched_df['Size Category'] = enriched_df['Size (MW)'].apply(categorize_size)
    
    # Add power in kilowatts for easier calculations
    enriched_df['Power (kW)'] = enriched_df['Size (MW)'].apply(lambda x: x * 1000 if pd.notna(x) else None)
    
    # Add financial information
    enriched_df['Annual Power Cost (₦)'] = enriched_df['Size (MW)'].apply(estimate_annual_cost)
    enriched_df['Potential Annual Savings (₦)'] = enriched_df['Annual Power Cost (₦)'].apply(estimate_ipp_savings)
    
    # Add status and date information
    enriched_df['Status'] = 'New Lead'
    enriched_df['Created Date'] = datetime.now().strftime("%Y-%m-%d")
    enriched_df['Last Updated'] = datetime.now().strftime("%Y-%m-%d")
    
    # Add competition status based on IPP Provider
    def get_competition_status(provider):
        if pd.isna(provider) or not provider:
            return "No current IPP"
        return f"Current provider: {provider}"
    
    enriched_df['Competition Status'] = enriched_df['IPP Provider'].apply(get_competition_status)
    
    # Add notes field for additional information
    enriched_df['Notes'] = ""
    
    # Reorder columns for better readability
    column_order = [
        'Lead ID', 'CLIENT', 'Industry', 'LOCATION', 'Size (MW)', 'Power (kW)', 
        'Size Category', 'Annual Power Cost (₦)', 'Potential Annual Savings (₦)',
        'IPP Provider', 'Competition Status', 'Engines Required', 'Priority', 
        'Status', 'Created Date', 'Last Updated', 'Notes'
    ]
    
    # Filter to only include columns that exist
    final_columns = [col for col in column_order if col in enriched_df.columns]
    
    return enriched_df[final_columns]

def extract_and_enrich():
    """Extract data from Sheet3 and create an enriched database"""
    input_file = "../Database/Gas Leads.xlsx"
    
    try:
        # Read Sheet3 with header=1
        df = pd.read_excel(input_file, sheet_name=1, header=1)
        print(f"Successfully read {len(df)} leads from Sheet3")
        
        # Enrich the data
        enriched_df = enrich_leads(df)
        print(f"Enriched {len(enriched_df)} leads with additional data")
        
        # Create output directory
        os.makedirs("../Database/TestResults", exist_ok=True)
        
        # Save to multiple formats for different uses
        # Excel file for general use
        excel_file = "../Database/TestResults/gas_leads_database.xlsx"
        enriched_df.to_excel(excel_file, index=False)
        print(f"Saved enriched database to {excel_file}")
        
        # CSV for data importing
        csv_file = "../Database/TestResults/gas_leads_database.csv"
        enriched_df.to_csv(csv_file, index=False)
        print(f"Saved CSV version to {csv_file}")
        
        # JSON for API/web use
        json_file = "../Database/TestResults/gas_leads_database.json"
        
        # Convert to dict with proper handling of NaN values
        leads_data = enriched_df.replace({pd.NA: None}).to_dict('records')
        
        with open(json_file, 'w') as f:
            json.dump(leads_data, f, indent=2)
        
        print(f"Saved JSON version to {json_file}")
        
        # Create a summary
        generate_summary(enriched_df)
        
        return enriched_df
    
    except Exception as e:
        print(f"Error creating leads database: {str(e)}")
        return None

def generate_summary(df):
    """Generate a summary of the leads database"""
    if df is None or len(df) == 0:
        return
    
    # Create a markdown summary report
    summary_md = "# Gas Leads Database Summary\n\n"
    summary_md += f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n"
    
    # Basic statistics
    summary_md += "## Overview\n\n"
    summary_md += f"- **Total Leads**: {len(df)}\n"
    
    if 'Size (MW)' in df.columns:
        total_power = df['Size (MW)'].sum()
        summary_md += f"- **Total Power Requirement**: {total_power:.2f} MW\n"
    
    if 'Annual Power Cost (₦)' in df.columns:
        total_cost = df['Annual Power Cost (₦)'].sum()
        summary_md += f"- **Total Annual Power Cost**: ₦{total_cost:,.2f}\n"
    
    if 'Potential Annual Savings (₦)' in df.columns:
        total_savings = df['Potential Annual Savings (₦)'].sum()
        summary_md += f"- **Total Potential Annual Savings**: ₦{total_savings:,.2f}\n"
    
    # Industry breakdown
    if 'Industry' in df.columns:
        summary_md += "\n## Industry Breakdown\n\n"
        summary_md += "| Industry | Count | Total Power (MW) | Potential Savings (₦) |\n"
        summary_md += "|----------|-------|-----------------|----------------------|\n"
        
        industry_groups = df.groupby('Industry').agg({
            'Industry': 'count',
            'Size (MW)': 'sum',
            'Potential Annual Savings (₦)': 'sum'
        }).rename(columns={'Industry': 'Count'})
        
        for industry, row in industry_groups.iterrows():
            power = row['Size (MW)'] if pd.notna(row['Size (MW)']) else 0
            savings = row['Potential Annual Savings (₦)'] if pd.notna(row['Potential Annual Savings (₦)']) else 0
            summary_md += f"| {industry} | {row['Count']} | {power:.2f} | ₦{savings:,.2f} |\n"
    
    # Location breakdown
    if 'LOCATION' in df.columns:
        summary_md += "\n## Location Breakdown\n\n"
        summary_md += "| Location | Count | Total Power (MW) |\n"
        summary_md += "|----------|-------|------------------|\n"
        
        location_groups = df.groupby('LOCATION').agg({
            'LOCATION': 'count',
            'Size (MW)': 'sum'
        }).rename(columns={'LOCATION': 'Count'})
        
        for location, row in location_groups.iterrows():
            power = row['Size (MW)'] if pd.notna(row['Size (MW)']) else 0
            summary_md += f"| {location} | {row['Count']} | {power:.2f} |\n"
    
    # Size category breakdown
    if 'Size Category' in df.columns:
        summary_md += "\n## Size Category Breakdown\n\n"
        summary_md += "| Size Category | Count | Total Power (MW) |\n"
        summary_md += "|---------------|-------|------------------|\n"
        
        size_groups = df.groupby('Size Category').agg({
            'Size Category': 'count',
            'Size (MW)': 'sum'
        }).rename(columns={'Size Category': 'Count'})
        
        for size, row in size_groups.iterrows():
            power = row['Size (MW)'] if pd.notna(row['Size (MW)']) else 0
            summary_md += f"| {size} | {row['Count']} | {power:.2f} |\n"
    
    # Priority breakdown
    if 'Priority' in df.columns:
        summary_md += "\n## Priority Breakdown\n\n"
        summary_md += "| Priority | Count | Total Power (MW) |\n"
        summary_md += "|----------|-------|------------------|\n"
        
        priority_groups = df.groupby('Priority').agg({
            'Priority': 'count',
            'Size (MW)': 'sum'
        }).rename(columns={'Priority': 'Count'})
        
        for priority, row in priority_groups.iterrows():
            if pd.notna(priority):
                power = row['Size (MW)'] if pd.notna(row['Size (MW)']) else 0
                summary_md += f"| {priority} | {row['Count']} | {power:.2f} |\n"
    
    # Top clients by power requirement
    summary_md += "\n## Top 10 Clients by Power Requirement\n\n"
    summary_md += "| Client | Industry | Location | Power (MW) | Annual Savings (₦) |\n"
    summary_md += "|--------|----------|----------|------------|-------------------|\n"
    
    top_power = df.sort_values('Size (MW)', ascending=False).head(10)
    for _, row in top_power.iterrows():
        client = row['CLIENT'] if pd.notna(row['CLIENT']) else 'N/A'
        industry = row['Industry'] if pd.notna(row['Industry']) else 'N/A'
        location = row['LOCATION'] if pd.notna(row['LOCATION']) else 'N/A'
        power = row['Size (MW)'] if pd.notna(row['Size (MW)']) else 0
        savings = row['Potential Annual Savings (₦)'] if pd.notna(row['Potential Annual Savings (₦)']) else 0
        
        summary_md += f"| {client} | {industry} | {location} | {power:.2f} | ₦{savings:,.2f} |\n"
    
    # Write summary to file
    summary_file = "../Database/TestResults/gas_leads_database_summary.md"
    with open(summary_file, 'w') as f:
        f.write(summary_md)
    
    print(f"Generated summary report at {summary_file}")

def main():
    print("Building Gas Leads Database from Sheet3...\n")
    extract_and_enrich()

if __name__ == "__main__":
    main() 