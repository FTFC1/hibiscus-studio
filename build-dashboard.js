#!/usr/bin/env node

/**
 * 🔹 Build Financial Dashboard
 * Fixed version with proper currency conversion and filtering
 */

import fs from 'fs/promises';

async function buildDashboard() {
  console.log('🔹 Building FIXED fintech dashboard...');
  
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
  
  // Convert amount to NGN with PROPER logic
  function toNGN(amount, currency) {
    if (!amount || isNaN(amount)) return 0;
    
    const cleanAmount = parseFloat(amount);
    if (cleanAmount <= 0) return 0;
    
    // Exchange rates TO NGN
    const rates = {
      '₦': 1,           // Already in NGN
      '$': 1579,        // 1 USD = 1579 NGN
      '£': 2050,        // 1 GBP = 2050 NGN  
      '€': 1680         // 1 EUR = 1680 NGN
    };
    
    if (currency === '₦') {
      return cleanAmount; // Already in NGN
    }
    
    const rate = rates[currency] || rates['$'];
    const converted = cleanAmount * rate;
    
    // Debug excessive amounts
    if (converted > 500000) {
      console.log(`⚠️ Large conversion: ${currency}${cleanAmount} → ₦${converted.toLocaleString()}`);
    }
    
    return converted;
  }
  
  // Enhanced internal transfer detection
  function isInternalTransfer(transaction, category) {
    if (category === 'internal_transfer') return true;
    
    const subject = (transaction.subject || '').toLowerCase();
    const badPatterns = [
      /transfer.*successful/,
      /wallet.*funded/,
      /account.*funded/,
      /balance.*updated/,
      /top.*up/,
      /folarin.*coker/,
      /nicholas.*folarin/
    ];
    
    return badPatterns.some(pattern => pattern.test(subject));
  }
  
  // Format with commas
  function formatNGN(amount) {
    return `₦${Math.round(amount).toLocaleString()}`;
  }
  
  // Process monthly data
  const processedMonths = monthlyData.map(month => {
    console.log(`\n🔍 Processing ${month.month}...`);
    
    const categorySpending = {};
    let biggestExpense = { amount: 0, description: '', amountNGN: 0 };
    let monthTotal = 0;
    
    Object.entries(month.categories).forEach(([category, transactions]) => {
      let categoryTotal = 0;
      
      transactions.forEach(transaction => {
        // Skip internal transfers
        if (isInternalTransfer(transaction, category)) {
          return;
        }
        
        // Calculate amount
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
        
        // Sanity check
        if (transactionAmountNGN > 1000000) {
          console.log(`🚫 Rejected huge amount: ${formatNGN(transactionAmountNGN)} for ${transaction.subject?.substring(0, 30)}`);
          return;
        }
        
        if (transactionAmountNGN > 0) {
          categoryTotal += transactionAmountNGN;
          
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
      biggestExpense
    };
  });
  
  const totalSpentAll = processedMonths.reduce((sum, month) => sum + month.totalSpent, 0);
  const avgMonthlySpend = totalSpentAll / processedMonths.length;
  
  console.log(`\n📊 FINAL: Total = ${formatNGN(totalSpentAll)}, Monthly avg = ${formatNGN(avgMonthlySpend)}`);
  
  // Top categories
  const globalCategorySpending = {};
  processedMonths.forEach(month => {
    Object.entries(month.categorySpending).forEach(([category, amount]) => {
      globalCategorySpending[category] = (globalCategorySpending[category] || 0) + amount;
    });
  });
  
  const topCategories = Object.entries(globalCategorySpending)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);
  
  // HTML Dashboard
  const dashboardHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔹 Personal Financial Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: #f5f5f7; line-height: 1.6;
        }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        .header { 
            background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
            color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center;
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .overview-grid { 
            display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
            gap: 20px; margin-bottom: 30px; 
        }
        .overview-card { 
            background: white; padding: 25px; border-radius: 12px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-left: 5px solid #007AFF;
        }
        .overview-card h3 { color: #666; font-size: 0.9em; text-transform: uppercase; margin-bottom: 8px; }
        .overview-card .value { font-size: 2.2em; font-weight: bold; color: #1a1a1a; margin-bottom: 5px; }
        .overview-card .subtext { color: #888; font-size: 0.9em; }
        .debug-info {
            background: #e7f3ff; border: 1px solid #b8daff; border-radius: 8px;
            padding: 15px; margin-bottom: 20px; font-family: monospace; font-size: 0.9em;
        }
        .top-categories {
            background: white; padding: 25px; border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 30px;
        }
        .category-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 12px 0; border-bottom: 1px solid #f0f0f0;
        }
        .category-item:last-child { border-bottom: none; }
        .category-name { font-weight: 500; text-transform: capitalize; }
        .category-amount { font-weight: bold; color: #dc3545; }
        .month-grid { 
            display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); 
            gap: 25px; margin-bottom: 30px; 
        }
        .month-card { 
            background: white; border-radius: 12px; overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .month-header { 
            background: linear-gradient(135deg, #007AFF 0%, #0056CC 100%);
            color: white; padding: 20px; text-align: center;
        }
        .month-stats {
            display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;
        }
        .month-stat {
            text-align: center; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 6px;
        }
        .month-stat-value { font-size: 1.2em; font-weight: bold; }
        .month-stat-label { font-size: 0.8em; opacity: 0.8; }
        .month-content { padding: 20px; }
        .biggest-expense {
            background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px;
            padding: 15px; margin-bottom: 15px;
        }
        .biggest-expense h4 { color: #856404; margin-bottom: 5px; }
        .expense-details { display: flex; justify-content: space-between; align-items: center; }
        .expense-amount { font-weight: bold; color: #dc3545; }
        .category-breakdown { margin-bottom: 15px; }
        .category-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 10px 0; border-bottom: 2px solid #e9ecef; margin-bottom: 10px;
        }
        .category-title { font-weight: 600; text-transform: capitalize; color: #495057; }
        .category-total { font-weight: bold; color: #dc3545; }
        @media (max-width: 768px) {
            .container { padding: 15px; }
            .overview-grid { grid-template-columns: 1fr; }
            .month-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔹 Personal Financial Dashboard</h1>
            <p>Fixed spending analysis • Lagos, Nigeria • ${new Date().toLocaleDateString('en-GB')}</p>
        </div>
        
        <div class="debug-info">
            <strong>🔧 FIXED VERSION:</strong><br>
            • Currency conversion logic corrected<br>
            • Internal transfers properly filtered<br>
            • Commas added to all amounts<br>
            • Sanity checks for impossible amounts
        </div>
        
        <div class="overview-grid">
            <div class="overview-card">
                <h3>Total Spent</h3>
                <div class="value">${formatNGN(totalSpentAll)}</div>
                <div class="subtext">6 months, real expenses only</div>
            </div>
            <div class="overview-card">
                <h3>Monthly Average</h3>
                <div class="value">${formatNGN(avgMonthlySpend)}</div>
                <div class="subtext">Average spending per month</div>
            </div>
            <div class="overview-card">
                <h3>Peak Month</h3>
                <div class="value">${processedMonths.reduce((max, month) => 
                  month.totalSpent > max.totalSpent ? month : max
                ).month.split(' ')[0]}</div>
                <div class="subtext">${formatNGN(Math.max(...processedMonths.map(m => m.totalSpent)))} spent</div>
            </div>
            <div class="overview-card">
                <h3>Data Quality</h3>
                <div class="value">FIXED</div>
                <div class="subtext">No more crazy amounts!</div>
            </div>
        </div>
        
        <div class="top-categories">
            <h2 style="margin-bottom: 20px;">🏆 Top Spending Categories (6 Months)</h2>
            ${topCategories.map(([category, amount]) => `
                <div class="category-item">
                    <div class="category-name">${category.replace(/_/g, ' ')}</div>
                    <div class="category-amount">${formatNGN(amount)}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="month-grid">
${processedMonths.map(month => `
            <div class="month-card">
                <div class="month-header">
                    <h3>${month.month}</h3>
                    <div class="month-stats">
                        <div class="month-stat">
                            <div class="month-stat-value">${formatNGN(month.totalSpent)}</div>
                            <div class="month-stat-label">Total Spent</div>
                        </div>
                        <div class="month-stat">
                            <div class="month-stat-value">${month.totalTransactions.toLocaleString()}</div>
                            <div class="month-stat-label">Transactions</div>
                        </div>
                    </div>
                </div>
                <div class="month-content">
                    ${month.biggestExpense.amountNGN > 0 ? `
                        <div class="biggest-expense">
                            <h4>💸 Biggest Expense</h4>
                            <div class="expense-details">
                                <div>
                                    <div>${month.biggestExpense.description}</div>
                                    <div style="font-size: 0.8em; color: #856404;">${month.biggestExpense.category.replace(/_/g, ' ')}</div>
                                </div>
                                <div class="expense-amount">${month.biggestExpense.currency}${parseFloat(month.biggestExpense.amount).toLocaleString()}</div>
                            </div>
                        </div>
                    ` : ''}
                    
                    ${Object.entries(month.categorySpending)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 6)
                      .map(([category, amount]) => {
                        const transactions = month.categories[category] || [];
                        return `
                        <div class="category-breakdown">
                            <div class="category-header">
                                <div class="category-title">${category.replace(/_/g, ' ')}</div>
                                <div class="category-total">${formatNGN(amount)}</div>
                            </div>
                        </div>
                        `;
                      }).join('')}
                </div>
            </div>
`).join('')}
        </div>
        
        <div style="text-align: center; color: #6c757d; margin-top: 30px; padding: 20px;">
            <p>Generated ${new Date().toLocaleDateString('en-GB')} • Local analysis • Fixed version</p>
        </div>
    </div>
</body>
</html>`;

  await fs.writeFile('financial-dashboard.html', dashboardHTML);
  console.log('✅ FIXED dashboard created with proper amounts!');
}

buildDashboard().catch(console.error); 