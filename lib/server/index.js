(function() {
  var ClientSocket, Game, Moniker, Server, createGame, express, http, socketio,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  http = require('http');

  socketio = require('socket.io');

  express = require('express');

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
      this.onConnection = __bind(this.onConnection, this);
      this.checkForDeadGames = __bind(this.checkForDeadGames, this);
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
      var socket, _i, _len, _ref;
      _ref = this.io.sockets.clients(game.name);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        socket = _ref[_i];
        socket.disconnect();
      }
      return delete this.games[game.name];
    };

    Server.prototype.listen = function() {
      var cb, collectedOptions, key, option, options, port, value, _i, _j, _len;
      port = arguments[0], options = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), cb = arguments[_i++];
      this.port = port != null ? port : 8766;
      if (cb == null) {
        cb = (function() {});
      }
      this.checkDeadGameInterval = setInterval(this.checkForDeadGames, 180000);
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
      this.createWebServer();
      this.server = http.Server(this.webApp);
      this.io = socketio.listen(this.server, collectedOptions);
      this.io.sockets.on('connection', this.onConnection);
      return this.server.listen(this.port, cb);
    };

    Server.prototype.checkForDeadGames = function() {
      var game, games, name, _i, _len, _results;
      games = (function() {
        var _ref, _results;
        _ref = this.games;
        _results = [];
        for (name in _ref) {
          game = _ref[name];
          _results.push(game);
        }
        return _results;
      }).call(this);
      _results = [];
      for (_i = 0, _len = games.length; _i < _len; _i++) {
        game = games[_i];
        if (game.outdated) {
          _results.push(game.stop());
        }
      }
      return _results;
    };

    Server.prototype.onConnection = function(socket) {
      return new ClientSocket(socket, this);
    };

    Server.prototype.close = function(cb) {
      var _ref;
      if (cb == null) {
        cb = (function() {});
      }
      clearInterval(this.checkDeadGameInterval);
      return (_ref = this.server) != null ? _ref.close(cb) : void 0;
    };

    Server.prototype.createWebServer = function() {
      this.webApp = express();
      this.configureWebApp();
      return this.createRoutes();
    };

    Server.prototype.configureWebApp = function() {
      return this.webApp.use(express["static"]('public'));
    };

    Server.prototype.createRoutes = function() {
      return this.webApp.get('/', function(request, response) {
        return response.sendfile('index.html');
      });
    };

    return Server;

  })();

  module.exports = Server;

}).call(this);

//# sourceMappingURL=../../maps/index.js.map
