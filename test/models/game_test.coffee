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

      it 'emits a game event', ->
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

  describe '#start', ->
    context 'when called', ->
      beforeEach ->
        @countdown = sinon.stub(@game, 'countdown')
        @gameLoop = sinon.stub(@game, 'loop')
        @clock = sinon.useFakeTimers()
        @game.start()

      afterEach ->
        @clock.restore()

      it 'changes the game state to countdown', ->
        expect(@game.state).to.eq(Game.STATES.COUNTDOWN)

      it 'initiates a countdown to trigger every second', ->
        @clock.tick(3001)
        expect(@countdown).to.have.been.calledThrice

      it 'initiates a game loop to trigger every 100 milliseconds', ->
        @clock.tick(301)
        expect(@gameLoop).to.have.been.calledThrice

  describe '#loop', ->
    beforeEach ->
      @emit = sinon.stub(@game, 'emit')

    context 'when the game has not started', ->
      beforeEach ->
        @game.loop()

      it 'emits a game event', ->
        expect(@emit).to.have.been.calledWith('game', @game)

    context 'when the game has started', ->
      beforeEach ->
        @game.state = Game.STATES.STARTED
        @game.cycles = (sinon.createStubInstance(Cycle) for i in [1..4])
        @checkWinner = sinon.stub(@game, 'checkForWinner')
        @game.loop()

      it 'moves the cycles', ->
        expect(cycle.move).to.have.been.called for cycle in @game.cycles

      it 'checks for cycle collisions', ->
        expect(cycle.checkCollisions).to.have.been.calledWith(@game.cycles) for cycle in @game.cycles

      it 'checks for the winner', ->
        expect(@checkWinner).to.have.been.calledOnce

      it 'emits a game event', ->
        expect(@emit).to.have.been.calledWith('game', @game)

  describe '#countdown', ->
    context 'given a count greater than 1', ->
      beforeEach ->
        expect(@game.count).to.eq(3)
        @game.countdown()

      it 'decreases the count by 1', ->
        expect(@game.count).to.eq(2)

    context 'given a count equal to 1', ->
      beforeEach ->
        @game.count = 1
        @clock = sinon.useFakeTimers()
        @fake = sinon.stub()
        @game.countInterval = setInterval @fake, 100
        @clock.tick(101)
        expect(@fake).to.have.been.calledOnce
        @game.countdown()

      afterEach ->
        @clock.restore()

      it 'changes the game state to started', ->
        expect(@game.state).to.eq(Game.STATES.STARTED)

      it 'calls clearInterval on the countdown', ->
        @clock.tick(201)
        expect(@fake).to.not.have.been.calledTwice

  describe '#stop', ->
    context 'when called', ->
      beforeEach ->
        @clock = sinon.useFakeTimers()
        @determineWinner = sinon.stub(@game, 'determineWinner')
        @emit = sinon.stub(@game, 'emit')

        @fake = sinon.stub()
        @game.gameLoop = setInterval @fake, 100
        @clock.tick(101)
        expect(@fake).to.have.been.calledOnce

        @game.stop()

      afterEach ->
        @clock.restore()

      it 'clears the gameLoop interval', ->
        @clock.tick(201)
        expect(@fake).to.not.have.been.calledTwice

      it 'changes the game state to finished', ->
        expect(@game.state).to.eq(Game.STATES.FINISHED)

      it 'determines the winner', ->
        expect(@determineWinner).to.have.been.calledOnce

      it 'emits a game event', ->
        expect(@emit).to.have.been.calledWith('game', @game)

      it 'emits a stopped event', ->
        expect(@emit).to.have.been.calledWith('stopped', @game)

  describe '#determineWinner', ->
    context 'given a single cycle is racing', ->
      beforeEach ->
        @expectedWinnerCycle = sinon.createStubInstance(Cycle)
        @expectedWinnerCycle.state = Cycle.STATES.RACING
        @expectedLoserCycles = (sinon.createStubInstance(Cycle) for i in [1..3])
        @game.cycles = [
          @expectedLoserCycles[0]
          @expectedLoserCycles[1]
          @expectedWinnerCycle
          @expectedLoserCycles[2]
        ]
        @game.determineWinner()

      it 'makes the racing cycle the winner', ->
        expect(@expectedWinnerCycle.makeWinner).to.have.been.called

      it 'makes the non-racing cycles the losers', ->
        expect(cycle.makeWinner).to.not.have.been.called for cycle in @expectedLoserCycles

  describe '#toJSON', ->
    context 'when called', ->
      beforeEach ->
        @game.cycles = for i in [1..3]
          cycle = sinon.createStubInstance(Cycle)
          cycle.toJSON.returns { foo: i }
          cycle
        @json = @game.toJSON()

      it 'returns the JSON with the game properties', ->
        expect(@json[property]).to.eq(@game[property]) for property in ['name', 'state', 'count']

      it 'returns the JSON for each cycle in the game', ->
        expect(@json['cycles']).to.have.members (cycle.toJSON() for cycle in @game.cycles)
