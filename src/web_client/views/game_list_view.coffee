Game = require '../../models/game'
$ = require 'jquery'

class GameListView
  addGames: (games) ->
    @activeGames = games

  render: ->
    for game in @activeGames
      $('#game-list').append("<li>#{game.name}</li>")

module.exports = GameListView
