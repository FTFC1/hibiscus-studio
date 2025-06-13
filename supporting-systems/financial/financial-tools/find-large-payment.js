#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 Searching for ₦250k payment in June 2025...');

const data = JSON.parse(fs.readFileSync('financial-reports/2025-06.json', 'utf8'));

let foundLargePayments = [];

// Check all categories for payments around ₦250k
Object.entries(data.categories).forEach(([category, transactions]) => {
  transactions.forEach((txn, i) => {
    if (txn.amounts && txn.currencies) {
      for (let j = 0; j < txn.amounts.length; j++) {
        const amount = parseFloat(txn.amounts[j]);
        const currency = txn.currencies[j];
        
        // Convert to NGN
        let amountNGN = amount;
        if (currency === '$') amountNGN = amount * 1583;
        else if (currency === '£') amountNGN = amount * 2000;
        else if (currency === '€') amountNGN = amount * 1700;
        
        // Look for amounts between ₦200k - ₦300k
        if (amountNGN >= 200000 && amountNGN <= 300000) {
          foundLargePayments.push({
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

console.log(`\n💰 Found ${foundLargePayments.length} payments between ₦200k-₦300k:`);

foundLargePayments.sort((a, b) => b.amount - a.amount).forEach((payment, i) => {
  console.log(`\n${i+1}. ₦${Math.round(payment.amount).toLocaleString()} in ${payment.category.toUpperCase()}`);
  console.log(`   Subject: "${payment.subject}"`);
  console.log(`   Date: ${payment.date}`);
  console.log(`   Original: ${payment.currency}${payment.originalAmount}`);
  console.log(`   From: ${payment.from}`);
});

// Also check for any amounts close to $158 (which would be ~₦250k)
console.log('\n\n💵 Checking for USD amounts around $158 (≈₦250k):');

Object.entries(data.categories).forEach(([category, transactions]) => {
  transactions.forEach((txn) => {
    if (txn.amounts && txn.currencies) {
      for (let j = 0; j < txn.amounts.length; j++) {
        const amount = parseFloat(txn.amounts[j]);
        const currency = txn.currencies[j];
        
        if (currency === '$' && amount >= 150 && amount <= 170) {
          console.log(`\n${currency}${amount} in ${category} - "${txn.subject}" on ${txn.date}`);
        }
      }
    }
  });
});

if (foundLargePayments.length === 0) {
  console.log('\n❌ No payments found between ₦200k-₦300k in June 2025');
  console.log('\n🔍 Let me check internal_transfer category specifically:');
  
  if (data.categories.internal_transfer) {
    data.categories.internal_transfer.forEach((txn, i) => {
      console.log(`\nInternal Transfer ${i+1}:`);
      console.log(`  Subject: "${txn.subject}"`);
      console.log(`  Amount: ${txn.currencies?.[0]}${txn.amounts?.[0]}`);
      console.log(`  Date: ${txn.date}`);
    });
  } else {
    console.log('No internal_transfer category found');
  }
} 