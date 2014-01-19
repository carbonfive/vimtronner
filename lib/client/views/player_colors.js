(function() {
  var colors;

  colors = {
    1: 7,
    2: 2,
    3: 3,
    4: 5,
    5: 6,
    6: 7,
    7: 4,
    8: 1
  };

  module.exports = function(cycleNumber) {
    return colors[cycleNumber];
  };

}).call(this);
