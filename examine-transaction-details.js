#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 Examining Banking Transaction Details');

const data = JSON.parse(fs.readFileSync('financial-reports/2025-06.json', 'utf8'));

// Get first few internal transfer transactions to examine their content
console.log('\n📧 Sample Internal Transfer Email Content:');

if (data.categories.internal_transfer && data.categories.internal_transfer.length > 0) {
  // Look at first 3 transactions
  for (let i = 0; i < Math.min(3, data.categories.internal_transfer.length); i++) {
    const txn = data.categories.internal_transfer[i];
    console.log(`\n--- Transaction ${i+1} ---`);
    console.log(`Subject: "${txn.subject}"`);
    console.log(`From: "${txn.from}"`);
    console.log(`Amount: ${txn.currencies?.[0]}${txn.amounts?.[0]}`);
    console.log(`Date: ${txn.date}`);
    
    // Try to get raw email content if available
    if (txn.raw && txn.raw.payload) {
      console.log('Email content available for analysis');
      
      // Try to extract snippet or body text
      if (txn.raw.snippet) {
        console.log(`Snippet: "${txn.raw.snippet}"`);
      }
      
      // Look for headers that might have recipient info
      if (txn.raw.payload.headers) {
        const headers = txn.raw.payload.headers;
        const subjectHeader = headers.find(h => h.name === 'Subject');
        console.log(`Full Subject: "${subjectHeader?.value || 'N/A'}"`);
      }
    }
  }
}

// Check May 2025 which showed 1 banking transaction
console.log('\n\n🔍 Checking May 2025 Banking Transaction:');
try {
  const mayData = JSON.parse(fs.readFileSync('financial-reports/2025-05.json', 'utf8'));
  if (mayData.categories.banking && mayData.categories.banking.length > 0) {
    const bankingTxn = mayData.categories.banking[0];
    console.log(`\n--- May Banking Transaction ---`);
    console.log(`Subject: "${bankingTxn.subject}"`);
    console.log(`From: "${bankingTxn.from}"`);
    console.log(`Amount: ${bankingTxn.currencies?.[0]}${bankingTxn.amounts?.[0]}`);
    console.log(`Date: ${bankingTxn.date}`);
  } else {
    console.log('No banking transactions found in May');
  }
} catch (error) {
  console.log('Could not read May data');
} 