import * as h from '../helpers';

type Condition = [string, string, number];
type Check = {to: string, condition: Condition|undefined}
type Rule = {id:string, checks: Check[]};
type Part = {x:number, m:number, a:number, s:number};

var toRule = (rawRule: string) : Rule => {
    var [id, rawChecks] = rawRule.match(/(\w+)\{([^\}]+)\}/)!.slice(1);
    const checks : Check[] = rawChecks.split(',').map((rawCheck) => {
        const parts = rawCheck.split(':');
        if (parts.length == 1) return {to: parts[0], condition: undefined};
        const [rawCondition, to] = parts;
        const condition = rawCondition.match(/(\w)([<>=])(\d+)/)!.slice(1);
        return {to, condition: [condition[0], condition[1], +condition[2]]};
    });
    return {id, checks};
}

const [rawRules, rawParts] = h.read("19", "rulesparts.txt", "ex");

const rules = rawRules.map(toRule);
h.print(h.stringify(rules[0]));
const parts : Part[] = rawParts.map((p:string) => eval('p = ' + p.replace(/=/g, ':')));
h.print(parts);