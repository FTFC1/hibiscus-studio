#!/usr/bin/env python3
"""
Script to extract and properly format leads from Gas Leads.xlsx
"""
import pandas as pd
import numpy as np
import os
import json
from datetime import datetime

# Industry mappings
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
    'mining': 'Mining',
    'airport': 'Transportation',
    'aviation': 'Transportation',
    'hospital': 'Healthcare',
    'smart city': 'Commercial Real Estate',
    'property': 'Commercial Real Estate',
    'bank': 'Financial Services',
    'refinery': 'Oil & Gas'
}

# Power requirement benchmarks by industry (in kW)
INDUSTRY_BENCHMARKS = {
    "Manufacturing": {
        "Small": 500,
        "Medium": 2000,
        "Large": 5000
    },
    "Hospitality": {
        "Small": 200,
        "Medium": 800,
        "Large": 2000
    },
    "Government": {
        "Small": 300,
        "Medium": 1000,
        "Large": 2500
    },
    "Mining": {
        "Small": 800,
        "Medium": 3000,
        "Large": 8000
    },
    "Transportation": {
        "Small": 500,
        "Medium": 2000,
        "Large": 5000
    },
    "Healthcare": {
        "Small": 300,
        "Medium": 1000,
        "Large": 3000
    },
    "Commercial Real Estate": {
        "Small": 400,
        "Medium": 1500,
        "Large": 4000
    },
    "Financial Services": {
        "Small": 200,
        "Medium": 800,
        "Large": 2000
    },
    "Oil & Gas": {
        "Small": 1000,
        "Medium": 4000,
        "Large": 10000
    },
    "Other": {
        "Small": 200,
        "Medium": 800,
        "Large": 2000
    }
}

def infer_industry(client_name, location=None):
    """Infer industry from client name and location"""
    if not isinstance(client_name, str):
        return "Other"
    
    client_lower = client_name.lower()
    
    # Check for exact matches in common Nigerian industries
    for keyword, industry in INDUSTRY_MAPPINGS.items():
        if keyword in client_lower:
            return industry
    
    # If no match, try some common Nigerian company patterns
    if "ltd" in client_lower or "limited" in client_lower:
        if "farm" in client_lower or "agro" in client_lower or "food" in client_lower:
            return "Agriculture"
        if "tech" in client_lower or "digital" in client_lower or "software" in client_lower:
            return "Technology"
    
    # Default for unidentified
    return "Other"

def estimate_size_category(power_mw=None):
    """Estimate company size based on power requirement"""
    if power_mw is None or pd.isna(power_mw):
        return "Medium"  # Default
    
    # Convert to kW for comparison
    power_kw = float(power_mw) * 1000
    
    if power_kw < 1000:
        return "Small"
    elif power_kw < 3000:
        return "Medium"
    else:
        return "Large"

def convert_mw_to_kw(power_mw):
    """Convert power from MW to kW"""
    if power_mw is None or pd.isna(power_mw):
        return None
    try:
        return float(power_mw) * 1000
    except ValueError:
        return None

def estimate_power_kw(row):
    """Estimate power in kW based on industry and size or provided MW"""
    if not pd.isna(row.get('Size (MW)', np.nan)):
        # If we have MW data, convert to kW
        return convert_mw_to_kw(row['Size (MW)'])
    
    # Otherwise estimate based on industry and size
    industry = row.get('Industry', 'Other')
    size = row.get('Size Category', 'Medium')
    
    if industry in INDUSTRY_BENCHMARKS and size in INDUSTRY_BENCHMARKS[industry]:
        return INDUSTRY_BENCHMARKS[industry][size]
    else:
        return INDUSTRY_BENCHMARKS["Other"]["Medium"]

