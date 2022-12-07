const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('\r\n');

const tree = {
  children: [],
  name: '/',
  parent: null,
};
let current = tree;

data.forEach(row => {
  if (row[0] === '$') {
    if (row.startsWith('$ cd')) {
      const dir = row.slice(5);
      if (dir === '/') {
        current = tree;
      } else if (dir === '..') {
        current = current.parent;
      } else {
        const child = current.children.find(x => x.name === dir);
        if (child) {
          current = child;
        }
      }
    } else if (row.startsWith('$ ls')) {
    }
  } else {
    if (row.startsWith('dir')) {
      const name = row.slice(4);
      current.children.push({
        children: [],
        name,
        parent: current
      })
    } else if (row.match(/^\d+/)) {
      const [size, name] = row.split(' ');
      current.children.push({name, size: Number(size)});
    }
  }
});

// Part 1
let sum = 0;
const walk = node => {
  if (!node.size) {
    node.size = node.children.reduce((acc, child) => {
      return acc + walk(child);
    }, 0);
  }
  if (node.children && node.size <= 100000) {
    sum += node.size;
  }
  return node.size;
}
walk(tree);
console.log(sum);

// Part 2
const totalSize = 70000000;
const target = 30000000 - (totalSize - tree.size);
let best = Infinity;
const walk2 = node => {
  if (node.children) {
    if (node.size >= target && node.size < best) {
      best = node.size;
    }
    node.children.forEach(child => {
      walk2(child);
    });
  }
}
walk2(tree);
console.log(best);
