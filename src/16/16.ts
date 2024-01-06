import * as h from '../helpers';

type Beam = [[number, number], string];
type Line = [[number, number], [number, number]];

var progress = (beam: Beam) : Beam[] => {
    var [[x,y], dir] = beam;
    var nb = "";
    var tile = contraption[x][y];
    if ('.|-'.includes(tile)) {
        if (tile == '|' && "lr".includes(dir)) nb = 'ud';
        else if (tile == '-' && "ud".includes(dir)) nb = 'lr';
        else nb = dir;
    }
    if (tile == '\\') nb = dir == 'r' ? 'd' : dir == 'l' ? 'u' : dir == 'u' ? 'l' : 'r';
    if (tile == '/') nb = dir == 'r' ? 'u' : dir == 'l' ? 'd' : dir == 'u' ? 'r' : 'l';
    var nbs = nb.map( n => h.getnb([x,y], contraption.length-1, contraption[0].length-1, n)[0]);

	//h.print(beam, tile, "=>", nb, "=>", nbs);
    return nb.map((n:string,i:number) => [nbs[i], n] as Beam).filter(b => b[0] != undefined);
}

var getNextInteresting = (beam: Beam) : Beam | undefined => {
    var [[x,y], dir] = beam;

    var intline = 'ud'.includes(dir) ? intFromY.get(y) : intFromX.get(x);
    if (intline == undefined) return undefined;
    var nextInts = intline.filter(i => dir == 'u' ? i[0] <= x : dir == 'd' ? i[0] >= x : dir == 'l' ? i[1] <= y : i[1] >= y)
        .sort((a,b) => dir == 'u' ? b[0] - a[0] : dir == 'd' ? a[0] - b[0] : dir == 'l' ? b[1] - a[1] : a[1] - b[1])
        .map(i => [i, dir] as Beam);
    return nextInts.length == 0 ? undefined : nextInts[0];
}

var getNextWall = (beam: Beam) : [number, number] => {
    var [[x,y], dir] = beam;
    return dir == 'u' ? [0, y] : dir == 'd' ? [contraption.length-1, y] : dir == 'l' ? [x, 0] : [x, contraption[0].length-1];
}

var contraption = h.read("16", "contraption.txt", "ex").split('');
// h.print(contraption[0].slice(0,5));

// isolate interesting points on the contraption
var interesting = contraption.getCoors(x => x != '.')!;
var intFromX = new Map<number, number[][]>();
interesting.map(i => intFromX.get(i[0]) == undefined ? intFromX.set(i[0], [i]) : intFromX.get(i[0])!.push(i));
var intFromY = new Map<number, number[][]>();
interesting.map(i => intFromY.get(i[1]) == undefined ? intFromY.set(i[1], [i]) : intFromY.get(i[1])!.push(i));

// find all the lines between interesting points and/or the edges of the contraption
var init: Beam = [[0, 0], 'r'];
var remaining: Beam[] = [init];
var lines: Line[] = [];
var v = true; // verbose
var passed : Beam[] = [];
while(remaining.length > 0){
    var cur = remaining.shift()!;
    h.printv(v, "cur:", cur,", remaining:", remaining.length);
    var next = getNextInteresting(cur);
    h.printv(v, "next:", next);
    if (next == undefined) {
        var wall = getNextWall(cur);
        h.printv(v, "wall:", wall);
        lines.push([cur[0], wall]);
        continue;
    }

    lines.push([cur[0], next[0]]);

    if (passed.includes(next) || remaining.includes(next)) continue;
    passed.push(next);
    var afterNext = progress(next).filter(a => !passed.includes(a) && !remaining.includes(a));
    h.printv(v, "afterNext:", afterNext);
    remaining.push(...afterNext);
}

h.print(lines);
//h.print("part 1:", energized.map(e => e[0]).unique().length);
