import * as h from '../helpers';

// Dijkstra with weighted distances and max-3-straight-steps rule

type Coor = [number, number];
class Node {
    public loc: number; // location integer
    public fam: string; // family, combination of dir and loc
    public id: string; // unique id, combination of pot, dir and loc

    public constructor(
        public dist: number, // distance from init
        public pot: number, // potential (number of times the direction has been this before and including this time; max 3)
        public dir: string, // direction, one of 'udlr'
        public coor: Coor,  // coordinates [x, y]
        public from: Node | undefined = undefined // will be undefined for init
        ) {
        this.loc = coorToInt(coor);
        this.fam = [dir, this.loc].join('');
        this.id = pot + this.fam;
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
        else {
            var index = list.findIndex(nl => nl.id == n.id);
            if (index == -1) list.push(n);
            else list[index] = n;
        }
    }

    public get (n: Node) : Node | undefined {
        var list = this.value.get(n.loc);
        if (list == undefined) return undefined;
        else return list.find(nl => nl.id == n.id);
    }

    public delete (n: Node) : void {
        var list = this.value.get(n.loc);
        if (list == undefined) return;
        else {
            var index = list.findIndex(nl => nl.id == n.id);
            if (index != -1) list.splice(index, 1);
        }
    }

    public getFamily (n: Node) : Node[] {
        var list = this.value.get(n.loc);
        if (list == undefined) return [];
        else return list.filter(nl => nl.fam == n.fam);
    }
}

var mdist = (c1: Coor, c2: Coor) : number => Math.abs(c1[0] - c2[0]) + Math.abs(c1[1] - c2[1]);

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
var next2 = new Visited(); // loc => Nodes

var visited = new Visited(); // loc => Nodes

// find all distances from init for all nodes
var goalN: Node | undefined = undefined;
var v = false; // verbose
var iterator = 0;
var haltloc = 166;
console.time("dijkstra");
var pb = new h.ProgressBar(bmap.length*bmap[0].length*12, 1E3);
while(next.length > 0 && (!v || (v && iterator < 5))){
    // get lowest set of nexts as curs
    next.sort((n1, n2) => n1[0] - n2[0]);
    var [_, curs] = next.shift()!;

    // get and inspect neighbors for each cur
    curs.sort((n1, n2) =>  mdist(n1.coor,goal) - mdist(n2.coor,goal)); // sort on loc to treat the closest to the goal first
    var minDist = mdist(curs[0].coor,goal);
    curs = curs.filter(c => mdist(c.coor,goal) < minDist + Math.round(bmap.length/8)); // only treat the closest nodes to the goal
    for (const cur of curs) {
        if (cur.loc == haltloc) {
            var henk = 1;
        }
        var dist = cur.dist;
        h.printv(v,"step", iterator, "\ndist", dist, "\ncur", cur.id, 
            "\nnext",next.map(n => [n[0], n[1].map(node => node.id)]).todict(), 
            "\nvisited", [...visited.value.values()].flatMap((vis:Node[]) => vis.map(n => n.id)));
        
        // --- get unvisited neighbors ----
        // get all neighbors
        var nbstring = cur.dir == '?' ? 'udlr' : cur.dir == 'u' ? 'ulr' : cur.dir == 'd' ? 'dlr' : cur.dir == 'l' ? 'lud' : 'rud'; // no 180 degree turns allowed!!
        var allNbCoor = h.getnb(cur.coor, bmap.length-1, bmap[0].length-1, nbstring) as Coor[];
        
        // convert to nodes
        var nb: Node[] = allNbCoor.map(c => {
            var dir = getDir(cur.coor, c);
            var pot = cur.dir == dir ? cur.pot + 1 : 1;
            return new Node(dist + bmap[c[0]][c[1]], pot, dir, c, cur);
        });
        // filter on pot <= 3 and unvisited
        nb = nb.filter(n => n.pot <= 3 && !visited.has(n)); // <= implementation of max-3-straight-steps rule!!

        // filter on no family members in next of visited with lower pot and lower dist
        nb = nb.filter(n => visited.getFamily(n).concat(next2.getFamily(n)).filter(f => f.pot < n.pot && f.dist <= n.dist).length == 0 );

        h.printv(v, "nb", nb.map(n => n.id));

        // add to next or update if distance shorter than existing with same id
        for (const n of nb) {

            // set or update next if shorter or not present
            if (next2.has(n)) {
                // update if shorter
                var oldn = next2.get(n)!;
                if (n.dist < oldn.dist) {
                    next2.set(n);
                    deleteFromNextIfPresent(oldn, next);
                    setToNext(n, next);
                }
            } else {
                // add to next
                next2.set(n);
                setToNext(n, next);
            }
        }

        // add cur to visited
        visited.set(cur);
        next2.delete(cur);

        // check if goal
        if (cur.loc == coorToInt(goal)) {
            goalN = cur;
            break;
        }
        pb.show(iterator);
        iterator++;
    }

    // break if goal
    if (goalN != undefined) break;
}
console.timeEnd("dijkstra");

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
// bmap.printc((_, i, j) => path.map(p=>p.loc).includes(coorToInt([i,j])), 'm');
