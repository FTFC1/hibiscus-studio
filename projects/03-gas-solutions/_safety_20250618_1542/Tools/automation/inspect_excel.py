#!/usr/bin/env python3
"""
Quick inspection script to understand the Excel file structure
"""
import pandas as pd
import json

def main():
    input_file = "../Database/Gas Leads.xlsx"
    
    # Get sheet names
    xl = pd.ExcelFile(input_file)
    sheet_names = xl.sheet_names
    
    print(f"Excel file contains {len(sheet_names)} sheets:")
    for i, name in enumerate(sheet_names):
        print(f"  {i}: {name}")
    
    # For each sheet, attempt to read with different header options and report shape
    results = {}
    
    for i, name in enumerate(sheet_names):
        print(f"\n--- Sheet {i}: {name} ---")
        sheet_results = []
        
        for header in [None, 0, 1]:
            try:
                df = pd.read_excel(input_file, sheet_name=i, header=header)
                col_names = [str(col)[:50] + '...' if len(str(col)) > 50 else str(col) for col in df.columns]
                
                result = {
                    "header": header,
                    "shape": df.shape,
                    "columns": col_names
                }
                
                print(f"  Header={header}: Shape={df.shape}, First few columns: {col_names[:3]}")
                
                if 'CLIENT' in df.columns or 'LOCATION' in df.columns:
                    print(f"    *** Found key columns with header={header} ***")
                    
                    # Show sample data for these columns
                    if 'CLIENT' in df.columns:
                        clients = df['CLIENT'].dropna().head(3).tolist()
                        print(f"    Sample Clients: {clients}")
                    
                    if 'LOCATION' in df.columns:
                        locations = df['LOCATION'].dropna().head(3).tolist()
                        print(f"    Sample Locations: {locations}")
                
                sheet_results.append(result)
            except Exception as e:
                print(f"  Error with header={header}: {str(e)}")
        
        results[name] = sheet_results
    
    # Save results
    with open("../Database/TestResults/excel_structure.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print("\nSaved structure details to ../Database/TestResults/excel_structure.json")

if __name__ == "__main__":
    main() 
"""
Quick inspection script to understand the Excel file structure
"""
import pandas as pd
import json

def main():
    input_file = "../Database/Gas Leads.xlsx"
    
    # Get sheet names
    xl = pd.ExcelFile(input_file)
    sheet_names = xl.sheet_names
    
    print(f"Excel file contains {len(sheet_names)} sheets:")
    for i, name in enumerate(sheet_names):
        print(f"  {i}: {name}")
    
    # For each sheet, attempt to read with different header options and report shape
    results = {}
    
    for i, name in enumerate(sheet_names):
        print(f"\n--- Sheet {i}: {name} ---")
        sheet_results = []
        
        for header in [None, 0, 1]:
            try:
                df = pd.read_excel(input_file, sheet_name=i, header=header)
                col_names = [str(col)[:50] + '...' if len(str(col)) > 50 else str(col) for col in df.columns]
                
                result = {
                    "header": header,
                    "shape": df.shape,
                    "columns": col_names
                }
                
                print(f"  Header={header}: Shape={df.shape}, First few columns: {col_names[:3]}")
                
                if 'CLIENT' in df.columns or 'LOCATION' in df.columns:
                    print(f"    *** Found key columns with header={header} ***")
                    
                    # Show sample data for these columns
                    if 'CLIENT' in df.columns:
                        clients = df['CLIENT'].dropna().head(3).tolist()
                        print(f"    Sample Clients: {clients}")
                    
                    if 'LOCATION' in df.columns:
                        locations = df['LOCATION'].dropna().head(3).tolist()
                        print(f"    Sample Locations: {locations}")
                
                sheet_results.append(result)
            except Exception as e:
                print(f"  Error with header={header}: {str(e)}")
        
        results[name] = sheet_results
    
    # Save results
    with open("../Database/TestResults/excel_structure.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print("\nSaved structure details to ../Database/TestResults/excel_structure.json")

if __name__ == "__main__":
    main() 