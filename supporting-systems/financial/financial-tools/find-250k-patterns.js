#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 Searching for ANY ₦250k patterns...');

const reportDir = 'financial-reports';
let files = fs.readdirSync(reportDir).filter(f => f.endsWith('.json')).sort();

console.log(`📁 Checking: ${files.join(', ')}`);

for (const file of files) {
  const filePath = path.join(reportDir, file);
  const month = file.replace('.json', '');
  
  console.log(`\n\n📅 ===== ${month.toUpperCase()} =====`);
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let found = [];
    
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
        
        // Look for amounts between ₦240k-₦260k (close to ₦250k)
        if (amountNGN >= 240000 && amountNGN <= 260000) {
          found.push({
            category,
            amount: amountNGN,
            subject: txn.subject,
            date: txn.date,
            from: txn.from,
            original: `${txn.currencies?.[0]}${txn.amounts?.[0]}`
          });
        }
        
        // Also check for any mentions of recipient names or transfer patterns
        const fullText = `${txn.subject} ${txn.from}`.toLowerCase();
        const suspiciousKeywords = [
          'transfer', 'sent', 'payment', 'recipient', 'beneficiary', 
          'account', 'bank', 'debit', 'withdraw', 'successful',
          'temitope', 'gt', 'gtb', 'guaranty', 'trust'
        ];
        
        if (suspiciousKeywords.some(keyword => fullText.includes(keyword)) && amountNGN >= 100000) {
          found.push({
            category,
            amount: amountNGN,
            subject: txn.subject,
            date: txn.date,
            from: txn.from,
            original: `${txn.currencies?.[0]}${txn.amounts?.[0]}`,
            reason: 'Transfer-related keywords + large amount'
          });
        }
      });
    });
    
    // Remove duplicates
    found = found.filter((item, index, self) => 
      index === self.findIndex(t => t.subject === item.subject && t.date === item.date)
    );
    
    if (found.length > 0) {
      console.log(`\n🎯 FOUND ${found.length} potential matches:`);
      found.sort((a, b) => b.amount - a.amount);
      
      found.forEach((tx, i) => {
        console.log(`\n${i+1}. ₦${Math.round(tx.amount).toLocaleString()} on ${tx.date} in ${tx.category}`);
        console.log(`   "${tx.subject}"`);
        console.log(`   From: ${tx.from}`);
        console.log(`   Original: ${tx.original}`);
        
        if (tx.reason) {
          console.log(`   🔍 Match reason: ${tx.reason}`);
        }
        
        if (Math.abs(tx.amount - 250000) < 10000) {
          console.log(`   🚨 VERY CLOSE TO ₦250K!`);
        }
        
        // Look for specific patterns in the text
        const fullText = `${tx.subject} ${tx.from}`.toLowerCase();
        if (fullText.includes('temitope')) console.log(`   👤 MENTIONS TEMITOPE`);
        if (fullText.includes('gt') || fullText.includes('guaranty')) console.log(`   🏦 MENTIONS GT BANK`);
        if (fullText.includes('transfer') || fullText.includes('sent')) console.log(`   💸 TRANSFER LANGUAGE`);
        if (fullText.includes('successful')) console.log(`   ✅ SUCCESS CONFIRMATION`);
      });
    } else {
      console.log('❌ No potential matches in this month');
    }
    
  } catch (error) {
    console.log(`❌ Error reading ${file}:`, error.message);
  }
}

console.log('\n\n🔍 ALSO checking for EXACT ₦250,000 amounts:');

for (const file of files) {
  const filePath = path.join(reportDir, file);
  const month = file.replace('.json', '');
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let exact = [];
    
    Object.entries(data.categories).forEach(([category, transactions]) => {
      transactions.forEach((txn) => {
        if (txn.amounts && txn.amounts[0]) {
          const amountStr = txn.amounts[0].toString();
          
          // Check for exact 250000 or 250,000 patterns
          if (amountStr.includes('250000') || amountStr.includes('250,000') || amountStr === '250') {
            let amountNGN = parseFloat(txn.amounts[0]);
            if (txn.currencies && txn.currencies[0]) {
              const currency = txn.currencies[0];
              if (currency === '$') amountNGN = amountNGN * 1583;
              else if (currency === '£') amountNGN = amountNGN * 2000;
              else if (currency === '€') amountNGN = amountNGN * 1700;
            }
            
            exact.push({
              month,
              category,
              amount: amountNGN,
              subject: txn.subject,
              date: txn.date,
              from: txn.from,
              original: `${txn.currencies?.[0]}${txn.amounts?.[0]}`
            });
          }
        }
      });
    });
    
    if (exact.length > 0) {
      console.log(`\n📅 ${month.toUpperCase()}: Found ${exact.length} exact matches:`);
      exact.forEach(tx => {
        console.log(`   ₦${Math.round(tx.amount).toLocaleString()} - "${tx.subject}"`);
        console.log(`   From: ${tx.from} on ${tx.date}`);
      });
    }
    
  } catch (error) {
    // Skip
  }
}

console.log('\n\n🏁 Complete search finished!'); 