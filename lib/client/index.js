(function() {
  var Client, GameListView, GameView, screen, socketio,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  socketio = require('socket.io-client');

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
      this.errorMessages = [];
    }

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
      var invalid;
      invalid = this.gameAttributes.width < 80 || this.gameAttributes.height < 22 || this.gameAttributes.width > screen.columns || this.gameAttributes.height > screen.rows - 2;
      if (invalid) {
        throw new Error("Width must be no smaller than 80 and no greater than " + screen.columns + ".\nHeight must be no smaller than 22 and no greater than " + (screen.rows - 2) + ".");
      }
    };

    Client.prototype.listGames = function() {
      return this.connect(this.andListGames);
    };

    Client.prototype.connect = function(callback) {
      this.socket = socketio.connect("http://" + this.address + ":" + this.port);
      return this.socket.on('connect', callback);
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
