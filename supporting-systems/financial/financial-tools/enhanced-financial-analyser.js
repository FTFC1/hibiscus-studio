#!/usr/bin/env node

// Enhanced Financial Email Analyser
// Fixes categorisation issues and extracts specific app names

import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';

// Enhanced app extraction for Apple transactions
function extractAppServiceName(snippet, subject) {
  if (!snippet) return null;
  
  const extractionPatterns = [
    // Specific apps with clear names
    { pattern: /ChatGPT(?:\s+(?:Plus|Pro))?/i, name: 'ChatGPT Plus' },
    { pattern: /Cal\s+AI/i, name: 'Cal AI' },
    { pattern: /YouTube\s+Music/i, name: 'YouTube Music' },
    { pattern: /Bumble.*(?:Premium|Plus)/i, name: 'Bumble Premium' },
    { pattern: /Tinder.*(?:Platinum|Gold|Plus)/i, name: 'Tinder Premium' },
    { pattern: /Otter.*(?:Pro|Premium)/i, name: 'Otter Pro' },
    { pattern: /TickTick.*(?:Premium|Pro)/i, name: 'TickTick Premium' },
    { pattern: /Blinkist.*(?:Pro|Premium)/i, name: 'Blinkist Pro' },
    { pattern: /iCloud\+?/i, name: 'iCloud+' },
    { pattern: /superwhisper\s+pro/i, name: 'SuperWhisper Pro' },
    { pattern: /YapThread.*AI/i, name: 'YapThread AI' },
    { pattern: /AccuWeather.*(?:Premium|Plus)/i, name: 'AccuWeather Premium' },
    { pattern: /Endel.*(?:Focus|Sleep)/i, name: 'Endel' },
    { pattern: /Whisper\s+Memos/i, name: 'Whisper Memos' },
    { pattern: /Scribble.*Whiteboard/i, name: 'Scribble Together' },
  ];
  
  for (const { pattern, name } of extractionPatterns) {
    const match = snippet.match(pattern);
    if (match) {
      return name;
    }
  }
  
  return null;
}

// Fixed internal transfer detection to prevent false positives like the ₦250k issue
const internalTransferPatterns = [
  /folarin[\s-]?coker/i,
  /nicholas.*folarin/i,
  /between.*accounts/i,
  /acc\s*to\s*acc/i,
  /wallet.*transfer/i,
  /opay.*providus.*transfer/i,
  /providus.*opay.*transfer/i,
  // Removed the overly broad "outward.*transfer" pattern that caused the ₦250k categorisation issue
];

// Enhanced transaction categorisation
function categorizeTransaction(email) {
  const subject = email.subject.toLowerCase();
  const from = email.from.toLowerCase();
  const snippet = email.snippet ? email.snippet.toLowerCase() : '';
  const fullText = `${subject} ${from} ${snippet}`;

  // Check for promotional content first (highest priority)
  const promoPatterns = [
    /save\s+£\d+/i,
    /get\s+\d+%\s+off/i,
    /up\s+to\s+\d+%\s+off/i,
    /free\s+delivery/i,
    /limited\s+time/i,
    /shop\s+now/i,
    /click\s+here/i,
    /final\s+call/i
  ];
  
  const isPromo = promoPatterns.some(pattern => pattern.test(fullText));
  if (isPromo) {
    return 'promotional';
  }

  // Apple transactions with app extraction
  if (from.includes('apple.com') || subject.includes('apple')) {
    const appName = extractAppServiceName(email.snippet, email.subject);
    
    if (appName) {
      // Override the subject with the app name for better searchability
      email.enhancedSubject = `${appName} (Apple)`;
      email.appName = appName;
      email.searchableText = `${appName} ${email.subject} ${snippet}`;
    }
    
    if (subject.includes('icloud') || snippet.includes('icloud')) {
      return 'apple_icloud';
    } else if (subject.includes('music') || snippet.includes('youtube music') || snippet.includes('apple music')) {
      return 'apple_music';
    } else if (subject.includes('subscription') || snippet.includes('subscription')) {
      return 'apple_one';
    } else if (snippet.includes('apple tv') || snippet.includes('superwhisper') || snippet.includes('blinkist')) {
      return 'apple_tv';
    } else {
      return 'apple_apps';
    }
  }

  // Banking transactions - but ONLY for actual external payments
  const bankingPatterns = [
    /debit.*alert/i,
    /credit.*alert/i,
    /transaction.*notification/i,
    /payment.*received/i,
    /bank.*statement/i
  ];
  
  const isBankingEmail = bankingPatterns.some(pattern => pattern.test(fullText));
  
  if (isBankingEmail) {
    // CRITICAL FIX: Check if it's actually an internal transfer first
    const isActuallyInternal = internalTransferPatterns.some(pattern => pattern.test(fullText));
    
    if (isActuallyInternal) {
      return 'internal_transfer';
    } else {
      // This is a genuine external payment (like the ₦250k to Temitope)
      return 'banking';
    }
  }

  // Other categories
  if (from.includes('uber') || from.includes('bolt') || subject.includes('trip')) {
    return 'transportation';
  }
  
  if (from.includes('paystack') || from.includes('flutterwave')) {
    return 'payments';
  }
  
  if (from.includes('upwork') || subject.includes('upwork')) {
    return 'freelance';
  }

  return 'other';
}

