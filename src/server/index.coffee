Game = require '../models/game'
http = require 'http'
socketio = require 'socket.io'

class Server
  constructor: ()->
    @games = {}

  getGame: (attributes) ->
    game = @games[attributes.name] = (@games[attributes.name] ? new Game(attributes))
    return null if game.inProgress()
    game.addListener 'game', @onGameChange
    game.addListener 'restart', @onGameRestart
    game.addListener 'stopped', @onGameStopped
    game

  gameList: ->
    (game.toJSON() for name, game of @games)

  onGameChange: (game)=>
    @io.sockets.in(game.name).emit 'game', game.toJSON()

  onGameRestart: (game)=>
    game.restart()

  onGameStopped: (game)=>
    delete @games[game.name]

  listen: (@port=8000, options..., cb=(->))=>
    collectedOptions = { log: false }
    for option in options
      for key, value of option
        collectedOptions[key] = value
    @server = http.createServer(@onRequest)
    @io = socketio.listen(@server, collectedOptions)
    @io.sockets.on 'connection', @onConnection
    @server.listen @port, cb

  onConnection: (socket)=>
    new ClientSocket(socket, @)

  onRequest: (request, response)=>
    response.writeHead 200
    response.end 'Hello, world!'

  close: (cb=(->))-> @server?.close cb

class ClientSocket
  constructor: (@socket, @server)->
    @socket.on 'keyPress', @onKeyPress
    @socket.on 'disconnect', @onDisconnect
    @socket.on 'join', @onJoin
    @socket.on 'leave', @onLeave
    @socket.on 'list', @onList

  onJoin: (properties)=>
    @game = @server.getGame(properties)
    if @game?
      @socket.join @game.name
      @cycle = @game.addCycle()
    else
      @socket.emit('error', "Game '#{@game.name}' is already in progress.")

  onLeave: =>
    if @game?
      @socket.leave @game.name
      @game.removeCycle @cycle
    @cycle = null
    @game = null

  onKeyPress: (key)=>
    if @game?
      switch key
        when 13
          if @game.isRestarting()
            @cycle = @game.addCycle()
        else
          @onMovement(key)

  onMovement: (movement)=>
    @cycle.navigate(movement)

  onDisconnect: =>
    @onLeave()

  onList: =>
    @socket.emit 'games', @server.gameList()

module.exports = Server
