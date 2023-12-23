import * as h from '../helpers';

class Card {
    public id: number;
    public winning: number[];
    public actual: number[];
    constructor(cardString: string) {
        var matches = cardString.match(/^Card\s+([0-9]+):([\s0-9]+)\|(.*)$/)!.slice(1);
        this.id = +matches[0];
        this.winning = matches[1].trim().split(/\s+/).map(x => +x); 
        this.actual = matches[2].trim().split(/\s+/).map(x => +x);
    }
}

var cards = h.read("4", "cards.txt").map(x => new Card(x));
h.print(cards[0]);
h.print('part 1:', cards.map(c => c.winning.intersect(c.actual).length).map(x => x == 0 ? 0 : 2**(x-1)).sum());