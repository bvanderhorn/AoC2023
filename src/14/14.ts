import * as h from '../helpers';

var getPath = (pos:[number, number], dir:string, platform: string[][]) : string[] => {
    switch (dir) {
        case "n": return platform.col(pos[1]).slice(0, pos[0]).reverse();
        case "s": return platform.col(pos[1]).slice(pos[0]+1);
        case "w": return platform[pos[0]].slice(0, pos[1]).reverse();
        case "e": return platform[pos[0]].slice(pos[1]+1);
    }
    return undefined!;
}
var getNewPos = (pos: [number, number], dir: string, platform: string[][]) : [number, number] => {
    var path = getPath(pos, dir, platform);
    var slide = path.findIndex(x => x != '.');
    if (slide == -1) slide = path.length;
    switch (dir) {
        case "n": return [pos[0]-slide, pos[1]];
        case "s": return [pos[0]+slide, pos[1]];
        case "w": return [pos[0], pos[1]-slide];
        case "e": return [pos[0], pos[1]+slide];
    }
    return undefined!;
}

var shiftDir = (platform: string[][], dir: string) : string[][] => {
    platform.mapij((i,j,x) => {
        if (x == 'O') {
            var [newi, newj] = getNewPos([i,j], dir, platform);
            if (!h.equals2([i,j], [newi, newj])) {
                platform[newi][newj] = 'O';
                platform[i][j] = '.';
            }
        }
    })
    return platform;
}

var load = (platform: string[][], dir: string) : number => {
    return platform.mapij((i,j,x) => {
        if (x == 'O') {
            switch (dir) {
                case "n": return platform.length - i;
                case "s": return i+1;
                case "w": return j+1;
                case "e": return platform[0].length - j;
            }
            return undefined!;
        }
        return 0;
    }).sum0().sum();
}

var platform = h.read("14", "platform.txt").split('');
var shiftedNorth = shiftDir(platform.copy(), 'n');

// shiftedNorth.printc(x => x == 'O');
h.print("part 1:", load(shiftedNorth, 'n'));
