import * as h from '../helpers';

var toId = (location: number[]) : number => location[0]*garden[0].length + location[1];
var fromId = (id: number) : number[] => [Math.floor(id/garden[0].length), id%garden[0].length];
var getLocalNb = (loc: number[]) : number[][] => [[loc[0]-1, loc[1]], [loc[0]+1, loc[1]], [loc[0], loc[1]-1], [loc[0], loc[1]+1]];
var isRock = (loc: number[]) : boolean => rocks.has(toId([loc[0]%garden.length, loc[1]%garden[0].length]));
var getnb = (loc: number[]) : number[][] => getLocalNb(loc).filter(x => !isRock(x));

const garden = h.read("21", "garden.txt").split('');
garden.stringc(x => x === "#", 'r', '','\n', 20).printc(x => x === "S", "c");
const rocks = garden.getCoors(x => x === "#")!.map(toId).toSet();
const start = garden.getCoor(x => x === "S")!;
