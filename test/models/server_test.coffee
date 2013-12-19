Game = require '../../src/models/game'
Server = require '../../src/server'

describe Server, ->
  beforeEach -> @server = new Server(5000)

  describe 'construction', ->
    context 'given a port', ->
      it 'provides a server with that port', ->
        expect(@server.port).to.eq(5000)

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
