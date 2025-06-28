#!/usr/bin/env python3
"""
Setup script for the improved news scraper.
This will install the necessary dependencies and create required directories.
"""

import subprocess
import os
import sys

def check_pip():
    """Check if pip is installed."""
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', '--version'])
        return True
    except subprocess.CalledProcessError:
        return False

def install_dependencies():
    """Install the required Python packages."""
    required_packages = [
        'scrapy',
        'pandas',
        'openpyxl',
        'w3lib'
    ]
    
    print("Installing required packages...")
    for package in required_packages:
        try:
            print(f"Installing {package}...")
            subprocess.check_call([
                sys.executable, '-m', 'pip', 'install', package
            ])
            print(f"Successfully installed {package}")
        except subprocess.CalledProcessError as e:
            print(f"Error installing {package}: {e}")
            return False
    
    return True

def create_directories():
    """Create the necessary directories for the scraper."""
    directories = [
        '../Database/NewsData',
    ]
    
    print("Creating necessary directories...")
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"Created directory: {directory}")
        else:
            print(f"Directory already exists: {directory}")

def check_scrapy():
    """Check if Scrapy is properly installed."""
    try:
        import scrapy
        from scrapy.crawler import CrawlerProcess
        print("Scrapy is properly installed!")
        return True
    except ImportError as e:
        print(f"Error importing Scrapy: {e}")
        print("Please try installing it manually with: pip install scrapy")
        return False

def main():
    print("Setting up the improved news scraper...")
    
    # Check if pip is installed
    if not check_pip():
        print("Error: pip is not installed or not working properly.")
        print("Please install pip and try again.")
        return
    
    # Install dependencies
    if not install_dependencies():
        print("Error installing dependencies. Some features may not work.")
    
    # Create directories
    create_directories()
    
    # Check if Scrapy is properly installed
    check_scrapy()
    
    print("\nSetup completed!")
    print("You can now run the news scraper with:")
    print("python news_scraper_improved.py --sources all --limit 10")

if __name__ == "__main__":
    main() 
"""
Setup script for the improved news scraper.
This will install the necessary dependencies and create required directories.
"""

import subprocess
import os
import sys

def check_pip():
    """Check if pip is installed."""
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', '--version'])
        return True
    except subprocess.CalledProcessError:
        return False

def install_dependencies():
    """Install the required Python packages."""
    required_packages = [
        'scrapy',
        'pandas',
        'openpyxl',
        'w3lib'
    ]
    
    print("Installing required packages...")
    for package in required_packages:
        try:
            print(f"Installing {package}...")
            subprocess.check_call([
                sys.executable, '-m', 'pip', 'install', package
            ])
            print(f"Successfully installed {package}")
        except subprocess.CalledProcessError as e:
            print(f"Error installing {package}: {e}")
            return False
    
    return True

def create_directories():
    """Create the necessary directories for the scraper."""
    directories = [
        '../Database/NewsData',
    ]
    
    print("Creating necessary directories...")
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"Created directory: {directory}")
        else:
            print(f"Directory already exists: {directory}")

def check_scrapy():
    """Check if Scrapy is properly installed."""
    try:
        import scrapy
        from scrapy.crawler import CrawlerProcess
        print("Scrapy is properly installed!")
        return True
    except ImportError as e:
        print(f"Error importing Scrapy: {e}")
        print("Please try installing it manually with: pip install scrapy")
        return False

def main():
    print("Setting up the improved news scraper...")
    
    # Check if pip is installed
    if not check_pip():
        print("Error: pip is not installed or not working properly.")
        print("Please install pip and try again.")
        return
    
    # Install dependencies
    if not install_dependencies():
        print("Error installing dependencies. Some features may not work.")
    
    # Create directories
    create_directories()
    
    # Check if Scrapy is properly installed
    check_scrapy()
    
    print("\nSetup completed!")
    print("You can now run the news scraper with:")
    print("python news_scraper_improved.py --sources all --limit 10")

if __name__ == "__main__":
    main() 