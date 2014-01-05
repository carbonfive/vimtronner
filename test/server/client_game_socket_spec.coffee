ClientGameSocket = require '../../src/server/client_game_socket.coffee'
Game = require '../../src/models/game'
Cycle = require '../../src/models/cycle'

describe ClientGameSocket, ->
  beforeEach ->
    @socket = {
      on: sinon.stub(), join: sinon.stub(), emit: sinon.stub(), leave: sinon.stub()
    }
    @game = sinon.createStubInstance(Game)
    @game.name = 'foo'
    @cycle = sinon.createStubInstance(Cycle)

    @clientGameSocket = new ClientGameSocket(@socket, @game, @cycle)

  describe 'construction', ->
    context 'given a socket, game, and cycle', ->

      it 'listens for movement events on the socket', ->
        expect(@socket.on).to.have.been.calledWith('movement', @clientGameSocket.onMovement)

      it 'listens for disconnect events on the socket', ->
        expect(@socket.on).to.have.been.calledWith('disconnect', @clientGameSocket.onLeave)

      it 'listens for leave events on the socket', ->
        expect(@socket.on).to.have.been.calledWith('leave', @clientGameSocket.onLeave)

      it 'joins the socket to the game room', ->
        expect(@socket.join).to.have.been.calledWith(@game.name)

      it 'emits the cycle down the socket', ->
        expect(@socket.emit).to.have.been.calledWith('cycle', @cycle)

  describe 'onMovement', ->
    context 'given a movement', ->
      beforeEach ->
        @movement = 'm'
        @clientGameSocket.onMovement @movement

      it 'controls the cycle', ->
        expect(@cycle.navigate).to.have.been.calledWith(@movement)

  describe 'onLeave', ->
    beforeEach -> @clientGameSocket.onLeave()

    it 'removes the cycle from the game', ->
      expect(@game.removeCycle).to.have.been.calledWith(@cycle)

    it 'exits the socket from the game room', ->
      expect(@socket.leave).to.have.been.calledWith(@game.name)
