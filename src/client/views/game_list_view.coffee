Game = require '../../models/game'

class GameListView
  constructor: ->
    @activeGames = []

  addGames: (games) ->
    @activeGames.push games

  render: ->
    console.log "** V I M T R O N N E R **"
    console.log "Current Games:"
    for game in @activeGames
      game = game[0]
      console.log "#{game.name}: #{@translateState(game.state)}"
      console.log "#{game.cycles.length} cycle(s)"
      console.log "-----"
    console.log "***************"

  translateState: (stateNumber) ->
    switch stateNumber
      when Game.STATES.WAITING then 'Waiting'
      when Game.STATES.COUNTDOWN then 'Countdown'
      when Game.STATES.STARTED then 'Started'
      when Game.STATES.FINISHED then 'Finished'

module.exports = GameListView
