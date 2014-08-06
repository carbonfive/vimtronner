Wall = require '../../models/wall'

WALL_CHARACTERS = {}

class WallView
  constructor: (wall)->
    @wall = wall

  character: -> WALL_CHARACTERS[@wall.type]

  render: ->
    nextX = (@wall.x) + 1
    #screen.moveTo(nextX, @wall.y + 1)
    #process.stdout.write @character()

module.exports = WallView
