import * as h from '../helpers';

var getPath = (pos:[number, number], platform: string[][]) : string[] => platform.col(pos[1]).slice(0, pos[0]).reverse();
var getNewPos = (pos: [number, number], platform: string[][]) : [number, number] => {
    var path = getPath(pos, platform);
    var slide = path.findIndex(x => x != '.');
    if (slide == -1) slide = path.length;
    return [pos[0]-slide, pos[1]];
}

var shiftDir = (platform: string[][], dir: string) : string[][] => {
    var tempPlatform = platform.copy().rotate(dir == 'n' ? 0 : dir == 'w' ? 1 : dir == 's' ? 2 : 3);
    tempPlatform.mapij((i,j,x) => {
        if (x == 'O') {
            var [newi, newj] = getNewPos([i,j], tempPlatform);
            if (!h.equals2([i,j], [newi, newj])) {
                tempPlatform[newi][newj] = 'O';
                tempPlatform[i][j] = '.';
            }
        }
    })
    platform = tempPlatform.rotate(dir == 'n' ? 0 : dir == 'w' ? 3 : dir == 's' ? 2 : 1);
    return platform;
}

var shiftDirs = (platform: string[][], dirs:string) : void => {for(const dir of dirs) shiftDir(platform, dir)};

var cycle = (platform: string[][]) : void => shiftDirs(platform, 'nwse');

var northLoad = (platform: string[][]) : number => platform.mapij((i,j,x) => (x == 'O') ? platform.length - i : 0).sum0().sum();

var startPlatform = h.read("14", "platform.txt", "ex").split('');
var shiftedNorth = shiftDir(startPlatform.copy(), 'n');

// shiftedNorth.printc(x => x == 'O');
h.print("part 1:", northLoad(shiftedNorth));

// part 2
var cycles = 1000000000;
var states = new Map<string, number>();
var platform = startPlatform.copy(); 

for (var i = 0; i <= cycles; i++) {
    var state = platform.string();

    if (states.has(state)) {
        // found a loop!!
        var loopStart = states.get(state)!;
        var loopLength = i - loopStart;
        var loopIndex = (cycles - i) % loopLength;
        h.print("loop start:", loopStart, "loop length:", loopLength, "loop index:", loopIndex);
        for (var j = 0; j < loopIndex; j++) cycle(platform);
        break;
    }
    states.set(state, i);
    cycle(platform);
}

h.print("part 2:", northLoad(platform));
