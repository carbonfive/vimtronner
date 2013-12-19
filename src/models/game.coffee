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
  ]

  constructor: (@name=nil)->
    @cycles = []
    @state = Game.STATES.WAITING
    @count = 3

  addCycle: ->
    cycle = new Cycle(Game.PLAYER_ATTRIBUTES[@cycles.length])
    @cycles.push cycle
    if @activeCycleCount() > 1
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
    count++ for cycle in @cycles when cycle.state == Cycle.STATES.RACING
    count

  start: ->
    @state = Game.STATES.COUNTDOWN
    @countInterval = setInterval @countdown, 1000
    @gameLoop = setInterval @loop, 100

  moveCycle: (cycle, movement) ->
    switch movement
      when 106
        cycle.turnDown()
      when 107
        cycle.turnUp()
      when 104
        cycle.turnLeft()
      when 108
        cycle.turnRight()

  loop: =>
    if @state == Game.STATES.STARTED
      for cycle in @cycles
        cycle?.move()
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
    cycle.makeWinner() for cycle in @cycles when cycle.state == Cycle.STATES.RACING

  inProgress: ->
    @state != Game.STATES.WAITING

  toJSON: -> {
    name: @name
    state: @state
    count: @count
    cycles: (cycle.toJSON() for cycle in @cycles)
  }

module.exports = Game
