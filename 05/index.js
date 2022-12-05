const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const [cratesRaw, operationsRaw] = rawData.split('\r\n\r\n').map(item => item.split('\r\n'));

// Parse crates
const columns = cratesRaw.pop().trim().split(/\s+/).length;
const crates = [];
for (let i = 0; i < columns; i++) {
  crates[i] = [];
  for (let j = cratesRaw.length - 1; j >= 0; j--) {
    const k = 1 + i * 4;
    if (cratesRaw[j][k] && cratesRaw[j][k] !== ' ') {
      crates[i].push(cratesRaw[j][k]);
    }
  }
}

// Parse operations
const operations = operationsRaw.map(row => row.split(/\D+/).slice(1).map(Number));

const getResult = (crates => crates.map(col => col[col.length - 1] ?? ' ').join(''));

// Part 1
const crates1 = JSON.parse(JSON.stringify(crates));
operations.forEach(([n, from, to]) => {
  for (let i = 0; i < n; i++) {
    crates1[to - 1].push(crates1[from - 1].pop());
  }
});
console.log(getResult(crates1));

// Part 2
const crates2 = JSON.parse(JSON.stringify(crates));
operations.forEach(([n, from, to]) => {
  const tmp = [];
  for (let i = 0; i < n; i++) {
    tmp.push(crates2[from - 1].pop());
  }
  for (let i = 0; i < n; i++) {
    crates2[to - 1].push(tmp.pop());
  }
});
console.log(getResult(crates2));
