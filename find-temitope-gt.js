#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 Searching for Temitope and GT Bank transactions...');

try {
  const data = JSON.parse(fs.readFileSync('financial-reports/2025-05.json', 'utf8'));
  
  console.log('\n🎯 Searching for "Temitope":');
  
  let temitope = [];
  Object.entries(data.categories).forEach(([category, transactions]) => {
    transactions.forEach((txn) => {
      const fullText = `${txn.subject} ${txn.from}`.toLowerCase();
      
      if (fullText.includes('temitope')) {
        let amountNGN = 0;
        if (txn.amounts && txn.currencies) {
          const amount = parseFloat(txn.amounts[0]);
          const currency = txn.currencies[0];
          
          if (currency === '$') amountNGN = amount * 1583;
          else if (currency === '£') amountNGN = amount * 2000;
          else if (currency === '€') amountNGN = amount * 1700;
          else amountNGN = amount;
        }
        
        temitope.push({
          category,
          amount: amountNGN,
          subject: txn.subject,
          date: txn.date,
          from: txn.from
        });
      }
    });
  });
  
  if (temitope.length === 0) {
    console.log('❌ No "Temitope" found');
  } else {
    temitope.forEach(tx => {
      console.log(`\n₦${Math.round(tx.amount).toLocaleString()} on ${tx.date} in ${tx.category}`);
      console.log(`"${tx.subject}"`);
      console.log(`From: ${tx.from}`);
      
      if (tx.amount >= 200000) {
        console.log(`🎯 FOUND YOUR ₦250K PAYMENT!`);
      }
    });
  }
  
  console.log('\n\n🏦 Searching for "GT" / "GTB" / "GT Bank":');
  
  let gtBank = [];
  const gtTerms = ['gt ', 'gtb', 'gt bank', 'guaranty trust'];
  
  Object.entries(data.categories).forEach(([category, transactions]) => {
    transactions.forEach((txn) => {
      const fullText = `${txn.subject} ${txn.from}`.toLowerCase();
      
      if (gtTerms.some(term => fullText.includes(term))) {
        let amountNGN = 0;
        if (txn.amounts && txn.currencies) {
          const amount = parseFloat(txn.amounts[0]);
          const currency = txn.currencies[0];
          
          if (currency === '$') amountNGN = amount * 1583;
          else if (currency === '£') amountNGN = amount * 2000;
          else if (currency === '€') amountNGN = amount * 1700;
          else amountNGN = amount;
        }
        
        gtBank.push({
          category,
          amount: amountNGN,
          subject: txn.subject,
          date: txn.date,
          from: txn.from
        });
      }
    });
  });
  
  if (gtBank.length === 0) {
    console.log('❌ No GT Bank mentions found');
  } else {
    gtBank.forEach(tx => {
      console.log(`\n₦${Math.round(tx.amount).toLocaleString()} on ${tx.date} in ${tx.category}`);
      console.log(`"${tx.subject}"`);
      console.log(`From: ${tx.from}`);
    });
  }
  
  console.log('\n\n💰 ALL May transactions over ₦150k (broader search):');
  
  let largeTransactions = [];
  
  Object.entries(data.categories).forEach(([category, transactions]) => {
    transactions.forEach((txn) => {
      let amountNGN = 0;
      if (txn.amounts && txn.currencies) {
        const amount = parseFloat(txn.amounts[0]);
        const currency = txn.currencies[0];
        
        if (currency === '$') amountNGN = amount * 1583;
        else if (currency === '£') amountNGN = amount * 2000;
        else if (currency === '€') amountNGN = amount * 1700;
        else amountNGN = amount;
      }
      
      if (amountNGN >= 150000) {
        largeTransactions.push({
          category,
          amount: amountNGN,
          subject: txn.subject,
          date: txn.date,
          from: txn.from,
          original: `${txn.currencies?.[0]}${txn.amounts?.[0]}`
        });
      }
    });
  });
  
  largeTransactions.sort((a, b) => b.amount - a.amount);
  
  if (largeTransactions.length === 0) {
    console.log('❌ No transactions over ₦150k');
  } else {
    largeTransactions.forEach((tx, i) => {
      console.log(`\n${i+1}. ₦${Math.round(tx.amount).toLocaleString()} on ${tx.date} in ${tx.category}`);
      console.log(`   "${tx.subject}"`);
      console.log(`   From: ${tx.from}`);
      console.log(`   Original: ${tx.original}`);
      
      // Check for any GT Bank or Temitope mentions
      const fullText = `${tx.subject} ${tx.from}`.toLowerCase();
      if (fullText.includes('temitope') || fullText.includes('gt ') || fullText.includes('gtb')) {
        console.log(`   🎯 CONTAINS TEMITOPE/GT BANK!`);
      }
      
      if (Math.abs(tx.amount - 250000) < 10000) {
        console.log(`   💰 CLOSE TO ₦250K!`);
      }
    });
  }
  
  console.log('\n\n🔍 Searching transaction CONTENT for bank transfer patterns:');
  
  let bankTransfers = [];
  const bankKeywords = ['transfer', 'sent', 'payment', 'debit', 'withdraw', 'account'];
  
  Object.entries(data.categories).forEach(([category, transactions]) => {
    transactions.forEach((txn) => {
      const fullText = `${txn.subject} ${txn.from}`.toLowerCase();
      
      if (bankKeywords.some(keyword => fullText.includes(keyword))) {
        let amountNGN = 0;
        if (txn.amounts && txn.currencies) {
          const amount = parseFloat(txn.amounts[0]);
          const currency = txn.currencies[0];
          
          if (currency === '$') amountNGN = amount * 1583;
          else if (currency === '£') amountNGN = amount * 2000;
          else if (currency === '€') amountNGN = amount * 1700;
          else amountNGN = amount;
        }
        
        if (amountNGN >= 100000) { // Only large transfers
          bankTransfers.push({
            category,
            amount: amountNGN,
            subject: txn.subject,
            date: txn.date,
            from: txn.from
          });
        }
      }
    });
  });
  
  bankTransfers.sort((a, b) => b.amount - a.amount);
  
  if (bankTransfers.length > 0) {
    console.log(`\nFound ${bankTransfers.length} large bank transfers:`);
    bankTransfers.slice(0, 10).forEach(tx => {
      console.log(`\n₦${Math.round(tx.amount).toLocaleString()} on ${tx.date}`);
      console.log(`"${tx.subject}"`);
      console.log(`From: ${tx.from}`);
    });
  }
  
} catch (error) {
  console.log('❌ Could not load May 2025 data:', error.message);
} 