socketio = require('socket.io-client')
screen = require './screen'
GameView = require './views/game_view'
GameListView = require './views/game_list_view'

class Client
  constructor: (@address="127.0.0.1", @port=8000)->
    @errorMessages = []

  join: (@gameAttributes)->
    @gameAttributes.width ?= screen.columns
    @gameAttributes.height ?= screen.rows - 2
    @checkValidity()
    @gameView = gameView = new GameView
    @connect(@andJoinGame)

  checkValidity: ->
    invalid = (
      @gameAttributes.width < 80 or
      @gameAttributes.height < 22 or
      @gameAttributes.width > screen.columns or
      @gameAttributes.height > screen.rows - 2
    )
    (throw new Error(
      """
      Width must be no smaller than 80 and no greater than #{screen.columns}.
      Height must be no smaller than 22 and no greater than #{screen.rows - 2}.
      """
    )) if invalid

  listGames: ->
    @connect(@andListGames)

  connect: (callback)->
    @socket = socketio.connect("http://#{@address}:#{@port}")
    @socket.on 'connect', callback
    @socket.on 'connect_error', @connectError
    @socket.on 'connect_timeout', @connectError
    @socket.on 'error', @connectError
    @socket.on 'connecting', ->
      process.stdout.write "Connecting to #{url} ...\n"

  connectError: =>
    url = "http://#{@address}:#{@port}"
    process.stdout.write "Failed to connect to #{url}\n"
    process.exit 1

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
      @socket.on 'disconnect', @quit

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
    screen.resetAll()
    screen.showCursor()
    screen.clear()

    if @errorMessages.length > 0
      process.stdout.write '\nERROR MESSAGES'
      process.stdout.write '\n--------------'
      process.stdout.write("\n#{message}") for message in @errorMessages
      process.stdout.write '\n--------------\n\n'

    process.stdout.write 'End of line.\n'
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
    @errorMessages.push message
    @quit()

  storeCycle: (cycle)=> @cycle = cycle

module.exports = Client
