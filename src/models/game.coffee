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
    @width = attributes.width ? 80
    @height = attributes.height ? 22
    @cycles = []
    @state = Game.STATES.WAITING
    @_count = 3000

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
    return null if @inProgress
    attributes = playerAttributes[@cycles.length]
    attributes['game'] = @
    cycle = new Cycle(attributes)
    @cycles.push cycle
    @touch()
    cycle

  removeCycle: (cycle)->
    @touch()
    index = @cycles.indexOf cycle
    @cycles.splice index, 1
    @checkForWinner()
    @checkKillGame()

  checkForWinner: ->
    if @activeCycleCount == 1
      @finishGame()

  checkKillGame: ->
    if @activeCycleCount < 1
      @stop()

  start: ->
    @loop()
    @gameLoop = setInterval @loop, 100

  loop: =>
    switch @state
      when Game.STATES.WAITING and Game.STATES.RESTARTING
        @checkIfGameStarts()
      when Game.STATES.COUNTDOWN
        @countdown()
      when Game.STATES.STARTED
        @runGame()
    @emit 'game', @

  runGame: =>
    for cycle in @cycles
      cycle?.step()
      cycle?.checkCollisions(@cycles)
    @checkForWinner() unless @isPractice

  countdown: =>
    @_count -= 100
    if @_count <= 0
      @state = Game.STATES.STARTED

  checkIfGameStarts: ->
    if @readyCycleCount == @numberOfPlayers
      @state = Game.STATES.COUNTDOWN
      @playerPositions = @calculatePlayerPositions()
      for cycle, i in @cycles
        do (cycle, i)->
        cycle.x = @playerPositions[i]['x']
        cycle.y = @playerPositions[i]['y']

  finishGame: ->
    @state = Game.STATES.FINISHED
    @determineWinner()

  stop: ->
    clearInterval @gameLoop
    @emit 'stopped', @

  determineWinner: ->
    cycle.makeWinner() for cycle in @cycles when cycle.state != Cycle.STATES.DEAD

  @property 'inProgress', get: -> @state != Game.STATES.WAITING
  @property 'isPractice', get: -> @numberOfPlayers == 1
  @property 'count',
    get: -> Math.ceil(@_count/1000.0)
    set: (value)-> @_count = 1000.0 * value

  calculatePlayerPositions: ->
    minXDistance = 3
    maxXDistance = @width - minXDistance
    halfXDistance = Math.round(@width / 2)
    minYDistance = 3
    maxYDistance = @height - minXDistance
    halfYDistance = Math.round(@height / 2)
    [
      { x: minXDistance, y: minYDistance }
      { x: maxXDistance, y: maxYDistance }
      { x: minXDistance, y: maxYDistance }
      { x: maxXDistance, y: minYDistance }
      { x: halfXDistance, y: minYDistance }
      { x: halfXDistance, y: maxYDistance }
      { x: minXDistance, y: halfYDistance }
      { x: maxXDistance, y: halfYDistance }
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
