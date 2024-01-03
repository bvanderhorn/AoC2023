import * as h from '../helpers';
class Mask {
	public trues: number[];
	public falses: number[];
	public length : number;
	constructor(maskString: string) {
		this.trues = h.findAllOccurrencesOf(/#/g, maskString).map(x => x.index);
		this.falses = h.findAllOccurrencesOf(/\./g, maskString).map(x => x.index);
		this.length = maskString.length;
	}
}
class Spring  {
	public mask: Mask;
	public struct: number[]
	constructor(springString: string) {
		var [maskString, structString] = springString.split(" ");
		this.mask = new Mask(maskString);
		this.struct = structString.split(',').tonum();
	}
}

var getSolutions = (spring: Spring) : boolean[][] => {
	var solutions: boolean[][] = [];
}

var springs: Spring[] = h.read("12", "springs.txt").map(s => new Spring(s));

h.print(springs.slice(0,2));