def extract_sheet1_leads():
    """Extract leads from Sheet1 of Gas Leads.xlsx"""
    input_file = "../Database/Gas Leads.xlsx"
    
    try:
        # Read from sheet1 (index 0) with header row 1
        df = pd.read_excel(input_file, sheet_name=0, header=1)
        print(f"Sheet1: Found {len(df)} potential leads")
        
        # Filter out rows with NaN in critical columns
        df = df.dropna(subset=['INDUSTRY/MINISTRY'], how='all')
        print(f"After filtering: {len(df)} leads with industry/ministry info")
        
        # Format into a standardized leads dataframe
        leads_df = pd.DataFrame()
        leads_df['Company Name'] = df['INDUSTRY/MINISTRY']
        leads_df['Location'] = df['LOCATION']
        leads_df['Required Power'] = df['Required Power']
        leads_df['Notes'] = df['Remark']
        
        # Clean up and add derived columns
        leads_df['Industry'] = leads_df['Company Name'].apply(lambda x: infer_industry(x))
        
        # Parse power requirements properly
        def parse_power_mw(power_str):
            if power_str is None or pd.isna(power_str):
                return None
            
            power_str = str(power_str).strip().upper()
            if 'MW' in power_str:
                try:
                    # Extract numeric part
                    numeric_part = power_str.replace('MW', '').strip()
                    return float(numeric_part)
                except ValueError:
                    return None
            return None
        
        # Parse power and convert to standard units
        leads_df['Power_MW'] = leads_df['Required Power'].apply(parse_power_mw)
        leads_df['Size Category'] = leads_df['Power_MW'].apply(estimate_size_category)
        leads_df['Power (kW)'] = leads_df['Power_MW'].apply(lambda x: convert_mw_to_kw(x))
        
        # Add a source column
        leads_df['Source'] = 'Sheet1'
        
        return leads_df
    
    except Exception as e:
        print(f"Error extracting Sheet1 leads: {str(e)}")
        return pd.DataFrame()

def extract_sheet3_leads():
    """Extract leads from Sheet3 of Gas Leads.xlsx"""
    input_file = "../Database/Gas Leads.xlsx"
    
    try:
        # Read from sheet3 (index 1) with header row 1
        df = pd.read_excel(input_file, sheet_name=1, header=1)
        print(f"Sheet3: Found {len(df)} potential leads")
        
        # Filter out rows with NaN in critical columns
        df = df.dropna(subset=['CLIENT'], how='all')
        print(f"After filtering: {len(df)} leads with client info")
        
        # Format into a standardized leads dataframe
        leads_df = pd.DataFrame()
        leads_df['Company Name'] = df['CLIENT']
        leads_df['Location'] = df['LOCATION']
        leads_df['Required Power'] = df['Size (MW)']
        leads_df['Current Provider'] = df['IPP Provider']
        leads_df['Equipment'] = df['Engines Required']
        leads_df['Priority'] = df['Priority']
        
        # Clean up and add derived columns
        leads_df['Industry'] = leads_df['Company Name'].apply(lambda x: infer_industry(x))
        leads_df['Size Category'] = leads_df['Required Power'].apply(lambda x: estimate_size_category(x))
        leads_df['Power (kW)'] = leads_df['Required Power'].apply(lambda x: convert_mw_to_kw(x))
        
        # Add a source column
        leads_df['Source'] = 'Sheet3'
        
        return leads_df
    
    except Exception as e:
        print(f"Error extracting Sheet3 leads: {str(e)}")
        return pd.DataFrame()

