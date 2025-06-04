#!/usr/bin/env node

/**
 * 🔹 Build Financial Dashboard
 * Creates a comprehensive HTML dashboard with all transaction data
 */

import fs from 'fs/promises';
import path from 'path';

async function buildDashboard() {
  console.log('🔹 Building comprehensive financial dashboard...');
  
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
  
  // Calculate totals and insights
  const totalTransactions = monthlyData.reduce((sum, month) => sum + month.totalTransactions, 0);
  const exchangeRate = 1579; // 1 USD = 1579 NGN (approximate)
  
  // Generate HTML dashboard
  const dashboardHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔹 Personal Financial Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: #f5f5f7;
            line-height: 1.6;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        
        .header { 
            background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
            color: white; 
            padding: 30px; 
            border-radius: 12px; 
            margin-bottom: 30px;
            text-align: center;
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { opacity: 0.8; font-size: 1.1em; }
        
        .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 20px; 
            margin-bottom: 30px; 
        }
        .stat-card { 
            background: white; 
            padding: 25px; 
            border-radius: 12px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border-left: 5px solid #007AFF;
        }
        .stat-card h3 { color: #666; font-size: 0.9em; text-transform: uppercase; margin-bottom: 5px; }
        .stat-card .value { font-size: 2em; font-weight: bold; color: #1a1a1a; }
        .stat-card .subtext { color: #888; font-size: 0.9em; margin-top: 5px; }
        
        .month-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
            gap: 25px; 
            margin-bottom: 30px; 
        }
        .month-card { 
            background: white; 
            border-radius: 12px; 
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .month-header { 
            background: linear-gradient(135deg, #007AFF 0%, #0056CC 100%);
            color: white; 
            padding: 20px; 
            text-align: center;
        }
        .month-content { padding: 20px; }
        
        .category { 
            margin-bottom: 15px; 
            padding: 15px; 
            background: #f8f9fa; 
            border-radius: 8px; 
            border-left: 4px solid #28a745;
        }
        .category h4 { 
            color: #495057; 
            margin-bottom: 10px; 
            text-transform: capitalize;
        }
        .transaction { 
            padding: 8px 0; 
            border-bottom: 1px solid #e9ecef; 
            font-size: 14px; 
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .transaction:last-child { border-bottom: none; }
        .transaction-details { flex: 1; }
        .transaction-amount { 
            font-weight: bold; 
            color: #dc3545;
            white-space: nowrap;
            margin-left: 10px;
        }
        .transaction-date { color: #6c757d; font-size: 12px; }
        
        .summary { 
            background: white; 
            padding: 25px; 
            border-radius: 12px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .summary h2 { margin-bottom: 20px; color: #1a1a1a; }
        
        .exchange-rate {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            text-align: center;
        }
        .exchange-rate strong { color: #856404; }
        
        @media (max-width: 768px) {
            .container { padding: 15px; }
            .header h1 { font-size: 2em; }
            .stats-grid { grid-template-columns: 1fr; }
            .month-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔹 Personal Financial Dashboard</h1>
            <p>Comprehensive financial analysis • Secure • Private • Lagos, Nigeria</p>
        </div>
        
        <div class="exchange-rate">
            <strong>Exchange Rate:</strong> 1 USD = ₦${exchangeRate.toLocaleString()} NGN
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Transactions</h3>
                <div class="value">${totalTransactions}</div>
                <div class="subtext">Across 6 months</div>
            </div>
            <div class="stat-card">
                <h3>Monthly Average</h3>
                <div class="value">${Math.round(totalTransactions / 6)}</div>
                <div class="subtext">Transactions per month</div>
            </div>
            <div class="stat-card">
                <h3>Peak Month</h3>
                <div class="value">${monthlyData.reduce((max, month) => 
                  month.totalTransactions > max.totalTransactions ? month : max
                ).month.split(' ')[0]}</div>
                <div class="subtext">${Math.max(...monthlyData.map(m => m.totalTransactions))} transactions</div>
            </div>
            <div class="stat-card">
                <h3>Data Quality</h3>
                <div class="value">326 vs 49</div>
                <div class="subtext">565% improvement with date ranges</div>
            </div>
        </div>
        
        <div class="summary">
            <h2>🎯 Key Discoveries</h2>
            <ul style="line-height: 2; color: #495057;">
                <li><strong>Jan-Mar 2025:</strong> Found 157 transactions that were completely missing</li>
                <li><strong>April 2025:</strong> Discovered 81 additional transactions beyond initial 5</li>
                <li><strong>Gmail Search Fix:</strong> Changed from broken "Apple OR Tinder" to proper "from:apple OR from:tinder"</li>
                <li><strong>Date Ranges:</strong> Monthly searches essential for historical completeness</li>
                <li><strong>Service Detection:</strong> Added Vercel, Exafunction, Magic Patterns, Lemon Squeezy</li>
            </ul>
        </div>
        
        <div class="month-grid">
${monthlyData.map(month => `
            <div class="month-card">
                <div class="month-header">
                    <h3>${month.month}</h3>
                    <p>${month.totalTransactions} transactions</p>
                </div>
                <div class="month-content">
${Object.entries(month.categories).map(([category, transactions]) => `
                    <div class="category">
                        <h4>${category.replace(/_/g, ' ')}</h4>
${transactions.slice(0, 5).map(t => `
                        <div class="transaction">
                            <div class="transaction-details">
                                <div>${t.subject?.substring(0, 40) || 'Transaction'}...</div>
                                <div class="transaction-date">${t.date}</div>
                            </div>
                            <div class="transaction-amount">
                                ${t.currencies && t.amounts ? 
                                  t.currencies.map((curr, i) => `${curr}${t.amounts[i]}`).join(', ') : 
                                  'Amount N/A'}
                            </div>
                        </div>
`).join('')}
${transactions.length > 5 ? `<div style="text-align: center; color: #6c757d; margin-top: 10px;">+${transactions.length - 5} more transactions</div>` : ''}
                    </div>
`).join('')}
                </div>
            </div>
`).join('')}
        </div>
        
        <div class="summary">
            <h2>📋 Gmail Search Strategy</h2>
            <p style="margin-bottom: 15px; color: #495057;">
                For future financial email analysis, use these proven search patterns:
            </p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 14px;">
                <strong>Core Financial Terms:</strong><br>
                invoice OR billing OR receipt OR payment OR charged<br>
                subscription OR recurring OR monthly<br><br>
                
                <strong>Service Providers:</strong><br>
                from:apple OR from:netflix OR from:spotify OR from:openai<br>
                from:paypal OR from:stripe OR from:lemonsqueezy<br>
                from:opay OR from:providus OR from:zenith OR from:hsbc<br><br>
                
                <strong>With Date Ranges:</strong><br>
                {search_term} after:2025/01/01 before:2025/02/01
            </div>
        </div>
        
        <div style="text-align: center; color: #6c757d; margin-top: 30px; padding: 20px;">
            <p>Generated ${new Date().toLocaleDateString('en-GB')} • Local-only analysis • No data shared</p>
        </div>
    </div>
</body>
</html>`;

  await fs.writeFile('financial-dashboard.html', dashboardHTML);
  console.log('✅ Comprehensive dashboard created: financial-dashboard.html');
}

buildDashboard().catch(console.error); 