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
      FINISHED: 3
    };

    function Game(attributes) {
      var _ref, _ref1, _ref2, _ref3;
      if (attributes == null) {
        attributes = {};
      }
      this.countdown = __bind(this.countdown, this);
      this.runGame = __bind(this.runGame, this);
      this.loop = __bind(this.loop, this);
      this.name = (_ref = attributes.name) != null ? _ref : Moniker.choose();
      this.numberOfPlayers = (_ref1 = attributes.numberOfPlayers) != null ? _ref1 : 1;
      this.width = (_ref2 = attributes.width) != null ? _ref2 : 80;
      this.height = (_ref3 = attributes.height) != null ? _ref3 : 22;
      this.cycles = [];
      this.state = Game.STATES.WAITING;
      this._count = 3000;
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

    Game.prototype.addCycle = function() {
      var attributes, cycle;
      if (this.inProgress) {
        return null;
      }
      attributes = playerAttributes[this.cycles.length];
      attributes['game'] = this;
      cycle = new Cycle(attributes);
      this.cycles.push(cycle);
      return cycle;
    };

    Game.prototype.removeCycle = function(cycle) {
      var index;
      index = this.cycles.indexOf(cycle);
      this.cycles.splice(index, 1);
      return this.checkForWinner();
    };

    Game.prototype.checkForWinner = function() {
      if (this.activeCycleCount() <= 1) {
        return this.stop();
      }
    };

    Game.prototype.activeCycleCount = function() {
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
    };

    Game.prototype.start = function() {
      this.loop();
      return this.gameLoop = setInterval(this.loop, 100);
    };

    Game.prototype.loop = function() {
      switch (this.state) {
        case Game.STATES.WAITING:
          this.checkIfGameStarts();
          break;
        case Game.STATES.COUNTDOWN:
          this.countdown();
          break;
        case Game.STATES.STARTED:
          this.runGame();
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
      if (!this.isPractice) {
        return this.checkForWinner();
      }
    };

    Game.prototype.countdown = function() {
      this._count -= 100;
      if (this._count <= 0) {
        return this.state = Game.STATES.STARTED;
      }
    };

    Game.prototype.checkIfGameStarts = function() {
      var cycle, i, _fn, _i, _len, _ref, _results;
      if (this.readyCycleCount === this.numberOfPlayers) {
        this.state = Game.STATES.COUNTDOWN;
        this.playerPositions = this.calculatePlayerPositions();
        _ref = this.cycles;
        _fn = function(cycle, i) {};
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          cycle = _ref[i];
          _fn(cycle, i);
          cycle.x = this.playerPositions[i]['x'];
          _results.push(cycle.y = this.playerPositions[i]['y']);
        }
        return _results;
      }
    };

    Game.prototype.stop = function() {
      clearInterval(this.gameLoop);
      this.state = Game.STATES.FINISHED;
      this.determineWinner();
      this.emit('game', this);
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
        return this.state !== Game.STATES.WAITING;
      }
    });

    Game.property('isPractice', {
      get: function() {
        return this.numberOfPlayers === 1;
      }
    });

    Game.property('count', {
      get: function() {
        return Math.ceil(this._count / 1000.0);
      },
      set: function(value) {
        return this._count = 1000.0 * value;
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
          y: minYDistance
        }, {
          x: maxXDistance,
          y: maxYDistance
        }, {
          x: minXDistance,
          y: maxYDistance
        }, {
          x: maxXDistance,
          y: minYDistance
        }, {
          x: halfXDistance,
          y: minYDistance
        }, {
          x: halfXDistance,
          y: maxYDistance
        }, {
          x: minXDistance,
          y: halfYDistance
        }, {
          x: maxXDistance,
          y: halfYDistance
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
