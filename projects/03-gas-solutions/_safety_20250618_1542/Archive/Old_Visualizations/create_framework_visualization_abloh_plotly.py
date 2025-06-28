import plotly.graph_objects as go

fig = go.Figure()

# --- Abloh-style Title with quotation marks ---
fig.add_annotation(x=0.15, y=1.12, text='"Nigerian Industrial Gas Sales', showarrow=False, xref='paper', yref='paper', font=dict(size=28, family='Helvetica', color='black', weight='bold'), align='left')
fig.add_annotation(x=0.18, y=1.06, text='Automation Framework"', showarrow=False, xref='paper', yref='paper', font=dict(size=28, family='Helvetica', color='black', weight='bold'), align='left')
fig.add_annotation(x=0.88, y=1.08, text='₦1tn • 1000 • 400', showarrow=False, xref='paper', yref='paper', font=dict(size=16, color='grey'), align='right')

# --- Off-kilter KPIs ---
kpi_data = [('Revenue Target', '₦1tn', 0.12, 0.95), ('Annual Contracts', '400', 0.65, 0.98), ('Avg Deal', '₦4bn', 0.35, 0.92), ('Market Penetration', '30%', 0.82, 0.94)]
for label, value, x, y in kpi_data:
    fig.add_annotation(x=x, y=y, text=f'<b>{value}</b>', showarrow=False, xref='paper', yref='paper', font=dict(size=18, color='black', family='Helvetica'), align='center')
    fig.add_annotation(x=x, y=y-0.04, text=label, showarrow=False, xref='paper', yref='paper', font=dict(size=11, color='grey'), align='center')

# --- Asymmetric stage layout ---
stages = [
    ('01 Discovery', 0.08, 0.82, ['1000 Companies', '₦500m+ Power Costs', 'Web Scraping', '85% Accuracy']),
    ('02 Champion Mapping', 0.38, 0.75, ['3-5 Contacts/Company', 'Middle Management', 'LinkedIn Automation', '80% Validity']),
    ('03 Deep Research', 0.15, 0.58, ['8-Hour Research', 'Psychology & Persuasion', 'News Monitoring', '8/10 Depth']),
    ('04 Campaign Prep', 0.72, 0.65, ['20-50 Companies/Week', 'Personalised Outreach', 'Email Personalisation', '15% Meetings'])
]

# Geometric shapes for each stage (irregular positioning)
stage_shapes = [
    dict(type='circle', xref='paper', yref='paper', x0=0.05, y0=0.87, x1=0.11, y1=0.93, fillcolor='black', line_color='black'),
    dict(type='rect', xref='paper', yref='paper', x0=0.35, y0=0.8, x1=0.41, y1=0.86, fillcolor='black', line_color='black'),
    dict(type='path', path='M 0.12,0.63 L 0.18,0.63 L 0.15,0.69 Z', fillcolor='black', line_color='black'),
    dict(type='rect', xref='paper', yref='paper', x0=0.69, y0=0.7, x1=0.75, y1=0.73, fillcolor='black', line_color='black')
]
fig.update_layout(shapes=stage_shapes)

for title, x, y, bullets in stages:
    fig.add_annotation(x=x, y=y, text=f'<b>{title}</b>', showarrow=False, xref='paper', yref='paper', font=dict(size=16, color='black', family='Helvetica'), align='left')
    for i, bullet in enumerate(bullets):
        fig.add_annotation(x=x, y=y-0.05*(i+1), text=f'→ {bullet}', showarrow=False, xref='paper', yref='paper', font=dict(size=12, color='black'), align='left')

# --- Diagonal connections (Abloh-style) ---
connection_shapes = [
    dict(type='line', xref='paper', yref='paper', x0=0.25, y0=0.78, x1=0.35, y1=0.73, line=dict(color='black', width=2, dash='dot')),
    dict(type='line', xref='paper', yref='paper', x0=0.32, y0=0.67, x1=0.25, y1=0.62, line=dict(color='black', width=2, dash='dot')),
    dict(type='line', xref='paper', yref='paper', x0=0.32, y0=0.58, x1=0.65, y1=0.65, line=dict(color='black', width=2, dash='dot'))
]
fig.update_layout(shapes=fig.layout.shapes + tuple(connection_shapes))

# --- Sidebar quote (Abloh inspiration) ---
fig.add_annotation(x=0.98, y=0.5, text='"Continuous<br>Learning"', showarrow=False, xref='paper', yref='paper', font=dict(size=16, color='black', family='Helvetica', style='italic'), align='right')
fig.add_annotation(x=0.98, y=0.42, text='Win/Loss Analysis<br>Weekly Reviews<br>Monthly Optimisation<br>20% Annual Improvement', showarrow=False, xref='paper', yref='paper', font=dict(size=11, color='grey'), align='right')

# --- Foundation block (asymmetric) ---
fig.add_annotation(x=0.15, y=0.28, text='NIGERIAN MARKET CONTEXT', showarrow=False, xref='paper', yref='paper', font=dict(size=14, color='black', family='Helvetica', weight='bold'), align='left')
fig.add_annotation(x=0.15, y=0.22, text='Grid Reliability: 40-70% • Generator Dependency: 85%<br>Diesel: ₦180-250/kWh • Gas: ₦80-120/kWh', showarrow=False, xref='paper', yref='paper', font=dict(size=11, color='grey'), align='left')
fig.add_annotation(x=0.15, y=0.15, text='Relationship-First • Trust: 5 Touchpoints<br>Bottom-up Influence • Hierarchy Respect', showarrow=False, xref='paper', yref='paper', font=dict(size=11, color='grey'), align='left')

# --- Signature element (Abloh-style) ---
fig.add_annotation(x=0.88, y=0.12, text='®', showarrow=False, xref='paper', yref='paper', font=dict(size=20, color='black'), align='center')

fig.update_layout(
    width=1200, height=900,
    margin=dict(l=40, r=40, t=40, b=40),
    plot_bgcolor='white',
    xaxis=dict(visible=False),
    yaxis=dict(visible=False)
)

fig.write_image('gas_sales_automation_framework_abloh_plotly.png')
print('✅ Abloh-style Plotly visual created: gas_sales_automation_framework_abloh_plotly.png') 