import * as h from '../helpers';

class Cycle  {
    public pureStart: number;
    public pureLength: number;
    constructor(
        public initLength: number,
        public zIndicesInit: number[],
        public loopLength: number,
        public zIndicesLoop: number[]
    ) {
        this.pureStart = initLength*instructions.length + zIndicesLoop[0];
        this.pureLength = loopLength*instructions.length;
    }
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
        var zIndices: number[][] = [];
        var starts: string[] = [this.name];
        while (true) {
            var current = starts.last();
            var result = applySteps(nodes.get(current)!, instructions);
            zIndices.push(result.zIndices.plus(length));

            if (starts.includes(result.node.name)) {
                // we're in a loop!
                var loopLength = starts.reverse().indexOf(result.node.name) + 1;
                var initLength = starts.reverse().indexOf(result.node.name);
                var zIndicesInit = zIndices.slice(0,initLength).flat();
                var zIndicesLoop = zIndices.slice(initLength).flat().plus(initLength*instructions.length*(-1));
                return new Cycle(initLength, zIndicesInit, loopLength, zIndicesLoop);
            }
            
            length += instructions.length;
            starts.push(result.node.name);
        }
    }
}

var applyStep = (current: Node, instruction:string) : Node => nodes.get(instruction[0] == "L" ? current.left : current.right)!;
var applySteps = (current: Node, instructions:string) : {node: Node, zIndices: number[]} => {
    var zIndices: number[] = [];
    for (var i=0; i<instructions.length; i++) {
        current = applyStep(current, instructions[i]);
        if (current.name.endsWith("Z"))
            zIndices.push(i+1);
    }
    return {node: current, zIndices: zIndices};
}

var [rawInstructions, rawNodes] : string[][] = h.read("8", "maps.txt");
var nodeList : Node[] = rawNodes.map(x => new Node(x));
var nodes = nodeList.map(x => [x.name, x]).todict();
var instructions = rawInstructions[0];

var start = "AAA";
var end = "ZZZ";

// part 1
var current = nodes.get(start);
var steps = 0;
while (current.name != end) {
    current = applyStep(current, instructions.get(steps));
    steps++;
}
h.print("part 1:", steps);

// part 2
var currents = nodeList.filter(x => x.name.endsWith("A"));

// raw approach: just step and compare
// var steps = 0;
// while (currents.filter(x => !x.name.endsWith("Z")).length > 0) {
//     currents = currents.map(x => applyStep(x, instructions.get(steps)));
//     steps++;
// }

// elegant approach: calculate cycles for each starting point
h.print('instructions length:', instructions.length);
h.print(currents.map(x => [x.name, x.cycle]).todict());
// crucial insights:
// 1. each cycle has an initial phase of exactly 1 instruction set, until it starts looping
// 2. each cycle contains does not come accross Z values in the initial phase
// 3. each cycle contains exactly 1 Z index in the loop
// >> This means a 'pureStart' and 'pureLength' can be calculated for each cycle:
//   - pureStart = initLength*instructions.length + zIndicesLoop[0]
//   - pureLength = loopLength*instructions.length
// 4. It turns out that the pureStart and pureLength are the same for each cycle!
// 5. this means we can do a simple calculation to find the first mutual occurrence

h.print("part 2:", h.smallestCommonMultiple(currents.map(x => x.cycle.pureLength)));