#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 June 2025 Analysis - Is ₦1M spending accurate?');

const data = JSON.parse(fs.readFileSync('financial-reports/2025-06.json', 'utf8'));

let totalSpending = 0;
const categoryBreakdown = {};

console.log('\n📊 June 2025 Category Breakdown:');

Object.entries(data.categories).forEach(([category, transactions]) => {
  if (category === 'internal_transfer') {
    console.log(`${category}: ${transactions.length} txns (SKIPPED - internal transfers)`);
    return;
  }
  
  let categoryTotal = 0;
  let categoryDetails = [];
  
  transactions.forEach(txn => {
    let txnTotal = 0;
    if (txn.amounts && txn.currencies) {
      for (let i = 0; i < txn.amounts.length; i++) {
        let amount = parseFloat(txn.amounts[i]);
        if (txn.currencies[i] === '$') amount *= 1583;
        else if (txn.currencies[i] === '£') amount *= 2000;
        else if (txn.currencies[i] === '€') amount *= 1700;
        txnTotal += amount;
      }
    }
    categoryTotal += txnTotal;
    
    // Track significant transactions
    if (txnTotal > 10000) {
      categoryDetails.push({
        subject: txn.subject?.substring(0, 50),
        amount: txnTotal,
        date: txn.date
      });
    }
  });
  
  totalSpending += categoryTotal;
  categoryBreakdown[category] = {
    total: categoryTotal,
    count: transactions.length,
    details: categoryDetails.sort((a, b) => b.amount - a.amount).slice(0, 3)
  };
  
  console.log(`\n${category}: ₦${Math.round(categoryTotal).toLocaleString()} (${transactions.length} txns)`);
  
  // Show top transactions for this category
  categoryDetails.slice(0, 3).forEach(detail => {
    console.log(`  ₦${Math.round(detail.amount).toLocaleString()} - "${detail.subject}" on ${detail.date}`);
  });
});

console.log(`\n💰 TOTAL JUNE SPENDING: ₦${Math.round(totalSpending).toLocaleString()}`);

// Check for potential issues
console.log('\n🔍 Potential Data Issues:');
const topCategories = Object.entries(categoryBreakdown)
  .sort((a, b) => b[1].total - a[1].total)
  .slice(0, 5);

topCategories.forEach(([category, data]) => {
  console.log(`${category}: ₦${Math.round(data.total).toLocaleString()}`);
  
  // Flag unusually high categories
  if (data.total > 500000) {
    console.log(`  ⚠️ HIGH: Check for duplicates or incorrect categorization`);
  }
});

// Check for promotional emails still getting through
console.log('\n🚫 Checking for promotional emails in results:');
Object.entries(data.categories).forEach(([category, transactions]) => {
  transactions.forEach(txn => {
    const subject = txn.subject?.toLowerCase() || '';
    if (subject.includes('% off') || subject.includes('get ') || subject.includes('save ')) {
      console.log(`  ❌ PROMO DETECTED: "${txn.subject}" in ${category} category`);
    }
  });
}); 