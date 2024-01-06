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

var cycle = (platform: string[][]) : void => {
    shiftDir(platform, 'n');
    shiftDir(platform, 'w');
    shiftDir(platform, 's');
    shiftDir(platform, 'e');
}

var northLoad = (platform: string[][]) : number => platform.mapij((i,j,x) => (x == 'O') ? platform.length - i : 0).sum0().sum();

var startPlatform = h.read("14", "platform.txt").split('');
var shiftedNorth = shiftDir(startPlatform.copy(), 'n');

// shiftedNorth.printc(x => x == 'O');
h.print("part 1:", northLoad(shiftedNorth));

// part 2
var cycles = 1000000000;
var states = new Map<string, number>();
var platform = startPlatform.copy(); 
var [loopStart, loopLength, loopIndex] = [-1, -1, -1];
for (var i = 0; i <= cycles; i++) {
    var state = platform.string();

    if (states.has(state)) {
        // found a loop!!
        loopStart = states.get(state)!;
        loopLength = i - loopStart;
        loopIndex = (cycles - i) % loopLength;
        for (var j = 0; j < loopIndex; j++) cycle(platform);
        break;
    }
    states.set(state, i);
    cycle(platform);
}

h.print("loop start:", loopStart, "loop length:", loopLength, "loop index:", loopIndex);
h.print("part 2:", northLoad(platform));
