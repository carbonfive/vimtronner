(function() {
  var directions;

  directions = require('./directions');

  module.exports = [
    {
      number: 1,
      direction: directions.RIGHT,
      color: 7
    }, {
      number: 2,
      direction: directions.LEFT,
      color: 2
    }, {
      number: 3,
      direction: directions.UP,
      color: 3
    }, {
      number: 4,
      direction: directions.DOWN,
      color: 5
    }, {
      number: 5,
      direction: directions.DOWN,
      color: 6
    }, {
      number: 6,
      direction: directions.UP,
      color: 7
    }, {
      number: 7,
      direction: directions.RIGHT,
      color: 4
    }, {
      number: 8,
      direction: directions.LEFT,
      color: 1
    }
  ];

}).call(this);

//# sourceMappingURL=../../maps/player_attributes.js.map
