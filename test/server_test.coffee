Game = require '../src/models/game'
Server = require '../src/server'

http = require 'http'
socketio = require('socket.io-client')

describe Server, ->
  beforeEach -> @server = new Server

  describe '#getGame', ->
    context 'given the attributes of a game', ->
      beforeEach ->
        @name = 'My game name'
        @attributes = { @name }

      context 'and a game with the same name already exists', ->
        beforeEach ->
          @existingGame = new Game(@attributes)
          @server.games[@attributes.name] = @existingGame

        it 'returns the game', ->
          expect(@server.getGame(@existingGame.name)).to.eq(@existingGame)

      context 'and a game with the same name does not already exists', ->
        beforeEach ->
          expect(@server.games).to.be.empty
          @name = 'my game name'

        it 'creates a new game with the name', ->
          newGame = @server.getGame(@attributes)
          expect(newGame).to.be.ok
          expect(newGame.name).to.eq @name
          expect(@server.games).to.include.keys(@name)
          expect(@server.games[@name]).to.eq @newGame

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
