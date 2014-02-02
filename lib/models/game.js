(function() {
  var Cycle, EventEmitter, Game, Moniker, directions, playerAttributes,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require('../define_property');

  require('moniker');

  EventEmitter = require('events').EventEmitter;

  Moniker = require('moniker');

  directions = require('./directions');

  playerAttributes = require('./player_attributes');

  Cycle = require('./cycle');

  Game = (function(_super) {
    __extends(Game, _super);

    Game.STATES = {
      WAITING: 0,
      COUNTDOWN: 1,
      STARTED: 2,
      FINISHED: 3,
      RESTARTING: 4
    };

    function Game(attributes) {
      var n, _ref, _ref1, _ref2, _ref3;
      if (attributes == null) {
        attributes = {};
      }
      this.countdown = __bind(this.countdown, this);
      this.runGame = __bind(this.runGame, this);
      this.loop = __bind(this.loop, this);
      this.touch = __bind(this.touch, this);
      this.lastUpdated = Date.now();
      this.name = (_ref = attributes.name) != null ? _ref : Moniker.choose();
      this.numberOfPlayers = (_ref1 = attributes.numberOfPlayers) != null ? _ref1 : 1;
      this.availablePlayers = ((function() {
        var _i, _ref2, _results;
        _results = [];
        for (n = _i = 0, _ref2 = this.numberOfPlayers; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; n = 0 <= _ref2 ? ++_i : --_i) {
          _results.push(playerAttributes[n]);
        }
        return _results;
      }).call(this)).reverse();
      this.width = (_ref2 = attributes.width) != null ? _ref2 : 80;
      this.height = (_ref3 = attributes.height) != null ? _ref3 : 22;
      this.cycles = [];
      this.state = Game.STATES.WAITING;
      this._count = 6000;
    }

    Game.property('isWaiting', {
      get: function() {
        return this.state === Game.STATES.WAITING;
      }
    });

    Game.property('isCountingDown', {
      get: function() {
        return this.state === Game.STATES.COUNTDOWN;
      }
    });

    Game.property('isStarted', {
      get: function() {
        return this.state === Game.STATES.STARTED;
      }
    });

    Game.property('isFinished', {
      get: function() {
        return this.state === Game.STATES.FINISHED;
      }
    });

    Game.property('isRestarting', {
      get: function() {
        return this.state === Game.STATES.RESTARTING;
      }
    });

    Game.property('readyCycleCount', {
      get: function() {
        var count, cycle, _i, _len, _ref;
        count = 0;
        _ref = this.cycles;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cycle = _ref[_i];
          if (cycle.ready) {
            count++;
          }
        }
        return count;
      }
    });

    Game.property('activeCycleCount', {
      get: function() {
        var count, cycle, _i, _len, _ref;
        count = 0;
        _ref = this.cycles;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cycle = _ref[_i];
          if (cycle.state !== Cycle.STATES.DEAD) {
            count++;
          }
        }
        return count;
      }
    });

    Game.property('outdated', {
      get: function() {
        return (Date.now() - this.lastUpdated) > 180000;
      }
    });

    Game.prototype.touch = function() {
      return this.lastUpdated = Date.now();
    };

    Game.prototype.addCycle = function() {
      var attributes, cycle, player;
      if (this.inProgress || this.availablePlayers.length === 0) {
        return null;
      }
      player = this.availablePlayers.pop();
      attributes = {
        player: player,
        game: this
      };
      cycle = new Cycle(attributes);
      this.cycles.push(cycle);
      this.touch();
      return cycle;
    };

    Game.prototype.removeCycle = function(cycle) {
      var index;
      this.touch();
      this.availablePlayers.push(cycle.player);
      index = this.cycles.indexOf(cycle);
      this.cycles.splice(index, 1);
      if (this.inProgress) {
        this.checkForWinner();
      }
      return this.checkKillGame();
    };

    Game.prototype.checkForWinner = function() {
      var endGameCount;
      endGameCount = this.isPractice ? 0 : 1;
      if (this.activeCycleCount <= endGameCount) {
        return this.finishGame();
      }
    };

    Game.prototype.checkKillGame = function() {
      if (this.activeCycleCount < 1) {
        return this.stop();
      }
    };

    Game.prototype.start = function() {
      this.loop();
      return this.gameLoop = setInterval(this.loop, 100);
    };

    Game.prototype.loop = function() {
      switch (this.state) {
        case Game.STATES.WAITING:
        case Game.STATES.RESTARTING:
          this.checkIfGameStarts();
          break;
        case Game.STATES.COUNTDOWN:
          this.countdown();
          break;
        case Game.STATES.STARTED:
          this.runGame();
          break;
        case Game.STATES.FINISHED:
          this.checkIfGameRestarting();
      }
      return this.emit('game', this);
    };

    Game.prototype.runGame = function() {
      var cycle, _i, _len, _ref;
      _ref = this.cycles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cycle = _ref[_i];
        if (cycle != null) {
          cycle.step();
        }
        if (cycle != null) {
          cycle.checkCollisions(this.cycles);
        }
      }
      return this.checkForWinner();
    };

    Game.prototype.countdown = function() {
      this._count -= 100;
      if (this._count <= 0) {
        return this.state = Game.STATES.STARTED;
      }
    };

    Game.prototype.checkIfGameStarts = function() {
      var cycle, i, playerPosition, playerPositions, _i, _len, _ref, _results;
      if (this.readyCycleCount === this.numberOfPlayers) {
        this._count = 6000;
        this.state = Game.STATES.COUNTDOWN;
        playerPositions = this.calculatePlayerPositions();
        _ref = this.cycles;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          cycle = _ref[i];
          i = Math.floor(Math.random() * playerPositions.length);
          playerPosition = playerPositions[i];
          playerPositions.splice(i, 1);
          cycle.x = playerPosition['x'];
          cycle.y = playerPosition['y'];
          _results.push(cycle.direction = playerPosition['direction']);
        }
        return _results;
      }
    };

    Game.prototype.checkIfGameRestarting = function() {
      var cycle, _i, _len, _ref;
      if (this.cycles.some(function(cycle) {
        return cycle.ready;
      })) {
        _ref = this.cycles;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cycle = _ref[_i];
          cycle.walls = [];
        }
        return this.state = Game.STATES.RESTARTING;
      }
    };

    Game.prototype.finishGame = function() {
      var cycle, _i, _len, _ref;
      this.state = Game.STATES.FINISHED;
      _ref = this.cycles;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cycle = _ref[_i];
        cycle.ready = false;
      }
      if (!this.isPractice) {
        return this.determineWinner();
      }
    };

    Game.prototype.stop = function() {
      clearInterval(this.gameLoop);
      return this.emit('stopped', this);
    };

    Game.prototype.determineWinner = function() {
      var cycle, _i, _len, _ref, _results;
      _ref = this.cycles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cycle = _ref[_i];
        if (cycle.state !== Cycle.STATES.DEAD) {
          _results.push(cycle.makeWinner());
        }
      }
      return _results;
    };

    Game.property('inProgress', {
      get: function() {
        return this.state !== Game.STATES.WAITING && this.state !== Game.STATES.RESTARTING;
      }
    });

    Game.property('isPractice', {
      get: function() {
        return this.numberOfPlayers === 1;
      }
    });

    Game.property('count', {
      get: function() {
        return Math.ceil(this._count / 2000.0);
      },
      set: function(value) {
        return this._count = 2000.0 * value;
      }
    });

    Game.prototype.calculatePlayerPositions = function() {
      var halfXDistance, halfYDistance, maxXDistance, maxYDistance, minXDistance, minYDistance;
      minXDistance = 3;
      maxXDistance = this.width - minXDistance;
      halfXDistance = Math.round(this.width / 2);
      minYDistance = 3;
      maxYDistance = this.height - minXDistance;
      halfYDistance = Math.round(this.height / 2);
      return [
        {
          x: minXDistance,
          y: minYDistance,
          direction: directions.RIGHT
        }, {
          x: maxXDistance,
          y: maxYDistance,
          direction: directions.LEFT
        }, {
          x: minXDistance,
          y: maxYDistance,
          direction: directions.UP
        }, {
          x: maxXDistance,
          y: minYDistance,
          direction: directions.DOWN
        }, {
          x: halfXDistance,
          y: minYDistance,
          direction: directions.DOWN
        }, {
          x: halfXDistance,
          y: maxYDistance,
          direction: directions.UP
        }, {
          x: minXDistance,
          y: halfYDistance,
          direction: directions.RIGHT
        }, {
          x: maxXDistance,
          y: halfYDistance,
          direction: directions.LEFT
        }
      ];
    };

    Game.prototype.toJSON = function() {
      var cycle;
      return {
        name: this.name,
        state: this.state,
        count: this.count,
        numberOfPlayers: this.numberOfPlayers,
        width: this.width,
        height: this.height,
        cycles: (function() {
          var _i, _len, _ref, _results;
          _ref = this.cycles;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cycle = _ref[_i];
            _results.push(cycle.toJSON());
          }
          return _results;
        }).call(this),
        isPractice: this.isPractice
      };
    };

    return Game;

  })(EventEmitter);

  module.exports = Game;

}).call(this);

//# sourceMappingURL=../../maps/game.js.map
