(function() {
  var directions;

  directions = require('./directions');

  module.exports = [
    {
      number: 1,
      direction: directions.RIGHT,
      color: 6
    }, {
      number: 2,
      direction: directions.LEFT,
      color: 1
    }, {
      number: 3,
      direction: directions.UP,
      color: 3
    }, {
      number: 4,
      direction: directions.DOWN,
      color: 4
    }, {
      number: 5,
      direction: directions.DOWN,
      color: 7
    }, {
      number: 6,
      direction: directions.UP,
      color: 2
    }
  ];

}).call(this);

//# sourceMappingURL=../../maps/player_attributes.js.map
