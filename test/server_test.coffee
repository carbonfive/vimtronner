Game = require '../src/models/game'
Server = require '../src/server'

http = require 'http'
socketio = require('socket.io-client')

describe Server, ->
  beforeEach -> @server = new Server

  describe '#getGame', ->
    context 'given a name', ->
      context 'given the name belongs to a game that exists', ->
        beforeEach ->
          @runningGame = new Game('My game name')
          @server.games[@runningGame.name] = @runningGame

        context 'given the game with that name is in progress', ->
          beforeEach ->
            sinon.stub(@runningGame, 'inProgress').returns(true)
            @attributes = { name: @runningGame.name }

          it 'returns null', ->
            expect(@server.getGame(@attributes)).to.be.null

        context 'given the game with that name is waiting', ->
          it 'returns the game', ->
            expect(@server.getGame(@attributes)).to.eq(@runningGame)

      context 'given the name is for a new game', ->
        beforeEach ->
          @runningGame = new Game('My game name')
          @server.games[@runningGame.name] = @runningGame
          @attributes = { name: 'Another name' }

        it 'creates a new game', ->
          newGame = @server.getGame(@attributes)
          expect(newGame).to.not.eq(@runningGame)
          expect(newGame.name).to.eq(@attributes.name)

        context 'given a number of players', ->
          beforeEach ->
            @attributes['numberOfPlayers'] = 3

          it 'creates a game that allows that many players', ->
            newGame = @server.getGame(@attributes)
            expect(newGame.numberOfPlayers).to.eq(@attributes.numberOfPlayers)


  describe '#listen', ->
    beforeEach ->
      sinon.stub @server, 'onConnection'

    itBehavesLikeItStartsListeningOn = (portDescription, port)->
      it "starts listening on #{portDescription}", (done)->
        http.get "http://127.0.0.1:#{port}", (response)->
          expect(response.statusCode).to.eq 200
          done()

      it 'responds to web socket connections', (done)->
        socketio.connect("http://localhost:#{port}").on 'connect', =>
          expect(@server.onConnection).to.have.been.called
          done()

    context 'given a port number', ->
      beforeEach -> @server.listen 6666
      afterEach -> @server.close()

      itBehavesLikeItStartsListeningOn('that port number', 6666)

    context 'given no port number', ->
      beforeEach -> @server.listen()
      afterEach -> @server.close()

      itBehavesLikeItStartsListeningOn('port 8000', 8000)
