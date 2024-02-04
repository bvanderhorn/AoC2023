import * as h from '../helpers';
type Coor3 = [number, number, number];
type Stone3 = [Coor3, Coor3];
type Coor2 = [number, number];
type Stone2 = [Coor2, Coor2];

var intersect = (a: Stone2, b: Stone2) : boolean => {
    var [[a0x, a0y],[adx, ady]] = a;
    var [[b0x, b0y],[bdx, bdy]] = b;

    var right = b0y - a0y - b0x*bdy/bdx;
    var left = ady - adx*bdy/bdx;
    var u = right / left;
    var v = (a0x - b0x + u*adx) / bdx;
    return u >= 0 && v >= 0;
}

var stones : Stone3[] = h.read("24", "stones.txt", "ex").split(" @ ").split(", ").tonum();
var stones2 : Stone2[] = stones.map(s => s.map(c => c.slice(0,2)) as Stone2);
h.print(stones2.slice(0,3));

h.print(intersect([[0,2],[1,1]], [[4,2],[1,-1]]));
h.print(intersect([[0,2],[1,1]], [[4,2],[-1,1]]));
h.print(intersect([[0,2],[1,1]], [[2,1],[1,2]]));
h.print(intersect([[19,13],[-2,1]], [[18,19],[-1,-1]]));

// part 1
var intersectCount = 0;
for (const i of h.range(0, stones2.length-1) ) {
    for (const j of h.range(i+1, stones2.length) ) {
        if (intersect(stones2[i], stones2[j])) intersectCount++;
    }
}

h.print("part 1:", intersectCount);
