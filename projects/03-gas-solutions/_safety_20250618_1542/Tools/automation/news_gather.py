#!/usr/bin/env python3
"""
News Gathering Selector
This script helps users choose between the two available methods for gathering
Nigerian energy news: NewsAPI or the Improved Scraper.
"""

import os
import sys
import subprocess
import argparse

def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

def show_header():
    """Show the header for the script."""
    print("=" * 80)
    print("NIGERIAN ENERGY NEWS GATHERING TOOL".center(80))
    print("=" * 80)
    print("\nThis tool helps you gather news about energy companies in Nigeria.")
    print("You have two options for gathering news:\n")

def show_options():
    """Show the available options."""
    print("1. NewsAPI Method (Requires API Key)")
    print("   - Easy to use")
    print("   - Reliable and consistent")
    print("   - Limited to 100 requests/day on free tier")
    print("   - Only accesses news from the last month\n")
    
    print("2. Improved Scraper Method (No API Key)")
    print("   - No API key required")
    print("   - No daily limits")
    print("   - Can access historical articles")
    print("   - Requires more dependencies")
    print("   - May occasionally encounter 403 errors\n")
    
    print("3. Set Up Dependencies")
    print("   - Install requirements for both methods\n")
    
    print("4. View Documentation")
    print("   - Read the news gathering guide\n")
    
    print("5. Exit\n")

def run_newsapi():
    """Run the NewsAPI-based scraper."""
    clear_screen()
    print("NEWSAPI METHOD".center(80))
    print("=" * 80)
    
    # Check if API key is already set in the script
    with open("newsapi_nigeria.py", "r") as f:
        content = f.read()
        if "YOUR_API_KEY_HERE" in content:
            api_key = input("Enter your NewsAPI key (get one at https://newsapi.org/register): ")
            
            if not api_key:
                print("No API key provided. Exiting.")
                return
                
            # Update the script with the API key
            content = content.replace("YOUR_API_KEY_HERE", api_key)
            with open("newsapi_nigeria.py", "w") as f:
                f.write(content)
                print("API key has been saved in the script.")
    
    # Ask for parameters
    print("\nConfigure your news search:")
    query = input("Enter search query [default: energy Nigeria]: ") or "energy Nigeria"
    days = input("Number of days to search back (max 30 for free tier) [default: 30]: ") or "30"
    
    # Confirm
    print(f"\nReady to search for: '{query}' over the past {days} days")
    confirm = input("Proceed? (y/n): ")
    
    if confirm.lower() != 'y':
        return
    
    # Run the script
    print("\nRunning NewsAPI search...")
    try:
        subprocess.run([
            sys.executable, 
            "newsapi_nigeria.py", 
            "--query", query, 
            "--days", days, 
            "--analyze", 
            "--export"
        ], check=True)
        
        print("\nNews data has been gathered and analyzed!")
        print("Check the Database/NewsData/ directory for results.")
        
    except subprocess.CalledProcessError as e:
        print(f"Error running NewsAPI script: {e}")
    
    input("\nPress Enter to continue...")

def run_improved_scraper():
    """Run the improved scraper using Scrapy."""
    clear_screen()
    print("IMPROVED SCRAPER METHOD".center(80))
    print("=" * 80)
    
    # Check if Scrapy is installed
    try:
        import scrapy
    except ImportError:
        print("Scrapy is not installed. Let's set it up first.")
        setup = input("Install dependencies now? (y/n): ")
        if setup.lower() == 'y':
            run_setup()
        else:
            return
    
    # Ask for parameters
    print("\nConfigure your news scraping:")
    sources = input("Enter news sources to scrape (comma-separated) or 'all' [default: all]: ") or "all"
    limit = input("Maximum articles per source [default: 10]: ") or "10"
    
    # Confirm
    if sources.lower() == 'all':
        print("\nReady to scrape ALL configured Nigerian news sources")
    else:
        print(f"\nReady to scrape: {sources}")
    
    print(f"Will fetch up to {limit} articles per source")
    confirm = input("Proceed? (y/n): ")
    
    if confirm.lower() != 'y':
        return
    
    # Run the script
    print("\nRunning improved scraper...")
    try:
        subprocess.run([
            sys.executable, 
            "news_scraper_improved.py", 
            "--sources", sources, 
            "--limit", limit
        ], check=True)
        
        print("\nNews data has been gathered and analyzed!")
        print("Check the Database/NewsData/ directory for results.")
        
    except subprocess.CalledProcessError as e:
        print(f"Error running improved scraper: {e}")
    
    input("\nPress Enter to continue...")

