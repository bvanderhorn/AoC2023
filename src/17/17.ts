import * as h from '../helpers';

type Coor = [number, number];
var coorToInt = (coor: Coor) : number => coor[0] + coor[1]*bmap.length;
var intToCoor = (int: number) : Coor => [int % bmap.length, Math.floor(int / bmap.length)];
var setToNext = (coor: Coor, dist: number, next: [number, Coor[]][]) : void => {
    var index = next.findIndex(n => n[0] == dist);
    if (index == -1) next.push([dist, [coor]]);
    else next[index][1].push(coor);
}

var deleteFromNextIfPresent = (coor: Coor, dist: number, next: [number, Coor[]][]) : void => {
    var index = next.findIndex(n => n[0] == dist);
    if (index != -1) {
        var nextList = next[index][1];
        var coorIndex = nextList.findIndex(c => h.equals2(c, coor));
        if (coorIndex != -1) nextList.splice(coorIndex, 1);
    }
}

var bmap = h.read("17", "map.txt", "ex").split('').tonum();

// Dijkstra with weighted distances
// input
var xsize = bmap.length;
var init = [0, 0] as Coor;
var goal = [bmap.length-1, bmap[0].length-1] as Coor;

// init
var next : [number, Coor[]][] = [[0, [init]]]; // [dist, [coors]][]
var next2 = new Map<number, [number, number]>(); // coor int => [from nb int, dist]
var visited = new Map<number, [number, number]>(); // coor int => [from nb int, dist]

// find all distances from init for all nodes
while(next.length > 0){
    // get lowest set of nexts as curs
    next.sort((n1, n2) => n1[0] - n2[0]);
    var [dist, curs] = next.shift()!;

    // get and inspect neighbors for each cur
    for (const cur of curs) {
        var curInt = coorToInt(cur);

        // get unvisited neighbors
        var nb = h.getnb(cur, bmap.length-1, bmap[0].length-1).filter(n => !visited.has(coorToInt(n as Coor))) as Coor[];

        // add to next or update if distance shorter than current
        for (const n of nb) {
            var nInt = coorToInt(n);
            var nDist = dist + bmap[n[0]][n[1]];

            // set or update next if shorter or not present
            if (next2.has(nInt)) {
                // update if shorter
                var [_, oldDist] = next2.get(nInt)!;
                if (nDist < oldDist) {
                    next2.set(nInt, [curInt, nDist]);
                    deleteFromNextIfPresent(n, oldDist, next);
                    setToNext(n, nDist, next);
                }
            } else {
                // add to next
                next2.set(nInt, [curInt, nDist]);
                setToNext(n, nDist, next);
            }
        }

        // add cur to visited
        visited.set(curInt, next2.get(curInt)!);
        next2.delete(curInt);
    }
}

// get shortest path and dist from init to goal
var goalInt = coorToInt(goal);
var dist = visited.get(goalInt)![1];
var intPath = [goalInt];
var cur = goalInt;
while(cur != coorToInt(init)){
    var [fromNb, _] = visited.get(cur)!;
    intPath.unshift(fromNb);
    cur = fromNb;
}

// print shortest path
h.print("shortest path from", init, "to", goal, "is", dist, "long");
bmap.printc((_, i, j) => intPath.includes(coorToInt([i,j])), 'm');
