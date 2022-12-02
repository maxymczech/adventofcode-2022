const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('\r\n\r\n');

const sum = (a, b) => a + b;
const totals = data.map(x => x.trim().split('\r\n').map(Number).reduce(sum, 0)).sort((a,b) => b - a);

// Part 1
console.log(totals[0]);

// Part 2
console.log(totals.slice(0, 3).reduce(sum));