def run_setup():
    """Run the setup script for dependencies."""
    clear_screen()
    print("SETUP DEPENDENCIES".center(80))
    print("=" * 80)
    
    print("This will install the required dependencies for both scraping methods.")
    confirm = input("Proceed? (y/n): ")
    
    if confirm.lower() != 'y':
        return
    
    # Run the setup script
    print("\nRunning setup...")
    try:
        subprocess.run([sys.executable, "setup_scrapy.py"], check=True)
        print("Setup completed!")
    except subprocess.CalledProcessError as e:
        print(f"Error during setup: {e}")
    
    input("\nPress Enter to continue...")

def view_documentation():
    """View the news gathering documentation."""
    clear_screen()
    print("NEWS GATHERING DOCUMENTATION".center(80))
    print("=" * 80)
    
    doc_path = "../Database/TestResults/news_scraping_guide.md"
    
    if os.path.exists(doc_path):
        with open(doc_path, "r") as f:
            content = f.read()
            print(content)
    else:
        print(f"Documentation file not found at: {doc_path}")
    
    input("\nPress Enter to continue...")

def main():
    """Main function to run the selector."""
    parser = argparse.ArgumentParser(description="News Gathering Selector")
    parser.add_argument('--newsapi', action='store_true', help='Run NewsAPI method directly')
    parser.add_argument('--scraper', action='store_true', help='Run improved scraper directly')
    parser.add_argument('--setup', action='store_true', help='Run setup directly')
    args = parser.parse_args()
    
    # Check for direct commands
    if args.newsapi:
        run_newsapi()
        return
    elif args.scraper:
        run_improved_scraper()
        return
    elif args.setup:
        run_setup()
        return
    
    # Interactive menu
    while True:
        clear_screen()
        show_header()
        show_options()
        
        choice = input("Enter your choice (1-5): ")
        
        if choice == '1':
            run_newsapi()
        elif choice == '2':
            run_improved_scraper()
        elif choice == '3':
            run_setup()
        elif choice == '4':
            view_documentation()
        elif choice == '5':
            print("Exiting. Goodbye!")
            break
        else:
            print("Invalid choice. Please try again.")
            input("Press Enter to continue...")

if __name__ == "__main__":
    main() 
"""
News Gathering Selector
This script helps users choose between the two available methods for gathering
Nigerian energy news: NewsAPI or the Improved Scraper.
"""

import os
import sys
import subprocess
import argparse

def clear_screen():
    """Clear the terminal screen."""
    os.system('cls' if os.name == 'nt' else 'clear')

def show_header():
    """Show the header for the script."""
    print("=" * 80)
    print("NIGERIAN ENERGY NEWS GATHERING TOOL".center(80))
    print("=" * 80)
    print("\nThis tool helps you gather news about energy companies in Nigeria.")
    print("You have two options for gathering news:\n")

def show_options():
    """Show the available options."""
    print("1. NewsAPI Method (Requires API Key)")
    print("   - Easy to use")
    print("   - Reliable and consistent")
    print("   - Limited to 100 requests/day on free tier")
    print("   - Only accesses news from the last month\n")
    
    print("2. Improved Scraper Method (No API Key)")
    print("   - No API key required")
    print("   - No daily limits")
    print("   - Can access historical articles")
    print("   - Requires more dependencies")
    print("   - May occasionally encounter 403 errors\n")
    
    print("3. Set Up Dependencies")
    print("   - Install requirements for both methods\n")
    
    print("4. View Documentation")
    print("   - Read the news gathering guide\n")
    
    print("5. Exit\n")

def run_newsapi():
    """Run the NewsAPI-based scraper."""
    clear_screen()
    print("NEWSAPI METHOD".center(80))
    print("=" * 80)
    
    # Check if API key is already set in the script
    with open("newsapi_nigeria.py", "r") as f:
        content = f.read()
        if "YOUR_API_KEY_HERE" in content:
            api_key = input("Enter your NewsAPI key (get one at https://newsapi.org/register): ")
            
            if not api_key:
                print("No API key provided. Exiting.")
                return
                
            # Update the script with the API key
            content = content.replace("YOUR_API_KEY_HERE", api_key)
            with open("newsapi_nigeria.py", "w") as f:
                f.write(content)
                print("API key has been saved in the script.")
    
    # Ask for parameters
    print("\nConfigure your news search:")
    query = input("Enter search query [default: energy Nigeria]: ") or "energy Nigeria"
    days = input("Number of days to search back (max 30 for free tier) [default: 30]: ") or "30"
    
    # Confirm
    print(f"\nReady to search for: '{query}' over the past {days} days")
    confirm = input("Proceed? (y/n): ")
    
    if confirm.lower() != 'y':
        return
    
    # Run the script
    print("\nRunning NewsAPI search...")
    try:
        subprocess.run([
            sys.executable, 
            "newsapi_nigeria.py", 
            "--query", query, 
            "--days", days, 
            "--analyze", 
            "--export"
        ], check=True)
        
        print("\nNews data has been gathered and analyzed!")
        print("Check the Database/NewsData/ directory for results.")
        
    except subprocess.CalledProcessError as e:
        print(f"Error running NewsAPI script: {e}")
    
    input("\nPress Enter to continue...")

