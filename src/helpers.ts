import * as fs from "fs";
import { cOff, colorNameArray, colorValueArray , equals2, whiteBlock, grayBlock} from "./ArrayExtensions";
export * from "./ArrayExtensions";

const sourceFolder = '../../src/';

export function stringify(object: any) : string {
    return JSON.stringify(object, null, 4);
}

export function write(folder:string, filename:string, content:string, options:string='') {
    // options
    const example: boolean = options.includes('ex');

    const fn = (example ? 'example_' : '') + filename;
    print(' writing to file: ',folder,'/',fn)
    fs.writeFileSync(sourceFolder + folder + '/' + fn,content);
}

export function simpleRead(folder:string, filename:string, options:string ='') : string {
    // options
    const example: boolean = options.includes('ex');
    var exNumberMatch = options.match(/\d+/g);
    var exNumber = -1;
    if (exNumberMatch != null) exNumber = +exNumberMatch[0];

    const fn = (example ? ('example' + (exNumber >= 0 ? exNumber.toString() : '') + '_') : '') + filename;
    print(' reading file: ',folder,'/', fn);
    return fs.readFileSync(sourceFolder + folder + '/' + fn, 'utf8');
}

export function read(folder:string,filename:string, options:string='') : any[] {
    // read a file, split on double enters, then split on single enters
    // if double enters: returns string[][]
    // if no double enters: returns string[]
    const input = simpleRead(folder,filename,options).split(/\r?\n\r?\n/).map(el => el.split(/\r?\n/));
    return input.length == 1 ?  input[0] : input;
}

export function printv(doPrint:boolean, ...input:any[]) {
    if (doPrint) print(...input);
}

export function print(...input:any[]): void {
    updateColors(input);
    console.log(...input);
}

export function printu(...input:any[]): void {
    // print while clearing the last n lines in the terminal,
    // where n is the number of lines in the input
    updateColors(input);
    var str = input.join(' ');
    var lines = str.split(/\r\n|\r|\n/).length;
    clearLines(lines);
    process.stdout.write(str);
}

export var video = (function() {
    // https://stackoverflow.com/a/1479341/1716283
    var firstIteration: boolean = true;
    return {
        frame: function (...input:any) {
            if (firstIteration) {
                print(...input);
                firstIteration = false;
            } else {
                printu(...input, "\n");
            }
        }
    }
})

function clearLines(n:number): void {
    // clear the last n lines in the terminal
    for (let i = 0; i < n; i++) {
      //first clear the current line, then clear the previous line
      if (i>0) process.stdout.moveCursor(0, -1);      
      process.stdout.clearLine(1);
    }
    process.stdout.cursorTo(0);
}

function updateColors(...input:any[]) : void {
    // replace special color indicators
    // example: @@r this is red /@
    for (var i= 0; i < input.length; i++) {
        if (typeof input[i] === 'string') {
            var colors = input[i].matchAll(/\@\@(\w)/g);
            for (const color of colors) {
                input[i] = input[i].replace(color[0], colorValueArray[colorNameArray.indexOf(color[1])]);
            }
            input[i] = input[i].replace(/\/\@/g, cOff);
        }
    }
}

export function colorStr(input: any, color: string) : string {
    // color a string; options: 'r', 'g', 'b', 'y', 'm', 'c', 'w'
	var c = colorValueArray[colorNameArray.indexOf(color)];
	return c + input + cOff;
}

export function coorMapToMap(coor: Map<string, number>, translate: (x:number) => string, unchartered: string = ".", givenRange: [[number, number], [number, number]] | undefined = undefined) : string[][] {
    var coorArray = Array.from(coor, ([k,v]) => [...k.split(',').map(x => +x), v] as [number, number, number]);
    return coorToMap(coorArray, translate, unchartered, givenRange);
}

