// coloring
export const cOff = '\x1b[0m';
export const black = "\x1b[30m";
export const red = "\x1b[31m";
export const green = "\x1b[32m";
export const yellow = "\x1b[33m";
export const blue = "\x1b[34m";
export const magenta = "\x1b[35m";
export const cyan = "\x1b[36m";
export const white = "\x1b[37m";

export const whiteBlock = '\u2588';
export const grayBlock = '\u2591';

export const colorValueArray = [white, green, red, yellow, cyan, blue, magenta];
export const colorNameArray = ['w','g','r','y','c', 'b','m'];

export {}
declare global {
    interface Array<T>  {
        sum(): number;
        prod(): number;
        sum0(): number[];
        sum1(): number[];
        prod0(): number[];
        prod1(): number[];
        tonum(): any[];
        sortnum(): number[];
        range(start:number): number[];
        range(): number[];
        col(column:number): any[];
        times(t: number) : any[];
        timesEach(t: any[]) : any[];
        plus(p:number) : any[];
        plusEach(p:any[]) : any[];
        mod(m:number) : any[];
        abs() : any[];
        sign() : any[];
        manhattan() : any[];
        manhattan(other:any[]) : any[];
        cartesianProduct() : any[][];
        count(element:any): number;
        includesAll(array: any[]) : boolean;
        includes2(array: any[]) : boolean;
	    includesAny(array: any[]) : boolean;
        intersect(array: any[]) : any[];
        presentInAll() : any[];
        shared(array: any[]) : any[];
        get(index: number) : any;
        slice2(start:number, end:number) : any[];
        slice2(start:number) : any[];
        chunks(size:number) : any[][];
        last(): any;
        min(): number;
        max(): number;
        minmax(): number[];
        split(str:(string|RegExp)): any[][];
        replace(str:(string|RegExp), replacement:string): any[];
        match(regex: RegExp|string) : any[];
        match(regex: RegExp|string, onlySubs:boolean) : any[];
        matches(regex: RegExp|string) : any[];
        trim() : any[];
        copy() : any[];
        unique(): any[];
        dims(): number[];
	    dict(name:any): any;
        mapij(make:(i:number, j:number,x:any) => any) : any[][];
        mape(make: (x:any) => any) : any[];
        subfilter(matches: (x: any) => boolean) : any[][];
        transpose() : any[][];
        rotate(quarts:number) : any[][];
        toSet() : Set<T>;
        permutations() : any[][];
        removeFirstOccurrence(element: any) : void;
        todict() : Map<any,any>;

        print() : void;
        print(j1:string) : void;
        print(j1:string, j2:string) : void;
        print(j1:string, j2:string, sub:number|number[]) : void;

        printc(matches: (x: any) => boolean) : void;
        printc(matches: (x: any) => boolean, color:string) : void;
        printc(matches: (x: any) => boolean, color:string,j1:string) : void;
        printc(matches: (x: any) => boolean, color:string,j1:string, j2:string) : void;
        printc(matches: (x: any) => boolean, color:string,j1:string, j2:string, sub:number|number[]) : void;

        string() : string;
        string(j1:string) : string;
        string(j1:string, j2:string) : string;
        string(j1:string, j2:string, sub:number|number[]) : string;

        stringc(matches: (x: any) => boolean, color:string) : string;
        stringc(matches: (x: any) => boolean, color:string,j1:string) : string;
        stringc(matches: (x: any) => boolean, color:string,j1:string, j2:string) : string;
        stringc(matches: (x: any) => boolean, color:string,j1:string, j2:string, sub:number|number[]) : string;
    }

    interface String {
        get(index: number) : string;
        slice2(start:number, end:number) : string;
        stringc(matches: (x: any) => boolean) : string;
        stringc(matches: (x: any) => boolean, color:string) : string;
        printc(matches: (x: any) => boolean) : void;
        printc(matches: (x: any) => boolean, color:string) : void;
    }

    interface Set<T> {
        toList<T>() : T[];
    }
}

if (!Array.prototype.removeFirstOccurrence) {
    // remove first occurrence of element from array
    Object.defineProperty(Array.prototype, 'removeFirstOccurrence', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function removeFirstOccurrence(this: any[], element: any) : void {
            var index = this.indexOf(element);
            if (index > -1) this.splice(index, 1);
        }
    });
}


