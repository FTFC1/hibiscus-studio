#!/usr/bin/env python3
"""
Professional Chart Generator - Financial Times Style
Creates high-quality visualizations for MID_MARKET_TARGETS.md
Styled in honour of Feyintola's analytical excellence
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
import seaborn as sns
import pandas as pd
import numpy as np
from datetime import datetime
import os

# Set up professional styling
plt.style.use('seaborn-v0_8-whitegrid')

# Feyintola's Professional Color Palette (inspired by Financial Times excellence)
FEYINTOLA_COLORS = {
    'primary': '#2E1D52',      # Deep purple - main data
    'secondary': '#CC8914',     # Rich orange - secondary data
    'accent': '#0F5499',       # Professional blue - highlights
    'light_grey': '#F2E9DC',   # Cream background
    'dark_grey': '#33302E',    # Professional text
    'success': '#2A9B47'       # Success green
}

# Professional typography and sizing - Clean & Readable
plt.rcParams.update({
    'font.family': 'DejaVu Sans',
    'font.size': 18,           # Much larger base font
    'axes.titlesize': 28,      # Massive titles
    'axes.labelsize': 22,      # Large axis labels
    'xtick.labelsize': 18,     # Large tick labels
    'ytick.labelsize': 18,     # Large tick labels
    'legend.fontsize': 20,     # Large legend
    'figure.titlesize': 32,    # Huge figure titles
    'axes.spines.top': False,
    'axes.spines.right': False,
    'axes.grid': True,
    'axes.axisbelow': True,
    'grid.alpha': 0.2,
    'grid.color': '#DDDDDD',
    'font.weight': 'normal',
    'axes.titleweight': 'bold',
    'axes.labelweight': 'bold'
})

# Create output directory
os.makedirs("../Database/Active_Lead_Lists/charts", exist_ok=True)

def create_company_power_costs_chart():
    """Create clean bar chart with strategic colour highlighting"""
    
    # Data from MID_MARKET_TARGETS.md
    tier1_companies = [
        ("Indorama Eleme", 2.1),
        ("Presco PLC", 2.0), 
        ("PZ Cussons", 1.8),
        ("Nigerian Breweries", 1.6),
        ("Okomu Oil", 1.5),
        ("Notore Chemical", 1.5)
    ]
    
    tier2_companies = [
        ("May & Baker", 1.4),
        ("Fidson Healthcare", 1.3),
        ("Louis Carter", 1.3),
        ("BUA Foods", 1.2),
        ("Vitafoam", 1.1),
        ("Promasidor", 1.0),
        ("Beta Glass", 1.0)
    ]
    
    # Combine and prepare data
    all_companies = tier1_companies + tier2_companies[:7]  # Top 13 for visibility
    names = [comp[0] for comp in all_companies]
    costs = [comp[1] for comp in all_companies]
    
    # Strategic colour coding - highlight top performers
    colors = []
    for i, cost in enumerate(costs):
        if cost >= 2.0:  # Top tier
            colors.append(FEYINTOLA_COLORS['primary'])  # Deep purple
        elif cost >= 1.5:  # High value
            colors.append(FEYINTOLA_COLORS['accent'])   # Professional blue
        else:  # Standard tier
            colors.append(FEYINTOLA_COLORS['secondary']) # Rich orange
    
    fig, ax = plt.subplots(figsize=(18, 12))
    
    # Create horizontal bar chart with enhanced visual hierarchy
    bars = ax.barh(range(len(names)), costs, color=colors, alpha=0.85, height=0.7)
    
    # Add subtle gradient effect to top 3
    for i in range(3):
        bars[i].set_edgecolor(FEYINTOLA_COLORS['primary'])
        bars[i].set_linewidth(3)
    
    # Customize chart
    ax.set_yticks(range(len(names)))
    ax.set_yticklabels(names)
    ax.set_xlabel('Annual Power Costs (₦ Billions)', fontweight='bold')
    ax.set_title('Mid-Market IPP Targets: Annual Power Costs', 
                 fontweight='bold', pad=40)
    
    # Enhanced value labels with colour coding
    for i, (bar, cost) in enumerate(zip(bars, costs)):
        # Highlight top 3 values
        if i < 3:
            ax.text(cost + 0.08, bar.get_y() + bar.get_height()/2, 
                    f'₦{cost:.1f}bn', va='center', fontweight='bold', fontsize=22,
                    color=FEYINTOLA_COLORS['primary'], 
                    bbox=dict(boxstyle="round,pad=0.2", facecolor='white', alpha=0.8))
        else:
            ax.text(cost + 0.08, bar.get_y() + bar.get_height()/2, 
                    f'₦{cost:.1f}bn', va='center', fontweight='bold', fontsize=20)
    
    # Strategic tier indicators with better colour use
    ax.text(2.6, 2, '₦2.0bn+\nPREMIUM TIER', 
            bbox=dict(boxstyle="round,pad=0.4", facecolor=FEYINTOLA_COLORS['primary'], alpha=0.2),
            ha='center', fontweight='bold', fontsize=16, color=FEYINTOLA_COLORS['primary'])
    
    ax.text(2.6, 5, '₦1.5-2.0bn\nHIGH VALUE', 
            bbox=dict(boxstyle="round,pad=0.4", facecolor=FEYINTOLA_COLORS['accent'], alpha=0.2),
            ha='center', fontweight='bold', fontsize=16, color=FEYINTOLA_COLORS['accent'])
    
    ax.text(2.6, 9, '₦1.0-1.4bn\nSTANDARD TIER', 
            bbox=dict(boxstyle="round,pad=0.4", facecolor=FEYINTOLA_COLORS['secondary'], alpha=0.2),
            ha='center', fontweight='bold', fontsize=16, color=FEYINTOLA_COLORS['secondary'])
    
    # Style improvements
    ax.spines['left'].set_visible(False)
    ax.set_xlim(0, 3.0)
    ax.grid(axis='x', alpha=0.2)
    
    # Add background colour zones for visual hierarchy
    ax.axhspan(-0.5, 2.5, alpha=0.05, color=FEYINTOLA_COLORS['primary'])  # Top tier zone
    
    plt.tight_layout()
    plt.savefig('../Database/Active_Lead_Lists/charts/company_power_costs.png', 
                dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()

def create_industry_breakdown_chart():
    """Create industry breakdown visualization"""
    
    industries = {
        'Manufacturing': {'count': 8, 'total_cost': 9.1, 'avg_mw': 1.3},
        'Food & Beverage': {'count': 6, 'total_cost': 6.8, 'avg_mw': 1.1}, 
        'Pharmaceuticals': {'count': 3, 'total_cost': 4.5, 'avg_mw': 1.4},
        'Petrochemicals': {'count': 2, 'total_cost': 3.6, 'avg_mw': 2.2},
        'Palm Oil': {'count': 2, 'total_cost': 3.5, 'avg_mw': 2.1},
        'Beverages': {'count': 4, 'total_cost': 3.1, 'avg_mw': 0.9}
    }
    
    names = list(industries.keys())
    costs = [industries[name]['total_cost'] for name in names]
    counts = [industries[name]['count'] for name in names]
    avg_mws = [industries[name]['avg_mw'] for name in names]
    
    # Chart 1: Market Opportunity by Industry
    fig, ax = plt.subplots(figsize=(16, 10))
    bars = ax.barh(names, costs, color=FEYINTOLA_COLORS['primary'], alpha=0.85)
    ax.set_xlabel('Total Annual Power Costs (₦ Billions)', fontweight='bold', fontsize=18)
    ax.set_title('Market Opportunity by Industry\nNigerian Industrial Power Market Analysis', 
                 fontweight='bold', pad=30, fontsize=22)
    
    for bar, cost in zip(bars, costs):
        ax.text(cost + 0.1, bar.get_y() + bar.get_height()/2, 
                f'₦{cost:.1f}bn', va='center', fontweight='bold', fontsize=16)
    
    # Add market insights
    ax.annotate('30% of total opportunity', 
                xy=(costs[0], 0), xytext=(costs[0] + 2, 1),
                arrowprops=dict(arrowstyle='->', color=FEYINTOLA_COLORS['accent'], lw=2),
                bbox=dict(boxstyle="round,pad=0.4", facecolor=FEYINTOLA_COLORS['accent'], alpha=0.1),
                fontsize=13, fontweight='bold')
    
    ax.spines['left'].set_visible(False)
    ax.grid(axis='x', alpha=0.3)
    ax.text(0.02, 0.02, 'Source: Feyintola Market Analysis | Generated: 2025-01-27', 
            transform=ax.transAxes, fontsize=10, alpha=0.7)
    
    plt.tight_layout()
    plt.savefig('../Database/Active_Lead_Lists/charts/industry_market_size.png', 
                dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    
    # Chart 2: Company Count by Industry  
    fig, ax = plt.subplots(figsize=(14, 10))
    bars = ax.bar(names, counts, color=FEYINTOLA_COLORS['secondary'], alpha=0.85)
    ax.set_ylabel('Number of Target Companies', fontweight='bold', fontsize=18)
    ax.set_title('Target Company Distribution\nIndustrial Sector Pipeline Analysis', 
                 fontweight='bold', pad=30, fontsize=22)
    ax.tick_params(axis='x', rotation=45)
    
    for i, count in enumerate(counts):
        ax.text(i, count + 0.15, str(count), ha='center', fontweight='bold', fontsize=16)
        
    # Add total companies annotation
    total_companies = sum(counts)
    ax.text(0.7, 0.95, f'Total Pipeline: {total_companies} Companies\nAverage per sector: {total_companies/len(counts):.1f}', 
            transform=ax.transAxes, fontsize=14, fontweight='bold',
            bbox=dict(boxstyle="round,pad=0.4", facecolor=FEYINTOLA_COLORS['secondary'], alpha=0.1))
    
    ax.grid(axis='y', alpha=0.3)
    ax.text(0.02, 0.02, 'Source: Feyintola Market Analysis | Generated: 2025-01-27', 
            transform=ax.transAxes, fontsize=10, alpha=0.7)
    
    plt.tight_layout()
    plt.savefig('../Database/Active_Lead_Lists/charts/industry_company_count.png', 
                dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    
    # Chart 3: Average Deal Size by Industry
    avg_deals = [costs[i]/counts[i] for i in range(len(names))]
    fig, ax = plt.subplots(figsize=(14, 10))
    bars = ax.bar(names, avg_deals, color=FEYINTOLA_COLORS['accent'], alpha=0.85)
    ax.set_ylabel('Average Deal Size (₦ Billions)', fontweight='bold', fontsize=18)
    ax.set_title('Average Deal Value by Industry\nRevenue per Company Analysis', 
                 fontweight='bold', pad=30, fontsize=22)
    ax.tick_params(axis='x', rotation=45)
    
    for i, deal in enumerate(avg_deals):
        ax.text(i, deal + 0.03, f'₦{deal:.2f}bn', ha='center', fontweight='bold', fontsize=16)
    
    # Highlight highest value sector
    max_deal_idx = avg_deals.index(max(avg_deals))
    ax.annotate(f'Highest value:\n₦{max(avg_deals):.2f}bn per company\n{names[max_deal_idx]} sector', 
                xy=(max_deal_idx, max(avg_deals)), xytext=(max_deal_idx + 1.5, max(avg_deals) + 0.2),
                arrowprops=dict(arrowstyle='->', color=FEYINTOLA_COLORS['accent'], lw=2),
                bbox=dict(boxstyle="round,pad=0.4", facecolor=FEYINTOLA_COLORS['accent'], alpha=0.1),
                fontsize=13, fontweight='bold')
    
    ax.grid(axis='y', alpha=0.3)
    ax.text(0.02, 0.02, 'Source: Feyintola Market Analysis | Generated: 2025-01-27', 
            transform=ax.transAxes, fontsize=10, alpha=0.7)
    
    plt.tight_layout()
    plt.savefig('../Database/Active_Lead_Lists/charts/industry_deal_size.png', 
                dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()

def create_deal_economics_chart():
    """Create visually enhanced deal economics charts"""
    
    # Chart 1: Enhanced Cost Breakdown with colour strategy
    fig, ax = plt.subplots(figsize=(16, 12))
    categories = ['Current\nPower Costs', 'IPP\nSolution', 'Annual\nSavings']
    values = [1200, 850, 350]  # Million Naira
    
    # Strategic colour coding to emphasize the savings opportunity
    colors = [FEYINTOLA_COLORS['dark_grey'], FEYINTOLA_COLORS['primary'], FEYINTOLA_COLORS['success']]
    
    bars = ax.bar(categories, values, color=colors, alpha=0.85, width=0.6)
    
    # Add gradient effect to the savings bar (most important)
    bars[2].set_edgecolor(FEYINTOLA_COLORS['success'])
    bars[2].set_linewidth(4)
    
    ax.set_ylabel('Annual Cost (₦ Millions)', fontweight='bold')
    ax.set_title('Deal Economics: Cost Structure Analysis', 
                 fontweight='bold', pad=40)
    
    # Enhanced value labels with emphasis on savings
    for i, (bar, value) in enumerate(zip(bars, values)):
        if i == 2:  # Highlight the savings
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 60, 
                    f'₦{value}M\nSAVINGS', ha='center', fontweight='bold', fontsize=26,
                    color=FEYINTOLA_COLORS['success'],
                    bbox=dict(boxstyle="round,pad=0.3", facecolor='white', alpha=0.9))
        else:
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 40, 
                    f'₦{value}M', ha='center', fontweight='bold', fontsize=24)
    
    # Add background highlight for savings area
    ax.axvspan(1.7, 2.3, alpha=0.1, color=FEYINTOLA_COLORS['success'])
    
    ax.grid(axis='y', alpha=0.2)
    ax.set_ylim(0, 1500)
    
    plt.tight_layout()
    plt.savefig('../Database/Active_Lead_Lists/charts/cost_breakdown.png', 
                dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    
    # Chart 2: Enhanced ROI Timeline with fill areas
    fig, ax = plt.subplots(figsize=(16, 12))
    years = range(1, 11)
    cumulative_savings = [year * 350 for year in years]  # 350M savings per year
    
    # Create line with fill area (like the successful chart they liked)
    ax.plot(years, cumulative_savings, color=FEYINTOLA_COLORS['primary'], 
             linewidth=6, label='Cumulative Savings', marker='o', markersize=12)
    ax.axhline(y=2500, color=FEYINTOLA_COLORS['accent'], linestyle='--', 
                linewidth=4, label='Initial Investment')
    
    # Add the successful fill_between technique
    ax.fill_between(years, 0, cumulative_savings, alpha=0.2, color=FEYINTOLA_COLORS['primary'])
    
    # Highlight break-even zone with colour
    breakeven_year = 2500 / 350  # ~7.1 years
    ax.axvspan(breakeven_year-0.3, breakeven_year+0.3, alpha=0.2, color=FEYINTOLA_COLORS['success'])
    
    ax.set_xlabel('Years', fontweight='bold')
    ax.set_ylabel('Value (₦ Millions)', fontweight='bold')
    ax.set_title('Investment Payback Timeline', 
                 fontweight='bold', pad=40)
    ax.legend(fontsize=20, loc='upper left')
    ax.grid(True, alpha=0.2)
    ax.set_ylim(0, 4000)
    
    plt.tight_layout()
    plt.savefig('../Database/Active_Lead_Lists/charts/roi_timeline.png', 
                dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    
    # Chart 3: Enhanced Commission Scenarios with strategic highlighting
    fig, ax = plt.subplots(figsize=(16, 12))
    deal_scenarios = ['Conservative\n(2 deals/year)', 'Target\n(4 deals/year)', 'Optimistic\n(6 deals/year)']
    annual_commissions = [500, 1000, 1500]  # Million Naira
    
    # Strategic colour coding - emphasize the target scenario
    colors = [FEYINTOLA_COLORS['accent'], FEYINTOLA_COLORS['primary'], FEYINTOLA_COLORS['secondary']]
    
    bars = ax.bar(deal_scenarios, annual_commissions, color=colors, alpha=0.85, width=0.6)
    
    # Highlight the target scenario (most realistic)
    bars[1].set_edgecolor(FEYINTOLA_COLORS['primary'])
    bars[1].set_linewidth(4)
    
    ax.set_ylabel('Annual Commission (₦ Millions)', fontweight='bold')
    ax.set_title('Revenue Scenarios', 
                 fontweight='bold', pad=40)
    
    # Enhanced labels with emphasis on target
    for i, (bar, value) in enumerate(zip(bars, annual_commissions)):
        if i == 1:  # Target scenario
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 80, 
                    f'₦{value}M\nTARGET', ha='center', fontweight='bold', fontsize=26,
                    color=FEYINTOLA_COLORS['primary'],
                    bbox=dict(boxstyle="round,pad=0.3", facecolor='white', alpha=0.9))
        else:
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 50, 
                    f'₦{value}M', ha='center', fontweight='bold', fontsize=24)
    
    # Add background highlight for target scenario
    ax.axvspan(0.7, 1.3, alpha=0.1, color=FEYINTOLA_COLORS['primary'])
    
    ax.grid(axis='y', alpha=0.2)
    ax.set_ylim(0, 1800)
    
    plt.tight_layout()
    plt.savefig('../Database/Active_Lead_Lists/charts/commission_scenarios.png', 
                dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()

def create_execution_dashboard():
    """Create clean execution tracking dashboard for May 2025"""
    
    # Chart 1: Simple Sales Funnel
    fig, ax = plt.subplots(figsize=(16, 12))
    stages = ['Target\nCompanies', 'Emails\nSent', 'Responses\nReceived', 
              'Qualified\nCalls', 'Proposals\nSent', 'Deals\nClosed']
    counts = [25, 20, 5, 3, 2, 1]
    
    colors = [FEYINTOLA_COLORS['primary']] * len(stages)
    bars = ax.barh(stages, counts, color=colors, alpha=0.8)
    
    ax.set_xlabel('Number of Prospects', fontweight='bold')
    ax.set_title('Sales Funnel: Pipeline Progress', 
                 fontweight='bold', pad=40)
    
    # Clean value labels
    for i, (bar, count) in enumerate(zip(bars, counts)):
        ax.text(count + 0.7, bar.get_y() + bar.get_height()/2, 
                str(count), va='center', fontweight='bold', fontsize=24)
    
    ax.spines['left'].set_visible(False)
    ax.grid(axis='x', alpha=0.2)
    ax.set_xlim(0, 30)
    
    plt.tight_layout()
    plt.savefig('../Database/Active_Lead_Lists/charts/sales_funnel.png', 
                dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    
    # Chart 2: Updated Monthly Timeline (Starting June 2025)
    fig, ax = plt.subplots(figsize=(16, 12))
    months = ['Jun\n2025', 'Jul\n2025', 'Aug\n2025', 'Sep\n2025', 'Oct\n2025', 'Nov\n2025']
    pipeline_value = [0, 2.5, 5.0, 7.5, 12.0, 15.0]  # Billion Naira
    closed_deals = [0, 0, 0, 2.5, 2.5, 5.0]
    
    line1 = ax.plot(months, pipeline_value, marker='o', linewidth=6, markersize=12,
                    color=FEYINTOLA_COLORS['primary'], label='Pipeline Value')
    line2 = ax.plot(months, closed_deals, marker='s', linewidth=6, markersize=12,
                    color=FEYINTOLA_COLORS['success'], label='Closed Deals')
    ax.fill_between(months, 0, pipeline_value, alpha=0.2, color=FEYINTOLA_COLORS['primary'])
    ax.fill_between(months, 0, closed_deals, alpha=0.3, color=FEYINTOLA_COLORS['success'])
    
    ax.set_ylabel('Deal Value (₦ Billions)', fontweight='bold')
    ax.set_xlabel('Timeline', fontweight='bold')
    ax.set_title('Deal Progression: June - December 2025', 
                 fontweight='bold', pad=40)
    ax.legend(fontsize=20, loc='upper left')
    ax.grid(True, alpha=0.2)
    ax.set_ylim(0, 18)
    
    plt.tight_layout()
    plt.savefig('../Database/Active_Lead_Lists/charts/deal_progression.png', 
                dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()
    
    # Chart 3: Clean Weekly Activity
    fig, ax = plt.subplots(figsize=(16, 12))
    weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    emails_sent = [8, 12, 15, 18]
    calls_booked = [1, 2, 3, 4]
    
    x = np.arange(len(weeks))
    width = 0.35
    
    bars1 = ax.bar(x - width/2, emails_sent, width, color=FEYINTOLA_COLORS['primary'], 
                   alpha=0.8, label='Emails Sent')
    bars2 = ax.bar(x + width/2, calls_booked, width, color=FEYINTOLA_COLORS['secondary'], 
                   alpha=0.8, label='Calls Booked')
    
    # Large value labels
    for bar in bars1:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                f'{int(height)}', ha='center', va='bottom', fontweight='bold', fontsize=20)
    
    for bar in bars2:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + 0.2,
                f'{int(height)}', ha='center', va='bottom', fontweight='bold', fontsize=20)
    
    ax.set_xlabel('Execution Timeline', fontweight='bold')
    ax.set_ylabel('Activity Count', fontweight='bold')
    ax.set_title('Weekly Activity Metrics', 
                 fontweight='bold', pad=40)
    ax.set_xticks(x)
    ax.set_xticklabels(weeks)
    ax.legend(fontsize=20)
    ax.grid(axis='y', alpha=0.2)
    ax.set_ylim(0, 22)
    
    plt.tight_layout()
    plt.savefig('../Database/Active_Lead_Lists/charts/weekly_activity.png', 
                dpi=300, bbox_inches='tight', facecolor='white')
    plt.close()

def main():
    """Generate all professional charts"""
    print("🎨 Generating Financial Times-style charts...")
    
    print("  📊 Creating company power costs chart...")
    create_company_power_costs_chart()
    
    print("  📈 Creating industry breakdown charts...")
    create_industry_breakdown_chart()
    
    print("  💰 Creating deal economics charts...")
    create_deal_economics_chart()
    
    print("  📋 Creating execution dashboard charts...")
    create_execution_dashboard()
    
    print("✅ All charts generated successfully!")
    print("📁 Charts saved to: Database/Active_Lead_Lists/charts/")
    print("🔗 Total: 9 individual professional charts")
    print("🎨 Consistent FT-style colour scheme: Purple, Orange, Blue")

if __name__ == "__main__":
    main() 