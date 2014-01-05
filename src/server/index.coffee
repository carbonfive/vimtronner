Game = require '../models/game'
http = require 'http'
socketio = require 'socket.io'
ClientSocket = require './client_socket'

createGame = (attributes, server)->
  game = new Game(attributes)
  game.addListener 'game', server.onGameChange
  game.addListener 'stopped', server.onGameStopped
  game

class Server
  constructor: ()->
    @games = {}

  getGame: (attributes) ->
    @games[attributes.name] = (@games[attributes.name] ? createGame(attributes, @))

  gameList: ->
    (game.toJSON() for name, game of @games)

  onGameChange: (game)=>
    @io.sockets.in(game.name).emit 'game', game.toJSON()

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

module.exports = Server
