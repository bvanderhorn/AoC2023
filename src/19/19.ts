import * as h from '../helpers';

type Condition = [string, string, number];
type Check = {to: string, condition: Condition|undefined};
type Part = Map<string, number>;
type Range = [number, number];
type PartRange = Map<string, Range>;
const params = ["x", "m", "a", "s"];

var toRule = (rawRule: string) : [string, Check[]] => {
    var [id, rawChecks] = rawRule.match(/(\w+)\{([^\}]+)\}/)!.slice(1);
    const checks : Check[] = rawChecks.split(',').map((rawCheck) => {
        const parts = rawCheck.split(':');
        if (parts.length == 1) return {to: parts[0], condition: undefined};
        const [rawCondition, to] = parts;
        const condition = rawCondition.match(/(\w)([<>=])(\d+)/)!.slice(1);
        return {to, condition: [condition[0], condition[1], +condition[2]]};
    });
    return [id, checks];
}
var value = (part: Part) : number => params.map(x => part.get(x)!).sum();

var checkPart = (part: Part) : boolean => {
    var curChecks = rules.get("in");
    while(true) {
        for (const check of curChecks) {
            var goto = false;
            if (check.condition === undefined) goto = true;
            if (!goto) {
                var [x, op, m] = check.condition;
                var val = part.get(x)!;
                goto = (op == '<' && val < m || op == '>' && val > m || op == '=' && val == m);
            }            
            
            if (goto) {
                var next = check.to;
                if (["A", "R"].includes(next)) return next == "A";
                curChecks = rules.get(next);
                break;
            }
        }
    }
}

var toString = (range: PartRange) : string => `x: ${range.get("x")}, m: ${range.get("m")}, a: ${range.get("a")}, s: ${range.get("s")}`;

var applyCondition = (inRange: PartRange, condition: Condition) : [PartRange|undefined, PartRange|undefined] => {
    // checks given part range against condition. Returns two part ranges: 
    // [one for when condition is true, one for when condition is false]
    var [x, op, m] = condition;
    var valRange = inRange.get(x)!;
    var [min, max] = valRange;

    // existing range fully outside  or inside condition
    if (op == '<' && m <= min || op == '>' && m >= max ) return [undefined, inRange];
    if (op == '<' && m >= max || op == '>' && m <= min ) return [inRange, undefined];

    // condition splits range
    var [trueRange, falseRange] = [new Map(inRange), new Map(inRange)];
    if (op == '<') {
        trueRange.set(x, [min, m-1]);
        falseRange.set(x, [m, max]);
    } else { // if op == '>'
        trueRange.set(x, [m+1, max]);
        falseRange.set(x, [min, m]);
    }

    return [trueRange, falseRange];
}

var combinations = (range: PartRange) : number => Array.from(range.values()).filter(r => r != undefined).map(r => r[1]- r[0] + 1).prod();

const [rawRules, rawParts] = h.read("19", "rulesparts.txt");

const rules = rawRules.map(toRule).todict();
// h.print(rules.get("in"));
const parts : Part[] = rawParts.map((p:string) => eval('p = ' + p.replace(/=/g, ':'))).map((p:{x:number, m:number, a:number, s:number}) => new Map(Object.entries(p)));
h.print("part 1:", parts.filter(checkPart).map(value).sum());

// part 2
var startRange = params.map(x => [x, [1, 4000]] as [string, Range]).todict() as PartRange;
var remaining : [string, PartRange][] = [["in", startRange]];
var acceptedRanges : PartRange[] = [];
var v = false; // verbose
while (remaining.length > 0) {
    h.printv(v,"rem:", remaining.map(r => r[0] + ' => ' + toString(r[1])));
    var [rule, range] = remaining.shift()!;
    var checks = rules.get(rule)!;
    h.printv(v,checks);
    for (const check of checks) {
        if (check.condition === undefined) {
            if (check.to == "A") {
                acceptedRanges.push(range);
                h.printv(v," full to acc:", toString(range));
            }
            else if (check.to != "R") remaining.push([check.to, range]);
            break;
        } 
        // else: condition is defined
        const [trueRange, falseRange] = applyCondition(range, check.condition);
        if (trueRange !== undefined) {
            if (check.to == "A") {
                acceptedRanges.push(trueRange);
                h.printv(v," true to acc:", toString(trueRange));
            }
            else if (check.to != "R") remaining.push([check.to, trueRange]);
        }
        if (falseRange !== undefined) range = falseRange;
        else break;
    }
}
h.print("part 2:", acceptedRanges.map(combinations).sum());
