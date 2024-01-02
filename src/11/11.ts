import * as h from '../helpers';

var universe = h.read("11", "universe.txt").slice2(0,-1).split('');
var galaxies = universe.getCoors(x => x=="#")!;
var [xen, yen] = [0,1].map(i => galaxies.map(g => g[i]).unique());
var pairs = galaxies.slice(1).flatMap((g,i) => galaxies.slice(0,i+1).map(g2 => [g, g2]));
var distances = pairs.map(p => p[0].manhattan(p[1]).sum());

var addEmptySpace = (pair: number[][], factor:number): number => {
	var [xs, ys] = [[pair[0][0], pair[1][0]], [pair[0][1], pair[1][1]]];
	var [dx, dy] = [Math.max(xs.max() - xs.min() - 1,0), Math.max(ys.max() - ys.min() - 1,0)];
	var emptySpace = factor*(dx - xen.filter(x => x>xs.min() && x<xs.max()).length);
	emptySpace += factor*(dy - yen.filter(y => y>ys.min() && y<ys.max()).length);
        return emptySpace;
};

var emptySpace1 = pairs.map(p => addEmptySpace(p,1)).sum();
h.print("part 1:", distances.sum() + emptySpace1);

var emptySpace2 = pairs.map(p => addEmptySpace(p,999999)).sum();
h.print("part 3:", distances.sum() + emptySpace2);
