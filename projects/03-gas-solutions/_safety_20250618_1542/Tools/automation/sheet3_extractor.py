#!/usr/bin/env python3
"""
Script to extract and analyze only Sheet3 from Gas Leads.xlsx
"""
import pandas as pd
import os
import json

def extract_sheet3():
    """Extract data from Sheet3 of Gas Leads.xlsx"""
    input_file = "../Database/Gas Leads.xlsx"
    
    try:
        # Read only sheet3 (index 2 in zero-based indexing)
        xl = pd.ExcelFile(input_file)
        sheet_names = xl.sheet_names
        print(f"All sheet names in file: {sheet_names}")
        
        # Try different header options for Sheet3
        print("\nTrying different header options for Sheet3:")
        for header_option in [None, 0, 1, 2]:
            try:
                df = pd.read_excel(input_file, sheet_name=2, header=header_option)
                print(f"\nHeader option {header_option}:")
                print(f"Shape: {df.shape}")
                print(f"Columns: {df.columns.tolist()}")
                print("First 5 rows:")
                print(df.head(5))
            except Exception as e:
                print(f"Error with header={header_option}: {str(e)}")
        
        # Read with the likely best header option (based on your feedback that Sheet3 has proper headers)
        df = pd.read_excel(input_file, sheet_name=2, header=1)
        
        # Create output directory if it doesn't exist
        os.makedirs("../Database/TestResults", exist_ok=True)
        
        # Save Sheet3 data to CSV for easier viewing
        output_csv = "../Database/TestResults/sheet3_data.csv"
        df.to_csv(output_csv, index=False)
        print(f"\nSaved Sheet3 data to {output_csv}")
        
        # Save as JSON for structure analysis
        output_json = "../Database/TestResults/sheet3_structure.json"
        
        # Prepare data for JSON serialization
        data = {
            "sheet_name": sheet_names[2] if len(sheet_names) > 2 else "Sheet3",
            "columns": df.columns.tolist(),
            "row_count": len(df),
            "column_count": len(df.columns),
            "sample_rows": df.head(10).replace({pd.NA: None}).to_dict('records')
        }
        
        # Save to JSON
        with open(output_json, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"Saved Sheet3 structure details to {output_json}")
        
        return df
    
    except Exception as e:
        print(f"Error extracting Sheet3: {str(e)}")
        return None

def analyze_sheet3_data(df):
    """Analyze the data from Sheet3"""
    if df is None or len(df) == 0:
        print("No data to analyze")
        return
    
    print("\n--- Sheet3 Analysis ---")
    print(f"Total entries: {len(df)}")
    
    # Check for key columns we care about
    key_columns = ['CLIENT', 'LOCATION', 'Size (MW)', 'IPP Provider', 'Engines Required', 'Priority']
    found_columns = [col for col in key_columns if col in df.columns]
    missing_columns = [col for col in key_columns if col not in df.columns]
    
    print(f"Found key columns: {found_columns}")
    if missing_columns:
        print(f"Missing key columns: {missing_columns}")
    
    # Analyze data completeness
    if 'CLIENT' in df.columns:
        missing_clients = df['CLIENT'].isna().sum()
        print(f"Entries missing client name: {missing_clients} ({missing_clients/len(df)*100:.1f}%)")
    
    if 'LOCATION' in df.columns:
        missing_locations = df['LOCATION'].isna().sum()
        print(f"Entries missing location: {missing_locations} ({missing_locations/len(df)*100:.1f}%)")
    
    if 'Size (MW)' in df.columns:
        missing_power = df['Size (MW)'].isna().sum()
        print(f"Entries missing power requirement: {missing_power} ({missing_power/len(df)*100:.1f}%)")
        
        # Get power distribution
        power_values = df['Size (MW)'].dropna()
        if len(power_values) > 0:
            print(f"Power requirements (MW) - Min: {power_values.min()}, Max: {power_values.max()}, Mean: {power_values.mean():.2f}")
    
    # Create a summary report
    report_md = "# Sheet3 Data Summary\n\n"
    report_md += f"Total entries: {len(df)}\n\n"
    
    report_md += "## Client Overview\n\n"
    if 'CLIENT' in df.columns:
        clients = df['CLIENT'].dropna().unique()
        report_md += f"Unique clients: {len(clients)}\n\n"
        report_md += "### Sample Clients:\n"
        for client in clients[:10]:  # First 10 clients
            report_md += f"- {client}\n"
        if len(clients) > 10:
            report_md += f"- ... and {len(clients) - 10} more\n"
    
    report_md += "\n## Location Distribution\n\n"
    if 'LOCATION' in df.columns:
        location_counts = df['LOCATION'].value_counts()
        report_md += "| Location | Count |\n"
        report_md += "|----------|-------|\n"
        for location, count in location_counts.items():
            if pd.notna(location):
                report_md += f"| {location} | {count} |\n"
    
    # Write summary report
    report_file = "../Database/TestResults/sheet3_summary.md"
    with open(report_file, 'w') as f:
        f.write(report_md)
    
    print(f"\nSaved summary report to {report_file}")

def main():
    # Extract data from Sheet3
    sheet3_data = extract_sheet3()
    
    # Analyze the data
    if sheet3_data is not None:
        analyze_sheet3_data(sheet3_data)

if __name__ == "__main__":
    main() 