import json
import os
from pathlib import Path
import re

ROOT = Path('knowledge-archaeology/inputs/project-files/Retail')
OUTPUT_DIR = Path('knowledge-archaeology/outputs/Retail')
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

profile = {
    'project_name': 'Retail Venture',
    'core_docs': [],
    'research_interviews': [],
    'partnership_docs': [],
    'assets': [],
    'misc': []
}

for path in ROOT.rglob('*'):
    if path.is_dir() or path.name.startswith('.'):
        continue
    rel = path.relative_to(ROOT).as_posix()
    parts = rel.split('/')
    top = parts[0]
    ext = path.suffix.lower()

    if top.startswith('01-'):
        profile['core_docs'].append(rel)
    elif top.startswith('02-'):
        if 'INTERVIEWS' in rel.upper():
            profile['research_interviews'].append(rel)
        else:
            profile['core_docs'].append(rel)
    elif top.startswith('03-'):
        profile['partnership_docs'].append(rel)
    elif top.startswith('04-'):
        profile['assets'].append(rel)
    else:
        profile['misc'].append(rel)

# Write JSON profile
with open(OUTPUT_DIR / 'retail_profile.json', 'w') as f:
    json.dump(profile, f, indent=2)

# Generate ambiguity list (placeholder questions)
ambiguity_lines = [
    '# Retail Project – Ambiguities',
    '',
    '- Define the exact value proposition and target customer segment.',
    '- Clarify current partnership status and next steps.',
    '- Confirm which assets are final vs drafts.',
    '- Identify missing research areas or unanswered interview questions.'
]
with open(OUTPUT_DIR / 'retail_ambiguities.md', 'w') as f:
    f.write('\n'.join(ambiguity_lines))

# Generate directory map (ASCII)
map_lines = []
for path in ROOT.rglob('*'):
    level = len(path.relative_to(ROOT).parts)
    indent = '  ' * (level - 1)
    map_lines.append(f"{indent}- {path.name}")
with open(OUTPUT_DIR / 'retail_knowledge_map.txt', 'w') as f:
    f.write('\n'.join(map_lines))

EXCLUDE_DIRS = {'.git', '.vercel', '.vscode', '.cursor', 'temp', '.specstory/history'}

concept_nodes = {
    '[C] Core Docs': profile['core_docs'][:5],
    '[R] Research Interviews': [p for p in profile['research_interviews'][:3]],
    '[P] Partnership Docs': profile['partnership_docs'][:3],
    '[A] Assets': profile['assets'][:3]
}

concept_lines = [
    'FORJE Retail – Knowledge Map (2025-06-12)',
    '',
    '   [PROJECT ROOT]'
]
for label, items in concept_nodes.items():
    concept_lines.append('        |')
    concept_lines.append(f'        |-- {label}')
    for i in items:
        concept_lines.append(f'            - {Path(i).name}')
concept_lines.append('\nLegend:')
concept_lines.append('   [C] Core')
concept_lines.append('   [R] Research')
concept_lines.append('   [P] Partnership')
concept_lines.append('   [A] Asset')

with open(OUTPUT_DIR / 'retail-knowledge-map.txt', 'w') as f:
    f.write('\n'.join(concept_lines))

print('Retail scan complete.') 