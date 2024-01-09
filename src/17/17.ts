import * as h from '../helpers';

var bmap = h.read("17", "map.txt", "ex").split('').tonum();

bmap.printc(x => x == 3, 'c');