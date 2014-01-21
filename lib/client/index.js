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
    }

    Client.prototype.join = function(gameAttributes) {
      var gameView;
      this.gameAttributes = gameAttributes;
      this.gameAttributes.width = screen.columns;
      this.gameAttributes.height = screen.rows - 2;
      this.checkValidity();
      this.gameView = gameView = new GameView;
      return this.connect(this.andJoinGame);
    };

    Client.prototype.checkValidity = function() {
      var invalid;
      invalid = this.gameAttributes.width < 22 || this.gameAttributes.height < 22 || this.gameAttributes.width > screen.columns || this.gameAttributes.height > screen.rows - 2;
      if (invalid) {
        throw new Error("Width and height but be no smaller than 22 and no bigger than screen size");
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
        return _this.socket.on('game', _this.onGameUpdate);
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
      screen.showCursor();
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
      console.log(message);
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
