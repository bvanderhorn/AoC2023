import * as h from '../helpers';
type Coor = [number, number];
var getLocalNb = (loc: number[]) : number[][] => [[loc[0]-1, loc[1]], [loc[0]+1, loc[1]], [loc[0], loc[1]-1], [loc[0], loc[1]+1]];
var reduce = (loc: number[]) : Coor => [(loc[0]%garden.length + garden.length)%garden.length, 
                                            (loc[1]%garden[0].length + garden[0].length)%garden[0].length];
var isRock = (loc: number[]) : boolean => rocks.has(reduce(loc));
var getnb = (loc: number[]) : Coor[] => getLocalNb(loc).filter(x => !isRock(x)) as Coor[];
var calculate = (maxCount: number, part:number = 1) : number => {
    var current = new h.DoubleSet<number>([start]);
    var last = new h.DoubleSet<number>();
    var counter = 0;
    var [evens, odds] = [1, 0];
    var v = false; // verbose
    console.time("part "+ part);
    while (++counter <= maxCount) {
        //h.printv(v, "i:", counter, "last:", [...last.keys()], "current:", [...current.keys()]);
        var newCurrent = new h.DoubleSet<number>();
        current.forEach(loc => getnb(loc).forEach(nb => {
            if (!last.has(nb)) newCurrent.add(nb);
        }));
        [last, current] = [current, newCurrent];
        if (counter%2 == 0) evens += newCurrent.size; else odds += newCurrent.size;
        //h.printv(v,"evens:", evens, "odds:", odds);
    }
    console.timeEnd("part " + part);
    printCurrent(current, last);
    return maxCount%2 == 0 ? evens : odds;
}
var printCurrent = (current: h.DoubleSet<number>, last:h.DoubleSet<number>) : void => 
    garden.mapij((i,j,_) => current.has([i,j]) ? "O" : last.has([i,j]) ? "@" : garden[i][j]).stringc(x => x === "@", "c").printc(x => x == "O", "r");

const garden = h.read("21", "garden.txt").split('');
// garden.stringc(x => x === "#", 'r', '','\n', 15).printc(x => x === "S", "c");
const rocks = new h.DoubleSet<number>(garden.getCoors(x => x === "#")! as Coor[]);
const start = garden.getCoor(x => x === "S")! as Coor;

h.print("part 1:", calculate(65, 1));
// h.print("part 2:", calculate(1E3, 2));
