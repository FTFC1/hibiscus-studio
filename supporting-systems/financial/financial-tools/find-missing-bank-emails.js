#!/usr/bin/env node

import { google } from 'googleapis';
import fs from 'fs/promises';

async function findMissingBankEmails() {
  console.log('🔍 Searching Gmail for missing bank transfer emails...');
  
  try {
    // Load credentials and token
    const credentials = JSON.parse(await fs.readFile('gmail-credentials.json', 'utf8'));
    const token = JSON.parse(await fs.readFile('gmail-token.json', 'utf8'));
    
    const { client_secret, client_id } = credentials.installed;
    const auth = new google.auth.OAuth2(client_id, client_secret);
    auth.setCredentials(token);
    
    const gmail = google.gmail({ version: 'v1', auth });
    
    // Comprehensive search queries for any potential bank transfer emails
    const searchQueries = [
      // Specific search for ₦250k amounts
      '250000 OR "250,000" OR "₦250"',
      // GT Bank specific searches
      'GT Bank OR GTB OR "Guaranty Trust"',
      // Temitope specific
      'Temitope',
      // General bank transfer notifications (broader than current parsing)
      'transfer successful OR payment successful OR debit alert',
      'sent to OR transferred to OR payment to',
      '₦250 OR NGN250 OR "250 thousand"',
      // Any emails about large transfers in the ₦200k-₦300k range
      '200000 OR 250000 OR 300000',
      // Search for any bank notification patterns
      'bank transfer OR wire transfer OR fund transfer',
      'account debited OR account debit OR wallet debit',
      // Look for different date ranges (maybe it wasn't exactly May 26th)
      'transfer after:2025/05/20 before:2025/06/05',
      'debit after:2025/05/20 before:2025/06/05',
      // Search all months for any large amounts
      '250000 after:2025/01/01',
      'Temitope after:2025/01/01',
      'GT Bank after:2025/01/01'
    ];

    console.log(`📧 Running ${searchQueries.length} comprehensive search queries...`);
    
    let allCandidates = [];
    
    for (const [index, query] of searchQueries.entries()) {
      console.log(`\n🔍 Query ${index + 1}/${searchQueries.length}: "${query}"`);
      
      try {
        const response = await gmail.users.messages.list({
          userId: 'me',
          q: query,
          maxResults: 20
        });

        if (!response.data.messages) {
          console.log('❌ No messages found');
          continue;
        }

        console.log(`📧 Found ${response.data.messages.length} emails`);
        
        for (const message of response.data.messages) {
          const fullMessage = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: 'full'
          });
          
          const headers = fullMessage.data.payload?.headers || [];
          const subject = headers.find(h => h.name === 'Subject')?.value || '';
          const from = headers.find(h => h.name === 'From')?.value || '';
          const date = new Date(parseInt(fullMessage.data.internalDate));
          
          // Extract email body
          let bodyText = extractEmailBody(fullMessage.data.payload);
          
          // Check if this could be the ₦250k payment
          const fullText = `${subject} ${from} ${bodyText}`.toLowerCase();
          
          let amounts = [];
          let currencies = [];
          
          // Extract amounts - look for various patterns
          const amountPatterns = [
            /₦([0-9,]+(?:\.[0-9]{2})?)/g,
            /NGN\s*([0-9,]+(?:\.[0-9]{2})?)/g,
            /([0-9,]+)\s*naira/g,
            /amount[:\s]*₦?([0-9,]+)/g,
            /([0-9,]+)\s*₦/g
          ];
          
          for (const pattern of amountPatterns) {
            let match;
            while ((match = pattern.exec(fullText)) !== null) {
              const cleanAmount = match[1].replace(/,/g, '');
              const amount = parseFloat(cleanAmount);
              if (amount > 1000) { // Only meaningful amounts
                amounts.push(amount);
                currencies.push('₦');
              }
            }
          }
          
          // Check if this mentions key terms
          const mentions = {
            temitope: /temitope/i.test(fullText),
            gtBank: /gt\s|gtb|guaranty.*trust/i.test(fullText),
            transfer: /transfer|sent|payment|debit/i.test(fullText),
            large: amounts.some(amt => amt >= 200000 && amt <= 300000),
            exact250k: amounts.some(amt => Math.abs(amt - 250000) < 1000)
          };
          
          if (mentions.temitope || mentions.gtBank || mentions.exact250k || 
              (mentions.large && mentions.transfer)) {
            
            allCandidates.push({
              subject,
              from,
              date: date.toLocaleDateString('en-GB'),
              time: date.toLocaleTimeString('en-GB'),
              amounts,
              currencies,
              mentions,
              snippet: bodyText.substring(0, 200) + '...',
              id: fullMessage.data.id
            });
          }
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.log(`❌ Query failed: ${error.message}`);
      }
    }
    
    // Remove duplicates by ID
    const uniqueCandidates = allCandidates.filter((item, index, self) =>
      index === self.findIndex(t => t.id === item.id)
    );
    
    console.log(`\n\n🎯 FOUND ${uniqueCandidates.length} POTENTIAL CANDIDATES:`);
    
    if (uniqueCandidates.length === 0) {
      console.log('❌ No candidate emails found for ₦250k transfer to Temitope via GT Bank');
      console.log('\n💡 This suggests:');
      console.log('   - Email was never received by Gmail');
      console.log('   - Email is in Spam/Trash folder');
      console.log('   - Transaction was sent from a different email account');
      console.log('   - Bank notification was disabled for this transaction');
      console.log('   - Different date than expected');
    } else {
      uniqueCandidates
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach((candidate, i) => {
          console.log(`\n${i + 1}. ${candidate.subject}`);
          console.log(`   From: ${candidate.from}`);
          console.log(`   Date: ${candidate.date} ${candidate.time}`);
          
          if (candidate.amounts.length > 0) {
            const amountStr = candidate.amounts.map((amt, idx) => 
              `${candidate.currencies[idx]}${amt.toLocaleString()}`
            ).join(', ');
            console.log(`   Amounts: ${amountStr}`);
          }
          
          const flags = [];
          if (candidate.mentions.temitope) flags.push('🧑 TEMITOPE');
          if (candidate.mentions.gtBank) flags.push('🏦 GT BANK');
          if (candidate.mentions.exact250k) flags.push('💰 ₦250K');
          if (candidate.mentions.large) flags.push('💸 LARGE');
          if (candidate.mentions.transfer) flags.push('🔄 TRANSFER');
          
          if (flags.length > 0) {
            console.log(`   Flags: ${flags.join(' ')}`);
          }
          
          console.log(`   Preview: ${candidate.snippet}`);
          
          if (candidate.mentions.temitope && candidate.mentions.exact250k) {
            console.log(`   🚨 THIS IS LIKELY YOUR ₦250K PAYMENT TO TEMITOPE!`);
          }
        });
    }
    
  } catch (error) {
    console.error('❌ Search failed:', error.message);
  }
}

// Helper function to extract email body
function extractEmailBody(payload) {
  let bodyText = '';
  
  if (payload.body && payload.body.data) {
    try {
      const text = Buffer.from(payload.body.data, 'base64').toString('utf-8');
      bodyText += text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    } catch (e) {
      // Ignore decode errors
    }
  }
  
  if (payload.parts) {
    for (const part of payload.parts) {
      if ((part.mimeType === 'text/plain' || part.mimeType === 'text/html') && part.body && part.body.data) {
        try {
          const text = Buffer.from(part.body.data, 'base64').toString('utf-8');
          bodyText += text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
        } catch (e) {
          // Ignore decode errors
        }
      }
      
      if (part.parts) {
        bodyText += extractEmailBody(part);
      }
    }
  }
  
  return bodyText;
}

findMissingBankEmails(); 