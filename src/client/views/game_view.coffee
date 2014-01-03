screen = require '../screen'
buffer = require '../buffer'
Game = require '../../models/game'
CycleView = require './cycle_view'

ARENA_WALL_CHARS = {
  HORIZONTAL: buffer(0xE2, 0x95, 0x90)
  VERTICAL: buffer(0xE2, 0x95, 0x91)
  TOP_LEFT_CORNER: buffer(0xE2, 0x95, 0x94)
  TOP_RIGHT_CORNER: buffer(0xE2, 0x95, 0x97)
  BOTTOM_LEFT_CORNER: buffer(0xE2, 0x95, 0x9A)
  BOTTOM_RIGHT_CORNER: buffer(0xE2, 0x95, 0x9D)
}

class GameView

  constructor: ->
    @cycleViews = []
    @countString = ''

    Object.defineProperty @, 'state', get: @_state

  _state: => @game?.state

  setGame: (game)->
    @game = game
    @startX = Math.round(screen.center() - (@game.gridSize/2))
    if @game.count != @lastCount && @state == Game.STATES.COUNTDOWN
      @lastCount = @game.count
      @countString += "#{@game.count}..."
    @generateCycleViews()

  generateCycleViews: ->
    @cycleViews = (new CycleView(cycle, @game, @startX) for cycle in @game.cycles)

  render: ->
    screen.clear()
    if @state == Game.STATES.WAITING
      @renderWaitScreen()
    else if @state == Game.STATES.COUNTDOWN
      @renderCountdown()
    else if @state == Game.STATES.FINISHED
      @countString = ""
      @renderChoices()
    else
      @renderArena()
      @renderCycleViews()

  renderChoices: ->
    @renderArena()
    @renderCycleViews()
    screen.setForegroundColor 3
    countX = @startX + 20
    screen.moveTo(countX,25)
    process.stdout.write 'Press ENTER to play again.'

  renderArena: ->
    screen.setForegroundColor 3
    xRange = @game.gridSize - 2
    yRange = @game.gridSize - 1
    endX = @startX + @game.gridSize
    endY = @game.gridSize
    screen.moveTo(@startX,1)
    process.stdout.write ARENA_WALL_CHARS.TOP_LEFT_CORNER
    for x in [1..xRange]
      screen.moveTo (@startX + x), 1
      process.stdout.write ARENA_WALL_CHARS.HORIZONTAL
    screen.moveTo endX, 1
    process.stdout.write ARENA_WALL_CHARS.TOP_RIGHT_CORNER
    for y in [2..yRange]
      screen.moveTo endX, y
      process.stdout.write ARENA_WALL_CHARS.VERTICAL
    screen.moveTo endX, endY
    process.stdout.write ARENA_WALL_CHARS.BOTTOM_RIGHT_CORNER
    for x in [xRange..1]
      screen.moveTo (@startX + x), endY
      process.stdout.write ARENA_WALL_CHARS.HORIZONTAL
    screen.moveTo @startX, endY
    process.stdout.write ARENA_WALL_CHARS.BOTTOM_LEFT_CORNER
    for y in [yRange..2]
      screen.moveTo @startX, y
      process.stdout.write ARENA_WALL_CHARS.VERTICAL

  renderWaitScreen: ->
    @renderArena()
    screen.setForegroundColor 3
    messageX = @startX + 12
    screen.moveTo(messageX, 25)
    process.stdout.write 'Waiting for other players...'

  renderCountdown: ->
    @renderArena()
    @renderCycleViews()
    @renderCount()

  renderCount: ->
    screen.setForegroundColor 3
    countX = @startX + 20
    screen.moveTo(countX,25)
    process.stdout.write @countString

  renderCycleViews: ->
    cycleView.render() for cycleView in @cycleViews

module.exports = GameView
