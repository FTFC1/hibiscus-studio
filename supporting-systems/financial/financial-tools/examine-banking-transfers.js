#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 Examining Banking vs Internal Transfer Categories');

const data = JSON.parse(fs.readFileSync('financial-reports/2025-06.json', 'utf8'));

console.log('\n🏦 BANKING CATEGORY (Real payments to others):');
if (data.categories.banking) {
  data.categories.banking.forEach((txn, i) => {
    const amount = txn.amounts?.[0] || '0';
    const currency = txn.currencies?.[0] || '₦';
    console.log(`${i+1}. ${currency}${amount} - "${txn.subject}" on ${txn.date}`);
  });
} else {
  console.log('No banking transactions found');
}

console.log('\n↔️ INTERNAL_TRANSFER CATEGORY (Transfers to yourself):');
if (data.categories.internal_transfer) {
  data.categories.internal_transfer.forEach((txn, i) => {
    const amount = txn.amounts?.[0] || '0';
    const currency = txn.currencies?.[0] || '₦';
    console.log(`${i+1}. ${currency}${amount} - "${txn.subject}" on ${txn.date}`);
  });
} else {
  console.log('No internal transfers found');
}

console.log('\n📊 SUMMARY:');
console.log(`Banking (real payments): ${data.categories.banking?.length || 0} transactions`);
console.log(`Internal transfers (filtered): ${data.categories.internal_transfer?.length || 0} transactions`);

// Check other months too
console.log('\n📅 OTHER MONTHS COMPARISON:');
const months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05'];

months.forEach(month => {
  try {
    const monthData = JSON.parse(fs.readFileSync(`financial-reports/${month}.json`, 'utf8'));
    const banking = monthData.categories.banking?.length || 0;
    const internal = monthData.categories.internal_transfer?.length || 0;
    console.log(`${month}: Banking=${banking}, Internal=${internal}`);
  } catch (error) {
    console.log(`${month}: File not found`);
  }
}); 