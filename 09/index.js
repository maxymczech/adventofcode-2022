const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('\r\n').map(row => row.split(' ')).map(x => [x[0], Number(x[1])]);

const convertDirection = dir => {
  let dx = 0;
  let dy = 0;
  switch (dir) {
    case 'R': dx =  1; break;
    case 'L': dx = -1; break;
    case 'U': dy =  1; break;
    case 'D': dy = -1; break;
  }
  return [dx, dy];
};
const follow = (head, tail) => {
  if (head[0] !== tail[0] || head[1] !== tail[1]) {
    if (head[0] === tail[0]) {
      return [tail[0], head[1] > tail[1] ? head[1] - 1 : head[1] + 1];
    } else if (head[1] === tail[1]) {
      return [head[0] > tail[0] ? head[0] - 1 : head[0] + 1, tail[1]];
    } else if (Math.abs(tail[0] - head[0]) + Math.abs(tail[1] - head[1]) > 2) {
      return [
        tail[0] + (head[0] - tail[0]) / Math.abs(head[0] - tail[0]),
        tail[1] + (head[1] - tail[1]) / Math.abs(head[1] - tail[1])
      ];
    }
  }
  return [...tail];
};
const uniquePositions = (x => new Set([...x.map(x => x.toString())]).size);

// Part 1
const head = [0, 0];
let tail = [0, 0];
const tailPositions = [[0, 0]];
data.forEach(([dir, dist]) => {
  const [dx, dy] = convertDirection(dir);
  for (let i = 0; i < dist; i++) {
    head[0] += dx;
    head[1] += dy;
    tail = follow(head, tail);
    tailPositions.push([...tail])
  }
});
console.log(uniquePositions(tailPositions));

// Part 2
head[0] = 0;
head[1] = 0;
const tails = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
];
const tailPositions2 = [[0, 0]];
data.forEach(([dir, dist]) => {
  const [dx, dy] = convertDirection(dir);
  for (let i = 0; i < dist; i++) {
    head[0] += dx;
    head[1] += dy;

    let chead = [...head];
    for (let i = 0; i < tails.length; i++) {
      tails[i] = follow(chead, tails[i]);
      chead = [...tails[i]];
    }
    tailPositions2.push([...tails[tails.length - 1]]);
  }
});
console.log(uniquePositions(tailPositions2));
