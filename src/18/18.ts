import internal = require('stream');
import * as h from '../helpers';
type Dig = { dir: string,  dist: number,  hex: string }
type Coor = [number, number];
type Line = [Coor, Coor];

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
            stretch[0] = x2;
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

var digplan = h.read("18", "digplan.txt")
    .match(/(\w)\s+(\d+)\s+\((#[\d\w]+)\)/)
    .map(d => ({dir: d[0].toLowerCase(), dist: +d[1], hex: d[2]}));
h.print(digplan.slice(0,3));

// check if digplan contains subsequent digs in same direction
var containsSubsequent = digplan.slice(1).map((d,i) => d.dir == digplan[i].dir).includes(true);
h.print("containsSubsequent:", containsSubsequent);

var start : Coor = [0,0];
var nodes : Coor[] = [start];
digplan.map(d => nodes.push(newCoor(nodes.last(), d)));

// create list of vertical lines
var evens = 'ud'.includes(digplan[0].dir);
var verticals: Line[] = [];
nodes.map((n,i) => (i%2==0 && evens || i%2==1 && !evens) ? verticals.push(nodes.slice2(i, i+2) as Line) : null);
// h.print(verticals);

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
var lines = new Map<number, Coor[]|number>();
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
    lines.set(curX, switchStretchTotals);
    h.printv(v," switchTotals:", switchStretchTotals, "total:", total);
    nextStretchTotals = slens(curStretches);

    if (i < interestingX.length - 1) {
        var nextX = interestingX[i+1];
        var deltaX = nextX - curX - 1;
        h.range(1, deltaX + 1).map(j => lines.set(curX + j, curStretches.copy()));
        total += deltaX * nextStretchTotals;
        h.printv(v," deltaX:", deltaX, "nextStretchTotals:", nextStretchTotals, "total:", total);
    }
}

h.print("part 1:",total);

// old way comparison
var path = h.expandTrace(nodes);
var internalFields: Coor[] = h.getSnakeInternalFields(null, path as Coor[], true, true);
var internalFieldsMap = new Map<number, Coor[]>();
internalFields.map(f => {
    var [x, y] = f;
    var fields = internalFieldsMap.get(x);
    if (fields) fields.push(f);
    else internalFieldsMap.set(x, [f]);
});
h.print('convert internal fields map');
var iMap = new Map<number, Coor[]>();
internalFieldsMap.forEach((v,k) => iMap.set(k, h.numbersToIntervals(v.map(c => c[1])) as Coor[]));
h.print("compare");

for (var i = interestingX[0]; i<= interestingX.last(); i++) {
    var newLen = typeof(lines.get(i)!) == "number" ? lines.get(i)! : slens(lines.get(i)! as Coor[]);
    var oldLen = slens(iMap.get(i)!);
    if (newLen != oldLen) h.print("x:", i, "new:",newLen ,"(",lines.get(i), "), old:", oldLen, "(", iMap.get(i),")");
}
h.print("total: new:",Array.from(lines.values()).map(x => typeof(x)=="number" ? x : slens(x as Coor[])).sum(), "old:", Array.from(iMap.values()).map(slens).sum());

// print old
console.time("old map");
var xmin = internalFields.map(x => x[0]).min();
var ymin = internalFields.map(x => x[1]).min();
var oldMap = h.coorToMap(internalFields.map(x => [x[0], x[1], 1]), x => x == 1 ? '#' : '.');
console.timeEnd("old map");

// draw verticals
console.time("draw verticals");
verticals.map(v => h.expand(v[0],v[1]).map(c => oldMap[c[0]-xmin][c[1]-ymin] = 'x'));
console.timeEnd("draw verticals");

var mapString = oldMap.stringc(x => x == 'x', 'r');
h.print(mapString.addCoor([xmin, ymin]));


