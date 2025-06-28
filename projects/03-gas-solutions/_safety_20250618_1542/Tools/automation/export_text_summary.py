#!/usr/bin/env python3
"""
Export company lead data as a text-based summary for easier viewing
"""

import pandas as pd
import os

def export_companies_as_text():
    """Export the companies data as a markdown file"""
    
    # Load the Excel file
    excel_file = '../Database/SalesLeads/energy_companies_tracker.xlsx'
    df = pd.read_excel(excel_file)
    
    # Create markdown content
    content = "# Top Energy Company Leads with Value Propositions\n"
    content += "*Generated on " + pd.Timestamp.now().strftime("%Y-%m-%d") + "*\n\n"
    
    # Add table header
    content += "| Company | Sector | Lead Score | MW | Value Proposition |\n"
    content += "|---------|--------|------------|-----|-------------------|\n"
    
    # Add data rows
    for _, row in df.sort_values('Lead Score', ascending=False).iterrows():
        content += f"| {row['Company']} | {row['Sector']} | {row['Lead Score']} | {row['Power Needs (Est. MW)']} | {row['Value Proposition']} |\n"
    
    # Write to file
    output_file = '../Database/SalesLeads/company_leads_summary.md'
    with open(output_file, 'w') as f:
        f.write(content)
    
    print(f"Exported company leads as markdown: {output_file}")

if __name__ == "__main__":
    export_companies_as_text() 
"""
Export company lead data as a text-based summary for easier viewing
"""

import pandas as pd
import os

def export_companies_as_text():
    """Export the companies data as a markdown file"""
    
    # Load the Excel file
    excel_file = '../Database/SalesLeads/energy_companies_tracker.xlsx'
    df = pd.read_excel(excel_file)
    
    # Create markdown content
    content = "# Top Energy Company Leads with Value Propositions\n"
    content += "*Generated on " + pd.Timestamp.now().strftime("%Y-%m-%d") + "*\n\n"
    
    # Add table header
    content += "| Company | Sector | Lead Score | MW | Value Proposition |\n"
    content += "|---------|--------|------------|-----|-------------------|\n"
    
    # Add data rows
    for _, row in df.sort_values('Lead Score', ascending=False).iterrows():
        content += f"| {row['Company']} | {row['Sector']} | {row['Lead Score']} | {row['Power Needs (Est. MW)']} | {row['Value Proposition']} |\n"
    
    # Write to file
    output_file = '../Database/SalesLeads/company_leads_summary.md'
    with open(output_file, 'w') as f:
        f.write(content)
    
    print(f"Exported company leads as markdown: {output_file}")

if __name__ == "__main__":
    export_companies_as_text() 