import * as h from '../helpers';
type Coor = [number, number];
var getLocalNb = (loc: number[]) : number[][] => [[loc[0]-1, loc[1]], [loc[0]+1, loc[1]], [loc[0], loc[1]-1], [loc[0], loc[1]+1]];
var reduce = (loc: number[]) : Coor => [(loc[0]%garden.length + garden.length)%garden.length, 
                                            (loc[1]%garden[0].length + garden[0].length)%garden[0].length];
var isRock = (loc: number[]) : boolean => rocks.has(reduce(loc));
var getnb = (loc: number[]) : Coor[] => getLocalNb(loc).filter(x => !isRock(x)) as Coor[];
var calculate = (maxCount: number, odd: boolean|undefined = undefined, v:boolean = false) : number => {
    var current = new h.DoubleSet<number>([start]);
    var last = new h.DoubleSet<number>();
    var counter = 0;
    var [evens, odds] = [1, 0];
    while (++counter <= maxCount) {
        //h.printv(v, "i:", counter, "last:", [...last.keys()], "current:", [...current.keys()]);
        var newCurrent = new h.DoubleSet<number>();
        current.forEach(loc => getnb(loc).forEach(nb => {
            if (!last.has(nb)) newCurrent.add(nb);
        }));
        // if (counter == maxCount) print3(newCurrent, current, last);
        if (counter == maxCount && v) printCurrent(newCurrent);
        [last, current] = [current, newCurrent];
        if (counter%2 == 0) evens += newCurrent.size; else odds += newCurrent.size;
        //h.printv(v,"evens:", evens, "odds:", odds);
    }
    return odd != undefined 
        ? (odd ? odds : evens) 
        : maxCount%2 == 0 ? evens : odds;
}

var calculateSmart = (m: number) : number => {
    var odd: boolean = (m + Math.floor(garden.length/2)) % 2 == 1;
    var oddRoot = odd ? m+1 : m;
    var oddSign = odd ? -1 : 1;
    var evenRoot = odd ? m : m+1;
    var evenSign = odd ? 1 : -1;
    // h.print("oddRoot:", oddRoot, "oddSign:", oddSign, "evenRoot:", evenRoot, "evenSign:", evenSign);
    var [sqOdd, sqEven, corOdd, corEven] = [square(true), square(false), corners(true), corners(false)];
    // h.print("square, odd:", sqOdd, "even:", sqEven, "corners, odd:", corOdd, "even:", corEven);
    // h.print(sqOdd + sqEven + rocks.size, " = 131^2:", garden.length**2);
    // h.print(corOdd + corEven + rocks.values().filter(r => start.manhattan(r).sum() > Math.floor(garden.length/2)).length, " = 0.5*(n-1)*(n+1) = 65*132:", 0.5*(garden.length-1)*(garden.length+1));

    return (oddRoot**2)*sqOdd + oddSign*oddRoot*corOdd + (evenRoot**2)*sqEven + evenSign*evenRoot*corEven;
}
var square = (odd:boolean) : number => {
    // get all fields in the garden that are odd or even compared to the start 
    // (which is in the middle => an EVEN sum of coordinates), and substract the rocks
    var all = garden.mapij((i,j,_) => (i+j)%2 == (odd ? 1 : 0) ? 1 : 0).sum0().sum();
    return all - rocks.values().filter(r => (r[0]+r[1])%2 == (odd ? 1 : 0)).length;
}
//get all the fields in the middle diamond of the garden (odd or even compared to the start)
var diamond = (odd:boolean) : number => calculate(Math.floor(garden.length/2), odd, false);
var corners = (odd:boolean) : number => square(odd) - diamond(odd);
var print3 = (newCurrent: h.DoubleSet<number>, current: h.DoubleSet<number>, last:h.DoubleSet<number>) : void => 
    garden.mapij((i,j,_) => newCurrent.has([i,j]) ? "O" 
                            : current.has([i,j]) ? "@"
                            : last.has([i,j]) ? "X"
                            : garden[i][j])
                            .stringc(x => x === "@", "m")
                            .stringc(x => x == "X", "c")
                            .printc(x => x == "O", "r");
var printCurrent = (current: h.DoubleSet<number>) : void => {
	var [xmin, xmax, ymin, ymax] = [current.min0(), current.max0(), current.min1(), current.max1()];
    var [xl, yl] = [garden.length, garden[0].length];
    var dx = Math.floor(xmin/xl);
    var xsize = Math.ceil(xmax/xl)-dx;
    var dy = Math.floor(ymin/yl);
    var ysize = Math.ceil(ymax/yl)-dy;
    var field = garden.repeat([xsize, ysize]);
    
    field.mapij((i,j,_) => current.has([i+dx*xl,j+dy*yl]) ? "O" : field[i][j])
        .stringc((_,i:number,j:number) => [0,xl-1].includes(i%xl) || [0,yl-1].includes(j%yl) , "c")
        .printc(x => x == "O", "r");
}

const garden = h.read("21", "garden.txt").split('');
// garden.stringc(x => x === "#", 'r', '','\n', 15).printc(x => x === "S", "c");
const rocks = new h.DoubleSet<number>(garden.getCoors(x => x === "#")! as Coor[]);
const start = garden.getCoor(x => x === "S")! as Coor;

h.print("part 1:", calculate(64, undefined, false));

// part 2
h.print("(", 26501365, " - 65) % 131:", (26501365-65)%131);
h.print(26501365, "/131 :",26501365/131 );
var m = Math.floor(26501365/131);
m = 2;
h.print("part 2 brute force:", calculate(m*garden.length + Math.floor(garden.length/2), undefined, false));
h.print("part 2 smart:", calculateSmart(m));

