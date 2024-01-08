import * as h from '../helpers';

type Beam = [[number, number], string];

var progress = (beam: Beam) : Beam[] => {
    var [pos, dir] = beam;
    var [x, y] = pos;
    var nb = "";
    var tile = contraption[x][y];
    if ('.|-'.includes(tile)) {
        if (tile == '|' && "lr".includes(dir)) nb = 'ud';
        else if (tile == '-' && "ud".includes(dir)) nb = 'lr';
        else nb = dir;
    }
    if (tile == '\\') nb = dir == 'r' ? 'd' : dir == 'l' ? 'u' : dir == 'u' ? 'l' : 'r';
    if (tile == '/') nb = dir == 'r' ? 'u' : dir == 'l' ? 'd' : dir == 'u' ? 'r' : 'l';
    var nbs = nb.map( n => h.getnb(pos, contraption.length-1, contraption[0].length-1, n)[0]);

	//h.print(beam, tile, "=>", nb, "=>", nbs);
    return nb.map((n:string,i:number) => [nbs[i], n] as Beam).filter(b => b[0] != undefined);
}

var toInt = (beam: Beam) : number => beam[0][0] + beam[0][1] *1E3 + 'udlr'.indexOf(beam[1]) * 1E6;

var getEnergized = (init: Beam) : number => {
    var remaining: Beam[] = [init];
    var beams : Set<number> = new Set();
    beams.add(toInt(init));

    while(remaining.length > 0){
        var newBeams = progress(remaining.shift()!);
        newBeams.map(b => {
            var int = toInt(b);
            if (!beams.has(int)) {
                beams.add(int);
                remaining.push(b);
            }
        });
    }
    var energized = new Set<number>();
    beams.forEach(b => energized.add(b % 1E6));
    return energized.size;
}

var contraption = h.read("16", "contraption.txt").split('');

var init: Beam = [[0, 0], 'r'];
h.print("part 1:", getEnergized(init));

// part 2
var vertEdge = h.range(0,contraption.length);
var horEdge = h.range(0,contraption[0].length);
var inits : Beam[] = [
    vertEdge.map(e => [[e, 0], 'r'] as Beam), 
    vertEdge.map(e => [[e, contraption[0].length-1], 'l'] as Beam),
    horEdge.map(e => [[0, e], 'd'] as Beam), 
    horEdge.map(e => [[contraption.length-1, e], 'u'] as Beam)
].flat();

h.print("part 2:", inits.mapWithProgress(getEnergized).max());