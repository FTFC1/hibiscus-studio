#!/usr/bin/env python3
"""
Lead Enrichment Script for Gas Leads.xlsx
Adds power estimates, cost calculations, and priority scoring.
"""

import pandas as pd
import numpy as np
from datetime import datetime
import re
import os

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
    "Office/Commercial": {
        "Small": 100,
        "Medium": 500,
        "Large": 1500
    },
    "Healthcare": {
        "Small": 300,
        "Medium": 1000,
        "Large": 3000
    },
    "Default": {
        "Small": 200,
        "Medium": 800,
        "Large": 2000
    }
}

# Cost assumptions
GRID_COST_PER_KWH = 60  # Naira per kWh
DIESEL_COST_PER_KWH = 150  # Naira per kWh
IPP_DISCOUNT = 0.35  # 35% savings on energy costs

# Priority factors
GAS_AVAILABILITY = {
    "Pipeline": 1.5,
    "CNG Possible": 1.2,
    "No Gas": 0.7
}

REGION_FACTORS = {
    "Lagos": 1.3,
    "Abuja": 1.2,
    "Port Harcourt": 1.1,
    "Kano": 0.9,
    "Kaduna": 0.9,
    "Default": 1.0
}

def clean_industry(industry):
    """Standardize industry names"""
    industry = str(industry).strip().lower()
    
    if pd.isna(industry) or industry == 'nan' or industry == '':
        return "Other"
    
    if "manuf" in industry or "factory" in industry or "product" in industry:
        return "Manufacturing"
    elif "hotel" in industry or "hospitality" in industry or "resort" in industry:
        return "Hospitality"
    elif "office" in industry or "commercial" in industry or "mall" in industry:
        return "Office/Commercial"
    elif "health" in industry or "hospital" in industry or "clinic" in industry:
        return "Healthcare"
    else:
        return "Other"

def estimate_size(power_str):
    """Estimate company size based on power requirement"""
    # Extract numeric value
    if not power_str or pd.isna(power_str):
        return "Medium"  # Default
    
    try:
        # Try to extract numeric portion with regex
        match = re.search(r'(\d+(?:\.\d+)?)', str(power_str))
        if match:
            power = float(match.group(1))
            unit = str(power_str).lower()
            
            # Convert to kW if in MW
            if "mw" in unit:
                power *= 1000
            
            if power < 500:
                return "Small"
            elif power < 2000:
                return "Medium"
            else:
                return "Large"
    except:
        pass
    
    return "Medium"  # Default

def estimate_power(row):
    """Estimate power needs in kW based on industry and size"""
    industry = row['Industry']
    size = row['Size Category']
    
    # If power is already provided, use it
    if 'Required Power' in row.index and row['Required Power'] and not pd.isna(row['Required Power']):
        try:
            # Extract numeric portion with regex
            match = re.search(r'(\d+(?:\.\d+)?)', str(row['Required Power']))
            if match:
                power = float(match.group(1))
                unit = str(row['Required Power']).lower()
                
                # Convert to kW if in MW
                if "mw" in unit:
                    power *= 1000
                    
                return power
        except Exception as e:
            print(f"Error estimating power from given value: {e}")
    
    # Use benchmarks
    if industry in INDUSTRY_BENCHMARKS and size in INDUSTRY_BENCHMARKS[industry]:
        return INDUSTRY_BENCHMARKS[industry][size]
    else:
        return INDUSTRY_BENCHMARKS["Default"][size]

def estimate_current_cost(power_kw):
    """Estimate current annual power cost"""
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
    """Estimate annual savings with IPP solution"""
    return current_cost * IPP_DISCOUNT

