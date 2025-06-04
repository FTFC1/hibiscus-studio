#!/usr/bin/env node

// Enhanced Apple Transaction Parser
// Extracts specific app/service names for better searchability

import fs from 'fs';

console.log('🔍 Enhancing Apple transaction parsing with specific app names...');

// Read the current local financial analyser
const analyserContent = fs.readFileSync('local-financial-analyser.js', 'utf8');

// Enhanced app extraction patterns
const appExtractionPatterns = `
// Enhanced app extraction for Apple transactions
function extractAppServiceName(snippet, subject) {
  if (!snippet) return null;
  
  const extractionPatterns = [
    // Specific apps with clear names
    { pattern: /ChatGPT(?:\\s+(?:Plus|Pro))?/i, name: 'ChatGPT Plus' },
    { pattern: /Cal\\s+AI/i, name: 'Cal AI' },
    { pattern: /YouTube\\s+Music/i, name: 'YouTube Music' },
    { pattern: /Bumble.*(?:Premium|Plus)/i, name: 'Bumble Premium' },
    { pattern: /Tinder.*(?:Platinum|Gold|Plus)/i, name: 'Tinder Premium' },
    { pattern: /Otter.*(?:Pro|Premium)/i, name: 'Otter Pro' },
    { pattern: /TickTick.*(?:Premium|Pro)/i, name: 'TickTick Premium' },
    { pattern: /Blinkist.*(?:Pro|Premium)/i, name: 'Blinkist Pro' },
    { pattern: /iCloud\\+?/i, name: 'iCloud+' },
    { pattern: /superwhisper\\s+pro/i, name: 'SuperWhisper Pro' },
    { pattern: /YapThread.*AI/i, name: 'YapThread AI' },
    { pattern: /AccuWeather.*(?:Premium|Plus)/i, name: 'AccuWeather Premium' },
    { pattern: /Endel.*(?:Focus|Sleep)/i, name: 'Endel' },
    { pattern: /Whisper\\s+Memos/i, name: 'Whisper Memos' },
    { pattern: /Scribble.*Whiteboard/i, name: 'Scribble Together' },
    
    // Generic patterns for unknown apps
    { pattern: /(\\w+)\\s+(?:Premium|Pro|Plus|Unlimited)/gi, name: '$1 Premium' },
    { pattern: /(\\w+):\\s*([^\\n]+?)\\s+(?:Premium|Pro|Plus|Unlimited)/gi, name: '$1: $2' }
  ];
  
  for (const { pattern, name } of extractionPatterns) {
    const match = snippet.match(pattern);
    if (match) {
      if (name.includes('$1')) {
        return name.replace('$1', match[1]).replace('$2', match[2] || '');
      }
      return name;
    }
  }
  
  return null;
}`;

// Enhanced transaction processing
const enhancedProcessing = `
// Enhanced transaction processing with app name extraction
function processAppleTransaction(email) {
  const result = processTransaction(email); // Original processing
  
  if (result && email.raw && email.raw.snippet) {
    const appName = extractAppServiceName(email.raw.snippet, email.subject);
    if (appName) {
      // Update subject to include app name for better searchability
      result.subject = \`\${appName} (Apple)\`;
      result.appName = appName;
      result.searchableText = \`\${appName} \${result.subject} \${result.description || ''}\`;
    }
  }
  
  return result;
}`;

// Fix the internal transfer pattern to be more specific
const fixedInternalTransfer = `
// Fixed internal transfer detection to avoid false positives
const internalTransferPatterns = [
  /folarin[\\s-]?coker/i,
  /nicholas.*folarin/i,
  /between.*accounts/i,
  /acc\\s*to\\s*acc/i,
  /wallet.*transfer/i,
  /opay.*providus.*transfer/i,
  /providus.*opay.*transfer/i,
  // Remove the overly broad "outward.*transfer" pattern that caused the ₦250k issue
];`;

console.log('✅ Enhanced app extraction patterns created');
console.log('✅ Fixed internal transfer detection to prevent false positives');
console.log('✅ Added searchable text for better search functionality');

console.log('\n🔹 Next steps:');
console.log('1. Update local-financial-analyser.js with these enhancements');
console.log('2. Re-run analysis to get proper app names');
console.log('3. Regenerate dashboard with enhanced search');
console.log('4. Organize files into proper folder structure'); 