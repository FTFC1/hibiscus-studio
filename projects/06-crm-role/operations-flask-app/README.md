# Vehicle Dispatch Report Processor

A Python tool for automatically processing vehicle dispatch reports, specifically designed to:

1. Split Engine-VIN pairs into separate rows for Changan, Maxus, and Geely vehicles
2. Create a clean, consolidated report with separate tabs for each brand
3. Handle various complex Engine-VIN formats with robust parsing logic
4. Normalize engine number case patterns for consistent data analysis

## Features

- **Automatic Format Detection**: Identifies the correct columns and formats in the input file
- **Multi-Format Support**: Handles various Engine-VIN pair formats:
  - Standard: `ENGINENUM-VINNUM`
  - Comma-separated multiple pairs: `ENGINE1-VIN1,ENGINE2-VIN2`
  - Geely with double hyphens: `JLH-3G15TD-N6BA5614053--LB37622Z2PX410651`
  - Geely with asterisks: `JLH-3G15TD*N6BA5614053*-LB37622Z2PX410651`
  - Geely with quotes: `JLH- 3G15TD"M5GA5602385"` → `JLH-3G15TD-M5GA5602385`
  - Geely with spaces after hyphens: `JLH- 3G15TD` → `JLH-3G15TD`
  - Geely with special characters: `JL¿-4G15M1UA4900885` → `JL-4G15M1UA4900885`
- **Consolidated Reporting**: Creates a single Excel file with tabs for:
  - Summary data (total entries per brand)
  - Changan vehicles
  - Maxus vehicles
  - Geely vehicles
  - RAW data (unmodified original data)
- **Advanced Data Cleaning**:
  - Removes artifacts like trailing hyphens, asterisks, quotes, and invalid characters
  - Fixes spacing issues between engine components (e.g., `JLH- 3G15TD` → `JLH-3G15TD`)
  - Normalizes case for Geely engine patterns (e.g., `Jl-4G15` → `JL-4G15`)
  - Standardizes engine family nomenclature (e.g., `jlh-3g15td` → `JLH-3G15TD`)
  - Removes non-alphanumeric characters while preserving hyphens

## Usage

1. Place your Excel (.xls or .xlsx) dispatch report in the `Files/` directory
2. Run the script using Python:

```bash
python3 simpler_processor.py
```

3. The processed report will be saved in `Files/output/` with the naming convention `Dispatch Report MM - YYYY.xlsx`

## Analysis Tools

The package includes specialized analysis tools:

- **geely_engine_analyzer.py**: Analyzes Geely engine patterns in processed reports to identify common families and variants
- **fix_engine_case.py**: Fixes case sensitivity issues in engine numbers to standardize engine model codes 
- **analyze_fixed_file.py**: Analyzes the corrected engine data to verify normalization and document engine family distributions

To run the engine analysis tools:

```bash
# First analyze the raw engine patterns
python3 geely_engine_analyzer.py

# Fix engine case sensitivity issues
python3 fix_engine_case.py

# Analyze the fixed engine patterns
python3 analyze_fixed_file.py
```

## Requirements

- Python 3.x
- Pandas
- Openpyxl
- xlrd (for .xls files)

Install dependencies using:
```bash
pip install -r requirements.txt
```

## Input Format

The script expects an Excel file with columns for:
- Customer Name
- Item Description (used to identify vehicle brand)
- Engine-Alternator No. (containing the Engine-VIN pairs to split)

## Output Format

The generated report includes only the requested columns:
- Customer Name
- Item Code
- Item Description
- Engine Number
- VIN Number

## Known Vehicle Format Patterns

### Changan
Format: `2TZD 003423-LJNTGU5N6KN117571`
- Engine: `2TZD 003423`
- VIN: `LJNTGU5N6KN117571`

### Maxus
Format: `N9BP015776-LS4ASE2A4RJ100029`
- Engine: `N9BP015776`
- VIN: `LS4ASE2A4RJ100029`

### Geely (Multiple Formats)
Format 1: `JLH-3G15TD-N6BA5614053--LB37622Z2PX410651` (double hyphen)
- Engine: `JLH-3G15TD-N6BA5614053`
- VIN: `LB37622Z2PX410651`

Format 2: `JLH-3G15TD*N6BA5614053*-LB37622Z2PX410651` (with asterisks)
- Engine: `JLH-3G15TD-N6BA5614053`
- VIN: `LB37622Z2PX410651`

Format 3: `JLH- 3G15TD"M5GA5602385"` (with spaces and quotes)
- Engine: `JLH-3G15TDM5GA5602385`
- VIN: `LB37622Z8MX412707` (from matching pair)

Format 4: `JL¿-4G15M1UA4900885` (with special characters)
- Engine: `JL-4G15M1UA4900885`
- VIN: `L6T7824Z3MW009095`

Format 5: `Jl-4G15` vs `JL-4G15` (case sensitivity issue)
- Both normalized to: `JL-4G15`

## Geely Engine Families

Analysis of processed data revealed three main Geely engine families:
- **JL-4G15**: 40.12% of all Geely engines
- **JLH-3G15TD**: 48.13% of all Geely engines
- **JLD-4G24**: 11.24% of all Geely engines

These patterns are automatically normalized during processing to ensure consistency.

## Troubleshooting

If you encounter issues with specific engine number or VIN formats, you can run the specialized analysis tools:

```bash
# For general data analysis
python3 sample_data_analyzer.py

# For Geely engine pattern analysis
python3 geely_engine_analyzer.py

# For fixing engine case issues
python3 fix_engine_case.py
```

These tools will analyze the most recent output file and highlight any potential formatting problems. 