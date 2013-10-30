buffer = ->
  buf = new Buffer(arguments.length ? 0)
  buf.writeUInt8(arguments[index], index) for index in [0...arguments.length]
  buf

module.exports = buffer
