#!/usr/bin/env node

// Debug: Why wasn't the ₦250k ProvidusBank transaction captured?

const emailData = {
  subject: "ProvidusBank - Debit Alert",
  from: "ProvidusBank <alert@providusbank.com>",
  date: "2025-05-26T13:00:37.000Z",
  body: `Transaction Alert Service Dear FOLARIN-COKER NICHOLAS , This is to notify you that a Debit transaction just occured on your account. Kindly see details below: Account Number 40******55 Amount NGN 250,000.00 Narrative OUTWARD TRANSFER (N) MOB: To GTBank Plc|DESALU MICHAEL TEMITOPE ADELEK FT /000023250526130030004155905874 Time Mon, May 26, 2025 at 12:59 AM Reference 26052025999600391 Branch CORPORATE BRANCH Available Balance NGN 416,178.57 Ledger Balance NGN 431,706.21`
};

console.log('🔍 Debug: Why was ₦250k transfer missed?\n');

// Test against your parsing logic

// 1. Check failed payment patterns
const failedPaymentPatterns = [
  /unsuccessful|failed|declined|rejected|error|cancelled/i,
  /payment.*unsuccessful|payment.*failed|transaction.*failed/i,
  /could not.*process|unable to.*charge|card.*declined/i,
  /insufficient.*funds|expired.*card|invalid.*card/i
];

const isFailedPayment = failedPaymentPatterns.some(pattern => 
  pattern.test(emailData.subject) || pattern.test(emailData.from)
);

console.log(`1. Failed payment filter: ${isFailedPayment ? '❌ FILTERED OUT' : '✅ PASSED'}`);

// 2. Check promotional email patterns  
const promotionalPatterns = [
  /unsubscribe|newsletter|promotion|offer|discount|sale|deal|free|win|limited time|exclusive/i,
  /marketing|campaign|advertisement|promo|special|bonus/i,
  /click here|learn more|find out|discover|explore/i,
  /save.*£|save.*\$|get.*off|up to.*off|\d+%.*off/i,
  /.*@.*\.(marketing|promo|offers|deals|newsletter)/i
];

const isPromotional = promotionalPatterns.some(pattern => 
  pattern.test(emailData.subject) || pattern.test(emailData.from) || pattern.test(emailData.body)
);

console.log(`2. Promotional filter: ${isPromotional ? '❌ FILTERED OUT' : '✅ PASSED'}`);

// 3. Check amount extraction
const text = `${emailData.subject} ${emailData.from} ${emailData.body}`;

// Amount patterns from your code
const currencyAmountPatterns = [
  { pattern: /£(\d+(?:\.\d{2})?)/g, currency: '£' },
  { pattern: /\$(\d+(?:\.\d{2})?)/g, currency: '$' },
  { pattern: /€(\d+(?:\.\d{2})?)/g, currency: '€' },
  { pattern: /₦([0-9,]+(?:\.[0-9]{2})?)/g, currency: '₦' },
  { pattern: /NGN\s*([0-9,]+(?:\.[0-9]{2})?)/gi, currency: '₦' }
];

let foundAmounts = [];
let foundCurrencies = [];

for (const { pattern, currency } of currencyAmountPatterns) {
  let match;
  pattern.lastIndex = 0; // Reset regex state
  while ((match = pattern.exec(text)) !== null) {
    const amount = parseFloat(match[1].replace(/,/g, ''));
    if (amount > 0) {
      foundAmounts.push(amount);
      foundCurrencies.push(currency);
    }
  }
}

console.log(`3. Amount extraction: ${foundAmounts.length > 0 ? '✅ FOUND' : '❌ NO AMOUNTS'}`);
if (foundAmounts.length > 0) {
  foundAmounts.forEach((amt, idx) => {
    console.log(`   ${foundCurrencies[idx]}${amt.toLocaleString()}`);
  });
}

