#!/usr/bin/env python3
"""
Script to extract and analyze Sheet3 (index 1) from Gas Leads.xlsx
"""
import pandas as pd
import numpy as np
import os
import json
from datetime import datetime

def extract_sheet3():
    """Extract data from Sheet3 (index 1) of Gas Leads.xlsx"""
    input_file = "../Database/Gas Leads.xlsx"
    
    try:
        # Get sheet names for reference
        xl = pd.ExcelFile(input_file)
        sheet_names = xl.sheet_names
        print(f"Sheet names in file: {sheet_names}")
        
        # Read Sheet3 (index 1) with header=1
        df = pd.read_excel(input_file, sheet_name=1, header=1)
        print(f"Successfully read Sheet3 with shape: {df.shape}")
        print(f"Columns: {df.columns.tolist()}")
        
        # Preview the data
        print("\nPreview of data:")
        print(df.head())
        
        # Check for key columns
        key_columns = ['CLIENT', 'LOCATION', 'Size (MW)', 'IPP Provider', 'Engines Required', 'Priority']
        found_columns = [col for col in key_columns if col in df.columns]
        print(f"\nFound key columns: {found_columns}")
        
        # Create output directory if it doesn't exist
        os.makedirs("../Database/TestResults", exist_ok=True)
        
        # Save data to CSV for easier viewing
        output_csv = "../Database/TestResults/sheet3_proper_data.csv"
        df.to_csv(output_csv, index=False)
        print(f"Saved Sheet3 data to {output_csv}")
        
        # Create a more structured analysis
        return df
    
    except Exception as e:
        print(f"Error extracting Sheet3: {str(e)}")
        return None

def analyze_sheet3(df):
    """Analyze the proper Sheet3 data"""
    if df is None or len(df) == 0:
        print("No data to analyze")
        return
    
    print("\n--- Sheet3 Detailed Analysis ---")
    
    # Basic statistics
    total_entries = len(df)
    print(f"Total entries: {total_entries}")
    
    # Client analysis
    if 'CLIENT' in df.columns:
        clients = df['CLIENT'].dropna()
        unique_clients = clients.nunique()
        print(f"Unique clients: {unique_clients}")
        print("\nTop 5 clients:")
        for client in df['CLIENT'].dropna().unique()[:5]:
            print(f"  - {client}")
    
    # Location analysis
    if 'LOCATION' in df.columns:
        locations = df['LOCATION'].dropna()
        unique_locations = locations.nunique()
        print(f"\nUnique locations: {unique_locations}")
        print("Location distribution:")
        location_counts = df['LOCATION'].value_counts()
        for loc, count in location_counts.head().items():
            print(f"  - {loc}: {count} entries")
    
    # Power requirement analysis
    if 'Size (MW)' in df.columns:
        power_values = df['Size (MW)'].dropna()
        if len(power_values) > 0:
            print(f"\nPower requirements:")
            print(f"  - Min: {power_values.min()} MW")
            print(f"  - Max: {power_values.max()} MW")
            print(f"  - Average: {power_values.mean():.2f} MW")
            print(f"  - Total: {power_values.sum():.2f} MW")
            
            # Power size distribution
            print("\nPower size distribution:")
            small = power_values[power_values < 5].count()
            medium = power_values[(power_values >= 5) & (power_values < 20)].count()
            large = power_values[power_values >= 20].count()
            
            print(f"  - Small (<5 MW): {small} clients ({small/len(power_values)*100:.1f}%)")
            print(f"  - Medium (5-20 MW): {medium} clients ({medium/len(power_values)*100:.1f}%)")
            print(f"  - Large (>20 MW): {large} clients ({large/len(power_values)*100:.1f}%)")
    
    # Current IPP provider analysis
    if 'IPP Provider' in df.columns:
        ipp_providers = df['IPP Provider'].dropna()
        if len(ipp_providers) > 0:
            print("\nCurrent IPP providers:")
            ipp_counts = df['IPP Provider'].value_counts()
            for provider, count in ipp_counts.items():
                if pd.notna(provider) and provider:
                    print(f"  - {provider}: {count} clients")
    
    # Priority analysis
    if 'Priority' in df.columns:
        priorities = df['Priority'].dropna()
        if len(priorities) > 0:
            print("\nPriority distribution:")
            priority_counts = df['Priority'].value_counts()
            for priority, count in priority_counts.items():
                if pd.notna(priority):
                    print(f"  - {priority}: {count} clients")
    
    # Generate comprehensive summary report
    create_summary_report(df)

