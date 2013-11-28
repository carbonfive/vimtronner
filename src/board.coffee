screen = require './screen'
buffer = require './buffer'
Cycle = require './cycle'

ARENA_WALL_CHARS = {
  HORIZONTAL: buffer(0xE2, 0x95, 0x90)
  VERTICAL: buffer(0xE2, 0x95, 0x91)
  TOP_LEFT_CORNER: buffer(0xE2, 0x95, 0x94)
  TOP_RIGHT_CORNER: buffer(0xE2, 0x95, 0x97)
  BOTTOM_LEFT_CORNER: buffer(0xE2, 0x95, 0x9A)
  BOTTOM_RIGHT_CORNER: buffer(0xE2, 0x95, 0x9D)
}

class Board
  @STATES: {
    WAITING: 0
    COUNTDOWN: 1
    STARTED: 2
    FINISHED: 3
  }

  constructor: ->
    @cycles = []
    @state = Board.STATES.WAITING
    @countString = ''

  loadState: (gameState)->
    @state = gameState.state
    if gameState.count != @lastCount && @state == Board.STATES.COUNTDOWN
      @lastCount = gameState.count
      @countString += "#{gameState.count}..."
    @setCycles(gameState.cycles)

  setCycles: (cycles) ->
    @cycles.length = 0
    for cycle in cycles
      @cycles.push new Cycle(cycle)

  render: ->
    screen.clear()
    if @state == Board.STATES.WAITING
      @renderWaitScreen()
    else if @state == Board.STATES.COUNTDOWN
      @renderCountdown()
    else if @state == Board.STATES.FINISHED
      @renderWinner()
    else
      @renderArena()
      @renderWalls()
      @renderCycles()

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
    @renderCycles()
    @renderPlayerNames()
    @renderCount()

  renderPlayerNames: ->
    for cycle, index in @cycles
      screen.setForegroundColor cycle.color
      [nameX, nameY] = @namePlacement(cycle)
      screen.moveTo(nameX, nameY)
      process.stdout.write "Player #{index + 1}"

  renderWinner: ->
    @renderArena()
    @renderCycles()
    @renderWinnerMessage()

  renderWinnerMessage: ->
    messageX = @cycles[0].x - 1
    messageY = @cycles[0].y
    screen.moveTo(messageX, messageY)
    process.stdout.write "Winner!!!"

  namePlacement: (cycle) ->
    if cycle.x > 25
      nameX = cycle.x - 10
    else
      nameX = cycle.x + 5
    nameY = cycle.y + 1
    [nameX, nameY]

  renderCount: ->
    screen.setForegroundColor 3
    screen.moveTo(20,25)
    process.stdout.write @countString

  renderWalls: ->
    for cycle in @cycles
      screen.setForegroundColor cycle.color
      for wall in cycle.walls
        screen.moveTo(wall.x + 1, wall.y + 1)
        process.stdout.write wall.character()

  renderCycles: ->
    for cycle in @cycles
      screen.setForegroundColor cycle.color
      screen.moveTo(cycle.x + 1, cycle.y + 1)
      process.stdout.write cycle.character()

module.exports = Board
