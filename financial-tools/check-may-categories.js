#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 Checking May 2025 categories for ₦250k transaction...');

try {
  const data = JSON.parse(fs.readFileSync('financial-reports/2025-05.json', 'utf8'));
  
  console.log('\n📁 Available categories in May 2025:');
  Object.keys(data.categories).forEach(category => {
    const count = data.categories[category].length;
    console.log(`   ${category}: ${count} transactions`);
  });
  
  console.log('\n🔍 Searching for ₦250k transaction in ALL categories:');
  
  let found = false;
  
  Object.entries(data.categories).forEach(([category, transactions]) => {
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
      
      // Check for Temitope or exactly ₦250k
      const fullText = `${txn.subject} ${txn.from}`.toLowerCase();
      const isTemitope = fullText.includes('temitope');
      const is250k = Math.abs(amountNGN - 250000) < 100;
      
      if (isTemitope || is250k) {
        found = true;
        console.log(`\n🎯 FOUND in category "${category}" (transaction ${index + 1}):`);
        console.log(`   Amount: ₦${Math.round(amountNGN).toLocaleString()}`);
        console.log(`   Date: ${txn.date}`);
        console.log(`   Subject: "${txn.subject}"`);
        console.log(`   From: ${txn.from}`);
        
        if (isTemitope) console.log(`   👤 Contains TEMITOPE`);
        if (is250k) console.log(`   💰 Is ₦250K`);
      }
    });
  });
  
  if (!found) {
    console.log('❌ ₦250k transaction still NOT found in any category');
    console.log('\n💡 Possible issues:');
    console.log('   1. Transaction being categorised differently');
    console.log('   2. Still being filtered as internal transfer');
    console.log('   3. Amount extraction issue');
    
    console.log('\n🔍 Let me check ALL large transactions in May:');
    
    Object.entries(data.categories).forEach(([category, transactions]) => {
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
        
        if (amountNGN >= 100000) {
          console.log(`\n${category}: ₦${Math.round(amountNGN).toLocaleString()} on ${txn.date}`);
          console.log(`   "${txn.subject}"`);
        }
      });
    });
  }
  
} catch (error) {
  console.log('❌ Error:', error.message);
} 