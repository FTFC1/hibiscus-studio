#!/usr/bin/env node

/**
 * 🔹 Interactive Budget Dashboard
 * Minimal design with drill-down functionality
 */

import fs from 'fs/promises';

async function buildDashboard() {
  console.log('🔹 Building interactive budget dashboard...');
  
  // Load all monthly reports
  const months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06'];
  const monthlyData = [];
  
  for (const month of months) {
    try {
      const data = JSON.parse(await fs.readFile(`financial-reports/${month}.json`, 'utf8'));
      monthlyData.push(data);
    } catch (error) {
      console.log(`⚠️ Could not load ${month}.json`);
    }
  }
  
  // Convert amount to NGN - UPDATED RATES
  function toNGN(amount, currency) {
    if (!amount || isNaN(amount)) return 0;
    
    const cleanAmount = parseFloat(amount);
    if (cleanAmount <= 0) return 0;
    
    const rates = {
      '₦': 1,           // Base currency
      '$': 1583,        // 1 USD = ₦1,583 (current rate)
      '£': 2000,        // 1 GBP = ₦2,000 (updated)
      '€': 1700         // 1 EUR = ₦1,700 (updated)
    };
    
    if (currency === '₦') return cleanAmount;
    const rate = rates[currency] || rates['$'];
    return cleanAmount * rate;
  }
  
  // Enhanced internal transfer detection
  function isInternalTransfer(transaction, category) {
    if (category === 'internal_transfer') return true;
    
    const subject = (transaction.subject || '').toLowerCase();
    const transferPatterns = [
      /transfer.*successful/, /wallet.*funded/, /account.*funded/,
      /balance.*updated/, /top.*up/, /folarin.*coker/, /nicholas.*folarin/
    ];
    
    return transferPatterns.some(pattern => pattern.test(subject));
  }
  
  // Clean formatting
  function formatNGN(amount) {
    return `₦${Math.round(amount).toLocaleString('en-GB')}`;
  }
  
  // Categorise expenses as fixed or variable
  function categoriseExpenseType(category, transaction) {
    const subject = (transaction.subject || '').toLowerCase();
    
    // Fixed expenses (recurring, predictable)
    const fixedPatterns = [
      /subscription/, /monthly/, /annual/, /recurring/,
      /apple/, /spotify/, /netflix/, /openai/, /icloud/,
      /rent/, /mortgage/, /insurance/, /utilities/
    ];
    
    if (fixedPatterns.some(pattern => pattern.test(subject)) || 
        fixedPatterns.some(pattern => pattern.test(category))) {
      return 'fixed';
    }
    
    return 'variable';
  }
  
  // Process monthly data for budgeting
  const processedMonths = monthlyData.map(month => {
    console.log(`\n🔍 Processing ${month.month}...`);
    
    const categorySpending = {};
    const categoryDetails = {};
    let monthTotal = 0;
    let fixedTotal = 0;
    let variableTotal = 0;
    const fixedExpenses = [];
    const variableExpenses = [];
    const allTransactions = [];
    
    Object.entries(month.categories).forEach(([category, transactions]) => {
      let categoryTotal = 0;
      const categoryTransactions = [];
      
      transactions.forEach(transaction => {
        if (isInternalTransfer(transaction, category)) return;
        
        let transactionAmountNGN = 0;
        
        if (transaction.currencies && transaction.amounts) {
          // Deduplicate identical amounts from same transaction
          const uniqueAmounts = [];
          const seenAmounts = new Set();
          
          for (let i = 0; i < transaction.amounts.length; i++) {
            const amount = transaction.amounts[i];
            const currency = transaction.currencies[i];
            const amountKey = `${amount}_${currency}`;
            
            if (!seenAmounts.has(amountKey)) {
              seenAmounts.add(amountKey);
              uniqueAmounts.push({ amount, currency });
            }
          }
          
          // Convert deduplicated amounts
          for (const { amount, currency } of uniqueAmounts) {
            if (amount && currency) {
              const convertedAmount = toNGN(amount, currency);
              transactionAmountNGN += convertedAmount;
            }
          }
        }
        
        // Reject impossible amounts
        if (transactionAmountNGN > 1000000) return;
        
        if (transactionAmountNGN > 0) {
          categoryTotal += transactionAmountNGN;
          
          const expenseType = categoriseExpenseType(category, transaction);
          const processedTransaction = {
            description: transaction.subject?.substring(0, 60) || 'Transaction',
            amount: transactionAmountNGN,
            originalAmount: transaction.amounts?.[0] || 0,
            currency: transaction.currencies?.[0] || '₦',
            category: category.replace(/_/g, ' '),
            type: expenseType,
            date: transaction.date || month.month
          };
          
          categoryTransactions.push(processedTransaction);
          allTransactions.push(processedTransaction);
          
          if (expenseType === 'fixed') {
            fixedTotal += transactionAmountNGN;
            fixedExpenses.push(processedTransaction);
          } else {
            variableTotal += transactionAmountNGN;
            variableExpenses.push(processedTransaction);
          }
        }
      });
      
      if (categoryTotal > 0) {
        categorySpending[category] = categoryTotal;
        categoryDetails[category] = categoryTransactions.sort((a, b) => b.amount - a.amount);
        monthTotal += categoryTotal;
      }
    });
    
    console.log(`💰 ${month.month}: Fixed ₦${Math.round(fixedTotal).toLocaleString()} | Variable ₦${Math.round(variableTotal).toLocaleString()}`);
    
    return {
      ...month,
      categorySpending,
      categoryDetails,
      totalSpent: monthTotal,
      fixedTotal,
      variableTotal,
      fixedExpenses,
      variableExpenses,
      allTransactions: allTransactions.sort((a, b) => b.amount - a.amount)
    };
  });
  
  const totalSpentAll = processedMonths.reduce((sum, month) => sum + month.totalSpent, 0);
  const avgMonthlySpend = totalSpentAll / processedMonths.length;
  const avgFixed = processedMonths.reduce((sum, month) => sum + month.fixedTotal, 0) / processedMonths.length;
  const avgVariable = processedMonths.reduce((sum, month) => sum + month.variableTotal, 0) / processedMonths.length;
  
  console.log(`\n📊 Budget Analysis: Fixed avg ₦${Math.round(avgFixed).toLocaleString()}/month, Variable avg ₦${Math.round(avgVariable).toLocaleString()}/month`);
  
  // Top categories with detailed breakdowns
  const globalCategorySpending = {};
  const globalCategoryDetails = {};
  
  processedMonths.forEach(month => {
    Object.entries(month.categorySpending).forEach(([category, amount]) => {
      globalCategorySpending[category] = (globalCategorySpending[category] || 0) + amount;
      
      if (!globalCategoryDetails[category]) {
        globalCategoryDetails[category] = [];
      }
      globalCategoryDetails[category].push(...(month.categoryDetails[category] || []));
    });
  });
  
  const topCategories = Object.entries(globalCategorySpending)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6)
    .map(([category, amount]) => ({
      category,
      amount,
      transactions: globalCategoryDetails[category].sort((a, b) => b.amount - a.amount)
    }));
  
  // Generate interactive HTML dashboard
  const dashboardHTML = `<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Budget</title>
    <meta name="description" content="Interactive personal budget tracker">
    <style>
        :root {
            --primary: #000;
            --secondary: #666;
            --tertiary: #999;
            --background: #fff;
            --surface: #f8f8f8;
            --border: #e5e5e5;
            --accent: #007aff;
            --success: #34c759;
            --warning: #ff9500;
            --spacing-xs: 4px;
            --spacing-sm: 8px;
            --spacing-md: 16px;
            --spacing-lg: 24px;
            --spacing-xl: 32px;
            --radius: 8px;
            --text-sm: 14px;
            --text-base: 16px;
            --text-lg: 18px;
            --text-xl: 24px;
            --weight-normal: 400;
            --weight-medium: 500;
            --weight-semibold: 600;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;
            font-size: var(--text-base);
            line-height: 1.5;
            color: var(--primary);
            background: var(--background);
            -webkit-font-smoothing: antialiased;
        }
        
        .container {
            max-width: 480px;
            margin: 0 auto;
            padding: var(--spacing-lg) var(--spacing-md);
            min-height: 100vh;
        }
        
        /* Header */
        .header {
            text-align: center;
            margin-bottom: var(--spacing-xl);
            padding-top: var(--spacing-lg);
        }
        
        .header h1 {
            font-size: var(--text-xl);
            font-weight: var(--weight-semibold);
            margin-bottom: var(--spacing-sm);
        }
        
        .header p {
            color: var(--secondary);
            font-size: var(--text-sm);
        }
        
        /* Summary Cards */
        .summary {
            display: grid;
            gap: var(--spacing-md);
            margin-bottom: var(--spacing-xl);
        }
        
        .summary-card {
            background: var(--surface);
            border-radius: var(--radius);
            padding: var(--spacing-lg);
            text-align: center;
        }
        
        .summary-card h3 {
            font-size: var(--text-sm);
            font-weight: var(--weight-medium);
            color: var(--secondary);
            margin-bottom: var(--spacing-sm);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .summary-card .value {
            font-size: var(--text-xl);
            font-weight: var(--weight-semibold);
            margin-bottom: var(--spacing-xs);
        }
        
        .summary-card .subtitle {
            font-size: var(--text-sm);
            color: var(--tertiary);
        }
        
        /* Budget Breakdown */
        .budget-section {
            margin-bottom: var(--spacing-xl);
        }
        
        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: var(--spacing-lg);
            padding: var(--spacing-md) 0 var(--spacing-sm);
            border-bottom: 2px solid var(--border);
            position: sticky;
            top: 0;
            background: var(--background);
            z-index: 10;
        }
        
        .section-title {
            font-size: var(--text-lg);
            font-weight: var(--weight-semibold);
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
        }
        
        .section-icon {
            font-size: 20px;
        }
        
        .section-count {
            background: var(--accent);
            color: white;
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 12px;
            font-weight: var(--weight-medium);
        }
        
        .budget-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--spacing-md);
            margin-bottom: var(--spacing-xl);
        }
        
        .budget-card {
            background: var(--surface);
            border-radius: var(--radius);
            padding: var(--spacing-lg);
            text-align: center;
        }
        
        .budget-card.fixed {
            border-left: 3px solid var(--accent);
        }
        
        .budget-card.variable {
            border-left: 3px solid var(--warning);
        }
        
        .budget-card h4 {
            font-size: var(--text-sm);
            font-weight: var(--weight-medium);
            color: var(--secondary);
            margin-bottom: var(--spacing-sm);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .budget-card .amount {
            font-size: var(--text-lg);
            font-weight: var(--weight-semibold);
            margin-bottom: var(--spacing-xs);
        }
        
        .budget-card .percentage {
            font-size: var(--text-sm);
            color: var(--tertiary);
        }
        
        /* Interactive Categories */
        .categories {
            margin-bottom: var(--spacing-xl);
        }
        
        .category-item {
            background: var(--surface);
            border-radius: var(--radius);
            margin-bottom: var(--spacing-md);
            overflow: hidden;
            transition: all 0.2s ease;
            border: 1px solid transparent;
        }
        
        .category-item:hover {
            border-color: var(--accent);
            box-shadow: 0 2px 8px rgba(0, 122, 255, 0.1);
        }
        
        .category-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-lg);
            cursor: pointer;
            user-select: none;
            position: relative;
        }
        
        .category-header::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            height: 2px;
            width: 0;
            background: var(--accent);
            transition: width 0.2s ease;
        }
        
        .category-item.expanded .category-header::after {
            width: 100%;
        }
        
        .category-left {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
        }
        
        .category-name {
            font-weight: var(--weight-semibold);
            text-transform: capitalize;
            font-size: var(--text-base);
        }
        
        .category-count {
            font-size: 13px;
            color: var(--tertiary);
            margin-left: var(--spacing-xs);
            font-weight: var(--weight-normal);
        }
        
        .category-amount {
            font-weight: var(--weight-semibold);
            color: var(--secondary);
            font-size: var(--text-base);
        }
        
        .expand-icon {
            margin-left: var(--spacing-sm);
            transition: all 0.3s ease;
            color: var(--accent);
            font-weight: bold;
            font-size: 16px;
        }
        
        .category-item.expanded .expand-icon {
            transform: rotate(180deg);
            color: var(--accent);
        }
        
        .category-details {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        
        .category-item.expanded .category-details {
            max-height: 800px;
        }
        
        .transaction-list {
            padding: 0 var(--spacing-lg) var(--spacing-lg);
        }
        
        .transaction-item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: var(--spacing-sm) 0;
            border-bottom: 1px solid var(--border);
            gap: var(--spacing-sm);
        }
        
        .transaction-item:last-child {
            border-bottom: none;
        }
        
        .transaction-description {
            flex: 1;
            font-size: var(--text-sm);
            line-height: 1.4;
        }
        
        .transaction-amount {
            font-weight: var(--weight-semibold);
            font-size: var(--text-sm);
            color: var(--secondary);
            text-align: right;
        }
        
        .transaction-original {
            font-size: 12px;
            color: var(--tertiary);
            margin-top: 2px;
        }
        
        /* Interactive Monthly Grid */
        .months {
            display: grid;
            gap: var(--spacing-lg);
        }
        
        .month-card {
            background: var(--surface);
            border-radius: var(--radius);
            margin-bottom: var(--spacing-md);
            overflow: hidden;
            transition: all 0.2s ease;
            border: 1px solid transparent;
        }
        
        .month-card:hover {
            border-color: var(--accent);
            box-shadow: 0 2px 8px rgba(0, 122, 255, 0.1);
        }
        
        .month-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-lg);
            cursor: pointer;
            user-select: none;
            position: relative;
        }
        
        .month-header::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            height: 2px;
            width: 0;
            background: var(--accent);
            transition: width 0.2s ease;
        }
        
        .month-card.expanded .month-header::after {
            width: 100%;
        }
        
        .month-title {
            font-weight: var(--weight-semibold);
            text-transform: capitalize;
            font-size: var(--text-base);
        }
        
        .month-total {
            font-weight: var(--weight-semibold);
            color: var(--secondary);
            font-size: var(--text-base);
        }
        
        .month-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        
        .month-card.expanded .month-content {
            max-height: 1000px;
        }
        
        .month-breakdown {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--spacing-md);
            padding: 0 var(--spacing-lg) var(--spacing-md);
        }
        
        .breakdown-item {
            text-align: center;
            padding: var(--spacing-sm);
            background: rgba(255, 255, 255, 0.5);
            border-radius: var(--spacing-xs);
        }
        
        .breakdown-label {
            font-size: var(--text-sm);
            color: var(--secondary);
            margin-bottom: var(--spacing-xs);
        }
        
        .breakdown-amount {
            font-weight: var(--weight-semibold);
        }
        
        .breakdown-item.fixed .breakdown-amount {
            color: var(--accent);
        }
        
        .breakdown-item.variable .breakdown-amount {
            color: var(--warning);
        }
        
        .month-transactions {
            padding: 0 var(--spacing-lg) var(--spacing-lg);
        }
        
        .month-transactions h4 {
            font-size: var(--text-sm);
            font-weight: var(--weight-medium);
            color: var(--secondary);
            margin-bottom: var(--spacing-sm);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* Footer */
        .footer {
            text-align: center;
            padding: var(--spacing-xl) 0;
            color: var(--tertiary);
            font-size: var(--text-sm);
        }
        
        /* Dark mode */
        @media (prefers-color-scheme: dark) {
            :root {
                --primary: #fff;
                --secondary: #a0a0a0;
                --tertiary: #666;
                --background: #000;
                --surface: #1c1c1e;
                --border: #38383a;
                --accent: #0a84ff;
            }
        }
        
        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
        
        /* Extra small screens */
        @media (max-width: 320px) {
            .container {
                padding: var(--spacing-md) var(--spacing-sm);
            }
            
            .budget-grid {
                grid-template-columns: 1fr;
            }
            
            .month-breakdown {
                grid-template-columns: 1fr;
            }
        }
        
        /* Touch targets */
        @media (pointer: coarse) {
            .category-header, .month-header {
                padding: var(--spacing-lg);
                min-height: 44px;
            }
        }
        
        /* Navigation & Section Improvements */
        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: var(--spacing-lg);
            padding: var(--spacing-md) 0 var(--spacing-sm);
            border-bottom: 2px solid var(--border);
            position: sticky;
            top: 0;
            background: var(--background);
            z-index: 10;
        }
        
        .section-title {
            font-size: var(--text-lg);
            font-weight: var(--weight-semibold);
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
        }
        
        .section-icon {
            font-size: 20px;
        }
        
        .section-count {
            background: var(--accent);
            color: white;
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 12px;
            font-weight: var(--weight-medium);
        }
        
        /* Enhanced Interactive Elements */
        .category-item, .month-card {
            background: var(--surface);
            border-radius: var(--radius);
            margin-bottom: var(--spacing-md);
            overflow: hidden;
            transition: all 0.2s ease;
            border: 1px solid transparent;
        }
        
        .category-item:hover, .month-card:hover {
            border-color: var(--accent);
            box-shadow: 0 2px 8px rgba(0, 122, 255, 0.1);
        }
        
        .category-header, .month-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-lg);
            cursor: pointer;
            user-select: none;
            position: relative;
        }
        
        .category-header::after, .month-header::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            height: 2px;
            width: 0;
            background: var(--accent);
            transition: width 0.2s ease;
        }
        
        .category-item.expanded .category-header::after,
        .month-card.expanded .month-header::after {
            width: 100%;
        }
        
        /* Better Visual Feedback */
        .category-header:active, .month-header:active {
            background: rgba(0, 122, 255, 0.05);
        }
        
        .expand-icon {
            margin-left: var(--spacing-sm);
            transition: all 0.3s ease;
            color: var(--accent);
            font-weight: bold;
            font-size: 16px;
        }
        
        .category-item.expanded .expand-icon,
        .month-card.expanded .expand-icon {
            transform: rotate(180deg);
            color: var(--accent);
        }
        
        /* Quick Actions Bar */
        .quick-actions {
            position: fixed;
            bottom: var(--spacing-lg);
            right: var(--spacing-lg);
            display: flex;
            gap: var(--spacing-sm);
            z-index: 20;
        }
        
        .quick-action-btn {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--accent);
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
            transition: all 0.2s ease;
        }
        
        .quick-action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4);
        }
        
        /* Progress Indicators */
        .progress-bar {
            height: 4px;
            background: var(--border);
            border-radius: 2px;
            overflow: hidden;
            margin-top: var(--spacing-xs);
        }
        
        .progress-fill {
            height: 100%;
            background: var(--accent);
            transition: width 0.3s ease;
        }
        
        .progress-fill.variable {
            background: var(--warning);
        }
        
        /* Enhanced Mobile Experience */
        @media (max-width: 480px) {
            .container {
                padding: var(--spacing-md) var(--spacing-sm);
            }
            
            .section-header {
                position: relative;
                top: auto;
            }
            
            .quick-actions {
                bottom: var(--spacing-md);
                right: var(--spacing-md);
            }
            
            .quick-action-btn {
                width: 44px;
                height: 44px;
                font-size: 18px;
            }
        }
        
        /* Improved Typography Hierarchy */
        .category-name, .month-title {
            font-weight: var(--weight-semibold);
            text-transform: capitalize;
            font-size: var(--text-base);
        }
        
        .category-count {
            font-size: 13px;
            color: var(--tertiary);
            margin-left: var(--spacing-xs);
            font-weight: var(--weight-normal);
        }
        
        .category-amount, .month-total {
            font-weight: var(--weight-semibold);
            color: var(--secondary);
            font-size: var(--text-base);
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>Budget</h1>
            <p>Interactive expense tracking</p>
        </header>
        
        <section class="summary">
            <div class="summary-card">
                <h3>Monthly Average</h3>
                <div class="value">${formatNGN(avgMonthlySpend)}</div>
                <div class="subtitle">6-month average</div>
            </div>
        </section>
        
        <section class="budget-section">
            <div class="section-header">
                <h2 class="section-title">
                    <span class="section-icon">📊</span>
                    Budget Breakdown
                </h2>
            </div>
            
            <div class="budget-grid">
                <div class="budget-card fixed">
                    <h4>Fixed</h4>
                    <div class="amount">${formatNGN(avgFixed)}</div>
                    <div class="percentage">${Math.round((avgFixed / avgMonthlySpend) * 100)}% of budget</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.round((avgFixed / avgMonthlySpend) * 100)}%"></div>
                    </div>
                </div>
                
                <div class="budget-card variable">
                    <h4>Variable</h4>
                    <div class="amount">${formatNGN(avgVariable)}</div>
                    <div class="percentage">${Math.round((avgVariable / avgMonthlySpend) * 100)}% of budget</div>
                    <div class="progress-bar">
                        <div class="progress-fill variable" style="width: ${Math.round((avgVariable / avgMonthlySpend) * 100)}%"></div>
                    </div>
                </div>
            </div>
        </section>
        
        <section class="categories">
            <div class="section-header">
                <h2 class="section-title">
                    <span class="section-icon">📂</span>
                    Categories
                    <span class="section-count">${topCategories.length}</span>
                </h2>
            </div>
            
            ${topCategories.map((cat, index) => `
                <div class="category-item" data-category="${index}">
                    <div class="category-header" onclick="toggleCategory(${index})">
                        <div class="category-left">
                            <span class="category-name">${cat.category.replace(/_/g, ' ')}</span>
                            <span class="category-count">(${cat.transactions.length})</span>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <span class="category-amount">${formatNGN(cat.amount)}</span>
                            <span class="expand-icon">▼</span>
                        </div>
                    </div>
                    <div class="category-details">
                        <div class="transaction-list">
                            ${cat.transactions.slice(0, 10).map(transaction => `
                                <div class="transaction-item">
                                    <div class="transaction-description">${transaction.description}</div>
                                    <div class="transaction-amount">
                                        ${formatNGN(transaction.amount)}
                                        ${transaction.currency !== '₦' ? `<div class="transaction-original">${transaction.currency}${transaction.originalAmount}</div>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                            ${cat.transactions.length > 10 ? `<div style="text-align: center; padding: var(--spacing-sm); color: var(--tertiary); font-size: var(--text-sm);">+${cat.transactions.length - 10} more transactions</div>` : ''}
                        </div>
                    </div>
                </div>
            `).join('')}
        </section>
        
        <section class="months">
            <div class="section-header">
                <h2 class="section-title">
                    <span class="section-icon">📅</span>
                    Monthly Details
                    <span class="section-count">${processedMonths.length}</span>
                </h2>
            </div>
            
            ${processedMonths.map((month, index) => `
                <div class="month-card" data-month="${index}">
                    <div class="month-header" onclick="toggleMonth(${index})">
                        <div>
                            <h3 class="month-title">${month.month.split(' ')[0]}</h3>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <span class="month-total">${formatNGN(month.totalSpent)}</span>
                            <span class="expand-icon" style="margin-left: var(--spacing-sm); transition: transform 0.2s ease; color: var(--accent);">▼</span>
                        </div>
                    </div>
                    
                    <div class="month-content">
                        <div class="month-breakdown">
                            <div class="breakdown-item fixed">
                                <div class="breakdown-label">Fixed</div>
                                <div class="breakdown-amount">${formatNGN(month.fixedTotal)}</div>
                            </div>
                            
                            <div class="breakdown-item variable">
                                <div class="breakdown-label">Variable</div>
                                <div class="breakdown-amount">${formatNGN(month.variableTotal)}</div>
                            </div>
                        </div>
                        
                        <div class="month-transactions">
                            <h4>Top Expenses</h4>
                            ${month.allTransactions.slice(0, 8).map(transaction => `
                                <div class="transaction-item">
                                    <div class="transaction-description">
                                        ${transaction.description}
                                        <div style="font-size: 12px; color: var(--tertiary); margin-top: 2px;">${transaction.category}</div>
                                    </div>
                                    <div class="transaction-amount">
                                        ${formatNGN(transaction.amount)}
                                        ${transaction.currency !== '₦' ? `<div class="transaction-original">${transaction.currency}${transaction.originalAmount}</div>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                            ${month.allTransactions.length > 8 ? `<div style="text-align: center; padding: var(--spacing-sm); color: var(--tertiary); font-size: var(--text-sm);">${month.totalTransactions} total transactions</div>` : ''}
                        </div>
                    </div>
                </div>
            `).join('')}
        </section>
        
        <!-- Quick Actions -->
        <div class="quick-actions">
            <button class="quick-action-btn" onclick="scrollToTop()" title="Back to top">
                ↑
            </button>
            <button class="quick-action-btn" onclick="toggleAllSections()" title="Expand/collapse all">
                ⚡
            </button>
        </div>
        
        <footer class="footer">
            <p>Generated ${new Date().toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}</p>
        </footer>
    </div>

    <script>
        function toggleCategory(index) {
            const categoryItem = document.querySelector(\`[data-category="\${index}"]\`);
            categoryItem.classList.toggle('expanded');
        }
        
        function toggleMonth(index) {
            const monthCard = document.querySelector(\`[data-month="\${index}"]\`);
            monthCard.classList.toggle('expanded');
            
            // Update expand icon
            const expandIcon = monthCard.querySelector('.expand-icon');
            if (monthCard.classList.contains('expanded')) {
                expandIcon.style.transform = 'rotate(180deg)';
            } else {
                expandIcon.style.transform = 'rotate(0deg)';
            }
        }
        
        // Add keyboard support
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                if (e.target.classList.contains('category-header')) {
                    e.preventDefault();
                    e.target.click();
                }
                if (e.target.classList.contains('month-header')) {
                    e.preventDefault();
                    e.target.click();
                }
            }
        });
        
        // Add focus support for accessibility
        document.querySelectorAll('.category-header, .month-header').forEach(element => {
            element.setAttribute('tabindex', '0');
            element.setAttribute('role', 'button');
            element.setAttribute('aria-expanded', 'false');
            
            element.addEventListener('click', function() {
                const expanded = this.parentElement.classList.contains('expanded');
                this.setAttribute('aria-expanded', expanded);
            });
        });
        
        // Quick Actions
        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        let allExpanded = false;
        function toggleAllSections() {
            const categories = document.querySelectorAll('.category-item');
            const months = document.querySelectorAll('.month-card');
            
            allExpanded = !allExpanded;
            
            categories.forEach(item => {
                if (allExpanded) {
                    item.classList.add('expanded');
                } else {
                    item.classList.remove('expanded');
                }
            });
            
            months.forEach(item => {
                if (allExpanded) {
                    item.classList.add('expanded');
                    const expandIcon = item.querySelector('.expand-icon');
                    if (expandIcon) expandIcon.style.transform = 'rotate(180deg)';
                } else {
                    item.classList.remove('expanded');
                    const expandIcon = item.querySelector('.expand-icon');
                    if (expandIcon) expandIcon.style.transform = 'rotate(0deg)';
                }
            });
        }
    </script>
</body>
</html>`;

  await fs.writeFile('financial-dashboard.html', dashboardHTML);
  console.log('✅ Interactive budget dashboard created');
}

buildDashboard().catch(console.error); 