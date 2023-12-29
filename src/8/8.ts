import * as h from '../helpers';

type Cycle = {
    length: number,
    zIndices: number[]
}

class Node {
    public name: string;
    public left: string;
    public right: string;

    constructor(input:string) {
        [this.name, this.left, this.right] = input.match(/^(\w+)\s+=\s+\((\w+)\,\s+(\w+)\)$/)!.slice(1);
    }

    public get cycle() : Cycle {
        var length = 0;
        var zIndices: number[] = [];
        var current = nodes.get(this.name);
        while (true) {
            var result = applySteps(current, instructions);
            current = result.node;
            zIndices.push(...result.zIndices.plus(length));
            length += instructions.length;
            if (current.name == this.name)
                return {length, zIndices};
        }
    }
}

var applyStep = (current: Node, instruction:string) : Node => nodes.get(instruction[0] == "L" ? current.left : current.right)!;
var applySteps = (current: Node, instructions:string) : {node: Node, zIndices: number[]} => {
    var zIndices: number[] = [];
    for (var i=0; i<instructions.length; i++) {
        current = applyStep(current, instructions[i]);
        if (current.name.endsWith("Z"))
            zIndices.push(i);
    }
    return {node: current, zIndices: zIndices};
}

var [rawInstructions, rawNodes] : string[][] = h.read("8", "maps.txt", "ex");
var nodeList : Node[] = rawNodes.map(x => new Node(x));
var nodes = nodeList.map(x => [x.name, x]).todict();
var instructions = rawInstructions[0];

var start = "AAA";
var end = "ZZZ";

// part 1
var current = nodes.get(start);
var steps = 0;
// while (current.name != end) {
//     current = applyStep(current, instructions.get(steps));
//     steps++;
// }
h.print("part 1:", steps);

// part 2
var currents = nodeList.filter(x => x.name.endsWith("A"));
h.print(currents);
h.print(currents.map(x => x.cycle));
var steps = 0;
// while (currents.filter(x => !x.name.endsWith("Z")).length > 0) {
//     currents = currents.map(x => applyStep(x, instructions.get(steps)));
//     steps++;
// }
h.print("part 2:", steps);