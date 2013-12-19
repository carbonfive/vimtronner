Game = require '../src/models/game'
Server = require '../src/server'

http = require 'http'
socketio = require('socket.io-client')

describe Server, ->
  beforeEach -> @server = new Server

  describe '#getGame', ->
    context 'given a name', ->
      beforeEach ->
        @runningGame = new Game('My game name')
        @server.games[@runningGame.name] = @runningGame

      context 'given the game with that name is in progress', ->
        beforeEach ->
          sinon.stub(@runningGame, 'inProgress').returns(true)

        it 'returns null', ->
          expect(@server.getGame(@runningGame.name)).to.be.null

      context 'given the game with that name is waiting', ->
        it 'returns the game', ->
          expect(@server.getGame(@runningGame.name)).to.eq(@runningGame)

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