if(!Array.prototype.print) {
	// .string but then print the result
	Object.defineProperty(Array.prototype, 'print', {
	enumerable: false,
	writable:false,
	configurable: false,
	value: function print(this: any[][], j1:string = '',j2:string='\n', sub: number | number[] = 0) : void {
            console.log(this.string(j1,j2,sub));
        }
    });
}


if(!Array.prototype.string) {
	// combine all elements of a 2D string array to a single, printable string
	Object.defineProperty(Array.prototype, 'string', {
	enumerable: false,
	writable:false,
	configurable: false,
	value: function string(this: any[][], j1:string = '',j2:string='\n', sub: number|number[] = 0) : string {
            if (typeof(this[0]) != 'object') return this.join(j1);
            if (sub == 0) return this.map(l=> l.join(j1)).join(j2);
            if (typeof sub == 'number') return this.slice(0,sub).map(l=> l.slice(0,sub).join(j1)).join(j2);
            return this.slice(0,sub[0]).map(l=> l.slice(0,sub[1]).join(j1)).join(j2);
        }
    });
}

if(!Array.prototype.printc) {
	// .stringc but then print the result
	Object.defineProperty(Array.prototype, 'printc', {
	enumerable: false,
	writable:false,
	configurable: false,
	value: function printc(this: any[], matches:(x:any) => boolean, color:string = 'r', j1:string = '',j2:string='\n', sub: number | number[]) : void {
            console.log(this.stringc(matches,color,j1,j2, sub));
        }
    });
}

if (!String.prototype.printc) {
    // color specified elements of a string and print the result
    Object.defineProperty(String.prototype, 'printc', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function printc(this: string, matches:(x:any) => boolean, color:string = 'r') : void {
            console.log(this.stringc(matches,color));
        }
    });
}

if(!Array.prototype.stringc) {
	// convert to string but specify if a given element should be printed with a given color
	Object.defineProperty(Array.prototype, 'stringc', {
	enumerable: false,
	writable:false,
	configurable: false,
	value: function stringc(this: any[], matches:(x:any) => boolean, color:string, j1:string = '', j2:string='\n', sub: number|number[] = 0) : string {
            var end = cOff;
            var start:string = colorValueArray[colorNameArray.indexOf(color)];
            if (this[0] instanceof Array) {
                if (sub == 0) return this.map((l:any[]) => l.map(x=> matches(x) ? `${start}${x}${end}`: `${x}`).join(j1)).join(j2);
                if (typeof sub == 'number') return this.slice(0,sub).map((l:any[]) => l.slice(0,sub).map(x => matches(x) ? `${start}${x}${end}`: `${x}`).join(j1)).join(j2);
                return this.slice(0,sub[0]).map((l:any[]) => l.slice(0,sub[1]).map(x => matches(x) ? `${start}${x}${end}`: `${x}`).join(j1)).join(j2);
            } else {
                if (sub == 0) return this.map(x=> matches(x) ? `${start}${x}${end}`: `${x}`).join(j1);
                if (typeof sub == 'number') return this.slice(0,sub).map(x => matches(x) ? `${start}${x}${end}`: `${x}`).join(j1);
                return this.slice(0,sub[0]).map(x => matches(x) ? `${start}${x}${end}`: `${x}`).join(j1);
            }
            
        }
    });
}

if (!String.prototype.stringc) {
    // color specified elements of a string
    Object.defineProperty(String.prototype, 'stringc', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function stringc(this: string, matches:(x:any) => boolean, color:string = 'r') : string {
            var end = cOff;
            var start:string = colorValueArray[colorNameArray.indexOf(color)];
            return this.split('').map(x=> matches(x) ? `${start}${x}${end}`: `${x}`).join('');
        }
    });
}

if (!Array.prototype.transpose) {
    // transpose a 2D array
    Object.defineProperty(Array.prototype, 'transpose', {
    enumerable: false,
    writable:false,
    configurable: false,
    value: function transpose(this: any[][]) : any[][] {
            return this[0].map((_, c) => this.map(r => r[c]));
        }
    });
}

