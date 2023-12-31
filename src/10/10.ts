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
    return h.getnb(pos, tubes.length-1, tubes[0].length-1, nb);
}

var tubes = h.read("10", "tubes.txt", "ex").split('');
var sPos: number[] = tubes.getCoor(x => x == 'S')!;
var snake: number[][] = [sPos, getConnectors(sPos)[1]];
h.print(snake);

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

// pt 2
var dirs: string[] = snake.map((_,i) => {
	var [dx, dy] = snake.get(i+1).plusEach(snake.get(i).times(-1));
	return dx == 0
	   ? dy > 0 ? 'r' : 'l'
	   : dx > 0 ? 'd' : 'u';
});

var turns: string[] = dirs.map((d,i) => dirs.get(i-1) + d);
var lr = turns.map(t => t[0] == t[1] ? 'S' : 'lurdl'.includes(t) ? 'R' : 'L');

h.print(snake.map((s,i) => [s, lr[i]]).todict());
