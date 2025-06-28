#!/usr/bin/env python3
"""
Visualizes the workflow of the web_scraping_discovery_system.py script
using Matplotlib with Tufte-style principles.
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('workflow_visualization.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def create_workflow_diagram():
    plt.style.use('default')
    fig, ax = plt.subplots(figsize=(18, 10))  # Wider to fit 4 stages
    fig.patch.set_facecolor('white')
    ax.set_xlim(0, 18)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # Colors & Fonts
    primary_color = '#2563eb'  # Blue for main flow
    secondary_color = '#4b5563' # Dark grey for text
    accent_color = '#10b981'   # Green for outputs
    champion_color = '#f59e0b'  # Orange for champion mapping
    font_family = 'Arial'
    
    # Title
    ax.text(9, 9.5, 'Discovery Stage: Target List → Deep Research → Champion Mapping → Enriched Profiles',
            fontsize=18, fontweight='bold', ha='center', color=secondary_color, family=font_family)
    ax.text(9, 9.1, '1000 Companies • ₦500M+ Power Costs • 85% Accuracy • 3-5 Contacts Each',
            fontsize=11, ha='center', color='#6b7280', family=font_family)

    # Helper for clean boxes
    def draw_clean_box(x, y, w, h, title, bullets, color=primary_color):
        ax.add_patch(patches.Rectangle((x, y), w, h, facecolor='white', edgecolor=color, linewidth=2))
        ax.text(x + w/2, y + h - 0.2, title, fontsize=11, fontweight='bold', ha='center', color=color, family=font_family)
        for i, bullet in enumerate(bullets):
            ax.text(x + 0.1, y + h - 0.5 - (i * 0.22), bullet, fontsize=8.5, ha='left', color=secondary_color, family=font_family)

    # Helper for arrows
    def draw_clean_arrow(start_x, end_x, y, label=""):
        ax.annotate('', xy=(end_x, y), xytext=(start_x, y), 
                   arrowprops=dict(arrowstyle='->', lw=2, color=primary_color))
        if label:
            ax.text((start_x + end_x)/2, y + 0.15, label, fontsize=9, ha='center', color=primary_color, family=font_family)

    # --- MAIN FLOW (4 STAGES) ---
    
    # 1. Target List
    target_bullets = [
        "• Known Nigerian companies",
        "• Manufacturing, banking, telecoms",
        "• Employee count > 100",
        "• Revenue > ₦2B annually"
    ]
    draw_clean_box(1, 6, 3.5, 2.2, "1. Target List", target_bullets)
    
    # 2. Deep Research
    research_bullets = [
        "• Multi-source data collection",
        "• Power cost estimation", 
        "• Industry classification",
        "• Business intelligence gathering"
    ]
    draw_clean_box(5.5, 6, 3.5, 2.2, "2. Deep Research", research_bullets)
    
    # 3. Champion Mapping
    champion_bullets = [
        "• LinkedIn contact extraction",
        "• 3-5 decision makers per company",
        "• Middle management focus",
        "• Hierarchy mapping"
    ]
    draw_clean_box(10, 6, 3.5, 2.2, "3. Champion Mapping", champion_bullets, color=champion_color)
    
    # 4. Enriched Profiles
    profile_bullets = [
        "• CompanyProfile + ContactList",
        "• Priority scoring (0-100)",
        "• Export: JSON, CSV, MD",
        "• Ready for Campaign Prep"
    ]
    draw_clean_box(14.5, 6, 3, 2.2, "4. Enriched Profiles", profile_bullets, color=accent_color)

    # Arrows between main flow
    draw_clean_arrow(4.5, 5.5, 7, "")
    draw_clean_arrow(9, 10, 7, "")
    draw_clean_arrow(13.5, 14.5, 7, "")

    # --- EXPANDED DATA SOURCES ---
    ax.text(2, 5.3, "Data Sources (5+ Required)", fontsize=11, fontweight='bold', color=secondary_color, family=font_family)
    sources = [
        "• Nigerian news: BusinessDay, Guardian, Premium Times",
        "• Company registries: CAC, NSE filings", 
        "• Industry associations: MAN, NACCIMA",
        "• Professional networks: LinkedIn, company websites",
        "• Business databases: Dun & Bradstreet, Kompass"
    ]
    for i, source in enumerate(sources):
        ax.text(2, 4.9 - (i * 0.2), source, fontsize=8.5, color='#6b7280', family=font_family)

    # --- INDUSTRY CLASSIFICATION ISSUE ---
    ax.text(9, 5.3, "🚨 Current Issue: Industry Classification", fontsize=11, fontweight='bold', color='#dc2626', family=font_family)
    ax.text(9, 4.9, "85.9% companies = 'Unknown' industry", fontsize=10, ha='center', color='#dc2626', family=font_family)
    ax.text(9, 4.6, "Need: Enhanced regex patterns + external APIs", fontsize=9, ha='center', color='#6b7280', family=font_family)

    # --- CHAMPION MAPPING DETAILS ---
    ax.text(12, 5.3, "Champion Contact Types", fontsize=11, fontweight='bold', color=champion_color, family=font_family)
    contacts = [
        "• Operations Manager",
        "• Facilities Director", 
        "• CFO/Finance Director",
        "• Engineering Manager"
    ]
    for i, contact in enumerate(contacts):
        ax.text(12, 4.9 - (i * 0.2), contact, fontsize=8.5, color='#6b7280', family=font_family)

    # --- CURRENT OUTPUTS & GAPS ---
    ax.text(9, 3.5, "Current Results vs Target", fontsize=12, fontweight='bold', ha='center', color=accent_color, family=font_family)
    results_table = [
        "Current: 64 companies | Target: 1000 companies",
        "Current: ₦34.7B market | Target: ₦1tn revenue opportunity", 
        "Current: 85.9% unknown industry | Target: 95% classified",
        "Current: 0 contacts mapped | Target: 3-5 contacts per company"
    ]
    for i, result in enumerate(results_table):
        ax.text(9, 3.1 - (i * 0.25), result, fontsize=9, ha='center', color='#6b7280', family=font_family)

    # --- NEXT STEPS ---
    ax.text(9, 1.5, "Priority Fixes", fontsize=11, fontweight='bold', ha='center', color='#dc2626', family=font_family)
    ax.text(9, 1.1, "1. Add 5+ data sources  2. Fix industry classification  3. Build LinkedIn scraper", 
            fontsize=10, ha='center', color='#6b7280', family=font_family)

    plt.tight_layout()
    plt.savefig('web_scraper_workflow_tufte.png', dpi=300, facecolor='white', bbox_inches='tight')
    logger.info("✅ Enhanced workflow with Champion Mapping & data source gaps: web_scraper_workflow_tufte.png")

if __name__ == '__main__':
    create_workflow_diagram() 