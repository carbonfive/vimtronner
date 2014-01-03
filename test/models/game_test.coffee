Game = require '../../src/models/game'
Cycle = require '../../src/models/cycle'

describe Game, ->
  beforeEach -> @game = new Game(name: 'name')

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

      it 'allows 2 players', ->
        expect(@game.numberOfPlayers).to.eq(2)

      it 'has a grid size of 50', ->
        expect(@game.gridSize).to.eq(50)

    context 'given a number of players', ->
      beforeEach ->
        @numberOfPlayers = 3
        attributes = { name: 'new name', numberOfPlayers: @numberOfPlayers }
        @game = new Game(attributes)

      it 'allows that many players', ->
        expect(@game.numberOfPlayers).to.eq(@numberOfPlayers)

    context 'given a grid size', ->
      beforeEach ->
        @gridSize = 75
        attributes = { name: 'new name', gridSize: @gridSize }
        @game = new Game(attributes)

      it 'sets that grid size', ->
        expect(@game.gridSize).to.eq(@gridSize)


  describe '#addCycle', ->
    context 'when called for the first time', ->
      beforeEach ->
        @emit = sinon.stub(@game, 'emit')
        @game.numberOfPlayers = 3
        @start = sinon.stub(@game, 'start')
        @addedCycle = @game.addCycle()

      it 'returns a new cycle', ->
        expect(@addedCycle).to.be.ok
        expect(@addedCycle).to.be.instanceOf(Cycle)

      it 'assigns itself to the cycle', ->
        expect(@addedCycle.game).to.eq(@game)

      it 'adds the cycle to list of cycles', ->
        expect(@game.cycles).to.include(@addedCycle)

      it 'emits a game event', ->
        expect(@emit).to.have.been.calledWith('game', @game)

      context 'and when the set number of players is not reached', ->
        beforeEach ->
          @game.addCycle()

        it 'does not start the game', ->
          expect(@start).to.not.have.been.called

      context 'and when the set number of players is reached', ->
        beforeEach ->
          @game.addCycle()
          @game.addCycle()

        it 'starts the game', ->
          expect(@start).to.have.been.called

  describe '#removeCycle', ->
    context 'given a cycle', ->
      beforeEach ->
        @emit = sinon.stub(@game, 'emit')

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

      it 'does not emit a stopped event', ->
        expect(@emit).to.not.have.been.calledWith('stopped', @game)

    context 'given no cycles', ->
      beforeEach ->
        @emit = sinon.stub(@game, 'emit')
        @firstCycle = sinon.createStubInstance(Cycle)
        @game.cycles = [ @firstCycle ]
        @removedCycle = @game.removeCycle(@firstCycle)

      it 'emits a stopped event', ->
        expect(@emit).to.have.been.calledWith('stopped', @game)

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

    context 'given 1 or less living cycles', ->
      beforeEach ->
        @game.cycles = [
          { state: Cycle.STATES.DEAD }
          { state: Cycle.STATES.RACING }
          { state: Cycle.STATES.DEAD }
          { state: Cycle.STATES.DEAD }
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
        expect(cycle.step).to.have.been.called for cycle in @game.cycles

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

      it 'emits a game event', ->
        expect(@emit).to.have.been.calledWith('restart', @game)

  describe '#restart', ->
    context 'given a finished game', ->
      beforeEach ->
        @game = new Game({state: Game.STATES.FINISHED})
        cycle = new Cycle({game: @game})
        @game.cycles = [cycle]
        @game.restart()

      it 'clears the Cycles array', ->
        expect(@game.cycles).to.be.empty

      it 'sets the State to restarting', ->
        expect(@game.state).to.eq(Game.STATES.RESTARTING)

      it 'sets the count to 3', ->
        expect(@game.count).to.eq(3)

  describe '#determineWinner', ->
    context 'given a single cycle is racing', ->
      beforeEach ->
        @expectedWinnerCycle = sinon.createStubInstance(Cycle)
        @expectedWinnerCycle.state = Cycle.STATES.RACING
        @expectedLoserCycles = (sinon.createStubInstance(Cycle) for i in [1..3])
        for cycle in @expectedLoserCycles
          cycle.state = Cycle.STATES.DEAD
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
        expect(@json[property]).to.eq(@game[property]) for property in ['name', 'state', 'count', 'numberOfPlayers', 'gridSize']

      it 'returns the JSON for each cycle in the game', ->
        expect(@json['cycles']).to.have.members (cycle.toJSON() for cycle in @game.cycles)
