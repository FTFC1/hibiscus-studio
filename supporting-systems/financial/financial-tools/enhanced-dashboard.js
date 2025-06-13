#!/usr/bin/env node

/**
 * 🔹 Enhanced Budget Dashboard with Search
 * Fixed template literal issues and improved UX
 */

import fs from 'fs/promises';

async function buildDashboard() {
  console.log('🔹 Building enhanced budget dashboard with search...');
  
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
  
  function toNGN(amount, currency) {
    if (!amount || isNaN(amount)) return 0;
    const cleanAmount = parseFloat(amount);
    if (cleanAmount <= 0) return 0;
    
    const rates = { '₦': 1, '$': 1583, '£': 2000, '€': 1700 };
    return cleanAmount * (rates[currency] || rates['$']);
  }
  
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
  
  function getCategoryIcon(category) {
    const icons = {
      'banking': '🏦', 'transport': '🚗', 'ai_tools': '🤖',
      'apple_apps': '📱', 'apple_one': '🍎', 'apple_icloud': '☁️',
      'apple_music': '🎵', 'apple_tv': '📺', 'food': '🍽️',
      'entertainment': '🎬', 'personal_services': '👨‍💼', 'other': '📄'
    };
    return icons[category] || '💰';
  }
  
  function formatNGN(amount) {
    return `₦${Math.round(amount).toLocaleString('en-GB')}`;
  }

  // Process all monthly data
  const processedMonths = monthlyData.map(month => {
    const categoryTotals = {};
    const categoryTransactions = {};
    let monthTotal = 0;
    
    Object.entries(month.categories).forEach(([category, transactions]) => {
      if (category === 'internal_transfer') return;
      
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
        categoryTransactions[formattedCategory] = categoryDetails.sort((a, b) => b.amount - a.amount);
        monthTotal += categoryTotal;
      }
    });
    
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    
    return {
      month: month.month,
      total: monthTotal,
      categories: sortedCategories,
      transactions: categoryTransactions
    };
  });
  
  processedMonths.sort((a, b) => new Date(b.month) - new Date(a.month));

  // Create HTML with proper JavaScript
  const html = `<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Personal Budget Dashboard</title>
    <style>
        :root {
            --primary: #1a1a1a; --secondary: #666; --accent: #007aff;
            --background: #ffffff; --surface: #f8f9fa; --border: #e1e1e1;
            --text-light: #8e8e93; --shadow: rgba(0,0,0,0.08);
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            line-height: 1.6; color: var(--primary); background: var(--background);
        }
        
        .container { max-width: 1400px; margin: 0 auto; padding: 40px; }
        
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { font-size: 32px; font-weight: 600; margin-bottom: 8px; }
        .header p { color: var(--secondary); }
        
        .search-panel {
            background: var(--surface); border-radius: 16px;
            padding: 24px; margin-bottom: 24px; border: 1px solid var(--border);
        }
        
        .search-title {
            font-size: 18px; font-weight: 600; margin-bottom: 16px;
            display: flex; align-items: center; gap: 8px;
        }
        
        .search-box {
            width: 100%; padding: 12px 16px; border: 1px solid var(--border);
            border-radius: 12px; font-size: 16px; background: var(--background);
        }
        
        .search-box:focus {
            outline: none; border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
        }
        
        .search-results { margin-top: 16px; display: none; }
        
        .search-result-item {
            padding: 12px; border-radius: 8px; background: var(--background);
            border: 1px solid var(--border); margin-bottom: 8px; cursor: pointer;
        }
        
        .search-result-amount { font-weight: 600; color: var(--accent); }
        .search-result-details { font-size: 14px; color: var(--secondary); margin-top: 4px; }
        
        .months-grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); gap: 24px;
        }
        
        .month-card {
            background: var(--surface); border-radius: 16px; padding: 24px;
            box-shadow: 0 4px 20px var(--shadow); border: 1px solid var(--border);
        }
        
        .month-header {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid var(--border);
        }
        
        .month-title { font-size: 20px; font-weight: 600; }
        .month-total { font-size: 18px; font-weight: 600; color: var(--accent); }
        
        .sort-controls { display: flex; gap: 8px; margin-bottom: 16px; }
        
        .sort-btn {
            padding: 8px 16px; border: 1px solid var(--border);
            background: var(--background); border-radius: 8px; font-size: 14px;
            cursor: pointer; transition: all 0.2s ease;
        }
        
        .sort-btn.active { background: var(--accent); color: white; border-color: var(--accent); }
        
        .category-item {
            background: var(--background); border-radius: 12px;
            border: 1px solid var(--border); margin-bottom: 8px; overflow: hidden;
        }
        
        .category-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 16px 20px; cursor: pointer; user-select: none;
        }
        
        .category-info { display: flex; align-items: center; gap: 12px; }
        .category-icon { font-size: 24px; }
        .category-name { font-weight: 500; font-size: 16px; }
        .category-count { font-size: 12px; color: var(--text-light); margin-left: 8px; }
        .category-amount { font-weight: 600; color: var(--accent); }
        
        .expand-icon { transition: transform 0.2s ease; color: var(--text-light); }
        .category-item.expanded .expand-icon { transform: rotate(180deg); }
        
        .category-details {
            display: none; padding: 0 20px 20px; border-top: 1px solid var(--border);
            background: #fafafa;
        }
        
        .category-item.expanded .category-details { display: block; }
        
        .transaction-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 12px 0; border-bottom: 1px solid #f0f0f0;
        }
        
        .transaction-item:last-child { border-bottom: none; }
        .transaction-subject { flex: 1; font-size: 14px; color: var(--primary); }
        .transaction-amount { font-weight: 500; color: var(--secondary); }
        .transaction-date { font-size: 12px; color: var(--text-light); margin-left: 12px; }
        
        .highlighted { background: #fff3cd !important; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Personal Budget Dashboard</h1>
            <p>Search your spending and track expenses across all months</p>
        </div>
        
        <div class="search-panel">
            <div class="search-title">
                <span>🔍</span>
                <span>Search Transactions</span>
            </div>
            <input type="text" class="search-box" 
                   placeholder="Search by recipient, amount, or description (e.g. 'indrive', '250000', 'payment to')" 
                   onkeyup="searchTransactions(this.value)">
            <div class="search-results" id="searchResults"></div>
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
                                        <div class="transaction-item" 
                                             data-search="${tx.subject.toLowerCase()} ${Math.round(tx.amount)} ${tx.date} ${categoryName.toLowerCase()}"
                                             data-month="${month.month}"
                                             data-subject="${tx.subject.replace(/"/g, '&quot;')}">
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
        let allTransactions = [];
        
        document.addEventListener('DOMContentLoaded', function() {
            const transactionItems = document.querySelectorAll('.transaction-item');
            transactionItems.forEach(function(item) {
                const subject = item.querySelector('.transaction-subject').textContent;
                const amount = item.querySelector('.transaction-amount').textContent;
                const date = item.querySelector('.transaction-date').textContent;
                const month = item.getAttribute('data-month');
                const category = item.closest('.category-item').querySelector('.category-name').textContent;
                
                allTransactions.push({
                    subject: subject,
                    amount: amount,
                    date: date,
                    month: month,
                    category: category,
                    element: item
                });
            });
        });
        
        function toggleCategory(element) {
            const categoryItem = element.closest('.category-item');
            categoryItem.classList.toggle('expanded');
        }
        
        function searchTransactions(query) {
            const searchResults = document.getElementById('searchResults');
            
            if (!query.trim()) {
                searchResults.style.display = 'none';
                return;
            }
            
            const searchLower = query.toLowerCase();
            const results = allTransactions.filter(function(tx) {
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
            
            results.sort(function(a, b) {
                const amountA = parseFloat(a.amount.replace(/[₦,]/g, ''));
                const amountB = parseFloat(b.amount.replace(/[₦,]/g, ''));
                return amountB - amountA;
            });
            
            let resultsHTML = '';
            for (let i = 0; i < Math.min(results.length, 10); i++) {
                const result = results[i];
                resultsHTML += '<div class="search-result-item" onclick="highlightTransaction(' + 
                              "'" + result.month + "', '" + result.subject.replace(/'/g, "\\\\'") + "')" + '">' +
                              '<div class="search-result-amount">' + result.amount + '</div>' +
                              '<div class="search-result-details">' + result.subject + ' - ' + result.category + ' (' + result.month + ')</div>' +
                              '</div>';
            }
            
            searchResults.innerHTML = resultsHTML;
            searchResults.style.display = 'block';
        }
        
        function highlightTransaction(month, subject) {
            // Clear previous highlights
            document.querySelectorAll('.highlighted').forEach(function(el) {
                el.classList.remove('highlighted');
            });
            
            const monthCards = document.querySelectorAll('.month-card');
            monthCards.forEach(function(card) {
                const monthTitle = card.querySelector('.month-title').textContent;
                if (monthTitle === month) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    const transactionItems = card.querySelectorAll('.transaction-item');
                    transactionItems.forEach(function(item) {
                        const txSubject = item.querySelector('.transaction-subject').textContent;
                        if (txSubject === subject) {
                            const categoryItem = item.closest('.category-item');
                            categoryItem.classList.add('expanded');
                            
                            item.classList.add('highlighted');
                            setTimeout(function() {
                                item.classList.remove('highlighted');
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
            
            sortButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            categories.forEach(function(category) {
                const details = category.querySelector('.category-details');
                const transactions = Array.from(details.querySelectorAll('.transaction-item'));
                
                if (sortType === 'amount') {
                    transactions.sort(function(a, b) {
                        const amountA = parseFloat(a.querySelector('.transaction-amount').textContent.replace(/[₦,]/g, ''));
                        const amountB = parseFloat(b.querySelector('.transaction-amount').textContent.replace(/[₦,]/g, ''));
                        return amountB - amountA;
                    });
                } else if (sortType === 'date') {
                    transactions.sort(function(a, b) {
                        const dateA = new Date(a.querySelector('.transaction-date').textContent);
                        const dateB = new Date(b.querySelector('.transaction-date').textContent);
                        return dateB - dateA;
                    });
                }
                
                details.innerHTML = '';
                transactions.forEach(function(transaction) {
                    details.appendChild(transaction);
                });
            });
        }
    </script>
</body>
</html>`;

  await fs.writeFile('financial-dashboard.html', html);
  console.log('✅ Enhanced dashboard with search created: financial-dashboard.html');
}

buildDashboard().catch(console.error); 