#!/usr/bin/env python3
"""
Deep inspection script for Gas Leads.xlsx to understand its exact structure
"""
import pandas as pd
import numpy as np
import os
import json

def inspect_excel_file(file_path):
    """Thoroughly inspect an Excel file to understand its structure"""
    print(f"\n{'='*80}\nINSPECTING FILE: {file_path}\n{'='*80}")
    
    # Try to read with different header options and sheet indexes
    for sheet_idx in range(3):  # Try first 3 sheets
        try:
            # Try without header first
            print(f"\n--- SHEET {sheet_idx}, NO HEADER ---")
            df_raw = pd.read_excel(file_path, sheet_name=sheet_idx, header=None)
            print(f"Shape: {df_raw.shape}")
            print("First 5 rows (raw, no header):")
            print(df_raw.head(5))
            
            # Then with different header positions
            for header_pos in [0, 1, 2, 3]:
                print(f"\n--- SHEET {sheet_idx}, HEADER ROW {header_pos} ---")
                try:
                    df = pd.read_excel(file_path, sheet_name=sheet_idx, header=header_pos)
                    print(f"Shape: {df.shape}")
                    print(f"Columns: {df.columns.tolist()}")
                    print("First 5 rows:")
                    print(df.head(5))
                    
                    # Check for NaN and empty values in each column
                    print("\nColumn stats:")
                    for col in df.columns:
                        null_count = df[col].isnull().sum()
                        empty_str_count = (df[col] == '').sum() if df[col].dtype == 'object' else 0
                        print(f"  {col}: {null_count} NaN, {empty_str_count} empty strings")
                    
                    # Look for industry-related and company-related columns
                    industry_keywords = ['industry', 'sector', 'business', 'type']
                    company_keywords = ['company', 'client', 'customer', 'business', 'name']
                    
                    print("\nPotential industry columns:")
                    for col in df.columns:
                        if any(kw in str(col).lower() for kw in industry_keywords):
                            unique_vals = df[col].dropna().unique()
                            print(f"  {col}: {len(unique_vals)} unique values")
                            print(f"  Sample values: {unique_vals[:5]}")
                    
                    print("\nPotential company columns:")
                    for col in df.columns:
                        if any(kw in str(col).lower() for kw in company_keywords):
                            unique_vals = df[col].dropna().unique()
                            print(f"  {col}: {len(unique_vals)} unique values")
                            print(f"  Sample values: {unique_vals[:5]}")
                    
                except Exception as e:
                    print(f"  Error with header={header_pos}: {str(e)}")
        
        except Exception as e:
            print(f"  Error reading sheet {sheet_idx}: {str(e)}")
    
    # Get sheet names
    try:
        xl = pd.ExcelFile(file_path)
        print(f"\nSheet names: {xl.sheet_names}")
    except Exception as e:
        print(f"Error getting sheet names: {str(e)}")

def main():
    input_file = "Database/Gas Leads.xlsx"
    inspect_excel_file(input_file)
    
    # Create TestResults directory if it doesn't exist
    os.makedirs("Database/TestResults", exist_ok=True)
    
    # Save a proper CSV view for the file with the best guess at structure
    try:
        # Try header=1 which seemed to work in previous inspection
        df = pd.read_excel(input_file, header=1)
        csv_path = "Database/TestResults/gas_leads_proper.csv"
        df.to_csv(csv_path, index=False)
        print(f"\nSaved properly structured CSV to {csv_path}")
        
        # Save as JSON for easier viewing
        json_path = "Database/TestResults/gas_leads_structure.json"
        
        # Prepare data for JSON serialization
        data = {
            "columns": df.columns.tolist(),
            "dtypes": {col: str(df[col].dtype) for col in df.columns},
            "sample_rows": df.head(5).replace({np.nan: None}).to_dict('records'),
            "stats": {
                "row_count": len(df),
                "column_count": len(df.columns),
                "null_counts": {col: int(df[col].isnull().sum()) for col in df.columns}
            }
        }
        
        # Save to JSON
        with open(json_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"Saved structure details to {json_path}")
        
    except Exception as e:
        print(f"Error saving proper view: {str(e)}")

if __name__ == "__main__":
    main() 