export function coorToMap(coor:[number, number, number][], translate: (x:number) => string, unchartered: string = ".", givenRange: [[number, number], [number, number]] | undefined = undefined) : string[][] {
    // draw a 2D map of coordinates
    // coor in format [x, y, value], where x is down and y is right
    // translate is a function that translates the value to a string
    // returns a 2D string array that can be printed using x.printc() or x.stringc()

    var xRange = givenRange != undefined ? givenRange[0] : coor.map(x => x[0]).minmax();
    var yRange = givenRange != undefined ? givenRange[1] : coor.map(x => x[1]).minmax();
    var str: string[][] = [];
    for (var x = xRange[0]; x <= xRange[1]; x++) {
        var curStr : string[] = [];
        for (var y = yRange[0]; y <= yRange[1]; y++) {
            var mIndex = coor.findIndex(m => equals2(m.slice(0,2), [x,y]));
            curStr.push(mIndex>-1 ? translate(coor[mIndex][2]) : unchartered);
        }
        str.push(curStr);
    }
    return str;
}

export async function sleep(ms:number) : Promise<void> {
    // sleep for ms milliseconds (use asynchroneously)
    return new Promise(resolve => setTimeout(resolve, ms));
  }

export function equals(first: any[], second: any[]) : boolean {
    return JSON.stringify(first) === JSON.stringify(second);
}

export function uniqueSimple(array: any[]) : any[] {
    return [...new Set(array)];
}

export function uniquea(array: number[][]) {
    // from https://stackoverflow.com/a/66420296/1716283
    return Array.from(
        new Map(array.map((p) => [JSON.stringify(p), p])).values()
    )
}

export function isDivisible(num:number, div:number){
    return num % div === 0;
}

export function sign(num:number) : number {
    // return the sign of a number (-1, 0, 1)
    return num > 0 ? 1 : num < 0 ? -1 : 0;
}

export function overlaps(interval1:number[], interval2:number[]) : boolean {
    // check if two intervals overlap
    return interval1.min() <= interval2.max() && interval1.max() >= interval2.min(); 
}

export function mergeIntervals(intervals: number[][], mergeConnected:boolean = false) : number[][] {
    // merge overlapping intervals
    var merged: number[][] = [];

    intervals.slice(0,intervals.length-1).map((int, i) => intervals.slice(i+1).map(int2 => {
        var connected = int.max() == int2.min()-1 || int.min() == int2.max()+1;
        if (overlaps(int, int2) || (mergeConnected && connected)) {
            merged.push([Math.min(int[0], int2[0]), Math.max(int[1], int2[1])]);
        }
    }));
    merged.push(...intervals.filter(int => merged.filter(int2 => overlaps(int, int2)).length == 0));
    merged = merged.unique();
    
    return equals2(merged, intervals) ?  merged : mergeIntervals(merged, mergeConnected);
}

export function isInInterval(interval:number[], number:number) : boolean {
    // check if number is in interval
    return number >= interval[0] && number <= interval[1];
}

export function isInIntervals(intervals:number[][], number:number) : boolean {
    // check if number is in any of the intervals
    return intervals.some(interval => isInInterval(interval, number));
}

export function range(start:number, end:number, step: number = 1) : number[] {
    // return array of numbers from start to end (exclusive) with optional step size
    return Array.from({length: Math.floor((end - start)/step)}, (v, k) => (k*step) + start);
}

export function expand(coor1: number[], coor2: number[]) : number[][] {
    // expand a line between two 2D coordinates to a list of coordinates
    // note: it is assumed that either the x or y coordinate of both input coordinates is the same
    var varIndex = (coor1[0] === coor2[0]) ? 1 : 0;
    var start = Math.min(coor1[varIndex], coor2[varIndex]);
    var end = Math.max(coor1[varIndex], coor2[varIndex]);
    var varIndices = Array(end-start+1).fill(1).map((_, index) => start + index);
    var expanded = (coor1[0] === coor2[0]) ? varIndices.map(el => [coor1[0], el]) : varIndices.map(el => [el, coor1[1]]);
    return start === coor1[varIndex] ? expanded : expanded.reverse();
}
export function expandTrace(trace:number[][]) : number[][] {
    // expand a trace of coordinates to a list of coordinates
    // note: see also expand(coor1, coor2)
    var expTrace : number[][] = [trace[0]];
    for (let i=1;i<trace.length;i++) expTrace = expTrace.concat(expand(trace[i-1],trace[i]).slice(1));
    return expTrace;
}

