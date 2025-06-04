#!/usr/bin/env node

/**
 * 🔍 Email Parsing Audit
 * Deep dive into parsing accuracy
 */

import LocalFinancialAnalyser from './local-financial-analyser.js';

async function auditEmailParsing() {
  console.log('🔍 AUDIT: Email Parsing Deep Dive');
  
  const analyser = new LocalFinancialAnalyser();
  await analyser.initialize();
  
  // Test actual receipt emails, not newsletters
  const testQueries = [
    'subject:"receipt from Mobbin" OR subject:"invoice from Mobbin"',
    'subject:"receipt from Vercel" OR subject:"your receipt" from:vercel',
    'subject:"your invoice from Apple" OR subject:"subscription confirmation" from:apple'
  ];
  
  for (const query of testQueries) {
    console.log(`\n🔍 TESTING: ${query}`);
    
    // Get raw messages first
    const response = await analyser.gmailService.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 3
    });
    
    if (!response.data.messages) {
      console.log('No messages found');
      continue;
    }
    
    for (const message of response.data.messages.slice(0, 2)) {
      const fullMessage = await analyser.gmailService.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'full'
      });
      
      const headers = fullMessage.data.payload?.headers || [];
      const subject = headers.find(h => h.name === 'Subject')?.value || '';
      const from = headers.find(h => h.name === 'From')?.value || '';
      
      console.log(`\n📧 RAW EMAIL: "${subject}" from ${from}`);
      
      // Test the actual parser method  
      const parsedTransaction = analyser.parseFinancialEmail(fullMessage.data);
      
      if (parsedTransaction) {
        console.log(`✅ PARSED SUCCESSFULLY:`);
        console.log(`   💰 Amounts: ${parsedTransaction.amounts.map((amt, i) => `${parsedTransaction.currencies[i]}${amt}`).join(', ')}`);
        console.log(`   📂 Category: ${parsedTransaction.category}`);
        console.log(`   📅 Date: ${parsedTransaction.date}`);
      } else {
        console.log(`❌ FAILED TO PARSE`);
        
        // Show sample text to understand why
        const bodyText = analyser.extractEmailBody(fullMessage.data.payload);
        const fullText = subject + ' ' + bodyText;
        console.log(`📝 SAMPLE TEXT: "${fullText.substring(0, 300)}..."`);
      }
    }
  }
}

auditEmailParsing().catch(console.error); 