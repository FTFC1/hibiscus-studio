#!/usr/bin/env node

/**
 * 🔹 Test Gmail Credentials Setup
 * Quick test to verify local Gmail access works
 */

import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';

async function testGmailSetup() {
  console.log('🔹 Testing Gmail API Setup...');
  
  const credentialsPath = path.join(process.cwd(), 'gmail-credentials.json');
  
  try {
    // Read credentials file
    const credentialsContent = await fs.readFile(credentialsPath, 'utf8');
    const credentials = JSON.parse(credentialsContent);
    
    console.log('🔑 Setting up OAuth2 client...');
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    
    // Check if we have a saved token
    const tokenPath = path.join(process.cwd(), 'gmail-token.json');
    try {
      const tokenContent = await fs.readFile(tokenPath, 'utf8');
      const token = JSON.parse(tokenContent);
      oAuth2Client.setCredentials(token);
      console.log('🎯 Using saved token...');
    } catch (tokenError) {
      console.log('🌐 No saved token, need to authenticate...');
      
      // Generate auth URL
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.readonly']
      });
      
      console.log('🔗 Please visit this URL to authenticate:');
      console.log(authUrl);
      console.log('');
      console.log('📋 Copy the code from the URL after authentication and run:');
      console.log('node test-gmail-setup.js <AUTH_CODE>');
      return;
    }
    
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    
    console.log('📧 Testing Gmail access...');
    const response = await gmail.users.getProfile({ userId: 'me' });
    
    console.log('✅ SUCCESS! Gmail connection working');
    console.log(`📊 Email: ${response.data.emailAddress}`);
    console.log(`📈 Total messages: ${response.data.messagesTotal}`);
    console.log(`🎯 Ready to run financial analyser!`);
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    
    // Handle auth code flow
    if (process.argv[2] && error.message.includes('invalid_grant')) {
      try {
        const credentialsContent = await fs.readFile(credentialsPath, 'utf8');
        const credentials = JSON.parse(credentialsContent);
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        
        const { tokens } = await oAuth2Client.getToken(process.argv[2]);
        await fs.writeFile(path.join(process.cwd(), 'gmail-token.json'), JSON.stringify(tokens, null, 2));
        
        console.log('✅ Authentication successful! Token saved.');
        console.log('🔄 Run again: node test-gmail-setup.js');
      } catch (authError) {
        console.error('❌ Auth failed:', authError.message);
      }
    }
  }
}

testGmailSetup(); 