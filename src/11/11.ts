import * as h from '../helpers';

var universe = h.read("11", "universe.txt","ex").slice2(0,-1).split('');
h.print(universe.dims());
universe.print();
var galaxies = universe.getCoors(x => x=="#");
h.print(galaxies);


