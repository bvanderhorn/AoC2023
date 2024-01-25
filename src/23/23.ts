import { get } from 'http';
import * as h from '../helpers';
type Coor = [number, number];
type Loc = {id: string, coor: Coor, fromdir: string};
type Trail = {start: Loc, end: Loc, length: number};

var getdir = (from: Coor, to: Coor) : string => to[0] == from[0] ? (to[1] > from[1] ? "r" : "l") : (to[0] > from[0] ? "d" : "u");
var toId = (coor: Coor) : number => coor[0]*1000 + coor[1];
var upwards = (cur: Coor, next: Coor) : boolean => {
    var value = trails[next[0]][next[1]];
    if (value == '#') return false;
    if (value == '.') return true;
    var dir = getdir(cur, next);
    return dir == 'u' && value == 'v' || dir == 'd' && value == '^' || dir == 'l' && value == '>' || dir == 'r' && value == '<';
}

const trails = h.read("23", "trails.txt").split('');

const startCoor = [0, trails[0].getCoor(x => x == ".")![0]] as Coor;
const start = {id: "start", coor: startCoor, fromdir: "u"};
const endCoor = [trails.length-1, trails[trails.length-1].getCoor(x => x == ".")![0]] as Coor;

const visited = new Map<string, Loc>();
const validTrails : Trail[] = [];
const toExplore: Loc[] = [start];
while (toExplore.length > 0) {
    var current = toExplore.shift()!;
    var currentId = current.fromdir + toId(current.coor);
    if (visited.has(currentId)) continue;
    visited.set(currentId, current);

    var steps = 0;
    var cur = current;
    while (true) {
        var nb = h.getnb(cur.coor, trails.length, trails[0].length, ['u','d','l','r'].filter(d => d != cur.fromdir).join('')); // bare nb
        nb = nb.filter(n => trails[n[0]][n[1]] != '#'); // filter out bushes
        if (nb.length > 0) {
            
        }
        nb = nb.filter(n => !upwards(cur.coor, n as Coor)); // filter out upwards trails
    }
}