const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('\r\n').map(row => row.split(': ')).map(([a, b]) => b.includes(' ') ? [a, ...b.split(' ')] : [a, Number(b)]);

const monkeys = {};
data.forEach(row => {
  monkeys[row[0]] = [...row.slice(1)];
});

const solve = name => {
  if (monkeys[name].length === 1) {
    return monkeys[name][0];
  } else {
    const a = solve(monkeys[name][0]);
    const b = solve(monkeys[name][2]);
    const op = monkeys[name][1];
    return eval(`${a}${op}${b}`);
  }
}

const result = solve('root');
console.log(result);
