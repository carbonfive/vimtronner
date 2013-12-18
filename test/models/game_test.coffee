Game = require '../../src/models/game'
Cycle = require '../../src/models/cycle'

describe Game, ->
  describe 'construction', ->
    context 'given a name', ->

      beforeEach -> @game = new Game('name')

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
        @game = new Game('name')
        @emit = sinon.spy(@game, 'emit')
        @addedCycle = @game.addCycle()

      it 'returns a new cycle', ->
        expect(@addedCycle).to.be.ok
        expect(@addedCycle).to.be.instanceOf(Cycle)

      it 'adds the cycle to list of cycles', ->
        expect(@game.cycles).to.include(@addedCycle)

      it 'emits the game state', ->
        expect(@emit).to.have.been.called

      context 'and when called again', ->
        beforeEach ->
          @start = sinon.spy(@game, 'start')
          @game.addCycle()

        it 'starts the game', ->
          expect(@start).to.have.been.called
