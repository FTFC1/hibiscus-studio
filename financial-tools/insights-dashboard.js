#!/usr/bin/env node

// Category-First Financial Intelligence Dashboard
// Advanced UX with category rollups and sophisticated insights

import fs from 'fs';
import path from 'path';

console.log('🎯 Building category-intelligence dashboard...');

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

  // Advanced category intelligence
  function generateCategoryIntelligence() {
    const categoryStats = {};
    const monthlyTrends = {};
    const appBreakdowns = {};
    let totalSpending = 0;
    
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
            frequency: 0
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
          
          // Track apps within categories
          if (txn.appName) {
            if (!categoryStats[category].topApps[txn.appName]) {
              categoryStats[category].topApps[txn.appName] = 0;
            }
            categoryStats[category].topApps[txn.appName] += amountNGN;
            
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
      stats.avgTransaction = stats.total / stats.count;
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
    
    // Top apps across all categories
    const topApps = Object.entries(appBreakdowns)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 8);
    
    return {
      categoryStats: Object.fromEntries(sortedCategories),
      monthlyTrends,
      topApps,
      totalSpending,
      totalCategories: Object.keys(categoryStats).length,
      avgCategorySpend: totalSpending / Object.keys(categoryStats).length
    };
  }

  const intelligence = generateCategoryIntelligence();
  
  // Category color mapping
  const categoryColors = {
    'apple_transactions': '#007AFF',
    'banking': '#FF3B30',
    'card_transactions': '#34C759',
    'internal_transfer': '#FF9500',
    'investment': '#AF52DE',
    'paypal': '#0070BA',
    'default': '#8E8E93'
  };
  
  function getCategoryColor(category) {
    return categoryColors[category] || categoryColors.default;
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

  // HTML Template for Category Intelligence Dashboard
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Financial Category Intelligence</title>
    <style>
        :root {
            --primary: #6366f1;
            --secondary: #8b5cf6;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --surface: #ffffff;
            --background: #f8fafc;
            --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --card-shadow-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #1e293b;
        }
        
        .dashboard {
            max-width: 1600px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
            color: white;
        }
        
        .header h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .header p {
            font-size: 1.25rem;
            opacity: 0.9;
        }
        
        /* Overview Cards */
        .overview-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }
        
        .overview-card {
            background: var(--surface);
            border-radius: 16px;
            padding: 2rem;
            box-shadow: var(--card-shadow);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .overview-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
        }
        
        .overview-card:hover {
            box-shadow: var(--card-shadow-hover);
            transform: translateY(-2px);
        }
        
        .overview-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
        }
        
        .overview-title {
            font-size: 0.875rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #64748b;
        }
        
        .overview-icon {
            font-size: 2rem;
            opacity: 0.8;
        }
        
        .overview-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 0.5rem;
        }
        
        .overview-subtitle {
            color: #64748b;
            font-size: 0.875rem;
        }
        
        /* Controls */
        .controls {
            background: var(--surface);
            border-radius: 16px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            box-shadow: var(--card-shadow);
        }
        
        .control-group {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            align-items: center;
        }
        
        .search-input {
            flex: 1;
            min-width: 300px;
            padding: 0.75rem 1rem;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
            background: #f8fafc;
        }
        
        .search-input:focus {
            outline: none;
            border-color: var(--primary);
            background: white;
        }
        
        .filter-btn {
            padding: 0.75rem 1rem;
            border: 2px solid transparent;
            background: #f1f5f9;
            color: #475569;
            border-radius: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .filter-btn.active {
            background: var(--primary);
            color: white;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
        
        .filter-btn:hover:not(.active) {
            background: #e2e8f0;
        }
        
        /* Category Grid */
        .categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .category-card {
            background: var(--surface);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: var(--card-shadow);
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
        }
        
        .category-card:hover {
            box-shadow: var(--card-shadow-hover);
            transform: translateY(-4px);
        }
        
        .category-header {
            padding: 1.5rem;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-bottom: 1px solid #e2e8f0;
        }
        
        .category-title-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
        }
        
        .category-name {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.25rem;
            font-weight: 600;
            color: #0f172a;
        }
        
        .category-icon {
            font-size: 1.5rem;
        }
        
        .category-trend {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .trend-up {
            background: #fee2e2;
            color: #dc2626;
        }
        
        .trend-down {
            background: #d1fae5;
            color: #059669;
        }
        
        .trend-neutral {
            background: #f3f4f6;
            color: #6b7280;
        }
        
        .category-amount {
            font-size: 2rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 0.5rem;
        }
        
        .category-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            color: #64748b;
            font-size: 0.875rem;
        }
        
        .category-body {
            padding: 1.5rem;
        }
        
        .apps-section {
            margin-bottom: 1rem;
        }
        
        .apps-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.75rem;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .apps-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .app-tag {
            padding: 0.375rem 0.75rem;
            background: #f1f5f9;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 500;
            color: #475569;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        
        .category-insights {
            background: #f8fafc;
            border-radius: 8px;
            padding: 1rem;
            border-left: 4px solid var(--primary);
        }
        
        .insight-label {
            font-size: 0.75rem;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.25rem;
        }
        
        .insight-value {
            font-size: 1rem;
            font-weight: 600;
            color: #0f172a;
        }
        
        /* Apps Overview Section */
        .apps-overview {
            background: var(--surface);
            border-radius: 16px;
            padding: 2rem;
            box-shadow: var(--card-shadow);
            margin-bottom: 2rem;
        }
        
        .apps-overview h2 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            color: #0f172a;
        }
        
        .apps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .app-card {
            background: #f8fafc;
            border-radius: 12px;
            padding: 1rem;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
        }
        
        .app-card:hover {
            background: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .app-name {
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 0.25rem;
        }
        
        .app-amount {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 0.25rem;
        }
        
        .app-category {
            font-size: 0.75rem;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
            .dashboard {
                padding: 1rem;
            }
            
            .header h1 {
                font-size: 2rem;
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
        
        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            color: #64748b;
        }
        
        .empty-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            opacity: 0.5;
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
                    <span class="overview-title">Total Spending</span>
                    <span class="overview-icon">💰</span>
                </div>
                <div class="overview-value">₦${intelligence.totalSpending.toLocaleString()}</div>
                <div class="overview-subtitle">Across ${intelligence.totalCategories} spending categories</div>
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
                <div class="overview-value">${Object.keys(intelligence.categoryStats)[0]?.replace(/_/g, ' ').toUpperCase() || 'N/A'}</div>
                <div class="overview-subtitle">₦${Object.values(intelligence.categoryStats)[0]?.total.toLocaleString() || '0'} total</div>
            </div>
            
            <div class="overview-card">
                <div class="overview-header">
                    <span class="overview-title">Active Apps</span>
                    <span class="overview-icon">📱</span>
                </div>
                <div class="overview-value">${intelligence.topApps.length}</div>
                <div class="overview-subtitle">Subscription & app services</div>
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
                        ${stats.trend !== 0 ? `
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
                        <div class="insight-label">Category Insights</div>
                        <div class="insight-value">
                            ${stats.frequency >= 5 ? 'High frequency spending' : 
                              stats.avgTransaction >= 50000 ? 'High-value transactions' :
                              stats.topAppsArray.length > 0 ? 'Subscription-heavy category' :
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
  console.log('✅ Category Intelligence Dashboard created');
  console.log('🎯 Advanced Features:');
  console.log('   • 📊 Category-first design with rollups');
  console.log('   • 🧠 Intelligence insights per category');
  console.log('   • 📱 App breakdowns within categories');
  console.log('   • 📈 Trend analysis and frequency patterns');
  console.log('   • 🔍 Smart filtering (High Spend, Apps, Trending)');
  console.log('   • 💎 World-class UX with sophisticated design');
}

buildCategoryDashboard(); 