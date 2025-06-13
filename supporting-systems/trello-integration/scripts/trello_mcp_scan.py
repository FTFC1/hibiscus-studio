import json
import os
from pathlib import Path

"""Quick scanner for the Trello MCP repository

Outputs:
1. trello_mcp_profile.json – simple JSON listing of notable files grouped by category
2. trello_mcp_ambiguities.md  – starter list of open questions / ambiguities
3. trello_mcp_knowledge_map.txt – ASCII tree of the directory structure with a compact legend

Files are written to knowledge-archaeology/outputs/TrelloMCP/
"""

ROOT: Path = Path('.')  # repository root
OUTPUT_DIR: Path = Path('knowledge-archaeology/outputs/TrelloMCP')
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

EXCLUDE_DIRS = {
    '.git', '.vscode', '.idea', '.cursor', 'node_modules', '__pycache__', 'dist', 'build', '.next', '.vercel'
}

CATEGORY_MAP = {
    'src': 'source_code',
    'pythonscripts': 'source_code',
    'temp-scripts': 'source_code',
    'scripts': 'scripts',
    'tests': 'tests',
    'docs': 'docs',
    'data': 'data',
    'config': 'config',
    'credentials': 'config',
    'knowledge-archaeology': 'knowledge',
}

profile: dict[str, list[str]] = {
    'source_code': [],
    'scripts': [],
    'tests': [],
    'docs': [],
    'config': [],
    'data': [],
    'knowledge': [],
    'misc': []
}

for path in ROOT.rglob('*'):
    if path.is_dir():
        # Skip excluded directories early
        if path.name in EXCLUDE_DIRS:
            continue
        # Also skip if any parent dir is excluded
        if any(part in EXCLUDE_DIRS for part in path.parts):
            continue
        continue  # directories themselves aren't added

    # Skip hidden files
    if any(part.startswith('.') for part in path.parts):
        continue

    # Check if file resides inside an excluded directory
    if any(part in EXCLUDE_DIRS for part in path.parts):
        continue

    rel = path.relative_to(ROOT).as_posix()
    top = rel.split('/')[0]

    cat = CATEGORY_MAP.get(top)
    if not cat:
        # Fallback heuristics by extension
        ext = path.suffix.lower()
        if ext in {'.md', '.txt'}:
            cat = 'docs'
        elif ext in {'.py', '.js', '.ts', '.tsx', '.mjs', '.cjs'}:
            cat = 'source_code'
        elif ext in {'.json', '.toml', '.yaml', '.yml', '.env'}:
            cat = 'config'
        elif ext in {'.csv', '.xlsx', '.xls'}:
            cat = 'data'
        else:
            cat = 'misc'
    profile.setdefault(cat, []).append(rel)

# Write JSON profile
with open(OUTPUT_DIR / 'trello_mcp_profile.json', 'w') as f:
    json.dump(profile, f, indent=2)

# Duplicate profile with hyphenated filename for naming consistency across projects
with open(OUTPUT_DIR / 'trello-mcp.json', 'w') as f:
    json.dump(profile, f, indent=2)

# Generate concept-level JSON skeleton (manual edits encouraged)
concept = {
    "project": "Trello MCP Automations",
    "last_updated": Path().cwd().name,  # placeholder timestamp replaced below
    "summary": "Suite of Python + Node tools exposing Trello power-user workflows via MCP server endpoints (board backups, WAFFLE label processing, checklist manipulation, Gmail hooks).",
    "decisions": [
        {"id": "d1", "decision": "Use Trello REST API directly instead of Selenium", "reason": "Reliability & speed", "date": "2025-06-12"},
        {"id": "d2", "decision": "Centralise automations in MCP server", "reason": "Single invocation surface for agents and CLI"}
    ],
    "considerations": [
        {"id": "c1", "text": "Auth mechanism for multi-board, multi-user scenarios"},
        {"id": "c2", "text": "Rate limiting and API quotas"}
    ],
    "open_questions": [
        "What is the minimal backup frequency that balances data safety & quota?",
        "Should we wrap Trello webhooks for real-time triggers?"
    ]
}
concept["last_updated"] = __import__("datetime").datetime.utcnow().strftime("%Y-%m-%d")
with open(OUTPUT_DIR / 'trello_mcp_profile_concept.json', 'w') as f:
    json.dump(concept, f, indent=2)

