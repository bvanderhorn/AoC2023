import * as h from '../helpers';

type rgb = [number, number, number];
type game = {
    id: number,
    grabs: rgb[]
}

var getGame = (input: string) : game => {
    var [id_str, grabs_str] = input.split(':');
    var id = +(id_str.replace(/[^0-9]/g,""));
    var grabs_strs = grabs_str.split(';');
    var grabs = grabs_strs.map(x => 
        x.split(',').map(y => {
            var val = +(y.replace(/[^0-9]/g,""));
            return [y.includes('red') ? val : 0, y.includes('green') ? val : 0, y.includes('blue') ? val : 0];
        }).sum0() as rgb
    );
    return {id, grabs};
}

var getMaxRgb = (game: game) : rgb => {
    var max: rgb = [0, 0, 0];
    game.grabs.forEach(g => {
        max = [
            Math.max(max[0], g[0]),
            Math.max(max[1], g[1]),
            Math.max(max[2], g[2])
        ];
    });
    return max;
}

var games = h.read("2", "games.txt").map(g => getGame(g));
h.print(games[0]);

var rgbMax: rgb = [12, 13, 14];
var validGames = games.filter(g => {
    var max = getMaxRgb(g);
    return max.plusEach(rgbMax.times(-1)).filter(x => x > 0).length == 0;
});

h.print("part 1:", validGames.map(x => x.id).sum());

