const utils = require('../../utils.js');
const fs = require('fs');
const dataRealRaw = fs.readFileSync('data.real.txt').toString();
const dataTestRaw = fs.readFileSync('data.test.txt').toString();
const processData = rawData => {
  // TODO: data preprocessing goes here
  return rawData.replace(/\r/g, '').trim().split('\n').map(row => row.split('').map(c => {
    if (c === '-') return -1;
    if (c === '=') return -2;
    return c;
  }).map(Number));
};
const dataReal = processData(dataRealRaw);
const dataTest = processData(dataTestRaw);

// TODO: get this from AoC webiste
const testAnswer = '2=-1=0'; //4890

const solve = data => {
  const fromSnafu = n => {
    return [...n].reverse().map((d,i) => d * (5 ** i)).reduce(sum);
  };
  const toSnafu = n => {
    if (n === 0) return [];
    switch (n % 5) {
      case 0: return ['0', ...toSnafu(Math.floor(n / 5))];
      case 1: return ['1', ...toSnafu(Math.floor(n / 5))];
      case 2: return ['2', ...toSnafu(Math.floor(n / 5))];
      case 3: return ['=', ...toSnafu(Math.floor((n + 2) / 5))];
      case 4: return ['-', ...toSnafu(Math.floor((n + 1) / 5))];
    }
  }
  const sum = (a,b)=>a+b;
  const t = data.map(fromSnafu).reduce(sum);
  const u = toSnafu(t).reverse().join('');
  return u;
};

const testResult = solve(dataTest);
if (testResult === testAnswer) {
  const result = solve(dataReal);
  utils.submit(result, 1, 25, 2022);
} else {
  console.log('Test result does not match :(');
  console.log(testResult);
}
