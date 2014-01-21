(function() {
  var WALL_TYPES, Wall, buffer;

  buffer = require('../client/buffer');

  WALL_TYPES = {
    EAST_WEST: 0,
    NORTH_SOUTH: 1,
    SOUTH_WEST: 2,
    NORTH_WEST: 3,
    NORTH_EAST: 4,
    SOUTH_EAST: 5
  };

  Wall = (function() {
    Wall.WALL_TYPES = WALL_TYPES;

    function Wall(attributes) {
      this.x = attributes.x;
      this.y = attributes.y;
      this.type = attributes.type;
      this.direction = attributes.direction;
    }

    Wall.prototype.toJSON = function() {
      return {
        x: this.x,
        y: this.y,
        type: this.type,
        direction: this.direction
      };
    };

    return Wall;

  })();

  module.exports = Wall;

}).call(this);

//# sourceMappingURL=../../maps/wall.js.map
