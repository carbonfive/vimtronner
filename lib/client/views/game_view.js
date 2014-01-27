(function() {
  var ARENA_WALL_CHARS, CYCLE_NUMBER_NAMES, Cycle, CycleView, Game, GameView, buffer, cycleNumberName, playerColors, screen;

  require('../../define_property');

  screen = require('../screen');

  buffer = require('../buffer');

  Game = require('../../models/game');

  Cycle = require('../../models/cycle');

  CycleView = require('./cycle_view');

  playerColors = require('./player_colors');

  ARENA_WALL_CHARS = {
    HORIZONTAL: buffer(0xE2, 0x95, 0x90),
    VERTICAL: buffer(0xE2, 0x95, 0x91),
    TOP_LEFT_CORNER: buffer(0xE2, 0x95, 0x94),
    TOP_RIGHT_CORNER: buffer(0xE2, 0x95, 0x97),
    BOTTOM_LEFT_CORNER: buffer(0xE2, 0x95, 0x9A),
    BOTTOM_RIGHT_CORNER: buffer(0xE2, 0x95, 0x9D)
  };

  CYCLE_NUMBER_NAMES = {
    1: 'ONE',
    2: 'TWO',
    3: 'THREE',
    4: 'FOUR',
    5: 'FIVE',
    6: 'SIX',
    7: 'SEVEN',
    8: 'EIGHT'
  };

  cycleNumberName = function(cycleNumber) {
    return CYCLE_NUMBER_NAMES[cycleNumber];
  };

  GameView = (function() {
    function GameView() {
      this.cycleViews = [];
      this.countString = '';
    }

    GameView.property('state', {
      get: function() {
        var _ref;
        return (_ref = this._game) != null ? _ref.state : void 0;
      }
    });

    GameView.property('game', {
      set: function(game) {
        this._game = game;
        if (this._game.count !== this.lastCount && this.state === Game.STATES.COUNTDOWN) {
          this.lastCount = this._game.count;
          this.countString += "" + this._game.count + "...";
        }
        return this.generateCycleViews();
      },
      get: function() {
        return this._game;
      }
    });

    GameView.property('stateString', {
      get: function() {
        var _ref;
        switch ((_ref = this._game) != null ? _ref.state : void 0) {
          case Game.STATES.WAITING:
            return 'Waiting for other players';
          case Game.STATES.COUNTDOWN:
            return 'Get ready';
          case Game.STATES.STARTED:
            return 'Go';
          case Game.STATES.FINISHED:
            return 'Game over';
        }
      }
    });

    GameView.property('startX', {
      get: function() {
        return Math.round(screen.center.x - (this._game.width / 2));
      }
    });

    GameView.property('startY', {
      get: function() {
        return Math.round(screen.center.y - 2 - (this._game.height / 2));
      }
    });

    GameView.prototype.generateCycleViews = function() {
      var cycle;
      return this.cycleViews = (function() {
        var _i, _len, _ref, _results;
        _ref = this._game.cycles;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          cycle = _ref[_i];
          _results.push(new CycleView(cycle, this._game));
        }
        return _results;
      }).call(this);
    };

    GameView.prototype.render = function() {
      screen.clear();
      screen.hideCursor();
      screen.save();
      screen.transform(this.startX, this.startY);
      if (this.state === Game.STATES.WAITING) {
        this.renderWaitScreen();
      } else if (this.state === Game.STATES.COUNTDOWN) {
        this.renderCountdown();
      } else {
        this.renderArena();
        this.renderCycleViews();
      }
      screen.restore();
      return this.renderGameInfo();
    };

    GameView.prototype.renderArena = function() {
      var endX, endY, x, xRange, y, yRange, _i, _j, _k, _l, _results;
      screen.setForegroundColor(3);
      xRange = this.game.width - 1;
      yRange = this.game.height - 1;
      endX = this.game.width;
      endY = this.game.height;
      screen.moveTo(1, 1);
      screen.render(ARENA_WALL_CHARS.TOP_LEFT_CORNER);
      for (x = _i = 2; 2 <= xRange ? _i <= xRange : _i >= xRange; x = 2 <= xRange ? ++_i : --_i) {
        screen.moveTo(x, 1);
        screen.render(ARENA_WALL_CHARS.HORIZONTAL);
      }
      screen.moveTo(endX, 1);
      screen.render(ARENA_WALL_CHARS.TOP_RIGHT_CORNER);
      for (y = _j = 2; 2 <= yRange ? _j <= yRange : _j >= yRange; y = 2 <= yRange ? ++_j : --_j) {
        screen.moveTo(endX, y);
        screen.render(ARENA_WALL_CHARS.VERTICAL);
      }
      screen.moveTo(endX, endY);
      screen.render(ARENA_WALL_CHARS.BOTTOM_RIGHT_CORNER);
      for (x = _k = xRange; xRange <= 1 ? _k <= 1 : _k >= 1; x = xRange <= 1 ? ++_k : --_k) {
        screen.moveTo(x, endY);
        screen.render(ARENA_WALL_CHARS.HORIZONTAL);
      }
      screen.moveTo(1, endY);
      screen.render(ARENA_WALL_CHARS.BOTTOM_LEFT_CORNER);
      _results = [];
      for (y = _l = yRange; yRange <= 2 ? _l <= 2 : _l >= 2; y = yRange <= 2 ? ++_l : --_l) {
        screen.moveTo(1, y);
        _results.push(screen.render(ARENA_WALL_CHARS.VERTICAL));
      }
      return _results;
    };

    GameView.prototype.renderWaitScreen = function() {
      var centerX, i, instructions, y, _i, _ref;
      this.renderArena();
      instructions = ['left............h', 'down............j', 'up..............k', 'right...........l', 'insert mode.....i', 'normal mode...esc'];
      centerX = Math.round(this.game.width / 2);
      y = Math.round(this.game.height / 2) - 8;
      screen.setForegroundColor(6);
      screen.print('vimTronner', centerX, y, screen.TEXT_ALIGN.CENTER);
      y += 2;
      screen.resetColors();
      for (i = _i = 0, _ref = instructions.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        screen.print(instructions[i], centerX, y + i, screen.TEXT_ALIGN.CENTER);
      }
      y += instructions.length + 1;
      screen.setForegroundColor(playerColors(this.cycleNumber));
      screen.print("YOUR COLOR IS:", centerX, y, screen.TEXT_ALIGN.CENTER);
      y++;
      screen.setBackgroundColor(playerColors(this.cycleNumber));
      screen.print("    ", centerX, y, screen.TEXT_ALIGN.CENTER);
      screen.resetColors();
      screen.setForegroundColor(playerColors(this.cycleNumber));
      y += 2;
      if (this.playerCycle.ready) {
        screen.print("READY PLAYER " + (cycleNumberName(this.cycleNumber)), centerX, y, screen.TEXT_ALIGN.CENTER);
        screen.print("WAITING FOR OTHERS", centerX, y + 1, screen.TEXT_ALIGN.CENTER);
      } else {
        screen.print("YOU ARE PLAYER " + (cycleNumberName(this.cycleNumber)), centerX, y, screen.TEXT_ALIGN.CENTER);
        screen.print("INSERT TO ENTER", centerX, y + 1, screen.TEXT_ALIGN.CENTER);
      }
      return screen.resetColors();
    };

    GameView.prototype.renderCountdown = function() {
      this.renderArena();
      this.renderCycleViews();
      return this.renderCount();
    };

    GameView.prototype.renderCount = function() {
      var countX;
      screen.setForegroundColor(3);
      countX = Math.round(this.game.width / 2);
      return screen.print(this.countString, countX, Math.round(this.game.height / 2), screen.TEXT_ALIGN.CENTER);
    };

    GameView.prototype.renderCycleViews = function() {
      var cycleView, _i, _len, _ref, _results;
      _ref = this.cycleViews;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cycleView = _ref[_i];
        _results.push(cycleView.render());
      }
      return _results;
    };

    GameView.prototype.renderGameInfo = function() {
      var i, name;
      if ((this.game.name != null) && (this.cycleNumber != null)) {
        name = this.game.isPractice ? 'PRACTICE' : this.game.name;
        screen.setBackgroundColor(playerColors(this.cycleNumber));
        screen.setForegroundColor(0);
        screen.print(((function() {
          var _i, _ref, _results;
          _results = [];
          for (i = _i = 1, _ref = screen.columns; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
            _results.push(' ');
          }
          return _results;
        })()).join(''), 1, screen.rows - 1);
        screen.print("" + name + "  Player: " + this.cycleNumber + "  State: " + this.stateString, 1, screen.rows - 1);
        screen.resetColors();
        if (this.playerCycle.state === 4) {
          screen.setForegroundColor(playerColors(this.cycleNumber));
          screen.print('-- INSERT --', 1, screen.rows);
          return screen.resetColors();
        }
      }
    };

    GameView.property('playerCycle', {
      get: function() {
        var cycle;
        return ((function() {
          var _i, _len, _ref, _results;
          _ref = this._game.cycles;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cycle = _ref[_i];
            if (cycle.number === this.cycleNumber) {
              _results.push(cycle);
            }
          }
          return _results;
        }).call(this)).pop();
      }
    });

    return GameView;

  })();

  module.exports = GameView;

}).call(this);

//# sourceMappingURL=../../../maps/game_view.js.map
