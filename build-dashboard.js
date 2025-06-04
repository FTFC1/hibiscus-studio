#!/usr/bin/env node

/**
 * 🔹 Build Financial Dashboard
 * Reads JSON reports and creates HTML with embedded data
 */

import fs from 'fs/promises';
import path from 'path';

// Fetch current exchange rates
async function getExchangeRates() {
  try {
    console.log('🔹 Fetching live exchange rates...');
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/GBP');
    const data = await response.json();
    return {
      GBP: 1,
      USD: data.rates.USD,
      NGN: data.rates.NGN
    };
  } catch (error) {
    console.log('⚠️ Using fallback exchange rates');
    return {
      GBP: 1,
      USD: 1.27,  // Approximate rates as fallback
      NGN: 2000
    };
  }
}

async function buildDashboard() {
  console.log('🔹 Building Financial Dashboard...');
  
  try {
    // Get exchange rates
    const exchangeRates = await getExchangeRates();
    console.log('💱 Exchange rates loaded:', exchangeRates);
    
    // Read all financial reports
    const reportsDir = 'financial-reports';
    const files = await fs.readdir(reportsDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const allData = {};
    
    for (const file of jsonFiles) {
      const month = file.replace('.json', '');
      const data = JSON.parse(await fs.readFile(path.join(reportsDir, file), 'utf8'));
      allData[month] = data;
    }
    
    console.log(`📊 Loaded ${Object.keys(allData).length} months of data`);
    
    // Build HTML with embedded data and exchange rates
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔹 Personal Financial Dashboard</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; padding: 20px; background: #f8f9fa; 
        }
        .header { 
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); 
            color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .currency-controls {
            display: flex; gap: 10px; margin-bottom: 20px; align-items: center;
        }
        .currency-btn {
            padding: 8px 16px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
            border-radius: 6px; color: white; cursor: pointer; transition: all 0.3s;
            font-size: 14px; font-weight: 500;
        }
        .currency-btn:hover, .currency-btn.active {
            background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.4);
        }
        .stats { 
            display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 20px; margin-bottom: 30px; 
        }
        .stat-card { 
            background: white; padding: 25px; border-radius: 12px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.08); border-left: 4px solid #007AFF;
        }
        .stat-value { font-size: 2.5em; font-weight: bold; color: #1a1a1a; margin-bottom: 5px; }
        .stat-label { color: #666; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; }
        .month-nav { 
            display: flex; gap: 10px; margin-bottom: 30px; flex-wrap: wrap;
        }
        .month-btn { 
            padding: 12px 20px; background: white; border: 2px solid #e0e0e0; 
            border-radius: 8px; cursor: pointer; transition: all 0.3s;
        }
        .month-btn:hover, .month-btn.active { 
            background: #007AFF; color: white; border-color: #007AFF; 
        }
        .transactions { 
            background: white; border-radius: 12px; overflow: hidden; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        .transaction { 
            padding: 15px 20px; border-bottom: 1px solid #f0f0f0; 
            display: flex; justify-content: space-between; align-items: center;
        }
        .transaction:last-child { border-bottom: none; }
        .transaction-desc { font-weight: 500; }
        .transaction-date { color: #666; font-size: 0.9em; }
        .transaction-amount { font-weight: bold; }
        .amount-negative { color: #FF3B30; }
        .amount-positive { color: #34C759; }
        .categories { 
            display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 15px; margin-bottom: 30px;
        }
        .category-card { 
            background: white; padding: 20px; border-radius: 12px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        .exchange-info {
            font-size: 0.9em; color: rgba(255,255,255,0.7); margin-top: 10px;
        }
        @media (max-width: 768px) {
            .stats { grid-template-columns: 1fr; }
            .month-nav { justify-content: center; }
            .currency-controls { justify-content: center; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔹 Personal Financial Dashboard</h1>
        <p>Local financial analysis - completely private and secure</p>
        <div class="currency-controls">
            <span style="margin-right: 10px;">Currency:</span>
            <button class="currency-btn active" onclick="switchCurrency('GBP')" id="btn-GBP">🇬🇧 GBP</button>
            <button class="currency-btn" onclick="switchCurrency('USD')" id="btn-USD">🇺🇸 USD</button>
            <button class="currency-btn" onclick="switchCurrency('NGN')" id="btn-NGN">🇳🇬 NGN</button>
        </div>
        <div class="exchange-info" id="exchangeInfo"></div>
    </div>

    <div class="month-nav" id="monthNav"></div>
    <div class="stats" id="stats"></div>
    <div class="categories" id="categories"></div>
    <div class="transactions" id="transactions"></div>

    <script>
        // Embedded financial data and exchange rates
        const financialData = ${JSON.stringify(allData, null, 2)};
        const exchangeRates = ${JSON.stringify(exchangeRates, null, 2)};
        
        let currentMonth = Object.keys(financialData).sort().pop();
        let currentCurrency = 'GBP';
        
        function formatCurrency(amount, currency = currentCurrency) {
            const convertedAmount = amount * exchangeRates[currency];
            
            const formatters = {
                GBP: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }),
                USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
                NGN: new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' })
            };
            
            return formatters[currency].format(Math.abs(convertedAmount));
        }
        
        function switchCurrency(currency) {
            currentCurrency = currency;
            
            // Update button states
            document.querySelectorAll('.currency-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById(\`btn-\${currency}\`).classList.add('active');
            
            // Update exchange info
            const rate = exchangeRates[currency];
            document.getElementById('exchangeInfo').textContent = 
                \`1 GBP = \${rate.toFixed(2)} \${currency} (Live rates)\`;
            
            updateDashboard();
        }
        
        function buildMonthNav() {
            const nav = document.getElementById('monthNav');
            const months = Object.keys(financialData).sort();
            
            nav.innerHTML = months.map(month => 
                \`<button class="month-btn \${month === currentMonth ? 'active' : ''}" 
                   onclick="switchMonth('\${month}')">\${month}</button>\`
            ).join('');
        }
        
        function switchMonth(month) {
            currentMonth = month;
            updateDashboard();
            buildMonthNav();
        }
        
        function updateDashboard() {
            const data = financialData[currentMonth];
            if (!data) return;
            
            // Convert and calculate totals with proper currency handling
            const transactionsWithAmounts = data.transactions
                .filter(t => t.originalAmountsWithCurrency && t.originalAmountsWithCurrency.length > 0)
                .map(t => {
                    // Use the first valid amount with currency info
                    const firstAmount = t.originalAmountsWithCurrency[0];
                    let amountInGBP = firstAmount.amount;
                    
                    // Convert to GBP based on original currency
                    if (firstAmount.currency === '₦') {
                        amountInGBP = firstAmount.amount / exchangeRates.NGN; // NGN to GBP
                    } else if (firstAmount.currency === '$') {
                        amountInGBP = firstAmount.amount / exchangeRates.USD; // USD to GBP
                    }
                    // If £ or unknown, assume already in GBP
                    
                    return {
                        ...t,
                        amount: amountInGBP,
                        originalAmount: firstAmount.amount,
                        originalCurrency: firstAmount.currency
                    };
                });
            
            const total = transactionsWithAmounts.reduce((sum, t) => sum + Math.abs(t.amount), 0);
            const count = transactionsWithAmounts.length;
            const avgTransaction = count > 0 ? total / count : 0;
            
            document.getElementById('stats').innerHTML = \`
                <div class="stat-card">
                    <div class="stat-value">\${formatCurrency(total)}</div>
                    <div class="stat-label">Total Spent</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">\${count}</div>
                    <div class="stat-label">Transactions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">\${formatCurrency(avgTransaction)}</div>
                    <div class="stat-label">Average Transaction</div>
                </div>
            \`;
            
            // Update categories with proper amounts
            const categories = {};
            transactionsWithAmounts.forEach(t => {
                categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount);
            });
            
            document.getElementById('categories').innerHTML = Object.entries(categories)
                .sort(([,a], [,b]) => b - a)
                .map(([category, amount]) => \`
                    <div class="category-card">
                        <h3>\${category.replace('_', ' ').toUpperCase()}</h3>
                        <div class="stat-value" style="font-size: 1.5em;">\${formatCurrency(amount)}</div>
                    </div>
                \`).join('');
            
            // Update transactions with original currency display
            document.getElementById('transactions').innerHTML = transactionsWithAmounts
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(t => \`
                    <div class="transaction">
                        <div>
                            <div class="transaction-desc">\${t.subject || t.description || 'Transaction'}</div>
                            <div class="transaction-date">\${new Date(t.date).toLocaleDateString('en-GB')}</div>
                            <div class="transaction-original" style="font-size: 0.8em; color: #888;">
                                Original: \${t.originalCurrency}\${t.originalAmount}
                            </div>
                        </div>
                        <div class="transaction-amount \${t.amount < 0 ? 'amount-negative' : 'amount-positive'}">
                            \${formatCurrency(t.amount)}
                        </div>
                    </div>
                \`).join('');
        }
        
        // Initialize dashboard
        buildMonthNav();
        switchCurrency('GBP'); // This will set exchange info and update dashboard
    </script>
</body>
</html>`;

    await fs.writeFile('financial-dashboard.html', html);
    console.log('✅ Dashboard built successfully!');
    
  } catch (error) {
    console.error('❌ Error building dashboard:', error);
  }
}

buildDashboard(); 