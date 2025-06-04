#!/usr/bin/env node

/**
 * 🔹 Local Financial Analyser
 * Secure, local-only financial data processing
 * No MCP, no external servers, your data stays private
 */

import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import fs from 'fs/promises';
import path from 'path';

class LocalFinancialAnalyser {
  constructor() {
    this.auth = null;
    this.gmailService = null;
    this.transactions = [];
    this.categories = {
      'ai_tools': ['openai', 'claude', 'gemini', 'replit', 'github'],
      'apple_icloud': ['icloud', 'icloud storage'],
      'apple_music': ['apple music', 'music'],
      'apple_apps': ['app store', 'apps'],
      'apple_tv': ['apple tv', 'tv'],
      'apple_one': ['apple one'],
      'apple_developer': ['developer program'],
      'apple_other': ['apple'],
      'dating': ['tinder', 'bumble', 'hinge'],
      'transport': ['bolt', 'uber', 'taxi'],
      'food': ['spar', 'grubbers', 'restaurant'],
      'banking': ['providus', 'zenith', 'hsbc'],
      'entertainment': ['netflix', 'spotify', 'youtube'],
      'personal_services': ['laundry', 'cleaning', 'iorsuwe'],
      'personal_payments': ['bamidele oluwatayo orefuwa', 'personal transfer'],
      'internal_transfer': ['folarin-coker nicholas', 'transfer to yourself', 'your account']
    };
    
    // Pattern to detect internal transfers vs actual spending
    this.internalTransferPatterns = [
      // Self transfers - your surname variations (MUST be specific)
      /folarin-coker/i,
      /folarin.*coker/i,
      /coker.*folarin/i,
      /nicholas.*folarin/i,
      /folarin.*nicholas/i,
      /nicholas.*coker/i,
      /coker.*nicholas/i,
      // ONLY very specific internal transfer language
      /transfer.*to.*yourself/i,
      /transfer.*to.*your.*account/i,
      /transfer.*to.*own.*account/i,
      /wallet.*funding.*from.*your.*bank/i,
      /account.*funding.*from.*your.*bank/i,
      // Balance updates without recipient names (but be very specific)
      /balance.*after.*transfer.*₦.*your.*account.*balance.*is.*now/i,
      /wallet.*funded.*successfully.*new.*balance/i
    ];
    
    // People/services that are actual expenses
    this.expensePatterns = [
      // Known expense recipients
      /bamidele.*oluwatayo.*orefuwa/i,  // person payments
      /iorsuwe.*terkimbi/i,  // laundry
      /grubbers.*food/i,     // lunch
      /agu.*jacinta/i,       // coffee
      /spar.*adeola/i,       // lunch
      // Service types
      /laundry/i,
      /food.*service/i,
      /restaurant/i,
      /cafe/i,
      /coffee/i
    ];
  }

  async initialize() {
    console.log('🔹 Initializing Local Financial Analyser...');
    
    try {
      // Load credentials and token files
      const credentials = JSON.parse(await fs.readFile('gmail-credentials.json', 'utf8'));
      const token = JSON.parse(await fs.readFile('gmail-token.json', 'utf8'));
      
      const { client_secret, client_id } = credentials.installed;
      
      // Create OAuth2 client and set credentials
      this.auth = new google.auth.OAuth2(client_id, client_secret);
      this.auth.setCredentials(token);
      
      this.gmailService = google.gmail({ version: 'v1', auth: this.auth });
      console.log('✅ Gmail connection established');
    } catch (error) {
      console.error('❌ Gmail auth failed:', error.message);
      throw error;
    }
  }

  async searchFinancialEmails(query, maxResults = 50) {
    console.log(`🔍 Searching for: "${query}"`);
    
    try {
      const response = await this.gmailService.users.messages.list({
        userId: 'me',
        q: query,
        maxResults
      });

      if (!response.data.messages) {
        console.log('No messages found');
        return [];
      }

      console.log(`📧 Found ${response.data.messages.length} emails for query: "${query}"`);
      
      const messages = [];
      let filtered = 0;
      let parsed = 0;
      
      for (const message of response.data.messages) {
        const fullMessage = await this.gmailService.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'full'
        });
        
        const result = this.parseFinancialEmail(fullMessage.data);
        if (result === null) {
          filtered++;
        } else {
          parsed++;
          messages.push(result);
        }
      }
      
