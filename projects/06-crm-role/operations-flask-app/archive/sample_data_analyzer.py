#!/usr/bin/env python3
"""
Quick script to check sample VIN-Engine splits from the processed report
"""
import pandas as pd
import os

def analyze_report():
    # Find the latest report
    report_dir = "Files/output"
    report_files = [f for f in os.listdir(report_dir) if f.startswith("Dispatch Report")]
    if not report_files:
        print("No report files found!")
        return
    
    # Sort by modification time (most recent first)
    report_files.sort(key=lambda x: os.path.getmtime(os.path.join(report_dir, x)), reverse=True)
    latest_report = os.path.join(report_dir, report_files[0])
    print(f"Analyzing most recent report: {latest_report} (modified {os.path.getmtime(latest_report)})")
    
    # Load the Geely sheet
    try:
        df = pd.read_excel(latest_report, sheet_name="Geely")
        print(f"Loaded Geely data with {len(df)} rows")
        
        # Check if we have Engine and VIN columns
        if 'Engine' not in df.columns or 'VIN' not in df.columns:
            print("Missing Engine or VIN columns!")
            print(f"Available columns: {', '.join(df.columns)}")
            return
        
        # Specifically check for problematic patterns
        print("\nChecking for specific problematic patterns:")
        
        # Pattern: Jl4G15-L6UA4927116-L6T7824Z5MW005162
        jl_pattern = df[(df['Engine'].astype(str).str.startswith('JL') | df['Engine'].astype(str).str.startswith('Jl')) & 
                        df['Engine'].astype(str).str.contains('4G15')]
        
        if len(jl_pattern) > 0:
            print(f"Found {len(jl_pattern)} entries with 'Jl4G15' or 'JL4G15' pattern")
            print("Sample of these entries:")
            for i, row in jl_pattern.head(5).iterrows():
                print(f"  Engine: '{row['Engine']}'")
                print(f"  VIN: '{row['VIN']}'")
                print()
        
        # Check specifically for L6UA4927116 pattern in any column
        print("\nSearching for entries similar to 'Jl4G15-L6UA4927116-L6T7824Z5MW005162':")
        
        # Search in all columns for L6UA49, which would match L6UA4927116
        pattern_matches = df[df.astype(str).apply(lambda x: x.str.contains('L6UA49', case=False, na=False)).any(axis=1)]
        
        if len(pattern_matches) > 0:
            print(f"Found {len(pattern_matches)} rows with 'L6UA49' pattern (matching L6UA4927116)")
            print("Details:")
            for i, row in pattern_matches.iterrows():
                print(f"  Row {i}:")
                for col in row.index:
                    val = str(row[col])
                    if 'L6UA49' in val:
                        print(f"    {col}: '{val}' <-- MATCH FOUND HERE")
                    else:
                        print(f"    {col}: '{val}'")
                print()
        
        # Analyze types of engine formats
        sample_size = min(20, len(df))
        print(f"\nSample of {sample_size} rows:")
        print("-" * 80)
        
        for i in range(sample_size):
            row = df.iloc[i]
            engine = row['Engine'] if pd.notna(row['Engine']) else ""
            vin = row['VIN'] if pd.notna(row['VIN']) else ""
            
            # Check engine for internal hyphens (might indicate split issues)
            has_internal_hyphen = "-" in engine
            
            # For Geely, internal hyphens are normal in engine numbers
            if has_internal_hyphen and ('JLH' in engine or 'JL-' in engine or '4G' in engine):
                engine_comment = "✓ (Contains expected hyphens for Geely)"
            else:
                engine_comment = "❌ Has internal hyphen" if has_internal_hyphen else "✓"
            
            # Check VIN format
            vin_ok = len(vin) >= 10 and vin.startswith(("L", "I", "V", "W"))
            vin_comment = "✓" if vin_ok else "❌ Suspicious VIN format"
            
            # Check for trailing hyphen in engine 
            trailing_hyphen = engine.endswith("-")
            if trailing_hyphen:
                engine_comment += " ❌ Has trailing hyphen"
            
            print(f"#{i+1}:")
            print(f"  Engine: {engine} ({engine_comment})")
            print(f"  VIN: {vin} ({vin_comment})")
            print("-" * 80)
        
        # Check for any potential issues
        potential_issues = 0
        trailing_hyphens = sum(1 for e in df['Engine'] if isinstance(e, str) and e.endswith('-'))
        if trailing_hyphens > 0:
            potential_issues += trailing_hyphens
            print(f"⚠️ Found {trailing_hyphens} engines with trailing hyphens")
        
        # Check for JLH or 4G24 entries that might be Geely-specific formats
        geely_engines = df[df['Engine'].astype(str).str.contains('JLH|4G24', na=False)]
        print(f"Total Geely-specific engines (JLH/4G24): {len(geely_engines)}")
        
        # Check if any engines still have internal hyphens
        engines_with_hyphens = df[df['Engine'].astype(str).str.contains('-', na=False)]
        print(f"Engines containing hyphens: {len(engines_with_hyphens)}")
        
        if len(engines_with_hyphens) > 0:
            print("\nSample of engines with hyphens:")
            for i, row in engines_with_hyphens.head(5).iterrows():
                print(f"  Engine: {row['Engine']}")
                print(f"  VIN: {row['VIN']}")
                print()
        
        print(f"Analysis complete. Found {potential_issues} potential issues.")
        
    except Exception as e:
        print(f"Error analyzing report: {e}")

if __name__ == "__main__":
    analyze_report() 