if(!Array.prototype.rotate) {
    // rotate a 2D array by 90 degrees a given number of times
    Object.defineProperty(Array.prototype, 'rotate', {
    enumerable: false,
    writable:false,
    configurable: false,
    value: function rotate(this: any[][], quarts: number) : any[][] {
            var res = this;
            for (var i = 0; i < quarts; i++) {
                res = res.transpose().map(l => l.reverse());
            }
            return res;
        }
    });
}

if(!Array.prototype.mape) {
	// map each element x of an array recursively
	Object.defineProperty(Array.prototype, 'mape', {
	enumerable: false,
	writable:false,
	configurable: false,
	value: function mape(this: any[][], make:(x:any) => any) : any[] {
        return this.map(e =>  Array.isArray(e) ? e.mape(make) : make(e));
        }
    });
}

if(!Array.prototype.match) {
    // apply a regex match to each element and return the matches
    Object.defineProperty(Array.prototype, 'match', {
        enumerable: false,
        writable:false,
        configurable: false,
        value: function match(this: any[][], regex:RegExp|string, onlySubs:boolean = true) : any[] {
            var r = typeof(regex) == 'string' ? new RegExp(regex) : regex;
            return this.mape(e => onlySubs ? e.match(r).slice(1) : e.match(r).slice(0));
        }
    });
}

if(!Array.prototype.matches) {
    // return a boolean array stating if each element matches a regex
    Object.defineProperty(Array.prototype, 'matches', {
        enumerable: false,
        writable:false,
        configurable: false,
        value: function matches(this: any[][], regex:RegExp|string) : any[] {
            var r = typeof(regex) == 'string' ? new RegExp(regex) : regex;
            return this.mape(e => e.match(r) != undefined && e.match(r).length > 0);
        }
    });
}

if(!Array.prototype.subfilter) {
    // apply filter on each sub-array in a 2D array
	Object.defineProperty(Array.prototype, 'subfilter', {
	enumerable: false,
	writable:false,
	configurable: false,
	value: function subfilter(this: any[][], matches:(x:any) => boolean) : any[][] {
            return this.map(l => l.filter(x => matches(x)));
        }
    });
}

if(!Array.prototype.mapij) {
	// map each element x of a 2-D array to a new value using 
    // its primary (i) and secondary (j) coordinates
	Object.defineProperty(Array.prototype, 'mapij', {
	enumerable: false,
	writable:false,
	configurable: false,
	value: function mapij(this: any[][], make:(i:number, j:number,x:any) => any) : any[][] {
        return this.map((l,ii) => l.map((e,jj) => make(ii,jj,e)));
        }
    });
}

if(!Array.prototype.dict) {
	// return element [1] of subarray where [0] equals input
    // i.e, treats an Nx2 array as a dictionary
	Object.defineProperty(Array.prototype, 'dict', {
	enumerable: false,
	writable:false,
	configurable: false,
	value: function dict(this: any[][], name: any) : any {
        return this[this.col(0).indexOf(name)][1];
        }
    });
}

if (!Array.prototype.dims) {
    // return dimensions of 2D array
    Object.defineProperty(Array.prototype, 'dims', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function dims(this: any[][]): number[] {
            return [this.length, this[0].length];
        }
    });
}

if (!Array.prototype.unique) {
    // return a new array containing all distinct values in the original one
    Object.defineProperty(Array.prototype, 'unique', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function unique(this: any[]): any[] {
            var newArray:any[] = Array(this.length).fill(undefined);
            var index = 0;
            for (let i=0;i<this.length;i++) {
                if (!newArray.includes2(this[i])) {
                    newArray[index] = this[i];
                    index++;
                }
            }
            return newArray.slice(0,index);
        }
    });
}

if (!Array.prototype.copy) {
    // return a deep copy of the array using JSON parse/stringify
    Object.defineProperty(Array.prototype, 'copy', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function copy(this: any[]): any[] {
            return JSON.parse(JSON.stringify(this));
        }
    });
}

if (!Array.prototype.split) {
    // split all string sub elements recursively
    Object.defineProperty(Array.prototype, 'split', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function split(this: any[],str:(string|RegExp)): any[][] {
            return this.map(el => el.split(str));
        }
    });
}

if (!Array.prototype.replace) {
    // replace all string sub elements recursively
    Object.defineProperty(Array.prototype, 'replace', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function replace(this: any[],str:(string|RegExp),newstr:string): any[] {
            return this.map(el => el.replace(str,newstr));
        }
    });
}

