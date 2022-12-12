const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('\r\n').map(row => row.split(''));

// Part 1
const end = [];
const queued = [];
const queue = [];

data.forEach((row, i) => {
  queued.push(new Array(row.length).fill(false));
  row.forEach((c, j) => {
    data[i][j] = {
      elevation: data[i][j].charCodeAt(0),
      steps: Infinity
    };
    if (c === 'E') {
      data[i][j] = {
        elevation: 'z'.charCodeAt(0),
        steps: Infinity
      };
      end.push(i, j);
    }
    if (c === 'S') {
      data[i][j] = {
        elevation: 'a'.charCodeAt(0),
        steps: 0
      };
      queue.push([i, j]);
      queued[i][j] = true;
    }
    if (c === 'a') {
      data[i][j].steps = 0;
      queue.push([i, j]);
      queued[i][j] = true;
    }
  });
});

while (queue.length) {
  const [ci, cj] = queue.shift();

  [
    [-1,  0],
    [ 1,  0],
    [ 0, -1],
    [ 0,  1]
  ].forEach(([di, dj]) => {
    const next = data[ci + di]?.[cj + dj];
    if (next && next.elevation - 1 <= data[ci][cj].elevation) {
      next.steps = Math.min(next.steps, data[ci][cj].steps + 1);
      if (!queued[ci + di][cj + dj]) {
        queued[ci + di][cj + dj] = true;
        queue.push([ci + di, cj + dj]);
      }
    }
  });
}

console.log(data[end[0]][end[1]].steps);
