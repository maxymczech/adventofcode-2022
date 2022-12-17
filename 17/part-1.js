const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('');

const rocks = [
  [
    [...'####'],
  ],
  [
    [...' # '],
    [...'###'],
    [...' # '],
  ],
  [
    [...'  #'],
    [...'  #'],
    [...'###'],
  ],
  [
    [...'#'],
    [...'#'],
    [...'#'],
    [...'#'],
  ],
  [
    [...'##'],
    [...'##'],
  ],
]

const height = 10000;
const width = 7;
const cave = [];
for (let i = 0; i < height; i++) {
  cave[i] = [];
  for (let j = 0; j < width; j++) {
    cave[i].push('.');
  }
}

const printCave = h => {
  for (let i = h - 1; i >= 0; i--) {
    console.log('|' + cave[i].join('') + '|');
  }
  console.log('|'.repeat(width + 2));
  console.log();
}

let highest = 0;
let wind = 0;
for (let rock = 0; rock < 2022; rock++) {
  const ri = rock % rocks.length;
  let bottomLine = highest + 3;
  let rockOffset = 2;
  while (bottomLine >= 0) {
    let wi = wind % data.length;
    wind++;
    if (data[wi] === '<' && rockOffset > 0) {
      let canMove = true;
      switch (ri) {
        case 0:
        case 3:
        case 4:
          for (let i = 0; i < rocks[ri].length; i++) {
            if (cave[bottomLine + i][rockOffset - 1] === '#') {
              canMove = false;
            }
          }
        break;
        case 1:
          if (
            cave[bottomLine][rockOffset] === '#' ||
            cave[bottomLine + 1][rockOffset - 1] === '#' ||
            cave[bottomLine + 2][rockOffset] === '#'
          ) {
            canMove = false;
          }
        break;
        case 2:
          if (cave[bottomLine][rockOffset - 1] === '#') {
            canMove = false;
          }
        break;
      }
      if (canMove) rockOffset--;
    }
    if (data[wi] === '>' && rockOffset < width - rocks[ri][0].length) {
      let canMove = true;
      switch (ri) {
        case 0:
        case 2:
        case 3:
        case 4:
          for (let i = 0; i < rocks[ri].length; i++) {
            if (cave[bottomLine + i][rockOffset + rocks[ri][0].length] === '#') {
              canMove = false;
            }
          }
        break;
        case 1:
          if (
            cave[bottomLine][rockOffset + 2] === '#' ||
            cave[bottomLine + 1][rockOffset + 3] === '#' ||
            cave[bottomLine + 2][rockOffset + 2] === '#'
          ) {
            canMove = false;
          }
        break;
      }
      if (canMove) rockOffset++;
    }

    if (bottomLine === 0) {
      break;
    } else {
      const rl = rocks[ri][rocks[ri].length - 1];
      let done = false;
      for (let i = 0; i < rl.length; i++) {
        if (rl[i] === '#' && cave[bottomLine - 1][i + rockOffset] === '#') {
          done = true;
          break;
        }
      }

      if (ri === 1) {
        if (cave[bottomLine][rockOffset] === '#' || cave[bottomLine][rockOffset + 2] === '#') {
          done = true;
        }
      }

      if (done) {
        break;
      }
    }

    bottomLine--;
  }

  highest = Math.max(highest, bottomLine + rocks[ri].length);
  for (let i = 0; i < rocks[ri].length; i++) {
    for (let j = 0; j < rocks[ri][0].length; j++) {
      if (rocks[ri][i][j] === '#') {
        cave[bottomLine + rocks[ri].length - 1 - i][rockOffset + j] = '#';
      }
    }
  }
}
console.log(highest);
