import * as h from '../helpers';

var findNext = (history: number[]) : number => {
    var add = history.last();
    var diffs = history.copy();
    while (true) {
        diffs = h.range(0, diffs.length-1).map(i => diffs[i+1] - diffs[i]);
        if (diffs.filter(x => x!=0).length == 0)
            return add;
        add += diffs.last();
    }
}

var histories = h.read("9", "histories.txt").split(' ').tonum();
h.print("part 1:", histories.map(x => findNext(x)).sum());