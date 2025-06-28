import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, ConnectionPatch
import numpy as np

# Set up the figure for a more compact, Bento Box style layout
plt.style.use('default')
fig, ax = plt.subplots(1, 1, figsize=(20, 22)) # More height for bento stacking
fig.patch.set_facecolor('white')
ax.set_xlim(0, 20)
ax.set_ylim(0, 22) # Increased Y limit
ax.axis('off')

# Timeless, professional color palette - suitable for modern/bento
colors = {
    'primary': '#2c3e50',      # Classic dark grey-blue
    'secondary': '#34495e',    # Medium grey-blue
    'accent': '#7f8c8d',       # Light grey for stage 3
    'highlight': '#3498db',    # Clean blue for learning system outline
    'success': '#27ae60',      # Professional green for stage 4
    'background': '#ecf0f1',   # Very light grey for KPI/Context boxes
    'text': '#2c3e50',         # Dark grey for readability
    'light_text': '#566573',   # Slightly darker light_text for subtitles
    'white': '#ffffff'
}

# Title with proper hierarchy
ax.text(10, 21, 'Nigerian Industrial Gas Sales Automation Framework', 
        fontsize=26, fontweight='bold', ha='center', color=colors['primary'])
ax.text(10, 20.2, '£1bn Revenue Target  •  1000 Companies  •  400 Annual Contracts', 
        fontsize=15, ha='center', color=colors['light_text'])

# Key Performance Indicators - Top Bento Box
kpi_box_y = 18.5
kpi_box_h = 1.3
kpi_box = FancyBboxPatch((1, kpi_box_y), 18, kpi_box_h, 
                        boxstyle='round,pad=0.1', 
                        facecolor=colors['background'], 
                        edgecolor=colors['accent'],
                        linewidth=1)
ax.add_patch(kpi_box)
ax.text(10, kpi_box_y + kpi_box_h - 0.35, 'KEY PERFORMANCE INDICATORS', 
        fontsize=13, fontweight='bold', ha='center', color=colors['primary'])
texts_kpi = [
    ('Revenue Target\n£1bn', 3.5),
    ('Annual Contracts\n400', 7.5),
    ('Average Deal\n£3.5M', 11.5),
    ('Market Penetration\n30%', 15.5),
    # ('Sales Cycle\n6 months', 16.5) # Removed to avoid crowding in bento
]
for text, x_pos in texts_kpi:
    ax.text(x_pos, kpi_box_y + 0.3, text, fontsize=10, ha='center', va='center', color=colors['text'], fontweight='normal', linespacing=1.4)


# Bento Grid for Stages (2x2)
stage_w = 8.5
stage_h = 4.5 # Slightly reduced height for bento
cell_padding = 0.5 # Space between cells

# Top Row of Stages
top_row_y = 13.2
s1_x = 1
s2_x = s1_x + stage_w + cell_padding

# Stage 1: Company Discovery
stage1_box = FancyBboxPatch((s1_x, top_row_y), stage_w, stage_h, boxstyle='round,pad=0.15', facecolor=colors['primary'], edgecolor=colors['primary'])
ax.add_patch(stage1_box)
ax.text(s1_x + stage_w/2, top_row_y + stage_h - 0.5, 'STAGE 1: Discovery', fontsize=13, fontweight='bold', ha='center', color=colors['white'])
ax.text(s1_x + stage_w/2, top_row_y + 2.7, 'TARGET: 1000 Companies\n£500k+ Power Costs', fontsize=9.5, ha='center', color=colors['white'], linespacing=1.3)
ax.text(s1_x + stage_w/2, top_row_y + 1.5, 'TECH: Web Scraping, Data Cleaning', fontsize=9, ha='center', color=colors['white'])
ax.text(s1_x + stage_w/2, top_row_y + 0.7, 'METRICS: 85% Accuracy, 70% Coverage', fontsize=9, ha='center', color=colors['background'])

# Stage 2: Power Champion Mapping
stage2_box = FancyBboxPatch((s2_x, top_row_y), stage_w, stage_h, boxstyle='round,pad=0.15', facecolor=colors['secondary'], edgecolor=colors['secondary'])
ax.add_patch(stage2_box)
ax.text(s2_x + stage_w/2, top_row_y + stage_h - 0.5, 'STAGE 2: Champion Mapping', fontsize=13, fontweight='bold', ha='center', color=colors['white'])
ax.text(s2_x + stage_w/2, top_row_y + 2.7, 'TARGET: 3-5 Contacts/Company\nMiddle Management Focus', fontsize=9.5, ha='center', color=colors['white'], linespacing=1.3)
ax.text(s2_x + stage_w/2, top_row_y + 1.5, 'TECH: LinkedIn Automation', fontsize=9, ha='center', color=colors['white'])
ax.text(s2_x + stage_w/2, top_row_y + 0.7, 'METRICS: 80% Validity, 85% Accuracy', fontsize=9, ha='center', color=colors['background'])

