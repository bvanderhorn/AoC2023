import * as h from '../helpers';

class Node {
    public name: string;
    public left: string;
    public right: string;

    constructor(input:string) {
        [this.name, this.left, this.right] = input.match(/^(\w+)\s+=\s+\((\w+)\,\s+(\w+)\)$/)!.slice(1);
    }
}

var [instructions, rawNodes] = h.read("8", "maps.txt", "ex");
var nodes = rawNodes.map((x:string) => new Node(x)).map((x:Node) => [x.name, x]).todict();

h.print(nodes);