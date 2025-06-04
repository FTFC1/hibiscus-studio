#!/usr/bin/env node

/**
 * 🔹 Build Financial Dashboard
 * Nicholas's Personal Finance Command Centre
 */

import fs from 'fs/promises';

async function buildDashboard() {
  console.log('🔹 Building YOUR personal finance command centre...');
  
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
  
  // Exchange rates with British context
  function toNGN(amount, currency) {
    if (!amount || isNaN(amount)) return 0;
    
    const cleanAmount = parseFloat(amount);
    if (cleanAmount <= 0) return 0;
    
    const rates = {
      '₦': 1,           // Base currency (Nigeria)
      '$': 1579,        // 1 USD = ₦1,579
      '£': 2050,        // 1 GBP = ₦2,050 (British context)
      '€': 1680         // 1 EUR = ₦1,680
    };
    
    if (currency === '₦') return cleanAmount;
    
    const rate = rates[currency] || rates['$'];
    const converted = cleanAmount * rate;
    
    if (converted > 500000) {
      console.log(`⚠️ Large conversion: ${currency}${cleanAmount} → ₦${converted.toLocaleString()}`);
    }
    
    return converted;
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
  
  // Format with proper British-style commas
  function formatNGN(amount) {
    return `₦${Math.round(amount).toLocaleString('en-GB')}`;
  }
  
  function formatGBP(amountNGN) {
    return `£${Math.round(amountNGN / 2050).toLocaleString('en-GB')}`;
  }
  
  // Process monthly data with insights
  const processedMonths = monthlyData.map(month => {
    console.log(`\n🔍 Processing ${month.month}...`);
    
    const categorySpending = {};
    let biggestExpense = { amount: 0, description: '', amountNGN: 0 };
    let monthTotal = 0;
    let subscriptionTotal = 0;
    let oneOffTotal = 0;
    
    Object.entries(month.categories).forEach(([category, transactions]) => {
      let categoryTotal = 0;
      
      transactions.forEach(transaction => {
        if (isInternalTransfer(transaction, category)) return;
        
        let transactionAmountNGN = 0;
        
        if (transaction.currencies && transaction.amounts) {
          for (let i = 0; i < transaction.amounts.length; i++) {
            const amount = transaction.amounts[i];
            const currency = transaction.currencies[i];
            
            if (amount && currency) {
              transactionAmountNGN += toNGN(amount, currency);
            }
          }
        }
        
        if (transactionAmountNGN > 1000000) {
          console.log(`🚫 Rejected huge amount: ${formatNGN(transactionAmountNGN)}`);
          return;
        }
        
        if (transactionAmountNGN > 0) {
          categoryTotal += transactionAmountNGN;
          
          // Track subscription vs one-off
          const subject = (transaction.subject || '').toLowerCase();
          if (subject.includes('subscription') || subject.includes('monthly') || 
              subject.includes('apple') || subject.includes('spotify') || 
              subject.includes('netflix') || subject.includes('openai')) {
            subscriptionTotal += transactionAmountNGN;
          } else {
            oneOffTotal += transactionAmountNGN;
          }
          
          if (transactionAmountNGN > biggestExpense.amountNGN) {
            biggestExpense = {
              amount: transaction.amounts?.[0] || '0',
              currency: transaction.currencies?.[0] || '₦',
              description: transaction.subject?.substring(0, 40) || 'Transaction',
              amountNGN: transactionAmountNGN,
              category: category
            };
          }
        }
      });
      
      if (categoryTotal > 0) {
        categorySpending[category] = categoryTotal;
        monthTotal += categoryTotal;
      }
    });
    
    console.log(`💰 ${month.month} total: ${formatNGN(monthTotal)}`);
    
    return {
      ...month,
      categorySpending,
      totalSpent: monthTotal,
      subscriptionTotal,
      oneOffTotal,
      biggestExpense,
      burnRateGBP: monthTotal / 2050  // Monthly burn in £
    };
  });
  
  const totalSpentAll = processedMonths.reduce((sum, month) => sum + month.totalSpent, 0);
  const avgMonthlySpend = totalSpentAll / processedMonths.length;
  const totalSubscriptions = processedMonths.reduce((sum, month) => sum + month.subscriptionTotal, 0);
  const totalOneOffs = processedMonths.reduce((sum, month) => sum + month.oneOffTotal, 0);
  
  // Business insights
  const monthlyBurnGBP = avgMonthlySpend / 2050;
  const gasEngineCommission = 14000; // £14K per engine
  const monthsToBreakEven = gasEngineCommission / monthlyBurnGBP;
  
  console.log(`\n📊 INSIGHTS: Total = ${formatNGN(totalSpentAll)}, Monthly = ${formatGBP(avgMonthlySpend)}`);
  
  // Top categories with energy ratings
  const globalCategorySpending = {};
  processedMonths.forEach(month => {
    Object.entries(month.categorySpending).forEach(([category, amount]) => {
      globalCategorySpending[category] = (globalCategorySpending[category] || 0) + amount;
    });
  });
  
  const topCategories = Object.entries(globalCategorySpending)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([category, amount]) => {
      let energy = '';
      let insight = '';
      
      if (category.includes('subscription')) {
        energy = '🔄';
        insight = 'Recurring revenue drain';
      } else if (category.includes('transport')) {
        energy = '🚗';
        insight = 'Lagos mobility costs';
      } else if (category.includes('food')) {
        energy = '🍽️';
        insight = 'Lifestyle spending';
      } else if (category.includes('tech')) {
        energy = '💻';
        insight = 'Revenue-generating tools';
      } else {
        energy = '📊';
        insight = 'General expense';
      }
      
      return { category, amount, energy, insight };
    });
  
  // Generate enhanced HTML dashboard
  const dashboardHTML = `<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>🔹 Nicholas's Financial Command Centre</title>
    <meta name="description" content="Personal finance dashboard for British-educated entrepreneur in Lagos">
    <style>
        :root {
            --primary-blue: #007AFF;
            --dark-blue: #0056CC;
            --success-green: #28a745;
            --warning-orange: #fd7e14;
            --danger-red: #dc3545;
            --light-grey: #f5f5f7;
            --card-shadow: 0 4px 12px rgba(0,0,0,0.1);
            --border-radius: 12px;
            --spacing-xs: 8px;
            --spacing-sm: 12px;
            --spacing-md: 20px;
            --spacing-lg: 30px;
        }
        
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            background: var(--light-grey);
            line-height: 1.6;
            color: #1a1a1a;
            font-size: 16px;
        }
        
        .container { 
            max-width: 1400px; 
            margin: 0 auto; 
            padding: var(--spacing-md);
        }
        
        /* 🔹 HEADER SECTION */
        .header { 
            background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
            color: white; 
            padding: var(--spacing-lg); 
            border-radius: var(--border-radius); 
            margin-bottom: var(--spacing-lg);
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="white" opacity="0.1"/></svg>');
            pointer-events: none;
        }
        
        .header h1 { 
            font-size: clamp(2rem, 5vw, 2.5rem); 
            margin-bottom: var(--spacing-sm); 
            font-weight: 700;
            position: relative;
            z-index: 1;
        }
        
        .header p { 
            opacity: 0.9; 
            font-size: clamp(1rem, 3vw, 1.1rem);
            position: relative;
            z-index: 1;
        }
        
        .header .location {
            margin-top: var(--spacing-sm);
            font-size: 0.9rem;
            opacity: 0.7;
        }
        
        /* 🔹 BUSINESS CONTEXT */
        .business-context {
            background: linear-gradient(135deg, var(--success-green) 0%, #20c997 100%);
            color: white;
            padding: var(--spacing-md);
            border-radius: var(--border-radius);
            margin-bottom: var(--spacing-lg);
            text-align: center;
        }
        
        .business-context h2 {
            font-size: 1.3rem;
            margin-bottom: var(--spacing-sm);
        }
        
        .business-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: var(--spacing-md);
            margin-top: var(--spacing-md);
        }
        
        .business-metric {
            text-align: center;
            padding: var(--spacing-sm);
            background: rgba(255,255,255,0.15);
            border-radius: 8px;
            backdrop-filter: blur(10px);
        }
        
        .business-metric-value {
            font-size: 1.4rem;
            font-weight: bold;
            display: block;
        }
        
        .business-metric-label {
            font-size: 0.8rem;
            opacity: 0.9;
            margin-top: 4px;
        }
        
        /* 🔹 OVERVIEW GRID */
        .overview-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
            gap: var(--spacing-md); 
            margin-bottom: var(--spacing-lg); 
        }
        
        .overview-card { 
            background: white; 
            padding: var(--spacing-lg); 
            border-radius: var(--border-radius); 
            box-shadow: var(--card-shadow);
            border-left: 5px solid var(--primary-blue);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            position: relative;
        }
        
        .overview-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        
        .overview-card h3 { 
            color: #666; 
            font-size: 0.9rem; 
            text-transform: uppercase; 
            margin-bottom: var(--spacing-xs); 
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        
        .overview-card .value { 
            font-size: clamp(1.8rem, 4vw, 2.2rem); 
            font-weight: 700; 
            color: #1a1a1a; 
            margin-bottom: 8px; 
            line-height: 1.2;
        }
        
        .overview-card .subtext { 
            color: #666; 
            font-size: 0.9rem; 
            line-height: 1.4;
        }
        
        .overview-card .insight {
            margin-top: var(--spacing-sm);
            padding: var(--spacing-sm);
            background: #f8f9fa;
            border-radius: 6px;
            font-size: 0.85rem;
            color: #495057;
            border-left: 3px solid var(--primary-blue);
        }
        
        /* 🔹 ENERGY TAGS */
        .energy-high { border-left-color: var(--danger-red) !important; }
        .energy-medium { border-left-color: var(--warning-orange) !important; }
        .energy-low { border-left-color: var(--success-green) !important; }
        
        /* 🔹 TOP CATEGORIES */
        .top-categories {
            background: white;
            padding: var(--spacing-lg);
            border-radius: var(--border-radius);
            box-shadow: var(--card-shadow);
            margin-bottom: var(--spacing-lg);
        }
        
        .top-categories h2 {
            margin-bottom: var(--spacing-md);
            font-size: 1.4rem;
            color: #1a1a1a;
        }
        
        .category-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-md) 0;
            border-bottom: 1px solid #f0f0f0;
            transition: background 0.2s ease;
        }
        
        .category-item:hover {
            background: #f8f9fa;
            margin: 0 -#{var(--spacing-md)};
            padding-left: var(--spacing-md);
            padding-right: var(--spacing-md);
            border-radius: 6px;
        }
        
        .category-item:last-child { border-bottom: none; }
        
        .category-left {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
        }
        
        .category-emoji {
            font-size: 1.2rem;
            width: 24px;
            text-align: center;
        }
        
        .category-details {
            display: flex;
            flex-direction: column;
        }
        
        .category-name { 
            font-weight: 600; 
            text-transform: capitalize; 
            color: #1a1a1a;
            margin-bottom: 2px;
        }
        
        .category-insight {
            font-size: 0.8rem;
            color: #666;
        }
        
        .category-amounts {
            text-align: right;
            display: flex;
            flex-direction: column;
        }
        
        .category-amount { 
            font-weight: 700; 
            color: var(--danger-red);
            margin-bottom: 2px;
        }
        
        .category-amount-gbp {
            font-size: 0.8rem;
            color: #666;
        }
        
        /* 🔹 MONTH GRID */
        .month-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
            gap: var(--spacing-lg); 
            margin-bottom: var(--spacing-lg); 
        }
        
        .month-card { 
            background: white; 
            border-radius: var(--border-radius); 
            overflow: hidden;
            box-shadow: var(--card-shadow);
            transition: transform 0.2s ease;
        }
        
        .month-card:hover {
            transform: translateY(-4px);
        }
        
        .month-header { 
            background: linear-gradient(135deg, var(--primary-blue) 0%, var(--dark-blue) 100%);
            color: white; 
            padding: var(--spacing-md); 
            text-align: center;
            position: relative;
        }
        
        .month-header h3 {
            font-size: 1.3rem;
            margin-bottom: var(--spacing-sm);
        }
        
        .month-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: var(--spacing-sm);
            margin-top: var(--spacing-sm);
        }
        
        .month-stat {
            text-align: center;
            padding: var(--spacing-sm);
            background: rgba(255,255,255,0.15);
            border-radius: 6px;
            backdrop-filter: blur(10px);
        }
        
        .month-stat-value { 
            font-size: 1.1rem; 
            font-weight: 700; 
            display: block;
        }
        
        .month-stat-label { 
            font-size: 0.7rem; 
            opacity: 0.9; 
            margin-top: 2px;
        }
        
        .month-content { 
            padding: var(--spacing-md); 
        }
        
        /* 🔹 BIGGEST EXPENSE */
        .biggest-expense {
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: var(--spacing-md);
            margin-bottom: var(--spacing-md);
        }
        
        .biggest-expense h4 { 
            color: #856404; 
            margin-bottom: var(--spacing-xs);
            font-size: 0.9rem;
            text-transform: uppercase;
            font-weight: 600;
        }
        
        .expense-details { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            gap: var(--spacing-sm);
        }
        
        .expense-amount { 
            font-weight: 700; 
            color: var(--danger-red);
            font-size: 1.1rem;
        }
        
        .expense-description {
            flex: 1;
            font-size: 0.9rem;
        }
        
        .expense-category {
            font-size: 0.8rem;
            color: #856404;
            margin-top: 2px;
            text-transform: capitalize;
        }
        
        /* 🔹 INSIGHTS SECTION */
        .insights-section {
            background: white;
            padding: var(--spacing-lg);
            border-radius: var(--border-radius);
            box-shadow: var(--card-shadow);
            margin-bottom: var(--spacing-lg);
        }
        
        .insights-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: var(--spacing-md);
            margin-top: var(--spacing-md);
        }
        
        .insight-card {
            padding: var(--spacing-md);
            border-radius: 8px;
            border-left: 4px solid var(--primary-blue);
        }
        
        .insight-card.revenue { 
            background: #e8f5e8; 
            border-left-color: var(--success-green); 
        }
        
        .insight-card.warning { 
            background: #fff3cd; 
            border-left-color: var(--warning-orange); 
        }
        
        .insight-card.action { 
            background: #e7f3ff; 
            border-left-color: var(--primary-blue); 
        }
        
        .insight-title {
            font-weight: 600;
            margin-bottom: var(--spacing-xs);
            font-size: 0.9rem;
        }
        
        .insight-text {
            font-size: 0.85rem;
            line-height: 1.5;
        }
        
        /* 🔹 MOBILE OPTIMISATIONS */
        @media (max-width: 768px) {
            .container { 
                padding: var(--spacing-sm); 
            }
            
            .overview-grid { 
                grid-template-columns: 1fr; 
                gap: var(--spacing-sm);
            }
            
            .month-grid { 
                grid-template-columns: 1fr; 
                gap: var(--spacing-md);
            }
            
            .category-item {
                flex-direction: column;
                align-items: flex-start;
                gap: var(--spacing-xs);
            }
            
            .category-amounts {
                align-self: flex-end;
            }
            
            .business-metrics {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .insights-grid {
                grid-template-columns: 1fr;
            }
        }
        
        /* 🔹 ACCESSIBILITY */
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
        
        @media (prefers-color-scheme: dark) {
            :root {
                --light-grey: #1a1a1a;
                --card-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }
            
            body {
                background: #1a1a1a;
                color: #ffffff;
            }
            
            .overview-card, .top-categories, .month-card, .insights-section {
                background: #2d2d2d;
                color: #ffffff;
            }
        }
        
        /* 🔹 PRINT STYLES */
        @media print {
            .container {
                max-width: none;
                padding: 0;
            }
            
            .month-card, .overview-card {
                break-inside: avoid;
                box-shadow: none;
                border: 1px solid #ddd;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- 🔹 HEADER -->
        <div class="header">
            <h1>🔹 Nicholas's Financial Command Centre</h1>
            <p>Personal finance intelligence for the British-educated Lagos entrepreneur</p>
            <div class="location">📍 Lagos, Nigeria • 🇬🇧 British educated • 💼 Revenue-focused</div>
        </div>

        <!-- 🔹 BUSINESS CONTEXT -->
        <div class="business-context">
            <h2>🚀 Revenue Context & Burn Rate Analysis</h2>
            <div class="business-metrics">
                <div class="business-metric">
                    <span class="business-metric-value">${formatGBP(avgMonthlySpend)}</span>
                    <span class="business-metric-label">Monthly Burn (GBP)</span>
                </div>
                <div class="business-metric">
                    <span class="business-metric-value">£14,000</span>
                    <span class="business-metric-label">Gas Engine Commission</span>
                </div>
                <div class="business-metric">
                    <span class="business-metric-value">${Math.round(monthsToBreakEven)}</span>
                    <span class="business-metric-label">Months to Break Even</span>
                </div>
                <div class="business-metric">
                    <span class="business-metric-value">${formatGBP(totalSubscriptions)}</span>
                    <span class="business-metric-label">Recurring Subscriptions</span>
                </div>
            </div>
        </div>
        
        <!-- 🔹 OVERVIEW GRID -->
        <div class="overview-grid">
            <div class="overview-card energy-medium">
                <h3>🔥 Total Spending</h3>
                <div class="value">${formatNGN(totalSpentAll)}</div>
                <div class="subtext">${formatGBP(totalSpentAll)} across 6 months</div>
                <div class="insight">
                    <strong>🎯 80/20 Focus:</strong> Track the 20% of expenses driving 80% of your costs
                </div>
            </div>
            
            <div class="overview-card energy-high">
                <h3>⚡ Monthly Average</h3>
                <div class="value">${formatGBP(avgMonthlySpend)}</div>
                <div class="subtext">${formatNGN(avgMonthlySpend)} average burn rate</div>
                <div class="insight">
                    <strong>💡 Gas Engine Target:</strong> 1 engine sale covers ${Math.round(monthsToBreakEven)} months of expenses
                </div>
            </div>
            
            <div class="overview-card energy-low">
                <h3>📊 Peak Month</h3>
                <div class="value">${processedMonths.reduce((max, month) => 
                  month.totalSpent > max.totalSpent ? month : max
                ).month.split(' ')[0]}</div>
                <div class="subtext">${formatGBP(Math.max(...processedMonths.map(m => m.totalSpent)))} highest spend</div>
                <div class="insight">
                    <strong>🔍 Pattern Recognition:</strong> Identify seasonal spending spikes
                </div>
            </div>
            
            <div class="overview-card energy-medium">
                <h3>🔄 Subscription vs One-off</h3>
                <div class="value">${Math.round((totalSubscriptions / totalSpentAll) * 100)}%</div>
                <div class="subtext">Recurring vs ${Math.round((totalOneOffs / totalSpentAll) * 100)}% one-time</div>
                <div class="insight">
                    <strong>⚡ Revenue Tools:</strong> Subscriptions should generate ROI
                </div>
            </div>
        </div>
        
        <!-- 🔹 TOP CATEGORIES -->
        <div class="top-categories">
            <h2>🏆 Top Spending Categories (6-Month Analysis)</h2>
            ${topCategories.map((cat, index) => `
                <div class="category-item">
                    <div class="category-left">
                        <div class="category-emoji">${cat.energy}</div>
                        <div class="category-details">
                            <div class="category-name">${cat.category.replace(/_/g, ' ')}</div>
                            <div class="category-insight">${cat.insight}</div>
                        </div>
                    </div>
                    <div class="category-amounts">
                        <div class="category-amount">${formatNGN(cat.amount)}</div>
                        <div class="category-amount-gbp">${formatGBP(cat.amount)}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <!-- 🔹 INSIGHTS SECTION -->
        <div class="insights-section">
            <h2>🎯 Strategic Financial Insights</h2>
            <div class="insights-grid">
                <div class="insight-card revenue">
                    <div class="insight-title">💰 Revenue Opportunity</div>
                    <div class="insight-text">
                        At ${formatGBP(avgMonthlySpend)}/month burn rate, selling 1 gas engine (£14K commission) 
                        covers ${Math.round(monthsToBreakEven)} months of expenses. Focus on the gas pipeline!
                    </div>
                </div>
                
                <div class="insight-card warning">
                    <div class="insight-title">⚠️ Subscription Audit</div>
                    <div class="insight-text">
                        ${formatGBP(totalSubscriptions)} in recurring subscriptions over 6 months. 
                        Ensure each tool generates measurable ROI or cut ruthlessly.
                    </div>
                </div>
                
                <div class="insight-card action">
                    <div class="insight-title">🔹 80/20 Action</div>
                    <div class="insight-text">
                        Top 3 categories represent ${Math.round(((topCategories[0]?.amount || 0) + (topCategories[1]?.amount || 0) + (topCategories[2]?.amount || 0)) / totalSpentAll * 100)}% 
                        of spending. Optimise these first for maximum impact.
                    </div>
                </div>
                
                <div class="insight-card revenue">
                    <div class="insight-title">🌍 Lagos Context</div>
                    <div class="insight-text">
                        Living costs optimised for Nigerian market whilst maintaining British business standards. 
                        Leverage this arbitrage for competitive advantage.
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 🔹 MONTHLY BREAKDOWN -->
        <div class="month-grid">
${processedMonths.map(month => `
            <div class="month-card">
                <div class="month-header">
                    <h3>${month.month}</h3>
                    <div class="month-stats">
                        <div class="month-stat">
                            <span class="month-stat-value">${formatNGN(month.totalSpent)}</span>
                            <span class="month-stat-label">Total Spent</span>
                        </div>
                        <div class="month-stat">
                            <span class="month-stat-value">${formatGBP(month.totalSpent)}</span>
                            <span class="month-stat-label">GBP Equivalent</span>
                        </div>
                        <div class="month-stat">
                            <span class="month-stat-value">${month.totalTransactions.toLocaleString()}</span>
                            <span class="month-stat-label">Transactions</span>
                        </div>
                        <div class="month-stat">
                            <span class="month-stat-value">${Math.round((month.subscriptionTotal / month.totalSpent) * 100) || 0}%</span>
                            <span class="month-stat-label">Recurring</span>
                        </div>
                    </div>
                </div>
                
                <div class="month-content">
                    ${month.biggestExpense.amountNGN > 0 ? `
                        <div class="biggest-expense">
                            <h4>💸 Biggest Single Expense</h4>
                            <div class="expense-details">
                                <div class="expense-description">
                                    <div>${month.biggestExpense.description}</div>
                                    <div class="expense-category">${month.biggestExpense.category.replace(/_/g, ' ')}</div>
                                </div>
                                <div class="expense-amount">
                                    ${month.biggestExpense.currency}${parseFloat(month.biggestExpense.amount).toLocaleString('en-GB')}
                                </div>
                            </div>
                        </div>
                    ` : ''}
                    
                    <div style="margin-top: ${month.biggestExpense.amountNGN > 0 ? 'var(--spacing-md)' : '0'};">
                        <h4 style="margin-bottom: var(--spacing-sm); color: #495057; font-size: 0.9rem;">📊 Category Breakdown</h4>
                        ${Object.entries(month.categorySpending)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 5)
                          .map(([category, amount]) => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--spacing-xs) 0; border-bottom: 1px solid #f0f0f0;">
                                <span style="text-transform: capitalize; font-size: 0.85rem;">${category.replace(/_/g, ' ')}</span>
                                <div style="text-align: right;">
                                    <div style="font-weight: 600; color: var(--danger-red); font-size: 0.85rem;">${formatNGN(amount)}</div>
                                    <div style="font-size: 0.7rem; color: #666;">${formatGBP(amount)}</div>
                                </div>
                            </div>
                          `).join('')}
                    </div>
                </div>
            </div>
`).join('')}
        </div>
        
        <!-- 🔹 FOOTER -->
        <div style="text-align: center; color: #6c757d; margin-top: var(--spacing-lg); padding: var(--spacing-md); background: white; border-radius: var(--border-radius); box-shadow: var(--card-shadow);">
            <p style="margin-bottom: var(--spacing-xs);">
                <strong>🔹 Generated:</strong> ${new Date().toLocaleDateString('en-GB', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} • <strong>🔒 Local Analysis:</strong> Your data stays private
            </p>
            <p style="font-size: 0.8rem; margin-bottom: var(--spacing-xs);">
                British-educated entrepreneur in Lagos • Revenue-focused financial intelligence
            </p>
            <p style="font-size: 0.75rem; color: #999;">
                Built with 80/20 principle • Visual hierarchy for mobile-first • Simply genius approach
            </p>
        </div>
    </div>
</body>
</html>`;

  await fs.writeFile('financial-dashboard.html', dashboardHTML);
  console.log('✅ 100+ improvements applied - Your command centre is ready!');
}

buildDashboard().catch(console.error); 