import * as h from '../helpers';

class MapRange {
    public start: number;
    public end : number;
    public add: number;
    constructor(rangeString: string) {
        var [tostart, start, length] = rangeString.split(' ').tonum();
        [this.start, this.end, this.add] = [start, start + length - 1, tostart - start];
    }

    public get range() : [number, number] {
        return [this.start, this.end];
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
            if (h.isInInterval(r.range, amount)) 
                return amount + r.add;
        }
        return amount;
    }

    public convertRange(range: [number, number]) : [number, number][] {
        var [start, end] = range;
        var converted: [number, number][] = [];
        for (const r of this.map) {
            if (!h.overlaps(r.range, range))
                continue;

            if (r.start <= start){
                if (r.end >= end) {
                    converted.push([start + r.add, end + r.add]);
                    return converted;
                }
                else {
                    converted.push([start + r.add, r.end + r.add]);
                    start = r.end + 1;
                }
            }

            else { // if start < rstart < end
                if (r.end >= end) {
                    converted.push([r.start + r.add, end + r.add]);
                    end = r.start - 1;
                }
                else { // if start < rstart < rend < end
                    converted.push([r.start + r.add, r.end + r.add]);
                    converted.push(...this.convertRange([r.end + 1, end]));
                    converted.push(...this.convertRange([start, r.start - 1]));
                    return converted;
                }
            }
        }
        converted.push([start, end]);
        return converted;
    }
}

var almanac = h.read("5", "almanac.txt", "ex");
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