export function getnb(pos:number[], dyi:number[]|number = 0, dxi:number[]|number = 0,options=''): number[][] {
    // with Y being the primary (down) direction of the 2D map, and X being the secondary (right) one
    // dx, dy are in format [xMin, xMax] / [yMin, yMax]
    var dx = Array.isArray(dxi) ? dxi : [0,dxi];
    var dy = Array.isArray(dyi) ? dyi : [0,dyi];
    var n8 = options.includes('8');
    var n9 = options.includes('9');
    var noFilter = options.includes('nf');
    var filterDirs = options.includes('u') || options.includes('d') || options.includes('l') || options.includes('r');
    var dirs = 'udlr'.split('');
    if (filterDirs) dirs = dirs.filter(d => options.includes(d));

    var nb:number[][] = [];
    if (dirs.includes('u')) nb.push([pos[0]-1, pos[1]]);
    if (dirs.includes('d')) nb.push([pos[0]+1, pos[1]]);
    if (dirs.includes('l')) nb.push([pos[0]  , pos[1]-1]);
    if (dirs.includes('r')) nb.push([pos[0]  , pos[1]+1]);
    if (n8 || n9) nb.push(
        [pos[0]-1, pos[1]-1],
        [pos[0]-1, pos[1]+1],
        [pos[0]+1, pos[1]-1],
        [pos[0]+1, pos[1]+1]
    );
    if (n9) nb.push(pos);
    if (!noFilter) nb = nb.filter(n => n[0] >= dy[0] && n[0]<=dy[1] && n[1]>=dx[0] && n[1]<=dx[1]);

    return nb;
}

export function getnbDim(dims: number, higherDims:number[][] = [[]]) : number[][]  {
    // get (distance to) neighbors in n dimensions
    var dirs = [-1, 0, 1];
    return ea(dims, dirs).cartesianProduct().filter((n:number[]) => !n.every(d => d == 0));;
}

export function simpleSolve(input: any[][]) : any[] {
    // simple solve with sweeping and seeing if there is a a field with single solution 
    // and then removing that from all other fields
    var solved :number[] = ea(input.length, -1);
    var unsolved = input;
    while (unsolved.some((f:number[]) => f.length > 0)) {
        var solvedThisRound = unsolved.map((f:number[]) => f.length == 1 ? f[0] : -1);
        unsolved = unsolved.map((f:number[]) => f.filter((m:number) => !solvedThisRound.includes(m)));
        solved = solved.map((n:number,i:number) => n != -1 ? n : solvedThisRound[i]);
        if (solvedThisRound.every((n:number) => n == -1)) break;
    }
    return solved;
}

export function simpleDijkstra (map: [number, number][], start: [number, number]) : Map<string, number> {
    // get all distances on the map from the given start using Dijkstra's algorithm
    // this assumes:
    //   1. the map is a list of 2D [x,y] coordinates, which are all the visitable coordinates
    //   2. all connected coordinates have a distance of 1 between them
    //   3. coordinates are NOT diagonally connected
    // Output format is a Map with keys [x,y].toString(), values the distance from the start

    var distances = new Map<string, number>();
    distances.set(start.toString(), 0);
    var remaining = [start];
    var visited = new Set<string>();

    while (remaining.length > 0) {
        var cur = remaining.shift()!;
        var curDist = distances.get(cur.toString())!;
        var neighbors = [[0,1], [0,-1], [1,0], [-1,0]].map(x => cur.plusEach(x) as [number, number]);
        for (const n of neighbors) {
            var notYetVisited = !visited.has(n.toString());
            var presentOnMap = map.includes2(n);

            if (notYetVisited && presentOnMap) {
                var newDist = curDist + 1;
                var existingDist = distances.get(n.toString()) ?? Infinity;
                if (newDist < existingDist) distances.set(n.toString(), newDist);
                if (!remaining.includes2(n)) remaining.push(n);
            }
        }
        visited.add(cur.toString());
    }
    return distances;
}

export function ea(len:number|number[],fill:any = undefined) : any[] {
    // create an array with len elements, filled with fill
    // note: create a multi-dimensional array by passing an array as len
    if (Array.isArray(len) && len.length > 1) return ea(len[0]).map(_ => ea(len.slice(1),fill));
    if (Array.isArray(len)) return ea(len[0],fill);
    return new Array(len).fill(fill);
}

export function progress(counter:number,total:number, intervals:number = 100) {
    // print progress in percentage on given intervals
    if (counter % Math.floor(total/intervals) === 0) print((counter/total*100).toPrecision(3),'% done');
}

