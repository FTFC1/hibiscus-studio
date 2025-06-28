import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

plt.style.use('default')
fig, ax = plt.subplots(figsize=(15, 6.5))
fig.patch.set_facecolor('white')
ax.set_xlim(0, 15)
ax.set_ylim(0, 6.5)
ax.axis('off')

accent = '#22223b'
light_grey = '#e5e5e5'

# --- Title ---
ax.text(7.5, 6.1, 'Nigerian Industrial Gas Sales Automation Framework', fontsize=18, fontweight='bold', ha='center', color=accent, family='DejaVu Sans')
ax.text(7.5, 5.7, '₦1tn Revenue Target   •   1000 Companies   •   400 Annual Contracts', fontsize=11, ha='center', color='grey', family='DejaVu Sans')

# --- KPIs (single horizontal strip, no lines) ---
kpi_y = 5.2
kpi_labels = [
    '₦1tn',
    '400',
    '₦4bn',
    '30%'
]
kpi_titles = ['Revenue', 'Contracts', 'Avg Deal', 'Penetration']
kpi_xs = [2, 5, 8, 11]
for x, label, title in zip(kpi_xs, kpi_labels, kpi_titles):
    ax.text(x, kpi_y, label, fontsize=13, fontweight='bold', ha='center', color=accent, family='DejaVu Sans')
    ax.text(x, kpi_y-0.25, title, fontsize=10, ha='center', color='grey', family='DejaVu Sans')

# --- Stages as nodes on a line, icons as pure shapes ---
stage_y = 4.0
stage_xs = [2, 5, 8, 11]
stage_titles = [
    'Discovery',
    'Champion Mapping',
    'Deep Research',
    'Campaign Prep'
]
stage_icons = [
    lambda x, y: ax.add_patch(patches.Circle((x, y), 0.18, facecolor=accent, fill=True, zorder=2)),
    lambda x, y: ax.add_patch(patches.RegularPolygon((x, y), 3, 0.18, facecolor=accent, orientation=np.pi/2, fill=True, zorder=2)),
    lambda x, y: ax.add_patch(patches.Rectangle((x-0.18, y-0.18), 0.36, 0.36, facecolor=accent, fill=True, zorder=2)),
    lambda x, y: ax.add_patch(patches.FancyBboxPatch((x-0.2, y-0.14), 0.4, 0.28, boxstyle='round,pad=0.05', facecolor=accent, fill=True, zorder=2))
]
stage_bullets = [
    ['1000 Companies', '₦500m+ Power Costs', 'Web Scraping, Data Cleaning', '85% Accuracy, 70% Coverage'],
    ['3-5 Contacts/Company', 'Middle Management', 'LinkedIn Automation', '80% Validity, 85% Accuracy'],
    ['8-Hour Research', 'Psychology & Persuasion', 'News Monitoring, AI Analysis', '8/10 Depth, 90% Complete'],
    ['20-50 Companies/Week', 'Personalised Outreach', 'Email Personalisation', '15% Meetings, 8% Deals']
]
# Draw connecting line
ax.plot(stage_xs, [stage_y]*4, color=light_grey, lw=2, zorder=1)
for i, (x, title, icon, bullets) in enumerate(zip(stage_xs, stage_titles, stage_icons, stage_bullets)):
    icon(x, stage_y)
    ax.text(x, stage_y+0.3, title, fontsize=12, fontweight='bold', ha='center', va='bottom', color=accent, family='DejaVu Sans')
    for j, bullet in enumerate(bullets):
        ax.text(x, stage_y-0.35*(j+1), bullet, fontsize=10, ha='center', va='top', color='black', family='DejaVu Sans')

# --- Continuous Learning (side annotation with dot) ---
cls_y = 2.0
ax.add_patch(patches.Circle((12.7, cls_y+0.1), 0.08, color=accent, fill=True, zorder=2))
ax.text(13, cls_y, 'Continuous Learning:', fontsize=11, fontweight='bold', ha='left', color=accent, family='DejaVu Sans')
ax.text(13, cls_y-0.3, 'Win/Loss Analysis • Weekly Reviews • Monthly Optimisation • 20% Annual Improvement',
        fontsize=10, ha='left', color=accent, family='DejaVu Sans')

# --- Market Context (foundation bar at bottom) ---
context_y = 0.7
ax.add_patch(patches.Rectangle((1, context_y-0.25), 12, 0.5, color=light_grey, zorder=0))
ax.text(7, context_y+0.15, 'Nigerian Market Context', fontsize=11, fontweight='bold', ha='center', color=accent, family='DejaVu Sans')
ax.text(7, context_y-0.05, 'Grid Reliability: 40-70%   •   Generator Dependency: 85%   •   Diesel: ₦180-250/kWh   •   Gas: ₦80-120/kWh\nRelationship-First   •   Trust: 5 Touchpoints   •   Bottom-up Influence   •   Hierarchy Respect   •   Challenges not Problems',
        fontsize=9, ha='center', color='black', family='DejaVu Sans')

plt.tight_layout()
plt.savefig('gas_sales_automation_framework_geom.png', dpi=300, bbox_inches='tight', facecolor='white')
plt.show()
print('✅ Geometric minimalism, Tufte x Geometric, data-ink maximised visual created: gas_sales_automation_framework_geom.png') 