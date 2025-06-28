#!/usr/bin/env python3
"""
Setup script for testing the Mikano IPP Lead Generation system
"""

import os
import subprocess
import shutil
import sys

def check_prerequisites():
    """Check for required tools and libraries"""
    print("Checking prerequisites...")
    
    # Check Python version
    python_version = sys.version_info
    print(f"Python version: {python_version.major}.{python_version.minor}.{python_version.micro}")
    if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 8):
        print("ERROR: Python 3.8 or higher is required.")
        return False
    
    # Check if we can create virtual environments
    try:
        import venv
        print("✅ Virtual environment module available")
    except ImportError:
        print("ERROR: Python venv module not available. Please install it first.")
        return False
    
    return True

def create_directory_structure():
    """Create the necessary directory structure"""
    print("\nCreating directory structure...")
    
    # Create base directories if they don't exist
    directories = [
        "../Database",
        "../Database/TestResults",
        "../Documents",
        "../Templates",
        "../Shared"
    ]
    
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"✅ Created {directory}")
        else:
            print(f"✅ {directory} already exists")
    
    return True

def create_virtual_environment():
    """Create a Python virtual environment"""
    print("\nSetting up virtual environment...")
    
    venv_path = "venv"
    if os.path.exists(venv_path):
        print(f"Virtual environment already exists at {venv_path}")
        update = input("Do you want to update it? (y/n): ")
        if update.lower() != 'y':
            return True
        else:
            # Remove existing venv
            shutil.rmtree(venv_path)
            print("Removed existing virtual environment.")
    
    # Create new venv
    try:
        import venv
        venv.create(venv_path, with_pip=True)
        print(f"✅ Created virtual environment at {venv_path}")
        
        # Determine activation command to show to user
        if os.name == 'nt':  # Windows
            activate_cmd = f"{venv_path}\\Scripts\\activate"
        else:  # Unix/Linux/Mac
            activate_cmd = f"source {venv_path}/bin/activate"
        
        print(f"To activate the virtual environment, run:\n{activate_cmd}")
        return True
    except Exception as e:
        print(f"ERROR creating virtual environment: {str(e)}")
        return False

def install_requirements():
    """Install required Python packages"""
    print("\nInstalling required packages...")
    
    # Define requirements
    requirements = [
        "pandas",
        "numpy",
        "openpyxl",
        "requests",
        "beautifulsoup4"
    ]
    
    # Write requirements to file
    with open("requirements.txt", "w") as f:
        for req in requirements:
            f.write(f"{req}\n")
    
    print("Created requirements.txt")
    print("To install packages, activate the virtual environment and run:")
    print("pip install -r requirements.txt")
    
    return True

def create_sample_data():
    """Create sample data for testing if not present"""
    print("\nChecking for sample data...")
    
    sample_file = "../Database/TestResults/test_companies.xlsx"
    if not os.path.exists(sample_file):
        print(f"Sample data not found at {sample_file}")
        print("After installing requirements, please run:")
        print("python inspect_file.py")
        print("This will create sample test companies.")
    else:
        print(f"✅ Sample data already exists at {sample_file}")
    
    return True

def main():
    """Main setup function"""
    print("=== Mikano IPP Lead Generation System Setup ===\n")
    
    if not check_prerequisites():
        print("\nSetup failed: prerequisites not met.")
        return
    
    steps = [
        create_directory_structure,
        create_virtual_environment,
        install_requirements,
        create_sample_data
    ]
    
    for step in steps:
        if not step():
            print(f"\nSetup failed at step: {step.__name__}")
            return
    
    print("\n=== Setup Complete ===")
    print("\nTo test the system:")
    print("1. Activate the virtual environment")
    print("2. Install requirements: pip install -r requirements.txt")
    print("3. Run the enrichment script: python simple_enrich.py")
    print("4. Run the company discovery script: python find_similar_companies.py")
    print("\nTest results will be saved in ../Database/TestResults/")

if __name__ == "__main__":
    main() 