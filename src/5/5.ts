import * as h from '../helpers';

class AMap {
    public map: [number, number ,number][];
    public from: string;
    public to: string;

    constructor(input: string[]) {
        var from_to = input[0].match(/^(\w+)-to-(\w+)\s/)!;
        this.from = from_to[1];
        this.to = from_to[2];
        this.map = input.slice(1).split(' ').tonum();
    }

    public convert(amount:number) : number {
        for (const [tostart, fromstart, length] of this.map) {
            if (amount >= fromstart && amount < (fromstart + length)) {
                var delta = amount - fromstart;
                return tostart + delta;
            }
        }
        return amount;
    }
}

var almanac = h.read("5", "almanac.txt");
var seeds: number[] = almanac[0][0].split(' ').slice(1).tonum();
var maps = almanac.slice(1).map(x => new AMap(x));

h.print(seeds);
h.print(maps[0]);

var type = 'seed';
while (type != 'location') {
    var map = maps.find(m => m.from == type)!;
    seeds = seeds.map(s => map.convert(s));
    type = map.to;
}

h.print("part 1:", seeds.min());