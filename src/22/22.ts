import * as h from '../helpers';
type Coor = [number, number, number];
type Brick = [Coor, Coor];
var zmin = (b: Brick) : number => Math.min(b[0][2], b[1][2]);
var overlaps = (b1: Brick, b2: Brick) : boolean => h.overlaps([b1[0][0],b1[1][0]], [b2[0][0],b2[1][0]]) 
                                                && h.overlaps([b1[0][1],b1[1][1]], [b2[0][1],b2[1][1]]) 
                                                && h.overlaps([b1[0][2],b1[1][2]], [b2[0][2],b2[1][2]]);

var bricks : Brick[] = h.read("22", "bricks.txt", "ex").split("~").mape(x => x.split(",").tonum());
bricks.sort((a,b) => zmin(a) - zmin(b));
h.print(bricks.slice(0,3));

// drop the bricks
var droppedBricks: Brick[] = [];
for (const b of bricks){
    for (var i = 0; i < zmin(b); i++) {
        var testBrick : Brick = b.map(c => c.plusEach([0,0,-i])) as Brick;
        var newBrick : Brick = b.map(c => c.plusEach([0,0,-i+1])) as Brick;
        if (droppedBricks.some(db => overlaps(db, testBrick))) {
            droppedBricks.push(newBrick);
            break;
        } else if (i == zmin(b)-1) droppedBricks.push(testBrick);
    }
}