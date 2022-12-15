const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('\r\n').map(row => {
  const m = row.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/);
  return [...m].slice(1).map(Number);
});

const getDistance = (sx, sy, bx, by) => Math.abs(sx - bx) + Math.abs(sy - by);
const unique = arr => [...new Set(arr)];

const targetY = 2000000;
let targetX = [];
const beaconXs = unique(data.filter(([sx, sy, bx, by]) => by === targetY).map(([sx, sy, bx, by]) => bx));
const intersects = ([a1, a2], [b1, b2]) => a1 >= b1 && a1 <= b2 || b1 >= a1 && b1 <= a2;

data.forEach(([sx, sy, bx, by]) => {
  const d = getDistance(sx, sy, bx, by);
  const dy = getDistance(0, targetY, 0, sy);
  const xInt = Math.abs(d - dy);
  if (dy >= d) {
    return;
  }
  targetX.push([sx - xInt, sx + xInt]);
});

while (true) {
  const next = [];
  let change = false;

  for (let i = 1; i < targetX.length; i++) {
    for (let j = 0; j < i; j++) {
      if (intersects(targetX[i], targetX[j])) {
        change = true;
        for (let k = 0; k < targetX.length; k++) {
          if (k !== i && k !== j) {
            next.push(targetX[k]);
          }
        }
        next.push([
          Math.min(targetX[i][0], targetX[j][0]),
          Math.max(targetX[i][1], targetX[j][1])
        ]);
        break;
      }
    }
    if (change) {
      break;
    }
  }

  if (!change) {
    break;
  }
  targetX = [...next];
}

const intervalsLength = targetX.map(([a, b]) => b - a + 1).reduce((a, b) => a + b, 0);

console.log(intervalsLength - beaconXs.length);
