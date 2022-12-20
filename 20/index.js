const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('\r\n').map(Number);

const print = (xs, indices) => console.log(indices.map(i => xs[i]).join(', '));
const solve = (data, repeat, key) => {
  const xs = data.map(x => x * key)
  const indices = data.map((_, i) => i);
  // print(xs, indices);
  for (let i = 0; i < repeat; i++) {
    xs.map((x, i) => {
      const j = indices.findIndex(t => t === i);
      const insert = (j + x) % (data.length - 1);
      indices.splice(j, 1);
      if (insert === 0) {
        indices.push(i)
      } else {
        indices.splice(insert, 0, i);
      }
      // print(xs, indices);
    });
  }

  const zero = indices.findIndex(t => t === xs.findIndex(s => s === 0));
  console.log(
    xs[indices[(zero + 1000) % data.length]] +
    xs[indices[(zero + 2000) % data.length]] +
    xs[indices[(zero + 3000) % data.length]]
  );
};

// Part 1
solve([...data], 1, 1);

// Part 2
solve([...data], 10, 811589153);
