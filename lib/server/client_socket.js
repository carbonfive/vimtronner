(function() {
  var ClientGameSocket, ClientSocket,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ClientGameSocket = require('./client_game_socket');

  ClientSocket = (function() {
    function ClientSocket(socket, server, gameSocketFactory) {
      this.socket = socket;
      this.server = server;
      this.gameSocketFactory = gameSocketFactory;
      this.onList = __bind(this.onList, this);
      this.onJoin = __bind(this.onJoin, this);
      if (this.gameSocketFactory == null) {
        this.gameSocketFactory = function(socket, game, cycle) {
          return new ClientGameSocket(socket, game, cycle);
        };
      }
      this.socket.on('join', this.onJoin);
      this.socket.on('list', this.onList);
    }

    ClientSocket.prototype.onJoin = function(gameAttributes, callback) {
      var cycle, game;
      if (callback == null) {
        callback = function(error, cycle) {};
      }
      game = this.server.getGame(gameAttributes);
      if (game != null) {
        this.adjustGameSize(game, gameAttributes);
        if ((cycle = game.addCycle()) != null) {
          this.gameSocketFactory(this.socket, game, cycle);
          return callback(null, cycle.number, game.toJSON());
        } else {
          return callback({
            message: "Game '" + gameAttributes.name + "' is already in progress."
          });
        }
      } else {
        return callback({
          message: "Could not find or create game named '" + gameAttributes.name + "'."
        });
      }
    };

    ClientSocket.prototype.onList = function() {
      return this.socket.emit('games', this.server.gameList());
    };

    ClientSocket.prototype.adjustGameSize = function(game, gameAttributes) {
      if (game.width > gameAttributes.width) {
        game.width = gameAttributes.width;
      }
      if (game.height > gameAttributes.height) {
        return game.height = gameAttributes.height;
      }
    };

    return ClientSocket;

  })();

  module.exports = ClientSocket;

}).call(this);

//# sourceMappingURL=../../maps/client_socket.js.map
