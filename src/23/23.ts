import { get } from 'http';
import * as h from '../helpers';
type Coor = [number, number];
type Loc = {id: string, coor: Coor, dir: string};
type Trail = {start: Loc, end: Loc, length: number};

var opposite = (dir: string) : string => dir == 'u' ? 'd' : dir == 'd' ? 'u' : dir == 'l' ? 'r' : 'l';
var getdir = (from: Coor, to: Coor) : string => to[0] == from[0] ? (to[1] > from[1] ? "r" : "l") : (to[0] > from[0] ? "d" : "u");
var toId = (coor: Coor) : number => coor[0]*1000 + coor[1];
var upwards = (cur: Coor, next: Coor) : boolean => {
    var value = trails[next[0]][next[1]];
    if (value == '#') return false;
    if (value == '.') return true;
    var dir = getdir(cur, next);
    return dir == 'u' && value == 'v' || dir == 'd' && value == '^' || dir == 'l' && value == '>' || dir == 'r' && value == '<';
}

const trails = h.read("23", "trails.txt", "ex").split('');

const startCoor = [0, trails[0].getCoor(x => x == ".")![0]] as Coor;
const start = {id: "start", coor: startCoor, dir: "d"};
const endCoor = [trails.length-1, trails[trails.length-1].getCoor(x => x == ".")![0]] as Coor;

const visited = new Map<string, Loc>();
const validTrails : Trail[] = [];
const toExplore: Loc[] = [start];
while (toExplore.length > 0) {
    var curstart = toExplore.shift()!;
    if (visited.has(curstart.id)) continue;
    visited.set(curstart.id, curstart);

    var steps = 0;
    var cur = curstart;
    while (true) {
        // treat special cases (we are at start or end)
        if (h.equals2(cur.coor, startCoor)) break;
        if (h.equals2(cur.coor, endCoor)) {
            validTrails.push({start: curstart, end: cur, length: steps});
            break;
        }

        // treat normal cases (we are on a junction or on a straight trail)
        var nb = h.getnb(cur.coor, trails.length, trails[0].length, ['u','d','l','r'].filter(d => d != opposite(cur.dir)).join('')) as Coor[]; // bare nb
        nb = nb.filter(n => trails[n[0]][n[1]] != '#'); // filter out bushes
        if (nb.length > 1) {
            // we are on a junction
            nb = nb.filter(n => !upwards(cur.coor, n)); // filter out upwards trails
            nb.map(n => getdir(cur.coor, n)).forEach(d => toExplore.push({id: d + toId(cur.coor), coor: cur.coor, dir: d})); // add remaining to toExplore

            // add the current trail to the valid trails (if not all trails are upwards)
            if (nb.length > 0) validTrails.push({start: curstart, end: cur, length: steps});
            break;
        }
        // else: we are on a straight trail
        nb = nb.filter(n => !upwards(cur.coor, n)); // filter out upwards trails
        if (nb.length == 0) break; // the trail ends here

        // this is a valid trail, continue
        steps++;
        var next = nb[0];
        var dir = getdir(cur.coor, next);
        cur = {id: dir + toId(next), coor: next, dir: dir};
    }
}

h.printobj(validTrails);