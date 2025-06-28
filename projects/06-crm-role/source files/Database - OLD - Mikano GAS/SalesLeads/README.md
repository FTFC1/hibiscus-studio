# Power Company Leads Database

This directory contains data about Nigerian companies with high power requirements, making them potential candidates for Independent Power Plant (IPP) conversion.

## Contents

- **CSV Files**: Structured data in comma-separated values format
- **Excel Files**: Spreadsheet data for easy filtering and analysis
- **Markdown Files**: Human-readable summaries of company information

## Data Structure

Each company record includes the following information:

| Field | Description |
|-------|-------------|
| Company Name | Name of the Nigerian company |
| Industry | Industry sector the company operates in |
| Power Mentions | Number of power-related keywords found |  
| Location | Company's primary location in Nigeria |
| News Summary | Brief summary of the news article |
| News URL | Source URL of the news article |
| Date Found | Date when the company was identified |
| Power Related Text | Text excerpts related to power usage |

## How This Data Is Generated

1. Our crawler tools scan Nigerian business news websites for mentions of power-intensive industries
2. The system extracts company information from these articles
3. Companies are ranked by their power requirements based on textual analysis
4. Results are saved in multiple formats for easy access and analysis

## Using This Data

The data in this directory can be used to:

1. Identify potential IPP conversion candidates
2. Prioritize sales leads based on power requirements
3. Target specific industries or regions with high power needs
4. Generate customized outreach based on specific company challenges

## Updating The Data

This data is automatically updated by running the following scripts:

```bash
cd ../Tools
python power_company_crawler.py   # For in-depth crawling of a single site
python run_crawlers.py            # For parallel crawling of multiple sites
```

For more information on the crawler tools, see the [Tools README](../Tools/README.md).

## Privacy and Usage Notice

This data is for internal use only. Please respect the privacy of the companies listed and use this information responsibly for legitimate business purposes. 