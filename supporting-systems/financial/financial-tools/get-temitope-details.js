#!/usr/bin/env node

import { google } from 'googleapis';
import fs from 'fs/promises';

async function getTemitopeBankDetails() {
  console.log('🔍 Getting full details of ProvidusBank May 26th emails...');
  
  try {
    // Load credentials and token
    const credentials = JSON.parse(await fs.readFile('gmail-credentials.json', 'utf8'));
    const token = JSON.parse(await fs.readFile('gmail-token.json', 'utf8'));
    
    const { client_secret, client_id } = credentials.installed;
    const auth = new google.auth.OAuth2(client_id, client_secret);
    auth.setCredentials(token);
    
    const gmail = google.gmail({ version: 'v1', auth });
    
    // Search for ProvidusBank emails on May 26th specifically
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'from:ProvidusBank after:2025/05/26 before:2025/05/27',
      maxResults: 50
    });

    if (!response.data.messages) {
      console.log('❌ No ProvidusBank emails found on May 26th');
      return;
    }

    console.log(`📧 Found ${response.data.messages.length} ProvidusBank emails on May 26th`);
    
    for (const [index, message] of response.data.messages.entries()) {
      console.log(`\n\n📧 Email ${index + 1}:`);
      
      const fullMessage = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'full'
      });
      
      const headers = fullMessage.data.payload?.headers || [];
      const subject = headers.find(h => h.name === 'Subject')?.value || '';
      const from = headers.find(h => h.name === 'From')?.value || '';
      const date = new Date(parseInt(fullMessage.data.internalDate));
      
      console.log(`Subject: ${subject}`);
      console.log(`From: ${from}`);
      console.log(`Date: ${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString('en-GB')}`);
      
      // Extract email body
      let bodyText = extractEmailBody(fullMessage.data.payload);
      
      console.log(`\n📄 Full Email Content:`);
      console.log(bodyText);
      
      // Check if this contains Temitope or ₦250k
      const fullText = `${subject} ${from} ${bodyText}`.toLowerCase();
      
      if (fullText.includes('temitope') || fullText.includes('250')) {
        console.log(`\n🎯 THIS EMAIL CONTAINS TEMITOPE OR ₦250K!`);
        
        // Extract specific details
        const amountMatches = bodyText.match(/amount[:\s]*ngn\s*([0-9,]+(?:\.[0-9]{2})?)/gi);
        const nameMatches = bodyText.match(/name[:\s]*([^,\n]+)/gi);
        const bankMatches = bodyText.match(/bank[:\s]*([^,\n]+)/gi);
        const accountMatches = bodyText.match(/account[:\s]*([0-9]+)/gi);
        
        if (amountMatches) {
          console.log(`💰 Amounts found: ${amountMatches.join(', ')}`);
        }
        
        if (nameMatches) {
          console.log(`👤 Names found: ${nameMatches.join(', ')}`);
        }
        
        if (bankMatches) {
          console.log(`🏦 Banks found: ${bankMatches.join(', ')}`);
        }
        
        if (accountMatches) {
          console.log(`📋 Accounts found: ${accountMatches.join(', ')}`);
        }
      }
      
      console.log(`\n${'='.repeat(80)}`);
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
      bodyText += text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    } catch (e) {
      // Ignore decode errors
    }
  }
  
  if (payload.parts) {
    for (const part of payload.parts) {
      if ((part.mimeType === 'text/plain' || part.mimeType === 'text/html') && part.body && part.body.data) {
        try {
          const text = Buffer.from(part.body.data, 'base64').toString('utf-8');
          bodyText += ' ' + text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        } catch (e) {
          // Ignore decode errors
        }
      }
      
      if (part.parts) {
        bodyText += ' ' + extractEmailBody(part);
      }
    }
  }
  
  return bodyText.trim();
}

getTemitopeBankDetails(); 