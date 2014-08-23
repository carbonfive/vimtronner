Game = require '../../models/game'
$ = require 'jquery'

class GameListView
  addGames: (games) ->
    @activeGames = games

  render: ->
    for game in @activeGames
      $('#game-list').append("<li class='waiting-game'>#{game.name} <a href='#' data-name='#{game.name}'>join</a></li>")

module.exports = GameListView
