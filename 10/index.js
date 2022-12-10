const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('\r\n').map(row => row.split(' '));

// Simulate
let x = 1;
let cycle = 1;
let result = 0;
const when = [20, 60, 100, 140, 180, 220];

const check = () => {
  if (when.includes(cycle)) {
    result += x * cycle;
  }
}
const width = 40;
const height = 6;
const buffer = [
  Array(width).fill('.'),
  Array(width).fill('.'),
  Array(width).fill('.'),
  Array(width).fill('.'),
  Array(width).fill('.'),
  Array(width).fill('.')
];
const print = () => {
  const col = (cycle - 1) % width;
  const row = Math.floor((cycle - 1) / width);
  if (row < height) {
    if (Math.abs(col - x) <= 1) {
      buffer[row][col] = '#';
    }
  }
}

print();
data.forEach(row => {
  switch (row[0]) {
    case 'noop':
      cycle++;
      check();
      print();

    break;
    case 'addx':
      cycle++;
      check();
      print();

      cycle++;
      x += Number(row[1]);
      check();
      print();
    break;
  }
});

// Part 1
console.log(result);

// Part 2
buffer.forEach(row => console.log(row.join('')));
