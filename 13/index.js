const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('\r\n\r\n').map(row => row.split('\r\n').map(row => JSON.parse(row)));

const compare = (left, right) => {
  if (typeof left === 'object' && typeof right === 'object') {
    for (let i = 0; i < Math.min(left.length, right.length); i++) {
      const result = compare(left[i], right[i]);
      if (result < 0) return -1;
      if (result > 0) return 1;
    }
    return left.length - right.length;
  } else if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  } else if (typeof left === 'number') {
    return compare([left], right);
  } else {
    return compare(left, [right]);
  }
}

// Part 1
let sum = 0;
data.forEach(([left, right], i) => {
  if (compare(left, right) < 0) {
    sum += i + 1;
  }
});
console.log(sum);

// Part 2
const d1 = [[2]];
const d2 = [[6]];
const packets = [d1, d2];
data.forEach(row => {
  packets.push(...row);
});
packets.sort(compare);
console.log(
  (packets.findIndex(x => x === d1) + 1) * (packets.findIndex(x => x === d2) + 1)
);
