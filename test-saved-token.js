#!/usr/bin/env node

/**
 * 🔹 Test Saved Gmail Token
 * Use existing saved token to test Gmail access
 */

import { google } from 'googleapis';
import fs from 'fs/promises';

async function testSavedToken() {
  console.log('🔹 Testing Saved Gmail Token...');
  
  try {
    // Load credentials and token
    const credentials = JSON.parse(await fs.readFile('gmail-credentials.json', 'utf8'));
    const token = JSON.parse(await fs.readFile('gmail-token.json', 'utf8'));
    
    const { client_secret, client_id } = credentials.installed;
    
    // Create OAuth2 client and set credentials
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);
    oAuth2Client.setCredentials(token);
    
    console.log('📧 Testing Gmail API access...');
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    
    // Test basic access
    const profile = await gmail.users.getProfile({ userId: 'me' });
    console.log('✅ SUCCESS! Gmail API working!');
    console.log(`📧 Email: ${profile.data.emailAddress}`);
    console.log(`📊 Total messages: ${profile.data.messagesTotal}`);
    
    // Test financial search
    console.log('\n🔍 Testing financial email search...');
    const messages = await gmail.users.messages.list({
      userId: 'me',
      q: 'OpenAI OR Apple OR invoice OR billing',
      maxResults: 10
    });
    
    console.log(`💰 Found ${messages.data.messages?.length || 0} financial emails`);
    
    if (messages.data.messages && messages.data.messages.length > 0) {
      console.log('\n📋 Sample financial emails:');
      for (let i = 0; i < Math.min(3, messages.data.messages.length); i++) {
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: messages.data.messages[i].id,
          format: 'metadata'
        });
        
        const subject = msg.data.payload?.headers?.find(h => h.name === 'Subject')?.value || 'No subject';
        const from = msg.data.payload?.headers?.find(h => h.name === 'From')?.value || 'Unknown sender';
        console.log(`  • ${subject} (from: ${from})`);
      }
    }
    
    console.log('\n🎯 READY FOR FULL FINANCIAL ANALYSIS!');
    console.log('▶️  Run: node local-financial-analyser.js');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('Gmail API has not been used')) {
      console.log('💡 Enable Gmail API at: https://console.developers.google.com/apis/api/gmail.googleapis.com/overview?project=504012273418');
    }
  }
}

testSavedToken(); 