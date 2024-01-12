import * as h from '../helpers';

var digplan = h.read("18", "digplan.txt", "ex").match(/(\w)\s+(\d+)\s+\((#[\d\w]+)\)/);
h.print(digplan.slice(0,3));