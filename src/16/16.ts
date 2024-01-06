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

var contraption = h.read("16", "contraption.txt").split('');
// h.print(contraption[0].slice(0,5));

var init: Beam = [[0, 0], 'r'];
var energized: Beam[] = [init];
var iterator = 0;
while(iterator < energized.length){
    var newBeams = progress(energized[iterator]);
    newBeams.map(b => {if (!energized.includes2(b)) energized.push(b);});
    iterator++;
}
h.print("part 1:", energized.map(e => e[0]).unique().length);
