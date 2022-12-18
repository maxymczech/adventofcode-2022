const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('\r\n').map(row => row.split(',').map(x => Number(x) + 1));

const d = 2 + Math.max(
  ...data.map(x => x[0]),
  ...data.map(x => x[1]),
  ...data.map(x => x[2])
);
const cubes = [];
for (let i = 0; i < d; i++) {
  cubes[i] = [];
  for (let j = 0; j < d; j++) {
    cubes[i][j] = [];
    for (let k = 0; k < d; k++) {
      cubes[i][j][k] = false;
    }
  }
}
data.forEach(([i, j, k]) => {
  cubes[i][j][k] = true;
});

const map = [
  [ 0,  0, -1],
  [ 0,  0,  1],
  [ 0, -1,  0],
  [ 0,  1,  0],
  [-1,  0,  0],
  [ 1,  0,  0],
]

// Part 1
let neighbors = 0;
for (let i = 0; i < d; i++) {
  for (let j = 0; j < d; j++) {
    for (let k = 0; k < d; k++) {
      if (cubes[i][j][k]) {
        let n = 0;
        map.forEach(([ni, nj, nk]) => {
          if (cubes[i + ni]?.[j + nj]?.[k + nk]) {
            n++;
          }
        });
        neighbors += n;
      }
    }
  }
}
const totalArea = data.length * 6 - neighbors;
console.log(totalArea);

// Part 2
const visited = [];
for (let i = 0; i < d; i++) {
  visited[i] = [];
  for (let j = 0; j < d; j++) {
    visited[i][j] = [];
    for (let k = 0; k < d; k++) {
      visited[i][j][k] = false;
    }
  }
}
const q = [[0, 0, 0]];
visited[0][0][0] = true;
let outsideArea = 0;
while (q.length) {
  const [i, j, k] = q.shift();
  map.forEach(([ni, nj, nk]) => {
    if (
      !visited[i+ni]?.[j+nj]?.[k+nk] &&
      i + ni >= 0 && j + nj >= 0 && k + nk >= 0 &&
      i + ni < d && j + nj < d && k + nk < d
    ) {
      if (cubes[i+ni][j+nj][k+nk]) {
        outsideArea++;
      } else {
        q.push([i + ni, j + nj, k + nk]);
        visited[i+ni][j+nj][k+nk] = true;
      }
    }
  });
}
console.log(outsideArea);
