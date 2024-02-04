import * as h from '../helpers';
type Coor = [number, number];
type Loc = {dirId: string, id:number, coor: Coor, dir: string};
type Trail = {start: Loc, startId: number, end: Loc, endId:number, length: number};
type TrailSet = {nodes: number[], length: number, head: Loc, dead: number};

var getUnvisitedNb = (node: number, visited: number[], trailList: Map<number, Trail[]>) : number[] => {
    var trails = trailList.get(node);
    if (trails == undefined) return [];
    return trails.map(x => x.endId).filter(n => !visited.includes(n));
}
    
var getStatus = (node: number, visited: number[], trailList: Map<number, Trail[]>) : string => {
    var nb = getUnvisitedNb(node, visited, trailList);
    if (nb.length == 0) return "dead";
    if (nb.length == 1) return "loner";
    if (nb.length == 2) {
        var subNb = nb.map(n => getUnvisitedNb(n, visited, trailList).filter(n => n != node).concat([n]));
        if (!subNb[0].some(sn => subNb[1].includes(sn))) return "tunnel";
    }
    return "ok";
}

var deadTunnel = (node:number, nodeNb:number[], tunnel:number, visited: number[], trailList: Map<number, Trail[]>) : number => {
    // if any tunnels: find how many are dead if taking the wrong turn
    var tunnelNb = getUnvisitedNb(tunnel, visited, trailList);
    var connectedNb = tunnelNb.map(n => findConnectedThrough(tunnel, n, visited, trailList));
    var deadNb = connectedNb.filter(n => !isAlive(n))[0];

    // if current node is on the 'dead' side: dead fields are still salvagable => alive!
    if (nodeNb.some(n => deadNb.includes(n))) return 0;

    // if current node is on the 'live' side: return number of dead ends
    return deadNb.length;
}

var vividGameState = (node: number, visited: number[], trailList: Map<number, Trail[]>) : boolean => {
    var alive = findConnected(endId, visited, trailList);
    var dead = allNodes(trailList).filter(n => !visited.includes(n) && !alive.includes(n));
    // more than two dead: not a vivid game state
    if (dead.length > maxDead) return false;

    // current node is dead if no unvisited nbs are alive: not a vivid game state
    var nodeNbs = getUnvisitedNb(node, visited, trailList);
    if (!alive.some(n => nodeNbs.includes(n))) return false;

    // if any tunnels: find how many are dead if taking the wrong turn
    var tunnels = alive.filter(n => getStatus(n, visited, trailList) == "tunnel");
    var maxDeadFromTunnels = tunnels.map(t => deadTunnel(node, nodeNbs, t, visited, trailList)).max();
    return maxDeadFromTunnels + dead.length <= maxDead;
}

var findConnectedThrough = (node: number, nb: number, visited: number[], trailList: Map<number, Trail[]>) : number[] => {
    var connected: number[] = [];
    var remaining = [nb];
    while (remaining.length > 0) {
        var cur = remaining.shift()!;
        connected.push(cur);
        var unvisitedNb = getUnvisitedNb(cur, visited, trailList).filter(n => n != node);
        var curNb = unvisitedNb.filter(n => !connected.includes(n) && !remaining.includes(n));
        remaining.push(...curNb);
    }
    return connected;
}

var findConnected = (node: number, visited: number[], trailList: Map<number, Trail[]>) : number[] => {
    var connected: number[] = [];
    var remaining = [node];
    while (remaining.length > 0) {
        var cur = remaining.shift()!;
        connected.push(cur);
        var unvisitedNb = getUnvisitedNb(cur, visited, trailList);
        var curNb = unvisitedNb.filter(n => !connected.includes(n) && !remaining.includes(n));
        remaining.push(...curNb);
    }
    return connected;
}

var allNodes = (trailList: Map<number, Trail[]>) : number[] => Array.from(trailList.keys());
var isAlive  = (nodes: number[]) : boolean => nodes.includes(endId);

var push = (trailList: Map<number, Trail[]>, start: Loc, end: Loc, length: number) => {
    var startId = toId(start.coor);
    var endId = toId(end.coor);
    if (!trailList.has(startId)) trailList.set(startId, []);
    trailList.get(startId)!.push({start: start, startId: startId, end: end, endId: endId, length: length} as Trail);
}
var pushSet = (trailList: Map<number, TrailSet[]>, set: TrailSet) => {
    if (!trailList.has(set.length)) trailList.set(set.length, []);
    trailList.get(set.length)!.push(set);
}
var opposite = (dir: string) : string => dir == 'u' ? 'd' : dir == 'd' ? 'u' : dir == 'l' ? 'r' : 'l';
var getdir = (from: Coor, to: Coor) : string => to[0] == from[0] ? (to[1] > from[1] ? "r" : "l") : (to[0] > from[0] ? "d" : "u");
var toId = (coor: Coor) : number => coor[0]*1000 + coor[1];
var upwards = (cur: Coor, next: Coor) : boolean => {
    var value = trails[next[0]][next[1]];
    if (value == '#') return true;
    if (value == '.') return false;
    var dir = getdir(cur, next);
    return dir == 'u' && value == 'v' || dir == 'd' && value == '^' || dir == 'l' && value == '>' || dir == 'r' && value == '<';
}

