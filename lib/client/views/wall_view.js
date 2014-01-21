(function() {
  var WALL_CHARACTERS, Wall, WallView, buffer, screen;

  buffer = require('../buffer');

  screen = require('../screen');

  Wall = require('../../models/wall');

  WALL_CHARACTERS = {};

  WALL_CHARACTERS[Wall.WALL_TYPES.EAST_WEST] = buffer(0xE2, 0x94, 0x80);

  WALL_CHARACTERS[Wall.WALL_TYPES.NORTH_SOUTH] = buffer(0xE2, 0x94, 0x82);

  WALL_CHARACTERS[Wall.WALL_TYPES.SOUTH_WEST] = buffer(0xE2, 0x94, 0x94);

  WALL_CHARACTERS[Wall.WALL_TYPES.NORTH_WEST] = buffer(0xE2, 0x94, 0x8C);

  WALL_CHARACTERS[Wall.WALL_TYPES.NORTH_EAST] = buffer(0xE2, 0x94, 0x90);

  WALL_CHARACTERS[Wall.WALL_TYPES.SOUTH_EAST] = buffer(0xE2, 0x94, 0x98);

  WallView = (function() {
    function WallView(wall) {
      this.wall = wall;
    }

    WallView.prototype.character = function() {
      return WALL_CHARACTERS[this.wall.type];
    };

    WallView.prototype.render = function() {
      var nextX;
      nextX = this.wall.x + 1;
      screen.moveTo(nextX, this.wall.y + 1);
      return process.stdout.write(this.character());
    };

    return WallView;

  })();

  module.exports = WallView;

}).call(this);

//# sourceMappingURL=../../../maps/wall_view.js.map
