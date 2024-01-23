import * as h from '../helpers';
type Coor = [number, number];
var toId = (location: Coor) : number => location[0]*garden[0].length + location[1];
var fromId = (id: number) : Coor => [Math.floor(id/garden[0].length), id%garden[0].length];
var getLocalNb = (location: number) : number[] => {
    var loc = fromId(location);
    return ([[loc[0]-1, loc[1]], [loc[0]+1, loc[1]], [loc[0], loc[1]-1], [loc[0], loc[1]+1]] as Coor[])
        .filter(x => x[0] >= 0 && x[0] < garden.length && x[1] >= 0 && x[1] < garden[0].length).map(toId);
}
var getnb = (location: number) : number[] => getLocalNb(location).filter(id => !rocks.has(id));

const garden = h.read("21", "garden.txt").split('');

garden.stringc(x => x === "#", 'r', '','\n', 20).printc(x => x === "S", "c");
const rocks = (garden.getCoors(x => x === "#")! as Coor[]).map(toId).toSet();
const start = toId(garden.getCoor(x => x === "S")! as Coor);

// part 1
const locations1 : Set<number> = [start].toSet();
const locations2 = new Set<number>();
var [locations, newLocations] = [locations1, locations2];
console.time("part 1");
for (const i of h.range(0,64)) {
    [locations, newLocations] = i%2 == 0 ? [locations1, locations2] : [locations2, locations1];
    newLocations.clear();
    locations.forEach(location => getnb(location).forEach(x => newLocations.add(x)));
}
console.timeEnd("part 1");
h.print("part 1:", locations.size);