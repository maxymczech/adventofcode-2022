const utils = require('../../utils.js');
const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('\r\n').map(row => row.split(': ')).map(([a, b]) => b.includes(' ') ? [a, ...b.split(' ')] : [a, Number(b)]);

const monkeys = {};
data.forEach(row => {
  monkeys[row[0]] = [...row.slice(1)];
});

const hasHumn = name => {
  if (name === 'humn') return true;
  if (monkeys[name].length === 1) {
    return false;
  } else {
    if (monkeys[name].includes('humn')) {
      return true;
    }
    return hasHumn(monkeys[name][0]) || hasHumn(monkeys[name][2]);
  }
}

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

const solvep2 = (name, want) => {
  if (name === 'humn') {
    console.log(want);
    return want;
  }
  if (monkeys[name].length === 1) {
    return monkeys[name][0];
  } else {
    const ord = hasHumn(monkeys[name][0]);
    const parts = ord ? [
      monkeys[name][2], monkeys[name][0]
    ] : [
      monkeys[name][0], monkeys[name][2]
    ];
    const a = solve(parts[0]);
    const op = monkeys[name][1];

    let val;
    switch (op) {
      case '+': val = want - a; break;
      case '*': val = want / a; break;
      case '-': val = ord ? want + a : a - want; break;
      case '/': val = ord ? want * a : a / want; break;
    }
    const b = solvep2(parts[1], val);
    return ord ? eval(`${b}${op}${a}`) : eval(`${a}${op}${b}`);
  }
}

const parts = hasHumn(monkeys.root[0]) ? [monkeys.root[2], monkeys.root[0]] : [monkeys.root[0], monkeys.root[2]];
const val = solve(parts[0]);
const result = solvep2(parts[1], val);
