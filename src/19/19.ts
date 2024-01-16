import * as h from '../helpers';

type Condition = [string, string, number];
type Check = {to: string, condition: Condition|undefined};
type Part = {x:number, m:number, a:number, s:number};
type Range = [number, number];
type PartRange = {x: Range, m: Range, a: Range, s: Range};

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
var value = (part: Part) : number => part.x + part.m + part.a + part.s;

var checkPart = (part: Part) : boolean => {
    var curChecks = rules.get("in");
    while(true) {
        for (const check of curChecks) {
            var goto = false;
            if (check.condition === undefined) goto = true;
            if (!goto) {
                var [x, op, m] = check.condition;
                var val = x == 'x' ? part.x : x == 'm' ? part.m : x == 'a' ? part.a : part.s;
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

var applyCondition = (inRange: PartRange, condition: Condition) : [PartRange|undefined, PartRange|undefined] => {
    // checks given part range against condition. Returns two part ranges: 
    // [one for when condition is true, one for when condition is false]
    var [x, op, m] = condition;
    var valRange = x == 'x' ? inRange.x : x == 'm' ? inRange.m : x == 'a' ? inRange.a : inRange.s;
}

const [rawRules, rawParts] = h.read("19", "rulesparts.txt");

const rules = rawRules.map(toRule).todict();
// h.print(rules.get("in"));
const parts : Part[] = rawParts.map((p:string) => eval('p = ' + p.replace(/=/g, ':')));
h.print("part 1:", parts.filter(checkPart).map(value).sum());

// part 2
