import os
import subprocess
import argparse
import multiprocessing
import time
from datetime import datetime
import pandas as pd
import shutil

def run_crawler(url, output_dir, max_pages, max_depth):
    """Run the crawler for a specific URL"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_file = f"crawler_{url.replace('https://', '').replace('http://', '').replace('/', '_')}_{timestamp}.log"
    
    cmd = [
        "python3", "power_company_crawler.py",
        "--url", url,
        "--output", output_dir,
        "--max-pages", str(max_pages),
        "--max-depth", str(max_depth),
        "--log-file", log_file
    ]
    
    print(f"Starting crawler for {url}")
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    
    if process.returncode != 0:
        print(f"Error running crawler for {url}: {stderr.decode()}")
    else:
        print(f"Crawler for {url} completed. See {log_file} for details.")
    
    return url

def merge_results(output_dir):
    """Merge all CSV files in the output directory into a single file"""
    csv_files = [f for f in os.listdir(output_dir) if f.endswith('.csv')]
    
    if not csv_files:
        print("No CSV files found to merge.")
        return
    
    # Read all CSV files into a list of DataFrames
    dfs = []
    for csv_file in csv_files:
        file_path = os.path.join(output_dir, csv_file)
        df = pd.read_csv(file_path)
        dfs.append(df)
    
    # Concatenate all DataFrames
    merged_df = pd.concat(dfs, ignore_index=True)
    
    # Remove duplicates
    merged_df.drop_duplicates(subset=['Company Name'], keep='first', inplace=True)
    
    # Sort by power mentions (descending)
    merged_df.sort_values(by=['Power Mentions'], ascending=False, inplace=True)
    
    # Save to CSV and Excel
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    merged_csv = os.path.join(output_dir, f"merged_power_companies_{timestamp}.csv")
    merged_excel = os.path.join(output_dir, f"merged_power_companies_{timestamp}.xlsx")
    
    merged_df.to_csv(merged_csv, index=False)
    merged_df.to_excel(merged_excel, index=False)
    
    # Generate a Markdown summary
    md_content = f"# Nigerian Companies with High Power Requirements\n\n"
    md_content += f"*Generated on {datetime.now().strftime('%Y-%m-%d')}*\n\n"
    md_content += f"## Top 100 Companies by Power Mentions\n\n"
    md_content += f"| Company | Industry | Location | Power Mentions | News Summary |\n"
    md_content += f"|---------|----------|----------|----------------|-------------|\n"
    
    for _, row in merged_df.head(100).iterrows():
        md_content += f"| {row['Company Name']} | {row['Industry']} | {row['Location'] or 'Unknown'} | {row['Power Mentions']} | {row['News Summary'][:100]}... |\n"
    
    merged_md = os.path.join(output_dir, f"merged_power_companies_{timestamp}.md")
    with open(merged_md, "w", encoding="utf-8") as f:
        f.write(md_content)
    
    print(f"Merged results saved to {merged_csv}, {merged_excel}, and {merged_md}")
    print(f"Found {len(merged_df)} unique companies with power-related mentions.")
    
    return merged_df

def main():
    """Main function to parse arguments and run crawlers in parallel"""
    parser = argparse.ArgumentParser(description="Run power company crawlers in parallel")
    parser.add_argument("--output", default="../Database/SalesLeads", help="Output directory for results")
    parser.add_argument("--max-pages", type=int, default=100, help="Maximum number of pages to crawl per site")
    parser.add_argument("--max-depth", type=int, default=3, help="Maximum depth of crawling from the root page")
    parser.add_argument("--workers", type=int, default=None, help="Number of parallel workers (default: number of cores)")
    parser.add_argument("--merge-only", action="store_true", help="Only merge existing results without crawling")
    args = parser.parse_args()
    
    # Make sure the output directory exists
    os.makedirs(args.output, exist_ok=True)
    
    if not args.merge_only:
        # Update the power_company_crawler.py script to accept command line arguments
        update_crawler_script()
        
        # Get the list of URLs to crawl from the crawler script
        urls = get_urls_from_crawler()
        
        # Determine the number of worker processes
        num_workers = args.workers or multiprocessing.cpu_count()
        num_workers = min(num_workers, len(urls))  # Don't use more workers than URLs
        
        print(f"Starting {len(urls)} crawlers with {num_workers} worker processes")
        
        # Create a pool of worker processes
        with multiprocessing.Pool(processes=num_workers) as pool:
            # Map the run_crawler function to each URL in parallel
            results = pool.starmap(
                run_crawler,
                [(url, args.output, args.max_pages, args.max_depth) for url in urls]
            )
        
        print(f"All crawlers completed. Processed {len(results)} URLs.")
    
    # Merge all results
    merged_df = merge_results(args.output)
    
    if merged_df is not None:
        # Print top 10 companies by power mentions
        print("\nTop 10 Companies by Power Mentions:")
        for i, (_, row) in enumerate(merged_df.head(10).iterrows(), 1):
            print(f"{i}. {row['Company Name']} ({row['Industry']}) - {row['Power Mentions']} mentions")

def update_crawler_script():
    """Update the power_company_crawler.py script to accept command line arguments"""
    with open("power_company_crawler.py", "r") as f:
        content = f.read()
    
    # Check if the script already has the argument parsing code
    if "ArgumentParser" not in content:
        # Add argument parsing code to the script
        argparse_code = """
