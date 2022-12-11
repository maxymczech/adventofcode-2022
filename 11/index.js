const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('\r\n\r\n').map(row => row);

const sortFn = (a, b) => b - a;

const monkeys = data.map(monkey => {
  const result = {}
  const lines = monkey.trim().split('\r\n').map(x => x.trim());
  result.items = lines[1].slice('Starting items: '.length).split(', ').map(Number);
  result.operation = lines[2].slice('Operation: new = '.length);
  result.test = Number(lines[3].slice('Test: divisible by '.length));
  result.ifTrue = Number(lines[4].split(' ').pop());
  result.ifFalse = Number(lines[5].split(' ').pop());
  result.inspected = 0;
  return result;
});

// Part 1
const monkeysP1 = monkeys.map(monkey => ({
  ...monkey,
  items: [...monkey.items]
}));
for (let i = 0; i < 20; i++) {
  monkeysP1.forEach(monkey => {
    monkey.items.forEach(old => {
      const n = Math.floor(eval(monkey.operation) / 3);
      const index = n % monkey.test === 0 ? monkey.ifTrue : monkey.ifFalse;
      monkeysP1[index].items.push(n);
    });
    monkey.inspected += monkey.items.length;
    monkey.items = [];
  });
}
const p1 = monkeysP1.map(x => x.inspected).sort(sortFn);
console.log(p1[0] * p1[1]);

// Part 2
const monkeysP2 = monkeys.map(monkey => ({
  ...monkey,
  items: [...monkey.items.map(BigInt)],
  operation: monkey.operation.replace(/(\d+)/, 'BigInt($1)'),
  test: BigInt(monkey.test)
}));
const d = monkeysP2.reduce((acc, monkey) => acc * monkey.test, 1n);
for (let i = 0; i < 10000; i++) {
  monkeysP2.forEach(monkey => {
    monkey.items.forEach(old => {
      const n = eval(monkey.operation) % d;
      const index = n % monkey.test == 0 ? monkey.ifTrue : monkey.ifFalse;
      monkeysP2[index].items.push(n);
    });
    monkey.inspected += monkey.items.length;
    monkey.items = [];
  });
}
const p2 = monkeysP2.map(x => x.inspected).sort(sortFn);
console.log(p2[0] * p2[1]);
