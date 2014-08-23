$ = require 'jquery'
socketio = require('socket.io-client')
GameView = require('./views/game_view')
GameListView = require('./views/game_list_view')
require '../define_property'

class WebClient
  constructor: (@address="127.0.0.1", @port=8766)->
    @errorMessages = []

  @property 'url', get: -> "http://#{@address}:#{@port}"

  join: (@gameAttributes)->
    @checkValidity()
    @gameView = new GameView
    @connect(@andJoinGame)
    @listenToEvents()

  listenToEvents: ->
    $(document).keypress (event) =>
      switch event.charCode
        when 113
          @quit()
        else
          @socket.emit 'movement', event.charCode

  quit: ->
    @socket.disconnect()

  andJoinGame: =>
    @socket.emit 'join', @gameAttributes, (error, cycleNumber, game) =>
      return @showErrorMessage(error.message) if error?
      @cycleNumber = cycleNumber
      @onGameUpdate(game)
      @socket.on 'game', @onGameUpdate
      @socket.on 'disconnect', @quit

  showErrorMessage: (message) =>
    @errorMessages.push message

  onGameUpdate: (game)=>
    @gameView.game = game
    @gameView.cycleNumber = @cycleNumber
    @gameView.render()

  checkValidity: ->
    errorChecks = {
      "Width cannot be smaller than 80": =>
        @gameAttributes.width < 80 if @gameAttributes.width
      "Width cannot be greater than screen size": =>
        @gameAttributes.width > screen.columns if @gameAttributes.width
      "Height cannot be smaller than 22": =>
        @gameAttributes.width < 22 if @gameAttributes.width
      "Height cannot be greater than screen size": =>
        @gameAttributes.height > screen.rows - 2 if @gameAttributes.height
      "Number of players must be between 1 to 6": =>
        @gameAttributes.numberOfPlayers < 1 or
          @gameAttributes.numberOfPlayers > 6 if @gameAttributes.numberOfPlayers
    }
    errors = (message for message, check of errorChecks when check())
    (throw new Error(
      """
      The game parameters are invalid:

      #{errors.join '\n'}
      """
    )) if errors.length > 0

  listGames: ->
    @connect(@andListGames)

  connect: (callback)->
    if @socket
      callback()
    else
      @socket = socketio.connect(@url) unless @socket
      @socket.on 'connect', callback
      @socket.on 'connect_error', @connectError
      @socket.on 'connect_timeout', @connectError
      @socket.on 'error', @connectError
      @socket.on 'connecting', =>
        console.log "Connecting to #{@url} ...\n"

  connectError: (error) =>
    console.log error
    console.log "Failed to connect to #{@url}\n"

  andListGames: =>
    @gameListView = new GameListView
    @socket.on 'games', @onGames
    @socket.emit 'list'

  onGames: (games)=>
    @gameListView.addGames(games)
    @gameListView.render()
    $('.waiting-game').find('a').click (event) =>
      event.stopPropagation()
      gameName = $(event.target).attr('data-name')
      @join(name: gameName)


module.exports = WebClient
