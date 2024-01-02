import * as h from '../helpers';

var universe = h.read("11", "universe.txt").slice2(0,-1).split('');
// universe.print();
var galaxies = universe.getCoors(x => x=="#")!;
// h.print(galaxies);
var [xen, yen] = [0,1].map(i => galaxies.map(g => g[i]).unique());
// h.print([xen,yen]);

var pairs = galaxies.slice(1).flatMap((g,i) => galaxies.slice(0,i+1).map(g2 => [g, g2]));
// h.print(pairs);
var distances = pairs.map(p => p[0].manhattan(p[1]).sum());
// h.print("base dist:", distances);
pairs.map((p,i) => {
	var [xs, ys] = [[p[0][0], p[1][0]], [p[0][1], p[1][1]]];
	var [dx, dy] = [Math.max(xs.max() - xs.min() - 1,0), Math.max(ys.max() - ys.min() - 1,0)];
	distances[i] += dx - xen.filter(x => x>xs.min() && x<xs.max()).length;
	distances[i] += dy - yen.filter(y => y>ys.min() && y<ys.max()).length;
});

h.print("part 1:", distances.sum());
