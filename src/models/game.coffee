require '../define_property'

{ EventEmitter } = require('events')
directions = require './directions'
playerAttributes = require './player_attributes'
Cycle = require './cycle'

class Game extends EventEmitter
  @STATES: {
    WAITING: 0
    COUNTDOWN: 1
    STARTED: 2
    FINISHED: 3
  }

  constructor: (attributes)->
    @name = attributes.name
    @numberOfPlayers = attributes.numberOfPlayers ? 2
    @gridSize = attributes.gridSize ? 50
    @playerPositions = @calculatePlayerPositions()
    @cycles = []
    @state = Game.STATES.WAITING
    @_count = 3000

  addCycle: ->
    return null if @inProgress

    attributes = playerAttributes[@cycles.length]
    attributes['x'] = @playerPositions[@cycles.length]['x']
    attributes['y'] = @playerPositions[@cycles.length]['y']
    attributes['game'] = @
    cycle = new Cycle(attributes)

    @cycles.push cycle
    if @activeCycleCount() == @numberOfPlayers
      @start()
    else
      @emit 'game', @
    cycle

  removeCycle: (cycle)->
    index = @cycles.indexOf cycle
    @cycles.splice index, 1
    @checkForWinner()

  checkForWinner: ->
    if @activeCycleCount() <= 1
      @stop()

  activeCycleCount: ->
    count = 0
    count++ for cycle in @cycles when cycle.state != Cycle.STATES.DEAD
    count

  start: ->
    @state = Game.STATES.COUNTDOWN
    @gameLoop = setInterval @loop, 100

  loop: =>
    switch @state
      when Game.STATES.COUNTDOWN
        @countdown()
      when Game.STATES.STARTED
        @runGame()
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

  stop: ->
    clearInterval @gameLoop
    @state = Game.STATES.FINISHED
    @determineWinner()
    @emit 'game', @
    @emit 'stopped', @

  determineWinner: ->
    cycle.makeWinner() for cycle in @cycles when cycle.state != Cycle.STATES.DEAD

  @property 'inProgress', get: -> @state != Game.STATES.WAITING
  @property 'count',
    get: -> Math.ceil(@_count/1000.0)
    set: (value)-> @_count = 1000.0 * value

  calculatePlayerPositions: ->
    minDistance = 3
    maxDistance = @gridSize - minDistance
    halfDistance = Math.round(@gridSize / 2)
    [
      {
        x: minDistance
        y: minDistance
      }
      {
        x: maxDistance
        y: maxDistance
      }
      {
        x: minDistance
        y: maxDistance
      }
      {
        x: maxDistance
        y: minDistance
      }
      {
        x: halfDistance
        y: minDistance
      }
      {
        x: halfDistance
        y: maxDistance
      }
      {
        x: minDistance
        y: halfDistance
      }
      {
        x: maxDistance
        y: halfDistance
      }
    ]

  toJSON: -> {
    name: @name
    state: @state
    count: @count,
    numberOfPlayers: @numberOfPlayers
    gridSize: @gridSize
    startX: @startX
    cycles: (cycle.toJSON() for cycle in @cycles)
  }

module.exports = Game
