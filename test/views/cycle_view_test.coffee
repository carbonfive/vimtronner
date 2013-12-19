Cycle = require '../../src/models/cycle'
Game = require '../../src/models/game'
CycleView = require '../../src/client/views/cycle_view'
buffer = require '../../src/client/buffer'

describe CycleView, ->
  describe '#character', ->
    context 'given a Cycle that is exploding', ->
      beforeEach ->
        @cycle = new Cycle
        @cycle.state = Cycle.STATES.EXPLODING
        @cycle.walls = []
        @game = sinon.createStubInstance(Game)

      context 'given the Cycle is in frame 1', ->
        beforeEach ->
          @cycle.explosionFrame = 0
          @cycleView = new CycleView(@cycle.toJSON(), @game)

        it 'returns the first explosion character', ->
          character = @cycleView.character()
          expect(character[0]).to.eq(0xE2)
          expect(character[1]).to.eq(0xAC)
          expect(character[2]).to.eq(0xA4)

      context 'given the Cycle is in frame 2', ->
        beforeEach ->
          @cycle.explosionFrame = 1
          @cycleView = new CycleView(@cycle.toJSON(), @game)

        it 'returns the second explosion character', ->
          character = @cycleView.character()
          expect(character[0]).to.eq(0xE2)
          expect(character[1]).to.eq(0x97)
          expect(character[2]).to.eq(0x8E)

    context 'given a Cycle that is dead', ->
      beforeEach ->
        @cycle = new Cycle
        @cycle.state = Cycle.STATES.DEAD
        @cycle.walls = []
        @game = sinon.createStubInstance(Game)
        @cycleView = new CycleView(@cycle.toJSON(), @game)

      it 'returns the exploded character', ->
        character = @cycleView.character()
        expect(character[0]).to.eq(0xF0)
        expect(character[1]).to.eq(0x9F)
        expect(character[2]).to.eq(0x92)
        expect(character[3]).to.eq(0x80)
