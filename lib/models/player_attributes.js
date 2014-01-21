(function() {
  var directions;

  directions = require('./directions');

  module.exports = [
    {
      number: 1,
      direction: directions.RIGHT,
      color: 7,
      walls: []
    }, {
      number: 2,
      direction: directions.LEFT,
      color: 2,
      walls: []
    }, {
      number: 3,
      direction: directions.UP,
      color: 3,
      walls: []
    }, {
      number: 4,
      direction: directions.DOWN,
      color: 5,
      walls: []
    }, {
      number: 5,
      direction: directions.DOWN,
      color: 6,
      walls: []
    }, {
      number: 6,
      direction: directions.UP,
      color: 7,
      walls: []
    }, {
      number: 7,
      direction: directions.RIGHT,
      color: 4,
      walls: []
    }, {
      number: 8,
      direction: directions.LEFT,
      color: 1,
      walls: []
    }
  ];

}).call(this);

//# sourceMappingURL=../../maps/player_attributes.js.map
