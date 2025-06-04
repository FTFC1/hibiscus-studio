#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 Searching ALL months for ₦250k payment...');

const months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06'];
let allLargePayments = [];

months.forEach(month => {
  try {
    const data = JSON.parse(fs.readFileSync(`financial-reports/${month}.json`, 'utf8'));
    
    Object.entries(data.categories).forEach(([category, transactions]) => {
      transactions.forEach((txn) => {
        if (txn.amounts && txn.currencies) {
          for (let j = 0; j < txn.amounts.length; j++) {
            const amount = parseFloat(txn.amounts[j]);
            const currency = txn.currencies[j];
            
            // Convert to NGN
            let amountNGN = amount;
            if (currency === '$') amountNGN = amount * 1583;
            else if (currency === '£') amountNGN = amount * 2000;
            else if (currency === '€') amountNGN = amount * 1700;
            
            // Look for amounts between ₦200k - ₦350k
            if (amountNGN >= 200000 && amountNGN <= 350000) {
              allLargePayments.push({
                month,
                category,
                amount: amountNGN,
                originalAmount: amount,
                currency,
                subject: txn.subject,
                date: txn.date,
                from: txn.from
              });
            }
          }
        }
      });
    });
  } catch (error) {
    console.log(`⚠️ Could not check ${month}`);
  }
});

console.log(`\n💰 Found ${allLargePayments.length} large payments (₦200k-₦350k) across all months:`);

allLargePayments.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach((payment, i) => {
  console.log(`\n${i+1}. ₦${Math.round(payment.amount).toLocaleString()} - ${payment.month}`);
  console.log(`   Category: ${payment.category.toUpperCase()}`);
  console.log(`   Subject: "${payment.subject}"`);
  console.log(`   Date: ${payment.date}`);
  console.log(`   Original: ${payment.currency}${payment.originalAmount}`);
});

// Also check banking category specifically in all months for any large amounts
console.log('\n\n🏦 Checking BANKING category specifically for large amounts:');

months.forEach(month => {
  try {
    const data = JSON.parse(fs.readFileSync(`financial-reports/${month}.json`, 'utf8'));
    
    if (data.categories.banking) {
      data.categories.banking.forEach((txn) => {
        if (txn.amounts && txn.currencies) {
          const amount = parseFloat(txn.amounts[0]);
          const currency = txn.currencies[0];
          
          let amountNGN = amount;
          if (currency === '$') amountNGN = amount * 1583;
          else if (currency === '£') amountNGN = amount * 2000;
          else if (currency === '€') amountNGN = amount * 1700;
          
          if (amountNGN >= 100000) { // ₦100k+
            console.log(`\n${month}: ₦${Math.round(amountNGN).toLocaleString()} - "${txn.subject}" on ${txn.date}`);
          }
        }
      });
    }
  } catch (error) {
    // Skip if file doesn't exist
  }
});

console.log('\n\n📊 Summary of largest payments by month:');
months.forEach(month => {
  try {
    const data = JSON.parse(fs.readFileSync(`financial-reports/${month}.json`, 'utf8'));
    let monthMax = 0;
    let maxPayment = null;
    
    Object.entries(data.categories).forEach(([category, transactions]) => {
      transactions.forEach((txn) => {
        if (txn.amounts && txn.currencies) {
          const amount = parseFloat(txn.amounts[0]);
          const currency = txn.currencies[0];
          
          let amountNGN = amount;
          if (currency === '$') amountNGN = amount * 1583;
          else if (currency === '£') amountNGN = amount * 2000;
          else if (currency === '€') amountNGN = amount * 1700;
          
          if (amountNGN > monthMax && category !== 'internal_transfer') {
            monthMax = amountNGN;
            maxPayment = { category, subject: txn.subject, date: txn.date };
          }
        }
      });
    });
    
    if (monthMax > 0) {
      console.log(`${month}: ₦${Math.round(monthMax).toLocaleString()} - ${maxPayment.subject} (${maxPayment.category})`);
    }
  } catch (error) {
    console.log(`${month}: No data`);
  }
}); 