const utils = require('../../utils.js');
const fs = require('fs');
const dataRealRaw = fs.readFileSync('data.real.txt').toString();
const dataTestRaw = fs.readFileSync('data.test.txt').toString();
const processData = rawData => {
  // TODO: data preprocessing goes here
  return rawData.replace(/\r/g, '').trim().split('\n').map(row => row.split('').map(c => {
    if (c === '#') return null;
    if (c === '.') return [];
    return [c];
  }));
};
const dataReal = processData(dataRealRaw);
const dataTest = processData(dataTestRaw);

// TODO: get this from AoC webiste
const testAnswer = 54;

const print = data => {
  data.forEach(row => {
    console.log(row.map(cell => {
      if (!cell) return '#';
      if (cell.length === 0) return '.';
      if (cell.length === 1) return cell[0];
      return cell.length;
    }).join(''));
  });
  console.log('')
}

const solve = data => {
  const dirs = {
    'x': [ 0,  0],
    '>': [ 0,  1],
    '<': [ 0, -1],
    'v': [ 1,  0],
    '^': [-1,  0],
  };
  const simulate = data => {
    const next = [];
    for (let i = 0; i < data.length; i++) {
      const row = [];
      for (let j = 0; j < data[0].length; j++) {
        if (!data[i][j]) row.push(null);
        else row.push([]);
      }
      next.push(row);
    }
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[0].length; j++) {
        if (data[i][j]?.length) {
          data[i][j].forEach(c => {
            let ni;
            let nj;
            switch(c) {
              case '>':
                nj = next[i][j + 1] ? j + 1 : 1;
                next[i][nj].push('>');
              break;
              case '<':
                nj = next[i][j - 1] ? j - 1 : data[0].length - 2;
                next[i][nj].push('<');
              break;
              case 'v':
                ni = next[i + 1][j] ? i + 1 : 1;
                next[ni][j].push('v');
              break;
              case '^':
                ni = next[i - 1][j] ? i - 1 : data.length - 2;
                next[ni][j].push('^');
              break;
            }
          });
        }
      }
    }
    return next;
  }

  const pathLength = (from, target) => {
    let possible = [from];
    let step = 1;
    while (true) {
      data = simulate(data);
      const nextPossible = [];
      possible.forEach(([i, j]) => {
        if (i === target[0] && j === target[2]) {
          return c[0];
        }
        Object.values(dirs).forEach(([di, dj]) => {
          const ni = i + di;
          const nj = j + dj;
          if (data[ni]?.[nj]?.length === 0) {
            if (!nextPossible.find(([xi, xj]) => xi === ni && xj === nj)) {
              nextPossible.push([ni, nj]);
            }
          }
        });
      });
      possible = nextPossible;
      if (possible.find(([i, j]) => i === target[0] && j === target[1])) {
        return step;
      }
      step++;
    }
  }

  const jFrom = data[0].findIndex(Boolean);
  const jTo = data[data.length - 1].findIndex(Boolean);
  const from = [0, jFrom];
  const target = [data.length - 1, jTo];

  const a = pathLength(from, target);
  const b = pathLength(target, from);
  const c = pathLength(from, target);
  return a + b + c;
};

const testResult = solve(dataTest);
if (testResult === testAnswer) {
  const result = solve(dataReal);
  console.log(result);
  utils.submit(result, 2, 24, 2022);
} else {
  console.log('Test result does not match :(');
  console.log(testResult);
}