var reduce = (part: number) : Map<number, Trail[]> => {
    // reduce the problem to a set of valid trails between start, junctions and end
    const visited = new Map<string, Loc>();
    const validTrails = new Map<number, Trail[]>();
    const toExplore: Loc[] = [start];
    while (toExplore.length > 0) {
        var curstart = toExplore.shift()!;
        if (visited.has(curstart.dirId)) continue;
        visited.set(curstart.dirId, curstart);

        var steps = 0;
        var cur = curstart;
        while (true) {
            // treat special cases (we are at start or end)
            if (cur.id == start.id && cur.dir == 'u') break;
            if (cur.id == endId) {
                push(validTrails, curstart,cur, steps);
                if (part == 2) {
                    push(validTrails, cur,curstart, steps);
                }
                break;
            }
            if (cur.id == curstart.id) {
                // we are at the start of the current trail, move in direction of dir
                var nextPos = h.getnb(cur.coor, trails.length, trails[0].length, cur.dir)[0] as Coor;
                steps++;
                cur = {dirId: cur.dir + toId(nextPos), id: toId(nextPos), coor: nextPos, dir: cur.dir} as Loc;
                continue;
            }

            // treat normal cases (we are on a junction or on a straight trail)
            var nb = h.getnb(cur.coor, trails.length, trails[0].length, ['u','d','l','r'].filter(d => d != opposite(cur.dir)).join('')) as Coor[]; // bare nb
            nb = nb.filter(n => trails[n[0]][n[1]] != '#'); // filter out bushes
            if (nb.length > 1) {
                // we are on a junction
                if (part == 1) nb = nb.filter(n => !upwards(cur.coor, n)); // filter out upwards trails
                // add remaining to toExplore (if not already visited or in toExplore)
                var toExplores = nb.map(n => getdir(cur.coor, n)).map(d => { return {dirId: d + toId(cur.coor), id: toId(cur.coor), coor: cur.coor, dir: d} as Loc}); 
                toExplores.filter(t => !visited.has(t.dirId) && !toExplore.includes(t)).forEach(t => toExplore.push(t));

                // add the current trail to the valid trails (if not all following trails are upwards)
                if (nb.length > 0) push(validTrails, curstart,cur, steps);
                break;
            }
            // else: we are on a straight trail
            if (part == 1) nb = nb.filter(n => !upwards(cur.coor, n)); // filter out upwards trails
            if (nb.length == 0) break; // the trail ends here

            // this is a valid trail, continue
            steps++;
            var next = nb[0];
            var dir = getdir(cur.coor, next);
            cur = {dirId: dir + toId(next), id: toId(next), coor: next, dir: dir} as Loc;
        }
    }
    return validTrails;
}

var solve = (validTrails: Map<number, Trail[]>, part: number = 1) : [number, Map<number, TrailSet[]>] => {
    // cycle all possible combinations of valid trails from start to end, without visiting the same node twice
    const remaining : TrailSet[] = [{nodes: [toId(start.coor)], length: 0, head: start, dead: 0} as TrailSet];
    const fullTrails = new Map<number, TrailSet[]>();
    var maxLength = -1;
    while (remaining.length > 0) {
        var curSet = remaining.shift()!;
        var curNode: number = curSet.nodes.last();

        // move to done if set is complete
        if (curNode == endId) {
            if (curSet.length > maxLength) maxLength = curSet.length;
            pushSet(fullTrails, curSet);
            continue;
        }

        // if part 2 and game state is not vivid: don't continue this trail, just move on
        if (part == 2) if (! vividGameState(curNode, curSet.nodes, validTrails)) continue;

        // else: gather next trails, re-add to remaining
        var nextTrails = validTrails.get(curSet.nodes.last())!.filter(t => !curSet.nodes.includes(t.endId)); // filter out any trails to nodes that have already been visited
        nextTrails.forEach(t => {            
            var nextSet = {nodes: curSet.nodes.concat([t.endId]), length: curSet.length + t.length, head: t.end} as TrailSet;
            remaining.push(nextSet);
        });
    }
    return [maxLength, fullTrails];
}

const trails = h.read("23", "trails.txt").split('');

const startCoor = [0, trails[0].getCoor(x => x == ".")![0]] as Coor;
const start = {dirId: "start", id: toId(startCoor), coor: startCoor, dir: "d"} as Loc;
const endCoor = [trails.length-1, trails[trails.length-1].getCoor(x => x == ".")![0]] as Coor;
const endId = toId(endCoor);

// part 1
var validTrails1 = reduce(1);
var vsize1 = 0;
validTrails1.forEach(v => vsize1 += v.length);
h.print("nof valid trails (part 1):", vsize1);
var [maxLength1, _] = solve(validTrails1);
h.print("part 1:", maxLength1);

// part 2
const maxDead = 2;
console.time("build trails");
var validTrails2 = reduce(2);
var vsize2 = 0;
validTrails2.forEach(v => vsize2 += v.length);
h.print("nof valid trails (part 2):", vsize2);
// h.printobj(validTrails2);
console.timeEnd("build trails");
console.time("solve");
var [maxLength2, fullTrails] = solve(validTrails2,2);
console.timeEnd("solve");
h.print("part 2:", maxLength2);
h.print("number of full trails:", Array.from(fullTrails.values()).map(x => x.length).sum());
h.printobj(fullTrails.get(maxLength2));