      console.log(`✅ Query "${query}": ${parsed} parsed, ${filtered} filtered out`);
      return messages;
    } catch (error) {
      console.error(`❌ Search failed for "${query}":`, error.message);
      return [];
    }
  }

  // Extract text from email body
  extractEmailBody(payload) {
    let bodyText = '';
    
    if (payload.body && payload.body.data) {
      try {
        const text = Buffer.from(payload.body.data, 'base64').toString('utf-8');
        // Simple HTML tag removal for basic parsing
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
            // Simple HTML tag removal for basic parsing
            bodyText += text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
          } catch (e) {
            // Ignore decode errors
          }
        }
        
        // Recursively check nested parts
        if (part.parts) {
          bodyText += this.extractEmailBody(part);
        }
      }
    }
    
    return bodyText;
  }

  parseFinancialEmail(message) {
    const headers = message.payload?.headers || [];
    const subject = headers.find(h => h.name === 'Subject')?.value || '';
    const from = headers.find(h => h.name === 'From')?.value || '';
    const date = new Date(parseInt(message.internalDate));

    // CRITICAL: Filter failed/unsuccessful payments first
    const failedPaymentPatterns = [
      /unsuccessful|failed|declined|rejected|error|cancelled/i,
      /payment.*unsuccessful|payment.*failed|transaction.*failed/i,
      /could not.*process|unable to.*charge|card.*declined/i,
      /insufficient.*funds|expired.*card|invalid.*card/i
    ];

    const isFailedPayment = failedPaymentPatterns.some(pattern => 
      pattern.test(subject) || pattern.test(from)
    );

    if (isFailedPayment) {
      console.log(`🚫 Filtered (failed payment): "${subject}"`);
      return null;
    }

    // CRITICAL: Filter account statements (not actual spending)
    const accountStatementPatterns = [
      /statement.*of.*account/i,
      /account.*statement/i,
      /balance.*inquiry/i,
      /account.*balance/i,
      /monthly.*statement/i,
      /transaction.*history/i
    ];

    const isAccountStatement = accountStatementPatterns.some(pattern => 
      pattern.test(subject) || pattern.test(from)
    );

    if (isAccountStatement) {
      console.log(`🚫 Filtered (account statement): "${subject}"`);
      return null;
    }

    // Enhanced promotional vs receipt detection
    const promotionalPatterns = [
      // Generic promotional language - STRENGTHENED
      /get \d+%.*off|save \d+%|discount|promo|offer|deal|sale/i,
      /enjoy.*off|special.*offer|limited.*time|coupon|voucher/i,
      // Food delivery promotional patterns - ENHANCED
      /\d+%.*off.*your.*next.*\d+.*orders/i,
      /get.*\d+%.*off.*next.*orders/i,
      /enjoy.*\d+%.*off.*next.*orders/i,
      /save.*on.*your.*next.*\d+.*orders/i,
      /save.*£\d+.*on.*your.*grocery.*order/i,
      /save.*\$\d+.*on.*your.*order/i,
      /save.*€\d+.*on.*your.*order/i,
      /\d+%.*off.*next.*\d+.*orders/i,
      // CRITICAL: Catch specific patterns still getting through
      /get.*\d+%.*off.*your.*next.*\d+.*orders/i,
      /enjoy.*\d+%.*off.*your.*next.*\d+.*orders/i,
      /save.*\d+%.*off.*your.*next.*\d+.*orders/i,
      // ANY percentage off pattern
      /\d+%.*off/i,
      /off.*\d+%/i,
      // Specific grocery/food promotional patterns
      /save.*£\d+.*on.*grocery/i,
      /grocery.*order.*🛒/i,
      /🛒.*grocery/i,
      /get.*\d+%.*off.*your.*next.*\d+.*orders/i,
      // Promotional messaging
      /free.*delivery|delivery.*free/i,
      /new.*customer.*offer|first.*order.*free/i,
      // Email marketing
      /newsletter|digest|update|announcement|campaign/i,
      /unsubscribe|click.*here|view.*online|browser/i,
      // News and content
      /sifted\.eu|techcrunch|bloomberg|reuters|every\.to|maven/i,
      /course|lesson|educational|training|webinar/i,
      // Market/business data (not personal transactions)
      /revenue.*£\d+|market.*\$\d+|valuation.*€\d+/i,
      /funding.*\$\d+|raised.*£\d+|investment.*€\d+/i,
      // PayPal business announcements and introductions
      /introducing.*paypal|paypal.*introduces|new.*paypal.*feature/i,
      /paypal.*platform|paypal.*business.*solution|paypal.*open/i,
      /discover.*paypal|explore.*paypal|learn.*about.*paypal/i,
      /one.*platform.*for.*all.*bus/i,
      // General business platform announcements
      /introducing.*platform|new.*platform|one.*platform.*for/i,
      /business.*solution|enterprise.*solution|platform.*for.*business/i
    ];

    // Extract email body for deeper analysis
    const bodyText = this.extractEmailBody(message.payload);
    const fullText = subject + ' ' + bodyText;

    // Check if this is promotional content
    const isPromotional = promotionalPatterns.some(pattern => 
      pattern.test(subject) || pattern.test(from) || pattern.test(bodyText)
    );

    // Strong indicators this is an actual receipt/invoice (not promotional)
    const receiptIndicators = [
      /invoice|receipt|payment.*confirmation|order.*confirmation/i,
      /charged|billed|paid|transaction.*complete/i,
      /your.*order|order.*total|amount.*due|balance.*due/i,
      /subscription.*renewed|subscription.*started/i,
      /thank.*you.*for.*your.*payment|payment.*received/i
    ];

    const hasReceiptIndicators = receiptIndicators.some(pattern => 
      pattern.test(subject) || pattern.test(bodyText)
    );

    // If promotional but no receipt indicators, filter it out
    if (isPromotional && !hasReceiptIndicators) {
      // Only log important filtered promotional items
      if (/apple|netflix|spotify|openai|claude|uber|bolt/i.test(subject)) {
        console.log(`🚫 Filtered (promotional): "${subject}" from ${from}`);
      }
      return null;
    }

    // Enhanced news/promotional filtering - exclude Bolt receipts
    const newsPatterns = [
      // News and financial content
      /sifted\.eu|techcrunch|bloomberg|reuters|every\.to|maven/i,
      // Educational content  
      /course|lesson|educational|training|webinar/i,
      // Bolt notification emails (NOT the actual payments)
      /your bolt trip|bolt.*trip.*receipt|trip.*completed/i,
      // Generic notifications without payment context
      /notification|reminder|alert|update/i
    ];

    // Check if this is news/promotional content (secondary filter)
    const isNonFinancial = newsPatterns.some(filter => 
      filter.test(subject) || filter.test(from)
    );

    if (isNonFinancial && !hasReceiptIndicators) {
      // Only log important filtered items
      if (/apple|netflix|spotify|openai|claude/i.test(subject)) {
        console.log(`🚫 Filtered (news/non-financial): "${subject}" from ${from}`);
      }
      return null; // Skip non-financial content
    }

    // Enhanced financial patterns with currency preservation - FIXED for duplicates
    const patterns = {
      // More precise patterns to avoid duplicates
      nigerianAmount: /₦\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\b/g,
      // ZENITH BANK FORMAT: NGN130,000.00 (without ₦ symbol)
      zenithAmount: /NGN\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\b/g,
      dollarAmount: /\$\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\b/g,
      euroAmount: /€\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\b/g,
      poundAmount: /£\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\b/g,
      // Strong transaction indicators
      strongTransaction: /payment|charged|bill|invoice|receipt|refund|transfer|subscription|purchase|order|total/i,
      // Financial institutions/services
      financialSource: /bank|opay|providus|zenith|hsbc|apple.*invoice|paypal|stripe|lemon.*squeezy/i
    };

    let amounts = [];
    let currencies = [];
    let match;
    
    // Extract amounts with specific currency patterns to avoid duplicates
    while ((match = patterns.nigerianAmount.exec(fullText)) !== null) {
      amounts.push(parseFloat(match[1].replace(/,/g, '')));
      currencies.push('₦');
    }
    
    patterns.nigerianAmount.lastIndex = 0;
    
    // Extract Zenith NGN amounts (without ₦ symbol)
    while ((match = patterns.zenithAmount.exec(fullText)) !== null) {
      amounts.push(parseFloat(match[1].replace(/,/g, '')));
      currencies.push('₦'); // Treat as Nigerian Naira
    }
    
    patterns.zenithAmount.lastIndex = 0;
    
    while ((match = patterns.dollarAmount.exec(fullText)) !== null) {
      amounts.push(parseFloat(match[1].replace(/,/g, '')));
      currencies.push('$');
    }
    
    patterns.dollarAmount.lastIndex = 0;
    
    while ((match = patterns.euroAmount.exec(fullText)) !== null) {
      amounts.push(parseFloat(match[1].replace(/,/g, '')));
      currencies.push('€');
    }
    
    patterns.euroAmount.lastIndex = 0;
    
    while ((match = patterns.poundAmount.exec(fullText)) !== null) {
      amounts.push(parseFloat(match[1].replace(/,/g, '')));
      currencies.push('£');
    }
    
    patterns.poundAmount.lastIndex = 0;
    
    // CRITICAL: Deduplicate identical amounts immediately
    const uniqueAmounts = [];
    const seenAmounts = new Set();
    
    for (let i = 0; i < amounts.length; i++) {
      const amount = amounts[i];
      const currency = currencies[i];
      const key = `${amount}_${currency}`;
      
      if (!seenAmounts.has(key) && amount > 0 && amount < 500000) {
        seenAmounts.add(key);
        uniqueAmounts.push({ amount, currency });
      }
    }

    // Strong filtering - only accept if:
    const hasStrongTransactionIndicators = patterns.strongTransaction.test(subject) || 
                                         patterns.strongTransaction.test(from) ||
                                         patterns.financialSource.test(from);
    
    const hasReasonableAmounts = uniqueAmounts.length > 0 && 
                                uniqueAmounts.some(a => a.amount > 0 && a.amount < 500000); // Raised upper limit, lower minimum

    // Must have BOTH strong indicators AND reasonable amounts
    if (!hasStrongTransactionIndicators || !hasReasonableAmounts) {
      // Only log important filtered items
      if (/apple|netflix|spotify|openai|claude|supabase|github/i.test(subject)) {
        console.log(`🚫 Filtered (weak): "${subject}" - indicators: ${hasStrongTransactionIndicators}, amounts: ${hasReasonableAmounts} [${uniqueAmounts.map(a => `${a.amount} ${a.currency}`).join(', ')}]`);
      }
      return null;
    }

    // Filter amounts and preserve currency info
    const validTransactions = uniqueAmounts
      .map((amount, i) => ({
        amount: amount.amount,
        currency: amount.currency,
        originalCurrency: amount.currency
      }))
      .filter(t => t.amount > 0 && t.amount < 500000) // Allow smaller subscriptions
      .slice(0, 3); // Max 3 amounts per transaction

    if (validTransactions.length === 0) {
      return null;
    }

    // Extract banking transfer details for better descriptions
    let enhancedSubject = subject;
    if (/transfer.*successful|debit.*alert|transaction.*successful/i.test(subject)) {
      // Extract bank names and direction
      if (/opay/i.test(fullText) && /providus/i.test(fullText)) {
        enhancedSubject = "OPay ↔ Providus Transfer";
      } else if (/zenith/i.test(fullText) && /opay/i.test(fullText)) {
        enhancedSubject = "Zenith → OPay Transfer";
      } else if (/opay/i.test(fullText)) {
        enhancedSubject = "OPay Transaction";
      } else if (/providus/i.test(fullText)) {
        enhancedSubject = "Providus Transaction";
      } else if (/zenith/i.test(fullText) || /ebusinessgroup/i.test(from)) {
        enhancedSubject = "Zenith Bank Transaction";
      }
    }
    
    // Handle Zenith bank transaction alerts specifically
    if (/zenith.*bank.*transaction.*alert/i.test(subject)) {
      enhancedSubject = "Zenith Bank Debit Alert";
    }

    // Get category and filter out null results
    const category = this.categoriseTransaction(fullText, message.internalDate);
    if (category === null) {
      console.log(`🚫 Filtered (null category): "${subject}"`);
      return null;
    }

    return {
      id: message.id,
      date: date.toISOString().split('T')[0],
      timestamp: date,
      subject: enhancedSubject,
      from,
      amounts: validTransactions.map(t => t.amount.toString()),
      currencies: validTransactions.map(t => t.currency),
      originalAmountsWithCurrency: validTransactions,
      category,
      isSubscription: patterns.strongTransaction.test(subject) && /subscription|recurring|monthly|annual/i.test(subject),
      raw: message
    };
  }

  categoriseTransaction(text, timestamp) {
    const lowercaseText = text.toLowerCase();
    
    // PRIORITY 1: AI tools (must be BEFORE transport to catch Wispr Flow receipts)
    if (/wispr.*flow.*receipt|wispr.*flow.*#|receipt.*from.*wispr/i.test(text)) {
      return 'ai_tools';
    }
    if (/openai|claude|replit|github.*copilot/i.test(text)) {
      return 'ai_tools';
    }
    
    // PRIORITY 2: Transport (Uber/Bolt) - check AFTER AI tools
    if (/uber|bolt|taxi|ride|trip/i.test(text)) {
      return 'transport';
    }
    
    // PRIORITY 3: PayPal promotional content - filter completely
    if (/paypal/i.test(text) && /business|open|platform|introducing|one.*platform/i.test(text)) {
      return null; // This should be filtered out, not categorized
    }
    
    // Enhanced Apple service categorization
    if (/apple.*invoice|invoice.*apple|subscription.*apple/i.test(text)) {
      // Break down Apple services by specific indicators
      if (/icloud/i.test(text)) {
        return 'apple_icloud';
      }
      if (/apple.*music|music.*apple/i.test(text)) {
        return 'apple_music';
      }
      if (/app.*store|store.*purchase/i.test(text)) {
        return 'apple_apps';
      }
      if (/apple.*tv|tv.*apple/i.test(text)) {
        return 'apple_tv';
      }
      if (/apple.*one|one.*apple/i.test(text)) {
        return 'apple_one';
      }
      if (/developer.*program|apple.*developer/i.test(text)) {
        return 'apple_developer';
      }
      // Default Apple category if can't determine specific service
      return 'apple_other';
    }
    
    // ALL BANK TRANSFERS GO TO BANKING CATEGORY
    const bankTransferIndicators = [
      /transfer.*successful/i,
      /transfer.*details/i,
      /debit.*alert/i,
      /transaction.*successful/i,
      /payment.*successful/i,
      /opay|providus|zenith|hsbc/i,
      /wallet.*funded/i,
      /account.*funded/i,
      // Zenith specific patterns
      /zenith.*bank.*transaction.*alert/i,
      /ebusinessgroup/i,
      /transaction.*alert.*debit/i
    ];
    
    if (bankTransferIndicators.some(pattern => pattern.test(lowercaseText))) {
      // Look specifically for recipient information in transfer details
      // Pattern: "Name: RECIPIENT NAME" or "To: RECIPIENT NAME"
      const recipientMatch = lowercaseText.match(/(?:name:|to:)\s*([^,\n]+)/i);
      
      if (recipientMatch) {
        const recipientName = recipientMatch[1].trim();
        // If recipient contains your surname, it's internal
        const isInternalRecipient = /folarin-coker/i.test(recipientName);
        
        if (isInternalRecipient) {
          return 'internal_transfer';
        } else {
          // Recipient is someone else - real banking expense
          return 'banking';
        }
      }
      
      // Fallback: Check for general internal transfer patterns
      const isInternalTransfer = this.internalTransferPatterns.some(pattern => 
        pattern.test(lowercaseText)
      );
      
      if (isInternalTransfer) {
        return 'internal_transfer';
      }
      
      // Default: assume external payment if no clear recipient info
      return 'banking';
    }
    
    // Then check if this is an internal transfer (moving your own money)
    const isInternalTransfer = this.internalTransferPatterns.some(pattern => 
      pattern.test(lowercaseText)
    );
    
    if (isInternalTransfer) {
      return 'internal_transfer';
    }
    
    // Default category matching for other transactions
    for (const [category, keywords] of Object.entries(this.categories)) {
      if (category === 'internal_transfer' || category === 'banking') continue; // Skip these as we handled them above
      
      if (keywords.some(keyword => lowercaseText.includes(keyword))) {
        return category;
      }
    }
    
    return 'other';
  }

  async analyseAllFinancialData() {
    console.log('🔹 Starting FAST financial analysis...');
    
    // MUCH FASTER: Use broader queries instead of month-by-month
    const fastSearchQueries = [
      // Single comprehensive query per service (much faster than date ranges)
      'from:apple after:2024/11/01',
      'from:netflix OR from:spotify after:2024/11/01', 
      'from:openai OR from:claude after:2024/11/01',
      'from:paypal OR from:stripe OR from:lemonsqueezy after:2024/11/01',
      // ENHANCED BANK QUERIES - Capture ALL bank notifications
      'from:opay OR from:providus OR from:zenith after:2024/11/01',
      'from:ebusinessgroup OR subject:(zenith bank transaction alert) after:2024/11/01',
      '(opay AND (transaction OR transfer OR debit OR payment)) after:2024/11/01',
      '(zenith AND (transaction OR transfer OR debit OR payment)) after:2024/11/01',
      '(providus AND (transaction OR transfer OR debit OR payment)) after:2024/11/01',
      'subject:(debit alert) after:2024/11/01',
      'subject:(transfer successful) after:2024/11/01',
      'subject:(₦) after:2024/11/01',
      // Digital services
      'from:vercel OR from:replit OR from:github after:2024/11/01',
      'from:bolt OR from:uber OR from:tinder after:2024/11/01',
      'invoice OR receipt OR billing after:2024/11/01',
      'subscription OR recurring after:2024/11/01'
    ];

    this.transactions = [];
    
    console.log(`🚀 Running ${fastSearchQueries.length} optimised queries (including enhanced bank patterns)...`);
    
    // SPEED: Process queries in parallel and remove rate limiting
    const searchPromises = fastSearchQueries.map(async (query, index) => {
      console.log(`⚡ Query ${index + 1}/${fastSearchQueries.length}: ${query}`);
      const results = await this.searchFinancialEmails(query, 100); // Increased limit
      return results;
    });
    
    // Execute all searches simultaneously 
    const allResults = await Promise.all(searchPromises);
    
    // Flatten results
    for (const results of allResults) {
      this.transactions.push(...results);
    }

    // Remove duplicates
    const uniqueTransactions = this.transactions.filter((transaction, index, self) =>
      index === self.findIndex(t => t.id === transaction.id)
    );

    this.transactions = uniqueTransactions.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    console.log(`✅ Found ${this.transactions.length} financial transactions across all periods`);
    return this.transactions;
  }

  generateMonthlyReport(month, year) {
    const monthTransactions = this.transactions.filter(t => {
      const transactionDate = new Date(t.timestamp);
      return transactionDate.getMonth() === month && 
             transactionDate.getFullYear() === year;
    });

    const categoryTotals = {};
    const subscriptions = [];
    
    monthTransactions.forEach(transaction => {
      if (!categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] = [];
      }
      categoryTotals[transaction.category].push(transaction);
      
      if (transaction.isSubscription) {
        subscriptions.push(transaction);
      }
    });

    return {
      month: new Date(year, month).toLocaleDateString('en-GB', { 
        month: 'long', 
        year: 'numeric' 
      }),
      totalTransactions: monthTransactions.length,
      categories: categoryTotals,
      subscriptions,
      transactions: monthTransactions
    };
  }

  async saveReport(report, filename) {
    const reportPath = path.join(process.cwd(), 'financial-reports', filename);
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 Report saved: ${reportPath}`);
  }

  async generateDashboard() {
    // Auto-run the interactive dashboard builder
    console.log('🔹 Building interactive dashboard...');
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execPromise = promisify(exec);
    
    try {
      await execPromise('node build-dashboard.js');
      console.log('✅ Interactive dashboard built successfully');
    } catch (error) {
      console.error('❌ Dashboard build failed:', error.message);
    }
  }
}

// CLI Interface
async function main() {
  const analyser = new LocalFinancialAnalyser();
  
  try {
    await analyser.initialize();
    await analyser.analyseAllFinancialData();
    
    // Generate reports for recent months
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    for (let i = 0; i < 6; i++) {
      const month = (currentMonth - i + 12) % 12;
      const year = month > currentMonth ? currentYear - 1 : currentYear;
      
      const report = analyser.generateMonthlyReport(month, year);
      await analyser.saveReport(report, `${year}-${String(month + 1).padStart(2, '0')}.json`);
    }
    
    await analyser.generateDashboard();
    console.log('✅ Financial analysis complete!');
    
  } catch (error) {
    console.error('❌ Analysis failed:', error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default LocalFinancialAnalyser; 