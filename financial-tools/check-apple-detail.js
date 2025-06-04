#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 Checking Apple transaction details...');

try {
  // Check all months for Apple transactions
  const months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06'];
  
  for (const month of months) {
    try {
      const data = JSON.parse(fs.readFileSync(`financial-reports/${month}.json`, 'utf8'));
      
      console.log(`\n📅 ===== ${month.toUpperCase()} =====`);
      
      // Check all Apple-related categories
      const appleCategories = Object.keys(data.categories).filter(cat => 
        cat.toLowerCase().includes('apple')
      );
      
      if (appleCategories.length === 0) {
        console.log('❌ No Apple categories found');
        continue;
      }
      
      appleCategories.forEach(category => {
        const transactions = data.categories[category];
        console.log(`\n🍎 ${category} (${transactions.length} transactions):`);
        
        transactions.forEach((txn, index) => {
          console.log(`\n${index + 1}. Subject: "${txn.subject}"`);
          console.log(`   From: ${txn.from}`);
          console.log(`   Date: ${txn.date}`);
          console.log(`   Amount: ${txn.currencies?.[0]}${txn.amounts?.[0]}`);
          
          // Check if there's a rawSubject with more detail
          if (txn.rawSubject && txn.rawSubject !== txn.subject) {
            console.log(`   Raw Subject: "${txn.rawSubject}"`);
          }
          
          // Check all properties for hidden details
          Object.keys(txn).forEach(key => {
            if (!['subject', 'from', 'date', 'amounts', 'currencies', 'rawSubject'].includes(key)) {
              console.log(`   ${key}: ${JSON.stringify(txn[key])}`);
            }
          });
        });
      });
      
    } catch (error) {
      console.log(`❌ Could not load ${month}: ${error.message}`);
    }
  }
  
} catch (error) {
  console.log('❌ Error:', error.message);
} 