def extract_sheet2_trip_report():
    """Extract company mentions from the trip report in Sheet2"""
    input_file = "../Database/Gas Leads.xlsx"
    
    try:
        # Read from sheet2 (index 2) as text
        df = pd.read_excel(input_file, sheet_name=2, header=None)
        print(f"Sheet2: Found {len(df)} rows in trip report")
        
        # The report is likely in a single column
        if len(df.columns) == 1:
            # Extract text content
            report_text = '\n'.join([str(x) for x in df[0].dropna().tolist()])
            
            # Look for company mentions
            companies = []
            
            # Known companies from the report text
            company_keywords = [
                "Kaima Group", "Smart City", 
                "Manufacturers Association", "MAN",
                "Kursi Mining Group", "Mining",
                "Nigeria Immigration Service",
                "Ministry of Defence", "Military",
                "Lithium mine",
                "Aviation", "Airports"
            ]
            
            # Simple extraction - find lines with company mentions
            lines = report_text.split('\n')
            for line in lines:
                for company in company_keywords:
                    if company.lower() in line.lower():
                        # Extract some context
                        companies.append({
                            'Company Name': company,
                            'Context': line.strip(),
                            'Source': 'Trip Report'
                        })
                        break
            
            # Convert to DataFrame
            if companies:
                trip_df = pd.DataFrame(companies)
                
                # Add industry and infer power needs if mentioned
                trip_df['Industry'] = trip_df['Company Name'].apply(lambda x: infer_industry(x))
                trip_df['Size Category'] = 'Medium'  # Default
                
                # Look for power mentions
                def extract_power(context):
                    if "100MW" in context:
                        return 100
                    elif "10MW" in context:
                        return 10
                    else:
                        return None
                
                trip_df['Required Power'] = trip_df['Context'].apply(extract_power)
                trip_df['Power (kW)'] = trip_df.apply(lambda row: 
                    convert_mw_to_kw(row['Required Power']) if not pd.isna(row.get('Required Power')) 
                    else estimate_power_kw(row), axis=1)
                
                print(f"Found {len(trip_df)} company mentions in trip report")
                return trip_df
            else:
                print("No company mentions found in trip report")
                return pd.DataFrame()
    
    except Exception as e:
        print(f"Error extracting trip report leads: {str(e)}")
        return pd.DataFrame()