def calculate_priority_score(row):
    """Calculate priority score (1-5)"""
    base_score = 3.0  # Default
    
    # Adjust based on power requirements
    power_kw = row['Power Est. (kW)']
    if power_kw > 3000:
        base_score += 1.0
    elif power_kw < 500:
        base_score -= 0.5
    
    # Adjust based on industry
    industry = row['Industry']
    if industry == "Manufacturing":
        base_score += 0.5
    elif industry == "Healthcare":
        base_score += 0.3
    
    # Adjust based on region
    region = row['Region']
    region_factor = REGION_FACTORS.get(region, REGION_FACTORS["Default"])
    base_score *= region_factor
    
    # Adjust based on gas availability
    gas = row['Gas Availability']
    if gas in GAS_AVAILABILITY:
        base_score *= GAS_AVAILABILITY[gas]
    
    # Cap between 1-5
    return max(1, min(5, round(base_score)))

def generate_company_id(index, company_name):
    """Generate a unique company ID"""
    # Create a simplified version of company name for the ID
    name_part = ''.join(c for c in company_name if c.isalnum())[:3].upper()
    return f"MIK{index+1:03d}"

def enrich_gas_leads(input_file, output_file=None):
    """Enrich Gas Leads Excel file with additional data"""
    # Create output filename if not provided
    if not output_file:
        base, ext = os.path.splitext(input_file)
        output_file = f"{base}_enriched{ext}"
    
    # Create TestResults directory if it doesn't exist
    os.makedirs("../Database/TestResults", exist_ok=True)
    
    # Read Excel file
    try:
        df = pd.read_excel(input_file)
        print(f"Loaded {len(df)} leads from {input_file}")
        print(f"Original columns: {df.columns.tolist()}")
    except Exception as e:
        print(f"Error loading file: {str(e)}")
        return False
    
    # Map column names to standardized names
    column_mapping = {
        'Location': 'Region',
        'Industry': 'Industry',
        'Ministry': 'Industry',  # Alternative name
        'Client': 'Company Name',
        'Size': 'Size Raw',
        'Required Power': 'Required Power',
        'IPP Provider': 'Current IPP Provider',
        'Priorities': 'Priority Raw'
    }
    
    # Create a new DataFrame with standardized columns
    new_df = pd.DataFrame()
    
    # Map existing columns
    for old_col, new_col in column_mapping.items():
        if old_col in df.columns:
            new_df[new_col] = df[old_col]
    
    print(f"New DataFrame columns after mapping: {new_df.columns.tolist()}")
    
    # Fill in missing columns
    required_columns = ['Company Name', 'Region', 'Industry', 'Required Power', 'Current IPP Provider']
    for col in required_columns:
        if col not in new_df.columns:
            new_df[col] = None
    
    print(f"New DataFrame columns after filling missing: {new_df.columns.tolist()}")
    
    # Clean and process data
    print("Cleaning and processing data...")
    
    # Standardize industry
    new_df['Industry'] = new_df['Industry'].apply(clean_industry)
    
    # Estimate size category
    new_df['Size Category'] = new_df['Required Power'].apply(estimate_size)
    
    # Add gas availability (placeholder - would need actual data)
    new_df['Gas Availability'] = "CNG Possible"  # Default assumption
    
    # Generate unique IDs
    new_df['Company ID'] = [generate_company_id(i, str(name)) for i, name in enumerate(new_df['Company Name'])]
    
    # Estimate power requirements
    new_df['Power Est. (kW)'] = new_df.apply(lambda row: estimate_power(row), axis=1)
    
    # Calculate cost metrics
    new_df['Current Annual Power Cost (₦)'] = new_df['Power Est. (kW)'].apply(estimate_current_cost)
    new_df['Estimated Annual Savings (₦)'] = new_df['Current Annual Power Cost (₦)'].apply(estimate_ipp_savings)
    
    # Calculate priority score
    new_df['Priority Score'] = new_df.apply(lambda row: calculate_priority_score(row), axis=1)
    
    # Add lead source and status
    new_df['Lead Source'] = "Existing Database"
    new_df['Status'] = "New"
    
    # Add next steps
    new_df['Next Steps'] = "Verify power requirements and identify decision makers"
    new_df['Est. Basis'] = "Industry Average"
    
    # Add timestamps
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    new_df['Created Date'] = current_time
    new_df['Modified Date'] = current_time
    
    # Save to Excel
    try:
        output_path = f"../Database/TestResults/{os.path.basename(output_file)}"
        new_df.to_excel(output_path, index=False)
        print(f"Enriched data saved to {output_path}")
        
        # Generate a markdown summary
        md_path = f"../Database/TestResults/enriched_leads_summary.md"
        generate_markdown_summary(new_df, md_path)
        
        print(f"Added {len(new_df)} enriched leads with:")
        print(f"- Estimated power requirements")
        print(f"- Annual cost savings calculations")
        print(f"- Priority scoring (1-5)")
        print(f"- Standardized industry categories")
        return True
    except Exception as e:
        print(f"Error saving file: {str(e)}")
        return False