if (!Array.prototype.tonum) {
    // cast all elements to int recursively
    Object.defineProperty(Array.prototype, 'tonum', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function tonum(this: any[]): any[] {
            return this.map(str => typeof str == 'string' ? +str : str.tonum());
        }
    });
}

if (!Array.prototype.trim) {
    /// trim all string elements recursively
    Object.defineProperty(Array.prototype, 'trim', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function trim(this: any[]): any[] {
            return this.map(str => str.trim());
        }
    });
}

if (!Array.prototype.sortnum) {
    // sort number array ascending
    Object.defineProperty(Array.prototype, 'sortnum', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function sortnum(this: number[]): number[] {
            return this.sort((a,b) => a-b);
        }
    });
}

if (!Array.prototype.min) {
    // minimum of all array elements
    Object.defineProperty(Array.prototype, 'min', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function min(this: number[]): number {
            return Math.min(...this);
        }
    });
}

if (!Array.prototype.max) {
    // maximum of all array elements
    Object.defineProperty(Array.prototype, 'max', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function max(this: number[]): number {
            return Math.max(...this);
        }
    });
}

if (!Array.prototype.minmax) {
    // return min and max of all array elements as [min,max]
    Object.defineProperty(Array.prototype, 'minmax', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function minmax(this: number[]): number[] {
            return [Math.min(...this), Math.max(...this)];
        }
    });
}

if (!Array.prototype.col) {
    // column of array with sub arrays at given X position
    Object.defineProperty(Array.prototype, 'col', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function col(this: any[][], column:number): any[] {
            return this.map(el => el[column]);
        }
    });
}

if (!Array.prototype.times) {
    // multiply each element with a scalar value (recursively)
    Object.defineProperty(Array.prototype, 'times', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function times(this: any[], t:number): any[] {
            return this.map(el => Array.isArray(el) ? el.times(t) : el * t);
        }
    });
}

if (!Array.prototype.plus) {
    // add a scalar value to each element (recursively)
    Object.defineProperty(Array.prototype, 'plus', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function plus(this: any[], p:number): any[] {
            return this.map(el => Array.isArray(el) ? el.plus(p) : el + p);
        }
    });
}

if (!Array.prototype.plusEach) {
    // add each element of two arrays (recursively)
    Object.defineProperty(Array.prototype, 'plusEach', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function plusEach(this: any[], other:any[]): any[] {
            return this.map((el,i) => Array.isArray(el) ? el.plusEach(other[i]) : el + other[i]);
        }
    });
}

if (!Array.prototype.timesEach) {
    // multiply each element of two arrays with each other (recursively)
    Object.defineProperty(Array.prototype, 'timesEach', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function timesEach(this: any[], other:any[]): any[] {
            return this.map((el,i) => Array.isArray(el) ? el.timesEach(other[i]) : el * other[i]);
        }
    });
}

if (!Array.prototype.mod) {
    // take the modulo of each element with a scalar (recursively)
    Object.defineProperty(Array.prototype, 'mod', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function mod(this: any[], m:number): any[] {
            return this.map(el => Array.isArray(el) ? el.mod(m) : el % m);
        }
    });
}

if (!Array.prototype.abs) {
    // calculate the absolute of each element (recursively)
    Object.defineProperty(Array.prototype, 'abs', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function abs(this: any[]): any[] {
            return this.map(el => Array.isArray(el) ? el.abs() : Math.abs(el));
        }
    });
}

if (!Array.prototype.sign) {
    // divide each element by its absolute value, keeping only 1's and -1's (recursively)
    Object.defineProperty(Array.prototype, 'sign', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function sign(this: any[]): any[] {
            return this.map(el => Array.isArray(el) ? el.sign() : el == 0 ? el : el > 0 ? 1 : -1);
        }
    });
}


if (!Array.prototype.manhattan) {
    // calculate the manhattan distance between two arrays (recursively)
    Object.defineProperty(Array.prototype, 'manhattan', {
        enumerable: false, 
        writable: false,
        configurable: false, 
        value: function manhattan(this: any[], other:any[] = new Array(this.length).fill(0)): any[] {
            return this.map((el,i) => Array.isArray(el) ? el.manhattan(other[i]) : Math.abs(el - other[i]));
        }
    });
}

