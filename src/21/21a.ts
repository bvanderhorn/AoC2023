import * as h from '../helpers';

var toId = (location: number[]) : number => location[0]*garden[0].length + location[1];
var getLocalNb = (loc: number[]) : number[][] => [[loc[0]-1, loc[1]], [loc[0]+1, loc[1]], [loc[0], loc[1]-1], [loc[0], loc[1]+1]];
var reduce = (loc: number[]) : number[] => [(loc[0]%garden.length + garden.length)%garden.length, 
                                            (loc[1]%garden[0].length + garden[0].length)%garden[0].length];
var isRock = (loc: number[]) : boolean => rocks.has(toId(reduce(loc)));
var getnb = (loc: number[]) : number[][] => getLocalNb(loc).filter(x => !isRock(x));
var calculate = (maxCount: number, part:number = 1) : number => {
    var current = new Map<string, number[]>();
    current.set(start.toString(), start);
    var last = new Map<string, number[]>();
    var counter = -1;
    var [evens, odds] = [1, 0];
    var v = false; // verbose
    console.time("part "+ part);
    while (++counter < maxCount) {
        //h.printv(v, "i:", counter, "last:", [...last.keys()], "current:", [...current.keys()]);
        var newCurrent = new Map<string, number[]>();
        current.forEach(loc => getnb(loc).forEach(nb => {
            var nbStr = nb.toString();
            if (!last.has(nbStr) && !newCurrent.has(nbStr)) {
                newCurrent.set(nbStr, nb);
                if (counter%2 == 0) odds++; else evens++;
            }
        }));
        last = current;
        current = newCurrent;
        //h.printv(v,"evens:", evens, "odds:", odds);
    }
    console.timeEnd("part " + part);
    return maxCount%2 == 0 ? evens : odds;
}

const garden = h.read("21", "garden.txt").split('');
// garden.stringc(x => x === "#", 'r', '','\n', 15).printc(x => x === "S", "c");
const rocks = garden.getCoors(x => x === "#")!.map(toId).toSet();
const start = garden.getCoor(x => x === "S")!;

h.print("part 1:", calculate(64, 1));
h.print("part 2:", calculate(1E4, 2));
