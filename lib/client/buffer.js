(function() {
  var buffer;

  buffer = function() {
    var buf, index, _i, _ref, _ref1;
    buf = new Buffer((_ref = arguments.length) != null ? _ref : 0);
    for (index = _i = 0, _ref1 = arguments.length; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; index = 0 <= _ref1 ? ++_i : --_i) {
      buf.writeUInt8(arguments[index], index);
    }
    return buf;
  };

  module.exports = buffer;

}).call(this);
