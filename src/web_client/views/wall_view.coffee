pixi = require 'pixi'
CONSTANTS = require './constants'
Wall = require '../../models/wall'

class WallView
  constructor: (@wall, @color)->

  wallX: ->
    (@wall.x + 1) * CONSTANTS.DIMENSION_SCALE

  wallY: ->
    (@wall.y + 1) * CONSTANTS.DIMENSION_SCALE

  render: (stage) ->
    @createWallCharacter(stage) if @wallCharacter == undefined

  createWallCharacter: (stage) ->
    @wallCharacter = new pixi.Graphics()
    @wallCharacter.lineStyle(2, @color)
    @wallCharacter.drawRect(0, 0, 2, 2)
    @wallCharacter.position.x = @wallX()
    @wallCharacter.position.y = @wallY()
    stage.addChild(@wallCharacter) unless stage.children.indexOf(@wallCharacter) > 0

module.exports = WallView