import argparse

def parse_args():
    parser = argparse.ArgumentParser(description="Crawl news sites for power company mentions")
    parser.add_argument("--url", help="Single URL to crawl (overrides START_URLS)")
    parser.add_argument("--output", help="Output directory for results")
    parser.add_argument("--max-pages", type=int, default=100, help="Maximum number of pages to crawl per site")
    parser.add_argument("--max-depth", type=int, default=3, help="Maximum depth of crawling from the root page")
    parser.add_argument("--log-file", help="Log file name")
    return parser.parse_args()

def main():
    args = parse_args()
    
    # Configure logging to file if specified
    if args.log_file:
        file_handler = logging.FileHandler(args.log_file)
        file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
        logger.addHandler(file_handler)
    
    # Override configuration with command line arguments
    if args.output:
        global OUTPUT_DIR
        OUTPUT_DIR = args.output
    
    logger.info("Starting power company crawler...")
    
    start_time = time.time()
    all_companies = []
    
    # Crawl each site or just the specified URL
    urls_to_crawl = [args.url] if args.url else START_URLS
    
    for url in urls_to_crawl:
        site_companies = crawl_site(url, max_pages=args.max_pages, max_depth=args.max_depth)
        all_companies.extend(site_companies)
        
        # Add a longer delay between sites
        if len(urls_to_crawl) > 1:
            time.sleep(random.uniform(5, 10))
    
    # Remove duplicates (same company from different sources)
    unique_companies = []
    company_names = set()
    
    for company in all_companies:
        if company.name and company.name not in company_names:
            company_names.add(company.name)
            unique_companies.append(company)
    
    df = save_results(unique_companies)
    
    # Log completion
    elapsed_time = time.time() - start_time
    logger.info(f"Crawling completed in {elapsed_time:.2f} seconds.")
    logger.info(f"Found {len(unique_companies)} unique companies with power-related mentions.")
"""
        
        # Replace the old main function with the new one
        content = content.replace("def main():", "def old_main():")
        content += argparse_code
        
        # Save the updated script
        with open("power_company_crawler.py", "w") as f:
            f.write(content)
        
        print("Updated power_company_crawler.py to accept command line arguments")

def get_urls_from_crawler():
    """Extract the list of URLs from the crawler script"""
    with open("power_company_crawler.py", "r") as f:
        content = f.read()
    
    # Find the START_URLS list in the code
    import re
    match = re.search(r"START_URLS\s*=\s*\[(.*?)\]", content, re.DOTALL)
    if match:
        urls_str = match.group(1)
        # Extract each URL
        urls = re.findall(r'"([^"]+)"', urls_str)
        return urls
    else:
        # Default list if not found
        return [
            "https://businessday.ng/",
            "https://nairametrics.com/",
            "https://punchng.com/",
            "https://guardian.ng/",
            "https://thenationonlineng.net/",
            "https://thisdaylive.com/",
            "https://www.vanguardngr.com/",
            "https://www.premiumtimesng.com/",
        ]

if __name__ == "__main__":
    main() 