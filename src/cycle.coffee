directions = require './directions'

class Cycle
  constructor: (x, y, direction, color)->
    @x = x
    @y = y
    @direction = direction
    @color = color

  turnLeft: -> @direction = directions.LEFT unless @direction is directions.RIGHT
  turnRight: -> @direction = directions.RIGHT unless @direction is directions.LEFT
  turnUp: -> @direction = directions.UP unless @direction is directions.DOWN
  turnDown: -> @direction = directions.DOWN unless @direction is directions.UP

module.exports = Cycle
