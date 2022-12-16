const fs = require('fs');
const rawData = fs.readFileSync('data.txt').toString();
const data = rawData.trim().split('\r\n').map(row => {
  const m = row.match(/Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/);
  const x = [...m].slice(1);
  return {
    flowRate: Number(x[1]),
    tunnels: x[2].split(', '),
    valve: x[0]
  };
});

const sum = (a, b) => a + b;
const unique = arr => [...new Set(arr)];

const graph = {};
data.forEach(item => {
  graph[item.valve] = item;
});

const nonZeroValves = data.filter(x => x.flowRate !== 0).map(x => x.valve);

const findShortestPath = (startNode, endNode) => {
  const shortestDistanceNode = (distances, visited) => {
    let shortest = null;
    for (let node in distances) {
      const currentIsShortest = shortest === null || distances[node] < distances[shortest];
      if (currentIsShortest && !visited.includes(node)) {
        shortest = node;
      }
    }
    return shortest;
  };
  const distances = {
    [endNode]: Infinity,
    [startNode]: 0
  };
  // distances = Object.assign(distances, graph[startNode]);
  const parents = {};
  graph[startNode].tunnels.forEach(valve => {
    parents[valve] = startNode
  });
  const visited = [];
  let node = shortestDistanceNode(distances, visited);
  while (node) {
    let distance = distances[node];
    let children = graph[node].tunnels; 
    for (let child of children) {
      if (child === startNode) {
        continue;
      } else {
        let newdistance = distance + 1;
        if (!distances[child] || distances[child] > newdistance) {
          distances[child] = newdistance;
          parents[child] = node;
        }
      }
    }
    visited.push(node);
    node = shortestDistanceNode(distances, visited);
  }

  let shortestPath = [endNode];
  let parent = parents[endNode];
  while (parent) {
    shortestPath.push(parent);
    parent = parents[parent];
  }
  shortestPath.reverse();

  let results = {
    distance: distances[endNode],
    path: shortestPath
  };

  return results;
}

const distances = {};
data.forEach(item1 => {
  distances[item1.valve] = {};
  data.forEach(item2 => {
    const path = findShortestPath(item1.valve, item2.valve);
    distances[item1.valve][item2.valve] = path.distance;
  });
});

let mostPressure = -Infinity;
const traverse = (currentValve, openValves = [], timeLeft = 30, pressure = 0) => {
  if (timeLeft < 0) {
    return;
  }
  if (timeLeft <= 0) {
    if (pressure > mostPressure) {
      mostPressure = pressure;
      // console.log(mostPressure);
    }
    return;
  }

  // Wait for timeLeft seconds
  const idlePressure = pressure + openValves.map(valve => graph[valve].flowRate * timeLeft).reduce(sum, 0);
  traverse(currentValve, openValves, 0, idlePressure)

  // Try opening each valve
  if (openValves.length !== nonZeroValves.length) {
    const next = nonZeroValves.filter(v => !openValves.includes(v)).map(valve => {
      const distance = distances[currentValve][valve];
      const nextPressure = pressure + openValves.map(valve => graph[valve].flowRate * (distance + 1)).reduce(sum, 0);
      return {
        distance: distance + 1,
        estimate: graph[valve].flowRate * (timeLeft - (distance + 1)),
        nextPressure,
        valve
      }
    }).sort((a, b) => b.estimate - a.estimate);
    next.forEach(item => {
      traverse(
        item.valve,
        [...openValves, item.valve],
        timeLeft - item.distance,
        item.nextPressure
      );
    });
  }
};
traverse('AA');
console.log(mostPressure);