def generate_markdown_summary(df, output_path):
    """Generate a markdown summary of the enriched data"""
    # Calculate some statistics
    total_leads = len(df)
    total_power = df['Power Est. (kW)'].sum()
    total_savings = df['Estimated Annual Savings (₦)'].sum()
    
    # Group by industry
    industry_counts = df['Industry'].value_counts()
    
    # Group by priority
    priority_counts = df['Priority Score'].value_counts().sort_index()
    
    # Create the markdown content
    md_content = "# Enriched Gas Leads Summary\n\n"
    md_content += f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n"
    
    # Overall statistics
    md_content += "## Overall Statistics\n\n"
    md_content += f"- **Total Leads:** {total_leads}\n"
    md_content += f"- **Total Estimated Power:** {total_power:,.0f} kW\n"
    md_content += f"- **Total Potential Annual Savings:** ₦{total_savings:,.0f}\n"
    md_content += f"- **Average Power per Lead:** {total_power/total_leads:,.0f} kW\n"
    md_content += f"- **Average Annual Savings per Lead:** ₦{total_savings/total_leads:,.0f}\n\n"
    
    # Industry breakdown
    md_content += "## Industry Breakdown\n\n"
    md_content += "| Industry | Count | Percentage |\n"
    md_content += "|---------|-------|------------|\n"
    
    for industry, count in industry_counts.items():
        percentage = count / total_leads * 100
        md_content += f"| {industry} | {count} | {percentage:.1f}% |\n"
    
    # Priority breakdown
    md_content += "\n## Priority Score Distribution\n\n"
    md_content += "| Priority | Count | Percentage |\n"
    md_content += "|---------|-------|------------|\n"
    
    for priority, count in priority_counts.items():
        percentage = count / total_leads * 100
        md_content += f"| {priority} | {count} | {percentage:.1f}% |\n"
    
    # Top leads by power
    md_content += "\n## Top 10 Leads by Power Requirement\n\n"
    md_content += "| Company | Industry | Region | Power Est. (kW) | Annual Savings (₦) | Priority |\n"
    md_content += "|---------|----------|--------|----------------|-------------------|----------|\n"
    
    top_by_power = df.sort_values('Power Est. (kW)', ascending=False).head(10)
    for _, row in top_by_power.iterrows():
        md_content += f"| {row['Company Name']} | {row['Industry']} | {row['Region']} | {row['Power Est. (kW)']:,.0f} | ₦{row['Estimated Annual Savings (₦)']:,.0f} | {row['Priority Score']} |\n"
    
    # Top leads by priority
    md_content += "\n## Top 10 Leads by Priority Score\n\n"
    md_content += "| Company | Industry | Region | Power Est. (kW) | Annual Savings (₦) | Priority |\n"
    md_content += "|---------|----------|--------|----------------|-------------------|----------|\n"
    
    top_by_priority = df.sort_values(['Priority Score', 'Power Est. (kW)'], ascending=[False, False]).head(10)
    for _, row in top_by_priority.iterrows():
        md_content += f"| {row['Company Name']} | {row['Industry']} | {row['Region']} | {row['Power Est. (kW)']:,.0f} | ₦{row['Estimated Annual Savings (₦)']:,.0f} | {row['Priority Score']} |\n"
    
    # Write to file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(md_content)
    
    print(f"Summary report saved to {output_path}")

if __name__ == "__main__":
    # Path to the Gas Leads Excel file
    input_file = "../Database/Gas Leads.xlsx"
    
    # Enrich the file
    enrich_gas_leads(input_file) 