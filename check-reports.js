import fs from 'fs';

const files = ['2025-01.json', '2025-02.json', '2025-03.json', '2025-04.json', '2025-05.json', '2025-06.json'];

console.log('🔹 Transaction counts by month:');
files.forEach(file => {
  try {
    const data = JSON.parse(fs.readFileSync('financial-reports/' + file));
    console.log(`  ${data.month}: ${data.totalTransactions} transactions`);
  } catch (e) {
    console.log(`  ${file}: Error reading`);
  }
}); 