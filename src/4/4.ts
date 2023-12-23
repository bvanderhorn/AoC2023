import * as h from '../helpers';

class Card {
    public id: number;
    public winning: number[];
    public actual: number[];
    public matching : number;
    constructor(cardString: string) {
        var matches = cardString.match(/^Card\s+([0-9]+):([\s0-9]+)\|(.*)$/)!;
        this.id = +matches[1];
        this.winning = matches[2].trim().split(/\s+/).tonum(); 
        this.actual = matches[3].trim().split(/\s+/).tonum();
        this.matching = this.winning.intersect(this.actual).length;
    }
}

var cards = h.read("4", "cards.txt").map(x => new Card(x));
h.print(cards[0]);
h.print('part 1:', cards.map(c => c.matching).map(x => x == 0 ? 0 : 2**(x-1)).sum());

// part 2
var copies = h.ea(cards.length, 1);
for (var i = 0; i < cards.length; i++) {
    var matching = cards[i].matching;
    for (var j = 0; j<matching; j++) {
        var k = i + j + 1;
        if (k >= copies.length)
            continue;
        copies[k] += copies[i];
    }
}
h.print("part 2:",copies.sum());