Cycle = require '../../src/models/cycle'

describe Cycle, ->
  describe '#navigate', ->
    beforeEach ->
      @cycle = new Cycle
      @turnDown = sinon.stub @cycle, 'turnDown'
      @turnUp = sinon.stub @cycle, 'turnUp'
      @turnLeft = sinon.stub @cycle, 'turnLeft'
      @turnRight = sinon.stub @cycle, 'turnRight'

    context 'given 106', ->
      beforeEach -> @cycle.navigate(106)

      it 'turns the cycle down', ->
        expect(@turnDown).to.have.been.calledOnce

      it 'does not turn the cycle up', ->
        expect(@turnUp).to.not.have.been.called

    context 'given 107', ->
      beforeEach -> @cycle.navigate(107)

      it 'turns the cycle up', ->
        expect(@turnUp).to.have.been.calledOnce

      it 'does not turn the cycle down', ->
        expect(@turnDown).to.not.have.been.called

    context 'given 104', ->
      beforeEach -> @cycle.navigate(104)

      it 'turns the cycle left', ->
        expect(@turnLeft).to.have.been.calledOnce

      it 'does not turn the cycle up', ->
        expect(@turnUp).to.not.have.been.called

    context 'given 108', ->
      beforeEach -> @cycle.navigate(108)

      it 'turns the cycle right', ->
        expect(@turnRight).to.have.been.calledOnce

      it 'does not turn the cycle up', ->
        expect(@turnUp).to.not.have.been.called

  describe '#step', ->
    context 'given the cycle is exploding', ->
      beforeEach ->
        @cycle = new Cycle({state: Cycle.STATES.EXPLODING})

      context 'given the cycle has been exploding for less than 30 ticks', ->
        it 'increments the explosion frame', ->
          @cycle.step()
          expect(@cycle.explosionFrame).to.eq(1)

      context 'given the cycle has been exploding for more than 30 ticks', ->
        beforeEach ->
          @cycle.explosionFrame = 31

        it 'sets the state to DEAD', ->
          @cycle.step()
          expect(@cycle.state).to.eq(Cycle.STATES.DEAD)
