import * as h from '../helpers';
type Coor = [number, number, number];
type Stone = [Coor, Coor];

var toLinearXY = (s: Stone) : [number, number] => {
    var [[px, py, _], [vx, vy, __]] = s;
    var dydx = vx == 0 ? vy > 0 ? Infinity : -Infinity : vy/vx;
    return [dydx, py - px * vy/vx];
}

var intersectXY = (a: Stone, b: Stone) : => {

var stones : Stone[] = h.read("24", "stones.txt", "ex").split(" @ ").split(", ").tonum();
h.print(stones.slice(0,3));
