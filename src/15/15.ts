import * as h from '../helpers';

var hash = (input: string): number => input.map(x => x.charCodeAt(0)).reduce((a,b) => a*17%256 + b)* 17%256;
var sequence = h.read("15", "sequence.txt").split(',')[0];
h.print("part 1:", sequence.map(hash).sum());