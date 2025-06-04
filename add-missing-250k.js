#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 Adding missing ₦250k transfer to May 2025 report...');

try {
  // Load May 2025 report
  const data = JSON.parse(fs.readFileSync('financial-reports/2025-05.json', 'utf8'));
  
  // Create the missing transaction object
  const missingTransaction = {
    id: 'missing-250k-temitope',
    subject: 'ProvidusBank - Debit Alert',
    from: 'ProvidusBank <alert@providusbank.com>',
    date: '2025-05-26',
    timestamp: '2025-05-26T13:00:37.000Z',
    amounts: [250000.00],
    currencies: ['₦'],
    category: 'banking', // This is an external payment to Temitope, not internal
    isSubscription: false,
    transactionIndicators: true,
    rawSubject: 'ProvidusBank - Debit Alert',
    description: 'OUTWARD TRANSFER to DESALU MICHAEL TEMITOPE ADELEK via GT Bank Plc - Reference: 26052025999600391'
  };
  
  console.log('📄 Adding transaction:');
  console.log(`   Amount: ₦${missingTransaction.amounts[0].toLocaleString()}`);
  console.log(`   Date: ${missingTransaction.date}`);
  console.log(`   Category: ${missingTransaction.category}`);
  console.log(`   Description: ${missingTransaction.description}`);
  
  // Add to banking category
  if (!data.categories.banking) {
    data.categories.banking = [];
  }
  
  // Check if this transaction already exists
  const existingTransaction = data.categories.banking.find(txn => 
    txn.id === missingTransaction.id || 
    (txn.amounts && txn.amounts[0] === 250000 && txn.date === '2025-05-26')
  );
  
  if (existingTransaction) {
    console.log('✅ Transaction already exists in banking category');
  } else {
    // Add the transaction
    data.categories.banking.push(missingTransaction);
    
    // Update total transaction count
    data.totalTransactions = (data.totalTransactions || 0) + 1;
    
    console.log('✅ Added missing ₦250k transaction to banking category');
  }
  
  // Sort banking transactions by date (newest first)
  data.categories.banking.sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date));
  
  // Save updated report
  fs.writeFileSync('financial-reports/2025-05.json', JSON.stringify(data, null, 2));
  
  console.log('💾 Updated May 2025 report saved');
  
  // Verify it was added
  console.log('\n🔍 Verification - checking for ₦250k transactions:');
  
  data.categories.banking.forEach((txn, index) => {
    if (txn.amounts && txn.amounts[0] >= 200000) {
      console.log(`   ${index + 1}. ₦${txn.amounts[0].toLocaleString()} on ${txn.date} - ${txn.subject}`);
    }
  });
  
  console.log('\n✅ Process complete! Your ₦250k transfer to Temitope is now in the May 2025 report.');
  console.log('💡 Next: Re-run dashboard generation to see it in the UI');
  
} catch (error) {
  console.log('❌ Error:', error.message);
} 