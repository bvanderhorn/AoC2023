import * as h from '../helpers';
class Spring  {
	public mask: string[];
	public struct: number[]
	public minLength: number;

	constructor(springString: string) {
		var [maskString, structString] = springString.split(" ");
		[this.mask, this.struct]  = [maskString.split(''), structString.split(',').tonum()];
		this.minLength = this.struct.sum() + this.struct.length -1;
	}
}

var getSolutions = (mask: string[], struct: number[]) : number => {
	var minLength = struct.sum() + struct.length -1;
	if (mask.length < minLength) return 0;
	var struct0 = struct[0];
	var solutions = 0;
	for (const i of h.range(0, mask.length - minLength + 1)) {
		var premask0 = mask.slice(0, i);
		var mask0 = mask.slice(i, i + struct0);
		if (premask0.some(x => x == '#')) return solutions;
		if (!mask0.some(x => x == '.')) continue;
		if (struct.length > 1 && mask[i+struct0] == '#') continue;
		if (struct.length == 1) {
			if (mask0.slice(i+struct0).some(x => x == '#')) continue;
			solutions++;
			continue;
		}
		solutions += getSolutions(mask.slice(i+struct0+1), struct.slice(1));
	}
	return solutions;
}

var springs: Spring[] = h.read("12", "springs.txt").map(s => new Spring(s));

h.print(springs.slice(0,2));
h.print("part 1:", springs.map(s => getSolutions(s.mask, s.struct)).sum());