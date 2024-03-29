import * as h from '../helpers';
type Coor = [number, number];
var getLocalNb = (loc: number[]) : number[][] => [[loc[0]-1, loc[1]], [loc[0]+1, loc[1]], [loc[0], loc[1]-1], [loc[0], loc[1]+1]];
var reduce = (loc: number[]) : Coor => [(loc[0]%size + size)%size, (loc[1]%size + size)%size];
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

var calculateSmart = (m: number,v:boolean = false) : number => 
    ((m+1)**2)*square(true) - (m+1)*corners(true) + (m**2)*square(false) + m*corners(false)
    - 0.5*m*(m+1)*8; // found out consistent error of 8*0.5*m*(m+1) by trial and error
                     // note: this probably has to do with the fact that the original diamond 
                     // did not take into account the effect of the rocks in the corners
var square = (odd:boolean) : number => {
    // get all fields in the garden that are odd or even compared to the start 
    // (which is in the middle => an EVEN sum of coordinates), and substract the rocks
    var all = garden.mapij((i,j,_) => (i+j)%2 == (odd ? 1 : 0) ? 1 : 0).sum0().sum();
    return all - rocks.values().filter(r => (r[0]+r[1])%2 == (odd ? 1 : 0)).length;
}
//get all the fields in the middle diamond of the garden (odd or even compared to the start)
var diamond = (odd:boolean) : number => calculate(half, odd);
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
const size = garden.length;
const half = Math.floor(size/2);
// garden.stringc(x => x === "#", 'r', '','\n', 15).printc(x => x === "S", "c");
const rocks = new h.DoubleSet<number>(garden.getCoors(x => x === "#")! as Coor[]);
const start = garden.getCoor(x => x === "S")! as Coor;

h.print("part 1:", calculate(64, undefined, false));

// part 2
h.print("(", 26501365, " - 65) % 131:", (26501365-65)%131);
h.print(26501365, "/131 :",26501365/131 );
var m = Math.floor(26501365/131);
// var brute = calculate(m*size + half, undefined, false) ;
h.print("part 2:", calculateSmart(m));