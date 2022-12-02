const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('\r\n').map(str => str.split(' '));

const sum = (a, b) => a + b;

// Part 1
const scoreMap1 = {
  A: {X: 4, Y: 8, Z: 3},
  B: {X: 1, Y: 5, Z: 9},
  C: {X: 7, Y: 2, Z: 6}
}
console.log(data.map(([i, j]) => scoreMap1[i][j]).reduce(sum));

// Part 2
const scoreMap2 = {
  A: {X: 3, Y: 4, Z: 8},
  B: {X: 1, Y: 5, Z: 9},
  C: {X: 2, Y: 6, Z: 7}
}
console.log(data.map(([i, j]) => scoreMap2[i][j]).reduce(sum));
