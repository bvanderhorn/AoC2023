import * as h from '../helpers';
type Module = {
    id: string,
    type: string,
    toIds: string[],
    to: Module[],
    from: Module[],
    state: boolean
}

type Pulse = {
    hl: boolean,
    to: Module
}

var printPulse = (p: Pulse) => (p.hl ? "high" : "low") + " => " + p.to.id;

var applyCycle = (modules: Map<string, Module>, v:boolean = false, v2:boolean = false) : [number, number, boolean] => {
    var highlow : [number, number] = [0, 0];
    var remaining : Pulse[] = [{hl:false, to: modules.get("broadcaster")!}];
    var highLowRx: [number, number] = [0, 0];
    while (remaining.length > 0) {
        var pulse = remaining.shift()!;
        h.printv(v, "pulse:", printPulse(pulse));
        if (pulse.to.id == 'rx') highLowRx[pulse.hl ? 0 : 1]++;
        highlow[pulse.hl ? 0 : 1]++;
        var module = pulse.to;
        var toPush: Pulse[] = [];
        if (!"%&".includes(module.type)) toPush = module.to.map(m => ({hl: pulse.hl, to: m}));
        if (module.type == '%' && !pulse.hl) {
            // flip-flop
            module.state = !module.state;
            toPush = module.to.map(m => ({hl: module.state, to: m}));
        }
        if (module.type == '&') {
            // conjunction
            module.state = !module.from.every(m => m.state);
            toPush = module.to.map(m => ({hl: module.state, to: m}));
        }
        remaining.push(...toPush);
    }
    h.printv(v,"cycle:", highlow);
    h.printv(v2, "cycle", cycles, ", highLowRx:", highLowRx);
    return [highlow[0], highlow[1], highLowRx[1] == 1];
}

var modules: Map<string, Module> = h.read("20", "modules.txt").map(x => {
    var [typeId, to] = x.split(" -> ");
    var type = typeId.slice(0,1);
    var id = "%&".includes(type) ? typeId.slice(1) : typeId;
    return {id, type, toIds: to.split(', '), to:[], from:[], state: false};
}).map(m => [m.id, m]).todict();

modules.forEach(m => m.toIds.forEach(to => {
    if (!modules.has(to)) modules.set(to, {id: to, type: "0", toIds: [], to:[], from:[], state: false});
    var toModule = modules.get(to)!;
    m.to.push(toModule);
    toModule.from.push(m);
}));

// h.print(modules);

// part 1
var highlow = [0,0];
for (const i of h.range(0,1e3)) highlow = highlow.plusEach(applyCycle(modules).slice(0,2));
h.print("part 1:", highlow.prod());

// part 2
modules.forEach(m => m.state = false);
var cycles = 0;
while (++cycles) if (applyCycle(modules, false, false)[2]) break;
h.print("part 2:", cycles);
