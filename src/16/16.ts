import * as h from '../helpers';

type Beam = [[number, number], string];
type Line = [[number, number], [number, number]];

var progress = (beam: Beam, v:boolean = false) : Beam[] => {
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
    var nbBeams = nb.map((n:string,i:number) => [nbs[i], n] as Beam).filter(b => b[0] != undefined);

	h.printv(v,beam, tile, "=>", nb, "=>", nbBeams);
    return nbBeams;
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

var mergeIntervals = (linesMap: Map<number, Line[]>, dir:string) : Line[] => {
    var newLines: Line[] = [];
    linesMap.forEach((lines, key) => {
        var intervals = lines.map(l => dir == 'x' ? [l[0][1], l[1][1]] : [l[0][0], l[1][0]]);
        var merged = h.mergeIntervals(intervals, true);
        var newLinesFromKey = merged.map(m => dir == 'x' ? [[key, m[0]], [key, m[1]]] as Line : [[m[0], key], [m[1], key]] as Line)
        newLines.push(...newLinesFromKey);
    });
    return newLines;
}

var cross = (a: Line, b: Line) : number => {
    // a and b are horizontal/vertical combination
    var hor = a[0][0] == a[1][0] ? a : b;
    var hx = hor[0][0];
    var ver = a[0][0] == a[1][0] ? b : a;
    var vy = ver[0][1];
    var [hmin, hmax] = [hor[0][1], hor[1][1]].sort((a,b) => a-b);
    var [vmin, vmax] = [ver[0][0], ver[1][0]].sort((a,b) => a-b);
    return hmin <= vy && vy <= hmax && vmin <= hx && hx <= vmax
        ? 1 : 0;
}

var getLength = (line: Line) : number => Math.abs(line[0][0] - line[1][0]) + Math.abs(line[0][1] - line[1][1]) + 1;

var isInLine = (line: Line, point: [number, number]) : boolean => {
    var [[x1,y1], [x2,y2]] = line;
    var [xmin, xmax] = [x1,x2].sort((a,b) => a-b);
    var [ymin, ymax] = [y1,y2].sort((a,b) => a-b);
    var [x,y] = point;
    return x1 == x2 
        ? x == x1 &&  ymin <= y && y <= ymax 
        : y == y1 && xmin <= x && x <= xmax;
}

var getEnergized = (init: Beam, v: boolean = false) : number => {
    // find all the lines between interesting points and/or the edges of the contraption
    var remaining: Beam[] = [init];
    var lines: Line[] = [];
    var passed : Beam[] = [];
    var iterator = 0;
    while(remaining.length > 0){
        iterator++;
        var cur = remaining.shift()!;
        passed.push(cur);
        h.printv(v, "cur:", cur,", remaining:", remaining, "passed:", passed);
        var next = getNextInteresting(cur);
        h.printv(v, "next:", next);
        if (next == undefined) {
            var wall = getNextWall(cur);
            h.printv(v, "wall:", wall);
            lines.push([cur[0], wall]);
            continue;
        }

        lines.push([cur[0], next[0]]);

        var afterNext = progress(next,v).filter(a => !passed.includes2(a) && !remaining.includes2(a));
        h.printv(v, "afterNext:", afterNext);
        remaining.push(...afterNext);
    }

    // separate lines into vertical and horizontal
    var horizontals = lines.filter(l => l[0][0] == l[1][0]);
    var horizontalsByX = new Map<number, Line[]>();
    horizontals.map(l => horizontalsByX.get(l[0][0]) == undefined ? horizontalsByX.set(l[0][0], [l]) : horizontalsByX.get(l[0][0])!.push(l));

    var verticals = lines.filter(l => l[0][1] == l[1][1] && l[0][0] != l[1][0]);
    var verticalsByY = new Map<number, Line[]>();
    verticals.map(l => verticalsByY.get(l[0][1]) == undefined ? verticalsByY.set(l[0][1], [l]) : verticalsByY.get(l[0][1])!.push(l));

    // merge intervals into new set of lines
    var mergedH = mergeIntervals(horizontalsByX, 'x');
    var mergedV = mergeIntervals(verticalsByY, 'y');
    var allMerged = mergedH.concat(mergedV);

    h.printv(v, allMerged.length, "merged:\n",allMerged);

    // calculate energized: all horizontal points, plus all vertical points minus all crossings between horizontals and verticals
    var energized = allMerged.map(i => getLength(i)).sum();
    // h.printv(v, "base energized:", energized);
    var crossCorrection = mergedV.map(v => mergedH.map(h => cross(h,v)).sum()).sum();
    // h.printv(v, "cross correction:", crossCorrection);
    energized -= crossCorrection;
    // h.printv(v,"corrected energized:", energized);

    // h.printv(v, "\nhorizontal:\n", contraption.stringc((x,i,j) => mergedH.filter(l => isInLine(l, [i,j])).length > 0, 'c'), "\n")
    // h.printv(v, "\nvertical:\n", contraption.stringc((x,i,j) => mergedV.filter(l => isInLine(l, [i,j])).length > 0, 'm'), "\n")

    // h.printv(v, "\nenergized:\n", contraption.stringc((x,i,j) => allMerged.filter(l => isInLine(l, [i,j])).length > 0, 'r'), "\n")

    return energized;
}

var contraption = h.read("16", "contraption.txt").split('');

// isolate interesting points on the contraption
var interesting = contraption.getCoors(x => x != '.')!;
var intFromX = new Map<number, number[][]>();
interesting.map(i => intFromX.get(i[0]) == undefined ? intFromX.set(i[0], [i]) : intFromX.get(i[0])!.push(i));
var intFromY = new Map<number, number[][]>();
interesting.map(i => intFromY.get(i[1]) == undefined ? intFromY.set(i[1], [i]) : intFromY.get(i[1])!.push(i));

// part 1
var init: Beam = [[0, 0], 'r'];
var energized = getEnergized(init);
h.print("part 1:", energized);

// part 2
var vertEdge = h.range(0,contraption.length);
var horEdge = h.range(0,contraption[0].length);
var inits : Beam[] = [
    vertEdge.map(e => [[e, 0], 'r'] as Beam), 
    vertEdge.map(e => [[e, contraption[0].length-1], 'l'] as Beam),
    horEdge.map(e => [[0, e], 'd'] as Beam), 
    horEdge.map(e => [[contraption.length-1, e], 'u'] as Beam)
].flat();

var energizeds = inits.mapWithProgress(i => getEnergized(i));
h.print("part 2:", energizeds.max());