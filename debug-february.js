#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 Debugging February 2025 - Why are amounts so small?');

const data = JSON.parse(fs.readFileSync('financial-reports/2025-02.json', 'utf8'));

console.log('\n📊 February 2025 Category Breakdown:');

Object.entries(data.categories).forEach(([category, transactions]) => {
  if (category === 'internal_transfer') return;
  
  let categoryTotal = 0;
  console.log(`\n${category.toUpperCase()} (${transactions.length} transactions):`);
  
  transactions.forEach((txn, i) => {
    let txnTotal = 0;
    if (txn.amounts && txn.currencies) {
      for (let j = 0; j < txn.amounts.length; j++) {
        const amount = parseFloat(txn.amounts[j]);
        const currency = txn.currencies[j];
        
        // Convert to NGN
        let amountNGN = amount;
        if (currency === '$') amountNGN = amount * 1583;
        else if (currency === '£') amountNGN = amount * 2000;
        else if (currency === '€') amountNGN = amount * 1700;
        
        txnTotal += amountNGN;
      }
    }
    
    categoryTotal += txnTotal;
    console.log(`  ${i+1}. ₦${Math.round(txnTotal).toLocaleString()} - "${txn.subject}" (${txn.date})`);
    
    // Check for promotional patterns
    const subject = (txn.subject || '').toLowerCase();
    if (subject.includes('save') || subject.includes('off') || subject.includes('%') || subject.includes('discount')) {
      console.log(`     🚨 PROMOTIONAL?: "${txn.subject}"`);
    }
  });
  
  console.log(`  📈 TOTAL ${category}: ₦${Math.round(categoryTotal).toLocaleString()}`);
});

console.log('\n\n🚨 Checking for promotional emails that got through:');

Object.entries(data.categories).forEach(([category, transactions]) => {
  transactions.forEach((txn) => {
    const subject = (txn.subject || '').toLowerCase();
    const promotionalWords = ['save', 'discount', 'off', '%', 'deal', 'offer', 'promo'];
    
    if (promotionalWords.some(word => subject.includes(word))) {
      console.log(`\n${category}: "${txn.subject}"`);
      console.log(`  Amount: ${txn.currencies?.[0]}${txn.amounts?.[0]}`);
      console.log(`  Date: ${txn.date}`);
    }
  });
});

console.log('\n\n💰 All transactions over ₦10k in February:');

Object.entries(data.categories).forEach(([category, transactions]) => {
  transactions.forEach((txn) => {
    if (txn.amounts && txn.currencies) {
      const amount = parseFloat(txn.amounts[0]);
      const currency = txn.currencies[0];
      
      let amountNGN = amount;
      if (currency === '$') amountNGN = amount * 1583;
      else if (currency === '£') amountNGN = amount * 2000;
      else if (currency === '€') amountNGN = amount * 1700;
      
      if (amountNGN >= 10000) {
        console.log(`\n₦${Math.round(amountNGN).toLocaleString()} in ${category}`);
        console.log(`  "${txn.subject}" on ${txn.date}`);
        console.log(`  Original: ${currency}${amount}`);
      }
    }
  });
}); 