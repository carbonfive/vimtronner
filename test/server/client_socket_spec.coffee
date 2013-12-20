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

    @clientSocket = new ClientSocket(@socket, @server)

  describe 'construction', ->
    context 'given a socket and a server', ->
      it 'listens for join events on the socket', ->
        expect(@socket.on).to.have.been.calledWith('join', @clientSocket.onJoin)

      it 'listens for list events on the socket', ->
        expect(@socket.on).to.have.been.calledWith('list', @clientSocket.onList)

  describe 'onJoin', ->
    context 'given a name', ->
      beforeEach ->
        @name = 'aName'

      context 'when the server successfully supplies the game', ->
        beforeEach ->
          @game = sinon.createStubInstance(Game)
          @server.getGame.withArgs(@name).returns(@game)

        context 'and the game can add cycles', ->
          beforeEach ->
            @cycle = sinon.createStubInstance(Cycle)
            @game.addCycle.returns(@cycle)
            @joinResult = @clientSocket.onJoin @name

          it 'creates a client game socket to control the cycle', ->
            expect(@joinResult).to.be.instanceOf ClientGameSocket
            expect(@joinResult.socket).to.eq @socket
            expect(@joinResult.game).to.eq @game
            expect(@joinResult.cycle).to.eq @cycle

        context 'but the game cannot add a cycle', ->
          beforeEach ->
            @joinResult = @clientSocket.onJoin @name

          it 'does not create a client game socket', ->
            expect(@joinResult).to.not.be.instanceOf ClientGameSocket

          it 'reports an error on the socket', ->
            expect(@socket.emit).to.have.been.calledWith 'error',
              "Game '#{@name}' is already in progress."

      context 'but the server cannot supply the game', ->
          beforeEach ->
            @joinResult = @clientSocket.onJoin @name

          it 'does not create a client game socket', ->
            expect(@joinResult).to.not.be.instanceOf ClientGameSocket

          it 'reports an error on the socket', ->
            expect(@socket.emit).to.have.been.calledWith 'error',
              "Could not find or create game named '#{@name}'."

  describe 'onList', ->
    beforeEach ->
      @gameList = sinon.createStubInstance(Array)
      @server.gameList.returns @gameList
      @clientSocket.onList()

    it 'emits the game list on the socket', ->
      expect(@socket.emit).to.have.been.calledWith('games', @gameList)

