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

var getSolutions = (mask: string[], struct: number[], v: boolean = false, depth:number = 0, known:Map<string,number> = new Map<string,number>()) : number => {
	var str = mask.join('') + ' ' + struct.toString();
	var init = " ".repeat(depth);
	var existing = known.get(str);
	if (existing != undefined) {
		h.printv(v,init, "known:", existing);
		return existing;
	}

	h.printv(v, init, "solve:", mask.join(""), struct);
	var minLength = struct.sum() + struct.length -1;
	if (mask.length < minLength) return 0;
	var struct0 = struct[0];
	var solutions = 0;

	if (mask.length<minLength) return 0;
	var mask0 = mask.slice(0, struct0);
	h.printv(v, init, "m:",mask0.join(""));

	var invm = mask0.some(x => x == '.');
	var invc = struct.length > 1 && mask[struct0] == '#';
	var invrest = struct.length == 1 && mask.slice(struct0).some(x => x == '#');

	if (!(invm || invc || invrest)) {
		if (struct.length == 1) {
			h.printv(v, init, "> valid!");
			solutions++;
		} else {
			solutions += getSolutions(mask.slice(struct0+1), struct.slice(1), v, depth+1, known);
		}
	}  
	if (mask[0] != '#')
		solutions += getSolutions(mask.slice(1), struct, v, depth+1, known);

	known.set(str, solutions);
	h.printv(v, init, "=>", solutions);
	return solutions;
}

var springs: Spring[] = h.read("12", "springs.txt").filter(x => x.length > 0).map(s => new Spring(s));

h.print("part 1:", springs.map(s => getSolutions(s.mask, s.struct)).sum());

var springs2 = springs.map(s => new Spring(h.ea(5,s.mask.join('')).join('?') + ' ' + h.ea(5,s.struct).flat().toString()));

console.time("test");
var t = springs2[2];
// h.print(t);
h.print(getSolutions(t.mask, t.struct));
console.timeEnd("test");

//console.exit();

var amounts : number[] = [];
var p = new h.ProgressBar(springs2.length, springs2.length);
for (var i = 0; i<springs2.length; i++) {
	var s = springs2[i];
	var a = getSolutions(s.mask, s.struct);
	amounts.push(a);
	p.show(i);
}
h.print("part 2:", amounts.sum());
