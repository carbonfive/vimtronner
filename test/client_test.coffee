Client = require '../src/client'
Cycle = require '../src/models/cycle'

describe Client, ->
  beforeEach ->
    @client = new Client

  describe '#storeCycle', ->
    context 'given a cycle', ->
      beforeEach ->
        @cycle = sinon.createStubInstance(Cycle)
        @client.storeCycle @cycle

      it "stores it as the player's cycle", ->
        expect(@client.cycle).to.eq @cycle

  describe '#andJoinGame', ->
    beforeEach ->
      @emit = sinon.stub()
      @on = sinon.stub()
      @client.game = 'aGame'
      @client.socket = { @emit, @on }

    context 'when joining a game', ->
      beforeEach -> @client.andJoinGame()

      it 'requests to join the game', ->
        expect(@emit).to.have.been.calledWith 'join', @client.gameAttributes

      context 'and when there is an error', ->
        beforeEach ->
          @message = 'a message'
          sinon.stub(@client, 'showErrorMessage')
          @emit.yield message: @message

        it 'displays the error message', ->
          expect(@client.showErrorMessage).to.have.been.calledWith @message

      context 'and when it recieves a cycle number', ->
        beforeEach ->
          @number = '3'
          @game = sinon.stub()
          sinon.stub(@client, 'showErrorMessage')
          sinon.stub(@client, 'onGameUpdate')
          @emit.yield null, @number, @game

        it 'stores the cycle number', ->
          expect(@client.showErrorMessage).to.not.have.been.called
          expect(@client.cycleNumber).to.eq @number

        it 'triggers a game update', ->
          expect(@client.onGameUpdate).to.have.been.calledWith @game
