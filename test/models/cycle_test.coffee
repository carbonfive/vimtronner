directions = require '../../src/models/directions'
Cycle = require '../../src/models/cycle'
Wall = require '../../src/models/wall'
Game = require '../../src/models/game'

describe 'Cycle', ->
  describe '#navigate', ->
    beforeEach ->
      game = new Game(name: 'game')
      @cycle = new Cycle({game: game})
      @turnDown = sinon.stub @cycle, 'turnDown'
      @turnUp = sinon.stub @cycle, 'turnUp'
      @turnLeft = sinon.stub @cycle, 'turnLeft'
      @turnRight = sinon.stub @cycle, 'turnRight'

    context 'cycle is not insert mode', ->
      beforeEach ->
        @cycle.state = Cycle.STATES.RACING

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

      context 'given 27', ->
        beforeEach -> @cycle.navigate(27)

        it 'leaves insert mode', ->
          expect(@cycle.state).to.eq Cycle.STATES.RACING

      context 'given 105', ->
        beforeEach -> @cycle.navigate(105)

        it 'enters insert mode', ->
          expect(@cycle.state).to.eq Cycle.STATES.INSERTING

    context 'cycle is dead', ->
      beforeEach ->
        @cycle.state = Cycle.STATES.DEAD

      context 'given 27', ->
        beforeEach -> @cycle.navigate(27)

        it 'stays dead', ->
          expect(@cycle.state).to.eq Cycle.STATES.DEAD

      context 'given 105', ->
        beforeEach -> @cycle.navigate(105)

        it 'stays dead', ->
          expect(@cycle.state).to.eq Cycle.STATES.DEAD

    context 'cycle is in insert mode', ->
      beforeEach ->
        @cycle.state = Cycle.STATES.INSERTING
        @cycle.navigate(104)
        @cycle.navigate(106)
        @cycle.navigate(107)
        @cycle.navigate(108)

      it 'does not allow a change of direction', ->
        expect(@turnDown).to.not.have.been.called
        expect(@turnUp).to.not.have.been.called
        expect(@turnLeft).to.not.have.been.called
        expect(@turnRight).to.not.have.been.called


  describe '#step', ->
    beforeEach ->
      gridSize = Math.floor(Math.random() * 100) + 20
      @game = new Game({name: 'game', gridSize: gridSize})
      @cycle = new Cycle({direction: directions.RIGHT, game: @game})

    context 'given the cycle is exploding', ->
      beforeEach ->
        @cycle.state = Cycle.STATES.EXPLODING

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

    context 'given the cycle is inserting', ->
      beforeEach ->
        @cycle.state = Cycle.STATES.INSERTING

      it 'creates a new wall', ->
        @cycle.step()
        expect(@cycle.walls).to.not.be.empty

    context 'given the cycle is racing', ->
      beforeEach ->
        @cycle.state = Cycle.STATES.RACING

      it 'does not create a new wall', ->
        @cycle.step()
        expect(@cycle.walls).to.be.empty

    context 'given the cycle has hit the right wall', ->
      beforeEach ->
        @oldX = (@game.gridSize - 1)
        @cycle.x = @oldX

      it 'does not increment the x', ->
        @cycle.step()
        expect(@cycle.x).to.eq(@oldX)

    context 'given the cycle has hit the bottom wall', ->
      beforeEach ->
        @oldY = (@game.gridSize - 1)
        @cycle.direction = directions.DOWN
        @cycle.y = @oldY

      it 'does not increment the y', ->
        @cycle.step()
        expect(@cycle.y).to.eq(@oldY)


  describe '#checkCollisions', ->
    beforeEach ->
      gridSize = Math.floor(Math.random() * 100) + 20
      @game = new Game(name: 'game', gridSize: gridSize)
      @cycle = new Cycle({
        direction: directions.RIGHT,
        state: Cycle.STATES.RACING,
        game: @game
      })
      @triggerCollision = sinon.stub @cycle, 'triggerCollision'

    context 'given the cycle has hit the right arena wall', ->
      beforeEach ->
        @cycle.x = (@game.gridSize - 1)
        @cycle.checkCollisions([])

      it 'triggers a collision', ->
        expect(@triggerCollision).to.have.been.calledOnce

    context 'given the cycle has hit the left arena wall', ->
      beforeEach ->
        @cycle.x = 0
        @cycle.checkCollisions([])

      it 'triggers a collision', ->
        expect(@triggerCollision).to.have.been.calledOnce

    context 'given the cycle has hit the top arena wall', ->
      beforeEach ->
        @cycle.y = 0
        @cycle.checkCollisions([])

      it 'triggers a collision', ->
        expect(@triggerCollision).to.have.been.calledOnce

    context 'given the cycle has hit the bottom arena wall', ->
      beforeEach ->
        @cycle.y = (@game.gridSize - 1)
        @cycle.checkCollisions([])

      it 'triggers a collision', ->
        expect(@triggerCollision).to.have.been.calledOnce