// Enhanced transaction processing
function processTransaction(email) {
  const category = categorizeTransaction(email);
  
  // Skip promotional emails entirely
  if (category === 'promotional') {
    return null;
  }

  // Extract amounts and currencies
  const amountMatches = email.snippet ? email.snippet.match(/(?:₦|NGN|£|GBP|\$|USD|€|EUR)\s*[\d,]+\.?\d*/gi) || [] : [];
  
  const amounts = [];
  const currencies = [];
  
  amountMatches.forEach(match => {
    const cleanMatch = match.replace(/[,\s]/g, '');
    const currency = cleanMatch.match(/^(₦|NGN|£|GBP|\$|USD|€|EUR)/i);
    const amount = cleanMatch.match(/[\d.]+/);
    
    if (currency && amount) {
      amounts.push(parseFloat(amount[0]));
      currencies.push(currency[0] === 'NGN' ? '₦' : 
                     currency[0] === 'GBP' ? '£' : 
                     currency[0] === 'USD' ? '$' : 
                     currency[0] === 'EUR' ? '€' : currency[0]);
    }
  });

  return {
    id: email.id,
    subject: email.enhancedSubject || email.subject,
    from: email.from,
    date: new Date(parseInt(email.internalDate)).toISOString().split('T')[0],
    timestamp: new Date(parseInt(email.internalDate)).toISOString(),
    amounts,
    currencies,
    category,
    appName: email.appName || null,
    searchableText: email.searchableText || `${email.subject} ${email.from} ${email.snippet}`,
    isSubscription: email.subject.toLowerCase().includes('subscription'),
    transactionIndicators: amounts.length > 0,
    rawSubject: email.subject,
    description: email.snippet || '',
    raw: {
      snippet: email.snippet,
      subject: email.subject,
      from: email.from
    }
  };
}

