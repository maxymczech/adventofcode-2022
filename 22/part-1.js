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
const testAnswer = 6032;

const solve = data => {
  const directions = ['>', 'v', '<', '^'];
  const [map, path] = data;
  const state = {
    y: 0,
    x: [...map[0]].findIndex(c => c === '.'),
    dir: 0
  }
  // console.log(state);
  path.forEach(p => {
    if (p === 'R') {
      state.dir = (state.dir + 1) % directions.length;
    } else if (p === 'L') {
      state.dir = (state.dir - 1 + directions.length) % directions.length;
    } else {
      const steps = Number(p);
      for (let i = 0; i < steps; i++) {
        switch (state.dir) {
          case 0:
            if (map[state.y][(state.x + 1) % map[0].length] === '.') {
              state.x = (state.x + 1) % map[0].length;
            } else if (map[state.y][(state.x + 1) % map[0].length] === ' ') {
              let j = 1;
              while (true) {
                if (map[state.y][(state.x + j) % map[0].length] === ' ') {
                  j++;
                } else {
                  break;
                }
              }
              if (map[state.y][(state.x + j) % map[0].length] !== '#') {
                state.x = (state.x + j) % map[0].length;
              }
            }
          break;
          case 1:
            if (map[(state.y + 1) % map.length][state.x] === '.') {
              state.y = (state.y + 1) % map.length;
            } else if (map[(state.y + 1) % map.length][state.x] === ' ') {
              let j = 1;
              while (true) {
                if (map[(state.y + j) % map.length][state.x] === ' ') {
                  j++;
                } else {
                  break;
                }
              }
              if (map[(state.y + j) % map.length][state.x] !== '#') {
                state.y = (state.y + j) % map.length;
              }
            }
          break;
          case 2:
            if (map[state.y][(state.x - 1 + map[0].length) % map[0].length] === '.') {
              state.x = (state.x - 1 + map[0].length) % map[0].length;
            } else if (map[state.y][(state.x - 1 + map[0].length) % map[0].length] === ' ') {
              let j = 1;
              while (true) {
                if (map[state.y][(state.x - j + map[0].length) % map[0].length] === ' ') {
                  j++;
                } else {
                  break;
                }
              }
              if (map[state.y][(state.x - j + map[0].length) % map[0].length] !== '#') {
                state.x = (state.x - j + map[0].length) % map[0].length;
              }
            }
          break;
          case 3:
            if (map[(state.y - 1 + map.length) % map.length][state.x] === '.') {
              state.y = (state.y - 1 + map.length) % map.length;
            } else if (map[(state.y - 1 + map.length) % map.length][state.x] === ' ') {
              let j = 1;
              while (true) {
                if (map[(state.y - j + map.length) % map.length][state.x] === ' ') {
                  j++;
                } else {
                  break;
                }
              }
              if (map[(state.y - j + map.length) % map.length][state.x] !== '#') {
                state.y = (state.y - j + map.length) % map.length;
              }
            }
          break;
        }
      }
    }
  });
  console.log(state);
  return (state.y + 1) * 1000 + (state.x + 1) * 4 + state.dir;
};

const testResult = solve(dataTest);
if (testResult === testAnswer) {
  const result = solve(dataReal);
  console.log(result);
  utils.submit(result, 1, 22, 2022);
} else {
  console.log('Test result does not match :(');
  console.log(testResult);
}
