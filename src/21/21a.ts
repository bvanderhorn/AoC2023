import * as h from '../helpers';
type Coor = [number, number];
var getLocalNb = (loc: number[]) : number[][] => [[loc[0]-1, loc[1]], [loc[0]+1, loc[1]], [loc[0], loc[1]-1], [loc[0], loc[1]+1]];
var reduce = (loc: number[]) : Coor => [(loc[0]%garden.length + garden.length)%garden.length, 
                                            (loc[1]%garden[0].length + garden[0].length)%garden[0].length];
var isRock = (loc: number[]) : boolean => rocks.has(reduce(loc));
var getnb = (loc: number[]) : Coor[] => getLocalNb(loc).filter(x => !isRock(x)) as Coor[];
var calculate = (maxCount: number, part:number = 1) : number => {
    var current = new h.DoubleSet<number>();
    current.add(start);
    var last = new h.DoubleSet<number>();
    var counter = -1;
    var [evens, odds] = [1, 0];
    var v = false; // verbose
    console.time("part "+ part);
    while (++counter < maxCount) {
        //h.printv(v, "i:", counter, "last:", [...last.keys()], "current:", [...current.keys()]);
        var newCurrent = new h.DoubleSet<number>();
        current.forEach(loc => getnb(loc).forEach(nb => {
            if (!last.has(nb) && !newCurrent.has(nb)) {
                newCurrent.add(nb);
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
const rocks = new h.DoubleSet<number>(garden.getCoors(x => x === "#")! as Coor[]);
const start = garden.getCoor(x => x === "S")! as Coor;

h.print("part 1:", calculate(64, 1));
h.print("part 2:", calculate(1E4, 2));
