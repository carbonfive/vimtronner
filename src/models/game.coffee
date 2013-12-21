{ EventEmitter } = require('events')
directions = require './directions'
Cycle = require './cycle'

class Game extends EventEmitter
  @STATES: {
    WAITING: 0
    COUNTDOWN: 1
    STARTED: 2
    FINISHED: 3
  }

  @PLAYER_ATTRIBUTES: [
    {
      number: 1
      x: 1
      y: 1
      direction: directions.RIGHT
      color: 4
      walls: []
    }
    {
      number: 2
      x: 47
      y: 47
      direction: directions.LEFT
      color: 2
      walls: []
    }
    {
      number: 3
      x: 1
      y: 47
      direction: directions.UP
      color: 3
      walls: []
    }
    {
      number: 4
      x: 47
      y: 1
      direction: directions.DOWN
      color: 5
      walls: []
    }
    {
      number: 5
      x: 25
      y: 1
      direction: directions.DOWN
      color: 6
      walls: []
    }
    {
      number: 6
      x: 25
      y: 47
      direction: directions.UP
      color: 7
      walls: []
    }
    {
      number: 7
      x: 1
      y: 25
      direction: directions.RIGHT
      color: 8
      walls: []
    }
    {
      number: 8
      x: 47
      y: 25
      direction: directions.LEFT
      color: 1
      walls: []
    }
  ]

  constructor: (attributes)->
    @name = attributes.name
    @numberOfPlayers = attributes.numberOfPlayers ? 2
    @cycles = []
    @state = Game.STATES.WAITING
    @count = 3

  addCycle: ->
    cycle = new Cycle(Game.PLAYER_ATTRIBUTES[@cycles.length])
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
    @countInterval = setInterval @countdown, 1000
    @gameLoop = setInterval @loop, 100

  loop: =>
    if @state == Game.STATES.STARTED
      for cycle in @cycles
        cycle?.step()
        cycle?.checkCollisions(@cycles)
      @checkForWinner()
    @emit 'game', @

  countdown: =>
    @count--
    if @count == 0
      clearInterval @countInterval
      @state = Game.STATES.STARTED

  stop: ->
    clearInterval @gameLoop
    @state = Game.STATES.FINISHED
    @determineWinner()
    @emit 'game', @
    @emit 'stopped', @

  determineWinner: ->
    cycle.makeWinner() for cycle in @cycles when cycle.state != Cycle.STATES.DEAD

  inProgress: ->
    @state != Game.STATES.WAITING

  toJSON: -> {
    name: @name
    state: @state
    count: @count
    numberOfPlayers: @numberOfPlayers
    cycles: (cycle.toJSON() for cycle in @cycles)
  }

module.exports = Game
