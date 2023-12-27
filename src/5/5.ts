import * as h from '../helpers';

class MapRange {
    public from: number;
    public to: number;
    public add: number;
    constructor(rangeString: string) {
        var [tostart, from, length] = rangeString.split(' ').tonum();
        [this.from, this.to, this.add] = [from, from + length - 1, tostart - from];
    }
}

class AMap {
    public map: MapRange[];
    public from: string;
    public to: string;

    constructor(input: string[]) {
        var from_to = input[0].match(/^(\w+)-to-(\w+)\s/)!;
        this.from = from_to[1];
        this.to = from_to[2];
        this.map = input.slice(1).map(x => new MapRange(x));
    }

    public convert(amount:number) : number {
        for (const r of this.map) {
            if (amount >= r.from && amount <= r.to) 
                return amount + r.add;
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