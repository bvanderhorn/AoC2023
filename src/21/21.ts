import * as h from '../helpers';
type Coor = [number, number];
var toId = (location: Coor) : number => location[0]*garden[0].length + location[1];
var fromId = (id: number) : Coor => [Math.floor(id/garden[0].length), id%garden[0].length];
var getLocalNb = (location: number) : number[] => {
    const nbs : number[] = [];
    if (location % garden[0].length > 0) nbs.push(location-1);
    if (location % garden[0].length < garden[0].length-1) nbs.push(location+1);
    nbs.push(location-garden[0].length);
    nbs.push(location+garden[0].length);

    return nbs.filter(x => x >= 0 && x < garden.length*garden[0].length);
}
var getnb = (location: number) : number[] => getLocalNb(location).filter(id => !rocks.includes(id));

const garden = h.read("21", "garden.txt").split('');

garden.stringc(x => x === "#", 'r', '','\n', 20).printc(x => x === "S", "c");
const rocks = garden.getCoors(x => x === "#")!.map(x => toId(x as Coor));
const start = toId(garden.getCoor(x => x === "S")! as Coor);

// part 1
var locations : Set<number> = [start].toSet();
console.time("part 1");
for (const _ of h.range(0,64)) {
    var newLocations = new Set<number>();
    locations.forEach(location => getnb(location).forEach(x => newLocations.add(x)));
    locations = newLocations;
}
console.timeEnd("part 1");
h.print("part 1:", locations.size);