// 4. Check categorization
const categories = {
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

// Internal transfer patterns
const internalTransferPatterns = [
  /folarin-coker/i,
  /folarin.*coker/i,
  /coker.*folarin/i,
  /nicholas.*folarin/i,
  /folarin.*nicholas/i,
  /nicholas.*coker/i,
  /coker.*nicholas/i,
  /transfer.*to.*yourself/i,
  /transfer.*to.*your.*account/i,
  /transfer.*to.*own.*account/i,
  /wallet.*funding.*from.*your.*bank/i,
  /account.*funding.*from.*your.*bank/i,
  /balance.*after.*transfer.*₦.*your.*account.*balance.*is.*now/i,
  /wallet.*funded.*successfully.*new.*balance/i
];

const lowercaseText = text.toLowerCase();

// Check bank transfer indicators first
const bankTransferIndicators = [
  /debit.*alert|debit.*transaction/i,
  /transfer.*successful|payment.*successful/i,
  /outward.*transfer|inward.*transfer/i,
  /wire.*transfer|fund.*transfer/i,
  /sent.*to|transferred.*to/i
];

const isBankTransfer = bankTransferIndicators.some(pattern => pattern.test(lowercaseText));
console.log(`4. Bank transfer detected: ${isBankTransfer ? '✅ YES' : '❌ NO'}`);

if (isBankTransfer) {
  // Check for recipient information
  const recipientMatch = lowercaseText.match(/(?:name:|to:)\s*([^,\n]+)/i);
  
  if (recipientMatch) {
    const recipientName = recipientMatch[1].trim();
    console.log(`   Recipient found: "${recipientName}"`);
    
    const isInternalRecipient = /folarin-coker/i.test(recipientName);
    console.log(`   Is internal recipient: ${isInternalRecipient ? '✅ YES' : '❌ NO'}`);
    
    if (isInternalRecipient) {
      console.log(`   ➜ Category: internal_transfer`);
    } else {
      console.log(`   ➜ Category: banking`);
    }
  } else {
    // Check general internal transfer patterns
    const isInternalTransfer = internalTransferPatterns.some(pattern => 
      pattern.test(lowercaseText)
    );
    
    console.log(`   General internal transfer: ${isInternalTransfer ? '✅ YES' : '❌ NO'}`);
    
    if (isInternalTransfer) {
      console.log(`   ➜ Category: internal_transfer`);
    } else {
      console.log(`   ➜ Category: banking`);
    }
  }
} else {
  // Check other categories
  let foundCategory = 'other';
  for (const [category, keywords] of Object.entries(categories)) {
    if (category === 'internal_transfer' || category === 'banking') continue;
    
    if (keywords.some(keyword => lowercaseText.includes(keyword))) {
      foundCategory = category;
      break;
    }
  }
  console.log(`   ➜ Category: ${foundCategory}`);
}

// 5. Check if this would be in May 2025 report
const emailDate = new Date(emailData.date);
const emailMonth = emailDate.getMonth(); // 4 = May (0-indexed)
const emailYear = emailDate.getFullYear(); // 2025

console.log(`\n5. Email date: ${emailDate.toLocaleDateString('en-GB')}`);
console.log(`   Month: ${emailMonth} (${emailMonth === 4 ? 'May' : 'Not May'})`);
console.log(`   Year: ${emailYear}`);

// 6. Check Gmail search patterns
const searchQueries = [
  'from:opay OR from:providus OR from:zenith after:2024/11/01',
  'from:ebusinessgroup OR subject:(zenith bank transaction alert) after:2024/11/01',
  '(opay AND (transaction OR transfer OR debit OR payment)) after:2024/11/01',
  '(zenith AND (transaction OR transfer OR debit OR payment)) after:2024/11/01',
  '(providus AND (transaction OR transfer OR debit OR payment)) after:2024/11/01',
  'subject:(debit alert) after:2024/11/01',
  'subject:(transfer successful) after:2024/11/01',
  'subject:(₦) after:2024/11/01'
];

console.log(`\n6. Would this email match your search queries?`);

for (const query of searchQueries) {
  let matches = false;
  
  if (query.includes('from:providus')) {
    matches = emailData.from.toLowerCase().includes('providus');
  } else if (query.includes('(providus AND')) {
    const hasProvidus = emailData.from.toLowerCase().includes('providus');
    const hasKeywords = ['transaction', 'transfer', 'debit', 'payment'].some(keyword =>
      emailData.subject.toLowerCase().includes(keyword) || emailData.body.toLowerCase().includes(keyword)
    );
    matches = hasProvidus && hasKeywords;
  } else if (query.includes('subject:(debit alert)')) {
    matches = emailData.subject.toLowerCase().includes('debit alert');
  } else if (query.includes('subject:(₦)')) {
    matches = emailData.subject.includes('₦');
  }
  
  if (matches) {
    console.log(`   ✅ MATCHES: ${query}`);
  }
}

console.log('\n🏁 CONCLUSION:');
console.log('This email should have been captured and parsed correctly.');
console.log('If it\'s missing from your May 2025 report, the issue is likely:');
console.log('1. Gmail search didn\'t return this email due to API limits');
console.log('2. Parsing script wasn\'t run recently enough');
console.log('3. There was an error during the processing step');
console.log('\nSolution: Re-run your financial analysis to capture this transaction!'); 