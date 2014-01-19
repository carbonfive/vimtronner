(function() {
  var CENTER, LEFT, RIGHT, _ref;

  exports.clear = function() {
    process.stdout.write('\x1b[2J');
    return process.stdout.write('\x1b[H');
  };

  exports.hideCursor = function() {
    return process.stdout.write('\x1b[?25l');
  };

  exports.showCursor = function() {
    return process.stdout.write('\x1b[?25h');
  };

  exports.setForegroundColor = function(color) {
    return process.stdout.write("\x1b[3" + color + "m");
  };

  exports.setBackgroundColor = function(color) {
    return process.stdout.write("\x1b[4" + color + "m");
  };

  exports.moveTo = function(x, y) {
    return process.stdout.write("\x1b[" + y + ";" + x + "f");
  };

  exports.resetColors = function() {
    return process.stdout.write('\x1b[39;49m');
  };

  exports.render = function(buffer) {
    return process.stdout.write(buffer);
  };

  _ref = [0, 1, 2], LEFT = _ref[0], RIGHT = _ref[1], CENTER = _ref[2];

  exports.TEXT_ALIGN = {
    LEFT: LEFT,
    RIGHT: RIGHT,
    CENTER: CENTER
  };

  exports.print = function(string, x, y, alignment) {
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
    exports.moveTo(sx, sy);
    return exports.render(string);
  };

  exports.clearRect = function(x, y, width, height) {
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
      exports.moveTo(x, y + i);
      _results.push(exports.render(row));
    }
    return _results;
  };

  Object.defineProperty(exports, 'columns', {
    get: function() {
      return process.stdout.columns;
    }
  });

  Object.defineProperty(exports, 'rows', {
    get: function() {
      return process.stdout.rows;
    }
  });

  Object.defineProperty(exports, 'center', {
    get: function() {
      return Math.round(this.columns / 2);
    }
  });

  Object.defineProperty(exports, 'maxGridRows', {
    get: function() {
      return process.stdout.rows - 4;
    }
  });

  Object.defineProperty(exports, 'maxGridColumns', {
    get: function() {
      return process.stdout.columns - 2;
    }
  });

  Object.defineProperty(exports, 'maxGridSize', {
    get: function() {
      return Math.min(this.maxGridRows, this.maxGridColumns);
    }
  });

}).call(this);
