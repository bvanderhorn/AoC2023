import * as h from '../helpers';

var findMirrorLineVertical = (mirror: string[][]) : number|undefined => {
    // returns the first line for which the TOP is a mirror
    var m = mirror.map(x => x.join(''));
    for (var i = 1; i < m.length; i++) {
        var minLength = Math.min(i, m.length-i);
        var topHalf = m.slice(0, i).reverse().slice(0, minLength);
        var bottomHalf = m.slice(i).slice(0, minLength);
        if (h.equals2(topHalf, bottomHalf)) return i;
    }
    return undefined;
}

var findMirrorLine = (mirror: string[][]) : [number, number] => {
    // return mirror line in format [dim, index]
    var vertical = findMirrorLineVertical(mirror);
    if (vertical != undefined) return [0, vertical];
    var horizontal = findMirrorLineVertical(mirror.rotate(1))!;
    return [1, horizontal];
}

var mirrors = h.read("13", "mirrors.txt",).split('');

var mirrorLines = mirrors.map(m => findMirrorLine(m));
// h.print(mirrorLines);
h.print("part 1:", mirrorLines.map(ml => ml[0] == 0 ? ml[1]*100 : ml[1]).sum());