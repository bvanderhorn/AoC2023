import * as h from '../helpers';
type Coor3 = [number, number, number];
type Stone3 = [Coor3, Coor3];
type Coor2 = [number, number];
type Stone2 = [Coor2, Coor2];

var intersect = (a: Stone2, b: Stone2) : [boolean, Coor2 | undefined] => {
    var [[a0x, a0y],[adx, ady]] = a;
    var [[b0x, b0y],[bdx, bdy]] = b;

    // https://stackoverflow.com/a/2932601/1716283
    var dx = b0x - a0x;
    var dy = b0y - a0y;
    var det = bdx * ady - bdy * adx;
    if (det == 0) return [false, undefined];
    var u = (dy * bdx - dx * bdy) / det;
    var v = (dy * adx - dx * ady) / det;

    if (u >= 0 && v >= 0) {
        var p = [a0x + u * adx, a0y + u * ady];
        return [true, p as Coor2];
    }
    return [false, undefined];
}

var intersectWithin = (a: Stone2, b: Stone2, range:[Coor2, Coor2]) : boolean => {
    var result = intersect(a,b);
    if (!result[0]) return false;
    return h.overlaps(range[0], [result[1]![0], result[1]![0]]) && h.overlaps(range[1], [result[1]![1], result[1]![1]]);
}

var stones : Stone3[] = h.read("24", "stones.txt").split(" @ ").split(", ").tonum();
var stones2 : Stone2[] = stones.map(s => s.map(c => c.slice(0,2)) as Stone2);
h.print(stones2.slice(0,3));

// part 1
var intersectCount = 0;
var range = [200000000000000, 400000000000000] as Coor2;
for (const i of h.range(0, stones2.length-1) ) {
    for (const j of h.range(i+1, stones2.length) ) {
        var [a,b] = [stones2[i], stones2[j]];
        // var result = intersect(a,b);
        // h.print("stone",a, " vs ", b, ":", result[0], result[0] ? ("at" + result[1]) : "", " => ", intersectWithin(a,b, [range,range]));
        if (intersectWithin(a,b,[range, range])) intersectCount++;
    }
}

h.print("part 1:", intersectCount);
