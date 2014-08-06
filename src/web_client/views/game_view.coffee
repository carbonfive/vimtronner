$ = require 'jquery'
require '../../define_property'
pixi = require 'pixi'

playerColors = require './player_colors'
Game = require '../../models/game'
Cycle = require '../../models/cycle'
CycleView = require './cycle_view'

class GameView
  constructor: ->
    @cycleViews = []
    @countString = ''
    @setStage()

  @property 'state', get: -> @_game?.state

  @property 'stateString', get: ->
    switch @_game?.state
      when Game.STATES.WAITING then 'Waiting for other players'
      when Game.STATES.COUNTDOWN then 'Get ready'
      when Game.STATES.STARTED then 'Go'
      when Game.STATES.FINISHED then 'Game over'

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

  setStage: ->
    @stage = new pixi.Stage(0xaaaaaa)
    @renderer = pixi.autoDetectRenderer(800,600)
    document.body.appendChild @renderer.view
    requestAnimationFrame(@animate)
    walls = new pixi.Graphics()
    walls.lineStyle(3, 0x000000,1)
    walls.drawRect(0,0,800,600)
    @stage.addChild(walls)

  animate: =>
    requestAnimationFrame(@animate)
    @renderer.render(@stage)

  render: ->
    if @state == Game.STATES.WAITING or (@state == Game.STATES.RESTARTING and @playerCycle.ready)
      @renderWaitScreen()
    else if @state == Game.STATES.COUNTDOWN
      @renderCountdown()
    else if @state == Game.STATES.FINISHED or @state == Game.STATES.RESTARTING
      @renderFinishScreen()
    else
      @renderArena()
      @renderCycleViews()
    @renderGameInfo()

  renderWaitScreen: ->
    $('#game-status').html(@stateString)

  renderCountdown: ->
    $('#game-status').html(@countString)

  renderFinishScreen: ->
    $('#game-status').html(@stateString)

  renderArena: ->

  generateCycleViews: ->
    #console.log @_game.cycles
    #@cycleViews = (new CycleView(cycle, @_game) for cycle in @_game.cycles)
    @createOrUpdateCycleView(cycle) for cycle in @_game.cycles

  createOrUpdateCycleView: (cycle) ->
    cycleView = @cycleViews.filter((view) ->
      view.cycle.number == cycle.number
    )[0]

    if cycleView == undefined
      cycleView = new CycleView(cycle, @_game)
      @cycleViews.push cycleView

    cycleView.cycle = cycle

  renderCycleViews: ->
    cycle_view.render(@stage) for cycle_view in @cycleViews
    true

  renderGameInfo: ->

module.exports = GameView