async function analyzeFinancialEmails() {
  console.log('🔍 Starting enhanced financial email analysis...');
  
  try {
    // Load credentials and token
    const credentials = JSON.parse(await fs.readFile('gmail-credentials.json', 'utf8'));
    const token = JSON.parse(await fs.readFile('gmail-token.json', 'utf8'));
    
    const { client_secret, client_id } = credentials.installed;
    const auth = new google.auth.OAuth2(client_id, client_secret);
    auth.setCredentials(token);
    
    const gmail = google.gmail({ version: 'v1', auth });
    
    // Enhanced search queries to capture more financial emails
    const financialQueries = [
      'from:apple.com after:2024/11/01',
      'from:providusbank.com after:2024/11/01',
      'from:opay.ng after:2024/11/01',
      'from:gtbank.com after:2024/11/01',
      'from:zenithbank.com after:2024/11/01',
      'from:upwork.com after:2024/11/01',
      'from:paystack.co after:2024/11/01',
      'from:flutterwave.com after:2024/11/01',
      'subject:(debit alert) after:2024/11/01',
      'subject:(credit alert) after:2024/11/01',
      'subject:(transaction) after:2024/11/01',
      'subject:(invoice) after:2024/11/01',
      'subject:(receipt) after:2024/11/01',
      'subject:(payment) after:2024/11/01'
    ];
    
    console.log(`📧 Searching with ${financialQueries.length} enhanced queries...`);
    
    const allEmails = [];
    
    for (const query of financialQueries) {
      try {
        console.log(`   Searching: ${query}`);
        const response = await gmail.users.messages.list({
          userId: 'me',
          q: query,
          maxResults: 500
        });
        
        if (response.data.messages) {
          console.log(`   Found ${response.data.messages.length} messages`);
          
          for (const message of response.data.messages) {
            const emailDetails = await gmail.users.messages.get({
              userId: 'me',
              id: message.id,
              format: 'full'
            });
            
            const headers = emailDetails.data.payload.headers;
            const subject = headers.find(h => h.name === 'Subject')?.value || '';
            const from = headers.find(h => h.name === 'From')?.value || '';
            
            allEmails.push({
              id: message.id,
              subject,
              from,
              internalDate: emailDetails.data.internalDate,
              snippet: emailDetails.data.snippet,
              payload: emailDetails.data.payload
            });
          }
        }
      } catch (queryError) {
        console.log(`   ❌ Query failed: ${queryError.message}`);
      }
    }
    
    console.log(`\n📊 Total emails found: ${allEmails.length}`);
    
    // Remove duplicates
    const uniqueEmails = allEmails.filter((email, index) => 
      allEmails.findIndex(e => e.id === email.id) === index
    );
    
    console.log(`📊 Unique emails: ${uniqueEmails.length}`);
    
    // Process and categorise
    const processedTransactions = uniqueEmails
      .map(processTransaction)
      .filter(t => t !== null); // Remove promotional emails
    
    console.log(`💰 Valid transactions: ${processedTransactions.length}`);
    
    // Group by month and category
    const monthlyData = {};
    
    processedTransactions.forEach(transaction => {
      const month = transaction.date.substring(0, 7); // YYYY-MM
      
      if (!monthlyData[month]) {
        monthlyData[month] = {
          month,
          categories: {},
          summary: {
            totalTransactions: 0,
            categoriesCount: 0,
            dateRange: { earliest: transaction.date, latest: transaction.date }
          }
        };
      }
      
      const category = transaction.category;
      if (!monthlyData[month].categories[category]) {
        monthlyData[month].categories[category] = [];
      }
      
      monthlyData[month].categories[category].push(transaction);
      monthlyData[month].summary.totalTransactions++;
      
      // Update date range
      if (transaction.date < monthlyData[month].summary.dateRange.earliest) {
        monthlyData[month].summary.dateRange.earliest = transaction.date;
      }
      if (transaction.date > monthlyData[month].summary.dateRange.latest) {
        monthlyData[month].summary.dateRange.latest = transaction.date;
      }
    });
    
    // Update categories count
    Object.values(monthlyData).forEach(monthData => {
      monthData.summary.categoriesCount = Object.keys(monthData.categories).length;
    });
    
    // Save monthly reports
    await fs.mkdir('financial-reports', { recursive: true });
    
    for (const [month, data] of Object.entries(monthlyData)) {
      const filename = `financial-reports/${month}.json`;
      await fs.writeFile(filename, JSON.stringify(data, null, 2));
      console.log(`📄 Saved ${filename} (${data.summary.totalTransactions} transactions)`);
    }
    
    console.log('\n✅ Enhanced financial analysis complete!');
    console.log('🔹 App names extracted for Apple transactions');
    console.log('🔹 Fixed internal transfer categorisation');
    console.log('🔹 Enhanced search functionality');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the analysis
analyzeFinancialEmails(); 