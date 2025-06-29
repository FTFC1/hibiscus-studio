#!/usr/bin/env python3
"""
Analyze the fixed Geely engine data
Focus on unique engine patterns and distribution
"""

import pandas as pd
import re
import os
from collections import Counter
from pathlib import Path

def get_latest_fixed_report():
    """Find the most recent fixed report file in the output directory."""
    output_dir = Path("Files/output")
    if not output_dir.exists():
        print(f"Output directory not found: {output_dir}")
        return None
    
    fixed_files = list(output_dir.glob("*_fixed.xlsx"))
    if not fixed_files:
        print(f"No fixed Excel files found in {output_dir}")
        return None
    
    latest_file = max(fixed_files, key=lambda x: x.stat().st_mtime)
    print(f"Found latest fixed report: {latest_file}")
    return latest_file

def analyze_geely_patterns(file_path):
    """Analyze Geely engine patterns, focusing on unique families."""
    print(f"Loading data from {file_path}...")
    try:
        df = pd.read_excel(file_path, sheet_name='Geely')
        print(f"Data loaded successfully. Found {len(df)} Geely records.")
        
        # Handle null values by filling them with empty strings
        df['Engine'] = df['Engine'].fillna('')
        
    except Exception as e:
        print(f"Error loading data: {e}")
        return
    
    # Count unique engines
    total_engines = len(df[df['Engine'] != ''])
    unique_engines = df[df['Engine'] != '']['Engine'].nunique()
    print(f"\n===== BASIC STATISTICS =====")
    print(f"Total engines: {total_engines}")
    print(f"Unique engines: {unique_engines}")
    print(f"Duplication rate: {(1 - unique_engines/total_engines)*100:.2f}%")
    
    # Group by engine prefix patterns
    print(f"\n===== ENGINE PREFIX PATTERNS =====")
    
    # Define common patterns to look for
    patterns = {
        'JL-4G15': r'^JL-4G15',
        'JLH-3G15TD': r'^JLH-3G15TD',
        'JLD-4G24': r'^JLD-4G24',
        'Other': r'.*'
    }
    
    # Count engines by pattern
    pattern_counts = {}
    for name, pattern in patterns.items():
        if name == 'Other':
            # Count engines not matching previous patterns
            count = len(df[~df['Engine'].str.contains(patterns['JL-4G15']) & 
                          ~df['Engine'].str.contains(patterns['JLH-3G15TD']) & 
                          ~df['Engine'].str.contains(patterns['JLD-4G24']) & 
                          (df['Engine'] != '')])
        else:
            count = len(df[df['Engine'].str.contains(pattern)])
        pattern_counts[name] = count
    
    for name, count in pattern_counts.items():
        print(f"{name}: {count} engines ({count/total_engines*100:.2f}%)")
    
    # Analyze patterns further
    serial_patterns = {}
    
    # Extract serial numbers from JL-4G15 engines
    jl4g15_engines = df[df['Engine'].str.contains(patterns['JL-4G15'])]['Engine'].tolist()
    jl4g15_serials = []
    
    # Classify JL-4G15 engines by their first 9-10 characters
    jl4g15_prefixes = {}
    for engine in jl4g15_engines:
        if len(engine) >= 9:
            prefix = engine[:9]  # Take first 9 chars
            jl4g15_prefixes[prefix] = jl4g15_prefixes.get(prefix, 0) + 1
    
    print(f"\n===== JL-4G15 SUB-PATTERNS =====")
    print(f"Found {len(jl4g15_prefixes)} different sub-patterns")
    print(f"Top 10 sub-patterns:")
    for prefix, count in sorted(jl4g15_prefixes.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"{prefix}: {count} engines")
    
    # Do the same for JLH-3G15TD engines
    jlh3g15_engines = df[df['Engine'].str.contains(patterns['JLH-3G15TD'])]['Engine'].tolist()
    jlh3g15_prefixes = {}
    for engine in jlh3g15_engines:
        if len(engine) >= 12:
            prefix = engine[:12]  # Take first 12 chars
            jlh3g15_prefixes[prefix] = jlh3g15_prefixes.get(prefix, 0) + 1
    
    print(f"\n===== JLH-3G15TD SUB-PATTERNS =====")
    print(f"Found {len(jlh3g15_prefixes)} different sub-patterns")
    print(f"Top 10 sub-patterns:")
    for prefix, count in sorted(jlh3g15_prefixes.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"{prefix}: {count} engines")
    
    # Check how many unique Geely engine "families" we have
    print(f"\n===== UNIQUE ENGINE FAMILIES =====")
    # Extract the base model code from each engine (e.g., JL-4G15, JLH-3G15TD)
    model_codes = set()
    for engine in df[df['Engine'] != '']['Engine']:
        match = re.match(r'([A-Z]+-[0-9][A-Z][0-9]+[A-Z]*)', engine, re.IGNORECASE)
        if match:
            model_codes.add(match.group(1).upper())
    
    print(f"Found {len(model_codes)} unique engine model codes:")
    for code in sorted(model_codes):
        count = len(df[df['Engine'].str.contains(code, case=False)])
        print(f"{code}: {count} engines")
    
    # Count unique actual engines (ignoring minor variation in model code capitalization)
    normalized_engines = set()
    for engine in df[df['Engine'] != '']['Engine']:
        # Normalize the engine string (uppercase the model code prefix)
        normalized = re.sub(r'^([A-Za-z]+-[0-9][A-Za-z][0-9]+[A-Za-z]*)', 
                           lambda m: m.group(1).upper(), 
                           engine)
        normalized_engines.add(normalized)
    
    print(f"\nTotal unique normalized engines: {len(normalized_engines)}")
    
    print("\nAnalysis complete.")

if __name__ == "__main__":
    fixed_report = get_latest_fixed_report()
    if fixed_report:
        analyze_geely_patterns(fixed_report)
    else:
        print("No fixed report file found to analyze. Run fix_engine_case.py first.") 