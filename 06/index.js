const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim();

const detect = (str, n) => {
  for (let i = 0; i < str.length - n + 1; i++) {
    const s = new Set([...str.slice(i, i + n)])
    if (s.size === n)  {
      return i + n;
    }
  }
}

// Part 1
console.log(detect(data, 4));

// Part 2
console.log(detect(data, 14));