export class ProgressBar {
    private _vid = video();
    private _total: number;
    private _intervals:number;
    private _barLength:number;
    private _init: number = Date.now();
    constructor(total:number, intervals:number = 1E2, barLength:number = 50) {
        this._total = total;
        this._intervals = intervals;
        this._barLength = barLength;
    }

    public show = (counterIn:number, verbose:boolean = true) : void => {
        // for indices starting at 0
        // place pb.show() at the end of your for loop for best result
        if (!verbose) return;
        var counter = counterIn+1; 
        var max = this._total;
        if ((counter % Math.floor(this._total/this._intervals) === 0) ||( counter == max)) {
            // total string of _barLength, done % white, rest gray, including elapsed and projected times
            var elapsed = Date.now() - this._init;
            var done = counter/this._total;
            var projected = done === 0 ? 0 : elapsed/done;
            var stringDone = counter != max 
                ? Math.round(done*this._barLength)
                : this._barLength;

            var percentage = counter != max
                ? (counter/this._total*100).toFixed(1)
                : 100;

            // construct string
            var white = whiteBlock.repeat(stringDone);
            var gray = grayBlock.repeat(this._barLength-stringDone);
            var elapsedString = 'elapsed:' + msToSensible(elapsed);
            var projectedString = ', projected:' + msToSensible(projected);
            
            var barString = white + gray + " " + percentage + '% (' + elapsedString +  (counter != max ? projectedString : "") + ')';

            // print
            this._vid.frame(barString);
        }
    }
}

export function msToSensible(msIn:number) : string {
    // convert milliseconds to a sensible string
    if (msIn === 0) return "0ms";
    
    var seconds = Math.floor(msIn/1000);
    var ms = Math.round(msIn % 1000);
    var minutes = Math.floor(seconds/60);
    seconds = seconds % 60;
    var hours = Math.floor(minutes/60);
    minutes = minutes % 60;
    var days = Math.floor(hours/24);
    hours = hours % 24;
    var years = Math.floor(days/365);
    days = days % 365;

    var amounts:number[] = [years, days, hours, minutes, seconds, ms];
    var units:string[] = ['y', 'd', 'h', 'm', 's', 'ms'];
    var str = '';
    var i = amounts.findIndex(x => x > 0);
    while (i < amounts.length) {
        var u = units[i];
        var a = amounts[i];
        if (u == 's') {
            var astr = '';
            if (a<10 && amounts.slice(0,4).sum()==0) {
                a += amounts[i+1]/1000;
                astr = a.toFixed(2);
            } else {
                astr = a.toString();
            }
            return str + astr + u;
        }

        str += a + u;
        i++;
    }
    return str;
}

export function dec2bin(dec:number) : string {
    return (dec >>> 0).toString(2);
}

export function dec2hex(dec:number) : string {
    return dec.toString(16);
}

export function bin2dec(bin:string) : number {
    return parseInt(bin,2);
}

export function hex2dec(hex:string) : number {
    return parseInt(hex,16);
}

export function bin2hex(bin:string) : string {
    return parseInt(bin,2).toString(16);
}

export function hex2bin(hex:string) : string {
    return parseInt(hex,16).toString(2);
}

export function factorize(num:number, verbose:boolean = false) : number[] {
    // return the prime factors of a number
    // note: if a prime factor occurs multiple times, it is returned multiple times
    // note 2: if a number is negative, the factors of the absolute value are returned
    num = Math.abs(num);
    if (num == 1) return [1];
    var factors:number[] = [];
    var rem = num;
    var i = 2;
    while (i<=rem) {
        while (isDivisible(rem,i)) {
            factors.push(i);
            rem /= i;
        }
        i++;
    }
    if (verbose) print('factors of', num, ':', JSON.stringify(factors));
    return factors;
}

export function getCommonFactors(num1:number, num2:number, verbose: boolean = false) : number[] {
    var divisors1 = factorize(num1);
    var divisors2 = factorize(num2);
    var commonFactors:number[] = [];
    for (const d of divisors1){
        if (divisors2.includes(d)) {
            commonFactors.push(d);
            divisors2.splice(divisors2.indexOf(d),1);
        };
    }
    if (verbose) print('common factors of', num1, 'and', num2, ':', JSON.stringify(commonFactors));
    return commonFactors;
}

