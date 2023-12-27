import * as h from '../helpers';

var hands = h.read("7", "hands.txt").split(" ").map(x => [x[0], +x[1]]);
h.print(hands.slice(0,3));