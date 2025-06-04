#!/usr/bin/env node

// Enhanced Financial Dashboard Builder
// Includes app name search and improved insights

import fs from 'fs';
import path from 'path';

console.log('🎨 Building enhanced financial dashboard...');

function buildEnhancedDashboard() {
  // Read all financial data
  const monthlyFiles = fs.readdirSync('financial-reports')
    .filter(file => file.endsWith('.json'))
    .sort()
    .reverse(); // Most recent first

  const monthlyData = {};
  
  monthlyFiles.forEach(file => {
    const month = file.replace('.json', '');
    const data = JSON.parse(fs.readFileSync(path.join('financial-reports', file), 'utf8'));
    monthlyData[month] = data;
  });

  // Enhanced search index including app names
  function buildSearchIndex() {
    const searchIndex = [];
    
    Object.entries(monthlyData).forEach(([month, data]) => {
      Object.entries(data.categories).forEach(([category, transactions]) => {
        transactions.forEach(txn => {
          let amountNGN = 0;
          if (txn.amounts && txn.currencies) {
            const amount = parseFloat(txn.amounts[0]);
            const currency = txn.currencies[0];
            
            if (currency === '$') amountNGN = amount * 1583;
            else if (currency === '£') amountNGN = amount * 2000;
            else if (currency === '€') amountNGN = amount * 1700;
            else amountNGN = amount;
          }
          
          // Build searchable text including app names
          const searchText = [
            txn.subject,
            txn.appName,
            txn.description,
            category,
            txn.from,
            month
          ].filter(Boolean).join(' ').toLowerCase();
          
          searchIndex.push({
            month,
            category,
            subject: txn.subject,
            appName: txn.appName,
            amount: `₦${amountNGN.toLocaleString()}`,
            date: txn.date,
            searchText
          });
        });
      });
    });
    
    return searchIndex;
  }

  const searchIndex = buildSearchIndex();
  
  // Generate insights
  function generateInsights() {
    const insights = [];
    let totalSpending = 0;
    const categoryTotals = {};
    const appTotals = {};
    
    Object.entries(monthlyData).forEach(([month, data]) => {
      Object.entries(data.categories).forEach(([category, transactions]) => {
        transactions.forEach(txn => {
          let amountNGN = 0;
          if (txn.amounts && txn.currencies) {
            const amount = parseFloat(txn.amounts[0]);
            const currency = txn.currencies[0];
            
            if (currency === '$') amountNGN = amount * 1583;
            else if (currency === '£') amountNGN = amount * 2000;
            else if (currency === '€') amountNGN = amount * 1700;
            else amountNGN = amount;
          }
          
          totalSpending += amountNGN;
          categoryTotals[category] = (categoryTotals[category] || 0) + amountNGN;
          
          if (txn.appName) {
            appTotals[txn.appName] = (appTotals[txn.appName] || 0) + amountNGN;
          }
        });
      });
    });
    
    // Top spending categories
    const topCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat, amount]) => ({ category: cat, amount }));
    
    // Top apps
    const topApps = Object.entries(appTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([app, amount]) => ({ app, amount }));
    
    insights.push({
      title: 'Total Spending',
      value: `₦${totalSpending.toLocaleString()}`,
      icon: '💰',
      type: 'total'
    });
    
    insights.push({
      title: 'Top Category',
      value: topCategories[0] ? `${topCategories[0].category} (₦${topCategories[0].amount.toLocaleString()})` : 'N/A',
      icon: '📊',
      type: 'category'
    });
    
    if (topApps.length > 0) {
      insights.push({
        title: 'Top App Subscription',
        value: `${topApps[0].app} (₦${topApps[0].amount.toLocaleString()})`,
        icon: '📱',
        type: 'app'
      });
    }
    
    insights.push({
      title: 'Active Months',
      value: `${Object.keys(monthlyData).length} months`,
      icon: '📅',
      type: 'period'
    });
    
    return { insights, topCategories, topApps };
  }

  const { insights, topCategories, topApps } = generateInsights();

  // HTML Template
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced Financial Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .dashboard {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            color: white;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .search-container {
            background: white;
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        
        .search-input {
            width: 100%;
            padding: 15px 20px;
            font-size: 16px;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            outline: none;
            transition: border-color 0.3s;
        }
        
        .search-input:focus {
            border-color: #667eea;
        }
        
        .search-results {
            margin-top: 15px;
            max-height: 300px;
            overflow-y: auto;
        }
        
        .search-result-item {
            padding: 12px;
            border: 1px solid #e1e5e9;
            border-radius: 8px;
            margin-bottom: 8px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .search-result-item:hover {
            background: #f8f9ff;
            border-color: #667eea;
        }
        
        .search-result-amount {
            font-weight: bold;
            color: #667eea;
        }
        
        .search-result-details {
            font-size: 14px;
            color: #666;
            margin-top: 4px;
        }
        
        .insights-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .insight-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        
        .insight-card:hover {
            transform: translateY(-5px);
        }
        
        .insight-icon {
            font-size: 2.5rem;
            margin-bottom: 15px;
        }
        
        .insight-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
        }
        
        .insight-title {
            color: #666;
            font-size: 14px;
        }
        
        .month-section {
            background: white;
            border-radius: 15px;
            margin-bottom: 25px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        
        .month-header {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 20px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background 0.3s;
        }
        
        .month-header:hover {
            background: linear-gradient(135deg, #5a6fd8, #6a419a);
        }
        
        .month-header h2 {
            font-size: 1.5rem;
        }
        
        .month-stats {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .month-content {
            display: none;
            padding: 20px;
        }
        
        .month-content.expanded {
            display: block;
        }
        
        .controls {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        
        .control-button {
            padding: 8px 16px;
            border: 1px solid #667eea;
            background: white;
            color: #667eea;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
        }
        
        .control-button:hover,
        .control-button.active {
            background: #667eea;
            color: white;
        }
        
        .category-section {
            margin-bottom: 25px;
        }
        
        .category-header {
            background: #f8f9ff;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .category-name {
            font-weight: bold;
            color: #333;
            text-transform: capitalize;
        }
        
        .category-count {
            background: #667eea;
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 12px;
        }
        
        .transactions {
            display: grid;
            gap: 12px;
        }
        
        .transaction {
            background: #fafbff;
            border: 1px solid #e1e5e9;
            border-radius: 10px;
            padding: 15px;
            transition: all 0.3s;
        }
        
        .transaction:hover {
            border-color: #667eea;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
        }
        
        .transaction.highlighted {
            border-color: #ff6b6b;
            background: #fff5f5;
            box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);
        }
        
        .transaction-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .transaction-subject {
            font-weight: 600;
            color: #333;
        }
        
        .transaction-amount {
            font-weight: bold;
            color: #667eea;
        }
        
        .transaction-details {
            font-size: 14px;
            color: #666;
        }
        
        .transaction-meta {
            font-size: 12px;
            color: #999;
            margin-top: 8px;
            display: flex;
            justify-content: space-between;
        }
        
        @media (max-width: 768px) {
            .dashboard {
                padding: 10px;
            }
            
            .insights-grid {
                grid-template-columns: 1fr;
            }
            
            .controls {
                flex-direction: column;
            }
            
            .month-header {
                padding: 15px;
            }
            
            .month-header h2 {
                font-size: 1.2rem;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="header">
            <h1>📊 Financial Dashboard</h1>
            <p>Enhanced with app search & insights</p>
        </div>
        
        <div class="search-container">
            <input type="text" class="search-input" placeholder="🔍 Search transactions (try: ChatGPT, Bumble, Cal AI, YouTube Music, etc.)" id="searchInput">
            <div class="search-results" id="searchResults"></div>
        </div>
        
        <div class="insights-grid">
            ${insights.map(insight => `
                <div class="insight-card">
                    <div class="insight-icon">${insight.icon}</div>
                    <div class="insight-value">${insight.value}</div>
                    <div class="insight-title">${insight.title}</div>
                </div>
            `).join('')}
        </div>
        
        ${Object.entries(monthlyData).map(([month, data]) => {
            const totalAmount = Object.values(data.categories).flat().reduce((sum, txn) => {
                let amountNGN = 0;
                if (txn.amounts && txn.currencies) {
                    const amount = parseFloat(txn.amounts[0]);
                    const currency = txn.currencies[0];
                    
                    if (currency === '$') amountNGN = amount * 1583;
                    else if (currency === '£') amountNGN = amount * 2000;
                    else if (currency === '€') amountNGN = amount * 1700;
                    else amountNGN = amount;
                }
                return sum + amountNGN;
            }, 0);
            
            return `
                <div class="month-section">
                    <div class="month-header" onclick="toggleMonth('${month}')">
                        <h2>${new Date(month + '-01').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h2>
                        <div class="month-stats">
                            ${data.summary.totalTransactions} transactions • ₦${totalAmount.toLocaleString()}
                        </div>
                    </div>
                    <div class="month-content" id="month-${month}">
                        <div class="controls">
                            <button class="control-button active" onclick="sortTransactions('${month}', 'date')">Sort by Date</button>
                            <button class="control-button" onclick="sortTransactions('${month}', 'amount')">Sort by Amount</button>
                        </div>
                        
                        ${Object.entries(data.categories).map(([category, transactions]) => `
                            <div class="category-section">
                                <div class="category-header">
                                    <span class="category-name">${category.replace(/_/g, ' ')}</span>
                                    <span class="category-count">${transactions.length}</span>
                                </div>
                                <div class="transactions" id="transactions-${month}-${category}">
                                    ${transactions.map(txn => {
                                        let amountNGN = 0;
                                        if (txn.amounts && txn.currencies) {
                                            const amount = parseFloat(txn.amounts[0]);
                                            const currency = txn.currencies[0];
                                            
                                            if (currency === '$') amountNGN = amount * 1583;
                                            else if (currency === '£') amountNGN = amount * 2000;
                                            else if (currency === '€') amountNGN = amount * 1700;
                                            else amountNGN = amount;
                                        }
                                        
                                        return `
                                            <div class="transaction" data-subject="${txn.subject}" data-amount="${amountNGN}" data-date="${txn.date}">
                                                <div class="transaction-header">
                                                    <span class="transaction-subject">${txn.subject}</span>
                                                    <span class="transaction-amount">₦${amountNGN.toLocaleString()}</span>
                                                </div>
                                                <div class="transaction-details">${txn.description || 'No description'}</div>
                                                <div class="transaction-meta">
                                                    <span>From: ${txn.from}</span>
                                                    <span>${new Date(txn.date).toLocaleDateString('en-GB')}</span>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('')}
    </div>

    <script>
        // Search data
        const searchData = ${JSON.stringify(searchIndex)};
        
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                return;
            }
            
            const results = searchData.filter(item => 
                item.searchText.includes(query)
            ).slice(0, 10);
            
            if (results.length === 0) {
                searchResults.innerHTML = '<div style="padding: 15px; text-align: center; color: #666;">No transactions found</div>';
                return;
            }
            
            searchResults.innerHTML = results.map(result => {
                const appText = result.appName ? ` • ${result.appName}` : '';
                return `
                    <div class="search-result-item" data-month="${result.month}" data-subject="${result.subject}" onclick="highlightTransaction(this)">
                        <div class="search-result-amount">${result.amount}</div>
                        <div class="search-result-details">${result.subject}${appText} - ${result.category} (${result.month})</div>
                    </div>
                `;
            }).join('');
        });
        
        // Highlight transaction
        function highlightTransaction(element) {
            const month = element.dataset.month;
            const subject = element.dataset.subject;
            
            // Open the month section
            const monthContent = document.getElementById(`month-${month}`);
            if (monthContent) {
                monthContent.classList.add('expanded');
            }
            
            // Clear previous highlights
            document.querySelectorAll('.transaction.highlighted').forEach(t => {
                t.classList.remove('highlighted');
            });
            
            // Find and highlight the transaction
            const transactions = document.querySelectorAll('.transaction');
            transactions.forEach(txn => {
                if (txn.dataset.subject === subject) {
                    txn.classList.add('highlighted');
                    txn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
            
            // Clear search
            searchInput.value = '';
            searchResults.innerHTML = '';
        }
        
        // Toggle month sections
        function toggleMonth(month) {
            const content = document.getElementById(`month-${month}`);
            content.classList.toggle('expanded');
        }
        
        // Sort transactions
        function sortTransactions(month, sortBy) {
            // Update button states
            const monthContent = document.getElementById(`month-${month}`);
            const buttons = monthContent.querySelectorAll('.control-button');
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            // Sort logic for each category in the month
            const categories = monthContent.querySelectorAll('.category-section');
            categories.forEach(categorySection => {
                const transactionsContainer = categorySection.querySelector('.transactions');
                const transactions = Array.from(transactionsContainer.querySelectorAll('.transaction'));
                
                transactions.sort((a, b) => {
                    if (sortBy === 'amount') {
                        return parseFloat(b.dataset.amount) - parseFloat(a.dataset.amount);
                    } else {
                        return new Date(b.dataset.date) - new Date(a.dataset.date);
                    }
                });
                
                // Re-append sorted transactions
                transactions.forEach(txn => transactionsContainer.appendChild(txn));
            });
        }
    </script>
</body>
</html>`;

  // Write the dashboard
  fs.writeFileSync('financial-dashboard.html', html);
  console.log('✅ Enhanced dashboard created: financial-dashboard.html');
  console.log('🔹 Features:');
  console.log('   • Search by app name (ChatGPT, Bumble, etc.)');
  console.log('   • Enhanced insights with app spending');
  console.log('   • Fixed categorisation logic');
  console.log('   • Better transaction highlighting');
}

buildEnhancedDashboard(); 