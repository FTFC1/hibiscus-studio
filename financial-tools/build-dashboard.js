#!/usr/bin/env node

/**
 * 🔹 Interactive Budget Dashboard
 * Enhanced with search, better insights, and proper UX
 */

import fs from 'fs/promises';

async function buildDashboard() {
  console.log('🔹 Building enhanced budget dashboard with search and improved insights...');
  
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
  
  // Convert amount to NGN
  function toNGN(amount, currency) {
    if (!amount || isNaN(amount)) return 0;
    
    const cleanAmount = parseFloat(amount);
    if (cleanAmount <= 0) return 0;
    
    const rates = {
      '₦': 1,
      '$': 1583,
      '£': 2000,
      '€': 1700
    };
    
    return cleanAmount * (rates[currency] || rates['$']);
  }
  
  // Format category names for display
  function formatCategoryName(category) {
    const categoryMap = {
      'apple_icloud': 'iCloud Storage',
      'apple_music': 'Apple Music',
      'apple_apps': 'App Store',
      'apple_tv': 'Apple TV+',
      'apple_one': 'Apple One',
      'apple_developer': 'Apple Developer',
      'apple_other': 'Apple Services',
      'ai_tools': 'AI Tools',
      'internal_transfer': 'Internal Transfer',
      'personal_services': 'Personal Services',
      'personal_payments': 'Personal Payments'
    };
    
    return categoryMap[category] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  // Get category icon
  function getCategoryIcon(category) {
    const icons = {
      'banking': '🏦',
      'transport': '🚗',
      'ai_tools': '🤖',
      'apple_apps': '📱',
      'apple_one': '🍎',
      'apple_icloud': '☁️',
      'apple_music': '🎵',
      'apple_tv': '📺',
      'food': '🍽️',
      'entertainment': '🎬',
      'personal_services': '👨‍💼',
      'other': '📄'
    };
    
    return icons[category] || '💰';
  }
  
  // Format amount
  function formatNGN(amount) {
    return `₦${Math.round(amount).toLocaleString('en-GB')}`;
  }
  
  // Generate useful insights (excluding internal transfers and banking mess)
  function generateInsights(processedMonths) {
    const insights = [];
    let allTransactions = [];
    let totalSpending = 0;
    
    // Collect all transactions (excluding banking and internal transfers)
    processedMonths.forEach(month => {
      month.categories.forEach(([categoryName, amount]) => {
        if (categoryName === 'Banking' || categoryName === 'Internal Transfer') return;
        
        totalSpending += amount;
        const transactions = month.transactions[categoryName] || [];
        transactions.forEach(tx => {
          allTransactions.push({
            ...tx,
            category: categoryName,
            month: month.month,
            amountNGN: tx.amount
          });
        });
      });
    });
    
    // Sort by amount for insights
    allTransactions.sort((a, b) => b.amountNGN - a.amountNGN);
    
    // Insight 1: Largest actual expenses (not transfers)
    const actualExpenses = allTransactions.filter(tx => 
      !tx.subject.toLowerCase().includes('transfer') && 
      !tx.subject.toLowerCase().includes('folarin-coker')
    );
    
    if (actualExpenses.length > 0) {
      insights.push({
        icon: '💸',
        title: 'Largest Real Expenses',
        description: `Your biggest actual expense was ${formatNGN(actualExpenses[0].amountNGN)} for ${actualExpenses[0].category} in ${actualExpenses[0].month}`,
        details: actualExpenses.slice(0, 5).map(tx => 
          `${formatNGN(tx.amountNGN)} - ${tx.subject.slice(0, 40)}... (${tx.month})`
        ).join('\\n')
      });
    }
    
    // Insight 2: Subscription costs
    const subscriptions = allTransactions.filter(tx => 
      tx.category.includes('Apple') || tx.category.includes('AI') || 
      tx.subject.toLowerCase().includes('subscription') ||
      tx.subject.toLowerCase().includes('monthly')
    );
    
    const monthlySubscriptions = subscriptions.reduce((sum, tx) => sum + tx.amountNGN, 0) / 6;
    
    if (subscriptions.length > 0) {
      insights.push({
        icon: '📱',
        title: 'Monthly Subscriptions',
        description: `Average ₦${Math.round(monthlySubscriptions).toLocaleString()} per month on subscriptions and services`,
        details: `Apple Services: ${subscriptions.filter(tx => tx.category.includes('Apple')).length} items\\nAI Tools: ${subscriptions.filter(tx => tx.category.includes('AI')).length} items\\nTotal monthly average: ${formatNGN(monthlySubscriptions)}`
      });
    }
    
    // Insight 3: Transport patterns (likely Indrive via banking)
    const transportSpending = processedMonths.reduce((sum, month) => {
      const transport = month.categories.find(([cat]) => cat === 'Transport');
      return sum + (transport ? transport[1] : 0);
    }, 0);
    
    if (transportSpending > 0) {
      insights.push({
        icon: '🚗',
        title: 'Transport Spending',
        description: `Total ₦${Math.round(transportSpending).toLocaleString()} on transport (${Math.round(transportSpending/6).toLocaleString()}/month average)`,
        details: processedMonths.map(month => {
          const transport = month.categories.find(([cat]) => cat === 'Transport');
          return `${month.month}: ${transport ? formatNGN(transport[1]) : '₦0'}`;
        }).join('\\n')
      });
    }
    
    // Insight 4: Recent spending trend
    const recentMonths = processedMonths.slice(0, 3); // Last 3 months
    const recentAvg = recentMonths.reduce((sum, month) => sum + month.total, 0) / recentMonths.length;
    const olderMonths = processedMonths.slice(3);
    const olderAvg = olderMonths.reduce((sum, month) => sum + month.total, 0) / olderMonths.length;
    
    const trend = recentAvg > olderAvg ? 'increasing' : 'decreasing';
    const changePercent = Math.round(Math.abs((recentAvg - olderAvg) / olderAvg) * 100);
    
    insights.push({
      icon: trend === 'increasing' ? '📈' : '📉',
      title: 'Spending Trend',
      description: `Spending is ${trend} - recent 3 months average ${formatNGN(recentAvg)} vs earlier ${formatNGN(olderAvg)}`,
      details: `Change: ${changePercent}% ${trend}\\nRecent months: ${recentMonths.map(m => `${m.month}: ${formatNGN(m.total)}`).join('\\n')}\\nEarlier months: ${olderMonths.map(m => `${m.month}: ${formatNGN(m.total)}`).join('\\n')}`
    });
    
    return insights;
  }
  
  // Process monthly data
  const processedMonths = monthlyData.map(month => {
    const categoryTotals = {};
    const categoryTransactions = {};
    let monthTotal = 0;
    
    Object.entries(month.categories).forEach(([category, transactions]) => {
      if (category === 'internal_transfer') return; // Skip internal transfers
      
      let categoryTotal = 0;
      const categoryDetails = [];
      
      transactions.forEach(transaction => {
        let transactionTotal = 0;
        
        if (transaction.amounts && transaction.currencies) {
          for (let i = 0; i < transaction.amounts.length; i++) {
            const amount = parseFloat(transaction.amounts[i]);
            const currency = transaction.currencies[i];
            transactionTotal += toNGN(amount, currency);
          }
        }
        
        if (transactionTotal > 0 && transactionTotal <= 500000) {
          categoryTotal += transactionTotal;
          categoryDetails.push({
            subject: transaction.subject,
            amount: transactionTotal,
            date: transaction.date,
            originalAmount: transaction.amounts?.[0] || '0',
            currency: transaction.currencies?.[0] || '₦'
          });
        }
      });
      
      if (categoryTotal > 0) {
        const formattedCategory = formatCategoryName(category);
        categoryTotals[formattedCategory] = categoryTotal;
        // Sort by amount descending by default
        categoryTransactions[formattedCategory] = categoryDetails.sort((a, b) => b.amount - a.amount);
        monthTotal += categoryTotal;
      }
    });
    
    // Sort categories by spending (descending)
    const sortedCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1]);
    
    return {
      month: month.month,
      total: monthTotal,
      categories: sortedCategories,
      transactions: categoryTransactions
    };
  });
  
  // Sort months by date (most recent first)
  processedMonths.sort((a, b) => new Date(b.month) - new Date(a.month));
  
  // Generate insights
  const insights = generateInsights(processedMonths);

  // Generate HTML
  const html = `<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Personal Budget Dashboard</title>
    <style>
        :root {
            --primary: #1a1a1a;
            --secondary: #666;
            --accent: #007aff;
            --success: #34c759;
            --warning: #ff9500;
            --background: #ffffff;
            --surface: #f8f9fa;
            --border: #e1e1e1;
            --text-light: #8e8e93;
            --shadow: rgba(0,0,0,0.08);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            line-height: 1.6;
            color: var(--primary);
            background: var(--background);
            -webkit-font-smoothing: antialiased;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        /* Responsive grid */
        @media (min-width: 768px) {
            .container {
                padding: 40px;
            }
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .header h1 {
            font-size: clamp(24px, 5vw, 32px);
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .header p {
            color: var(--secondary);
            font-size: 16px;
        }
        
        /* Search Panel */
        .search-panel {
            background: var(--surface);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 24px;
            border: 1px solid var(--border);
        }
        
        .search-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .search-box {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid var(--border);
            border-radius: 12px;
            font-size: 16px;
            background: var(--background);
        }
        
        .search-box:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
        }
        
        .search-results {
            margin-top: 16px;
            display: none;
        }
        
        .search-result-item {
            padding: 12px;
            border-radius: 8px;
            background: var(--background);
            border: 1px solid var(--border);
            margin-bottom: 8px;
        }
        
        .search-result-amount {
            font-weight: 600;
            color: var(--accent);
        }
        
        .search-result-details {
            font-size: 14px;
            color: var(--secondary);
            margin-top: 4px;
        }
        
        /* Insights Panel */
        .insights-panel {
            background: linear-gradient(135deg, var(--accent), #5856d6);
            color: white;
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 40px;
            box-shadow: 0 8px 32px rgba(0, 122, 255, 0.3);
        }
        
        .insights-title {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .insights-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
        }
        
        @media (min-width: 768px) {
            .insights-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (min-width: 1200px) {
            .insights-grid {
                grid-template-columns: repeat(4, 1fr);
            }
        }
        
        .insight-card {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            padding: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .insight-card:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translateY(-2px);
        }
        
        .insight-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
        }
        
        .insight-icon {
            font-size: 28px;
        }
        
        .insight-title {
            font-weight: 600;
            font-size: 16px;
        }
        
        .insight-description {
            font-size: 14px;
            opacity: 0.9;
            line-height: 1.5;
        }
        
        .insight-details {
            display: none;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            font-size: 12px;
            opacity: 0.8;
            white-space: pre-line;
        }
        
        .insight-card.expanded .insight-details {
            display: block;
        }
        
        /* Month cards grid */
        .months-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
        }
        
        @media (min-width: 768px) {
            .months-grid {
                grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            }
        }
        
        .month-card {
            background: var(--surface);
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 4px 20px var(--shadow);
            border: 1px solid var(--border);
        }
        
        .month-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 2px solid var(--border);
        }
        
        .month-title {
            font-size: 20px;
            font-weight: 600;
        }
        
        .month-total {
            font-size: 18px;
            font-weight: 600;
            color: var(--accent);
        }
        
        /* Sorting controls */
        .sort-controls {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
        }
        
        .sort-btn {
            padding: 8px 16px;
            border: 1px solid var(--border);
            background: var(--background);
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .sort-btn.active {
            background: var(--accent);
            color: white;
            border-color: var(--accent);
        }
        
        /* Category sections */
        .category-list {
            space-y: 12px;
        }
        
        .category-item {
            background: var(--background);
            border-radius: 12px;
            border: 1px solid var(--border);
            margin-bottom: 8px;
            overflow: hidden;
            transition: all 0.2s ease;
        }
        
        .category-item:hover {
            box-shadow: 0 2px 12px var(--shadow);
        }
        
        .category-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            cursor: pointer;
            user-select: none;
        }
        
        .category-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .category-icon {
            font-size: 24px;
        }
        
        .category-name {
            font-weight: 500;
            font-size: 16px;
        }
        
        .category-count {
            font-size: 12px;
            color: var(--text-light);
            margin-left: 8px;
        }
        
        .category-amount {
            font-weight: 600;
            color: var(--accent);
        }
        
        .expand-icon {
            transition: transform 0.2s ease;
            color: var(--text-light);
        }
        
        .category-item.expanded .expand-icon {
            transform: rotate(180deg);
        }
        
        .category-details {
            display: none;
            padding: 0 20px 20px;
            border-top: 1px solid var(--border);
            background: #fafafa;
        }
        
        .category-item.expanded .category-details {
            display: block;
        }
        
        .transaction-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .transaction-item:last-child {
            border-bottom: none;
        }
        
        .transaction-subject {
            flex: 1;
            font-size: 14px;
            color: var(--primary);
        }
        
        .transaction-amount {
            font-weight: 500;
            color: var(--secondary);
        }
        
        .transaction-date {
            font-size: 12px;
            color: var(--text-light);
            margin-left: 12px;
        }
        
        /* Empty state */
        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: var(--text-light);
        }
        
        /* Loading and interaction states */
        .category-header:active {
            background: rgba(0,0,0,0.02);
        }
        
        /* Responsive adjustments */
        @media (max-width: 767px) {
            .month-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
            }
            
            .category-header {
                padding: 14px 16px;
            }
            
            .category-details {
                padding: 0 16px 16px;
            }
            
            .insights-panel {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Personal Budget Dashboard</h1>
            <p>Search your spending and track expenses across all months</p>
        </div>
        
        <!-- Search Panel -->
        <div class="search-panel">
            <div class="search-title">
                <span>🔍</span>
                <span>Search Transactions</span>
            </div>
            <input type="text" 
                   class="search-box" 
                   placeholder="Search by recipient, amount, or description (e.g. 'indrive', '250000', 'payment to')" 
                   onkeyup="searchTransactions(this.value)">
            <div class="search-results" id="searchResults"></div>
        </div>
        
        <!-- Insights Panel -->
        <div class="insights-panel">
            <div class="insights-title">
                <span>💡</span>
                <span>Financial Insights</span>
            </div>
            <div class="insights-grid">
                ${insights.map(insight => `
                    <div class="insight-card" onclick="toggleInsight(this)">
                        <div class="insight-header">
                            <span class="insight-icon">${insight.icon}</span>
                            <span class="insight-title">${insight.title}</span>
                        </div>
                        <div class="insight-description">${insight.description}</div>
                        <div class="insight-details">${insight.details}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="months-grid">
            ${processedMonths.map(month => `
                <div class="month-card">
                    <div class="month-header">
                        <h2 class="month-title">${month.month}</h2>
                        <div class="month-total">${formatNGN(month.total)}</div>
                    </div>
                    
                    <div class="sort-controls">
                        <button class="sort-btn active" onclick="sortTransactions(this, 'amount')">💰 By Amount</button>
                        <button class="sort-btn" onclick="sortTransactions(this, 'date')">📅 By Date</button>
                    </div>
                    
                    <div class="category-list">
                        ${month.categories.length > 0 ? month.categories.map(([categoryName, amount]) => {
                          const transactions = month.transactions[categoryName] || [];
                          const categoryKey = categoryName.toLowerCase().replace(/\s+/g, '_');
                          const icon = getCategoryIcon(categoryKey);
                          
                          return `
                            <div class="category-item" data-category="${categoryKey}">
                                <div class="category-header" onclick="toggleCategory(this)">
                                    <div class="category-info">
                                        <span class="category-icon">${icon}</span>
                                        <span class="category-name">${categoryName}</span>
                                        <span class="category-count">(${transactions.length})</span>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 12px;">
                                        <span class="category-amount">${formatNGN(amount)}</span>
                                        <span class="expand-icon">▼</span>
                                    </div>
                                </div>
                                <div class="category-details">
                                    ${transactions.map(tx => `
                                        <div class="transaction-item" data-search="${tx.subject.toLowerCase()} ${Math.round(tx.amount)} ${tx.date} ${categoryName.toLowerCase()}">
                                            <div class="transaction-subject">${tx.subject}</div>
                                            <div style="display: flex; align-items: center;">
                                                <span class="transaction-amount">${formatNGN(tx.amount)}</span>
                                                <span class="transaction-date">${tx.date}</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                          `;
                        }).join('') : `
                            <div class="empty-state">
                                <p>No spending data available for this month</p>
                            </div>
                        `}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
    
    <script>
        // Global transaction data for search
        const allTransactions = [];
        
        // Collect all transactions on page load
        document.addEventListener('DOMContentLoaded', () => {
            const transactionItems = document.querySelectorAll('.transaction-item');
            transactionItems.forEach(item => {
                const subject = item.querySelector('.transaction-subject').textContent;
                const amount = item.querySelector('.transaction-amount').textContent;
                const date = item.querySelector('.transaction-date').textContent;
                const monthCard = item.closest('.month-card');
                const month = monthCard.querySelector('.month-title').textContent;
                const category = item.closest('.category-item').querySelector('.category-name').textContent;
                
                allTransactions.push({
                    subject,
                    amount,
                    date,
                    month,
                    category,
                    element: item
                });
            });
        });
        
        function toggleCategory(element) {
            const categoryItem = element.closest('.category-item');
            categoryItem.classList.toggle('expanded');
        }
        
        function toggleInsight(element) {
            element.classList.toggle('expanded');
        }
        
        function searchTransactions(query) {
            const searchResults = document.getElementById('searchResults');
            
            if (!query.trim()) {
                searchResults.style.display = 'none';
                return;
            }
            
            const searchLower = query.toLowerCase();
            const results = allTransactions.filter(tx => {
                return tx.subject.toLowerCase().includes(searchLower) ||
                       tx.amount.includes(searchLower) ||
                       tx.category.toLowerCase().includes(searchLower) ||
                       tx.month.includes(searchLower) ||
                       tx.date.includes(searchLower);
            });
            
            if (results.length === 0) {
                searchResults.innerHTML = '<div class="search-result-item">No transactions found matching "' + query + '"</div>';
                searchResults.style.display = 'block';
                return;
            }
            
            // Sort by amount (remove currency symbols for sorting)
            results.sort((a, b) => {
                const amountA = parseFloat(a.amount.replace(/[₦,]/g, ''));
                const amountB = parseFloat(b.amount.replace(/[₦,]/g, ''));
                return amountB - amountA;
            });
            
            searchResults.innerHTML = results.slice(0, 10).map((result, index) => {
                const escapedSubject = result.subject.replace(/"/g, '&quot;');
                const escapedMonth = result.month.replace(/"/g, '&quot;');
                return `
                    <div class="search-result-item" data-month="${escapedMonth}" data-subject="${escapedSubject}" onclick="highlightTransactionFromData(this)">
                        <div class="search-result-amount">${result.amount}</div>
                        <div class="search-result-details">${result.subject} - ${result.category} (${result.month})</div>
                    </div>
                `;
            }).join('');
            
            searchResults.style.display = 'block';
        }
        
        function highlightTransactionFromData(element) {
            const month = element.getAttribute('data-month');
            const subject = element.getAttribute('data-subject');
            highlightTransaction(month, subject);
        }
        
        function highlightTransaction(month, subject) {
            // Find and expand the relevant month and category
            const monthCards = document.querySelectorAll('.month-card');
            monthCards.forEach(card => {
                const monthTitle = card.querySelector('.month-title').textContent;
                if (monthTitle === month) {
                    // Scroll to this month
                    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    // Find and expand the category containing this transaction
                    const transactionItems = card.querySelectorAll('.transaction-item');
                    transactionItems.forEach(item => {
                        const txSubject = item.querySelector('.transaction-subject').textContent;
                        if (txSubject === subject) {
                            const categoryItem = item.closest('.category-item');
                            categoryItem.classList.add('expanded');
                            
                            // Highlight the transaction briefly
                            item.style.background = '#fff3cd';
                            setTimeout(() => {
                                item.style.background = '';
                            }, 3000);
                        }
                    });
                }
            });
        }
        
        function sortTransactions(button, sortType) {
            const monthCard = button.closest('.month-card');
            const sortButtons = monthCard.querySelectorAll('.sort-btn');
            const categories = monthCard.querySelectorAll('.category-item');
            
            // Update active button
            sortButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Sort each category's transactions
            categories.forEach(category => {
                const details = category.querySelector('.category-details');
                const transactions = Array.from(details.querySelectorAll('.transaction-item'));
                
                if (sortType === 'amount') {
                    transactions.sort((a, b) => {
                        const amountA = parseFloat(a.querySelector('.transaction-amount').textContent.replace(/[₦,]/g, ''));
                        const amountB = parseFloat(b.querySelector('.transaction-amount').textContent.replace(/[₦,]/g, ''));
                        return amountB - amountA;
                    });
                } else if (sortType === 'date') {
                    transactions.sort((a, b) => {
                        const dateA = new Date(a.querySelector('.transaction-date').textContent);
                        const dateB = new Date(b.querySelector('.transaction-date').textContent);
                        return dateB - dateA;
                    });
                }
                
                // Re-append sorted transactions
                details.innerHTML = '';
                transactions.forEach(transaction => details.appendChild(transaction));
            });
        }
        
        // Everything starts collapsed (removed auto-expand code)
    </script>
</body>
</html>`;

  await fs.writeFile('financial-dashboard.html', html);
  console.log('✅ Enhanced dashboard with search created: financial-dashboard.html');
}

buildDashboard().catch(console.error); 