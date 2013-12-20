ClientGameSocket = require './client_game_socket'

class ClientSocket
  constructor: (@socket, @server)->
    @socket.on 'join', @onJoin
    @socket.on 'list', @onList

  onJoin: (game)=>
    @game = @server.getGame(game)
    if @game?
      if (@cycle = @game.addCycle())?
        new ClientGameSocket(@socket, @game, @cycle)
      else
        @socket.emit 'error', "Game '#{game.name}' is already in progress."
    else
      @socket.emit 'error', "Could not find or create game named '#{game.name}'."

  onList: =>
    @socket.emit 'games', @server.gameList()

module.exports = ClientSocket
