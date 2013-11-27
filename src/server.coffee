Game = require('./game')
socketio = require 'socket.io'

class Server
  constructor: (@port=8000)->

  start: ->
    @launchGame()
    @listen()

  launchGame: ->
    @game = new Game
    @game.addListener 'game', @onGameChange

  onGameChange: (gameJSON)=>
    @io.sockets.emit 'game', gameJSON

  listen: ->
    @io = socketio.listen @port
    @io.on 'connection', @onConnection

  onConnection: (socket)=>
    new ClientSocket(socket, @game)

class ClientSocket
  constructor: (@socket, @game)->
    @cycle = @game.addCycle()
    @socket.on 'movement', @onMovement
    @socket.on 'disconnect', @onDisconnect

  onMovement: (movement)=>
    @game.moveCycle(@cycle, movement)

  onDisconnect: =>
    @game.removeCycle @cycle

module.exports = Server