if (!Array.prototype.cartesianProduct) {
    // calculate the cartesian product of N sub-arrays
    Object.defineProperty(Array.prototype, 'cartesianProduct', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function cartesianProduct(this: any[][]): any[][] {
            return this.length == 0 
            ? this
            : this.length == 1 
                ? this[0].map(el => [el])
                : this.reduce((a,b) => a.flatMap(d => b.map(e => [d,e].flat())));
        }
    });
}

if (!Array.prototype.count) {
    // count of all occurrences of element in array
    Object.defineProperty(Array.prototype, 'count', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function count(this: any[], element:any): number {
            return this.reduce(function(n, val) {
                return n + (val === element);
            }, 0);
        }
    });
}

if (!Array.prototype.includes2) {
    // check if array includes a complete given array as a sub-array
    Object.defineProperty(Array.prototype, 'includes2', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function includes2(this: any[][], array:any[]): boolean {
            return contains(this, array);
        }
    });
}

if (!Array.prototype.shared) {
    // returns new array that contains all unique elements which are in both the first and second array                                        
	Object.defineProperty(Array.prototype, 'shared', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function shared(this: any[], array:any[]): any[] {
            return  this.filter(x => array.includes2(x)).unique();
         }
    });
}

if (!Array.prototype.includesAny) {
    // check if array includes any element of second array                                         
	Object.defineProperty(Array.prototype, 'includesAny', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function includesAny(this: any[], array:any[]): boolean {
            return  this.some(r => array.includes2(r));
         }
    });
}

if (!Array.prototype.intersect) {
    // returns new array that contains all unique elements which are in both the first and second array                                        
    Object.defineProperty(Array.prototype, 'intersect', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function intersect(this: any[], array:any[]): any[] {
            return  this.filter(x => array.includes2(x)).unique();
         }
    });
}


if (!Array.prototype.presentInAll) {
    // return all elements that are present in all arrays
    Object.defineProperty(Array.prototype, 'presentInAll', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function presentInAll(this: any[][]): any[] {
            return this.reduce((a, b) => a.filter(c => b.includes(c)));
        }
    });
}

if (!Array.prototype.includesAll) {
    // check if array includes all elements of second array
    Object.defineProperty(Array.prototype, 'includesAll', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function includesAll(this: any[], array:any[]): boolean {
            return array.every(v => this.includes2(v));
        }
    });
}

if (!Array.prototype.range) {
    Object.defineProperty(Array.prototype, 'range', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function range(this: any[],start:number = 0): number[] {
            return Array.from({length: (this.length - start)}, (v, k) => k + start);
        }
    });
}

if (!Array.prototype.get) {
    // get element of array at any given position, 
    // even if position is negative or larger than array length
    Object.defineProperty(Array.prototype, 'get', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function get(this: any[], index:number): any {
            return this[(index % this.length + this.length) % this.length];
        }
    });
}

if (!String.prototype.get) {
    // get character of string at any given position, 
    // even if position is negative or larger than string length
    Object.defineProperty(String.prototype, 'get', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function get(this: string, index:number): string {
            return this[(index % this.length + this.length) % this.length];
        }
    });
}


if (!Array.prototype.slice2) {
    // slice array at any given position,
    // even if position is negative or larger than array length
    Object.defineProperty(Array.prototype, 'slice2', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function slice2(this: any[], start:number, end:number = this.length): any[] {
            var realStart = (start % this.length + this.length) % this.length;
            var realEnd = (end % this.length + this.length) % this.length;
            return realEnd == 0 
                ? this.slice(realStart) 
                : this.slice(realStart, realEnd);
        }
    });
}

if (!Array.prototype.chunks) {
    // split array into chunks of given size
    Object.defineProperty(Array.prototype, 'chunks', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function chunks(this: any[], size:number): any[][] {
            return Array.from({length: Math.ceil(this.length / size)}, (v, i) => this.slice(i * size, i * size + size));
        }
    });
}


if (!String.prototype.slice2) {
    // slice string at any given position,
    // even if position is negative or larger than string length
    Object.defineProperty(String.prototype, 'slice2', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function slice2(this: string, start:number, end:number = this.length): string {
            return this.slice((start % this.length + this.length) % this.length, (end % this.length + this.length) % this.length);
        }
    });
}

