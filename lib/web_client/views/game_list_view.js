(function() {
  var $, Game, GameListView;

  Game = require('../../models/game');

  $ = require('jquery');

  GameListView = (function() {
    function GameListView() {}

    GameListView.prototype.addGames = function(games) {
      return this.activeGames = games;
    };

    GameListView.prototype.render = function() {
      var game, _i, _len, _ref, _results;
      _ref = this.activeGames;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        game = _ref[_i];
        _results.push($('#game-list').append("<li class='waiting-game'>" + game.name + " <a href='#' data-name='" + game.name + "'>join</a></li>"));
      }
      return _results;
    };

    return GameListView;

  })();

  module.exports = GameListView;

}).call(this);

//# sourceMappingURL=../../../maps/game_list_view.js.map
