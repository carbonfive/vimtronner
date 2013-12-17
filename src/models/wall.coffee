buffer = require '../client/buffer'

WALL_TYPES = {
  EAST_WEST: 0
  NORTH_SOUTH: 1
  SOUTH_WEST: 2
  NORTH_WEST: 3
  NORTH_EAST: 4
  SOUTH_EAST: 5
}

class Wall
  @WALL_TYPES: WALL_TYPES

  constructor: (attributes)->
    @x = attributes.x
    @y = attributes.y
    @type = attributes.type
    @direction = attributes.direction

  toJSON: -> {
    x: @x
    y: @y
    type: @type
    direction: @direction
  }

module.exports = Wall
