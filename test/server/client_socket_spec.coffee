ClientSocket = require '../../src/server/client_socket.coffee'
ClientGameSocket = require '../../src/server/client_game_socket'
Server = require '../../src/server'
Game = require '../../src/models/game'
Cycle = require '../../src/models/cycle'

describe ClientSocket, ->
  beforeEach ->
    @socket = {
      on: sinon.stub(), join: sinon.stub(), emit: sinon.stub(), leave: sinon.stub()
    }
    @server = sinon.createStubInstance(Server)
    @gameSocketFactory = sinon.stub()

    @clientSocket = new ClientSocket(@socket, @server, @gameSocketFactory)

  describe 'construction', ->
    context 'given a socket, a server, and a game socket factory', ->
      it 'stores the socket', -> expect(@clientSocket.socket).to.eq @socket

      it 'stores the server', -> expect(@clientSocket.server).to.eq @server

      it 'stores the game socket factory', ->
        expect(@clientSocket.gameSocketFactory).to.eq @gameSocketFactory

      it 'listens for join events on the socket', ->
        expect(@socket.on).to.have.been.calledWith('join', @clientSocket.onJoin)

      it 'listens for list events on the socket', ->
        expect(@socket.on).to.have.been.calledWith('list', @clientSocket.onList)

  describe 'onJoin', ->
    context 'given a name and a callback', ->
      beforeEach ->
        @name = 'aName'
        @attributes = { @name }
        @callback = sinon.stub()

      context 'when the server successfully supplies the game', ->
        beforeEach ->
          @game = sinon.createStubInstance(Game)
          @server.getGame.withArgs(@attributes).returns(@game)

        context 'and the game can add cycles', ->
          beforeEach ->
            @cycle = sinon.createStubInstance(Cycle)
            @cycle.number = 3
            @game.addCycle.returns(@cycle)
            @gameJSON = { foo: 'bar' }
            @game.toJSON.returns @gameJSON
            @clientSocket.onJoin @attributes, @callback

          it 'creates a client game socket to control the cycle', ->
            expect(@gameSocketFactory).to.have.been.calledWith(@socket, @game, @cycle)

          it 'calls back with the cycle number and the game', ->
            expect(@callback).to.have.been.calledWith null, @cycle.number, @gameJSON

        context 'but the game cannot add a cycle', ->
          beforeEach -> @clientSocket.onJoin @attributes, @callback

          it 'does not create a client game socket', ->
            expect(@gameSocketFactory).to.not.have.been.called

          it 'replies with an error about the game being in progress', ->
            expect(@callback).to.have.been.calledWith(
              { message: "Game '#{@name}' is already in progress." }
            )

      context 'but the server cannot supply the game', ->
          beforeEach -> @clientSocket.onJoin @attributes, @callback

          it 'does not create a client game socket', ->
            expect(@gameSocketFactory).to.not.have.been.called

          it 'reports an error on the socket', ->
            expect(@callback).to.have.been.calledWith(
              message: "Could not find or create game named '#{@name}'."
            )

  describe 'onList', ->
    beforeEach ->
      @gameList = sinon.createStubInstance(Array)
      @server.gameList.returns @gameList
      @clientSocket.onList()

    it 'emits the game list on the socket', ->
      expect(@socket.emit).to.have.been.calledWith('games', @gameList)

