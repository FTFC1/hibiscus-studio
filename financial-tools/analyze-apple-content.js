#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 Analyzing Apple transaction content for specific services...');

try {
  // Check all months for Apple transactions
  const months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06'];
  
  for (const month of months) {
    try {
      const data = JSON.parse(fs.readFileSync(`financial-reports/${month}.json`, 'utf8'));
      
      console.log(`\n📅 ===== ${month.toUpperCase()} =====`);
      
      // Check all Apple-related categories
      const appleCategories = Object.keys(data.categories).filter(cat => 
        cat.toLowerCase().includes('apple')
      );
      
      if (appleCategories.length === 0) {
        console.log('❌ No Apple categories found');
        continue;
      }
      
      appleCategories.forEach(category => {
        const transactions = data.categories[category];
        console.log(`\n🍎 ${category} (${transactions.length} transactions):`);
        
        transactions.forEach((txn, index) => {
          let amountNGN = 0;
          if (txn.amounts && txn.currencies) {
            const amount = parseFloat(txn.amounts[0]);
            const currency = txn.currencies[0];
            
            if (currency === '$') amountNGN = amount * 1583;
            else if (currency === '£') amountNGN = amount * 2000;
            else if (currency === '€') amountNGN = amount * 1700;
            else amountNGN = amount;
          }
          
          console.log(`\n${index + 1}. Subject: "${txn.subject}"`);
          console.log(`   From: ${txn.from}`);
          console.log(`   Date: ${txn.date}`);
          console.log(`   Amount: ₦${amountNGN.toLocaleString()}`);
          
          // Try to extract specific service names from raw data
          if (txn.raw && txn.raw.snippet) {
            const snippet = txn.raw.snippet;
            console.log(`   Snippet: ${snippet}`);
            
            // Look for app/service names in common patterns
            const appPatterns = [
              /(?:Cal AI|YouTube Music|Bumble|Tinder|Claude|OpenAI|ChatGPT|Notion|Spotify|Netflix|Blinkist)/gi,
              /(?:\w+\s+(?:Premium|Pro|Plus|Unlimited))/gi,
              /(?:Dating App|Music|AI|Tracker)/gi
            ];
            
            appPatterns.forEach(pattern => {
              const matches = snippet.match(pattern);
              if (matches) {
                console.log(`   🎯 App/Service: ${matches.join(', ')}`);
              }
            });
          }
        });
      });
    } catch (err) {
      console.log(`❌ Could not read ${month}.json: ${err.message}`);
    }
  }
} catch (error) {
  console.error('❌ Error:', error.message);
} 