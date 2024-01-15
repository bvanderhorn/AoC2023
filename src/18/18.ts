import internal = require('stream');
import * as h from '../helpers';
type DigPlanItem = { dir: string,  dist: number,  hex: string }
type Dig = { dir: string,  dist: number }
type Coor = [number, number];
type Line = [Coor, Coor];

var hexToDig = (hex: string) : Dig => {
    return {
        dir: 'rdlu'.slice(+hex.slice(-1), +hex.slice(-1)+1),
        dist: h.hex2dec(hex.slice2(0,-1))
    }
}

var newCoor = (coor: Coor, dig: Dig) : Coor => {
    var [x, y] = coor;
    return dig.dir == 'u' ? [x - dig.dist, y] :
        dig.dir == 'd' ? [x + dig.dist, y] :
        dig.dir == 'l' ? [x, y - dig.dist] :
        dig.dir == 'r' ? [x, y + dig.dist] :
        [x, y];
}
var slen = (stretch: Coor) : number => Math.abs(stretch[0] - stretch[1]) + 1;
var slens = (stretches: Coor[]) : number => stretches.map(slen).sum();

var updateStretches = (stretches: Coor[], newStretch: Coor) : void => {
    var [x1, x2] =[newStretch.min(), newStretch.max()];
    for (const stretch of stretches) {
        var [y1, y2] = [stretch.min(), stretch.max()];
        // x1 = y1 or x2 = y2: reduce existing stretch
        if (x1 == y1 ) {
            if (x2 == y2) stretches.splice(stretches.findIndex(s => h.equals2(s, stretch)), 1);
            else stretch[0] = x2;
            return;
        }
        if (x2 == y2) {
            stretch[1] = x1;
            return;
        }

        // if new stretch is inside existing stretch: split existing stretch
        if (x1 > y1 && x2 < y2) {
            stretch[1] = x1;
            stretches.push([x2, y2]);
            return;
        }
    }

    // if new stretch is not inside existing stretches: add new stretch
    stretches.push(newStretch);
}

var countContaining = (digplan: Dig[]) : number => {
    // check if digplan contains subsequent digs in same direction
    var containsSubsequent = digplan.slice(1).map((d,i) => d.dir == digplan[i].dir).includes(true);
    h.print("containsSubsequent:", containsSubsequent);

    // dig
    var start : Coor = [0,0];
    var nodes : Coor[] = [start];
    digplan.map(d => nodes.push(newCoor(nodes.last(), d)));

    // create list of vertical lines
    var evens = 'ud'.includes(digplan[0].dir);
    var verticals: Line[] = [];
    nodes.map((n,i) => (i%2==0 && evens || i%2==1 && !evens) ? verticals.push(nodes.slice2(i, i+2) as Line) : null);

    // group vertical lines by x of end nodes
    var v = false; // verbose
    var verticalsByXList : [number, Line[]][] = [];
    verticals.map(v => {v.map(([x,y]) => {
        var index = verticalsByXList.findIndex(v => v[0] == x);
        if (index == -1) verticalsByXList.push([x, [v]]);
        else verticalsByXList[index][1].push(v);
    })});

    // sort on x, y
    verticalsByXList.sort((a,b) => a[0]-b[0]);
    verticalsByXList.map(v => v[1].sort((a,b) => a[0][1]-b[0][1]));

    h.printv(v,verticalsByXList.map(v => [v[0], v[1].map(l => l.toString())]).todict());

    // create lookups for vertical lines
    var interestingX = verticalsByXList.map(v => v[0]).sort((a,b) => a-b);
    var verticalsByX = verticalsByXList.todict();

    // loop through interesting horizontals and calculate inner surface
    var total = 0;
    var curStretches: Coor[] = [];
    var nextStretchTotals = 0;
    for (var i = 0; i < interestingX.length; i++) {
        const curX = interestingX[i];
        h.printv(v,"x:", curX);
        var switchStretchTotals = nextStretchTotals;
        var curVerticals: Line[] = verticalsByX.get(curX)!;
        var newStretches: Coor[] = [];
        curVerticals.map((v,i) => i%2==0 ? newStretches.push([v[0][1], curVerticals[i+1][0][1]]) : null);
        h.printv(v," new stretches:", newStretches);
        for (const newStretch of newStretches) {
            var curlen = slens(curStretches);
            updateStretches(curStretches, newStretch);
            curStretches = h.mergeIntervals2(curStretches as number[][], true) as Coor[];
            var newlen = slens(curStretches);

            if (newlen > curlen) {
                switchStretchTotals += newlen - curlen;
            }
        }
        h.printv(v," new curStretches:", curStretches);
        total += switchStretchTotals;
        h.printv(v," switchTotals:", switchStretchTotals, "total:", total);
        nextStretchTotals = slens(curStretches);

        if (i < interestingX.length - 1) {
            var nextX = interestingX[i+1];
            var deltaX = nextX - curX - 1;
            total += deltaX * nextStretchTotals;
            h.printv(v," deltaX:", deltaX, "nextStretchTotals:", nextStretchTotals, "total:", total);
        }
    }
    return total;
}

var digplan : DigPlanItem[] = h.read("18", "digplan.txt")
    .match(/(\w)\s+(\d+)\s+\(#([\d\w]+)\)/)
    .map(d => ({dir: d[0].toLowerCase(), dist: +d[1], hex: d[2]}));

h.print("part 1:",countContaining(digplan));

var digplan2 = digplan.map(d => hexToDig(d.hex));
// h.print(digplan2);
h.print("part 2:",countContaining(digplan2));