def create_summary_report(df):
    """Create a comprehensive markdown summary report"""
    report_md = "# Sheet3 Comprehensive Analysis\n\n"
    report_md += f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n"
    
    # Overview section
    report_md += "## Overview\n\n"
    report_md += f"Total entries: {len(df)}\n\n"
    
    # Client table
    report_md += "## Client Summary\n\n"
    if 'CLIENT' in df.columns:
        report_md += "| Client | Location | Size (MW) | IPP Provider | Priority |\n"
        report_md += "|--------|----------|-----------|--------------|----------|\n"
        
        # Prepare rows for table
        for _, row in df.iterrows():
            client = row.get('CLIENT', 'N/A')
            location = row.get('LOCATION', 'N/A')
            size = row.get('Size (MW)', 'N/A')
            provider = row.get('IPP Provider', 'N/A')
            priority = row.get('Priority', 'N/A')
            
            # Handle NaN values
            client = client if pd.notna(client) else 'N/A'
            location = location if pd.notna(location) else 'N/A'
            size = size if pd.notna(size) else 'N/A'
            provider = provider if pd.notna(provider) else 'N/A'
            priority = priority if pd.notna(priority) else 'N/A'
            
            report_md += f"| {client} | {location} | {size} | {provider} | {priority} |\n"
    
    # Location analysis
    report_md += "\n## Location Analysis\n\n"
    if 'LOCATION' in df.columns:
        location_counts = df['LOCATION'].value_counts()
        report_md += "| Location | Count | Percentage |\n"
        report_md += "|----------|-------|------------|\n"
        
        for location, count in location_counts.items():
            if pd.notna(location):
                percentage = count / len(df) * 100
                report_md += f"| {location} | {count} | {percentage:.1f}% |\n"
    
    # Power requirements
    report_md += "\n## Power Requirements\n\n"
    if 'Size (MW)' in df.columns:
        power_values = df['Size (MW)'].dropna()
        if len(power_values) > 0:
            report_md += f"**Total Power**: {power_values.sum():.2f} MW\n\n"
            report_md += "| Size Category | Count | Total MW | Percentage |\n"
            report_md += "|---------------|-------|----------|------------|\n"
            
            small_df = df[df['Size (MW)'] < 5]
            medium_df = df[(df['Size (MW)'] >= 5) & (df['Size (MW)'] < 20)]
            large_df = df[df['Size (MW)'] >= 20]
            
            small_count = len(small_df)
            medium_count = len(medium_df)
            large_count = len(large_df)
            
            small_sum = small_df['Size (MW)'].sum() if small_count > 0 else 0
            medium_sum = medium_df['Size (MW)'].sum() if medium_count > 0 else 0
            large_sum = large_df['Size (MW)'].sum() if large_count > 0 else 0
            
            total_with_power = len(power_values)
            
            report_md += f"| Small (<5 MW) | {small_count} | {small_sum:.2f} | {small_count/total_with_power*100:.1f}% |\n"
            report_md += f"| Medium (5-20 MW) | {medium_count} | {medium_sum:.2f} | {medium_count/total_with_power*100:.1f}% |\n"
            report_md += f"| Large (>20 MW) | {large_count} | {large_sum:.2f} | {large_count/total_with_power*100:.1f}% |\n"
    
    # Save report
    report_file = "../Database/TestResults/sheet3_comprehensive_analysis.md"
    with open(report_file, 'w') as f:
        f.write(report_md)
    
    print(f"\nSaved comprehensive analysis to {report_file}")

def main():
    print("Extracting and analyzing Sheet3 data...\n")
    df = extract_sheet3()
    
    if df is not None:
        analyze_sheet3(df)
    else:
        print("Could not analyze Sheet3 data due to extraction error.")

if __name__ == "__main__":
    main() 
