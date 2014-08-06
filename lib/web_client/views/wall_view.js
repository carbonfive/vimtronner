(function() {
  var WALL_CHARACTERS, Wall, WallView;

  Wall = require('../../models/wall');

  WALL_CHARACTERS = {};

  WallView = (function() {
    function WallView(wall) {
      this.wall = wall;
    }

    WallView.prototype.character = function() {
      return WALL_CHARACTERS[this.wall.type];
    };

    WallView.prototype.render = function() {
      var nextX;
      return nextX = this.wall.x + 1;
    };

    return WallView;

  })();

  module.exports = WallView;

}).call(this);

//# sourceMappingURL=../../../maps/wall_view.js.map
