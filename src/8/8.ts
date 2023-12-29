import * as h from '../helpers';

class Node {
    public name: string;
    public left: string;
    public right: string;

    constructor(input:string) {
        [this.name, this.left, this.right] = input.match(/^(\w+)\s+=\s+\((\w+)\,\s+(\w+)\)$/)!.slice(1);
    }
}

var applyStep = (current: Node, instruction:string) : Node => nodes.get(instruction[0] == "L" ? current.left : current.right)!;

var [instructions, rawNodes] = h.read("8", "maps.txt");
var nodes = rawNodes.map((x:string) => new Node(x)).map((x:Node) => [x.name, x]).todict();
instructions = instructions[0];

var start = "AAA";
var end = "ZZZ";

var current = nodes.get(start);
var steps = 0;
while (current.name != end) {
    var instruction = instructions.get(steps);
    // h.print(current.name,'-', instruction,'=>',applyStep(current, instruction).name);
    current = applyStep(current, instructions.get(steps));
    steps++;
}
h.print("part 1:", steps);