(function() {
  var CENTER, LEFT, RIGHT, transform, transformationStack, _ref,
    __slice = [].slice;

  transformationStack = [
    {
      x: 0,
      y: 0
    }
  ];

  Object.defineProperty(module.exports, 'transformationStackTail', {
    get: function() {
      var rest, tail, _i;
      rest = 2 <= transformationStack.length ? __slice.call(transformationStack, 0, _i = transformationStack.length - 1) : (_i = 0, []), tail = transformationStack[_i++];
      return tail;
    }
  });

  transform = function(x, y) {
    return transformationStack.reduce((function(point, transform) {
      return {
        x: point.x + transform.x,
        y: point.y + transform.y
      };
    }), {
      x: x,
      y: y
    });
  };

  module.exports.save = function() {
    return transformationStack.push({
      x: 0,
      y: 0
    });
  };

  module.exports.restore = function() {
    if (transformationStack.length > 1) {
      return transformationStack.pop();
    }
  };

  module.exports.transform = function(x, y) {
    module.exports.transformationStackTail.x = x;
    return module.exports.transformationStackTail.y = y;
  };

  module.exports.clear = function() {
    process.stdout.write('\x1b[2J');
    return process.stdout.write('\x1b[H');
  };

  module.exports.hideCursor = function() {
    return process.stdout.write('\x1b[?25l');
  };

  module.exports.showCursor = function() {
    return process.stdout.write('\x1b[?25h');
  };

  module.exports.setForegroundColor = function(color) {
    return process.stdout.write("\x1b[3" + color + "m");
  };

  module.exports.setBackgroundColor = function(color) {
    return process.stdout.write("\x1b[4" + color + "m");
  };

  module.exports.moveTo = function(x, y) {
    var _ref;
    _ref = transform(x, y), x = _ref.x, y = _ref.y;
    return process.stdout.write("\x1b[" + y + ";" + x + "f");
  };

  module.exports.resetColors = function() {
    return process.stdout.write('\x1b[39;49m');
  };

  module.exports.resetAll = function() {
    return process.stdout.write('\x1b[0m');
  };

  module.exports.render = function(buffer) {
    return process.stdout.write(buffer);
  };

  _ref = [0, 1, 2], LEFT = _ref[0], RIGHT = _ref[1], CENTER = _ref[2];

  module.exports.TEXT_ALIGN = {
    LEFT: LEFT,
    RIGHT: RIGHT,
    CENTER: CENTER
  };

  module.exports.print = function(string, x, y, alignment) {
    var sx, sy, _ref1;
    if (alignment == null) {
      alignment = LEFT;
    }
    _ref1 = (function() {
      switch (alignment) {
        case LEFT:
          return [x, y];
        case RIGHT:
          return [x - string.length + 1, y];
        case CENTER:
          return [x - Math.round(string.length / 2), y];
      }
    })(), sx = _ref1[0], sy = _ref1[1];
    module.exports.moveTo(sx, sy);
    return module.exports.render(string);
  };

  module.exports.clearRect = function(x, y, width, height) {
    var i, row, _i, _results;
    row = ((function() {
      var _i, _results;
      _results = [];
      for (i = _i = 1; 1 <= width ? _i <= width : _i >= width; i = 1 <= width ? ++_i : --_i) {
        _results.push(' ');
      }
      return _results;
    })()).join('');
    _results = [];
    for (i = _i = 0; 0 <= height ? _i < height : _i > height; i = 0 <= height ? ++_i : --_i) {
      module.exports.moveTo(x, y + i);
      _results.push(module.exports.render(row));
    }
    return _results;
  };

  Object.defineProperty(module.exports, 'columns', {
    get: function() {
      return process.stdout.columns;
    }
  });

  Object.defineProperty(module.exports, 'rows', {
    get: function() {
      return process.stdout.rows;
    }
  });

  Object.defineProperty(module.exports, 'center', {
    get: function() {
      return {
        x: Math.round(this.columns / 2),
        y: Math.round(this.rows / 2)
      };
    }
  });

  Object.defineProperty(module.exports, 'maxGridRows', {
    get: function() {
      return process.stdout.rows - 2;
    }
  });

  Object.defineProperty(module.exports, 'maxGridColumns', {
    get: function() {
      return process.stdout.columns;
    }
  });

  Object.defineProperty(module.exports, 'maxGridSize', {
    get: function() {
      return Math.min(this.maxGridRows, this.maxGridColumns);
    }
  });

}).call(this);

//# sourceMappingURL=../../maps/screen.js.map
