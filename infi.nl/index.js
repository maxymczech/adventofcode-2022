const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('\r\n').map(row => row.split(' ')).map(([a, b]) => [a, Number(b)]);

const position = [0, 0];
let orientation = 0;
const direction = [
  [ 1,  0], // 0
  [ 1,  1], // 45
  [ 0,  1], // 90
  [-1,  1], // 135
  [-1,  0], // 180
  [-1, -1], // 225
  [ 0, -1], // 270
  [ 1, -1], // 315
];

const footPrint = 'x';
const output = [];
for (let i = 0; i < 8; i++) {
  output.push(
    new Array(80).fill(' ')
  );
}
output[0][0] = footPrint;

data.forEach(([command, argument]) => {
  switch (command) {
    case 'draai':
      orientation = (orientation + (argument / 45) + direction.length) % direction.length;
    break;
    case 'loop':
      for (let i = 0; i < argument; i++) {
        position[0] += direction[orientation][0];
        position[1] += direction[orientation][1];
        output[position[0]][position[1]] = footPrint;
      }
    break;
    case 'spring':
      position[0] += direction[orientation][0] * argument;
      position[1] += direction[orientation][1] * argument;
      output[position[0]][position[1]] = footPrint;
    break;
  }
});
console.log(position[0] + position[1]);

output.reverse().forEach(row => {
  console.log(row.join(''));
});
