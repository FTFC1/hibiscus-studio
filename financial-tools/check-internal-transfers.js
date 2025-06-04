#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 Checking internal_transfer category in May 2025...');

try {
  const data = JSON.parse(fs.readFileSync('financial-reports/2025-05.json', 'utf8'));
  
  const internalTransfers = data.categories.internal_transfer || [];
  
  console.log(`\n📋 Found ${internalTransfers.length} internal transfers in May 2025:`);
  
  internalTransfers.forEach((txn, index) => {
    let amountNGN = 0;
    if (txn.amounts && txn.currencies) {
      const amount = parseFloat(txn.amounts[0]);
      const currency = txn.currencies[0];
      
      if (currency === '$') amountNGN = amount * 1583;
      else if (currency === '£') amountNGN = amount * 2000;
      else if (currency === '€') amountNGN = amount * 1700;
      else amountNGN = amount;
    }
    
    console.log(`\n${index + 1}. ₦${Math.round(amountNGN).toLocaleString()} on ${txn.date}`);
    console.log(`   Subject: "${txn.subject}"`);
    console.log(`   From: ${txn.from}`);
    
    // Check if this contains Temitope
    const fullText = `${txn.subject} ${txn.from}`.toLowerCase();
    if (fullText.includes('temitope')) {
      console.log(`   🎯 CONTAINS TEMITOPE!`);
    }
    
    if (Math.abs(amountNGN - 250000) < 1000) {
      console.log(`   💰 CLOSE TO ₦250K!`);
    }
  });
  
  // Also check if there are any OUTWARD TRANSFER transactions
  console.log(`\n\n🔍 Searching ALL categories for "OUTWARD TRANSFER":`);
  
  let foundOutward = false;
  
  Object.entries(data.categories).forEach(([category, transactions]) => {
    transactions.forEach((txn, index) => {
      const fullText = `${txn.subject} ${txn.from}`.toLowerCase();
      
      if (fullText.includes('outward transfer')) {
        foundOutward = true;
        
        let amountNGN = 0;
        if (txn.amounts && txn.currencies) {
          const amount = parseFloat(txn.amounts[0]);
          const currency = txn.currencies[0];
          
          if (currency === '$') amountNGN = amount * 1583;
          else if (currency === '£') amountNGN = amount * 2000;
          else if (currency === '€') amountNGN = amount * 1700;
          else amountNGN = amount;
        }
        
        console.log(`\n🎯 FOUND in category "${category}":`);
        console.log(`   Amount: ₦${Math.round(amountNGN).toLocaleString()}`);
        console.log(`   Date: ${txn.date}`);
        console.log(`   Subject: "${txn.subject}"`);
        console.log(`   From: ${txn.from}`);
        
        if (fullText.includes('temitope')) {
          console.log(`   👤 CONTAINS TEMITOPE!`);
        }
      }
    });
  });
  
  if (!foundOutward) {
    console.log('❌ No "OUTWARD TRANSFER" transactions found in any category');
    
    console.log('\n🔍 Final check - searching for ANY transaction on May 26th:');
    
    Object.entries(data.categories).forEach(([category, transactions]) => {
      transactions.forEach((txn, index) => {
        if (txn.date && txn.date.includes('2025-05-26')) {
          let amountNGN = 0;
          if (txn.amounts && txn.currencies) {
            const amount = parseFloat(txn.amounts[0]);
            const currency = txn.currencies[0];
            
            if (currency === '$') amountNGN = amount * 1583;
            else if (currency === '£') amountNGN = amount * 2000;
            else if (currency === '€') amountNGN = amount * 1700;
            else amountNGN = amount;
          }
          
          console.log(`\n📅 May 26th transaction in "${category}":`);
          console.log(`   Amount: ₦${Math.round(amountNGN).toLocaleString()}`);
          console.log(`   Subject: "${txn.subject}"`);
          console.log(`   From: ${txn.from}`);
        }
      });
    });
  }
  
} catch (error) {
  console.log('❌ Error:', error.message);
} 