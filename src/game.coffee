{ EventEmitter } = require('events')
directions = require './directions'
Cycle = require './cycle'

class Game extends EventEmitter
  @STATES: {
    WAITING: 0
    STARTED: 1
  }

  constructor: ->
    @cycles = []
    @state = Game.STATES.WAITING

  addCycle: ->
    cycle = new Cycle(1,1, directions.RIGHT, 4)
    @cycles.push cycle
    if @cycles.length > 0
      @start()
    cycle

  removeCycle: (cycle)->
    index = @cycles.indexOf cycle
    @cycles.splice index, 1
    if @cycles.length < 1
      @stop()

  start: ->
    @state = Game.STATES.STARTED
    @interval = setInterval @loop, 100

  loop: =>
    for cycle in @cycles
      cycle.move()
      cycle.checkCollisions(@cycles)
    @emit 'game', @toJSON()

  stop: ->
    @state = Game.STATES.WAITING
    clearInterval @interval

  toJSON: -> {
    cycles: (cycle.toJSON() for cycle in @cycles)
  }

module.exports = Game
