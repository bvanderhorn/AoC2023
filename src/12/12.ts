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

var getSolutions = (mask: string[], struct: number[], known:Map<string,number> = new Map<string,number>(), verbose: boolean = false, depth:number = 0) : number => {
	var str = mask.join('') + ' ' + struct.toString();
	var existing = known.get(str);
	if (existing != undefined) return existing;

	var init = " ".repeat(depth);
	h.printVerbose(verbose, init, "solve:", mask.join(""), struct);
	var minLength = struct.sum() + struct.length -1;
	if (mask.length < minLength) return 0;
	var struct0 = struct[0];
	var solutions = 0;
	for (const i of h.range(0, mask.length - minLength + 1)) {
		h.printVerbose(verbose, init, "i:", i);
		var premask0 = mask.slice(0, i);
		var mask0 = mask.slice(i, i + struct0);
		h.printVerbose(verbose, init, "m:",mask0.join("")); 
		if (premask0.some(x => x == '#')) return solutions;
		if (mask0.some(x => x == '.')) continue;
		if (struct.length > 1 && mask[i+struct0] == '#') continue;
		if (struct.length == 1) {
			if (mask.slice(i+struct0).some(x => x == '#')) continue;
			h.printVerbose(verbose, init, "> valid!");
			solutions++;
			continue;
		}
		solutions += getSolutions(mask.slice(i+struct0+1), struct.slice(1), known, verbose, depth+1);
	}
	known.set(str, solutions);
	h.printVerbose(verbose, init, "=>", solutions);
	return solutions;
}

var springs: Spring[] = h.read("12", "springs.txt").filter(x => x.length > 0).map(s => new Spring(s));

// h.print(springs.slice(0,2));
//h.print(getSolutions(springs.last().mask, springs.last().struct, true));
h.print("part 1:", springs.map(s => getSolutions(s.mask, s.struct)).sum());

var springs2 = springs.map(s => new Spring(h.ea(5,s.mask.join('')).join('?') + ' ' + h.ea(5,s.struct).flat().toString()));
h.print(springs2[0]);

console.time("test");
h.print(getSolutions(springs2[2].mask, springs2[2].struct));
console.timeEnd("test");

//console.exit();

var amounts : number[] = [];
var p = new h.ProgressBar(springs2.length, springs2.length);
for (var i = 0; i<springs2.length; i++) {
	var s = springs2[i];
	//var a = getSolutions(s.mask, s.struct);
	//amounts.push(a);
	//p.show(i);
	//h.print(i+2, '/', springs2.length, '...');
}
//h.print("part 2:", amounts.sum());
