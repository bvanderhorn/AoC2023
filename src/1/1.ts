import * as h from '../helpers';

var getAnswer = (input: string[]) : number => input.map( x => x.replace(/[^0-9]/g,"")).map( x=> x[0] + x.get(-1)).tonum().sum();

var calibration = h.read("1", "calibration.txt");
h.print("part 1:", getAnswer(calibration));

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

var calibration2 = calibration.copy();
var values2 : string[] = calibration2.map( (x:string) => {
    var z: string = "";
    x.split('').forEach( (c:string) =>  {
        z += c;
        strnums.forEach((v,k) => z = z.replace(k,v));
    });
    return z;
});
h.print(values2);

h.print("part 2:", getAnswer(values2));