export function getCommonFactors2(nums:number[], verbose: boolean = false) : number[] {
    if (verbose) for (const num of nums) factorize(num, true);
    var commonFactors = getCommonFactors(nums[0], nums[1]);
    for (let i=2;i<nums.length;i++) {
        commonFactors = getCommonFactors(commonFactors.prod(), nums[i]);
    }
    if (verbose) print('common factors of', nums, ':', commonFactors);
    return commonFactors;
}

export function combineFactors(num1: number, num2:number) : number[] {
    var factors1 = factorize(num1);
    var factors2 = factorize(num2);
    for (var f of factors1) {
        if (factors2.includes(f)) {
            factors2.splice(factors2.indexOf(f), 1);
        }
    }
    return factors1.concat(factors2);
}
export function combineFactors2(nums:number[], verbose = false): number[] {
    if (nums.length == 1) return factorize(nums[0]);
    var factors = combineFactors(nums[0], nums[1]);
    factors = combineFactors2([factors.prod(), ...nums.slice(2)]);
    if (verbose) print("combined factors of",nums,":", JSON.stringify(factors));
    return factors;
}

export function smallestCommonMultiple(nums:number[], verbose = false) : number {
    // return the smallest number that is divisible by all numbers in the input array
    return combineFactors2(nums, verbose).prod();
}

export function findAllIndicesOf(re: RegExp, search: string) : number[] {
    // return all indices of a regex in a string
    var indices: number[] = [];
    var match: RegExpExecArray | null;
    while ((match = re.exec(search)) != null) {
        indices.push(match.index);
    }
    return indices;
}

export function findAllOccurrencesOf(re: RegExp, search: string) : RegExpExecArray[]  {
    // return all occurrences of a regex in a string
    var occurrences: RegExpExecArray[] = [];
    var match: RegExpExecArray | null;
    while ((match = re.exec(search)) != null) {
        occurrences.push(match);
    }
    return occurrences;
}

const snakeInternalNbMapping = [
    // for a given 'turn' for a list of 'snake' of coordinates, this mapping gives the internal neighbors
    ["rr", ["u","d"]],
    ["ll", ["d","u"]],
    ["uu", ["l","r"]],
    ["dd", ["r","l"]],
    ["dr", ["","ld"]],
    ["ru", ["","dr"]],
    ["ul", ["","ru"]],
    ["ld", ["","ul"]],
    ["rd", ["ur",""]],
    ["ur", ["lu",""]],
    ["lu", ["dl",""]],
    ["dl", ["rd",""]]
].todict();

function getInternalNb(grid:any[][]|null, pos: number[], turn:string, insideDir:string) : number[][] {
    var m = snakeInternalNbMapping.get(turn)!;
    var nb = 'lL'.includes(insideDir) ? m[0] : m[1];
    return materializeNb(grid, pos, nb);
}

function getSnakeNodeDirections(snakeIn: [number, number][]) : string[] {
    var snake = equals2(snakeIn[0], snakeIn.last()) ? snakeIn.slice(0,-1) : snakeIn;
    return snake.map((_,i) => {
        var [dx, dy] = snake.get(i+1).plusEach(snake.get(i).times(-1));
        return dx == 0
           ? dy > 0 ? 'r' : 'l'
           : dx > 0 ? 'd' : 'u';
    });
}

export function materializeNb(grid:any[][]|null, pos:number[], nb:string) : number[][] {
    var [x,y] = pos;
    var [dx, dy] = grid == null ? [[x-1, x+1], [y-1, y+1]] : [[0, grid.length-1], [0, grid[0].length-1]];
    return nb.length == 0 ? [] : getnb(pos, dx, dy, nb);
}

export function getSnakeInsideDirection(snakeIn: [number, number][]) {
    var snake = equals2(snakeIn[0], snakeIn.last()) ? snakeIn.slice(0,-1) : snakeIn; // remove last element if snake is closed
    var directions = getSnakeNodeDirections(snake);
    var turns = directions.map((d,i) => directions.get(i-1) + d);
    var lr = turns.map(t => t[0] == t[1] ? 's' : 'lurdl'.includes(t) ? 'r' : 'l');
    return lr.count('r') > lr.count('l') ? 'r' : 'l';
}