"""
Script to extract and analyze Sheet3 (index 1) from Gas Leads.xlsx
"""
import pandas as pd
import numpy as np
import os
import json
from datetime import datetime

def extract_sheet3():
    """Extract data from Sheet3 (index 1) of Gas Leads.xlsx"""
    input_file = "../Database/Gas Leads.xlsx"
    
    try:
        # Get sheet names for reference
        xl = pd.ExcelFile(input_file)
        sheet_names = xl.sheet_names
        print(f"Sheet names in file: {sheet_names}")
        
        # Read Sheet3 (index 1) with header=1
        df = pd.read_excel(input_file, sheet_name=1, header=1)
        print(f"Successfully read Sheet3 with shape: {df.shape}")
        print(f"Columns: {df.columns.tolist()}")
        
        # Preview the data
        print("\nPreview of data:")
        print(df.head())
        
        # Check for key columns
        key_columns = ['CLIENT', 'LOCATION', 'Size (MW)', 'IPP Provider', 'Engines Required', 'Priority']
        found_columns = [col for col in key_columns if col in df.columns]
        print(f"\nFound key columns: {found_columns}")
        
        # Create output directory if it doesn't exist
        os.makedirs("../Database/TestResults", exist_ok=True)
        
        # Save data to CSV for easier viewing
        output_csv = "../Database/TestResults/sheet3_proper_data.csv"
        df.to_csv(output_csv, index=False)
        print(f"Saved Sheet3 data to {output_csv}")
        
        # Create a more structured analysis
        return df
    
    except Exception as e:
        print(f"Error extracting Sheet3: {str(e)}")
        return None

def analyze_sheet3(df):
    """Analyze the proper Sheet3 data"""
    if df is None or len(df) == 0:
        print("No data to analyze")
        return
    
    print("\n--- Sheet3 Detailed Analysis ---")
    
    # Basic statistics
    total_entries = len(df)
    print(f"Total entries: {total_entries}")
    
    # Client analysis
    if 'CLIENT' in df.columns:
        clients = df['CLIENT'].dropna()
        unique_clients = clients.nunique()
        print(f"Unique clients: {unique_clients}")
        print("\nTop 5 clients:")
        for client in df['CLIENT'].dropna().unique()[:5]:
            print(f"  - {client}")
    
    # Location analysis
    if 'LOCATION' in df.columns:
        locations = df['LOCATION'].dropna()
        unique_locations = locations.nunique()
        print(f"\nUnique locations: {unique_locations}")
        print("Location distribution:")
        location_counts = df['LOCATION'].value_counts()
        for loc, count in location_counts.head().items():
            print(f"  - {loc}: {count} entries")
    
    # Power requirement analysis
    if 'Size (MW)' in df.columns:
        power_values = df['Size (MW)'].dropna()
        if len(power_values) > 0:
            print(f"\nPower requirements:")
            print(f"  - Min: {power_values.min()} MW")
            print(f"  - Max: {power_values.max()} MW")
            print(f"  - Average: {power_values.mean():.2f} MW")
            print(f"  - Total: {power_values.sum():.2f} MW")
            
            # Power size distribution
            print("\nPower size distribution:")
            small = power_values[power_values < 5].count()
            medium = power_values[(power_values >= 5) & (power_values < 20)].count()
            large = power_values[power_values >= 20].count()
            
            print(f"  - Small (<5 MW): {small} clients ({small/len(power_values)*100:.1f}%)")
            print(f"  - Medium (5-20 MW): {medium} clients ({medium/len(power_values)*100:.1f}%)")
            print(f"  - Large (>20 MW): {large} clients ({large/len(power_values)*100:.1f}%)")
    
    # Current IPP provider analysis
    if 'IPP Provider' in df.columns:
        ipp_providers = df['IPP Provider'].dropna()
        if len(ipp_providers) > 0:
            print("\nCurrent IPP providers:")
            ipp_counts = df['IPP Provider'].value_counts()
            for provider, count in ipp_counts.items():
                if pd.notna(provider) and provider:
                    print(f"  - {provider}: {count} clients")
    
    # Priority analysis
    if 'Priority' in df.columns:
        priorities = df['Priority'].dropna()
        if len(priorities) > 0:
            print("\nPriority distribution:")
            priority_counts = df['Priority'].value_counts()
            for priority, count in priority_counts.items():
                if pd.notna(priority):
                    print(f"  - {priority}: {count} clients")
    
    # Generate comprehensive summary report
    create_summary_report(df)

