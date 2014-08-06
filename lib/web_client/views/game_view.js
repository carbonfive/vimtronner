(function() {
  var $, Cycle, CycleView, Game, GameView, pixi, playerColors,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = require('jquery');

  require('../../define_property');

  pixi = require('pixi');

  playerColors = require('./player_colors');

  Game = require('../../models/game');

  Cycle = require('../../models/cycle');

  CycleView = require('./cycle_view');

  GameView = (function() {
    function GameView() {
      this.animate = __bind(this.animate, this);
      this.cycleViews = [];
      this.countString = '';
      this.setStage();
    }

    GameView.property('state', {
      get: function() {
        var _ref;
        return (_ref = this._game) != null ? _ref.state : void 0;
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

    GameView.property('game', {
      set: function(game) {
        this._game = game;
        if (this.state === Game.STATES.COUNTDOWN) {
          if (this._game.count !== this.lastCount && this.state === Game.STATES.COUNTDOWN) {
            this.lastCount = this._game.count;
            this.countString += "" + this._game.count + "...";
          }
        } else {
          delete this.lastCount;
          this.countString = '';
        }
        return this.generateCycleViews();
      },
      get: function() {
        return this._game;
      }
    });

    GameView.prototype.setStage = function() {
      var walls;
      this.stage = new pixi.Stage(0xaaaaaa);
      this.renderer = pixi.autoDetectRenderer(800, 600);
      document.body.appendChild(this.renderer.view);
      requestAnimationFrame(this.animate);
      walls = new pixi.Graphics();
      walls.lineStyle(3, 0x000000, 1);
      walls.drawRect(0, 0, 800, 600);
      return this.stage.addChild(walls);
    };

    GameView.prototype.animate = function() {
      requestAnimationFrame(this.animate);
      return this.renderer.render(this.stage);
    };

    GameView.prototype.render = function() {
      if (this.state === Game.STATES.WAITING || (this.state === Game.STATES.RESTARTING && this.playerCycle.ready)) {
        this.renderWaitScreen();
      } else if (this.state === Game.STATES.COUNTDOWN) {
        this.renderCountdown();
      } else if (this.state === Game.STATES.FINISHED || this.state === Game.STATES.RESTARTING) {
        this.renderFinishScreen();
      } else {
        this.renderArena();
        this.renderCycleViews();
      }
      return this.renderGameInfo();
    };

    GameView.prototype.renderWaitScreen = function() {
      return $('#game-status').html(this.stateString);
    };

    GameView.prototype.renderCountdown = function() {
      return $('#game-status').html(this.countString);
    };

    GameView.prototype.renderFinishScreen = function() {
      return $('#game-status').html(this.stateString);
    };

    GameView.prototype.renderArena = function() {};

    GameView.prototype.generateCycleViews = function() {
      var cycle, _i, _len, _ref, _results;
      _ref = this._game.cycles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cycle = _ref[_i];
        _results.push(this.createOrUpdateCycleView(cycle));
      }
      return _results;
    };

    GameView.prototype.createOrUpdateCycleView = function(cycle) {
      var cycleView;
      cycleView = this.cycleViews.filter(function(view) {
        return view.cycle.number === cycle.number;
      })[0];
      if (cycleView === void 0) {
        cycleView = new CycleView(cycle, this._game);
        this.cycleViews.push(cycleView);
      }
      return cycleView.cycle = cycle;
    };

    GameView.prototype.renderCycleViews = function() {
      var cycle_view, _i, _len, _ref;
      _ref = this.cycleViews;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cycle_view = _ref[_i];
        cycle_view.render(this.stage);
      }
      return true;
    };

    GameView.prototype.renderGameInfo = function() {};

    return GameView;

  })();

  module.exports = GameView;

}).call(this);

//# sourceMappingURL=../../../maps/game_view.js.map
