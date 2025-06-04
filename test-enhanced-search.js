#!/usr/bin/env node

// Test Enhanced Search Functionality
import fs from 'fs';

console.log('🔍 Testing enhanced search functionality...');

try {
  // Read May 2025 data to check if app names are properly extracted
  const mayData = JSON.parse(fs.readFileSync('financial-reports/2025-05.json', 'utf8'));
  
  console.log('\n📊 May 2025 Categories:');
  Object.keys(mayData.categories).forEach(category => {
    console.log(`   ${category}: ${mayData.categories[category].length} transactions`);
  });
  
  console.log('\n🍎 Apple Apps with Enhanced Names:');
  let foundApps = 0;
  
  if (mayData.categories.apple_apps) {
    mayData.categories.apple_apps.forEach((txn, index) => {
      if (txn.appName || txn.subject !== 'Your invoice from Apple.') {
        foundApps++;
        console.log(`   ${index + 1}. ${txn.subject} (${txn.appName || 'No app name'})`);
        
        let amountNGN = 0;
        if (txn.amounts && txn.currencies) {
          const amount = parseFloat(txn.amounts[0]);
          const currency = txn.currencies[0];
          
          if (currency === '$') amountNGN = amount * 1583;
          else if (currency === '£') amountNGN = amount * 2000;
          else if (currency === '€') amountNGN = amount * 1700;
          else amountNGN = amount;
        }
        
        console.log(`      Amount: ₦${amountNGN.toLocaleString()}`);
        console.log(`      Date: ${txn.date}`);
        
        if (txn.searchableText) {
          console.log(`      Searchable: "${txn.searchableText.substring(0, 80)}..."`);
        }
      }
    });
  }
  
  console.log(`\n✅ Found ${foundApps} enhanced app transactions`);
  
  // Test search queries
  const testQueries = ['chatgpt', 'bumble', 'cal ai', 'youtube music', 'temitope'];
  
  console.log('\n🔍 Testing search queries:');
  
  Object.entries(mayData.categories).forEach(([category, transactions]) => {
    transactions.forEach(txn => {
      const searchText = [
        txn.subject,
        txn.appName,
        txn.description,
        category,
        txn.from
      ].filter(Boolean).join(' ').toLowerCase();
      
      testQueries.forEach(query => {
        if (searchText.includes(query)) {
          console.log(`   ✅ "${query}" → Found: ${txn.subject} (${category})`);
        }
      });
    });
  });
  
  console.log('\n🎯 Search functionality test complete!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
} 