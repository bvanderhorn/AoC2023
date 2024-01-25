import * as h from '../helpers';
type Coor = [number, number, number];
class Brick {
    public supportedBy: Brick[] = [];
    public supports: Brick[] = [];
    public exclusivelySupports: Brick[] = [];
    constructor(public value: [Coor, Coor]) {}
    public get zmin() : number {
        return Math.min(this.value[0][2], this.value[1][2]);
    }
    public overlaps(b: Brick) : boolean {
        return h.overlaps([this.value[0][0],this.value[1][0]], [b.value[0][0],b.value[1][0]]) 
            && h.overlaps([this.value[0][1],this.value[1][1]], [b.value[0][1],b.value[1][1]]) 
            && h.overlaps([this.value[0][2],this.value[1][2]], [b.value[0][2],b.value[1][2]]);
    }
    public drop(dz:number) : Brick {
        return new Brick(this.value.map(c => c.plusEach([0,0,-dz])) as [Coor, Coor]);
    }
    public get exclusivelySupportsTotal() : number {
        var visited : Brick[] = [];
        var remaining : Brick[] = [this];
        while (remaining.length > 0) {
            var b = remaining.shift()!;
            visited.push(b);
            for (const s of b.supports)
                if (!remaining.includes(s) && (s.supportedBy.every(s2 => visited.includes(s2) || remaining.includes(s2)))) 
                    remaining.push(s);
        }
        return visited.length-1;
    } 
}

var bricks : Brick[] = h.read("22", "bricks.txt").split("~").mape(x => x.split(",").tonum()).map(x => new Brick(x));
bricks.sort((a,b) => a.zmin - b.zmin);
// h.printobj(bricks.slice(0,3));

// drop the bricks
console.time("dropping");
var droppedBricks: Brick[] = [];
for (const b of bricks){
    for (var i = 0; i < b.zmin; i++) {
        var testBrick : Brick = b.drop(i);
        var newBrick : Brick = b.drop(i-1);
        var support: number[] = droppedBricks.map((db,i) => db.overlaps(testBrick) ? i : -1).filter(x => x != -1);
        if (support.length > 0) {
            newBrick.supportedBy = support.map(i => droppedBricks[i]);
            support.forEach(i => droppedBricks[i].supports.push(newBrick));
            droppedBricks.push(newBrick);
            break;
        } else if (i == b.zmin-1) droppedBricks.push(testBrick);
    }
}
console.timeEnd("dropping");
// determine exclusively supported bricks
droppedBricks.forEach(b => b.supports.filter(s => s.supportedBy.length == 1).forEach(s => b.exclusivelySupports.push(s)));
//h.printobj(droppedBricks[0],4);

// all bricks that do not exclusively support other bricks, can be removed
h.print("part 1:", droppedBricks.filter(b => b.exclusivelySupports.length == 0).length);
h.print("part 2:", droppedBricks.map(b => b.exclusivelySupportsTotal).sum());