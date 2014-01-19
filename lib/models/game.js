(function() {
  var Cycle, EventEmitter, Game, directions, playerAttributes,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require('../define_property');

  EventEmitter = require('events').EventEmitter;

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
      this.countdown = __bind(this.countdown, this);
      this.loop = __bind(this.loop, this);
      var _ref, _ref1;
      this.name = attributes.name;
      this.numberOfPlayers = (_ref = attributes.numberOfPlayers) != null ? _ref : 2;
      this.gridSize = (_ref1 = attributes.gridSize) != null ? _ref1 : 50;
      this.playerPositions = this.calculatePlayerPositions();
      this.cycles = [];
      this.state = Game.STATES.WAITING;
      this.count = 3;
    }

    Game.prototype.addCycle = function() {
      var attributes, cycle;
      if (this.inProgress) {
        return null;
      }
      attributes = playerAttributes[this.cycles.length];
      attributes['x'] = this.playerPositions[this.cycles.length]['x'];
      attributes['y'] = this.playerPositions[this.cycles.length]['y'];
      attributes['game'] = this;
      cycle = new Cycle(attributes);
      this.cycles.push(cycle);
      if (this.activeCycleCount() === this.numberOfPlayers) {
        this.start();
      } else {
        this.emit('game', this);
      }
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
      this.state = Game.STATES.COUNTDOWN;
      this.countInterval = setInterval(this.countdown, 1000);
      return this.gameLoop = setInterval(this.loop, 100);
    };

    Game.prototype.loop = function() {
      var cycle, _i, _len, _ref;
      if (this.state === Game.STATES.STARTED) {
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
        this.checkForWinner();
      }
      return this.emit('game', this);
    };

    Game.prototype.countdown = function() {
      this.count--;
      if (this.count === 0) {
        clearInterval(this.countInterval);
        return this.state = Game.STATES.STARTED;
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

    Game.prototype.calculatePlayerPositions = function() {
      var halfDistance, maxDistance, minDistance;
      minDistance = 3;
      maxDistance = this.gridSize - minDistance;
      halfDistance = Math.round(this.gridSize / 2);
      return [
        {
          x: minDistance,
          y: minDistance
        }, {
          x: maxDistance,
          y: maxDistance
        }, {
          x: minDistance,
          y: maxDistance
        }, {
          x: maxDistance,
          y: minDistance
        }, {
          x: halfDistance,
          y: minDistance
        }, {
          x: halfDistance,
          y: maxDistance
        }, {
          x: minDistance,
          y: halfDistance
        }, {
          x: maxDistance,
          y: halfDistance
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
        gridSize: this.gridSize,
        startX: this.startX,
        cycles: (function() {
          var _i, _len, _ref, _results;
          _ref = this.cycles;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cycle = _ref[_i];
            _results.push(cycle.toJSON());
          }
          return _results;
        }).call(this)
      };
    };

    return Game;

  })(EventEmitter);

  module.exports = Game;

}).call(this);
