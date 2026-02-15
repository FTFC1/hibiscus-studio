// generate-tree.js
// Generate SVG decision tree from booking flow data

import fs from 'fs';

const MOBILE_WIDTH = 390;
const MOBILE_HEIGHT = 1200;

// Flow structure extracted from recapture script + ASCII docs
const bookingFlow = [
  { id: 'step1', label: 'Event Type', type: 'decision', screenshot: 'funnel-dark-step-1.png' },
  { id: 'step2', label: 'When?', type: 'decision', screenshot: 'funnel-dark-step-2-when.png' },
  { id: 'stepMonthPicker', label: 'Month', type: 'decision', screenshot: 'funnel-dark-step-3-month-picker.png' },
  { id: 'step3', label: 'Day Type', type: 'decision', screenshot: 'funnel-dark-step-4-day-type.png' },
  { id: 'step4', label: 'Pick Date', type: 'decision', screenshot: 'funnel-dark-step-5-pick-date.png' },
  { id: 'step5', label: 'Time Slots', type: 'decision', screenshot: 'funnel-dark-step-6-time-slots.png' },
  { id: 'step5-expand', label: 'Time Detail', type: 'detail', screenshot: 'funnel-dark-step-7-time-expanded.png' },
  { id: 'step6', label: 'Guests', type: 'decision', screenshot: 'funnel-dark-step-8-guests.png' },
  { id: 'step7', label: 'Your Details', type: 'decision', screenshot: 'funnel-dark-step-9-details.png' },
  { id: 'step7-filled', label: 'Details Filled', type: 'detail', screenshot: 'funnel-dark-step-10-details-filled.png' },
  { id: 'step8', label: 'Review', type: 'decision', screenshot: 'funnel-dark-step-11-review.png' },
  { id: 'step9', label: 'Confirmed', type: 'terminal', screenshot: 'funnel-dark-step-12-confirmation.png' }
];

function generateTreeSVG() {
  const nodeWidth = 120;
  const nodeHeight = 40;
  const verticalGap = 60;
  const startY = 40;
  const centerX = MOBILE_WIDTH / 2;

  let svg = `<svg width="${MOBILE_WIDTH}" height="${MOBILE_HEIGHT}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<style>
    text {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 12px;
      fill: #fff;
      user-select: none;
    }
    .node { cursor: pointer; }
    .node:hover rect { fill: #222; }
    .node:hover circle { fill: #222; }
    .connector { stroke: #666; stroke-width: 2; }
  </style>`;

  // Black background
  svg += `<rect width="100%" height="100%" fill="#000"/>`;

  // Draw nodes and connectors
  bookingFlow.forEach((node, i) => {
    const y = startY + (i * verticalGap);
    const prevY = i > 0 ? startY + ((i - 1) * verticalGap) : null;

    // Draw connector from previous node
    if (prevY !== null) {
      svg += `<line x1="${centerX}" y1="${prevY + nodeHeight/2}" x2="${centerX}" y2="${y - nodeHeight/2}" class="connector"/>`;
    }

    // Draw node
    const nodeGroup = `<a href="#screen-${i+1}">`;

    if (node.type === 'terminal') {
      // Terminal node (circle)
      svg += nodeGroup;
      svg += `<g class="node">`;
      svg += `<circle cx="${centerX}" cy="${y}" r="${nodeHeight/2}" fill="none" stroke="#4a9" stroke-width="2"/>`;
      svg += `<text x="${centerX}" y="${y + 4}" text-anchor="middle">${node.label}</text>`;
      svg += `</g>`;
      svg += `</a>`;
    } else {
      // Decision/detail node (rectangle)
      const x = centerX - nodeWidth/2;
      svg += nodeGroup;
      svg += `<g class="node">`;
      svg += `<rect x="${x}" y="${y - nodeHeight/2}" width="${nodeWidth}" height="${nodeHeight}" fill="none" stroke="${node.type === 'detail' ? '#888' : '#fff'}" stroke-width="2" rx="4"/>`;
      svg += `<text x="${centerX}" y="${y + 4}" text-anchor="middle">${node.label}</text>`;
      svg += `</g>`;
      svg += `</a>`;
    }
  });

  svg += '</svg>';
  return svg;
}

// Generate and save
const treeSVG = generateTreeSVG();
fs.writeFileSync('tree-diagram.svg', treeSVG);

console.log('✅ Decision tree generated: tree-diagram.svg');
console.log(`📏 Dimensions: ${MOBILE_WIDTH}x${MOBILE_HEIGHT}`);
console.log(`📊 Nodes: ${bookingFlow.length}`);
console.log('\n📱 Open tree-diagram.svg in browser to test tap targets');
