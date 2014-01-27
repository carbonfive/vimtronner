(function() {
  var Client, Server, exports, fs, program;

  program = require('commander');

  fs = require('fs');

  Server = require('./server');

  Client = require('./client');

  exports = module.exports = function(argv) {
    var client, e, height, number, server, width;
    program.version(JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version).option('-S, --server', 'launches in server only mode').option('-C, --client', 'launches in client only mode').option('-A, --address <address>', 'the address to connect the client', '127.0.0.1').option('-P, --port <port>', 'the port to launch the server or connect the client', 8766).option('-G, --game <game>', 'the name of the game the client wants to join').option('-N, --number <number of players>', 'the number of players required to play (applies to new game only)').option('-W, --width <size>', 'the grid width').option('-H, --height <size>', 'the grid height').option('-L, --list', 'list active games on the server').parse(argv);
    try {
      if (program.client == null) {
        server = new Server;
        server.listen(program.port);
      }
      if (program.server == null) {
        client = new Client(program.address, program.port);
        if (program.list) {
          return client.listGames();
        } else {
          number = parseInt(program.number, 10);
          width = parseInt(program.width);
          height = parseInt(program.height);
          return client.join({
            name: program.game,
            numberOfPlayers: number,
            width: width,
            height: height
          });
        }
      }
    } catch (_error) {
      e = _error;
      console.log(e.message);
      return process.exit(1);
    }
  };

}).call(this);

//# sourceMappingURL=../maps/vimtronner.js.map
