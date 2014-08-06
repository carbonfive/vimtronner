require '../../define_property'

screen = require '../screen'
buffer = require '../buffer'
Game = require '../../models/game'
Cycle = require '../../models/cycle'
CycleView = require './cycle_view'
playerColors = require './player_colors'

ARENA_WALL_CHARS = {
  HORIZONTAL: buffer(0xE2, 0x95, 0x90)
  VERTICAL: buffer(0xE2, 0x95, 0x91)
  TOP_LEFT_CORNER: buffer(0xE2, 0x95, 0x94)
  TOP_RIGHT_CORNER: buffer(0xE2, 0x95, 0x97)
  BOTTOM_LEFT_CORNER: buffer(0xE2, 0x95, 0x9A)
  BOTTOM_RIGHT_CORNER: buffer(0xE2, 0x95, 0x9D)
}

CYCLE_NUMBER_NAMES = {
  1: 'ONE'
  2: 'TWO'
  3: 'THREE'
  4: 'FOUR'
  5: 'FIVE'
  6: 'SIX'
  7: 'SEVEN'
  8: 'EIGHT'
}

cycleNumberName = (cycleNumber)-> CYCLE_NUMBER_NAMES[cycleNumber]

class GameView

  constructor: ->
    @cycleViews = []
    @countString = ''

  @property 'state', get: -> @_game?.state
  @property 'game', {
    set: (game)->
      @_game = game
      if @state == Game.STATES.COUNTDOWN
        if @_game.count != @lastCount and @state == Game.STATES.COUNTDOWN
          @lastCount = @_game.count
          @countString += "#{@_game.count}..."
      else
        delete @lastCount
        @countString = ''
      @generateCycleViews()
    get: -> @_game
  }
  @property 'stateString', get: ->
    switch @_game?.state
      when Game.STATES.WAITING then 'Waiting for other players'
      when Game.STATES.COUNTDOWN then 'Get ready'
      when Game.STATES.STARTED then 'Go'
      when Game.STATES.FINISHED then 'Game over'
  @property 'startX', get: ->
    Math.round(screen.center.x - (@_game.width/2))
  @property 'startY', get: ->
    Math.round(screen.center.y - 2 - (@_game.height/2))


  generateCycleViews: ->
    @cycleViews = (new CycleView(cycle, @_game) for cycle in @_game.cycles)

  render: ->
    screen.clear()
    screen.hideCursor()
    screen.save()
    screen.transform(@startX, @startY)
    if @state == Game.STATES.WAITING or (@state == Game.STATES.RESTARTING and @playerCycle.ready)
      @renderWaitScreen()
    else if @state == Game.STATES.COUNTDOWN
      @renderCountdown()
    else if @state == Game.STATES.FINISHED or @state == Game.STATES.RESTARTING
      @renderFinishScreen()
    else
      @renderArena()
      @renderCycleViews()
    screen.restore()
    @renderGameInfo()

  renderArena: ->
    screen.setForegroundColor 3
    xRange = @game.width - 1
    yRange = @game.height - 1
    endX = @game.width
    endY = @game.height
    screen.moveTo(1,1)
    screen.render ARENA_WALL_CHARS.TOP_LEFT_CORNER
    for x in [2..xRange]
      screen.moveTo (x), 1
      screen.render ARENA_WALL_CHARS.HORIZONTAL
    screen.moveTo endX, 1
    screen.render ARENA_WALL_CHARS.TOP_RIGHT_CORNER
    for y in [2..yRange]
      screen.moveTo endX, y
      screen.render ARENA_WALL_CHARS.VERTICAL
    screen.moveTo endX, endY
    screen.render ARENA_WALL_CHARS.BOTTOM_RIGHT_CORNER
    for x in [xRange..1]
      screen.moveTo x, endY
      screen.render ARENA_WALL_CHARS.HORIZONTAL
    screen.moveTo 1, endY
    screen.render ARENA_WALL_CHARS.BOTTOM_LEFT_CORNER
    for y in [yRange..2]
      screen.moveTo 1, y
      screen.render ARENA_WALL_CHARS.VERTICAL

  renderWaitScreen: ->
    @renderArena()
    instructions = [
      'left...................h'
      'down...................j'
      'up.....................k'
      'right..................l'
      'insert mode............i'
      'normal mode...esc/ctrl-['
    ]
    centerX = Math.round(@game.width/2)
    y = Math.round(@game.height/2) - 10
    screen.setForegroundColor 6
    screen.print('vimTronner', centerX, y, screen.TEXT_ALIGN.CENTER)
    y += 2
    screen.resetColors()
    screen.print(instructions[i], centerX, y++, screen.TEXT_ALIGN.CENTER) for i in [0...instructions.length]
    y += 1
    screen.print("YOU CAN ONLY BUILD WALLS WHEN INSERT MODE IS ON", centerX, y++, screen.TEXT_ALIGN.CENTER)
    screen.print("YOU CANNOT CHANGE DIRECTION WHEN INSERT MODE IS ON", centerX, y++, screen.TEXT_ALIGN.CENTER)
    screen.setForegroundColor playerColors(@cycleNumber)['cli']
    screen.print("YOUR COLOR IS:", centerX, ++y, screen.TEXT_ALIGN.CENTER)
    y++
    screen.setBackgroundColor playerColors(@cycleNumber)['cli']
    screen.print("              ", centerX, y, screen.TEXT_ALIGN.CENTER)
    screen.resetColors()
    screen.setForegroundColor playerColors(@cycleNumber)['cli']
    y += 2
    if @playerCycle.ready
      screen.print("READY PLAYER #{cycleNumberName(@cycleNumber)}", centerX, y++, screen.TEXT_ALIGN.CENTER)
      n = @game.numberOfPlayers - @numberOfReadyPlayers
      screen.print("WAITING FOR #{n} PLAYER#{if n > 1 then 'S' else ''}", centerX, y++, screen.TEXT_ALIGN.CENTER)
    else
      screen.print("YOU ARE PLAYER #{cycleNumberName(@cycleNumber)}", centerX, y++, screen.TEXT_ALIGN.CENTER)
      action = if @game.isPractice
        "START PRACTICE GAME"
      else
        "WHEN YOU ARE READY"
      screen.print("ENTER INSERT MODE TO #{action}", centerX, y++, screen.TEXT_ALIGN.CENTER)

    screen.resetColors()

  renderCountdown: ->
    @renderArena()
    @renderCycleViews()
    @renderCount()

  renderCount: ->
    screen.setForegroundColor 3
    countX = Math.round(@game.width/2)
    screen.print @countString, countX, Math.round(@game.height/2), screen.TEXT_ALIGN.CENTER

  renderCycleViews: ->
    cycleView.render() for cycleView in @cycleViews

  renderFinishScreen: ->
    @renderArena()

    centerX = Math.round(@game.width/2)
    y = Math.round(@game.height/2) - 3

    screen.print 'GAME OVER', centerX, y, screen.TEXT_ALIGN.CENTER

    y +=2
    screen.setForegroundColor playerColors(@cycleNumber)['cli']
    if @game.isPractice
      screen.print 'READY FOR A REAL GAME?', centerX, y, screen.TEXT_ALIGN.CENTER
    else
      if @playerCycle.state == Cycle.STATES.WINNER
        screen.print 'YOU WON!!!', centerX, y, screen.TEXT_ALIGN.CENTER
      else
        screen.print 'YOU LOST!!!', centerX, y, screen.TEXT_ALIGN.CENTER

    screen.resetColors()
    y += 2
    screen.print "ENTER INSERT MODE", centerX, y, screen.TEXT_ALIGN.CENTER
    screen.print "FOR REMATCH", centerX, y + 1, screen.TEXT_ALIGN.CENTER
    screen.resetColors()


  renderGameInfo: ->
    if @game.name? and @cycleNumber?
      name = if @game.isPractice then 'PRACTICE' else @game.name
      screen.setBackgroundColor playerColors(@cycleNumber)['cli']
      screen.setForegroundColor 0
      screen.print((' ' for i in [1..screen.columns]).join(''), 1, screen.rows - 1)
      screen.print("#{name}  Player: #{@cycleNumber}  State: #{@stateString}", 1, screen.rows - 1)
      screen.resetColors()
      if @playerCycle.state == 4
        screen.setForegroundColor playerColors(@cycleNumber)['cli']
        screen.print('-- INSERT --', 1, screen.rows)
        screen.resetColors()

  @property 'playerCycle', get: ->
    (cycle for cycle in @_game.cycles when cycle.number == @cycleNumber).pop()

  @property 'numberOfReadyPlayers', get: ->
    @game.cycles.reduce(
      ((total, cycle)->
        if cycle.ready then total + 1 else total
      ), 0)

module.exports = GameView
