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

    function CycleView(game) {
      this.game = game;
      this.wallViews = [];
      Object.defineProperty(this, 'nameX', {
        get: this._nameX
      });
      Object.defineProperty(this, 'nameY', {
        get: this._nameY
      });
    }

    CycleView.property('cycle', {
      set: function(cycle) {
        this._cycle = cycle;
        return this.generateWallViews();
      },
      get: function() {
        return this._cycle;
      }
    });

    CycleView.prototype.character = function() {
      var explosionIndex;
      if (this._cycle.state === Cycle.STATES.EXPLODING) {
        explosionIndex = this._cycle.explosionFrame % 3;
        return CYCLE_EXPLOSION[explosionIndex];
      } else if (this._cycle.state === Cycle.STATES.DEAD) {
        return CYCLE_EXPLODED;
      } else {
        return CYCLE_CHAR[this._cycle.direction];
      }
    };

    CycleView.prototype.nextX = function() {
      return (this._cycle.x + 1) * CONSTANTS.DIMENSION_SCALE;
    };

    CycleView.prototype.nextY = function() {
      return (this._cycle.y + 1) * CONSTANTS.DIMENSION_SCALE;
    };

    CycleView.prototype.createCycleCharacter = function() {
      this.cycleCharacter = new pixi.Graphics();
      this.cycle_color = playerColors(this._cycle.number)['web'];
      this.cycleCharacter.lineStyle(2, this.cycle_color);
      return this.cycleCharacter.drawCircle(0, 0, 5);
    };

    CycleView.prototype.render = function(stage) {
      if (this.cycleCharacter === void 0) {
        this.createCycleCharacter();
      }
      this.cycleCharacter.position.x = this.nextX();
      this.cycleCharacter.position.y = this.nextY();
      if (!(stage.children.indexOf(this.cycleCharacter) > 0)) {
        stage.addChild(this.cycleCharacter);
      }
      return this.renderWallViews(stage);
    };

    CycleView.prototype.generateWallViews = function() {
      var wall, _i, _len, _ref, _results;
      _ref = this._cycle.walls;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        wall = _ref[_i];
        _results.push(this.createNewWallViews(wall));
      }
      return _results;
    };

    CycleView.prototype.createNewWallViews = function(wall) {
      var wallView;
      wallView = this.wallViews.filter(function(view) {
        return view.wall === wall;
      })[0];
      if (wallView === void 0) {
        wallView = new WallView(wall, this.cycle_color);
        this.wallViews.push(wallView);
        return wallView.wall = wall;
      }
    };

    CycleView.prototype.renderWallViews = function(stage) {
      var wallView, _i, _len, _ref, _results;
      _ref = this.wallViews;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        wallView = _ref[_i];
        _results.push(wallView.render(stage));
      }
      return _results;
    };

    CycleView.prototype.renderName = function() {};

    CycleView.property('nameX', function() {});

    CycleView.property('nameY', function() {
      return CycleView._cycle.y + 1;
    });

    CycleView.prototype.renderWinnerMessage = function() {
      var messageX, messageY;
      messageX = this._cycle.x - 1;
      return messageY = this._cycle.y;
    };

    return CycleView;

  }).call(this);

  module.exports = CycleView;

}).call(this);

//# sourceMappingURL=../../../maps/cycle_view.js.map
