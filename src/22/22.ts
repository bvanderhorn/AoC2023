import * as h from '../helpers';
type Coor = [number, number, number];
type Brick = [Coor, Coor];
var zmin = (b: Brick) : number => Math.min(b[0][2], b[1][2]);

var bricks = h.read("22", "bricks.txt").split("~").mape(x => x.split(",").tonum());
bricks.sort((a,b) => zmin(a) - zmin(b));
h.print(bricks.slice(0,3));