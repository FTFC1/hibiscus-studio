#!/usr/bin/env python3
"""
Script to inspect the Gas Leads.xlsx file structure in detail
"""

import pandas as pd
import os

def main():
    # Path to the Gas Leads Excel file
    input_file = "Database/Gas Leads.xlsx"
    
    # Load the data
    try:
        # First try to read it without skipping rows
        df = pd.read_excel(input_file)
        print(f"File loaded with {len(df)} rows and {len(df.columns)} columns")
        print(f"Columns: {df.columns.tolist()}")
        
        # Print the first 5 rows to see the structure
        print("\nFirst 5 rows:")
        print(df.head())
        
        # Try reading the file with different header positions
        print("\nTrying with header=1 (skip first row):")
        df_skip1 = pd.read_excel(input_file, header=1)
        print(f"Columns with header=1: {df_skip1.columns.tolist()}")
        print(df_skip1.head(2))
        
        print("\nTrying with header=2 (skip first two rows):")
        df_skip2 = pd.read_excel(input_file, header=2)
        print(f"Columns with header=2: {df_skip2.columns.tolist()}")
        print(df_skip2.head(2))
        
        print("\nTrying with header=3 (skip first three rows):")
        df_skip3 = pd.read_excel(input_file, header=3)
        print(f"Columns with header=3: {df_skip3.columns.tolist()}")
        print(df_skip3.head(2))
        
        # Save the proper structure to a new file for our processing
        proper_file = "Database/TestResults/gas_leads_structured.xlsx"
        
        # Determine which header position gives us proper column names
        # (check for common company-related column names)
        company_columns = ['Client', 'Company', 'Name', 'Customer', 'Business']
        location_columns = ['Location', 'Region', 'Address', 'City']
        industry_columns = ['Industry', 'Sector', 'Business Type', 'Ministry']
        
        # Check which dataframe has the most identifiable columns
        dfs = [df, df_skip1, df_skip2, df_skip3]
        best_df = None
        best_score = -1
        
        for i, df_check in enumerate(dfs):
            score = 0
            columns = [col.lower() for col in df_check.columns]
            
            for col in company_columns:
                if any(col.lower() in c for c in columns):
                    score += 1
            
            for col in location_columns:
                if any(col.lower() in c for c in columns):
                    score += 1
            
            for col in industry_columns:
                if any(col.lower() in c for c in columns):
                    score += 1
            
            print(f"\nDataFrame with header={i if i > 0 else 'default'} has score: {score}")
            
            if score > best_score:
                best_score = score
                best_df = df_check
        
        if best_df is not None:
            # Save the best structure
            best_df.to_excel(proper_file, index=False)
            print(f"\nSaved structured data to {proper_file}")
            
            # Generate some sample companies for our news search
            print("\nSample company names for our tests:")
            
            # Try to identify a company column
            company_col = None
            for col in best_df.columns:
                if any(term.lower() in col.lower() for term in company_columns):
                    company_col = col
                    break
            
            if company_col:
                sample_companies = best_df[company_col].dropna().head(10).tolist()
                print(f"Found company column: {company_col}")
                for i, company in enumerate(sample_companies):
                    print(f"{i+1}. {company}")
            else:
                print("Could not identify company column")
                # Create a small test file with some Nigerian companies for testing
                test_companies = [
                    "Dangote Cement",
                    "MTN Nigeria",
                    "Zenith Bank",
                    "Nigerian Breweries",
                    "Flour Mills of Nigeria",
                    "Nestle Nigeria",
                    "BUA Cement",
                    "Access Bank",
                    "Guinness Nigeria",
                    "Oando PLC"
                ]
                
                # Create a test file with these companies
                test_df = pd.DataFrame({
                    "Company Name": test_companies,
                    "Industry": ["Manufacturing", "Telecommunications", "Banking", 
                                "Manufacturing", "Manufacturing", "Consumer Goods", 
                                "Manufacturing", "Banking", "Manufacturing", "Oil & Gas"],
                    "Region": ["Lagos" for _ in range(10)]
                })
                
                test_file = "Database/TestResults/test_companies.xlsx"
                test_df.to_excel(test_file, index=False)
                print(f"Created test file with sample Nigerian companies at {test_file}")
        
    except Exception as e:
        print(f"Error processing file: {str(e)}")

if __name__ == "__main__":
    main() 