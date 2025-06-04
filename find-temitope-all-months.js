#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 Searching ALL months for Temitope and GT Bank transactions...');

const reportDir = 'financial-reports';

// Get all JSON files
let files = [];
if (fs.existsSync(reportDir)) {
  files = fs.readdirSync(reportDir)
    .filter(file => file.endsWith('.json'))
    .sort();
}

if (files.length === 0) {
  console.log('❌ No financial report files found');
  process.exit(1);
}

console.log(`📁 Found ${files.length} files: ${files.join(', ')}`);

for (const file of files) {
  const filePath = path.join(reportDir, file);
  const month = file.replace('.json', '');
  
  console.log(`\n\n📅 ===== ${month.toUpperCase()} =====`);
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Search for Temitope
    let temitope = [];
    let gtBank = [];
    let largeTransactions = [];
    
    Object.entries(data.categories).forEach(([category, transactions]) => {
      transactions.forEach((txn) => {
        const fullText = `${txn.subject} ${txn.from}`.toLowerCase();
        
        let amountNGN = 0;
        if (txn.amounts && txn.currencies) {
          const amount = parseFloat(txn.amounts[0]);
          const currency = txn.currencies[0];
          
          if (currency === '$') amountNGN = amount * 1583;
          else if (currency === '£') amountNGN = amount * 2000;
          else if (currency === '€') amountNGN = amount * 1700;
          else amountNGN = amount;
        }
        
        // Check for Temitope
        if (fullText.includes('temitope')) {
          temitope.push({
            category,
            amount: amountNGN,
            subject: txn.subject,
            date: txn.date,
            from: txn.from
          });
        }
        
        // Check for GT Bank
        const gtTerms = ['gt ', 'gtb', 'gt bank', 'guaranty trust'];
        if (gtTerms.some(term => fullText.includes(term))) {
          gtBank.push({
            category,
            amount: amountNGN,
            subject: txn.subject,
            date: txn.date,
            from: txn.from
          });
        }
        
        // Check for large amounts (around ₦250k)
        if (amountNGN >= 200000 && amountNGN <= 300000) {
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
    
    // Report Temitope findings
    if (temitope.length > 0) {
      console.log(`\n🎯 TEMITOPE FOUND (${temitope.length} transactions):`);
      temitope.forEach(tx => {
        console.log(`   ₦${Math.round(tx.amount).toLocaleString()} on ${tx.date} in ${tx.category}`);
        console.log(`   "${tx.subject}"`);
        console.log(`   From: ${tx.from}`);
        
        if (tx.amount >= 200000 && tx.amount <= 300000) {
          console.log(`   🚨 THIS COULD BE THE ₦250K PAYMENT!`);
        }
      });
    }
    
    // Report GT Bank findings
    if (gtBank.length > 0) {
      console.log(`\n🏦 GT BANK FOUND (${gtBank.length} transactions):`);
      gtBank.forEach(tx => {
        console.log(`   ₦${Math.round(tx.amount).toLocaleString()} on ${tx.date} in ${tx.category}`);
        console.log(`   "${tx.subject}"`);
        console.log(`   From: ${tx.from}`);
        
        if (tx.amount >= 200000 && tx.amount <= 300000) {
          console.log(`   🚨 THIS COULD BE THE ₦250K PAYMENT!`);
        }
      });
    }
    
    // Report large transactions (₦200k-₦300k)
    if (largeTransactions.length > 0) {
      console.log(`\n💰 AMOUNTS ₦200K-₦300K (${largeTransactions.length} transactions):`);
      largeTransactions.forEach(tx => {
        console.log(`   ₦${Math.round(tx.amount).toLocaleString()} on ${tx.date} in ${tx.category}`);
        console.log(`   "${tx.subject}"`);
        console.log(`   From: ${tx.from}`);
        console.log(`   Original: ${tx.original}`);
        
        // Check if this mentions Temitope or GT Bank
        const fullText = `${tx.subject} ${tx.from}`.toLowerCase();
        if (fullText.includes('temitope')) {
          console.log(`   🎯 MENTIONS TEMITOPE!`);
        }
        if (['gt ', 'gtb', 'gt bank', 'guaranty trust'].some(term => fullText.includes(term))) {
          console.log(`   🏦 MENTIONS GT BANK!`);
        }
      });
    }
    
    if (temitope.length === 0 && gtBank.length === 0 && largeTransactions.length === 0) {
      console.log('❌ No matches found in this month');
    }
    
  } catch (error) {
    console.log(`❌ Error reading ${file}:`, error.message);
  }
}

console.log('\n\n🏁 Search complete!'); 