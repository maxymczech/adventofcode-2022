const utils = require('../../utils.js');
const fs = require('fs');
const dataRealRaw = fs.readFileSync('data.real.txt').toString();
const dataTestRaw = fs.readFileSync('data.test.txt').toString();
const processData = rawData => {
  // TODO: data preprocessing goes here
  return rawData.replace(/\r/g, '').trim().split('\n').map(row => row.split('')).map((row, y) => {
    return row.map((cell, x) => {
      if (cell !== '#') return null;
      return {x, y};
    });
  }).flat().filter(Boolean);
};
const dataReal = processData(dataRealRaw);
const dataTest = processData(dataTestRaw);

// TODO: get this from AoC webiste
const testAnswer = 110;

const print = data => {
  const mx = Math.min(...data.map(elf => elf.x));
  const my = Math.min(...data.map(elf => elf.y));
  const w = Math.max(...data.map(elf => elf.x)) - mx + 1;
  const h = Math.max(...data.map(elf => elf.y)) - my + 1;

  for (let y = -1; y <= h; y++) {
    const row = [];
    for (let x = -1; x <= w; x++) {
      row.push(
        data.find(i => i.x === x + mx && i.y === y + my) ? '#' : '.'
      );
    }
    console.log(row.join(''))
  }
  console.log('');
}

const solve = data => {
  const dirs = [0, 1, 2, 3];
  for (let i = 0; i < 10; i++) {
    const currentMap = {};
    data.forEach(({x, y}) => {
      currentMap[`${y}_${x}`] = true;
    });

    const targets = data.map(({x, y}) => {
      let hasNeighbor = false;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          if (currentMap[`${y + dy}_${x + dx}`]) {
            hasNeighbor = true;
          }
        }
      }
      if (hasNeighbor) {
        for (let j = 0; j < 4; j++) {
          const d = dirs[(j + i) % 4];
          if (d === 0 && ![
            `${y - 1}_${x - 1}`,
            `${y - 1}_${x}`,
            `${y - 1}_${x + 1}`
          ].some(k => currentMap[k])) {
            return {x, y: y - 1};
          }
          if (d === 1 && ![
            `${y + 1}_${x - 1}`,
            `${y + 1}_${x}`,
            `${y + 1}_${x + 1}`
          ].some(k => currentMap[k])) {
            return {x, y: y + 1};
          }
          if (d === 2 && ![
            `${y - 1}_${x - 1}`,
            `${y}_${x - 1}`,
            `${y + 1}_${x - 1}`
          ].some(k => currentMap[k])) {
            return {x: x - 1, y};
          }
          if (d === 3 && ![
            `${y - 1}_${x + 1}`,
            `${y}_${x + 1}`,
            `${y + 1}_${x + 1}`
          ].some(k => currentMap[k])) {
            return {x: x + 1, y};
          }
        }
      }
      return {x, y};
    });

    const currentTargets = {}
    targets.forEach(({x, y}) => {
      currentTargets[`${y}_${x}`] = currentTargets[`${y}_${x}`] ? 2 : 1;
    });

    data = targets.map(({x, y}, i) => {
      if (currentTargets[`${y}_${x}`] === 1) return {x, y};
      return {...data[i]};
    });
  }
  const w = Math.max(...data.map(elf => elf.x)) - Math.min(...data.map(elf => elf.x)) + 1;
  const h = Math.max(...data.map(elf => elf.y)) - Math.min(...data.map(elf => elf.y)) + 1;
  return w * h - data.length;
};

const testResult = solve(dataTest);
if (testResult === testAnswer) {
  const result = solve(dataReal);
  console.log(result);
  utils.submit(result, 1, 23, 2022);
} else {
  console.log('Test result does not match :(');
  console.log(testResult);
}
