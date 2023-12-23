import * as h from '../helpers';

type xy = [number, number];

class PartNumber {
    constructor(
        public part: number,
        public coor: xy
    ) {}
    
    public len() : number {
        return this.part.toString().length;
    }

    public get neighbors() : xy[] {
        var nb : xy[] = [];
        var [x, y] = this.coor;
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= this.len(); j++) {
                var [k, l] = [x + i, y + j];
                if (k >= 0 && k< engine.length && l >= 0 && l < engine[0].length)
                    nb.push([x + i, y + j]);
            }
        }
        return nb;
    }

    public get isPartNumber() : boolean {
        return this.neighbors.map(xy => engine[xy[0]][xy[1]] ).matches(/^[^0-9.]$/).includes(true);
    }

    public to_string() : string {
        return `{part: ${this.part}, coor: ${this.coor}, isPartNumber: ${this.isPartNumber}}`;
    }
}

var getPartNumbersFromLine2 = (line: string, x: number) : PartNumber[] => h.findAllOccurrencesOf(/[0-9]+/g, line).map(re => new PartNumber(+(re[0]), [x, re.index]));

var engineLines = h.read("3", "engine.txt");
var engine = engineLines.split('');

// extract numbers
var numbers: PartNumber[] = [];
engineLines.map((line, x) => numbers.push(...getPartNumbersFromLine2(line, x)));
// h.print(numbers.slice(0,15).map(x => x.to_string()).join('\n'));
var parts = numbers.filter(n => n.isPartNumber);
h.print("part 1:", parts.map(x => x.part).sum());

// part 2
class Star {
    constructor(
        public coor: xy
    ) {}

    public get partNumbers() : PartNumber[] {
        return parts.filter(p => p.neighbors.includes2(this.coor));
    }

    public toString() : string {
        return `{coor: ${this.coor}, partNumbers: ${this.partNumbers.length}}`;
    }
}

var getStarsFromLine = (line: string, x: number) : Star[] => h.findAllIndicesOf(/\*/g, line).map(y => new Star([x, y]))

var stars: Star[] = [];
engineLines.map((line, x) => stars.push(...getStarsFromLine(line, x)));
// h.print(stars.slice(0,5).map(x => x.toString()).join('\n'));
h.print('part 2:', stars.map(s => s.partNumbers.map(pn => pn.part)).filter(p => p.length == 2).map(p => p.prod()).sum());