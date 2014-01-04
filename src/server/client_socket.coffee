ClientGameSocket = require './client_game_socket'

class ClientSocket
  constructor: (@socket, @server, @gameSocketFactory)->
    @gameSocketFactory ?= (socket, game, cycle)->
      new ClientGameSocket(socket, game, cycle)
    @socket.on 'join', @onJoin
    @socket.on 'list', @onList

  onJoin: (gameAttributes, callback=(error, cycle)->)=>
    game = @server.getGame(gameAttributes)
    if game?
      if (cycle = game.addCycle())?
        @gameSocketFactory(@socket, game, cycle)
        callback null, cycle.number, game.toJSON()
      else
        callback message: "Game '#{gameAttributes.name}' is already in progress."
    else
      callback message: "Could not find or create game named '#{gameAttributes.name}'."

  onList: => @socket.emit 'games', @server.gameList()

module.exports = ClientSocket
