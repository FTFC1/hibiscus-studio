import plotly.graph_objects as go

fig = go.Figure()

# --- Minimal Title (Tufte style - no decoration) ---
fig.add_annotation(x=0.5, y=1.12, text='Nigerian Industrial Gas Sales Automation Framework', showarrow=False, xref='paper', yref='paper', font=dict(size=20, family='Arial', color='black'), align='center')
fig.add_annotation(x=0.5, y=1.07, text='₦1tn Revenue Target • 1000 Companies • 400 Annual Contracts', showarrow=False, xref='paper', yref='paper', font=dict(size=12, color='black'), align='center')

# --- Clean KPI boxes with proper shading ---
kpi_boxes = [
    dict(type='rect', xref='paper', yref='paper', x0=0.1, y0=0.98, x1=0.35, y1=1.02, fillcolor='#f7f7f7', line=dict(color='black', width=1)),
    dict(type='rect', xref='paper', yref='paper', x0=0.38, y0=0.98, x1=0.62, y1=1.02, fillcolor='#f7f7f7', line=dict(color='black', width=1)),
    dict(type='rect', xref='paper', yref='paper', x0=0.65, y0=0.98, x1=0.88, y1=1.02, fillcolor='#f7f7f7', line=dict(color='black', width=1))
]
fig.update_layout(shapes=kpi_boxes)

fig.add_annotation(x=0.225, y=1.0, text='Revenue Target: ₦1tn', showarrow=False, xref='paper', yref='paper', font=dict(size=11, color='black'), align='center')
fig.add_annotation(x=0.5, y=1.0, text='Annual Contracts: 400', showarrow=False, xref='paper', yref='paper', font=dict(size=11, color='black'), align='center')
fig.add_annotation(x=0.765, y=1.0, text='Avg Deal: ₦4bn', showarrow=False, xref='paper', yref='paper', font=dict(size=11, color='black'), align='center')

# --- Process stages with proper icons ---
stages = [
    ('1. Discovery', 0.2, 0.85, ['1000 Companies', '₦500m+ Power Costs', 'Web Scraping, Data Cleaning', '85% Accuracy, 70% Coverage']),
    ('2. Champion Mapping', 0.4, 0.85, ['3-5 Contacts/Company', 'Middle Management', 'LinkedIn Automation', '80% Validity, 85% Accuracy']),
    ('3. Deep Research', 0.6, 0.85, ['8-Hour Research', 'Psychology & Persuasion', 'News Monitoring, AI Analysis', '8/10 Depth, 90% Complete']),
    ('4. Campaign Prep', 0.8, 0.85, ['20-50 Companies/Week', 'Personalised Outreach', 'Email Personalisation', '15% Meetings, 8% Deals'])
]

# Simple numbered circles instead of geometric shapes
stage_numbers = [
    dict(type='circle', xref='paper', yref='paper', x0=0.188, y0=0.888, x1=0.212, y1=0.912, fillcolor='black', line=dict(color='black', width=1)),
    dict(type='circle', xref='paper', yref='paper', x0=0.388, y0=0.888, x1=0.412, y1=0.912, fillcolor='black', line=dict(color='black', width=1)),
    dict(type='circle', xref='paper', yref='paper', x0=0.588, y0=0.888, x1=0.612, y1=0.912, fillcolor='black', line=dict(color='black', width=1)),
    dict(type='circle', xref='paper', yref='paper', x0=0.788, y0=0.888, x1=0.812, y1=0.912, fillcolor='black', line=dict(color='black', width=1))
]
fig.update_layout(shapes=fig.layout.shapes + tuple(stage_numbers))

# White numbers in circles
fig.add_annotation(x=0.2, y=0.9, text='1', showarrow=False, xref='paper', yref='paper', font=dict(size=12, color='white', family='Arial'), align='center')
fig.add_annotation(x=0.4, y=0.9, text='2', showarrow=False, xref='paper', yref='paper', font=dict(size=12, color='white', family='Arial'), align='center')
fig.add_annotation(x=0.6, y=0.9, text='3', showarrow=False, xref='paper', yref='paper', font=dict(size=12, color='white', family='Arial'), align='center')
fig.add_annotation(x=0.8, y=0.9, text='4', showarrow=False, xref='paper', yref='paper', font=dict(size=12, color='white', family='Arial'), align='center')

