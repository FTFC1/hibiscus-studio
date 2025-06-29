#!/usr/bin/env python3
"""
Fix Engine Case Sensitivity Issues
Specifically targeting the inconsistency between JL-4G15 and Jl-4G15 patterns
"""

import pandas as pd
import re
import os
from pathlib import Path

def get_latest_report():
    """Find the most recent report file in the output directory."""
    output_dir = Path("Files/output")
    if not output_dir.exists():
        print(f"Output directory not found: {output_dir}")
        return None
    
    excel_files = list(output_dir.glob("*.xlsx"))
    if not excel_files:
        print(f"No Excel files found in {output_dir}")
        return None
    
    latest_file = max(excel_files, key=lambda x: x.stat().st_mtime)
    print(f"Found latest report: {latest_file}")
    return latest_file

def fix_engine_case(file_path):
    """Fix case sensitivity issues in engine numbers."""
    print(f"Loading data from {file_path}...")
    try:
        # Load all sheets
        with pd.ExcelFile(file_path) as xls:
            sheets = {}
            for sheet_name in xls.sheet_names:
                sheets[sheet_name] = pd.read_excel(xls, sheet_name=sheet_name)
                print(f"Loaded sheet '{sheet_name}' with {len(sheets[sheet_name])} rows")
    except Exception as e:
        print(f"Error loading data: {e}")
        return
    
    # Fix Geely sheet
    geely_df = sheets['Geely']
    geely_df['Engine'] = geely_df['Engine'].fillna('')
    
    # Count before fix
    unique_before = geely_df[geely_df['Engine'] != '']['Engine'].nunique()
    print(f"\nBefore fixes: {unique_before} unique Geely engines")
    
    # Fix 1: Normalize JL-4G15 vs Jl-4G15 (make all uppercase)
    jl4g15_pattern = re.compile(r'^Jl-4G', re.IGNORECASE)
    
    # Count engines matching pattern
    jl_engines = geely_df[geely_df['Engine'].str.contains(jl4g15_pattern)]['Engine'].tolist()
    print(f"Found {len(jl_engines)} engines with JL-4G prefix (case insensitive)")
    
    # Apply the fix
    def normalize_jl4g15(engine):
        if not isinstance(engine, str) or engine == '':
            return engine
        if jl4g15_pattern.match(engine):
            return re.sub(r'^Jl-', 'JL-', engine)
        return engine
    
    # Apply the fix
    geely_df['Engine'] = geely_df['Engine'].apply(normalize_jl4g15)
    
    # Fix 2: Normalize JLH-3G15TD case
    jlh_pattern = re.compile(r'^JLH-3G15TD', re.IGNORECASE)
    
    def normalize_jlh(engine):
        if not isinstance(engine, str) or engine == '':
            return engine
        if re.match(r'^JLH-3G15TD', engine, re.IGNORECASE):
            return re.sub(r'^[Jj][Ll][Hh]-3[Gg]15[Tt][Dd]', 'JLH-3G15TD', engine)
        return engine
    
    geely_df['Engine'] = geely_df['Engine'].apply(normalize_jlh)
    
    # Count after fixes
    unique_after = geely_df[geely_df['Engine'] != '']['Engine'].nunique()
    print(f"After fixes: {unique_after} unique Geely engines")
    print(f"Reduced by: {unique_before - unique_after} engines")
    
    # Generate output file name (original name with _fixed added)
    output_path = file_path.parent / f"{file_path.stem}_fixed{file_path.suffix}"
    
    # Write the modified data to a new Excel file
    with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
        for sheet_name, df in sheets.items():
            if sheet_name == 'Geely':
                geely_df.to_excel(writer, sheet_name=sheet_name, index=False)
            else:
                df.to_excel(writer, sheet_name=sheet_name, index=False)
    
    print(f"Fixed data saved to: {output_path}")
    
    # Quick check of engine families after fix
    fixed_4g15 = geely_df[geely_df['Engine'].str.startswith('JL-4G15')]['Engine'].nunique()
    print(f"\nEngine family counts after fixes:")
    print(f"JL-4G15: {fixed_4g15} unique engines")
    
    # Check if any Jl-4G15 (lowercase l) still exist
    lowercase_remaining = geely_df[geely_df['Engine'].str.startswith('Jl-4G15')]['Engine'].nunique()
    print(f"Jl-4G15 (lowercase l): {lowercase_remaining} unique engines (should be 0)")
    
    return output_path

if __name__ == "__main__":
    report_file = get_latest_report()
    if report_file:
        fixed_file = fix_engine_case(report_file)
        if fixed_file:
            print(f"\nTo analyze the fixed file, run: python geely_engine_analyzer.py")
    else:
        print("No report file found to fix.") 