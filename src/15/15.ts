import * as h from '../helpers';

var hash = (input: string): number => input.map(x => x.charCodeAt(0)).reduce((a,b) => a*17%256 + b)* 17%256;
type Lens = [string, number];
var apply = (instruction: string) : void => {
    var label = instruction.match(/^\w+/)![0];
    var box = hash(label);
    if (boxes[box] == undefined) boxes[box] = [];
    var index = boxes[box].findIndex(x => x[0] == label);
    if (instruction.endsWith('-')) if (index != -1) boxes[box].splice(index, 1);
    if (instruction.includes('=')) {
        var value = +(instruction.match(/\d+$/)![0]);
        if (index == -1) boxes[box].push([label, value]);
        else boxes[box][index][1] = value;
    }
}
var focusingPower = (box: Lens[]) : number => box.map((x,i) => x[1]*(i+1)).sum();

var sequence = h.read("15", "sequence.txt").split(',')[0];
h.print("part 1:", sequence.map(hash).sum());

var boxes: Lens[][] = h.ea(256, undefined);
sequence.map(apply);
// h.print(boxes.map((b,i) => [i, b]).filter(x => x[1]!= undefined).filter(x=>(x[1] as Lens[]).length>0).todict());
h.print("part 2:", boxes.map((b,i) => b == undefined ? 0 : focusingPower(b)*(i+1)).sum());