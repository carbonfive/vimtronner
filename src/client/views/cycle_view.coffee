directions = require '../../models/directions'
buffer = require '../buffer'
screen = require '../screen'

Game = require '../../models/game'
Cycle = require '../../models/cycle'

WallView = require './wall_view'

CYCLE_CHAR = []
CYCLE_CHAR[directions.UP] = buffer(0xe2, 0x95, 0xbf)
CYCLE_CHAR[directions.DOWN] = buffer(0xE2, 0x95, 0xBD)
CYCLE_CHAR[directions.LEFT] = buffer(0xE2, 0x95, 0xBE)
CYCLE_CHAR[directions.RIGHT] = buffer(0xE2, 0x95, 0xBC)
CYCLE_EXPLOSION = buffer(0xE2, 0xAC, 0xA4)

class CycleView
  constructor: (cycle, game)->
    @cycle = cycle
    @game = game
    @generateWallViews()

    Object.defineProperty @, 'nameX', get: @_nameX
    Object.defineProperty @, 'nameY', get: @_nameY

  character: ->
    if @cycle.state == Cycle.STATES.EXPLODING
      CYCLE_EXPLOSION
    else
      CYCLE_CHAR[@cycle.direction]

  render: ->
    screen.setForegroundColor @cycle.color

    screen.moveTo(@cycle.x + 1, @cycle.y + 1)
    process.stdout.write @character()

    @renderWallViews()

    if @game.state == Game.STATES.COUNTDOWN
      @renderName()

  generateWallViews: ->
    @wallViews = (new WallView(wall) for wall in @cycle.walls)

  renderWallViews: ->
    wallView.render() for wallView in @wallViews

  renderName: ->
    screen.moveTo(@nameX, @nameY)
    process.stdout.write "Player #{@cycle.number}"

  _nameX: => if @cycle.x > 25 then @cycle.x - 10 else @cycle.x + 5
  _nameY: => @cycle.y + 1

module.exports = CycleView
