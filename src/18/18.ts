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

var digplan = h.read("18", "digplan.txt", "ex")
    .match(/(\w)\s+(\d+)\s+\((#[\d\w]+)\)/)
    .map(d => ({dir: d[0].toLowerCase(), dist: +d[1], hex: d[2]}));
h.print(digplan.slice(0,3));

// TODO: merge subsequent dig actions that are in the same direction

var start : Coor = [0,0];
var nodes : Coor[] = [start];
digplan.map(d => nodes.push(newCoor(nodes.last(), d)));

// create list of vertical lines
var evens = 'ud'.includes(digplan[0].dir);
var verticals: Line[] = [];
nodes.map((n,i) => (i%2==0 && evens || i%2==1 && !evens) ? verticals.push(nodes.slice2(i, i+2) as Line) : null);
h.print(verticals);

// group vertical lines by x of end nodes
var verticalsByXList : [number, Line[]][] = [];
verticals.map(v => {v.map(([x,y]) => {
    var index = verticalsByXList.findIndex(v => v[0] == x);
    if (index == -1) verticalsByXList.push([x, [v]]);
    else verticalsByXList[index][1].push(v);
})});
// sort on x, y
verticalsByXList.sort((a,b) => a[0]-b[0]);
verticalsByXList.map(v => v[1].sort((a,b) => a[0][1]-b[0][1]));

h.print(verticalsByXList.map(v => [v[0], v[1].map(l => l.toString())]).todict());

// create lookups for vertical lines
var interestingX = verticalsByXList.map(v => v[0]).sort((a,b) => a-b);
var verticalsByX = verticalsByXList.todict();

// loop through interesting horizontals and calculate inner surface
var total = 0;
var curStretches: Coor[] = [];
var nextStretchTotals = 0;
for (const curX of interestingX) {
    var curStretchTotals = nextStretchTotals;
    var curVerticals: Line[] = verticalsByX.get(curX)!;
    var xStretches: Coor[] = curVerticals.map(v => [v[0][0], v[1][0]]);

}

// h.print("part 1:",h.getSnakeInternalFields(null, path as [number,number][], true, true).length);
