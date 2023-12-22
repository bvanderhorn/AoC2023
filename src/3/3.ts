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

    public neighbors() : xy[] {
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
        return this.neighbors().map(xy => engine[xy[0]][xy[1]] ).matches(/^[^.0-9]$/).includes(true);
    }

    public to_string() : string {
        return `{part: ${this.part}, coor: ${this.coor}, isPartNumber: ${this.isPartNumber}}`;
    }
}

var getPartNumbersFromLine = (line: string, x: number) : PartNumber[] => {
    var partNumbers: PartNumber[] = [];
    var y = 0;
    var part = "";
    var yp = -1;
    for (const c of line.split('')) {
        if (c.match(/^[0-9]$/)) {
            if (part.length == 0) {
                yp = y;
            }
            part += c;
        } else {
            if (part.length > 0) {
                partNumbers.push(new PartNumber(+(part), [x, yp]));
                part = "";
            }
        }
        y++;
    }
    return partNumbers;
}

var engineLines = h.read("3", "engine.txt");
var engine = engineLines.split('');

// extract numbers
var numbers: PartNumber[] = [];
engineLines.map((line, x) => numbers.push(...getPartNumbersFromLine(line, x)));
h.print(numbers.slice(0,15).map(x => x.to_string()).join('\n'));
h.print("part 1:", numbers.filter(n => n.isPartNumber).map(x => x.part).sum());