import * as h from '../helpers';
type Coor3 = [number, number, number];
type Stone3 = [Coor3, Coor3];
type Coor2 = [number, number];
type Stone2 = [Coor2, Coor2];

var toLinearXY = (s: Stone2) : [number, number] => {
    var [[px, py], [vx, vy]] = s;
    var dydx = vx == 0 ? vy > 0 ? Infinity : -Infinity : vy/vx;
    return [dydx, py - px * vy/vx];
}

var stones : Stone3[] = h.read("24", "stones.txt", "ex").split(" @ ").split(", ").tonum();
var stones2 : Stone2[] = stones.map(s => s.map(c => c.slice(0,2)) as Stone2);
h.print(stones2.slice(0,3));
