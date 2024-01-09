import * as h from '../helpers';

type Coor = [number, number];
var coorToInt = (coor: Coor, gridSizeX: number) : number => coor[0] + coor[1] *gridSizeX;
var intToCoor = (int: number, gridSizeX: number) : Coor => [int % gridSizeX, Math.floor(int / gridSizeX)];
var setToNext = (coor: Coor, dist: number, next: [number, Coor[]][]) : void => {
    var index = next.findIndex(n => n[0] == dist);
    if (index == -1) next.push([dist, [coor]]);
    else next[index][1].push(coor);
}

var deleteFromNext = (coor: Coor, dist: number, next: [number, Coor[]][]) : void => {
    var index = next.findIndex(n => n[0] == dist);
    if (index != -1) {
        var nextList = next[index][1];
        var coorIndex = nextList.findIndex(c => h.equals2(c, coor));
        if (coorIndex != -1) nextList.splice(coorIndex, 1);
    }
}

var bmap = h.read("17", "map.txt", "ex").split('').tonum();

bmap.printc(x => x == 3, 'c');

// Dijkstra with weighted distances
var xsize = bmap[0].length;
var next : [number, Coor[]][] = [[0, [[0, 0]]]];
var next2 = new Map<number, [number, number]>(); // coor int => [from nb int, dist]
var visited = new Map<number, [number, number]>(); // coor int => [from nb int, dist]

while(next.length > 0){
    // get lowest set of nexts as curs
    next.sort((n1, n2) => n1[0] - n2[0]);
    var [dist, curs] = next.shift()!;

    // get and inspect neighbors for each cur
    for (const cur of curs) {
        var curInt = coorToInt(cur, xsize);

        // get unvisited neighbors
        var nb = h.getnb(cur, bmap.length-1, bmap[0].length-1).filter(n => !visited.has(coorToInt(n as Coor, xsize))) as Coor[];

        // add to next or update if distance shorter than current
        for (const n of nb) {
            var nInt = coorToInt(n, xsize);
            var nDist = dist + bmap[n[0]][n[1]];
            if (next2.has(nInt)) {
                // update if shorter
                var [oldFromNb, oldDist] = next2.get(nInt)!;
                if (nDist < oldDist) {
                    next2.set(nInt, [curInt, nDist]);
                    deleteFromNext(n, oldDist, next);
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

h.print(visited);