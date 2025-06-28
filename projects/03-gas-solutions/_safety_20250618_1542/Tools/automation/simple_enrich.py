#!/usr/bin/env python3
"""
Simplified Lead Enrichment Script for testing
"""

import pandas as pd
import numpy as np
from datetime import datetime
import re
import os

# Power requirement benchmarks by industry (in kW)
INDUSTRY_BENCHMARKS = {
    "Manufacturing": 2000,
    "Hospitality": 800,
    "Office/Commercial": 500,
    "Healthcare": 1000,
    "Other": 800
}

# Cost assumptions
GRID_COST_PER_KWH = 60  # Naira per kWh
DIESEL_COST_PER_KWH = 150  # Naira per kWh
IPP_DISCOUNT = 0.35  # 35% savings on energy costs

def clean_industry(industry):
    """Standardize industry names"""
    if pd.isna(industry):
        return "Other"
    
    industry = str(industry).strip().lower()
    
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

def main():
    # Create output directory
    os.makedirs("../Database/TestResults", exist_ok=True)
    
    # Path to the Gas Leads Excel file
    input_file = "../Database/Gas Leads.xlsx"
    
    # Load the data
    try:
        df = pd.read_excel(input_file)
        print(f"Loaded {len(df)} leads from {input_file}")
        print(f"Columns: {df.columns.tolist()}")
    except Exception as e:
        print(f"Error loading file: {str(e)}")
        return
    
    # Create a copy for our enrichment
    enriched_df = df.copy()
    
    # Add industry if it doesn't exist
    if 'Industry' not in enriched_df.columns:
        print("Industry column not found, checking for Ministry")
        if 'Ministry' in enriched_df.columns:
            enriched_df['Industry'] = enriched_df['Ministry']
        else:
            print("No industry information found, setting to Other")
            enriched_df['Industry'] = "Other"
    
    # Clean industry values
    enriched_df['Industry'] = enriched_df['Industry'].apply(clean_industry)
    
    # Add power estimates based on industry
    enriched_df['Power Est. (kW)'] = enriched_df['Industry'].map(INDUSTRY_BENCHMARKS)
    
    # Calculate annual power costs
    # Assume 12 hours grid, 12 hours diesel, 313 operational days, 70% utilization
    enriched_df['Annual Power Cost (₦)'] = enriched_df['Power Est. (kW)'] * (
        (12 * 313 * GRID_COST_PER_KWH * 0.7) + 
        (12 * 313 * DIESEL_COST_PER_KWH * 0.7)
    )
    
    # Calculate potential savings
    enriched_df['Annual Savings (₦)'] = enriched_df['Annual Power Cost (₦)'] * IPP_DISCOUNT
    
    # Add company ID
    enriched_df['Company ID'] = [f"MIK{i+1:03d}" for i in range(len(enriched_df))]
    
    # Set priority based on power requirements and industry
    enriched_df['Priority'] = 3  # Default priority
    
    # Adjust priority for high power consumers
    enriched_df.loc[enriched_df['Power Est. (kW)'] > 3000, 'Priority'] = 5
    enriched_df.loc[enriched_df['Power Est. (kW)'] > 1500, 'Priority'] = 4
    
    # Adjust priority for manufacturing (high priority sector)
    enriched_df.loc[enriched_df['Industry'] == 'Manufacturing', 'Priority'] = \
        enriched_df.loc[enriched_df['Industry'] == 'Manufacturing', 'Priority'] + 1
    
    # Cap priority at 5
    enriched_df['Priority'] = enriched_df['Priority'].clip(upper=5)
    
    # Save to Excel
    output_file = "../Database/TestResults/simple_enriched_leads.xlsx"
    enriched_df.to_excel(output_file, index=False)
    print(f"Saved enriched data to {output_file}")
    
    # Generate a simple markdown summary
    md_content = "# Enriched Gas Leads Summary\n\n"
    md_content += f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n"
    
    # Statistics
    md_content += "## Overall Statistics\n\n"
    md_content += f"- **Total Leads:** {len(enriched_df)}\n"
    md_content += f"- **Total Estimated Power:** {enriched_df['Power Est. (kW)'].sum():,.0f} kW\n"
    md_content += f"- **Total Potential Annual Savings:** ₦{enriched_df['Annual Savings (₦)'].sum():,.0f}\n\n"
    
    # Industry breakdown
    md_content += "## Industry Breakdown\n\n"
    md_content += "| Industry | Count | Total Power (kW) | Avg. Annual Savings (₦) |\n"
    md_content += "|---------|-------|-----------------|-------------------------|\n"
    
    industry_summary = enriched_df.groupby('Industry').agg({
        'Power Est. (kW)': 'sum',
        'Annual Savings (₦)': 'mean',
        'Industry': 'count'
    }).rename(columns={'Industry': 'Count'})
    
    for industry, row in industry_summary.iterrows():
        md_content += f"| {industry} | {row['Count']} | {row['Power Est. (kW)']:,.0f} | ₦{row['Annual Savings (₦)']:,.0f} |\n"
    
    # Save markdown
    md_path = "../Database/TestResults/simple_summary.md"
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(md_content)
    
    print(f"Generated summary at {md_path}")

if __name__ == "__main__":
    main() 