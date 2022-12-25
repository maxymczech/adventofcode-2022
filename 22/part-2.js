const utils = require('../../utils.js');
const fs = require('fs');
const dataRealRaw = fs.readFileSync('data.real.txt').toString();
const dataTestRaw = fs.readFileSync('data.test.txt').toString();
const processData = rawData => {
  // TODO: data preprocessing goes here
  const tmp = rawData.replace(/\r/g, '').split('\n\n');
  const data = [
    tmp[0].split('\n'),
    tmp[1].replace(/([RL])/g, ' $1 ').split(' '),
  ];
  const widest = Math.max(...data[0].map(row => row.length));
  data[0] = data[0].map(row => row.padEnd(widest, ' '));
  return data;
};
const dataReal = processData(dataRealRaw);
const dataTest = processData(dataTestRaw);

// TODO: get this from AoC webiste
const testAnswer = 5031;

const solve = data => {
  const directions = ['>', 'v', '<', '^'];
  const [map, path] = data;
  const state = {
    y: 0,
    x: [...map[0]].findIndex(c => c === '.'),
    dir: 0
  }

  const cubeSize = 50;
  const warpRules = [
    null,
    [
      null,
      null,
      [8, 0, (x, y) => [0, 150 - 1 - y]],
      [12, 0, (x, y) => [0, 100 + x]]
    ],
    [
      [9, 2, (x, y) => [100 - 1, 150 - 1 - y]],
      [5, 2, (x, y) => [100 - 1, x - 50]],
      null,
      [12, 3, (x, y) => [x - 100, 200 - 1]],
    ],
    null,
    null,
    [
      [2, 3, (x, y) => [50 + y, 50 - 1]],
      null,
      [8, 1, (x, y) => [y - 50, 100]],
      null
    ],
    null,
    null,
    [
      null,
      null,
      [1, 0, (x, y) => [0, 150 - 1 - y]],
      [5, 0, (x, y) => [50, 50 + x]],
    ],
    [
      [2, 2, (x, y) => [150 - 1, 150 - 1 - y]],
      [12, 2, (x, y) => [50 - 1, x + 100]],
      null,
      null,
    ],
    null,
    null,
    [
      [9, 3, (x, y) => [y - 100, 150 - 1]],
      [2, 1, (x, y) => [100 + x, 0]],
      [1, 1, (x, y) => [y - 100, 0]],
      null,
    ],
  ];
  const stepDirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  // console.log(state);
  path.forEach(p => {
    if (p === 'R') {
      state.dir = (state.dir + 1) % directions.length;
    } else if (p === 'L') {
      state.dir = (state.dir - 1 + directions.length) % directions.length;
    } else {
      const steps = Number(p);
      for (let i = 0; i < steps; i++) {
        const faceNow = Math.floor(state.y / cubeSize) * 4 + Math.floor(state.x / cubeSize);
        let xNext = state.x + stepDirs[state.dir][0];
        let yNext = state.y + stepDirs[state.dir][1];
        let dirNext = state.dir;
        const faceNext = Math.floor((yNext) / cubeSize) * 4 + Math.floor((xNext) / cubeSize);
        if (faceNow !== faceNext && warpRules[faceNow]?.[state.dir]) {
          [xNext, yNext] = warpRules[faceNow][state.dir][2](state.x, state.y);
          dirNext = warpRules[faceNow][state.dir][1];
        }
        if (map[yNext][xNext] === '.') {
          state.x = xNext;
          state.y = yNext;
          state.dir = dirNext;
        } else {
          break;
        }
      }
    }
  });
  return (state.y + 1) * 1000 + (state.x + 1) * 4 + state.dir;
};

const result = solve(dataReal);
console.log(result);
