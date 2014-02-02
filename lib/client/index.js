(function() {
  var Client, GameListView, GameView, screen, socketio,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  socketio = require('socket.io-client');

  require('../define_property');

  screen = require('./screen');

  GameView = require('./views/game_view');

  GameListView = require('./views/game_list_view');

  Client = (function() {
    function Client(address, port) {
      this.address = address != null ? address : "127.0.0.1";
      this.port = port != null ? port : 8000;
      this.storeCycle = __bind(this.storeCycle, this);
      this.showErrorMessage = __bind(this.showErrorMessage, this);
      this.onGames = __bind(this.onGames, this);
      this.andListGames = __bind(this.andListGames, this);
      this.onGameUpdate = __bind(this.onGameUpdate, this);
      this.onSigInt = __bind(this.onSigInt, this);
      this.onData = __bind(this.onData, this);
      this.andJoinGame = __bind(this.andJoinGame, this);
      this.connectError = __bind(this.connectError, this);
      this.errorMessages = [];
    }

    Client.property('url', {
      get: function() {
        return "http://" + this.address + ":" + this.port;
      }
    });

    Client.prototype.join = function(gameAttributes) {
      var gameView, _base, _base1;
      this.gameAttributes = gameAttributes;
      if ((_base = this.gameAttributes).width == null) {
        _base.width = screen.columns;
      }
      if ((_base1 = this.gameAttributes).height == null) {
        _base1.height = screen.rows - 2;
      }
      this.checkValidity();
      this.gameView = gameView = new GameView;
      return this.connect(this.andJoinGame);
    };

    Client.prototype.checkValidity = function() {
      var check, errorChecks, errors, message,
        _this = this;
      errorChecks = {
        "Width cannot be smaller than 80": function() {
          return _this.gameAttributes.width < 80;
        },
        "Width cannot be greater than screen size": function() {
          return _this.gameAttributes.width > screen.columns;
        },
        "Height cannot be smaller than 22": function() {
          return _this.gameAttributes.width < 22;
        },
        "Height cannot be greater than screen size": function() {
          return _this.gameAttributes.height > screen.rows - 2;
        },
        "Number of players must be between 1 to 6": function() {
          return _this.gameAttributes.numberOfPlayers < 1 || _this.gameAttributes.numberOfPlayers > 6;
        }
      };
      errors = (function() {
        var _results;
        _results = [];
        for (message in errorChecks) {
          check = errorChecks[message];
          if (check()) {
            _results.push(message);
          }
        }
        return _results;
      })();
      if (errors.length > 0) {
        throw new Error("The game parameters are invalid:\n\n" + (errors.join('\n')));
      }
    };

    Client.prototype.listGames = function() {
      return this.connect(this.andListGames);
    };

    Client.prototype.connect = function(callback) {
      var _this = this;
      this.socket = socketio.connect(this.url);
      this.socket.on('connect', callback);
      this.socket.on('connect_error', this.connectError);
      this.socket.on('connect_timeout', this.connectError);
      this.socket.on('error', this.connectError);
      return this.socket.on('connecting', function() {
        return process.stdout.write("Connecting to " + _this.url + " ...\n");
      });
    };

    Client.prototype.connectError = function() {
      process.stdout.write("Failed to connect to " + this.url + "\n");
      return process.exit(1);
    };

    Client.prototype.andJoinGame = function() {
      var _this = this;
      process.on('SIGINT', this.onSigInt);
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on('data', this.onData);
      return this.socket.emit('join', this.gameAttributes, function(error, cycleNumber, game) {
        if (error != null) {
          return _this.showErrorMessage(error.message);
        }
        _this.cycleNumber = cycleNumber;
        _this.onGameUpdate(game);
        _this.socket.on('game', _this.onGameUpdate);
        return _this.socket.on('disconnect', _this.quit);
      });
    };

    Client.prototype.onData = function(chunk) {
      switch (chunk[0]) {
        case 113:
          this.quit();
          return screen.clear();
        default:
          return this.socket.emit('movement', chunk[0]);
      }
    };

    Client.prototype.quit = function() {
      return process.kill(process.pid, 'SIGINT');
    };

    Client.prototype.onSigInt = function() {
      var message, _i, _len, _ref;
      screen.resetAll();
      screen.showCursor();
      screen.clear();
      if (this.errorMessages.length > 0) {
        process.stdout.write('\nERROR MESSAGES');
        process.stdout.write('\n--------------');
        _ref = this.errorMessages;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          message = _ref[_i];
          process.stdout.write("\n" + message);
        }
        process.stdout.write('\n--------------\n\n');
      }
      process.stdout.write('End of line.\n');
      return process.nextTick(process.exit);
    };

    Client.prototype.onGameUpdate = function(game) {
      this.gameView.game = game;
      this.gameView.cycleNumber = this.cycleNumber;
      return this.gameView.render();
    };

    Client.prototype.andListGames = function() {
      this.gameListView = new GameListView;
      this.socket.on('games', this.onGames);
      return this.socket.emit('list');
    };

    Client.prototype.onGames = function(games) {
      this.gameListView.addGames(games);
      this.gameListView.render();
      return this.socket.disconnect();
    };

    Client.prototype.showErrorMessage = function(message) {
      this.errorMessages.push(message);
      return this.quit();
    };

    Client.prototype.storeCycle = function(cycle) {
      return this.cycle = cycle;
    };

    return Client;

  })();

  module.exports = Client;

}).call(this);

//# sourceMappingURL=../../maps/index.js.map
