import * as h from '../helpers';

var getDiffs = (input: number[]) : number[] => h.range(0, input.length-1).map(i => input[i+1] - input[i]);

var findNext = (history: number[]) : number => {
    var [diffs, add] = [history.copy(), 0];
    while (true) {
        add += diffs.last();
        diffs = getDiffs(diffs);
        if (diffs.filter(x => x!=0).length == 0)
            return add;
    }
}

var findPrev = (history: number[]) : number => {
    var [diffs, add, iterator] = [history.copy(), 0, 1];
    while(true) {
        add += iterator*diffs[0];
        iterator *= -1;
        diffs = getDiffs(diffs);
        if (diffs.filter(x => x!=0).length == 0)
            return add;
    }
}

var histories = h.read("9", "histories.txt").split(' ').tonum();
h.print("part 1:", histories.map(findNext).sum());
h.print("part 2:", histories.map(findPrev).sum());