# Continuous Learning System - Bento Box between stage rows
learning_y = 11.0
learning_h = 1.5
learning_box = FancyBboxPatch((1, learning_y), 18, learning_h, 
                             boxstyle='round,pad=0.1', facecolor='white', 
                             edgecolor=colors['highlight'], linewidth=1.5, linestyle='--')
ax.add_patch(learning_box)
ax.text(10, learning_y + learning_h - 0.4, 'Continuous Learning System', fontsize=13, fontweight='bold', ha='center', color=colors['primary'])
ax.text(10, learning_y + learning_h - 0.9, 'Win/Loss Analysis • Weekly Reviews • Monthly Optimization • 20% Annual Improvement', fontsize=9.5, ha='center', color=colors['text'])

# Bottom Row of Stages
bottom_row_y = 5.7

# Stage 3: Deep Research & Profiling
stage3_box = FancyBboxPatch((s1_x, bottom_row_y), stage_w, stage_h, boxstyle='round,pad=0.15', facecolor=colors['accent'], edgecolor=colors['accent'])
ax.add_patch(stage3_box)
ax.text(s1_x + stage_w/2, bottom_row_y + stage_h - 0.5, 'STAGE 3: Deep Research', fontsize=13, fontweight='bold', ha='center', color=colors['white'])
ax.text(s1_x + stage_w/2, bottom_row_y + 2.7, 'PROCESS: 8-Hour Research\nPsychology & Persuasion', fontsize=9.5, ha='center', color=colors['white'], linespacing=1.3)
ax.text(s1_x + stage_w/2, bottom_row_y + 1.5, 'TECH: News Monitoring, AI Analysis', fontsize=9, ha='center', color=colors['white'])
ax.text(s1_x + stage_w/2, bottom_row_y + 0.7, 'METRICS: 8/10 Depth, 90% Complete', fontsize=9, ha='center', color=colors['background'])

# Stage 4: Campaign Preparation
stage4_box = FancyBboxPatch((s2_x, bottom_row_y), stage_w, stage_h, boxstyle='round,pad=0.15', facecolor=colors['success'], edgecolor=colors['success'])
ax.add_patch(stage4_box)
ax.text(s2_x + stage_w/2, bottom_row_y + stage_h - 0.5, 'STAGE 4: Campaign Prep', fontsize=13, fontweight='bold', ha='center', color=colors['white'])
ax.text(s2_x + stage_w/2, bottom_row_y + 2.7, 'OUTPUT: 20-50 Companies/Week\nPersonalized Outreach', fontsize=9.5, ha='center', color=colors['white'], linespacing=1.3)
ax.text(s2_x + stage_w/2, bottom_row_y + 1.5, 'TECH: Email Personalization', fontsize=9, ha='center', color=colors['white'])
ax.text(s2_x + stage_w/2, bottom_row_y + 0.7, 'METRICS: 15% Meetings, 8% Deals', fontsize=9, ha='center', color=colors['background'])

# Flow Arrows for Stages
arrow_props = dict(arrowstyle='->', lw=2, color=colors['primary'], shrinkA=5, shrinkB=5)
# S1 -> S2
ax.annotate('', xy=(s2_x - 0.1, top_row_y + stage_h/2), xytext=(s1_x + stage_w + 0.1, top_row_y + stage_h/2), arrowprops=arrow_props)
# S3 -> S4
ax.annotate('', xy=(s2_x - 0.1, bottom_row_y + stage_h/2), xytext=(s1_x + stage_w + 0.1, bottom_row_y + stage_h/2), arrowprops=arrow_props)

# S2 -> S3 (Vertical connector for Bento)
# Midpoint for the vertical connector from S2 bottom to S3 top
connector_x_s2 = s2_x + stage_w / 2
connector_x_s3 = s1_x + stage_w / 2

