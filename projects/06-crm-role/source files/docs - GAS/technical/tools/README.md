# Power Company Scraper Tools

This directory contains scripts to scrape Nigerian news websites for information about companies with high power requirements. The tools are designed to identify potential leads for Independent Power Plant (IPP) conversions.

## Scripts

1. `power_company_scraper.py` - Basic scraper for extracting company information from news articles
2. `power_company_crawler.py` - Advanced crawler that recursively searches news sites for relevant articles
3. `run_crawlers.py` - Utility to run multiple crawlers in parallel for faster processing
4. `test_power_scraper.py` - Tests the core functionality of the scraper scripts
5. `test_power_sources.py` - Tests connectivity to Nigerian power sector news sources

## Requirements

The scripts require Python 3.6+ and the following packages:
- pandas
- numpy
- openpyxl
- requests
- beautifulsoup4

You can install all requirements with:
```
pip install -r ../requirements.txt
```

## Usage

### Basic Scraper

The basic scraper processes a list of predefined news sites:

```bash
python power_company_scraper.py
```

### Advanced Crawler

The advanced crawler can search more deeply through news sites:

```bash
python power_company_crawler.py
```

Options:
- `--url URL` - Crawl a specific URL instead of the default list
- `--output DIR` - Specify output directory (default: ../Database/SalesLeads)
- `--max-pages N` - Maximum number of pages to crawl per site (default: 100)
- `--max-depth N` - Maximum depth of links to follow (default: 3)
- `--log-file FILE` - Log file name

### Parallel Crawler

To crawl multiple sites in parallel for faster processing:

```bash
python run_crawlers.py
```

Options:
- `--output DIR` - Specify output directory (default: ../Database/SalesLeads)
- `--max-pages N` - Maximum number of pages to crawl per site (default: 100)
- `--max-depth N` - Maximum depth of links to follow (default: 3)
- `--workers N` - Number of parallel worker processes (default: CPU count)
- `--merge-only` - Only merge existing results without crawling

### Testing Scripts

To test the core scraper functionality:

```bash
python test_power_scraper.py
```

To test connectivity to Nigerian power sector news sources:

```bash
python test_power_sources.py
```

## Output

The scripts generate three types of output files:
1. CSV files (.csv) - For data analysis and importing to other systems
2. Excel files (.xlsx) - For easy viewing and filtering
3. Markdown files (.md) - For a quick human-readable summary

All output files are saved to the `../Database/SalesLeads` directory by default.

## News Sources

The scripts now include specialized Nigerian power sector sources:

1. General Nigerian News:
   - BusinessDay, Nairametrics, Punch, Guardian, Vanguard, Premium Times, etc.

2. Power Sector Specific:
   - Nigeria Energy (formerly Power Nigeria)
   - Nigerian Electricity Regulatory Commission (NERC)
   - Energy sections of major newspapers
   - KPMG Nigeria Power Sector Updates
   - Energypedia Nigeria
   - African Power Platform
   - Nigeria Energy Transition Plan
   - Power Africa Nigeria
   - Rural Electrification Agency (REA)

## Customization

You can customize the scripts by modifying the following:

- `NEWS_SOURCES`/`START_URLS` - List of news websites to scrape
- `POWER_KEYWORDS` - Keywords related to power-intensive industries
- `POWER_INTENSIVE_INDUSTRIES` - Industry sectors with high power consumption
- `BUSINESS_SECTION_KEYWORDS` - Keywords to identify business sections of news sites
- `MAX_PAGES_PER_SITE` - Maximum number of pages to crawl per news site
- `MAX_DEPTH` - Maximum depth of crawling from the root page

## Note on Rate Limiting

These scripts include random delays between requests to avoid overloading servers. If you're crawling a large number of pages, be respectful of the website's resources and consider adding longer delays. 