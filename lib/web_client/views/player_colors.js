(function() {
  var colors;

  colors = {
    1: {
      'cli': 6,
      'web': 0x49ffff
    },
    2: {
      'cli': 1,
      'web': 0xff0000
    },
    3: {
      'cli': 3,
      'web': 0xffff00
    },
    4: {
      'cli': 4,
      'web': 0x0000ff
    },
    5: {
      'cli': 7,
      'web': 0xffffff
    },
    6: {
      'cli': 2,
      'web': 0x4fff00
    }
  };

  module.exports = function(cycleNumber) {
    return colors[cycleNumber];
  };

}).call(this);

//# sourceMappingURL=../../../maps/player_colors.js.map
