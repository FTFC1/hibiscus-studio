#!/usr/bin/env node

/**
 * 🔹 Simple Gmail Test - Alternative Auth Method
 * Bypasses Google verification issues
 */

import { google } from 'googleapis';
import fs from 'fs/promises';

async function simpleGmailTest() {
  console.log('🔹 Simple Gmail Test...');
  
  try {
    // Try using the credentials directly with a simpler OAuth flow
    const credentials = JSON.parse(await fs.readFile('gmail-credentials.json', 'utf8'));
    const { client_secret, client_id } = credentials.installed;
    
    // Create OAuth2 client with minimal setup
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      'urn:ietf:wg:oauth:2.0:oob'  // Use OOB flow instead
    );
    
    // If auth code provided
    if (process.argv[2]) {
      console.log('🔑 Processing authorization code...');
      const authCode = process.argv[2].trim();
      
      try {
        console.log('🔄 Exchanging code for tokens...');
        const { tokens } = await oAuth2Client.getToken(authCode);
        
        console.log('💾 Saving authentication token...');
        await fs.writeFile('gmail-token.json', JSON.stringify(tokens, null, 2));
        
        // Test Gmail access
        console.log('📧 Testing Gmail access...');
        oAuth2Client.setCredentials(tokens);
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        
        const profile = await gmail.users.getProfile({ userId: 'me' });
        console.log('✅ SUCCESS! Gmail working!');
        console.log(`📧 Email: ${profile.data.emailAddress}`);
        console.log(`📊 Messages: ${profile.data.messagesTotal}`);
        
        // Quick financial test
        console.log('\n🔍 Quick financial search test...');
        const messages = await gmail.users.messages.list({
          userId: 'me',
          q: 'OpenAI OR Apple OR invoice',
          maxResults: 5
        });
        
        console.log(`💰 Found ${messages.data.messages?.length || 0} financial emails`);
        console.log('🎯 Ready for full financial analysis!');
        console.log('\n▶️  Run: node local-financial-analyser.js');
        
        return;
      } catch (tokenError) {
        console.error('❌ Token exchange failed:', tokenError.message);
        console.log('💡 The authorization code might have expired or been used already');
        console.log('🔄 Generate a new code from the URL below:');
      }
    }
    
    // Generate auth URL
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.readonly'],
      response_type: 'code'
    });
    
    console.log('🔗 Alternative Auth Method:');
    console.log('1. Visit this URL:');
    console.log(authUrl);
    console.log('');
    console.log('2. Grant permission');
    console.log('3. Copy the FULL CODE (not just the short one)');
    console.log('4. Run: node simple-gmail-test.js "<FULL_CODE>"');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

simpleGmailTest(); 