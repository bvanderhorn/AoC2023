import * as h from '../helpers';

var findMirrorLinesVertical = (mirror: string[][]) : number[] => {
    // returns the all lines for which the TOP is a mirror
    var mls : number[] = [];
    var m = mirror.map(x => x.join(''));
    for (var i = 1; i < m.length; i++) {
        var minLength = Math.min(i, m.length-i);
        var topHalf = m.slice(0, i).reverse().slice(0, minLength);
        var bottomHalf = m.slice(i).slice(0, minLength);
        if (h.equals2(topHalf, bottomHalf)) mls.push(i);
    }
    return mls;
}

var findMirrorLines = (mirror: string[][]) : [number, number][] => {
    // return all mirror lines in format [dim, index]
    var mls: [number, number][] = findMirrorLinesVertical(mirror).map(v => [0, v]);
    mls.push(...findMirrorLinesVertical(mirror.rotate(1)).map(h => [1, h] as [number, number]));
    return mls;
}

var getValue = (mirrorLine: [number, number]) : number => mirrorLine[0] == 0 ? mirrorLine[1]*100 : mirrorLine[1];

var findSmudge = (mirror: string[][]) : [[number, number], [number, number]] | undefined => {
    // returns [smudge coor , new mirror line]
    var ml = findMirrorLines(mirror)![0];
    for (var i = 0; i < mirror.length; i++) {
        for (var j = 0; j < mirror[0].length; j++) {
            var c = mirror.copy();
            c[i][j] = c[i][j] == '#' ? '.' : '#';
            var ml2 = findMirrorLines(c);
            if (ml2.length >0) {
                for (const mli of ml2) if (!h.equals2(ml, mli)) return [[i,j], mli];
            }
        }
    }
    return undefined;           
}

var mirrors = h.read("13", "mirrors.txt").split('');

var mirrorLines = mirrors.map(m => findMirrorLines(m)![0]);
// h.print(mirrorLines);
h.print("part 1:", mirrorLines.map(getValue).sum());

var smudges = mirrors.map(m => findSmudge(m));
// h.print(smudges);
h.print("part 2:", smudges.map(s => getValue(s![1])).sum());