def create_summary_report(df):
    """Create a comprehensive markdown summary report"""
    report_md = "# Sheet3 Comprehensive Analysis\n\n"
    report_md += f"*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n"
    
    # Overview section
    report_md += "## Overview\n\n"
    report_md += f"Total entries: {len(df)}\n\n"
    
    # Client table
    report_md += "## Client Summary\n\n"
    if 'CLIENT' in df.columns:
        report_md += "| Client | Location | Size (MW) | IPP Provider | Priority |\n"
        report_md += "|--------|----------|-----------|--------------|----------|\n"
        
        # Prepare rows for table
        for _, row in df.iterrows():
            client = row.get('CLIENT', 'N/A')
            location = row.get('LOCATION', 'N/A')
            size = row.get('Size (MW)', 'N/A')
            provider = row.get('IPP Provider', 'N/A')
            priority = row.get('Priority', 'N/A')
            
            # Handle NaN values
            client = client if pd.notna(client) else 'N/A'
            location = location if pd.notna(location) else 'N/A'
            size = size if pd.notna(size) else 'N/A'
            provider = provider if pd.notna(provider) else 'N/A'
            priority = priority if pd.notna(priority) else 'N/A'
            
            report_md += f"| {client} | {location} | {size} | {provider} | {priority} |\n"
    
    # Location analysis
    report_md += "\n## Location Analysis\n\n"
    if 'LOCATION' in df.columns:
        location_counts = df['LOCATION'].value_counts()
        report_md += "| Location | Count | Percentage |\n"
        report_md += "|----------|-------|------------|\n"
        
        for location, count in location_counts.items():
            if pd.notna(location):
                percentage = count / len(df) * 100
                report_md += f"| {location} | {count} | {percentage:.1f}% |\n"
    
    # Power requirements
    report_md += "\n## Power Requirements\n\n"
    if 'Size (MW)' in df.columns:
        power_values = df['Size (MW)'].dropna()
        if len(power_values) > 0:
            report_md += f"**Total Power**: {power_values.sum():.2f} MW\n\n"
            report_md += "| Size Category | Count | Total MW | Percentage |\n"
            report_md += "|---------------|-------|----------|------------|\n"
            
            small_df = df[df['Size (MW)'] < 5]
            medium_df = df[(df['Size (MW)'] >= 5) & (df['Size (MW)'] < 20)]
            large_df = df[df['Size (MW)'] >= 20]
            
            small_count = len(small_df)
            medium_count = len(medium_df)
            large_count = len(large_df)
            
            small_sum = small_df['Size (MW)'].sum() if small_count > 0 else 0
            medium_sum = medium_df['Size (MW)'].sum() if medium_count > 0 else 0
            large_sum = large_df['Size (MW)'].sum() if large_count > 0 else 0
            
            total_with_power = len(power_values)
            
            report_md += f"| Small (<5 MW) | {small_count} | {small_sum:.2f} | {small_count/total_with_power*100:.1f}% |\n"
            report_md += f"| Medium (5-20 MW) | {medium_count} | {medium_sum:.2f} | {medium_count/total_with_power*100:.1f}% |\n"
            report_md += f"| Large (>20 MW) | {large_count} | {large_sum:.2f} | {large_count/total_with_power*100:.1f}% |\n"
    
    # Save report
    report_file = "../Database/TestResults/sheet3_comprehensive_analysis.md"
    with open(report_file, 'w') as f:
        f.write(report_md)
    
    print(f"\nSaved comprehensive analysis to {report_file}")

def main():
    print("Extracting and analyzing Sheet3 data...\n")
    df = extract_sheet3()
    
    if df is not None:
        analyze_sheet3(df)
    else:
        print("Could not analyze Sheet3 data due to extraction error.")

if __name__ == "__main__":
    main() 