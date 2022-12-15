const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('\r\n').map(row => {
  const m = row.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/);
  return [...m].slice(1).map(Number);
});

const getDistance = (sx, sy, bx, by) => Math.abs(sx - bx) + Math.abs(sy - by);
const unique = arr => [...new Set(arr)];
const maxCoord = 4000000;
const minChunkSize = 1;
const notCovered = [];

const isCoveredByOne = (x, y, chunkSize) => data.some(([sx, sy, bx, by]) => {
  const d = getDistance(sx, sy, bx, by);
  return (
    getDistance(x, y, sx, sy) <= d &&
    getDistance(Math.min(x + chunkSize, maxCoord), y, sx, sy) <= d &&
    getDistance(x, Math.min(y + chunkSize, maxCoord), sx, sy) <= d &&
    getDistance(Math.min(x + chunkSize, maxCoord), Math.min(y + chunkSize, maxCoord), sx, sy) <= d
  );
});

const find = (x, y, chunkSize) => {
  if (!isCoveredByOne(x, y, chunkSize)) {
    if (chunkSize <= minChunkSize) {
      notCovered.push([x, y, chunkSize]);
    } else {
      const ds = Math.ceil(chunkSize / 2);
      find(x, y, ds);
      find(x + ds, y, ds);
      find(x, y + ds, ds);
      find(x + ds, y + ds, ds);
    }
  }
}
find(0, 0, maxCoord);

notCovered.forEach(([x, y, chunkSize]) => {
  for (let i = x; i <= x + chunkSize; i++) {
    for (let j = y; j <= y + chunkSize; j++) {
      if (!isCoveredByOne(i, j, 0)) {
        const frequency = BigInt(i) * BigInt(4000000) + BigInt(j);
        console.log(frequency);
      }
    }
  }
});
