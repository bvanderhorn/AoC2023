import * as h from '../helpers';

var toId = (location: number[]) : number => location[0]*garden[0].length + location[1];
var getLocalNb = (loc: number[]) : number[][] => [[loc[0]-1, loc[1]], [loc[0]+1, loc[1]], [loc[0], loc[1]-1], [loc[0], loc[1]+1]];
var reduce = (loc: number[]) : number[] => [(loc[0]%garden.length + garden.length)%garden.length, 
                                            (loc[1]%garden[0].length + garden[0].length)%garden[0].length];
var isRock = (loc: number[]) : boolean => rocks.has(toId(reduce(loc)));
var getnb = (loc: number[]) : number[][] => getLocalNb(loc).filter(x => !isRock(x));

const garden = h.read("21", "garden.txt", "ex").split('');
// garden.stringc(x => x === "#", 'r', '','\n', 15).printc(x => x === "S", "c");
const rocks = garden.getCoors(x => x === "#")!.map(toId).toSet();
const start = garden.getCoor(x => x === "S")!;
var maxCount = 6;

var current = new Map<string, number[]>();
current.set(start.toString(), start);
var last = new Map<string, number[]>();
var counter = -1;
var [evens, odds] = [0, 0];

while (++counter < maxCount) {
    var newCurrent = new Map<string, number[]>();
    current.forEach(loc => getnb(loc).forEach(nb => {
        var nbStr = nb.toString();
        if (!last.has(nbStr)) {
            newCurrent.set(nbStr, nb);
            if (counter%2 == 0) odds++; else evens++;
        }
    }));
    last = current;
    current = newCurrent;
}
h.print("part 1:",maxCount%2 == 0 ? evens : odds);

h.print(-5, '%', 20, ':', -5%20);
