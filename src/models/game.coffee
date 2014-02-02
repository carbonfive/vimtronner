require '../define_property'
require 'moniker'

{ EventEmitter } = require('events')
Moniker = require 'moniker'

directions = require './directions'
playerAttributes = require './player_attributes'
Cycle = require './cycle'

class Game extends EventEmitter
  @STATES: {
    WAITING: 0
    COUNTDOWN: 1
    STARTED: 2
    FINISHED: 3
    RESTARTING: 4
  }

  constructor: (attributes={})->
    @lastUpdated = Date.now()
    @name = attributes.name ? Moniker.choose()
    @numberOfPlayers = attributes.numberOfPlayers ? 1
    @availablePlayers = (playerAttributes[n] for n in [0...@numberOfPlayers]).reverse()
    @width = attributes.width ? 80
    @height = attributes.height ? 22
    @cycles = []
    @state = Game.STATES.WAITING
    @_count = 6000

  @property 'isWaiting', get: -> @state == Game.STATES.WAITING
  @property 'isCountingDown', get: -> @state == Game.STATES.COUNTDOWN
  @property 'isStarted', get: -> @state == Game.STATES.STARTED
  @property 'isFinished', get: -> @state == Game.STATES.FINISHED
  @property 'isRestarting', get: -> @state == Game.STATES.RESTARTING
  @property 'readyCycleCount', get: ->
    count = 0
    count++ for cycle in @cycles when cycle.ready
    count
  @property 'activeCycleCount', get: ->
    count = 0
    count++ for cycle in @cycles when cycle.state != Cycle.STATES.DEAD
    count
  @property 'outdated', get: ->
    (Date.now() - @lastUpdated) > 180000

  touch: =>
    @lastUpdated = Date.now()

  addCycle: ->
    return null if @inProgress or @availablePlayers.length == 0
    player = @availablePlayers.pop()
    attributes = {
      player: player
      game: @
    }
    cycle = new Cycle(attributes)
    @cycles.push cycle
    @touch()
    cycle

  removeCycle: (cycle)->
    @touch()
    @availablePlayers.push cycle.player
    index = @cycles.indexOf cycle
    @cycles.splice index, 1
    @checkForWinner() if @inProgress
    @checkKillGame()

  checkForWinner: ->
    endGameCount = if @isPractice then 0 else 1
    if @activeCycleCount <= endGameCount
      @finishGame()

  checkKillGame: ->
    if @activeCycleCount < 1
      @stop()

  start: ->
    @loop()
    @gameLoop = setInterval @loop, 100

  loop: =>
    switch @state
      when Game.STATES.WAITING, Game.STATES.RESTARTING
        @checkIfGameStarts()
      when Game.STATES.COUNTDOWN
        @countdown()
      when Game.STATES.STARTED
        @runGame()
      when Game.STATES.FINISHED
        @checkIfGameRestarting()
    @emit 'game', @

  runGame: =>
    for cycle in @cycles
      cycle?.step()
      cycle?.checkCollisions(@cycles)
    @checkForWinner()

  countdown: =>
    @_count -= 100
    if @_count <= 0
      @state = Game.STATES.STARTED

  checkIfGameStarts: ->
    if @readyCycleCount == @numberOfPlayers
      @_count = 6000
      @state = Game.STATES.COUNTDOWN
      playerPositions = @calculatePlayerPositions()
      for cycle, i in @cycles
        i = Math.floor(Math.random() * playerPositions.length)
        playerPosition = playerPositions[i]
        playerPositions.splice i, 1
        cycle.x = playerPosition['x']
        cycle.y = playerPosition['y']
        cycle.direction = playerPosition['direction']

  checkIfGameRestarting: ->
    if @cycles.some((cycle)-> cycle.ready)
      cycle.walls = [] for cycle in @cycles
      @state = Game.STATES.RESTARTING

  finishGame: ->
    @state = Game.STATES.FINISHED
    (cycle.ready = false for cycle in @cycles)
    @determineWinner() unless @isPractice

  stop: ->
    clearInterval @gameLoop
    @emit 'stopped', @

  determineWinner: ->
    cycle.makeWinner() for cycle in @cycles when cycle.state != Cycle.STATES.DEAD

  @property 'inProgress', get: -> @state != Game.STATES.WAITING and @state != Game.STATES.RESTARTING
  @property 'isPractice', get: -> @numberOfPlayers == 1
  @property 'count',
    get: -> Math.ceil(@_count/2000.0)
    set: (value)-> @_count = 2000.0 * value

  calculatePlayerPositions: ->
    minXDistance = 3
    maxXDistance = @width - minXDistance
    halfXDistance = Math.round(@width / 2)
    minYDistance = 3
    maxYDistance = @height - minXDistance
    halfYDistance = Math.round(@height / 2)
    [
      { x: minXDistance, y: minYDistance, direction: directions.RIGHT }
      { x: maxXDistance, y: maxYDistance, direction: directions.LEFT }
      { x: minXDistance, y: maxYDistance, direction: directions.UP }
      { x: maxXDistance, y: minYDistance, direction: directions.DOWN }
      { x: halfXDistance, y: minYDistance, direction: directions.DOWN }
      { x: halfXDistance, y: maxYDistance, direction: directions.UP }
      { x: minXDistance, y: halfYDistance, direction: directions.RIGHT }
      { x: maxXDistance, y: halfYDistance, direction: directions.LEFT }
    ]

  toJSON: -> {
    name: @name
    state: @state
    count: @count,
    numberOfPlayers: @numberOfPlayers
    width: @width
    height: @height
    cycles: (cycle.toJSON() for cycle in @cycles)
    isPractice: @isPractice
  }

module.exports = Game