if (!Array.prototype.last) {
    // last element of array
    Object.defineProperty(Array.prototype, 'last', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function last(this: any[]): any {
            return this[this.length -1];
        }
    });
}

if (!Array.prototype.sum) {
    // sum of all array elements
    Object.defineProperty(Array.prototype, 'sum', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function sum(this: number[]): number {
            return this.reduce((a:number,b:number) => a+b, 0);
        }
    });
}

if (!Array.prototype.sum0) {
    // piece-wise sum of sub-array elements in primary (Y) direction
    Object.defineProperty(Array.prototype, 'sum0', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function sum0(this:number[][] ): number[] {
            return apply0(this, 'sum');
        }
    });
}

if (!Array.prototype.prod0) {
    // piece-wise product of sub-array elements in primary (Y) direction
    Object.defineProperty(Array.prototype, 'prod0', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function prod0(this:number[][] ): number[] {
            return apply0(this, 'prod');
        }
    });
}

if (!Array.prototype.prod1) {
    // products of all elements within each sub-array (in secondary (X) direction)
    Object.defineProperty(Array.prototype, 'prod1', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function prod1(this:number[][] ): number[] {
            return apply1(this, 'prod');
        }
    });
}

if (!Array.prototype.sum1) {
    // sum of elements of each sub-array (i.e., sum in secondary (X) direction)
    Object.defineProperty(Array.prototype, 'sum1', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function sum1(this: number[][]): number[] {
            return apply1(this, 'sum');
        }
    });
}

if (!Array.prototype.prod) {
    // multiplication of all array elements
    Object.defineProperty(Array.prototype, 'prod', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function prod(this: number[]): number {
            return this.reduce((a:number,b:number) => a*b);
        }
    });
}

if (!Array.prototype.toSet) {
    // convert to set
    Object.defineProperty(Array.prototype, 'toSet', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function toSet<T>(this: T[]): Set<T> {
            return new Set<T>(this);
        }
    });
}

if (!Array.prototype.permutations) {
    // return all permutations of an array
    Object.defineProperty(Array.prototype, 'permutations', {
        enumerable: false,
        writable: false,
        configurable: false,
        value: function permutations(this: any[]): any[][] {
            if (this.length == 1) return [this];
            var perms:any[][] = [];
            for (let i=0;i<this.length;i++) {
                var sub = this.slice(0,i).concat(this.slice(i+1));
                var subperms = sub.permutations();
                for (let j=0;j<subperms.length;j++) {
                    perms.push([this[i]].concat(subperms[j]));
                }
            }
            return perms;
        }
    });
}

if (!Array.prototype.todict) {
    // convert to dictionary
    Object.defineProperty(Array.prototype, 'todict', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function todict(this: any[]): Map<any,any> {
            var dict = new Map<any,any>();
            for (let i=0;i<this.length;i++) {
                dict.set(this[i][0], this[i][1]);
            }
            return dict;
        }
    });
}


if (!Set.prototype.toList) {
    // convert to list
    Object.defineProperty(Set.prototype, 'toList', {
        enumerable: false, 
        writable: false, 
        configurable: false, 
        value: function toList<T>(this: Set<T>): T[] {
            return Array.from(this);
        }
    });
}

export function apply0(array: number[][],operation:string) : number[] {
    return array[0].map((el:number,i:number) => {
        let verticalSlice = array.slice(1).map(c => c[i]);
        if (operation === 'sum') return el + verticalSlice.sum();
        else return el * verticalSlice.prod();
    });
}

export function apply1(array: number[][], operation:string) : number[] {
    return array.map(el => {
        if (operation == 'sum') return el.sum();
        else return el.prod();
    });
}

export function equals2(first: any, second: any): boolean {
    var [fa, sa] = [Array.isArray(first),Array.isArray(second)];
    if (!fa && !sa) return first === second;
    if (fa && sa){
        if (first.length != second.length) return false;
        for (let i=0;i<first.length;i++) if (!equals2(first[i],second[i])) return false;
        return true;
    }
    return false;
}

export function contains(array: any[], element: any): boolean {
    return array.filter(el => equals2(el, element)).length >= 1;
}
