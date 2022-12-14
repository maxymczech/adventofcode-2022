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

const width  = bounds[0].to - bounds[0].from + 1;
const height = bounds[1].to + 1;
const cave = [];
for (let i = 0; i < height; i++) {
  cave[i] = [];
  for (let j = 0; j < width; j++) {
    cave[i].push('.');
  }
}

const print = () => {
  for (let i = 0; i < height; i++) {
    console.log(cave[i].join(''));
  }
}

data.forEach(line => {
  let [j, i] = line[0];
  let next = 1;
  cave[i][j - bounds[0].from] = '#';
  while (line[next]) {
    while (i != line[next][1] || j != line[next][0]) {
      if (i != line[next][1]) {
        i += (line[next][1] - i) / Math.abs(line[next][1] - i);
      }
      if (j != line[next][0]) {
        j += (line[next][0] - j) / Math.abs(line[next][0] - j);
      }
      cave[i][j - bounds[0].from] = '#';
    }
    next++;
  }
});

let count = 0;
while (true) {
  let sand = [500 - bounds[0].from, 0];
  count++;
  let hasSettled = false;
  while (sand[0] >= 0 && sand[0] < width && sand[1] < height) {
    if (cave[sand[1] + 1]?.[sand[0]] !== '#') {
      sand[1]++;
    } else {
      if (sand[1] === height - 1) {
        break;
      } else {
        if (cave[sand[1] + 1][sand[0] - 1] !== '#') {
          sand[1]++;
          sand[0]--;
        } else if (cave[sand[1] + 1][sand[0] + 1] !== '#') {
          sand[1]++;
          sand[0]++;
        } else {
          cave[sand[1]][sand[0]] = '#';
          hasSettled = true;
          break;
        }
      }
    }
  }
  if (!hasSettled) {
    console.log(count - 1);
    break;
  }
}
