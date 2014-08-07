(function() {
  var CONSTANTS, Wall, WallView, pixi;

  pixi = require('pixi');

  CONSTANTS = require('./constants');

  Wall = require('../../models/wall');

  WallView = (function() {
    function WallView(wall, color) {
      this.wall = wall;
      this.color = color;
    }

    WallView.prototype.wallX = function() {
      return (this.wall.x + 1) * CONSTANTS.DIMENSION_SCALE;
    };

    WallView.prototype.wallY = function() {
      return (this.wall.y + 1) * CONSTANTS.DIMENSION_SCALE;
    };

    WallView.prototype.render = function(stage) {
      if (this.wallCharacter === void 0) {
        return this.createWallCharacter(stage);
      }
    };

    WallView.prototype.createWallCharacter = function(stage) {
      this.wallCharacter = new pixi.Graphics();
      this.wallCharacter.lineStyle(2, this.color);
      this.wallCharacter.drawRect(0, 0, 2, 2);
      this.wallCharacter.position.x = this.wallX();
      this.wallCharacter.position.y = this.wallY();
      if (!(stage.children.indexOf(this.wallCharacter) > 0)) {
        return stage.addChild(this.wallCharacter);
      }
    };

    return WallView;

  })();

  module.exports = WallView;

}).call(this);

//# sourceMappingURL=../../../maps/wall_view.js.map
