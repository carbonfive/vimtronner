require '../../define_property'
pixi = require 'pixi'

directions = require '../../models/directions'
playerColors = require './player_colors'
CONSTANTS = require './constants'
Game = require '../../models/game'
Cycle = require '../../models/cycle'

WallView = require './wall_view'

CYCLE_CHAR = {}

class CycleView
  @CYCLE_CHARS: CYCLE_CHAR

  constructor: (cycle, game)->
    @cycle = cycle
    @game = game
    @generateWallViews()

    Object.defineProperty @, 'nameX', get: @_nameX
    Object.defineProperty @, 'nameY', get: @_nameY

  character: ->
    if @cycle.state == Cycle.STATES.EXPLODING
      explosionIndex = @cycle.explosionFrame % 3
      CYCLE_EXPLOSION[explosionIndex]
    else if @cycle.state == Cycle.STATES.DEAD
      CYCLE_EXPLODED
    else
      CYCLE_CHAR[@cycle.direction]

  nextX: ->
    (@cycle.x + 1) * CONSTANTS.DIMENSION_SCALE

  nextY: ->
    (@cycle.y + 1) * CONSTANTS.DIMENSION_SCALE

  createCycleCharacter: ->
    @cycleCharacter = new pixi.Graphics()
    cycle_color = playerColors(@cycle.number)['web']
    @cycleCharacter.lineStyle(2, cycle_color)
    @cycleCharacter.drawCircle(0, 0, 5)

  render: (stage) ->
    @createCycleCharacter() if @cycleCharacter == undefined
    @cycleCharacter.position.x = @nextX()
    @cycleCharacter.position.y = @nextY()
    stage.addChild(@cycleCharacter) unless stage.children.indexOf(@cycleCharacter) > 0
    #@renderWallViews()

  generateWallViews: ->
    @wallViews = (new WallView(wall) for wall in @cycle.walls)

  renderWallViews: ->
    wallView.render() for wallView in @wallViews

  renderName: ->
    #screen.moveTo(@nameX, @nameY)
    #process.stdout.write "Player #{@cycle.number}"

  @property 'nameX', =>
    #screenX = @cycle.x
    #if @cycle.x > 25 then screenX - 10 else screenX + 5

  @property 'nameY', => @cycle.y + 1

  renderWinnerMessage: ->
    messageX = @cycle.x - 1
    messageY = @cycle.y
    #screen.moveTo(messageX, messageY)
    #process.stdout.write "Winner!!!"

module.exports = CycleView
