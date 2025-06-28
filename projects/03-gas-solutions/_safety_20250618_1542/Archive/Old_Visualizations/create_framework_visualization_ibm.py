import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

plt.style.use('default')
fig, ax = plt.subplots(figsize=(15, 7))
fig.patch.set_facecolor('white')
ax.set_xlim(0, 15)
ax.set_ylim(0, 7)
ax.axis('off')

accent = '#1a76d2'
light_grey = '#e5e5e5'

# --- Title ---
ax.text(7.5, 6.7, 'Nigerian Industrial Gas Sales Automation Framework', fontsize=20, fontweight='bold', ha='center', color='black', family='DejaVu Sans')
ax.text(7.5, 6.3, '₦1tn Revenue Target   •   1000 Companies   •   400 Annual Contracts', fontsize=12, ha='center', color='grey', family='DejaVu Sans')

# --- KPIs (single line, subtle separator) ---
kpi_y = 5.8
kpi_labels = [
    'Revenue Target: ₦1tn',
    'Annual Contracts: 400',
    'Avg Deal: ₦4bn',
    'Market Penetration: 30%'
]
kpi_xs = [1.5, 5, 9, 12.5]
for x, label in zip(kpi_xs, kpi_labels):
    ax.text(x, kpi_y, label, fontsize=11, ha='left', color='black', family='DejaVu Sans')
for x in [4.2, 8.2, 12]:
    ax.plot([x, x], [kpi_y-0.15, kpi_y+0.25], color=light_grey, lw=1)
ax.plot([1, 14], [kpi_y-0.3, kpi_y-0.3], color=light_grey, lw=1)

# --- Stages (grid, geometric icons) ---
stage_y = 4.7
stage_xs = [1.5, 5, 8.5, 12]
stage_titles = [
    '1. Discovery',
    '2. Champion Mapping',
    '3. Deep Research',
    '4. Campaign Prep'
]
stage_icons = [
    lambda x, y: ax.add_patch(patches.Circle((x-0.5, y-0.1), 0.18, facecolor=accent, fill=True, zorder=2)), # circle
    lambda x, y: ax.add_patch(patches.RegularPolygon((x-0.5, y-0.1), 3, 0.18, facecolor=accent, orientation=np.pi/2, fill=True, zorder=2)), # triangle
    lambda x, y: ax.add_patch(patches.Rectangle((x-0.68, y-0.28), 0.36, 0.36, facecolor=accent, fill=True, zorder=2)), # square
    lambda x, y: ax.add_patch(patches.FancyBboxPatch((x-0.7, y-0.22), 0.4, 0.28, boxstyle='round,pad=0.05', facecolor=accent, fill=True, zorder=2)) # envelope
]
stage_bullets = [
    ['1000 Companies', '₦500m+ Power Costs', 'Web Scraping, Data Cleaning', '85% Accuracy, 70% Coverage'],
    ['3-5 Contacts/Company', 'Middle Management', 'LinkedIn Automation', '80% Validity, 85% Accuracy'],
    ['8-Hour Research', 'Psychology & Persuasion', 'News Monitoring, AI Analysis', '8/10 Depth, 90% Complete'],
    ['20-50 Companies/Week', 'Personalised Outreach', 'Email Personalisation', '15% Meetings, 8% Deals']
]
for i, (x, title, icon, bullets) in enumerate(zip(stage_xs, stage_titles, stage_icons, stage_bullets)):
    icon(x, stage_y)
    ax.text(x, stage_y, title, fontsize=13, fontweight='bold', ha='left', va='top', color='black', family='DejaVu Sans')
    for j, bullet in enumerate(bullets):
        ax.text(x+0.1, stage_y-0.35*(j+1), '\u2022 ' + bullet, fontsize=11, ha='left', va='top', color='black', family='DejaVu Sans')

# --- Thin arrows between stages ---
arrow_props = dict(arrowstyle='->', lw=1, color=accent, shrinkA=0, shrinkB=0)
for i in range(3):
    ax.annotate('', xy=(stage_xs[i+1]-0.3, stage_y-0.7), xytext=(stage_xs[i]+2.2, stage_y-0.7), arrowprops=arrow_props)

# --- Continuous Learning (side note, not a line) ---
cls_y = 2.2
ax.text(13.5, cls_y, 'Continuous Learning:', fontsize=11, fontweight='bold', ha='right', color=accent, family='DejaVu Sans')
ax.text(13.5, cls_y-0.3, 'Win/Loss Analysis • Weekly Reviews • Monthly Optimisation • 20% Annual Improvement',
        fontsize=10, ha='right', color=accent, family='DejaVu Sans')

# --- Market Context (foundation, no box) ---
context_y = 1.0
ax.text(7.5, context_y+0.4, 'Nigerian Market Context', fontsize=12, fontweight='bold', ha='center', color='black', family='DejaVu Sans')
ax.text(7.5, context_y, 'Grid Reliability: 40-70%   •   Generator Dependency: 85%   •   Diesel: ₦180-250/kWh   •   Gas: ₦80-120/kWh\nRelationship-First   •   Trust: 5 Touchpoints   •   Bottom-up Influence   •   Hierarchy Respect   •   Challenges not Problems',
        fontsize=10, ha='center', color='grey', family='DejaVu Sans')

plt.tight_layout()
plt.savefig('gas_sales_automation_framework_ibm.png', dpi=300, bbox_inches='tight', facecolor='white')
plt.show()
print('✅ IBM-style, Tufte x IBM, data-ink maximised visual created: gas_sales_automation_framework_ibm.png') 