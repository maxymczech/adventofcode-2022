const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('\r\n').map(row => (
  row.split(',').map(range => range.split('-').map(Number))
));

const contains = (r1, r2) => r1[0] <= r2[0] && r1[1] >= r2[1];
const overlap = (r1, r2) => r1[0] >= r2[0] && r1[0] <= r2[1] || r2[0] >= r1[0] && r2[0] <= r1[1];

// Part 1
console.log(
  data.filter(([r1, r2]) => contains(r1, r2) || contains(r2, r1)).length
);

// Part 2
console.log(
  data.filter(([r1, r2]) => overlap(r1, r2)).length
);
