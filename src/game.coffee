{ EventEmitter } = require('events')
directions = require './directions'
Cycle = require './cycle'

class Game extends EventEmitter
  @STATES: {
    WAITING: 0
    COUNTDOWN: 1
    STARTED: 2
  }

  @PLAYER_ATTRIBUTES: [
    {
      x: 1
      y: 1
      direction: directions.RIGHT
      color: 4
      walls: []
    }
    {
      x: 47
      y: 47
      direction: directions.LEFT
      color: 2
      walls: []
    }
  ]

  constructor: ->
    @cycles = []
    @state = Game.STATES.WAITING
    @count = 3

  addCycle: ->
    cycle = new Cycle(Game.PLAYER_ATTRIBUTES[@cycles.length])
    @cycles.push cycle
    if @cycles.length > 1
      @start()
    else
      @emit 'game', @toJSON()
    cycle

  removeCycle: (cycle)->
    index = @cycles.indexOf cycle
    @cycles.splice index, 1
    if @cycles.length < 1
      @stop()

  start: ->
    @state = Game.STATES.COUNTDOWN
    @count_interval = setInterval @countdown, 1000
    @game_loop = setInterval @loop, 100

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
        cycle.move()
        cycle.checkCollisions(@cycles)
    @emit 'game', @toJSON()

  countdown: =>
    @count--
    if @count == 0
      clearInterval @count_interval
      @state = Game.STATES.STARTED

  stop: ->
    @state = Game.STATES.WAITING
    clearInterval @game_loop

  toJSON: -> {
    state: @state
    count: @count
    cycles: (cycle.toJSON() for cycle in @cycles)
  }

module.exports = Game