export function getSnakeInternalFields(grid:any[][]|null, snakeIn: [number, number][], includingSnake:boolean = false, waitbar:boolean = false) : [number, number][] {
    var snake = equals2(snakeIn[0], snakeIn.last()) ? snakeIn.slice(0,-1) : snakeIn; // remove last element if snake is closed
    var insideDir = getSnakeInsideDirection(snake);
    var directions = getSnakeNodeDirections(snake);
    var turns = directions.map((d,i) => directions.get(i-1) + d);
    var internals = turns.map((t,i) => getInternalNb(grid, snake[i],t, insideDir)).flat().filter(n => !snake.includes2(n)).unique();

    var i=0;
    var [px, py] = [snake.map(x => x[0]), snake.map(x => x[1])];
    var estimate = (px.max() - px.min())*(py.max() - py.min());
    var pb = new ProgressBar(estimate, 1E3);
    while (i<internals.length){
        var cur = internals[i];
        var nb = materializeNb(grid, cur,'lrud');
        internals.push(...nb.filter(n => !internals.includes2(n) && !snake.includes2(n)));
        pb.show(i++);
    }
    return includingSnake ? internals.concat(snake) : internals;
}

export class DoubleSet<T1> {
    private _setMap = new Map<T1, Set<T1>>();

    public constructor(input:[T1,T1][] = []) { 
        input.forEach(x => this.add(x));
    }

    public add = (value:[T1,T1]) : void => {
        if (!this._setMap.has(value[0])) this._setMap.set(value[0], new Set<T1>());
        this._setMap.get(value[0])!.add(value[1]);
    }

    public has = (value: [T1,T1]) : boolean => {
        var set = this._setMap.get(value[0]);
        return (set == undefined) 
            ? false
            : set.has(value[1]);
    }

    public delete = (value: [T1,T1]) : void => {
        var set = this._setMap.get(value[0]);
        if (set != undefined) {
            set.delete(value[1]);
            if (set.size == 0) this._setMap.delete(value[0]);
        }
    }

    public forEach = (callbackfn: (value: [T1,T1]) => void) : void => {
        this._setMap.forEach((set, value1) => set.forEach(value2 => callbackfn([value1, value2])));
    }
}

export class MultiMap<K,V> {
    // extension of the Map function to circumvent the 2^24-1 limit on the number of elements
    private readonly _maps : Map<K,V>[] = [];
    private readonly _maxMapSize = Math.pow(2, 24) -1;

    public constructor() {
        this._maps.push(new Map<K,V>());
    }

    public has(key: K) : boolean {
        for (const m of this._maps){
            if (m.has(key)) return true;
        }
        return false;
    }

    public set(key:K, value:V) : void {
        // overwrite existing value
        for (const m of this._maps){
            if (m.has(key)){
                m.set(key, value);
                return;
            }
        }

        // save as new value
        // if possible: to an existing map with space
        for (const m of this._maps){
            if (m.size < this._maxMapSize){
                m.set(key, value);
                return;
            }
        }
        
        // else: to a new map
        this._maps.push(new Map<K,V>());
        this._maps.last().set(key, value);
    }

    public get(key:K) : V|undefined {
        var filtered = this._maps.map(x => x.get(key)).filter(x => x != undefined);
        return filtered.length == 0 ? undefined : filtered[0];
    }

    public delete(key:K) : void {
        for (const m of this._maps){
            if (m.has(key)){
                m.delete(key);
                return;
            }
        }
    }

    public size = () : number => this._maps.map(x => x.size).sum();
}

export {}
declare global {
    interface Array<T>  {
        mapWithProgress(make: (x:any, i:number) => any, intervals: number) : any[];
        mapWithProgress(make: (x:any, i:number) => any) : any[];
    }
}

if (!Array.prototype.mapWithProgress) {
    Array.prototype.mapWithProgress = function (make: (x:any, i:number) => any, intervals: number = -1) : any[] {
        var bar = new ProgressBar(this.length, intervals < 0 ? this.length : intervals);
        return this.map((x:any, j:number) => {
            var result = make(x,j);
            bar.show(j);
            return result;
        });
    }
}

