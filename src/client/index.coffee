socketio = require('socket.io-client')
screen = require './screen'
GameView = require './views/game_view'
GameListView = require './views/game_list_view'

class Client
  constructor: (@address="127.0.0.1", @port=8000)->
    @gameView = gameView = new GameView

  join: (@gameAttributes)->
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
    @socket.emit 'join', @gameAttributes, (error, cycleNumber, game) =>
      return @showErrorMessage(error.message) if error?
      @cycleNumber = cycleNumber
      @onGameUpdate(game)
      @socket.on 'game', @onGameUpdate

  onData: (chunk)=>
    switch chunk[0]
      when 113
        @quit()
        screen.clear()
      else
        @socket.emit 'movement', chunk[0]

  quit: ->
    process.kill process.pid, 'SIGINT'

  onSigInt: =>
    screen.showCursor()
    process.nextTick process.exit

  onGameUpdate: (game)=>
    @gameView.game = game
    @gameView.cycleNumber = @cycleNumber
    @gameView.render()

  andListGames: =>
    @gameListView = new GameListView
    @socket.on 'games', @onGames
    @socket.emit 'list'

  onGames: (games)=>
    @gameListView.addGames(games)
    @gameListView.render()
    @socket.disconnect()

  showErrorMessage: (message) =>
    console.log message
    @quit()

  storeCycle: (cycle)=> @cycle = cycle

module.exports = Client
