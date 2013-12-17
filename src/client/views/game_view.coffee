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
    if @game.count != @lastCount && @state == Game.STATES.COUNTDOWN
      @lastCount = @game.count
      @countString += "#{@game.count}..."
    @generateCycleViews()

  generateCycleViews: ->
    @cycleViews = (new CycleView(cycle, @game) for cycle in @game.cycles)

  render: ->
    screen.clear()
    if @state == Game.STATES.WAITING
      @renderWaitScreen()
    else if @state == Game.STATES.COUNTDOWN
      @renderCountdown()
    else if @state == Game.STATES.FINISHED
      @renderWinner()
    else
      @renderArena()
      @renderCycleViews()

  renderArena: ->
    screen.setForegroundColor 3
    screen.moveTo(1,1)
    process.stdout.write ARENA_WALL_CHARS.TOP_LEFT_CORNER
    for x in [2..49]
      screen.moveTo x, 1
      process.stdout.write ARENA_WALL_CHARS.HORIZONTAL
    screen.moveTo 50, 1
    process.stdout.write ARENA_WALL_CHARS.TOP_RIGHT_CORNER
    for y in [2..49]
      screen.moveTo 50, y
      process.stdout.write ARENA_WALL_CHARS.VERTICAL
    screen.moveTo 50, 50
    process.stdout.write ARENA_WALL_CHARS.BOTTOM_RIGHT_CORNER
    for x in [49..2]
      screen.moveTo x, 50
      process.stdout.write ARENA_WALL_CHARS.HORIZONTAL
    screen.moveTo 1, 50
    process.stdout.write ARENA_WALL_CHARS.BOTTOM_LEFT_CORNER
    for y in [49..2]
      screen.moveTo 1, y
      process.stdout.write ARENA_WALL_CHARS.VERTICAL

  renderWaitScreen: ->
    @renderArena()
    screen.setForegroundColor 3
    screen.moveTo(12,25)
    process.stdout.write 'Player 1 waiting...'

  renderCountdown: ->
    @renderArena()
    @renderCycleViews()
    @renderCount()

  renderWinner: ->
    @renderArena()
    @renderCycleViews()
    @renderWinnerMessage()

  renderWinnerMessage: ->
    messageX = @cycleViews[0].cycle.x - 1
    messageY = @cycleViews[0].cycle.y
    screen.moveTo(messageX, messageY)
    process.stdout.write "Winner!!!"

  renderCount: ->
    screen.setForegroundColor 3
    screen.moveTo(20,25)
    process.stdout.write @countString

  renderCycleViews: ->
    cycleView.render() for cycleView in @cycleViews

module.exports = GameView
