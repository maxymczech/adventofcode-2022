const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('\r\n').map(row => row.split('').map(Number));

// Part 1
const vis = data.map((row, i) => row.map((x, j) => {
  return i === 0 || j === 0 || i === data.length - 1 || j === data[0].length - 1;
}));
for (let i = 1; i < data.length - 1; i++) {
  let mh = data[i][0];
  for (let j = 1; j < data[0].length - 1; j++) {
    if (data[i][j] > mh) vis[i][j] = true;
    mh = Math.max(mh, data[i][j]);
  }
  mh = data[i][data[i].length - 1];
  for (let j = data[0].length - 2; j >= 1; j--) {
    if (data[i][j] > mh) vis[i][j] = true;
    mh = Math.max(mh, data[i][j]);
  }
}
for (let j = 1; j < data[0].length - 1; j++) {
  let mh = data[0][j];
  for (let i = 1; i < data.length - 1; i++) {
    if (data[i][j] > mh) vis[i][j] = true;
    mh = Math.max(mh, data[i][j]);
  }
  mh = data[data.length - 1][j];
  for (let i = data.length - 2; i >= 1; i--) {
    if (data[i][j] > mh) vis[i][j] = true;
    mh = Math.max(mh, data[i][j]);
  }
}
let total = 0;
vis.forEach(row => {
  row.forEach(val => {
    if (val) total++;
  })
});
console.log(total);

// Part 2
let bestDistance = 1;
for (let x = 1; x < data.length - 1; x++) {
  for (let y = 1; y < data[0].length - 1; y++) {
    let distance = 1;

    let s = 1;
    for (let i = x - 1; i >= 1; i--) {
      if (data[i][y] >= data[x][y]) break;
      s++;
    }
    distance *= s;

    let t = 1;
    for (let i = x + 1; i < data.length - 1; i++) {
      if (data[i][y] >= data[x][y]) break;
      t++;
    }
    distance *= t;

    let u = 1;
    for (let j = y + 1; j < data[0].length - 1; j++) {
      if (data[x][j] >= data[x][y]) break;
      u++;
    }
    distance *= u;

    v = 1;
    for (let j = y - 1; j >= 1; j--) {
      if (data[x][j] >= data[x][y]) break;
      v++;
    }
    distance *= v;

    bestDistance = Math.max(bestDistance, distance);
  }
}
console.log(bestDistance);
