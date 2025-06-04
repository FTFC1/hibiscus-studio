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
      'apple': ['apple', 'icloud', 'app store'],
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
      // Self transfers
      /folarin-coker nicholas/i,
      /nicholas.*folarin/i,
      // Transfer between your own accounts
      /transfer.*to.*opay/i,
      /transfer.*to.*providus/i,
      /transfer.*from.*zenith.*to.*opay/i,
      /transfer.*from.*providus.*to.*opay/i,
      /account.*to.*account/i,
      // Internal transfers (no recipient name, just balance updates)
      /transfer.*successful.*your.*balance/i,
      /wallet.*funded.*from.*bank/i,
      /account.*funded.*from.*providus/i,
      // Common internal transfer indicators
      /wallet.*funding/i,
      /account.*funding/i,
      /top.*up/i
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

    // Enhanced promotional vs receipt detection
    const promotionalPatterns = [
      // Generic promotional language
      /get \d+%.*off|save \d+%|discount|promo|offer|deal|sale/i,
      /enjoy.*off|special.*offer|limited.*time|coupon|voucher/i,
      // Email marketing
      /newsletter|digest|update|announcement|campaign/i,
      /unsubscribe|click.*here|view.*online|browser/i,
      // News and content
      /sifted\.eu|techcrunch|bloomberg|reuters|every\.to|maven/i,
      /course|lesson|educational|training|webinar/i,
      // Market/business data (not personal transactions)
      /revenue.*£\d+|market.*\$\d+|valuation.*€\d+/i,
      /funding.*\$\d+|raised.*£\d+|investment.*€\d+/i,
      // Promotional with no actual payment context
      /\d+%.*off.*next.*\d+.*orders/i,
      /save.*on.*next.*purchase/i
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
      
      if (!seenAmounts.has(key) && amount > 0 && amount < 100000) {
        seenAmounts.add(key);
        uniqueAmounts.push({ amount, currency });
      }
    }

    // Strong filtering - only accept if:
    const hasStrongTransactionIndicators = patterns.strongTransaction.test(subject) || 
                                         patterns.strongTransaction.test(from) ||
                                         patterns.financialSource.test(from);
    
    const hasReasonableAmounts = uniqueAmounts.length > 0 && 
                                uniqueAmounts.some(a => a.amount > 0 && a.amount < 100000); // Raised upper limit, lower minimum

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
      .filter(t => t.amount > 0 && t.amount < 100000) // Allow smaller subscriptions
      .slice(0, 3); // Max 3 amounts per transaction

    if (validTransactions.length === 0) {
      return null;
    }

    return {
      id: message.id,
      date: date.toISOString().split('T')[0],
      timestamp: date,
      subject,
      from,
      amounts: validTransactions.map(t => t.amount.toString()),
      currencies: validTransactions.map(t => t.currency),
      originalAmountsWithCurrency: validTransactions,
      category: this.categoriseTransaction(fullText, message.internalDate),
      isSubscription: patterns.strongTransaction.test(subject) && /subscription|recurring|monthly|annual/i.test(subject),
      raw: message
    };
  }

  categoriseTransaction(text, timestamp) {
    const lowercaseText = text.toLowerCase();
    
    // First check for specific service categories before internal transfers
    if (/apple.*invoice|invoice.*apple/i.test(text)) {
      return 'apple';
    }
    
    if (/wispr.*flow|wispr/i.test(text)) {
      return 'ai_tools';
    }
    
    if (/paypal/i.test(text) && /business|open|platform/i.test(text)) {
      return 'other'; // PayPal business emails, not transactions
    }
    
    // Then check if this is an internal transfer (moving your own money)
    const isInternalTransfer = this.internalTransferPatterns.some(pattern => 
      pattern.test(lowercaseText)
    );
    
    // However, if it's an OPay transfer with a specific recipient name, it's an expense
    const hasRecipientName = /transfer.*details.*name:.*[a-z]/i.test(text) ||
                            /bamidele.*oluwatayo.*orefuwa/i.test(text);
    
    if (isInternalTransfer && !hasRecipientName) {
      return 'internal_transfer';
    }
    
    // Check for transport driver payments (time-based + amount)
    const timeDate = new Date(parseInt(timestamp));
    const hour = timeDate.getHours();
    const isTransportTime = (hour < 10) || (hour >= 18); // Before 10am or after 6pm
    
    const hasSmallAmount = text.match(/₦(\d+)/);
    const isSmallTransportAmount = hasSmallAmount && parseInt(hasSmallAmount[1]) < 20000;
    
    if (isTransportTime && isSmallTransportAmount && hasRecipientName) {
      return 'transport'; // Uber/Bolt driver payments
    }
    
    // Check if it's a known expense (real spending)
    const isKnownExpense = this.expensePatterns.some(pattern => 
      pattern.test(lowercaseText)
    );
    
    if (isKnownExpense) {
      // Further categorise known expenses
      if (/iorsuwe.*terkimbi|laundry/i.test(lowercaseText)) return 'personal_services';
      if (/bamidele.*oluwatayo.*orefuwa/i.test(lowercaseText)) return 'transport'; // This is now transport
      if (/grubbers.*food|spar.*adeola|restaurant|food.*service/i.test(lowercaseText)) return 'food';
      if (/agu.*jacinta|coffee|cafe/i.test(lowercaseText)) return 'food';
    }
    
    // Default category matching for other transactions
    for (const [category, keywords] of Object.entries(this.categories)) {
      if (category === 'internal_transfer') continue; // Skip this as we handled it above
      
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
      'from:apple after:2024/12/01',
      'from:netflix OR from:spotify after:2024/12/01', 
      'from:openai OR from:claude after:2024/12/01',
      'from:paypal OR from:stripe OR from:lemonsqueezy after:2024/12/01',
      'from:opay OR from:providus OR from:zenith after:2024/12/01',
      'from:vercel OR from:replit OR from:github after:2024/12/01',
      'from:bolt OR from:uber OR from:tinder after:2024/12/01',
      'invoice OR receipt OR billing after:2024/12/01',
      'subscription OR recurring after:2024/12/01'
    ];

    this.transactions = [];
    
    console.log(`🚀 Running ${fastSearchQueries.length} optimised queries...`);
    
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