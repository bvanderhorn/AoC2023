import * as h from '../helpers';

var springs = h.read("12", "springs.txt").split(' ');

h.print(springs.slice(0,2));

var bruteSolve = (spring: string[]) : number {
	var field = spring[0];
	var values: number[] = spring[1].split(',').tonum();

}
