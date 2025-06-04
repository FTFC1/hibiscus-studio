#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 Fixing promotional email filtering and re-processing data...');

// Enhanced promotional detection
function isPromotional(subject) {
  const promotionalWords = [
    'save', 'discount', 'off', '%', 'deal', 'offer', 'promo', 'sale',
    'free', 'bonus', 'cashback', 'reward', 'special', 'limited time',
    'exclusive', 'get', 'win', 'claim', 'unlock', 'earn', 'collect'
  ];
  
  const subjectLower = (subject || '').toLowerCase();
  
  // Check for promotional phrases
  const promotionalPhrases = [
    'save £', 'save $', 'get £', 'get $', 'off your next',
    '% off', 'free delivery', 'cashback', 'special offer',
    'limited time', 'exclusive deal', 'bonus points'
  ];
  
  return promotionalWords.some(word => subjectLower.includes(word)) ||
         promotionalPhrases.some(phrase => subjectLower.includes(phrase)) ||
         /\d+%/.test(subjectLower) || // Any percentage
         /save \£?\d+/.test(subjectLower) || // Save £X or save X
         /get \£?\d+/.test(subjectLower); // Get £X or get X
}

// Function to re-process a month's data
function reprocessMonth(monthFile) {
  try {
    const data = JSON.parse(fs.readFileSync(monthFile, 'utf8'));
    
    console.log(`\n📋 Re-processing ${monthFile}...`);
    
    let promotionalCount = 0;
    let totalTransactions = 0;
    
    // Check each category
    Object.entries(data.categories).forEach(([category, transactions]) => {
      const filteredTransactions = transactions.filter(txn => {
        totalTransactions++;
        
        if (isPromotional(txn.subject)) {
          console.log(`  🚨 REMOVING: "${txn.subject}" from ${category}`);
          promotionalCount++;
          return false;
        }
        return true;
      });
      
      data.categories[category] = filteredTransactions;
    });
    
    // Remove empty categories
    Object.keys(data.categories).forEach(category => {
      if (data.categories[category].length === 0) {
        console.log(`  🗑️ Removing empty category: ${category}`);
        delete data.categories[category];
      }
    });
    
    console.log(`  ✅ Removed ${promotionalCount} promotional emails from ${totalTransactions} total`);
    
    // Write back the cleaned data
    fs.writeFileSync(monthFile, JSON.stringify(data, null, 2));
    
    return { promotionalCount, totalTransactions };
    
  } catch (error) {
    console.log(`  ❌ Error processing ${monthFile}:`, error.message);
    return { promotionalCount: 0, totalTransactions: 0 };
  }
}

// Process all months
const months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06'];
let totalPromotional = 0;
let totalTransactions = 0;

months.forEach(month => {
  const monthFile = `financial-reports/${month}.json`;
  const result = reprocessMonth(monthFile);
  totalPromotional += result.promotionalCount;
  totalTransactions += result.totalTransactions;
});

console.log(`\n🎯 SUMMARY:`);
console.log(`Total promotional emails removed: ${totalPromotional}`);
console.log(`Total transactions processed: ${totalTransactions}`);
console.log(`Cleanup rate: ${Math.round((totalPromotional/totalTransactions)*100)}%`);

console.log('\n✅ Promotional email filtering complete!');
console.log('Now rebuilding dashboard...');

// Rebuild dashboard
import('./enhanced-dashboard.js'); 