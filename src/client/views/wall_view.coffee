buffer = require '../buffer'
screen = require '../screen'
Wall = require '../../models/wall'

WALL_CHARACTERS = {}
WALL_CHARACTERS[Wall.WALL_TYPES.EAST_WEST] = buffer(0xE2, 0x94, 0x80)
WALL_CHARACTERS[Wall.WALL_TYPES.NORTH_SOUTH] = buffer(0xE2, 0x94, 0x82)
WALL_CHARACTERS[Wall.WALL_TYPES.SOUTH_WEST] = buffer(0xE2, 0x94, 0x94)
WALL_CHARACTERS[Wall.WALL_TYPES.NORTH_WEST] = buffer(0xE2, 0x94, 0x8C)
WALL_CHARACTERS[Wall.WALL_TYPES.NORTH_EAST] = buffer(0xE2, 0x94, 0x90)
WALL_CHARACTERS[Wall.WALL_TYPES.SOUTH_EAST] = buffer(0xE2, 0x94, 0x98)

class WallView
  constructor: (wall)-> @wall = wall

  character: -> WALL_CHARACTERS[@wall.type]

  render: ->
    screen.moveTo(@wall.x + 1, @wall.y + 1)
    process.stdout.write @character()

module.exports = WallView
