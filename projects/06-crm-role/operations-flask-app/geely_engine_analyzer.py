#!/usr/bin/env python3
"""
Geely Engine Analyzer
Script to analyze Geely engine patterns in the processed output file
"""

import pandas as pd
import re
import os
from collections import Counter
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

def analyze_geely_engines(file_path):
    """Analyze Geely engine patterns in the specified Excel file."""
    print(f"Loading data from {file_path}...")
    try:
        df = pd.read_excel(file_path, sheet_name='Geely')
        print(f"Data loaded successfully. Found {len(df)} Geely records.")
        
        # Handle null values by filling them with empty strings
        df['Engine'] = df['Engine'].fillna('')
        
    except Exception as e:
        print(f"Error loading data: {e}")
        return
    
    # Basic statistics
    total_rows = len(df)
    unique_engines = df[df['Engine'] != '']['Engine'].nunique()  # Count non-empty engines
    non_empty_engines = df[df['Engine'] != '']['Engine'].count()
    
    print(f"\n===== BASIC STATISTICS =====")
    print(f"Total Geely records: {total_rows}")
    print(f"Records with engines: {non_empty_engines}")
    print(f"Unique engine numbers: {unique_engines}")
    if non_empty_engines > 0:
        print(f"Duplication rate: {(1 - unique_engines/non_empty_engines)*100:.2f}%")
    else:
        print("No engines to calculate duplication rate")
    
    # Extract engine prefixes using regex
    engine_prefixes = []
    for engine in df[df['Engine'] != '']['Engine']:
        # Try to match patterns like JLH-3G15TD or JL-4G15
        match = re.match(r'([A-Za-z]+-[0-9][A-Za-z][0-9]+[A-Za-z]*)', engine)
        if match:
            prefix = match.group(1)
            engine_prefixes.append(prefix)
    
    # Count unique prefixes
    prefix_counter = Counter(engine_prefixes)
    print(f"\n===== ENGINE FAMILY DISTRIBUTION =====")
    print(f"Found {len(prefix_counter)} unique engine families.")
    
    # Print top families
    print("\nTop engine families:")
    for prefix, count in prefix_counter.most_common(10):
        print(f"{prefix}: {count} engines ({count/len(engine_prefixes)*100:.2f}%)")
    
    # Analyze JL-4G15 family
    jl4g15_engines = df[df['Engine'].str.startswith('JL-4G15')]['Engine'].tolist()
    print(f"\n===== JL-4G15 FAMILY ANALYSIS =====")
    print(f"Total JL-4G15 engines: {len(jl4g15_engines)}")
    print(f"Unique JL-4G15 engines: {len(set(jl4g15_engines))}")
    
    # Analyze Jl-4G15 family (lowercase L)
    jl_lowercase_engines = df[df['Engine'].str.startswith('Jl-4G15')]['Engine'].tolist()
    print(f"\n===== Jl-4G15 FAMILY ANALYSIS (lowercase l) =====")
    print(f"Total Jl-4G15 engines: {len(jl_lowercase_engines)}")
    print(f"Unique Jl-4G15 engines: {len(set(jl_lowercase_engines))}")
    
    # Analyze JLH-3G15TD family
    jlh3g15_engines = df[df['Engine'].str.startswith('JLH-3G15TD')]['Engine'].tolist()
    print(f"\n===== JLH-3G15TD FAMILY ANALYSIS =====")
    print(f"Total JLH-3G15TD engines: {len(jlh3g15_engines)}")
    print(f"Unique JLH-3G15TD engines: {len(set(jlh3g15_engines))}")
    
    # Count engines by their length to find anomalies
    engine_lengths = [len(e) for e in df[df['Engine'] != '']['Engine']]
    length_counter = Counter(engine_lengths)
    print(f"\n===== ENGINE LENGTH DISTRIBUTION =====")
    for length, count in sorted(length_counter.items()):
        print(f"Length {length}: {count} engines")
    
    # Second level analysis - look for serial number patterns
    jl4g15_serials = []
    for engine in jl4g15_engines:
        # Try to extract the serial part after the model code
        match = re.search(r'JL-4G15([A-Za-z0-9]+)', engine)
        if match:
            serial = match.group(1)
            jl4g15_serials.append(serial)
    
    # Print some example serials
    print(f"\n===== JL-4G15 SERIAL PATTERNS =====")
    serial_counter = Counter(jl4g15_serials)
    print(f"Found {len(serial_counter)} different serial patterns")
    print("\nMost common serial patterns:")
    for serial, count in serial_counter.most_common(5):
        print(f"{serial}: {count} engines")
    
    print("\nSample engines from each family:")
    for prefix in [p for p, _ in prefix_counter.most_common(3)]:
        print(f"\n{prefix} examples:")
        samples = df[df['Engine'].str.startswith(prefix)]['Engine'].drop_duplicates().head(3).tolist()
        for sample in samples:
            print(f"  {sample}")
    
    # Check for possible grouping issues - engines that should be the same but differ by case
    lowercase_issues = []
    all_non_empty_engines = df[df['Engine'] != '']['Engine'].tolist()
    for engine in all_non_empty_engines:
        lower_engine = engine.lower()
        matches = df[df['Engine'].str.lower() == lower_engine]['Engine'].unique()
        if len(matches) > 1 and engine in matches:  # Only add if this engine is in the matches
            if (engine, tuple(matches)) not in lowercase_issues:
                lowercase_issues.append((engine, tuple(matches)))
    
    # Remove duplicates
    lowercase_issues = list(set(lowercase_issues))
    
    if lowercase_issues:
        print(f"\n===== CASE SENSITIVITY ISSUES =====")
        print(f"Found {len(lowercase_issues)} engine numbers that differ only by case.")
        for eng, variants in lowercase_issues[:5]:
            print(f"Engine: {eng}, Variants: {', '.join(variants)}")
    
    # Check if JL-4G15 and Jl-4G15 might be the same engines
    combined_4g15 = set([e.lower() for e in jl4g15_engines + jl_lowercase_engines])
    print(f"\n===== CASE INSENSITIVE 4G15 ANALYSIS =====")
    print(f"JL-4G15 engines (uppercase L): {len(jl4g15_engines)}")  
    print(f"Jl-4G15 engines (lowercase l): {len(jl_lowercase_engines)}")
    print(f"Combined unique engines (case-insensitive): {len(combined_4g15)}")
    
    # If the combined count is about equal to the uppercase count, they're likely duplicates
    if len(combined_4g15) <= len(jl4g15_engines) + 10:  # Allow for some margin of error
        print("FINDING: JL-4G15 and Jl-4G15 appear to be the same engine family with case differences.")
    else:
        print("FINDING: JL-4G15 and Jl-4G15 appear to be distinct engine families.")
    
    print("\nAnalysis complete.")

if __name__ == "__main__":
    report_file = get_latest_report()
    if report_file:
        analyze_geely_engines(report_file)
    else:
        print("No report file found to analyze.") 