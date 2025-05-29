#!/bin/bash
source .env

NEW_DESC="**Sales training platform for retail teams**

Starting with retail sales training modules, with plans to expand into additional modules and eventually enter the hospitality sector.

Consolidated from 9 individual RetailTM cards. All project tasks now organized in proper Trello checklists above.

**Key Resources:**
- Replit prototype (working v002)
- Whimsical moodboard  
- ChatGPT conversation (includes AI asset generation prompts for recreation)"

echo "🛠️ Updating RetailTM card description..."

curl -X PUT "https://api.trello.com/1/cards/68386072f2dcc797afe8902e?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}" \
  --data-urlencode "desc=${NEW_DESC}"

echo ""
echo "✅ Description updated successfully!" 