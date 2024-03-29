import * as h from '../helpers';

var nextPos = (snake:number[][]) : number[] | undefined =>{
    var optionalNextPos = getConnectors(snake.last()).filter(x => !h.equals2(snake.get(-2),x));
    if (optionalNextPos.length == 0) return undefined;
    var nextPos = optionalNextPos[0];
    var nextConnectors = getConnectors(nextPos);
    return nextConnectors.includes2(snake.last())
        ? nextPos
        : undefined;
}

var getConnectors = (pos: number[]) : number[][] => {
    var value = tubes[pos[0]][pos[1]];
    if (value == 'S') value = '-'; // this is only true for my input, but saves me a complicated valid neighbour search

    if (value == '.') return [];
    var nb = "";
    if (value == '-') nb = 'lr';
    if (value == '|') nb = 'ud';
    if (value == 'L') nb = 'ur';
    if (value == 'J') nb = 'ul'; 
    if (value == '7') nb = 'dl';
    if (value == 'F') nb = 'dr';
    return h.materializeNb(tubes, pos, nb);
}

var tubes = h.read("10", "tubes.txt").split('').slice2(0,-1);
h.print("tubes dims:", tubes.length, tubes[0].length);

var sPos: number[] = tubes.getCoor(x => x == 'S')!;
var snake: number[][] = [sPos, getConnectors(sPos)[1]];

while (true) {
    var next = nextPos(snake);
    if (next === undefined) {
        h.print('snake does not connect');
        break;
    }
    if (h.equals2(next, snake[0])) {
        h.print('snake is closed');
        break;
    }
    snake.push(next);
}

h.print("part 1:", snake.length/2 );

// part 2
var insideDir = h.getSnakeInsideDirection(snake as [number, number][]);
// h.print(snake.map((s,i) => [s, turns[i]]).todict());
h.print("insideDir:", insideDir);

var internals = h.getSnakeInternalFields(tubes, snake as [number, number][]);
h.print("part 2:", internals.length);