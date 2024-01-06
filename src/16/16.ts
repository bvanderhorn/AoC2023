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
    
    return nb.map(n => [h.getnb(pos, contraption.length-1, contraption[0].length-1, n)[0], n] as Beam);
}

var contraption = h.read("16", "contraption.txt").split('');

var init: Beam = [[0, 0], 'r']; 
h.print(contraption[0].slice(0,5));