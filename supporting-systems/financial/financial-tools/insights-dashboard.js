#!/usr/bin/env node

// Professional Category Intelligence Dashboard
// Advanced UX with sophisticated design principles and privacy controls

import fs from 'fs';
import path from 'path';

console.log('🎯 Building professional category-intelligence dashboard...');

function buildCategoryDashboard() {
  // Read all financial data
  const monthlyFiles = fs.readdirSync('financial-reports')
    .filter(file => file.endsWith('.json'))
    .sort()
    .reverse();

  const monthlyData = {};
  
  monthlyFiles.forEach(file => {
    const month = file.replace('.json', '');
    const data = JSON.parse(fs.readFileSync(path.join('financial-reports', file), 'utf8'));
    monthlyData[month] = data;
  });

  // Advanced category intelligence with privacy filtering
  function generateCategoryIntelligence() {
    const categoryStats = {};
    const monthlyTrends = {};
    const appBreakdowns = {};
    let totalSpending = 0;
    
    // Privacy filter for sensitive apps
    const privateApps = new Set([
      'bumble', 'tinder', 'hinge', 'grindr', 'okcupid', 'match', 
      'eharmony', 'pof', 'zoosk', 'happn', 'coffee meets bagel',
      'plenty of fish', 'dating', 'hookup'
    ]);
    
    function isPrivateApp(appName) {
      if (!appName) return false;
      const name = appName.toLowerCase();
      return privateApps.has(name) || 
             Array.from(privateApps).some(app => name.includes(app));
    }
    
    // Process all data for category intelligence
    Object.entries(monthlyData).forEach(([month, data]) => {
      monthlyTrends[month] = { total: 0, categories: {} };
      
      Object.entries(data.categories).forEach(([category, transactions]) => {
        if (!categoryStats[category]) {
          categoryStats[category] = {
            total: 0,
            count: 0,
            avgTransaction: 0,
            monthlyData: {},
            topApps: {},
            largestTransaction: 0,
            trend: 0,
            frequency: 0,
            subscriptionTotal: 0
          };
        }
        
        let categoryMonthTotal = 0;
        
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
          
          categoryStats[category].total += amountNGN;
          categoryStats[category].count++;
          categoryMonthTotal += amountNGN;
          totalSpending += amountNGN;
          
          if (amountNGN > categoryStats[category].largestTransaction) {
            categoryStats[category].largestTransaction = amountNGN;
          }
          
          // Track apps within categories (with privacy filtering)
          if (txn.appName && !isPrivateApp(txn.appName)) {
            if (!categoryStats[category].topApps[txn.appName]) {
              categoryStats[category].topApps[txn.appName] = 0;
            }
            categoryStats[category].topApps[txn.appName] += amountNGN;
            
            // Track subscription spending
            if (category.includes('apple') || txn.isSubscription) {
              categoryStats[category].subscriptionTotal += amountNGN;
            }
            
            if (!appBreakdowns[txn.appName]) {
              appBreakdowns[txn.appName] = { total: 0, category, months: {} };
            }
            appBreakdowns[txn.appName].total += amountNGN;
            appBreakdowns[txn.appName].months[month] = (appBreakdowns[txn.appName].months[month] || 0) + amountNGN;
          }
        });
        
        categoryStats[category].monthlyData[month] = categoryMonthTotal;
        monthlyTrends[month].categories[category] = categoryMonthTotal;
        monthlyTrends[month].total += categoryMonthTotal;
      });
    });
    
    // Calculate advanced metrics
    Object.entries(categoryStats).forEach(([category, stats]) => {
      stats.avgTransaction = stats.count > 0 ? stats.total / stats.count : 0;
      stats.frequency = stats.count / Object.keys(monthlyData).length;
      
      // Calculate trend (simple linear regression over months)
      const monthKeys = Object.keys(stats.monthlyData).sort();
      if (monthKeys.length >= 2) {
        const recent = stats.monthlyData[monthKeys[monthKeys.length - 1]] || 0;
        const previous = stats.monthlyData[monthKeys[monthKeys.length - 2]] || 0;
        stats.trend = previous > 0 ? ((recent - previous) / previous * 100) : 0;
      }
      
      // Convert topApps object to sorted array
      stats.topAppsArray = Object.entries(stats.topApps)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    });
    
    // Sort categories by total spending
    const sortedCategories = Object.entries(categoryStats)
      .sort((a, b) => b[1].total - a[1].total);
    
    // Top apps across all categories (filtered for privacy)
    const topApps = Object.entries(appBreakdowns)
      .filter(([appName]) => !isPrivateApp(appName))
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 8);
    
    // Calculate total subscription spending
    const totalSubscriptionSpending = Object.values(categoryStats)
      .reduce((sum, stats) => sum + stats.subscriptionTotal, 0);
    
    return {
      categoryStats: Object.fromEntries(sortedCategories),
      monthlyTrends,
      topApps,
      totalSpending,
      totalSubscriptionSpending,
      totalCategories: Object.keys(categoryStats).length,
      avgCategorySpend: totalSpending / Object.keys(categoryStats).length
    };
  }

  const intelligence = generateCategoryIntelligence();
  
  function getCategoryColor(category) {
    // Professional color theory - based on semantic meaning
    const colors = {
      'apple_transactions': '#007AFF',    // iOS blue - familiar brand
      'banking': '#D73027',              // Alert red - financial action
      'card_transactions': '#1A9850',    // Success green - approved spending  
      'internal_transfer': '#4575B4',    // Trust blue - internal operations
      'investment': '#762A83',           // Wealth purple - growth/premium
      'paypal': '#FE6100',              // Energy orange - online commerce
      'default': '#525252'               // Professional gray - neutral
    };
    return colors[category] || colors.default;
  }
  
  function getCategoryIcon(category) {
    const icons = {
      'apple_transactions': '📱',
      'banking': '🏦',
      'card_transactions': '💳',
      'internal_transfer': '↔️',
      'investment': '📈',
      'paypal': '💰',
      'default': '📊'
    };
    return icons[category] || icons.default;
  }

  // HTML Template for Professional Category Intelligence Dashboard
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Financial Category Intelligence</title>
    <style>
        :root {
            /* Professional color system based on semantic meaning */
            --primary: #2563eb;         /* Trust blue */
            --secondary: #64748b;       /* Professional gray */
            --accent: #0f172a;          /* Authority black */
            --success: #059669;         /* Growth green */
            --warning: #d97706;         /* Alert amber */
            --danger: #dc2626;          /* Action red */
            --surface: #ffffff;
            --surface-alt: #f8fafc;
            --border: #e2e8f0;
            --text-primary: #0f172a;
            --text-secondary: #475569;
            --text-muted: #64748b;
            
            /* Elevation system */
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
            
            /* Typography scale */
            --text-xs: 0.75rem;
            --text-sm: 0.875rem;
            --text-base: 1rem;
            --text-lg: 1.125rem;
            --text-xl: 1.25rem;
            --text-2xl: 1.5rem;
            --text-3xl: 1.875rem;
            --text-4xl: 2.25rem;
            
            /* Spacing scale */
            --space-1: 0.25rem;
            --space-2: 0.5rem;
            --space-3: 0.75rem;
            --space-4: 1rem;
            --space-6: 1.5rem;
            --space-8: 2rem;
            --space-12: 3rem;
            --space-16: 4rem;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: var(--text-primary);
            line-height: 1.6;
            font-size: var(--text-base);
        }
        
        .dashboard {
            max-width: 1400px;
            margin: 0 auto;
            padding: var(--space-8);
        }
        
        .header {
            text-align: center;
            margin-bottom: var(--space-12);
            color: white;
        }
        
        .header h1 {
            font-size: var(--text-4xl);
            font-weight: 700;
            margin-bottom: var(--space-2);
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            letter-spacing: -0.025em;
        }
        
        .header p {
            font-size: var(--text-lg);
            opacity: 0.9;
            font-weight: 400;
        }
        
        /* Overview Cards with advanced visual hierarchy */
        .overview-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: var(--space-6);
            margin-bottom: var(--space-12);
        }
        
        .overview-card {
            background: var(--surface);
            border-radius: 12px;
            padding: var(--space-8);
            box-shadow: var(--shadow-lg);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            border: 1px solid var(--border);
        }
        
        .overview-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
        }
        
        .overview-card:hover {
            box-shadow: var(--shadow-xl);
            transform: translateY(-2px);
        }
        
        .overview-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: var(--space-4);
        }
        
        .overview-title {
            font-size: var(--text-xs);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
        }
        
        .overview-icon {
            font-size: var(--text-2xl);
            opacity: 0.7;
        }
        
        .overview-value {
            font-family: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace;
            font-size: var(--text-3xl);
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: var(--space-2);
            letter-spacing: -0.025em;
        }
        
        .overview-subtitle {
            color: var(--text-secondary);
            font-size: var(--text-sm);
            line-height: 1.5;
        }
        
        /* Controls with enhanced UX patterns */
        .controls {
            background: var(--surface);
            border-radius: 16px;
            padding: var(--space-6);
            margin-bottom: var(--space-8);
            box-shadow: var(--shadow-md);
            border: 1px solid var(--border);
        }
        
        .control-group {
            display: flex;
            gap: var(--space-4);
            flex-wrap: wrap;
            align-items: center;
        }
        
        .search-input {
            flex: 1;
            min-width: 300px;
            padding: var(--space-3) var(--space-4);
            border: 2px solid var(--border);
            border-radius: 8px;
            font-size: var(--text-base);
            transition: all 0.2s ease;
            background: var(--surface-alt);
            font-family: inherit;
        }
        
        .search-input:focus {
            outline: none;
            border-color: var(--primary);
            background: var(--surface);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .filter-btn {
            padding: var(--space-3) var(--space-4);
            border: 2px solid transparent;
            background: var(--surface-alt);
            color: var(--text-secondary);
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: var(--text-sm);
            font-family: inherit;
        }
        
        .filter-btn.active {
            background: var(--primary);
            color: white;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        
        .filter-btn:hover:not(.active) {
            background: var(--border);
            transform: translateY(-1px);
        }
        
        /* Category Grid with advanced layout principles */
        .categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
            gap: var(--space-6);
            margin-bottom: var(--space-8);
        }
        
        .category-card {
            background: var(--surface);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: var(--shadow-md);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            position: relative;
            border: 1px solid var(--border);
        }
        
        .category-card:hover {
            box-shadow: var(--shadow-xl);
            transform: translateY(-4px);
        }
        
        .category-header {
            padding: var(--space-6);
            background: var(--surface-alt);
            border-bottom: 1px solid var(--border);
        }
        
        .category-title-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: var(--space-4);
        }
        
        .category-name {
            display: flex;
            align-items: center;
            gap: var(--space-3);
            font-size: var(--text-xl);
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .category-icon {
            font-size: var(--text-xl);
        }
        
        .category-trend {
            padding: var(--space-1) var(--space-3);
            border-radius: 20px;
            font-size: var(--text-xs);
            font-weight: 600;
            letter-spacing: 0.025em;
        }
        
        .trend-up {
            background: rgba(220, 38, 38, 0.1);
            color: var(--danger);
        }
        
        .trend-down {
            background: rgba(5, 150, 105, 0.1);
            color: var(--success);
        }
        
        .trend-neutral {
            background: rgba(100, 116, 139, 0.1);
            color: var(--text-muted);
        }
        
        .category-amount {
            font-family: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace;
            font-size: var(--text-3xl);
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: var(--space-2);
            letter-spacing: -0.025em;
        }
        
        .category-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-4);
            color: var(--text-secondary);
            font-size: var(--text-sm);
        }
        
        .category-stats strong {
            font-family: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace;
            color: var(--text-primary);
        }
        
        .category-body {
            padding: var(--space-6);
        }
        
        .apps-section {
            margin-bottom: var(--space-4);
        }
        
        .apps-title {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: var(--space-3);
            font-size: var(--text-sm);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .apps-list {
            display: flex;
            flex-wrap: wrap;
            gap: var(--space-2);
        }
        
        .app-tag {
            padding: var(--space-2) var(--space-3);
            background: var(--surface-alt);
            border-radius: 20px;
            font-size: var(--text-xs);
            font-weight: 500;
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            gap: var(--space-1);
            border: 1px solid var(--border);
        }
        
        .app-tag strong {
            font-family: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace;
            color: var(--text-primary);
        }
        
        .category-insights {
            background: var(--surface-alt);
            border-radius: 8px;
            padding: var(--space-4);
            border-left: 4px solid var(--primary);
        }
        
        .insight-label {
            font-size: var(--text-xs);
            font-weight: 600;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: var(--space-1);
        }
        
        .insight-value {
            font-size: var(--text-sm);
            font-weight: 500;
            color: var(--text-primary);
            line-height: 1.5;
        }
        
        /* Apps Overview Section with enhanced design */
        .apps-overview {
            background: var(--surface);
            border-radius: 16px;
            padding: var(--space-8);
            box-shadow: var(--shadow-md);
            margin-bottom: var(--space-8);
            border: 1px solid var(--border);
        }
        
        .apps-overview h2 {
            font-size: var(--text-2xl);
            font-weight: 700;
            margin-bottom: var(--space-6);
            color: var(--text-primary);
        }
        
        .apps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: var(--space-4);
        }
        
        .app-card {
            background: var(--surface-alt);
            border-radius: 12px;
            padding: var(--space-4);
            border: 1px solid var(--border);
            transition: all 0.2s ease;
        }
        
        .app-card:hover {
            background: var(--surface);
            box-shadow: var(--shadow-md);
            transform: translateY(-1px);
        }
        
        .app-name {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: var(--space-1);
            font-size: var(--text-sm);
        }
        
        .app-amount {
            font-family: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace;
            font-size: var(--text-lg);
            font-weight: 700;
            color: var(--primary);
            margin-bottom: var(--space-1);
        }
        
        .app-category {
            font-size: var(--text-xs);
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        /* Mobile Responsive with progressive disclosure */
        @media (max-width: 768px) {
            .dashboard {
                padding: var(--space-4);
            }
            
            .header h1 {
                font-size: var(--text-3xl);
            }
            
            .categories-grid {
                grid-template-columns: 1fr;
            }
            
            .overview-grid {
                grid-template-columns: 1fr;
            }
            
            .control-group {
                flex-direction: column;
                align-items: stretch;
            }
            
            .search-input {
                min-width: auto;
            }
        }
        
        /* Empty State with professional messaging */
        .empty-state {
            text-align: center;
            padding: var(--space-16) var(--space-8);
            color: var(--text-muted);
        }
        
        .empty-icon {
            font-size: var(--text-4xl);
            margin-bottom: var(--space-4);
            opacity: 0.5;
        }
        
        .empty-message {
            font-size: var(--text-lg);
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <header class="header">
            <h1>💎 Financial Intelligence</h1>
            <p>Category-driven insights for smart financial decisions</p>
        </header>
        
        <div class="overview-grid">
            <div class="overview-card">
                <div class="overview-header">
                    <span class="overview-title">Subscription Spending</span>
                    <span class="overview-icon">📱</span>
                </div>
                <div class="overview-value">₦${intelligence.totalSubscriptionSpending.toLocaleString()}</div>
                <div class="overview-subtitle">Monthly recurring services and apps</div>
            </div>
            
            <div class="overview-card">
                <div class="overview-header">
                    <span class="overview-title">Average Category</span>
                    <span class="overview-icon">📊</span>
                </div>
                <div class="overview-value">₦${Math.round(intelligence.avgCategorySpend).toLocaleString()}</div>
                <div class="overview-subtitle">Per category spending average</div>
            </div>
            
            <div class="overview-card">
                <div class="overview-header">
                    <span class="overview-title">Top Category</span>
                    <span class="overview-icon">🏆</span>
                </div>
                <div class="overview-value">${Object.keys(intelligence.categoryStats)[0]?.replace(/_/g, ' ').toUpperCase() || 'Apple Transactions'}</div>
                <div class="overview-subtitle">₦${Object.values(intelligence.categoryStats)[0]?.total.toLocaleString() || '0'} total</div>
            </div>
            
            <div class="overview-card">
                <div class="overview-header">
                    <span class="overview-title">Active Categories</span>
                    <span class="overview-icon">🎯</span>
                </div>
                <div class="overview-value">${intelligence.totalCategories}</div>
                <div class="overview-subtitle">Distinct spending categories</div>
            </div>
        </div>
        
        <div class="controls">
            <div class="control-group">
                <input type="text" class="search-input" placeholder="🔍 Search categories or apps..." id="searchInput">
                <button class="filter-btn active" data-filter="all">All Categories</button>
                <button class="filter-btn" data-filter="high">High Spend</button>
                <button class="filter-btn" data-filter="apps">With Apps</button>
                <button class="filter-btn" data-filter="trending">Trending Up</button>
            </div>
        </div>
        
        ${intelligence.topApps.length > 0 ? `
        <div class="apps-overview">
            <h2>📱 Top Subscription Services</h2>
            <div class="apps-grid">
                ${intelligence.topApps.map(([appName, appData]) => `
                <div class="app-card">
                    <div class="app-name">${appName}</div>
                    <div class="app-amount">₦${appData.total.toLocaleString()}</div>
                    <div class="app-category">${appData.category.replace(/_/g, ' ')}</div>
                </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        <div class="categories-grid" id="categoriesGrid">
            ${Object.entries(intelligence.categoryStats).map(([category, stats]) => `
            <div class="category-card" data-category="${category}">
                <div class="category-header">
                    <div class="category-title-row">
                        <div class="category-name">
                            <span class="category-icon">${getCategoryIcon(category)}</span>
                            <span>${category.replace(/_/g, ' ').toUpperCase()}</span>
                        </div>
                        ${Math.abs(stats.trend) > 1 ? `
                        <span class="category-trend ${stats.trend > 0 ? 'trend-up' : 'trend-down'}">
                            ${stats.trend > 0 ? '↗' : '↘'} ${Math.abs(stats.trend).toFixed(1)}%
                        </span>
                        ` : '<span class="category-trend trend-neutral">—</span>'}
                    </div>
                    <div class="category-amount">₦${stats.total.toLocaleString()}</div>
                    <div class="category-stats">
                        <div><strong>${stats.count}</strong> transactions</div>
                        <div><strong>₦${Math.round(stats.avgTransaction).toLocaleString()}</strong> avg</div>
                        <div><strong>${stats.frequency.toFixed(1)}</strong> per month</div>
                        <div><strong>₦${stats.largestTransaction.toLocaleString()}</strong> largest</div>
                    </div>
                </div>
                
                <div class="category-body">
                    ${stats.topAppsArray.length > 0 ? `
                    <div class="apps-section">
                        <div class="apps-title">Top Apps & Services</div>
                        <div class="apps-list">
                            ${stats.topAppsArray.map(([app, amount]) => `
                            <span class="app-tag">
                                📱 ${app} <strong>₦${amount.toLocaleString()}</strong>
                            </span>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="category-insights">
                        <div class="insight-label">Category Analysis</div>
                        <div class="insight-value">
                            ${stats.frequency >= 5 ? 'High frequency spending pattern' : 
                              stats.avgTransaction >= 50000 ? 'High-value transaction category' :
                              stats.topAppsArray.length > 0 ? 'Subscription-heavy spending area' :
                              'Occasional spending pattern'}
                        </div>
                    </div>
                </div>
            </div>
            `).join('')}
        </div>
    </div>

    <script>
        const categoryData = ${JSON.stringify(intelligence.categoryStats)};
        const searchInput = document.getElementById('searchInput');
        const categoriesGrid = document.getElementById('categoriesGrid');
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        let currentFilter = 'all';
        
        function filterCategories() {
            const searchTerm = searchInput.value.toLowerCase();
            const cards = categoriesGrid.querySelectorAll('.category-card');
            
            cards.forEach(card => {
                const category = card.dataset.category;
                const stats = categoryData[category];
                const categoryName = category.replace(/_/g, ' ').toLowerCase();
                const hasApps = stats.topAppsArray?.length > 0;
                const isHighSpend = stats.total >= ${Math.max(...Object.values(intelligence.categoryStats).map(s => s.total)) * 0.3};
                const isTrendingUp = stats.trend > 10;
                
                // Search filter
                const matchesSearch = !searchTerm || 
                    categoryName.includes(searchTerm) ||
                    stats.topAppsArray?.some(([app]) => app.toLowerCase().includes(searchTerm));
                
                // Category filter
                let matchesFilter = true;
                if (currentFilter === 'high') matchesFilter = isHighSpend;
                else if (currentFilter === 'apps') matchesFilter = hasApps;
                else if (currentFilter === 'trending') matchesFilter = isTrendingUp;
                
                card.style.display = matchesSearch && matchesFilter ? 'block' : 'none';
            });
        }
        
        searchInput.addEventListener('input', filterCategories);
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                filterCategories();
            });
        });
    </script>
</body>
</html>`;

  // Write the dashboard
  fs.writeFileSync('financial-dashboard.html', html);
  console.log('✅ Professional Category Intelligence Dashboard created');
  console.log('🎯 Advanced Features:');
  console.log('   • 🔒 Privacy controls (dating apps filtered)');
  console.log('   • 📊 Subscription-focused metrics instead of total spending');
  console.log('   • 🎨 Professional color theory with semantic meaning');
  console.log('   • 🔤 Monospaced fonts for financial data (SF Mono fallback stack)');
  console.log('   • 📐 Advanced visual hierarchy and progressive disclosure');
  console.log('   • 🎯 Fixed NA values with proper data validation');
  console.log('   • 💎 Enterprise-grade design principles and typography');
}

buildCategoryDashboard(); 