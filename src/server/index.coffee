Game = require('../models/game')
socketio = require 'socket.io'

class Server
  constructor: (@port=8000)->
    @games = {}

  getGame: (name) ->
    game = @games[name] = (@games[name] ? new Game(name))
    return null if game.inProgress()
    game.addListener 'game', @onGameChange
    game.addListener 'stopped', @onGameStopped
    game

  gameList: ->
    (game.toJSON() for name, game of @games)

  onGameChange: (game)=>
    @io.sockets.in(game.name).emit 'game', game.toJSON()

  onGameStopped: (game)=>
    delete @games[game.name]

  listen: ->
    @io = socketio.listen @port
    @io.on 'connection', @onConnection

  onConnection: (socket)=>
    new ClientSocket(socket, @)

class ClientSocket
  constructor: (@socket, @server)->
    @socket.on 'movement', @onMovement
    @socket.on 'disconnect', @onDisconnect
    @socket.on 'join', @onJoin
    @socket.on 'leave', @onLeave
    @socket.on 'list', @onList

  onJoin: (name)=>
    @game = @server.getGame(name)
    if @game?
      @socket.join @game.name
      @cycle = @game.addCycle()
    else
      @socket.emit('error', "Game '#{name}' is already in progress.")

  onLeave: =>
    if @game?
      @socket.leave @game.name
      @game.removeCycle @cycle
    @cycle = null
    @game = null

  onMovement: (movement)=>
    @game?.moveCycle(@cycle, movement)

  onDisconnect: =>
    @onLeave()

  onList: =>
    @socket.emit 'games', @server.gameList()

module.exports = Server
