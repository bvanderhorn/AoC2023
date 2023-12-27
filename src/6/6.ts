import * as h from '../helpers';

var getDistances = (time:number) : number[] => h.range(0,time).map(x => x * (time - x));
var countDistancesOver = (time: number, distance: number) : number => getDistances(time).filter(x => x > distance).length;

var races = h.read("6", "races.txt").split(/\s+/).map(x => x.slice(1).tonum());
h.print(races);
h.print("part 1:", h.range(0, races[0].length).map(i => countDistancesOver(races[0][i], races[1][i])).prod());