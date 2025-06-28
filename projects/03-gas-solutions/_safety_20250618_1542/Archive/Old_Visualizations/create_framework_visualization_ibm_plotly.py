import plotly.graph_objects as go

fig = go.Figure()

# --- Title and Subtitle ---
fig.add_annotation(x=0.5, y=1.13, text='<b>Nigerian Industrial Gas Sales Automation Framework</b>', showarrow=False, xref='paper', yref='paper', font=dict(size=26, family='IBM Plex Sans', color='black'), align='center')
fig.add_annotation(x=0.5, y=1.08, text='₦1tn Revenue Target   •   1000 Companies   •   400 Annual Contracts', showarrow=False, xref='paper', yref='paper', font=dict(size=16, color='grey'), align='center')

# --- KPIs ---
kpi_labels = ['Revenue Target: ₦1tn', 'Annual Contracts: 400', 'Avg Deal: ₦4bn', 'Market Penetration: 30%']
kpi_xs = [0.13, 0.36, 0.63, 0.87]
for x, label in zip(kpi_xs, kpi_labels):
    fig.add_annotation(x=x, y=0.97, text=label, showarrow=False, xref='paper', yref='paper', font=dict(size=14, color='black', family='IBM Plex Sans'), align='center')

# --- Stages (grid, geometric icons as shapes) ---
stage_titles = ['1. Discovery', '2. Champion Mapping', '3. Deep Research', '4. Campaign Prep']
stage_xs = [0.13, 0.36, 0.63, 0.87]
stage_y = 0.82
icon_y = 0.87
icon_size = 0.04
stage_bullets = [
    ['1000 Companies', '₦500m+ Power Costs', 'Web Scraping, Data Cleaning', '85% Accuracy, 70% Coverage'],
    ['3-5 Contacts/Company', 'Middle Management', 'LinkedIn Automation', '80% Validity, 85% Accuracy'],
    ['8-Hour Research', 'Psychology & Persuasion', 'News Monitoring, AI Analysis', '8/10 Depth, 90% Complete'],
    ['20-50 Companies/Week', 'Personalised Outreach', 'Email Personalisation', '15% Meetings, 8% Deals']
]
icon_shapes = [
    dict(type='circle', xref='paper', yref='paper', x0=stage_xs[0]-icon_size, y0=icon_y-icon_size, x1=stage_xs[0]+icon_size, y1=icon_y+icon_size, fillcolor='#1a76d2', line_color='#1a76d2'),
    dict(type='path', path=f'M {stage_xs[1]},{icon_y+icon_size} L {stage_xs[1]-icon_size},{icon_y-icon_size} L {stage_xs[1]+icon_size},{icon_y-icon_size} Z', fillcolor='#1a76d2', line_color='#1a76d2'),
    dict(type='rect', xref='paper', yref='paper', x0=stage_xs[2]-icon_size, y0=icon_y-icon_size, x1=stage_xs[2]+icon_size, y1=icon_y+icon_size, fillcolor='#1a76d2', line_color='#1a76d2'),
    dict(type='rect', xref='paper', yref='paper', x0=stage_xs[3]-icon_size, y0=icon_y-icon_size*0.7, x1=stage_xs[3]+icon_size, y1=icon_y+icon_size*0.7, fillcolor='#1a76d2', line_color='#1a76d2', layer='above')
]
fig.update_layout(shapes=icon_shapes)
for i, (x, title, bullets) in enumerate(zip(stage_xs, stage_titles, stage_bullets)):
    fig.add_annotation(x=x, y=stage_y, text=f'<b>{title}</b>', showarrow=False, xref='paper', yref='paper', font=dict(size=16, color='black', family='IBM Plex Sans'), align='center')
    for j, bullet in enumerate(bullets):
        fig.add_annotation(x=x, y=stage_y-0.05*(j+1), text=f'• {bullet}', showarrow=False, xref='paper', yref='paper', font=dict(size=13, color='black', family='IBM Plex Sans'), align='left')

# --- Arrows between stages (as lines) ---
arrow_y = stage_y-0.13
arrow_shapes = []
for i in range(3):
    arrow_shapes.append(dict(type='line', xref='paper', yref='paper', x0=stage_xs[i]+0.07, y0=arrow_y, x1=stage_xs[i+1]-0.07, y1=arrow_y, line=dict(color='#1a76d2', width=4)))
fig.update_layout(shapes=fig.layout.shapes + tuple(arrow_shapes))

# --- Continuous Learning (side note) ---
fig.add_annotation(x=0.99, y=0.45, text='<b>Continuous Learning:</b><br>Win/Loss Analysis • Weekly Reviews • Monthly Optimisation • 20% Annual Improvement', showarrow=False, xref='paper', yref='paper', font=dict(size=13, color='#1a76d2', family='IBM Plex Sans'), align='right')

# --- Market Context (foundation) ---
fig.add_annotation(x=0.5, y=0.18, text='<b>Nigerian Market Context</b>', showarrow=False, xref='paper', yref='paper', font=dict(size=15, color='black', family='IBM Plex Sans'), align='center')
fig.add_annotation(x=0.5, y=0.13, text='Grid Reliability: 40-70%   •   Generator Dependency: 85%   •   Diesel: ₦180-250/kWh   •   Gas: ₦80-120/kWh<br>Relationship-First   •   Trust: 5 Touchpoints   •   Bottom-up Influence   •   Hierarchy Respect   •   Challenges not Problems', showarrow=False, xref='paper', yref='paper', font=dict(size=12, color='grey', family='IBM Plex Sans'), align='center')

fig.update_layout(
    width=1200, height=900,
    margin=dict(l=40, r=40, t=40, b=40),
    plot_bgcolor='white',
    xaxis=dict(visible=False),
    yaxis=dict(visible=False)
)

fig.write_image('gas_sales_automation_framework_ibm_plotly.png')
print('✅ IBM-style Plotly visual created: gas_sales_automation_framework_ibm_plotly.png') 