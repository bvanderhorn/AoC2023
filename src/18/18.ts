import * as h from '../helpers';
type Dig = { dir: string,  dist: number,  hex: string }
type Coor = [number, number];

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

var evens = 'ud'.includes(digplan[0].dir);
var verticals: [Coor, Coor][] = [];
nodes.map((n,i) => (i%2==0 && evens || i%2==1 && !evens) ? verticals.push(nodes.slice2(i, i+2) as [Coor, Coor]) : null);
h.print(verticals);
// h.print("part 1:",h.getSnakeInternalFields(null, path as [number,number][], true, true).length);