# Ambiguity list – starter questions to refine during project discovery
ambiguities = [
    '# Trello MCP Project – Ambiguities',
    '',
    '- What are the exact integration boundaries between MCP server tools and Trello REST API?',
    '- Which authentication flows need to be supported for different Trello user roles?',
    '- Confirm data backup frequency & retention policies for Trello board snapshots.',
    '- Identify missing automated tests for critical tools (e.g., card move, label processing).',
    '- Define clear success metrics for each MCP utility script.',
]
with open(OUTPUT_DIR / 'trello_mcp_ambiguities.md', 'w') as f:
    f.write('\n'.join(ambiguities))

# ASCII directory tree (depth-limited to keep it readable)
TREE_DEPTH = 3
map_lines: list[str] = []
for path in sorted(ROOT.rglob('*')):
    depth = len(path.relative_to(ROOT).parts)
    if depth == 0 or depth > TREE_DEPTH:
        continue
    if any(part in EXCLUDE_DIRS for part in path.parts):
        continue
    indent = '  ' * (depth - 1)
    map_lines.append(f"{indent}- {path.name}")
with open(OUTPUT_DIR / 'trello_mcp_knowledge_map.txt', 'w') as f:
    f.write('\n'.join(map_lines))

# Write duplicate map with hyphen naming to align with GAS outputs
with open(OUTPUT_DIR / 'trello-mcp-map.txt', 'w') as f:
    f.write('\n'.join(map_lines))

# Auto-generate a README summarising the project (similar style to other outputs)
readme_lines = [
    '# 📋 Trello MCP – Knowledge Hub',
    '',
    f'> Last updated: {concept["last_updated"]}',
    '',
    '## 🔹 Overview',
    'The **Trello MCP** project provides a set of server-side tools (Python + JS) that expose powerful Trello automations through the **MCP tool interface**.  Capabilities include board backups, label processors (WAFFLE → WAFFLE ARCHIVED), checklist utilities and Gmail/Trello bridge scripts.',
    '',
    '## 🔹 Current Objective',
    'Stabilise core automation scripts and ship **nightly Trello board backups** + **WAFFLE label archival flow** for production boards.',
    '',
    '## 🔹 Key Decisions ✓',
    '1. **MCP-native tools** instead of ad-hoc CLI scripts – simplifies integration with agents and CI.',
    '2. **Board-level OAuth tokens** stored in `credentials/` – avoids user password flows.',
    '3. **JSON backups in /data** – human-readable & diff-friendly.',
    '',
    '## 🔹 Automation Pipeline (draft)',
    '```mermaid',
    'graph TD;',
    '  A[Trello Board Data] -->|Backup| B[JSON Snapshot];',
    '  B --> C[Blob Storage / Git];',
    '  A -->|Label Scan| D[Process WAFFLE];',
    '  D --> E[Archive Card & Checklist];',
    '```',
    '',
    '## 🔹 Data Assets',
    '| Asset | Path | Status |',
    '|-------|------|--------|',
    '| MCP Trello tools | `src/tools` | In progress |',
    '| Backup dumps | `data/` | Growing |',
    '| Test suite | `tests/` | Partial |',
    '',
    '## 🔹 Pending Explorations ~',
    '- Webhook-driven real-time processing vs cron schedule.',
    '- Fine-grained retry logic for rate-limited requests.',
    '',
    '## 🔹 Open Questions ?',
    '1. Backup retention & purge strategy?',
    '2. How to support multi-workspace boards securely?',
    '',
    '## 🔹 Contributing',
    '1. Clone repo & install deps (`npm i && pip install -r requirements.txt`).',
    '2. Run `python3 scripts/trello_mcp_scan.py` after major file changes to refresh this hub.',
    '3. Submit PRs with concise commits; tag issues as `Decision`, `Question`, `Enhancement`.',
    '',
    '---',
    '*README auto-generated by knowledge-archaeology pipeline.* 🤖',
]
with open(OUTPUT_DIR / 'README_TRELLO_MCP.md', 'w') as f:
    f.write('\n'.join(readme_lines))

print('Trello MCP scan complete – outputs updated (README, concept, map).') 