def combine_leads():
    """Combine leads from all sources into a single DataFrame"""
    # Extract leads from different sheets
    sheet1_leads = extract_sheet1_leads()
    sheet3_leads = extract_sheet3_leads()
    trip_report_leads = extract_sheet2_trip_report()
    
    # Combine all leads
    all_leads = pd.concat([sheet1_leads, sheet3_leads, trip_report_leads], ignore_index=True)
    
    # Fill in missing power estimates
    all_leads['Power (kW)'] = all_leads.apply(
        lambda row: row.get('Power (kW)') if pd.notna(row.get('Power (kW)')) 
        else estimate_power_kw(row), axis=1)
    
    # Calculate cost metrics (using same assumptions as earlier script)
    GRID_COST_PER_KWH = 60  # Naira per kWh
    DIESEL_COST_PER_KWH = 150  # Naira per kWh
    IPP_DISCOUNT = 0.35  # 35% savings on energy costs
    
    def estimate_current_cost(power_kw):
        if power_kw is None or pd.isna(power_kw):
            return None
        
        # Assume a mix of grid and diesel
        grid_hours = 12  # hours per day
        diesel_hours = 12  # hours per day
        operational_days = 313  # days per year (6 days/week, minus holidays)
        
        # Utilization factor (not running at full capacity all the time)
        utilization = 0.7
        
        # Calculate costs
        annual_grid_cost = power_kw * grid_hours * operational_days * GRID_COST_PER_KWH * utilization
        annual_diesel_cost = power_kw * diesel_hours * operational_days * DIESEL_COST_PER_KWH * utilization
        
        return annual_grid_cost + annual_diesel_cost
    
    def estimate_ipp_savings(current_cost):
        if current_cost is None or pd.isna(current_cost):
            return None
        return current_cost * IPP_DISCOUNT
    
    # Add cost calculations
    all_leads['Annual Power Cost (₦)'] = all_leads['Power (kW)'].apply(estimate_current_cost)
    all_leads['Annual Savings (₦)'] = all_leads['Annual Power Cost (₦)'].apply(estimate_ipp_savings)
    
    # Add company IDs
    all_leads['Company ID'] = [f"MIK{i+1:03d}" for i in range(len(all_leads))]
    
    # Add status and timestamp
    all_leads['Status'] = 'New'
    all_leads['Created Date'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    return all_leads

def main():
    """Extract and save properly structured leads from Gas Leads.xlsx"""
    # Create TestResults directory if it doesn't exist
    os.makedirs("../Database/TestResults", exist_ok=True)
    
    # Get combined leads
    all_leads = combine_leads()
    
    if len(all_leads) > 0:
        # Save to Excel
        output_file = "../Database/TestResults/properly_enriched_leads.xlsx"
        all_leads.to_excel(output_file, index=False)
        print(f"Saved {len(all_leads)} properly enriched leads to {output_file}")
        
        # Save to CSV
        csv_file = "../Database/TestResults/properly_enriched_leads.csv"
        all_leads.to_csv(csv_file, index=False)
        print(f"Saved {len(all_leads)} properly enriched leads to {csv_file}")
        
        # Generate a markdown summary
        md_content = "# Properly Enriched Gas Leads Summary\n\n"
        md_content += f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n"
        
        # Overall statistics
        md_content += "## Overall Statistics\n\n"
        md_content += f"- **Total Leads:** {len(all_leads)}\n"
        md_content += f"- **Total Estimated Power:** {all_leads['Power (kW)'].sum():,.0f} kW\n"
        
        # Only include financial stats if we have some values
        if not all_leads['Annual Power Cost (₦)'].isna().all():
            total_cost = all_leads['Annual Power Cost (₦)'].sum()
            total_savings = all_leads['Annual Savings (₦)'].sum()
            md_content += f"- **Total Current Annual Power Cost:** ₦{total_cost:,.0f}\n"
            md_content += f"- **Total Potential Annual Savings:** ₦{total_savings:,.0f}\n"
            md_content += f"- **Average Power per Lead:** {all_leads['Power (kW)'].mean():,.0f} kW\n"
            md_content += f"- **Average Annual Savings per Lead:** ₦{all_leads['Annual Savings (₦)'].mean():,.0f}\n"
        
        # Industry breakdown
        md_content += "\n## Industry Breakdown\n\n"
        md_content += "| Industry | Count | Total Power (kW) |\n"
        md_content += "|---------|-------|----------------|\n"
        
        industry_summary = all_leads.groupby('Industry').agg({
            'Power (kW)': 'sum',
            'Industry': 'count'
        }).rename(columns={'Industry': 'Count'})
        
        for industry, row in industry_summary.iterrows():
            md_content += f"| {industry} | {row['Count']} | {row['Power (kW)']:,.0f} |\n"
        
        # Source breakdown
        md_content += "\n## Source Breakdown\n\n"
        md_content += "| Source | Count |\n"
        md_content += "|--------|-------|\n"
        
        source_counts = all_leads['Source'].value_counts()
        for source, count in source_counts.items():
            md_content += f"| {source} | {count} |\n"
        
        # Top leads by power
        md_content += "\n## Top 10 Leads by Power Requirement\n\n"
        md_content += "| Company | Industry | Location | Power (kW) | Annual Savings (₦) |\n"
        md_content += "|---------|----------|----------|------------|-------------------|\n"
        
        top_by_power = all_leads.sort_values('Power (kW)', ascending=False).head(10)
        for _, row in top_by_power.iterrows():
            annual_savings = f"₦{row['Annual Savings (₦)']:,.0f}" if pd.notna(row.get('Annual Savings (₦)')) else 'N/A'
            location = row.get('Location', 'Unknown')
            md_content += f"| {row['Company Name']} | {row['Industry']} | {location} | {row['Power (kW)']:,.0f} | {annual_savings} |\n"
        
        # Save markdown summary
        md_file = "../Database/TestResults/properly_enriched_leads_summary.md"
        with open(md_file, 'w', encoding='utf-8') as f:
            f.write(md_content)
        print(f"Generated summary report at {md_file}")
    else:
        print("No leads found or could be processed.")

if __name__ == "__main__":
    main() 