def run_improved_scraper():
    """Run the improved scraper using Scrapy."""
    clear_screen()
    print("IMPROVED SCRAPER METHOD".center(80))
    print("=" * 80)
    
    # Check if Scrapy is installed
    try:
        import scrapy
    except ImportError:
        print("Scrapy is not installed. Let's set it up first.")
        setup = input("Install dependencies now? (y/n): ")
        if setup.lower() == 'y':
            run_setup()
        else:
            return
    
    # Ask for parameters
    print("\nConfigure your news scraping:")
    sources = input("Enter news sources to scrape (comma-separated) or 'all' [default: all]: ") or "all"
    limit = input("Maximum articles per source [default: 10]: ") or "10"
    
    # Confirm
    if sources.lower() == 'all':
        print("\nReady to scrape ALL configured Nigerian news sources")
    else:
        print(f"\nReady to scrape: {sources}")
    
    print(f"Will fetch up to {limit} articles per source")
    confirm = input("Proceed? (y/n): ")
    
    if confirm.lower() != 'y':
        return
    
    # Run the script
    print("\nRunning improved scraper...")
    try:
        subprocess.run([
            sys.executable, 
            "news_scraper_improved.py", 
            "--sources", sources, 
            "--limit", limit
        ], check=True)
        
        print("\nNews data has been gathered and analyzed!")
        print("Check the Database/NewsData/ directory for results.")
        
    except subprocess.CalledProcessError as e:
        print(f"Error running improved scraper: {e}")
    
    input("\nPress Enter to continue...")

def run_setup():
    """Run the setup script for dependencies."""
    clear_screen()
    print("SETUP DEPENDENCIES".center(80))
    print("=" * 80)
    
    print("This will install the required dependencies for both scraping methods.")
    confirm = input("Proceed? (y/n): ")
    
    if confirm.lower() != 'y':
        return
    
    # Run the setup script
    print("\nRunning setup...")
    try:
        subprocess.run([sys.executable, "setup_scrapy.py"], check=True)
        print("Setup completed!")
    except subprocess.CalledProcessError as e:
        print(f"Error during setup: {e}")
    
    input("\nPress Enter to continue...")

def view_documentation():
    """View the news gathering documentation."""
    clear_screen()
    print("NEWS GATHERING DOCUMENTATION".center(80))
    print("=" * 80)
    
    doc_path = "../Database/TestResults/news_scraping_guide.md"
    
    if os.path.exists(doc_path):
        with open(doc_path, "r") as f:
            content = f.read()
            print(content)
    else:
        print(f"Documentation file not found at: {doc_path}")
    
    input("\nPress Enter to continue...")

def main():
    """Main function to run the selector."""
    parser = argparse.ArgumentParser(description="News Gathering Selector")
    parser.add_argument('--newsapi', action='store_true', help='Run NewsAPI method directly')
    parser.add_argument('--scraper', action='store_true', help='Run improved scraper directly')
    parser.add_argument('--setup', action='store_true', help='Run setup directly')
    args = parser.parse_args()
    
    # Check for direct commands
    if args.newsapi:
        run_newsapi()
        return
    elif args.scraper:
        run_improved_scraper()
        return
    elif args.setup:
        run_setup()
        return
    
    # Interactive menu
    while True:
        clear_screen()
        show_header()
        show_options()
        
        choice = input("Enter your choice (1-5): ")
        
        if choice == '1':
            run_newsapi()
        elif choice == '2':
            run_improved_scraper()
        elif choice == '3':
            run_setup()
        elif choice == '4':
            view_documentation()
        elif choice == '5':
            print("Exiting. Goodbye!")
            break
        else:
            print("Invalid choice. Please try again.")
            input("Press Enter to continue...")

if __name__ == "__main__":
    main() 