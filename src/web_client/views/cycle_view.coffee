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

  constructor: (game)->
    @game = game
    @wallViews = []

    Object.defineProperty @, 'nameX', get: @_nameX
    Object.defineProperty @, 'nameY', get: @_nameY

  @property 'cycle', {
    set: (cycle)->
      @_cycle = cycle
      @generateWallViews()
    get: -> @_cycle
  }

  character: ->
    if @_cycle.state == Cycle.STATES.EXPLODING
      explosionIndex = @_cycle.explosionFrame % 3
      CYCLE_EXPLOSION[explosionIndex]
    else if @_cycle.state == Cycle.STATES.DEAD
      CYCLE_EXPLODED
    else
      CYCLE_CHAR[@_cycle.direction]

  nextX: ->
    (@_cycle.x + 1) * CONSTANTS.DIMENSION_SCALE

  nextY: ->
    (@_cycle.y + 1) * CONSTANTS.DIMENSION_SCALE

  createCycleCharacter: ->
    @cycleCharacter = new pixi.Graphics()
    @cycle_color = playerColors(@_cycle.number)['web']
    @cycleCharacter.lineStyle(2, @cycle_color)
    @cycleCharacter.drawCircle(0, 0, 5)

  render: (stage) ->
    @createCycleCharacter() if @cycleCharacter == undefined
    @cycleCharacter.position.x = @nextX()
    @cycleCharacter.position.y = @nextY()
    stage.addChild(@cycleCharacter) unless stage.children.indexOf(@cycleCharacter) > 0
    @renderWallViews(stage)

  generateWallViews: ->
    @createNewWallViews(wall) for wall in @_cycle.walls

  createNewWallViews: (wall) ->
    wallView = @wallViews.filter((view) ->
      view.wall == wall
    )[0]

    if wallView == undefined
      wallView = new WallView(wall, @cycle_color)
      @wallViews.push wallView
      wallView.wall = wall


  renderWallViews: (stage) ->
    wallView.render(stage) for wallView in @wallViews

  renderName: ->
    #screen.moveTo(@nameX, @nameY)
    #process.stdout.write "Player #{@cycle.number}"

  @property 'nameX', =>
    #screenX = @cycle.x
    #if @cycle.x > 25 then screenX - 10 else screenX + 5

  @property 'nameY', => @_cycle.y + 1

  renderWinnerMessage: ->
    messageX = @_cycle.x - 1
    messageY = @_cycle.y
    #screen.moveTo(messageX, messageY)
    #process.stdout.write "Winner!!!"

module.exports = CycleView
