socketio = require('socket.io-client')
screen = require './screen'
Board = require './board'

class Client
  constructor: (@address="127.0.0.1", @port=8000)->
    @board = board = new Board

  join: (@game)->
    @clearScreen()
    @connect(@andJoinGame)

  listGames: ->
    @connect(@andListGames)

  clearScreen: ->
    screen.clear()
    screen.hideCursor()

  connect: (callback)->
    @socket = socketio.connect("http://#{@address}:#{@port}")
    @socket.on 'connect', callback

  andJoinGame: =>
    process.on 'SIGINT', @onSigInt
    process.stdin.setRawMode true
    process.stdin.resume()
    process.stdin.on 'data', @onData
    @socket.on 'game', @onGameUpdate
    @socket.emit 'join', @game

  onData: (chunk)=>
    switch chunk[0]
      when 3
        process.kill process.pid, 'SIGINT'
      else
        @socket.emit 'movement', chunk[0]

  onSigInt: =>
    screen.clear()
    screen.showCursor()
    process.nextTick process.exit

  onGameUpdate: (game)=>
    @board.loadState(game)
    @board.render()

  andListGames: =>
    @socket.on 'games', @onGames
    @socket.emit 'list'

  onGames: (games)=>
    console.log games
    @socket.disconnect()

module.exports = Client
