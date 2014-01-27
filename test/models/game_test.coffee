Game = require '../../src/models/game'
Cycle = require '../../src/models/cycle'

describe 'Game', ->
  beforeEach -> @game = new Game(numberOfPlayers: 2)

  describe 'construction', ->
    context 'by default', ->
      beforeEach -> @game = new Game()

      it 'generates a random name', ->
        expect(@game.name).to.exist
        expect(@game.name).to.not.eq((new Game).name)

      it 'has an empty array of cycles', ->
        expect(@game.cycles).to.be.empty

      it 'has a waiting state', ->
        expect(@game.state).to.eq(Game.STATES.WAITING)

      it 'provides an initial count of 3', ->
        expect(@game.count).to.eq(3)

      it 'has 1 player practice mode', ->
        expect(@game.numberOfPlayers).to.eq(1)

      it 'has a grid width of 80', ->
        expect(@game.width).to.eq(80)

      it 'has a grid height of 22', ->
        expect(@game.height).to.eq(22)

    context 'given a name', ->
      beforeEach ->
        @name = 'my-game'
        @game = new Game(name: @name)

      it 'provides a game with that name', ->
        expect(@game.name).to.eq(@name)

    context 'given a number of players', ->
      beforeEach ->
        @numberOfPlayers = 3
        attributes = { name: 'new name', numberOfPlayers: @numberOfPlayers }
        @game = new Game(attributes)

      it 'allows that many players', ->
        expect(@game.numberOfPlayers).to.eq(@numberOfPlayers)

    context 'given a grid width', ->
      beforeEach ->
        @width = 75
        attributes = { name: 'new name', width: @width }
        @game = new Game(attributes)

      it 'sets that grid width', ->
        expect(@game.width).to.eq(@width)

    context 'given a grid height', ->
      beforeEach ->
        @height = 75
        attributes = { name: 'new name', height: @height }
        @game = new Game(attributes)

      it 'sets that grid height', ->
        expect(@game.height).to.eq(@height)

  describe '#addCycle', ->
    beforeEach ->
      @game = new Game(numberOfPlayers: 2)

    context 'when the game is not waiting for players', ->
      beforeEach ->
        @game.state = Game.STATES.STARTED
        @addedCycle = @game.addCycle()

      it 'returns nothing', ->
        expect(@addedCycle).to.not.be.ok

    context 'when the game is waiting', ->
      beforeEach ->
        @game.state = Game.STATES.WAITING
        @emit = sinon.stub(@game, 'emit')
        @start = sinon.stub(@game, 'start')
        @addedCycle = @game.addCycle()

      it 'returns a new cycle', ->
        expect(@addedCycle).to.be.ok
        expect(@addedCycle).to.be.instanceOf(Cycle)

      it 'adds the cycle to list of cycles', ->
        expect(@game.cycles).to.include(@addedCycle)

      it 'emits a game event', ->
        expect(@emit).to.have.been.calledWith('game', @game)

      context 'and when the set number of players is not reached', ->

        it 'does not start the game', ->
          expect(@start).to.not.have.been.called

      context 'and when the set number of players is reached', ->
        beforeEach ->
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
        @gameLoop = sinon.stub(@game, 'loop')
        @clock = sinon.useFakeTimers()
        @game.start()

      afterEach ->
        @clock.restore()

      it 'changes the game state to countdown', ->
        expect(@game.state).to.eq(Game.STATES.COUNTDOWN)

      it 'initiates a game loop to trigger every 100 milliseconds', ->
        @clock.tick(301)
        expect(@gameLoop.callCount).to.eq(4)

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

      context 'and after called 10 times', ->
        beforeEach ->
          @game.countdown() for i in [1..10]

        it 'decreases the count by 1', ->
          expect(@game.count).to.eq(2)

    context 'given a count equal to 1', ->
      beforeEach ->
        @game.count = 1

      context 'and after called 10 times', ->
        beforeEach ->
          @game.countdown() for i in [1..1000]

        it 'changes the game state to started', ->
          expect(@game.state).to.eq(Game.STATES.STARTED)

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
        expect(@json[property]).to.eq(@game[property]) for property in [
          'name', 'state', 'count', 'numberOfPlayers', 'width', 'height'
        ]

      it 'returns the JSON for each cycle in the game', ->
        expect(@json['cycles']).to.have.members (cycle.toJSON() for cycle in @game.cycles)

  describe '#inProgress', ->
    context 'when the game is not in the waiting state', ->
      it 'returns true', ->
        nonWaitingStates = [
          Game.STATES.COUNTDOWN,
          Game.STATES.STATES,
          Game.STATES.FINISHED
        ]
        for state in nonWaitingStates
          @game.state = state
          expect(@game.inProgress).to.be.true

    context 'when the game is in the waiting state', ->
      it 'returns false', ->
        @game.state = Game.STATES.WAITING
        expect(@game.inProgress).to.be.false

  describe 'isPractice', ->
    context 'when a game has only 1 player', ->
      beforeEach -> @game = new Game(numberOfPlayers: 1)

      it 'is considered a practice game', ->
        expect(@game.isPractice).to.be.true

    context 'when a game has more than 1 player', ->
      beforeEach -> @game = new Game(numberOfPlayers: 3)

      it 'is not considered a practice game', ->
        expect(@game.isPractice).to.be.false
