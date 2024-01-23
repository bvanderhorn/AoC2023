import * as h from '../helpers';
type Coor = [number, number];
var toId = (location: Coor) : number => location[0]*garden[0].length + location[1];
var fromId = (id: number) : Coor => [Math.floor(id/garden[0].length), id%garden[0].length];
var getnb = (location: number) : number[] => h.getnb(fromId(location), garden.length, garden[0].length)
    .map(x => toId(x as Coor))
    .filter(id => !rocks.includes(id));

const garden = h.read("21", "garden.txt").split('');

garden.stringc(x => x === "#", 'r', '','\n', 30).printc(x => x === "S", "c");
const rocks = garden.getCoors(x => x === "#")!.map(x => toId(x as Coor));
const start = toId(garden.getCoor(x => x === "S")! as Coor);

var locations : Set<number> = [start].toSet();
for (const _ of h.range(0,64)) {
    var newLocations = new Set<number>();
    locations.forEach(location => getnb(location).forEach(x => newLocations.add(x)));
    locations = newLocations;
}
h.print("part 1:", locations.size);