# Arrow from S2 bottom, to below CLS, then to S3 top
ax.plot([connector_x_s2, connector_x_s2], [top_row_y, learning_y + learning_h + 0.3], color=colors['primary'], lw=2) # Down from S2
ax.plot([connector_x_s2, connector_x_s3], [learning_y + learning_h + 0.3, learning_y + learning_h + 0.3], color=colors['primary'], lw=2) # Across below S2
ax.plot([connector_x_s3, connector_x_s3], [learning_y + learning_h + 0.3, bottom_row_y + stage_h], color=colors['primary'], lw=2) # Down to S3
ax.annotate('', xy=(connector_x_s3, bottom_row_y + stage_h -0.1), xytext=(connector_x_s3, bottom_row_y + stage_h+0.1), arrowprops=dict(arrowstyle='->', lw=2, color=colors['primary']))

# Feedback Arrows from Continuous Learning
feedback_arrow_props = dict(arrowstyle='<-', lw=1.5, color=colors['highlight'], linestyle='--', shrinkA=5, shrinkB=5)
# CLS to S1 (top-left)
ax.annotate('', xy=(s1_x + stage_w/2, top_row_y + stage_h), xytext=(s1_x + stage_w/2, learning_y + learning_h + 0.1), arrowprops=feedback_arrow_props)
# CLS to S2 (top-right)
ax.annotate('', xy=(s2_x + stage_w/2, top_row_y + stage_h), xytext=(s2_x + stage_w/2, learning_y + learning_h + 0.1), arrowprops=feedback_arrow_props)
# CLS to S3 (bottom-left)
ax.annotate('', xy=(s1_x + stage_w/2, bottom_row_y - 0.1), xytext=(s1_x + stage_w/2, learning_y -0.1), arrowprops=feedback_arrow_props)
# CLS to S4 (bottom-right)
ax.annotate('', xy=(s2_x + stage_w/2, bottom_row_y - 0.1), xytext=(s2_x + stage_w/2, learning_y - 0.1), arrowprops=feedback_arrow_props)

# Nigerian Market Context Foundation - Bottom Bento Box
foundation_y = 0.5
foundation_h = 4.5 # More height for readable text columns
foundation_box = FancyBboxPatch((1, foundation_y), 18, foundation_h, 
                           boxstyle='round,pad=0.15', 
                           facecolor=colors['background'], 
                           edgecolor=colors['primary'], 
                           linewidth=1.5)
ax.add_patch(foundation_box)
ax.text(10, foundation_y + foundation_h - 0.5, 'Nigerian Market Context Foundation', 
        fontsize=14, fontweight='bold', ha='center', color=colors['primary'])

# Text columns for foundation context
col_width = 18/3
col1_x = 1 + col_width/2
col2_x = 1 + col_width + col_width/2
col3_x = 1 + 2*col_width + col_width/2
text_y_start_foundation = foundation_y + foundation_h - 1.5
line_spacing_foundation = 0.35

ax.text(col1_x, text_y_start_foundation, 'POWER INFRASTRUCTURE', fontsize=10, fontweight='bold', ha='center', color=colors['primary'])
ax.text(col1_x, text_y_start_foundation - line_spacing_foundation*2, 'Grid Reliability: 40-70%\nGenerator Dependency: 85%\nDiesel Cost: ₦180-250/kWh\nGas Opportunity: ₦80-120/kWh', fontsize=9.5, ha='center', color=colors['text'], linespacing=1.3)

ax.text(col2_x, text_y_start_foundation, 'CULTURAL DYNAMICS', fontsize=10, fontweight='bold', ha='center', color=colors['primary'])
ax.text(col2_x, text_y_start_foundation - line_spacing_foundation*2, 'Relationship-First Approach\nTrust Building: 5 Touchpoints\nDecision Flow: Bottom-up Influence\nHierarchy Respect Mandatory', fontsize=9.5, ha='center', color=colors['text'], linespacing=1.3)

ax.text(col3_x, text_y_start_foundation, 'COMMUNICATION STYLE', fontsize=10, fontweight='bold', ha='center', color=colors['primary'])
ax.text(col3_x, text_y_start_foundation - line_spacing_foundation*2, 'Language: Challenges not Problems\nFocus: Technical Credibility\nPositioning: Infrastructure Partnership', fontsize=9.5, ha='center', color=colors['text'], linespacing=1.3)

plt.tight_layout(pad=0.5) # Add some padding
plt.savefig('gas_sales_automation_framework_bento.png', dpi=300, bbox_inches='tight', 
            facecolor='white', edgecolor='none')
plt.show()
print('✅ Modern Bento Box visualization created: gas_sales_automation_framework_bento.png') 