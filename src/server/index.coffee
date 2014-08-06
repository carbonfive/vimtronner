http = require 'http'
socketio = require 'socket.io'
express = require 'express'
Moniker = require 'moniker'

Game = require '../models/game'
ClientSocket = require './client_socket'

createGame = (attributes, server)->
  game = new Game(attributes)
  game.addListener 'game', server.onGameChange
  game.addListener 'stopped', server.onGameStopped
  game.start()
  game

class Server
  constructor: (attributes={})->
    @gameFactory = attributes.createGame ? createGame
    @games = {}

  getGame: (attributes) ->
    attributes.name ?= Moniker.choose()
    @games[attributes.name] = (@games[attributes.name] ? createGame(attributes, @))

  gameList: ->
    (game.toJSON() for name, game of @games)

  onGameChange: (game)=>
    @io.sockets.in(game.name).emit 'game', game.toJSON()

  onGameStopped: (game)=>
    socket.disconnect() for socket in @io.sockets.clients(game.name)
    delete @games[game.name]

  listen: (@port=8766, options..., cb=(->))=>
    @checkDeadGameInterval = setInterval @checkForDeadGames, 180000
    collectedOptions = { log: false }
    for option in options
      for key, value of option
        collectedOptions[key] = value
    @createWebServer()
    @server = http.Server(@webApp)
    @io = socketio.listen(@server, collectedOptions)
    @io.sockets.on 'connection', @onConnection
    @server.listen @port, cb

  checkForDeadGames: =>
    games = (game for name, game of @games)
    game.stop() for game in games when game.outdated

  onConnection: (socket)=>
    new ClientSocket(socket, @)

  close: (cb=(->))->
    clearInterval @checkDeadGameInterval
    @server?.close cb

  createWebServer: ->
    @webApp = express()
    @configureWebApp()
    @createRoutes()

  configureWebApp: ->
    @webApp.use express.static('public')

  createRoutes: ->
    @webApp.get '/', (request, response) ->
      response.sendfile('index.html')

module.exports = Server
