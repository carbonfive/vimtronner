(function() {
  var ClientSocket, Game, Moniker, Server, createGame, http, socketio,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  http = require('http');

  socketio = require('socket.io');

  Moniker = require('moniker');

  Game = require('../models/game');

  ClientSocket = require('./client_socket');

  createGame = function(attributes, server) {
    var game;
    game = new Game(attributes);
    game.addListener('game', server.onGameChange);
    game.addListener('stopped', server.onGameStopped);
    game.start();
    return game;
  };

  Server = (function() {
    function Server(attributes) {
      var _ref;
      if (attributes == null) {
        attributes = {};
      }
      this.onRequest = __bind(this.onRequest, this);
      this.onConnection = __bind(this.onConnection, this);
      this.listen = __bind(this.listen, this);
      this.onGameStopped = __bind(this.onGameStopped, this);
      this.onGameChange = __bind(this.onGameChange, this);
      this.gameFactory = (_ref = attributes.createGame) != null ? _ref : createGame;
      this.games = {};
    }

    Server.prototype.getGame = function(attributes) {
      var _ref;
      if (attributes.name == null) {
        attributes.name = Moniker.choose();
      }
      return this.games[attributes.name] = (_ref = this.games[attributes.name]) != null ? _ref : createGame(attributes, this);
    };

    Server.prototype.gameList = function() {
      var game, name, _ref, _results;
      _ref = this.games;
      _results = [];
      for (name in _ref) {
        game = _ref[name];
        _results.push(game.toJSON());
      }
      return _results;
    };

    Server.prototype.onGameChange = function(game) {
      return this.io.sockets["in"](game.name).emit('game', game.toJSON());
    };

    Server.prototype.onGameStopped = function(game) {
      return delete this.games[game.name];
    };

    Server.prototype.listen = function() {
      var cb, collectedOptions, key, option, options, port, value, _i, _j, _len;
      port = arguments[0], options = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), cb = arguments[_i++];
      this.port = port != null ? port : 8000;
      if (cb == null) {
        cb = (function() {});
      }
      collectedOptions = {
        log: false
      };
      for (_j = 0, _len = options.length; _j < _len; _j++) {
        option = options[_j];
        for (key in option) {
          value = option[key];
          collectedOptions[key] = value;
        }
      }
      this.server = http.createServer(this.onRequest);
      this.io = socketio.listen(this.server, collectedOptions);
      this.io.sockets.on('connection', this.onConnection);
      return this.server.listen(this.port, cb);
    };

    Server.prototype.onConnection = function(socket) {
      return new ClientSocket(socket, this);
    };

    Server.prototype.onRequest = function(request, response) {
      response.writeHead(200);
      return response.end('Hello, world!');
    };

    Server.prototype.close = function(cb) {
      var _ref;
      if (cb == null) {
        cb = (function() {});
      }
      return (_ref = this.server) != null ? _ref.close(cb) : void 0;
    };

    return Server;

  })();

  module.exports = Server;

}).call(this);

//# sourceMappingURL=../../maps/index.js.map
