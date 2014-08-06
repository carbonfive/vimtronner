(function() {
  var CONSTANTS, CYCLE_CHAR, Cycle, CycleView, Game, WallView, directions, pixi, playerColors;

  require('../../define_property');

  pixi = require('pixi');

  directions = require('../../models/directions');

  playerColors = require('./player_colors');

  CONSTANTS = require('./constants');

  Game = require('../../models/game');

  Cycle = require('../../models/cycle');

  WallView = require('./wall_view');

  CYCLE_CHAR = {};

  CycleView = (function() {
    var _this = this;

    CycleView.CYCLE_CHARS = CYCLE_CHAR;

    function CycleView(cycle, game) {
      this.cycle = cycle;
      this.game = game;
      this.generateWallViews();
      Object.defineProperty(this, 'nameX', {
        get: this._nameX
      });
      Object.defineProperty(this, 'nameY', {
        get: this._nameY
      });
    }

    CycleView.prototype.character = function() {
      var explosionIndex;
      if (this.cycle.state === Cycle.STATES.EXPLODING) {
        explosionIndex = this.cycle.explosionFrame % 3;
        return CYCLE_EXPLOSION[explosionIndex];
      } else if (this.cycle.state === Cycle.STATES.DEAD) {
        return CYCLE_EXPLODED;
      } else {
        return CYCLE_CHAR[this.cycle.direction];
      }
    };

    CycleView.prototype.nextX = function() {
      return (this.cycle.x + 1) * CONSTANTS.DIMENSION_SCALE;
    };

    CycleView.prototype.nextY = function() {
      return (this.cycle.y + 1) * CONSTANTS.DIMENSION_SCALE;
    };

    CycleView.prototype.createCycleCharacter = function() {
      var cycle_color;
      this.cycleCharacter = new pixi.Graphics();
      cycle_color = playerColors(this.cycle.number)['web'];
      this.cycleCharacter.lineStyle(2, cycle_color);
      return this.cycleCharacter.drawCircle(0, 0, 5);
    };

    CycleView.prototype.render = function(stage) {
      if (this.cycleCharacter === void 0) {
        this.createCycleCharacter();
      }
      console.log("next dims for cycle " + this.cycle.number + ":", this.nextY(), this.nextX());
      this.cycleCharacter.position.x = this.nextX();
      this.cycleCharacter.position.y = this.nextY();
      if (!(stage.children.indexOf(this.cycleCharacter) > 0)) {
        return stage.addChild(this.cycleCharacter);
      }
    };

    CycleView.prototype.generateWallViews = function() {
      var wall;
      return this.wallViews = (function() {
        var _i, _len, _ref, _results;
        _ref = this.cycle.walls;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          wall = _ref[_i];
          _results.push(new WallView(wall));
        }
        return _results;
      }).call(this);
    };

    CycleView.prototype.renderWallViews = function() {
      var wallView, _i, _len, _ref, _results;
      _ref = this.wallViews;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        wallView = _ref[_i];
        _results.push(wallView.render());
      }
      return _results;
    };

    CycleView.prototype.renderName = function() {};

    CycleView.property('nameX', function() {});

    CycleView.property('nameY', function() {
      return CycleView.cycle.y + 1;
    });

    CycleView.prototype.renderWinnerMessage = function() {
      var messageX, messageY;
      messageX = this.cycle.x - 1;
      return messageY = this.cycle.y;
    };

    return CycleView;

  }).call(this);

  module.exports = CycleView;

}).call(this);

//# sourceMappingURL=../../../maps/cycle_view.js.map
