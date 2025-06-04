#!/usr/bin/env node

import { google } from 'googleapis';
import fs from 'fs/promises';

async function fixAppleSearch() {
  console.log('🔹 Testing corrected Apple searches...');
  
  const credentials = JSON.parse(await fs.readFile('gmail-credentials.json', 'utf8'));
  const token = JSON.parse(await fs.readFile('gmail-token.json', 'utf8'));
  
  const { client_secret, client_id } = credentials.installed;
  const auth = new google.auth.OAuth2(client_id, client_secret);
  auth.setCredentials(token);
  
  const gmail = google.gmail({ version: 'v1', auth });
  
  const testQueries = [
    { name: 'Original broken query', query: 'Apple OR Tinder OR Spotify OR Netflix OR "YouTube Music" OR iCloud' },
    { name: 'Apple from field', query: 'from:apple' },
    { name: 'Apple subject', query: 'subject:apple' },
    { name: 'Apple invoice', query: 'apple invoice' },
    { name: 'From Apple domain', query: 'from:apple.com' },
    { name: 'Netflix from field', query: 'from:netflix' },
    { name: 'Spotify from field', query: 'from:spotify' }
  ];
  
  for (const test of testQueries) {
    console.log(`\n🔍 Testing: ${test.name}`);
    console.log(`   Query: "${test.query}"`);
    
    try {
      const response = await gmail.users.messages.list({
        userId: 'me',
        q: test.query,
        maxResults: 3
      });
      
      if (response.data.messages) {
        console.log(`   ✅ Found ${response.data.messages.length} emails`);
        
        // Show first email
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: response.data.messages[0].id,
          format: 'metadata',
          metadataHeaders: ['Subject', 'Date', 'From']
        });
        
        const headers = msg.data.payload.headers;
        const subject = headers.find(h => h.name === 'Subject')?.value;
        const from = headers.find(h => h.name === 'From')?.value;
        const date = headers.find(h => h.name === 'Date')?.value;
        
        console.log(`   First: "${subject}" from ${from?.substring(0, 40)}`);
        
      } else {
        console.log(`   ❌ No emails found`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
}

fixAppleSearch().catch(console.error); 