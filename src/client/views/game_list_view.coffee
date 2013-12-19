Game = require '../../models/game'

class GameListView
  addGames: (games) ->
    @activeGames = games

  render: ->
    @renderHeader()
    @renderGames()
    @renderFooter()

  renderHeader: ->
    console.log "** V I M T R O N N E R **"
    console.log "Current Games:"
    console.log "-----"

  renderGames: ->
    for game in @activeGames
      console.log "Name: #{game.name}"
      state = @translateState(game.state)
      console.log "Status: #{state}"
      console.log "#{game.cycles.length} cycle(s)"
      console.log "-----"

  renderFooter: ->
    console.log "*************************"
    console.log "Run 'vimtronner -C -G <game name>' to join."

  translateState: (stateNumber) ->
    switch stateNumber
      when Game.STATES.WAITING then 'Waiting'
      when Game.STATES.COUNTDOWN then 'Countdown'
      when Game.STATES.STARTED then 'Started'
      when Game.STATES.FINISHED then 'Finished'

module.exports = GameListView
