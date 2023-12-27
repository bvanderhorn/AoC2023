import * as h from '../helpers';
var getHighest = (hand1: string, hand2: string, withJokers: boolean = false): string => {
    var values = [hand1, hand2].map(h => getValue(h, withJokers));
    if (values[0] != values[1])
        return values[0] > values[1] ? hand1 : hand2;

    var cardValues = withJokers ? "J23456789TQKA" : "23456789TJQKA";


    var [cards1, cards2] = [hand1, hand2].split('');
    for (var i = 0; i < cards1.length; i++) {
        var [value1, value2] = [cards1[i], cards2[i]].map(c => cardValues.indexOf(c));
        if (value1 != value2)
            return value1 > value2 ? hand1 : hand2;
    }
    throw `equal hands: ${hand1} ${hand2}`;
}

var getValue = (hand:string, withJokers: boolean = false): number => {
    var cards = hand.split('');
    if (withJokers)
        cards = cards.filter(c => c != 'J');
    var nofJokers = hand.length - cards.length;

    var groups = cards.unique().map(c => cards.count(c)).sort((a,b) => b-a);
    groups[0] += nofJokers;
    var types = [[5], [4,1], [3,2], [3,1,1], [2,2,1], [2,1,1,1], [1,1,1,1,1]];
    var values = [5, 4, 3.5, 3, 2, 1, 0];
    return values[types.findIndex(t => h.equals2(t, groups))];
}

var hands : [string, number][] = h.read("7", "hands.txt").split(" ").map(x => [x[0], +x[1]]);
h.print(hands.slice(0,3));

// part 1
hands.sort((a,b) => getHighest(a[0],b[0]) == a[0] ? -1 : 1);
h.print("part 1:", hands.map((h,i) => h[1] * (hands.length - i)).sum());

// part 2
hands.sort((a,b) => getHighest(a[0],b[0], true) == a[0] ? -1 : 1);
h.print("part 2:", hands.map((h,i) => h[1] * (hands.length - i)).sum());