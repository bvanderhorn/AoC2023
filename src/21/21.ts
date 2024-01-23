import * as h from '../helpers';

const garden = h.read("21", "garden.txt","ex").split('');

garden.stringc(x => x === "#", 'r', '','\n', 30).printc(x => x === "S", "c");