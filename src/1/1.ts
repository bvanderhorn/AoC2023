import * as h from '../helpers';

var strnums = new Map<string, string>(
    [
        ["one", "1"],
        ["two", "2"],
        ["three", "3"],
        ["four", "4"],
        ["five", "5"],
        ["six", "6"],
        ["seven", "7"],
        ["eight", "8"],
        ["nine", "9"]
    ]
);

var getNum = (input: string) : string | undefined => {
    var num = input.replace(/[^0-9]/g,"");
    return (num.length > 0) ? num[0] : undefined;
}
var getReplaceNum = (input: string) : string | undefined => {
    var z = input;
    strnums.forEach((v,k) => z = z.replace(k,v));
    return getNum(z);
}

var getFirstNum = (input: string) : string | undefined => {
    var z = "";
    for (const c of input.split('')) {
        z += c;
        var num = getReplaceNum(z);
        if (num !== undefined) {
            return num;
        }
    };
    return undefined;
}

var getLastNum = (input: string) : string | undefined => {
    var z = "";
    for (const c of input.split('').reverse()) {
        z = c + z;
        var num = getReplaceNum(z);
        if (num !== undefined) {
            return num;
        }
    };
    return undefined;
}

var getFirstLastInt = (input: string) : number => {
    var first = getFirstNum(input);
    var last = getLastNum(input);
    return (first !== undefined && last !== undefined) ? +(first + last) : 0;
}

var calibration = h.read("1", "calibration.txt");
h.print("part 1:", calibration.map( x => x.replace(/[^0-9]/g,"")).map( x=> x[0] + x.get(-1)).tonum().sum());
h.print("part 2:", calibration.map(getFirstLastInt).sum());