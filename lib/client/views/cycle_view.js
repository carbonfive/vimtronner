(function() {
  var CYCLE_CHAR, CYCLE_EXPLODED, CYCLE_EXPLOSION, Cycle, CycleView, Game, WallView, buffer, directions, screen;

  require('../../define_property');

  directions = require('../../models/directions');

  buffer = require('../buffer');

  screen = require('../screen');

  Game = require('../../models/game');

  Cycle = require('../../models/cycle');

  WallView = require('./wall_view');

  CYCLE_CHAR = [];

  CYCLE_CHAR[directions.UP] = buffer(0xe2, 0x95, 0xbf);

  CYCLE_CHAR[directions.DOWN] = buffer(0xE2, 0x95, 0xBD);

  CYCLE_CHAR[directions.LEFT] = buffer(0xE2, 0x95, 0xBE);

  CYCLE_CHAR[directions.RIGHT] = buffer(0xE2, 0x95, 0xBC);

  CYCLE_EXPLOSION = [];

  CYCLE_EXPLOSION[0] = buffer(0xE2, 0xAC, 0xA4);

  CYCLE_EXPLOSION[1] = buffer(0xE2, 0x97, 0x8E);

  CYCLE_EXPLOSION[2] = buffer(0xE2, 0x97, 0xAF);

  CYCLE_EXPLODED = buffer(0xF0, 0x9F, 0x92, 0x80);

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

    CycleView.prototype.render = function() {
      var nextX;
      screen.setForegroundColor(this.cycle.color);
      nextX = this.cycle.x + 1;
      screen.moveTo(nextX, this.cycle.y + 1);
      process.stdout.write(this.character());
      this.renderWallViews();
      if (this.cycle.state === Cycle.STATES.WINNER) {
        return this.renderWinnerMessage();
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

    CycleView.prototype.renderName = function() {
      screen.moveTo(this.nameX, this.nameY);
      return process.stdout.write("Player " + this.cycle.number);
    };

    CycleView.property('nameX', function() {
      var screenX;
      screenX = CycleView.cycle.x;
      if (CycleView.cycle.x > 25) {
        return screenX - 10;
      } else {
        return screenX + 5;
      }
    });

    CycleView.property('nameY', function() {
      return CycleView.cycle.y + 1;
    });

    CycleView.prototype.renderWinnerMessage = function() {
      var messageX, messageY;
      messageX = this.cycle.x - 1;
      messageY = this.cycle.y;
      screen.moveTo(messageX, messageY);
      return process.stdout.write("Winner!!!");
    };

    return CycleView;

  }).call(this);

  module.exports = CycleView;

}).call(this);

//# sourceMappingURL=../../../maps/cycle_view.js.map
