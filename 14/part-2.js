const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('\r\n').map(row => row.split(' -> ').map(c => c.split(',').map(Number)));

const bounds = [{
  from: Math.min(...data.flat().map(x => x[0])),
  to: Math.max(...data.flat().map(x => x[0]))
}, {
  from: Math.min(...data.flat().map(x => x[1])),
  to: Math.max(...data.flat().map(x => x[1]))
}];

const height = bounds[1].to + 3;
const width  = bounds[0].to + 2 * height;
const cave = [];
for (let i = 0; i < height - 1; i++) {
  cave[i] = [];
  for (let j = 0; j < width; j++) {
    cave[i].push('.');
  }
}
cave[height - 1] = [];
for (let j = 0; j < width; j++) {
  cave[height - 1].push('#');
}

const print = () => {
  for (let i = 0; i < height; i++) {
    console.log(cave[i].join(''));
  }
}

data.forEach(line => {
  let [j, i] = line[0];
  let next = 1;
  cave[i][j] = '#';
  while (line[next]) {
    while (i != line[next][1] || j != line[next][0]) {
      if (i != line[next][1]) {
        i += (line[next][1] - i) / Math.abs(line[next][1] - i);
      }
      if (j != line[next][0]) {
        j += (line[next][0] - j) / Math.abs(line[next][0] - j);
      }
      cave[i][j] = '#';
    }
    next++;
  }
});

let count = 0;
while (true) {
  let sand = [500, 0];
  count++;
  while (true) {
    if (cave[sand[1] + 1]?.[sand[0]] !== '#') {
      sand[1]++;
    } else {
      if (cave[sand[1] + 1][sand[0] - 1] !== '#') {
        sand[1]++;
        sand[0]--;
      } else if (cave[sand[1] + 1][sand[0] + 1] !== '#') {
        sand[1]++;
        sand[0]++;
      } else {
        cave[sand[1]][sand[0]] = '#';
        break;
      }
    }
  }
  if (sand[1] === 0 && sand[0] === 500) {
    console.log(count);
    break;
  }
}