# Stage content (clean typography)
for title, x, y, bullets in stages:
    fig.add_annotation(x=x, y=y, text=title, showarrow=False, xref='paper', yref='paper', font=dict(size=14, color='black', family='Arial'), align='center')
    for i, bullet in enumerate(bullets):
        fig.add_annotation(x=x, y=y-0.05*(i+1), text=f'• {bullet}', showarrow=False, xref='paper', yref='paper', font=dict(size=10, color='black', family='Arial'), align='center')

# --- Simple black arrows (no blue) ---
arrow_shapes = [
    dict(type='line', xref='paper', yref='paper', x0=0.26, y0=0.75, x1=0.34, y1=0.75, line=dict(color='black', width=2)),
    dict(type='line', xref='paper', yref='paper', x0=0.46, y0=0.75, x1=0.54, y1=0.75, line=dict(color='black', width=2)),
    dict(type='line', xref='paper', yref='paper', x0=0.66, y0=0.75, x1=0.74, y1=0.75, line=dict(color='black', width=2))
]

# Simple arrow heads
arrow_heads = [
    dict(type='path', path='M 0.34,0.75 L 0.335,0.755 L 0.335,0.745 Z', fillcolor='black', line=dict(color='black', width=1)),
    dict(type='path', path='M 0.54,0.75 L 0.535,0.755 L 0.535,0.745 Z', fillcolor='black', line=dict(color='black', width=1)),
    dict(type='path', path='M 0.74,0.75 L 0.735,0.755 L 0.735,0.745 Z', fillcolor='black', line=dict(color='black', width=1))
]

fig.update_layout(shapes=fig.layout.shapes + tuple(arrow_shapes) + tuple(arrow_heads))

# --- Continuous Learning with full background ---
learning_bg = dict(type='rect', xref='paper', yref='paper', x0=0.1, y0=0.52, x1=0.9, y1=0.58, fillcolor='#f9f9f9', line=dict(color='black', width=1))
fig.update_layout(shapes=fig.layout.shapes + tuple([learning_bg]))

fig.add_annotation(x=0.5, y=0.55, text='Continuous Learning: Win/Loss Analysis • Weekly Reviews • Monthly Optimisation • 20% Annual Improvement', showarrow=False, xref='paper', yref='paper', font=dict(size=11, color='black', family='Arial'), align='center')

# --- Market Context with full background ---
market_bg = dict(type='rect', xref='paper', yref='paper', x0=0.1, y0=0.22, x1=0.9, y1=0.45, fillcolor='#f7f7f7', line=dict(color='black', width=1))
fig.update_layout(shapes=fig.layout.shapes + tuple([market_bg]))

fig.add_annotation(x=0.5, y=0.42, text='Nigerian Market Context', showarrow=False, xref='paper', yref='paper', font=dict(size=14, color='black', family='Arial'), align='center')

# Create clean data layout
context_data = [
    ('Grid Reliability: 40-70%', 'Generator Dependency: 85%', 'Diesel: ₦180-250/kWh', 'Gas: ₦80-120/kWh'),
    ('Relationship-First', 'Trust: 5 Touchpoints', 'Bottom-up Influence', 'Hierarchy Respect'),
    ('Challenges not Problems', '', '', '')
]

table_y_start = 0.38
for i, row in enumerate(context_data):
    y_pos = table_y_start - i*0.05
    for j, item in enumerate(row):
        if item:  # Only show non-empty items
            x_pos = 0.2 + j*0.15
            fig.add_annotation(x=x_pos, y=y_pos, text=item, showarrow=False, xref='paper', yref='paper', font=dict(size=10, color='black', family='Arial'), align='left')

fig.update_layout(
    width=1200, height=900,
    margin=dict(l=40, r=40, t=40, b=40),
    plot_bgcolor='white',
    xaxis=dict(visible=False),
    yaxis=dict(visible=False)
)

fig.write_image('gas_sales_automation_framework_tufte_plotly.png')
print('✅ Fixed Tufte-style Plotly visual created: gas_sales_automation_framework_tufte_plotly.png') 