(function() {
  var $, GameListView, GameView, WebClient, socketio,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = require('jquery');

  socketio = require('socket.io-client');

  GameView = require('./views/game_view');

  GameListView = require('./views/game_list_view');

  require('../define_property');

  WebClient = (function() {
    function WebClient(address, port) {
      this.address = address != null ? address : "127.0.0.1";
      this.port = port != null ? port : 8766;
      this.onGames = __bind(this.onGames, this);
      this.andListGames = __bind(this.andListGames, this);
      this.connectError = __bind(this.connectError, this);
      this.onGameUpdate = __bind(this.onGameUpdate, this);
      this.showErrorMessage = __bind(this.showErrorMessage, this);
      this.andJoinGame = __bind(this.andJoinGame, this);
      this.errorMessages = [];
    }

    WebClient.property('url', {
      get: function() {
        return "http://" + this.address + ":" + this.port;
      }
    });

    WebClient.prototype.join = function(gameAttributes) {
      this.gameAttributes = gameAttributes;
      this.checkValidity();
      this.gameView = new GameView;
      this.connect(this.andJoinGame);
      return this.listenToEvents();
    };

    WebClient.prototype.listenToEvents = function() {
      var _this = this;
      return $(document).keypress(function(event) {
        switch (event.charCode) {
          case 113:
            return _this.quit();
          default:
            return _this.socket.emit('movement', event.charCode);
        }
      });
    };

    WebClient.prototype.quit = function() {
      return this.socket.disconnect();
    };

    WebClient.prototype.andJoinGame = function() {
      var _this = this;
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

    WebClient.prototype.showErrorMessage = function(message) {
      return this.errorMessages.push(message);
    };

    WebClient.prototype.onGameUpdate = function(game) {
      this.gameView.game = game;
      this.gameView.cycleNumber = this.cycleNumber;
      return this.gameView.render();
    };

    WebClient.prototype.checkValidity = function() {
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

    WebClient.prototype.listGames = function() {
      return this.connect(this.andListGames);
    };

    WebClient.prototype.connect = function(callback) {
      var _this = this;
      this.socket = socketio.connect(this.url);
      this.socket.on('connect', callback);
      this.socket.on('connect_error', this.connectError);
      this.socket.on('connect_timeout', this.connectError);
      this.socket.on('error', this.connectError);
      return this.socket.on('connecting', function() {
        return console.log("Connecting to " + _this.url + " ...\n");
      });
    };

    WebClient.prototype.connectError = function(error) {
      console.log(error);
      return console.log("Failed to connect to " + this.url + "\n");
    };

    WebClient.prototype.andListGames = function() {
      this.gameListView = new GameListView;
      this.socket.on('games', this.onGames);
      return this.socket.emit('list');
    };

    WebClient.prototype.onGames = function(games) {
      this.gameListView.addGames(games);
      this.gameListView.render();
      return this.socket.disconnect();
    };

    return WebClient;

  })();

  module.exports = WebClient;

}).call(this);

//# sourceMappingURL=../../maps/index.js.map
