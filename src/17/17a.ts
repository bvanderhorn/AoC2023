import * as h from '../helpers';

type Coor = [number, number];
class Node {
    public loc: number; // location integer
    public id: string; // unique id

    public constructor(
        public dist: number, // distance from init
        public pot: number, // potential (number of times the direction has been this before and including this time; max 3)
        public dir: string, // direction, one of 'udlr'
        public coor: Coor,  // coordinates [x, y]
        public from: Node | undefined = undefined // will be undefined for init
        ) {
        this.loc = coorToInt(coor);
        this.id = [pot, dir, this.loc].join('');
    }

    public get rank (): number { return this.dist*10 + this.pot; }
}

class Visited {
    public value : Map<number, Node[]> = new Map<number, Node[]>(); // loc => Nodes
    constructor() {}
    public has (n:Node) : boolean { 
        var list = this.value.get(n.loc);
        if (list == undefined) return false;
        else return list.map(nl => nl.id).includes(n.id);
     }

    public set (n: Node) : void {
        var list = this.value.get(n.loc);
        if (list == undefined) this.value.set(n.loc, [n]);
        else list.push(n);
    }
}

var coorToInt = (coor: Coor) : number => coor[0] + coor[1]*bmap.length;
var intToCoor = (int: number) : Coor => [int % bmap.length, Math.floor(int / bmap.length)];
var getDir = (from: Coor, to: Coor) : string => from[0] == to[0] ? (from[1] < to[1] ? 'r' : 'l') : (from[0] < to[0] ? 'd' : 'u');

var deleteFromNextIfPresent = (n: Node, next: [number, Node[]][]) : void => {
    var index = next.findIndex(nl => nl[0] == n.rank);
    if (index != -1) {
        var nextList = next[index][1];
        var nodeIndex = nextList.findIndex(c => c.id == n.id);
        if (nodeIndex != -1) nextList.splice(nodeIndex, 1);
    }
}
var setToNext = (n: Node, next: [number, Node[]][]) : void => {
    var index = next.findIndex(nl => nl[0] == n.rank);
    if (index == -1) next.push([n.rank, [n]]);
    else next[index][1].push(n);
}

var bmap = h.read("17", "map.txt", "ex").split('').tonum();

// Fast Dijkstra (because using Maps) with weighted distances
// input
var start = [0, 0] as Coor;
var goal = [bmap.length-1, bmap[0].length-1] as Coor;

var startN = new Node(0, 0, '?', start);

// init
var next : [number, Node[]][] = [[startN.rank, [startN]]]; // [rank, [nodes]][]
var next2 = new Map<string, Node>(); // id => Node

var visited = new Visited(); // loc => Nodes

// find all distances from init for all nodes
var goalN: Node | undefined = undefined;
var v = false; // verbose
var iterator = 0;
while(next.length > 0 && (!v || (v && iterator < 5))){
    // get lowest set of nexts as curs
    next.sort((n1, n2) => n1[0] - n2[0]);
    var [_, curs] = next.shift()!;

    // get and inspect neighbors for each cur
    for (const cur of curs) {
        var dist = cur.dist;
        h.printv(v,"step", iterator++, "\ndist", dist, "\ncur", cur.id, 
            "\nnext",next.map(n => [n[0], n[1].map(node => node.id)]).todict(), 
            "\nvisited", [...visited.value.values()].flatMap((vis:Node[]) => vis.map(n => n.id)));
        // --- get unvisited neighbors ----
        // get all neighbors
        var allNbCoor = h.getnb(cur.coor, bmap.length-1, bmap[0].length-1) as Coor[];
        // convert to nodes
        var nb: Node[] = allNbCoor.map(c => {
            var dir = getDir(cur.coor, c);
            var pot = cur.dir == dir ? cur.pot + 1 : 1;
            return new Node(dist + bmap[c[0]][c[1]], pot, dir, c, cur);
        });
        // filter on pot <= 3 and unvisited
        nb = nb.filter(n => n.pot <= 3 && !visited.has(n)); // <= implementation of max-3-straight-steps rule!!
        h.printv(v, "nb", nb.map(n => n.id));

        // add to next or update if distance shorter than current
        for (const n of nb) {

            // set or update next if shorter or not present
            if (next2.has(n.id)) {
                // update if shorter
                var oldn = next2.get(n.id)!;
                if (n.dist < oldn.dist) {
                    next2.set(n.id, n);
                    deleteFromNextIfPresent(oldn, next);
                    setToNext(n, next);
                }
            } else {
                // add to next
                next2.set(n.id, n);
                setToNext(n, next);
            }
        }

        // add cur to visited
        visited.set(cur);
        next2.delete(cur.id);

        // check if goal
        if (cur.loc == coorToInt(goal)) {
            goalN = cur;
            break;
        }
    }

    // break if goal
    if (goalN != undefined) break;
}

// get shortest path and dist from init to goal
if (goalN == undefined) throw "no path found";
var path: Node[] = [goalN];
var cur = goalN;
while(cur.id != startN.id){
    path.unshift(cur.from!);
    cur = cur.from!;
}

// print shortest path
h.print("shortest path from", start, "to", goal, "is", goalN.dist, "long");
bmap.printc((_, i, j) => path.map(p=>p.loc).includes(coorToInt([i,j])), 'm');
