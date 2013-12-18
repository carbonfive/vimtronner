Game = require '../../src/models/game'
Cycle = require '../../src/models/cycle'

describe Game, ->
  beforeEach -> @game = new Game('name')

  describe 'construction', ->
    context 'given a name', ->
      it 'provides a game with that name', ->
        expect(@game.name).to.eq('name')

      it 'has an empty array of cycles', ->
        expect(@game.cycles).to.be.empty

      it 'has a waiting state', ->
        expect(@game.state).to.eq(Game.STATES.WAITING)

      it 'provides an initial count of 3', ->
        expect(@game.count).to.eq(3)

  describe '#addCycle', ->
    context 'when called for the first time', ->
      beforeEach ->
        @emit = sinon.stub(@game, 'emit')
        @addedCycle = @game.addCycle()

      it 'returns a new cycle', ->
        expect(@addedCycle).to.be.ok
        expect(@addedCycle).to.be.instanceOf(Cycle)

      it 'adds the cycle to list of cycles', ->
        expect(@game.cycles).to.include(@addedCycle)

      it 'emits the game state', ->
        expect(@emit).to.have.been.calledWith('game', @game)

      context 'and when called again', ->
        beforeEach ->
          @start = sinon.stub(@game, 'start')
          @game.addCycle()

        it 'starts the game', ->
          expect(@start).to.have.been.called

  describe '#removeCycle', ->
    context 'given a cycle', ->
      beforeEach ->
        @winnerCheck = sinon.stub(@game, 'checkForWinner')
        @firstCycle = sinon.createStubInstance(Cycle)
        @secondCycle = sinon.createStubInstance(Cycle)
        @game.cycles = [ @firstCycle, @secondCycle ]
        @removedCycle = @game.removeCycle(@firstCycle)

      it 'removes the cycle from the list', ->
        expect(@game.cycles).to.not.include(@firstCycle)

      it 'preserves the other cycle in the list', ->
        expect(@game.cycles).to.include(@secondCycle)

      it 'checks for the winner', ->
        expect(@winnerCheck).to.have.been.called

  describe '#checkForWinner', ->
    beforeEach ->
      @stop = sinon.stub @game, 'stop'

    context 'given more than 1 active cycle', ->
      beforeEach ->
        @game.cycles = [
          { state: Cycle.STATES.EXPLODING }
          { state: Cycle.STATES.RACING }
          { state: Cycle.STATES.DEAD }
          { state: Cycle.STATES.RACING }
        ]
        @game.checkForWinner()

      it 'does not stop the game', ->
        expect(@stop).to.not.have.been.called

    context 'given 1 or less active cycles', ->
      beforeEach ->
        @game.cycles = [
          { state: Cycle.STATES.EXPLODING }
          { state: Cycle.STATES.RACING }
          { state: Cycle.STATES.DEAD }
          { state: Cycle.STATES.EXPLODING }
        ]
        @game.checkForWinner()

      it 'stops the game', ->
        expect(@stop).to.have.been.called
