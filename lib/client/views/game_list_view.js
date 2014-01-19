(function() {
  var Game, GameListView;

  Game = require('../../models/game');

  GameListView = (function() {
    function GameListView() {}

    GameListView.prototype.addGames = function(games) {
      return this.activeGames = games;
    };

    GameListView.prototype.render = function() {
      this.renderHeader();
      this.renderGames();
      return this.renderFooter();
    };

    GameListView.prototype.renderHeader = function() {
      console.log("** V I M T R O N N E R **");
      console.log("Current Games:");
      return console.log("-----");
    };

    GameListView.prototype.renderGames = function() {
      var game, state, _i, _len, _ref, _results;
      _ref = this.activeGames;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        game = _ref[_i];
        console.log("Name: " + game.name);
        state = this.translateState(game.state);
        console.log("Status: " + state);
        console.log("" + game.cycles.length + " cycle(s) joined (" + game.numberOfPlayers + " needed)");
        _results.push(console.log("-----"));
      }
      return _results;
    };

    GameListView.prototype.renderFooter = function() {
      console.log("*************************");
      return console.log("Run 'vimtronner -C -G <game name>' to join.");
    };

    GameListView.prototype.translateState = function(stateNumber) {
      switch (stateNumber) {
        case Game.STATES.WAITING:
          return 'Waiting';
        case Game.STATES.COUNTDOWN:
          return 'Countdown';
        case Game.STATES.STARTED:
          return 'Started';
        case Game.STATES.FINISHED:
          return 'Finished';
      }
    };

    return GameListView;

  })();

  module.exports = GameListView;

}).call(this);
