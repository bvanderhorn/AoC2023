import * as h from '../helpers';
type Coor = [number, number, number];
class Brick {
    public supportedBy: Brick[] = [];
    constructor(public value: [Coor, Coor]) {

    }
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
    
}

var bricks : Brick[] = h.read("22", "bricks.txt", "ex").split("~").mape(x => new Brick(x.split(",").tonum()));
bricks.sort((a,b) => a.zmin - b.zmin);
h.print(bricks.slice(0,3));

// drop the bricks
var droppedBricks: Brick[] = [];
for (const b of bricks){
    for (var i = 0; i < b.zmin; i++) {
        var testBrick : Brick = b.drop(i);
        var newBrick : Brick = b.drop(i-1);
        if (droppedBricks.some(db => db.overlaps(testBrick))) {
            droppedBricks.push(newBrick);
            break;
        } else if (i == b.zmin-1) droppedBricks.push(testBrick);
    }
}