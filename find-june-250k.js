#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 Searching June 2025 for ₦250k payment with search capability...');

try {
  const data = JSON.parse(fs.readFileSync('financial-reports/2025-06.json', 'utf8'));
  
  // Function to search by recipient/subject
  function searchTransactions(searchTerm) {
    const results = [];
    
    Object.entries(data.categories).forEach(([category, transactions]) => {
      transactions.forEach((txn) => {
        const subject = (txn.subject || '').toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        if (subject.includes(searchLower)) {
          let amountNGN = 0;
          if (txn.amounts && txn.currencies) {
            const amount = parseFloat(txn.amounts[0]);
            const currency = txn.currencies[0];
            
            if (currency === '$') amountNGN = amount * 1583;
            else if (currency === '£') amountNGN = amount * 2000;
            else if (currency === '€') amountNGN = amount * 1700;
            else amountNGN = amount;
          }
          
          results.push({
            category,
            amount: amountNGN,
            subject: txn.subject,
            date: txn.date,
            from: txn.from
          });
        }
      });
    });
    
    return results.sort((a, b) => b.amount - a.amount);
  }
  
  console.log('\n💰 ALL June 2025 transactions over ₦50k:');
  
  let allLargeTransactions = [];
  
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
      
      if (amountNGN >= 50000) {
        allLargeTransactions.push({
          category,
          amount: amountNGN,
          subject: txn.subject,
          date: txn.date,
          from: txn.from
        });
      }
    });
  });
  
  allLargeTransactions.sort((a, b) => b.amount - a.amount);
  
  if (allLargeTransactions.length === 0) {
    console.log('❌ No transactions over ₦50k found in June 2025');
  } else {
    allLargeTransactions.forEach((tx, i) => {
      console.log(`\n${i+1}. ₦${Math.round(tx.amount).toLocaleString()} - ${tx.category}`);
      console.log(`   "${tx.subject}"`);
      console.log(`   Date: ${tx.date}`);
    });
  }
  
  // Common recipient search terms
  const commonNames = ['indrive', 'driver', 'transfer', 'payment', 'withdrawal', 'opay', 'send'];
  
  console.log('\n\n🔍 Searching for common payment terms:');
  
  commonNames.forEach(term => {
    const results = searchTransactions(term);
    if (results.length > 0) {
      console.log(`\n"${term}" found ${results.length} results:`);
      results.slice(0, 5).forEach(result => {
        console.log(`  ₦${Math.round(result.amount).toLocaleString()} - "${result.subject}" (${result.date})`);
      });
    }
  });
  
  // Check specifically for banking transfers that might be your ₦250k
  console.log('\n\n🏦 Banking category transactions:');
  
  if (data.categories.banking) {
    data.categories.banking.forEach((txn, i) => {
      let amountNGN = 0;
      if (txn.amounts && txn.currencies) {
        const amount = parseFloat(txn.amounts[0]);
        const currency = txn.currencies[0];
        
        if (currency === '$') amountNGN = amount * 1583;
        else if (currency === '£') amountNGN = amount * 2000;
        else if (currency === '€') amountNGN = amount * 1700;
        else amountNGN = amount;
      }
      
      console.log(`\n${i+1}. ₦${Math.round(amountNGN).toLocaleString()}`);
      console.log(`   "${txn.subject}"`);
      console.log(`   Date: ${txn.date}`);
    });
  } else {
    console.log('No banking category found in June');
  }
  
} catch (error) {
  console.log('❌ Could not load June 2025 data:', error.message);
} 