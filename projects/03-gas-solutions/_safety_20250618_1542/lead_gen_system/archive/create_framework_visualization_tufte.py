import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

plt.style.use('default')
fig, ax = plt.subplots(figsize=(16, 8))  # 1. Slightly larger canvas for better proportions
fig.patch.set_facecolor('white')
ax.set_xlim(0, 16)  # 2. Adjusted limits for new proportions
ax.set_ylim(0, 8)
ax.axis('off')

# Tufte-style: Only the lightest lines, no boxes, no chartjunk
# Use black/grey text, single accent for emphasis
accent = '#1a76d2'
primary_color = '#2563eb' # Bold blue for most important elements (main process)
light_grey = '#f0f0f0' # Even lighter KPI separators
very_light = '#fbfbfb' # Almost invisible background bands
text_dark = '#222222' # Slightly softer than pure black for better readability

# --- Ultra-light background bands ---
# KPIs band
ax.add_patch(patches.Rectangle((0.8, 6.0), 14.4, 0.6, color=very_light, zorder=0))
# Stages band - increased height to cover all content properly
ax.add_patch(patches.Rectangle((0.8, 2.8), 14.4, 3.0, color=very_light, zorder=0))
# Market Context band - REMOVED to improve text readability
# ax.add_patch(patches.Rectangle((0.8, 0.5), 14.4, 1.8, color=very_light, zorder=0))

# Title with better hierarchy
ax.text(8.0, 7.4, 'Nigerian Industrial Gas Sales Automation Framework', fontsize=22, fontweight=900, ha='center', color=text_dark, family='Arial')
ax.text(8.0, 6.95, '₦1tn Revenue Target • 1000 Companies • 400 Annual Contracts', fontsize=11, ha='center', color='#777777', family='Arial')

# KPIs with improved visual separation
kpi_y = 6.3
kpi_labels = [
    'Revenue Target: ₦1tn',
    'Annual Contracts: 400',
    'Avg Deal: ₦4bn',
    'Market Penetration: 30%'
]
kpi_xs = [1.8, 5.5, 9.5, 13.0]
for i, (x, label) in enumerate(zip(kpi_xs, kpi_labels)):
    # Subtle background for each KPI
    ax.add_patch(patches.Rectangle((x-0.3, kpi_y-0.15), 3.2, 0.35, color='#f8f8f8', alpha=0.7, zorder=1))
    ax.text(x, kpi_y, label, fontsize=11, ha='left', color='#2a2a2a', fontweight=600, family='Arial')
# Refined vertical lines as separators
for x in [4.8, 8.8, 12.3]:
    ax.plot([x, x], [kpi_y-0.2, kpi_y+0.3], color=light_grey, lw=0.3, alpha=0.6)

# Stage headers and bullets with enhanced typography
stage_y = 5.2
stage_xs = [1.8, 5.5, 9.5, 13.0]
stage_titles = [
    '1. Discovery',      # Fixed unicode issues
    '2. Champion Mapping',
    '3. Deep Research',
    '4. Campaign Prep'
]
stage_bullets = [
    ['1000 Companies', '₦500m+ Power Costs', 'Web Scraping, Data Cleaning', '85% Accuracy, 70% Coverage'],
    ['3-5 Contacts/Company', 'Middle Management', 'LinkedIn Automation', '80% Validity, 85% Accuracy'],
    ['8-Hour Research', 'Psychology & Persuasion', 'News Monitoring, AI Analysis', '8/10 Depth, 90% Complete'],
    ['20-50 Companies/Week', 'Personalised Outreach', 'Email Personalisation', '15% Meetings, 8% Deals']
]

for i, (x, title, bullets) in enumerate(zip(stage_xs, stage_titles, stage_bullets)):
    # COLORED stage titles for primary visual emphasis
    ax.text(x, stage_y, title, fontsize=13, fontweight=900, ha='left', va='top', color=primary_color, family='Arial')
    for j, bullet in enumerate(bullets):
        # Improved bullet point styling and spacing
        ax.text(x+0.15, stage_y-0.45*(j+1), f'• {bullet}', fontsize=10.5, ha='left', va='top', color='#444444', family='Arial')

# Enhanced arrows between stages - COLORED for primary emphasis
arrow_props = dict(arrowstyle='->,head_length=0.5,head_width=0.25', lw=1.2, color=primary_color, shrinkA=0, shrinkB=0)
for i in range(3):
    ax.annotate('', xy=(stage_xs[i+1]-0.4, stage_y-0.9), xytext=(stage_xs[i]+2.8, stage_y-0.9), arrowprops=arrow_props)

# Refined feedback arrow from step 4 back to step 1 - COLORED for primary emphasis
feedback_color = primary_color
feedback_lw = 1.2
feedback_alpha = 0.9

# Clean elbow positioning
step4_x = 15.2
step1_x = 1.4
elbow_y = 2.9

# Feedback arrow with enhanced styling
ax.plot([step4_x, step4_x], [4.6, elbow_y], color=feedback_color, lw=feedback_lw, alpha=feedback_alpha)
ax.plot([step4_x, step1_x], [elbow_y, elbow_y], color=feedback_color, lw=feedback_lw, alpha=feedback_alpha)
ax.annotate('', xy=(step1_x, 4.6), xytext=(step1_x, elbow_y),
           arrowprops=dict(arrowstyle='->,head_length=0.5,head_width=0.25', lw=feedback_lw, color=feedback_color, alpha=feedback_alpha))

# Enhanced Continuous Learning section
cls_y = 2.3  # Positioned properly between stages and market context
ax.text(8.0, cls_y, 'Continuous Learning: Win/Loss Analysis • Weekly Reviews • Monthly Optimisation • 20% Annual Improvement',
        fontsize=11, ha='center', color='#333333', fontweight=600, family='Arial')

# Enhanced Market Context section - PROPER SPACING
context_y = 1.2  # Much lower to avoid overlap
ax.text(8.0, context_y+0.6, 'Nigerian Market Context', fontsize=14, fontweight=800, ha='center', color=text_dark, family='Arial')

# Better formatted market context with proper spacing
context_line1 = 'Grid Reliability: 40-70% • Generator Dependency: 85% • Diesel: ₦180-250/kWh • Gas: ₦80-120/kWh'
context_line2 = 'Relationship-First • Trust: 5 Touchpoints • Bottom-up Influence • Hierarchy Respect • Challenges not Problems'
ax.text(8.0, context_y+0.2, context_line1, fontsize=11, ha='center', color='#333333', fontweight=500, family='Arial')
ax.text(8.0, context_y-0.2, context_line2, fontsize=11, ha='center', color='#333333', fontweight=500, family='Arial')

plt.tight_layout()
plt.savefig('gas_sales_automation_framework_tufte.png', dpi=350, bbox_inches='tight', facecolor='white', edgecolor='none')
plt.show()
print('✅ Tufte-style framework: Fixed unicode, added color hierarchy, expanded market context: gas_sales_automation_framework_tufte.png') 