import * as h from '../helpers';
type Module = {
    id: string,
    type: string,
    to: string[],
    from: Module[]
}

var modules: Map<string, Module> = h.read("20", "modules.txt", "ex").map(x => {
    var [typeId, to] = x.split(" -> ");
    var type = typeId.slice(0,1);
    var id = "%&".includes(type) ? typeId.slice(1) : typeId;
    return {id, type, to: to.split(', '), from:[]};
}).map(m => [m.id, m]).todict();

modules.forEach(m => m.to.forEach(to => modules.get(to)!.from.push(m)));

h.print(modules.get("a"));