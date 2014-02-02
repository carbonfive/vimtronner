require '../define_property'
playerAttributes = require './player_attributes'
directions = require './directions'
Wall = require './wall'

CYCLE_STATES = {
  RACING: 0
  EXPLODING: 1
  DEAD: 2
  WINNER: 3
  INSERTING: 4
}

DIRECTIONS_TO_WALL_TYPES = {}
DIRECTIONS_TO_WALL_TYPES[directions.UP] = {}
DIRECTIONS_TO_WALL_TYPES[directions.UP][directions.UP] = Wall.WALL_TYPES.NORTH_SOUTH
DIRECTIONS_TO_WALL_TYPES[directions.UP][directions.DOWN] = Wall.WALL_TYPES.NORTH_SOUTH
DIRECTIONS_TO_WALL_TYPES[directions.UP][directions.LEFT] = Wall.WALL_TYPES.NORTH_EAST
DIRECTIONS_TO_WALL_TYPES[directions.UP][directions.RIGHT] = Wall.WALL_TYPES.NORTH_WEST
DIRECTIONS_TO_WALL_TYPES[directions.DOWN] = {}
DIRECTIONS_TO_WALL_TYPES[directions.DOWN][directions.UP] = Wall.WALL_TYPES.NORTH_SOUTH
DIRECTIONS_TO_WALL_TYPES[directions.DOWN][directions.DOWN] = Wall.WALL_TYPES.NORTH_SOUTH
DIRECTIONS_TO_WALL_TYPES[directions.DOWN][directions.LEFT] = Wall.WALL_TYPES.SOUTH_EAST
DIRECTIONS_TO_WALL_TYPES[directions.DOWN][directions.RIGHT] = Wall.WALL_TYPES.SOUTH_WEST
DIRECTIONS_TO_WALL_TYPES[directions.LEFT] = {}
DIRECTIONS_TO_WALL_TYPES[directions.LEFT][directions.UP] = Wall.WALL_TYPES.SOUTH_WEST
DIRECTIONS_TO_WALL_TYPES[directions.LEFT][directions.DOWN] = Wall.WALL_TYPES.NORTH_WEST
DIRECTIONS_TO_WALL_TYPES[directions.LEFT][directions.LEFT] = Wall.WALL_TYPES.EAST_WEST
DIRECTIONS_TO_WALL_TYPES[directions.LEFT][directions.RIGHT] = Wall.WALL_TYPES.EAST_WEST
DIRECTIONS_TO_WALL_TYPES[directions.RIGHT] = {}
DIRECTIONS_TO_WALL_TYPES[directions.RIGHT][directions.UP] = Wall.WALL_TYPES.SOUTH_EAST
DIRECTIONS_TO_WALL_TYPES[directions.RIGHT][directions.DOWN] = Wall.WALL_TYPES.NORTH_EAST
DIRECTIONS_TO_WALL_TYPES[directions.RIGHT][directions.LEFT] = Wall.WALL_TYPES.EAST_WEST
DIRECTIONS_TO_WALL_TYPES[directions.RIGHT][directions.RIGHT] = Wall.WALL_TYPES.EAST_WEST

class Cycle
  @STATES: CYCLE_STATES

  constructor: (attributes={})->
    @player = attributes.player ? playerAttributes[0]
    @x = 0
    @y = 0
    @direction = attributes.direction ? attributes.player?.direction ? directions.LEFT
    @number = attributes.number ? attributes.player?.number ? 1
    @color = attributes.color ? attributes.player?.color ? 1
    @state = CYCLE_STATES.RACING
    @game = attributes.game
    @explosionFrame = 0
    @ready = false
    @walls = if attributes.walls?
      (new Wall(wall) for wall in attributes.walls)
    else
      []

  @property 'inserting', get: ->
    @state == CYCLE_STATES.INSERTING

  @property 'racing', get: ->
    @state == CYCLE_STATES.RACING

  @property 'active', get: ->
    @inserting or @racing

  navigate: (movement) ->
    if @ready and @game.isStarted
      @game.touch()
      switch movement
        when 27
          @state = CYCLE_STATES.RACING if @active
        when 105
          @state = CYCLE_STATES.INSERTING if @active
        when 106
          @turnDown() unless @inserting
        when 107
          @turnUp() unless @inserting
        when 104
          @turnLeft() unless @inserting
        when 108
          @turnRight() unless @inserting
    else if @game.isWaiting or @game.isRestarting or @game.isFinished
      @game.touch()
      switch movement
        when 27
          @ready = false
        when 105
          @ready = true
          @state = CYCLE_STATES.RACING

  step: ->
    switch @state
      when CYCLE_STATES.EXPLODING
        @explosionStep()
      when CYCLE_STATES.DEAD
        return
      else
        @movingStep()

  movingStep: ->
    if @inserting
      @addWall()

    switch @direction
      when directions.UP
        @y -= 1 unless @y == 0
      when directions.DOWN
        @y += 1 unless @y == (@game.height - 1)
      when directions.LEFT
        @x -= 1 unless @x == 0
      when directions.RIGHT
        @x += 1 unless @x == (@game.width - 1)

  addWall: ->
    @walls.push new Wall({
      x: @x
      y: @y
      type: @nextWallType()
      direction: @direction
    })

  explosionStep: =>
    if @explosionFrame <= 10
      @explosionFrame++
    else
      @state = CYCLE_STATES.DEAD

  checkCollisionWith: (object)->
    @x == object.x and @y == object.y

  checkCollisions: (cycles)->
    if @state == CYCLE_STATES.RACING or @state == CYCLE_STATES.INSERTING
      bottomWallY = (@game.height - 1)
      rightWallX = (@game.width - 1)
      if (@y <= 0 or @x <= 0 or @y >= bottomWallY or @x >= rightWallX)
        @triggerCollision()
        return
      for cycle in cycles
        unless cycle is @
          if @checkCollisionWith(cycle)
            @triggerCollision()
            return
        for wall in cycle.walls
          if @checkCollisionWith(wall)
            @triggerCollision()
            return

  triggerCollision: ->
    @state = CYCLE_STATES.EXPLODING
    @walls.length = 0

  nextWallType: ->
    lastWallDirection = @walls[@walls.length - 1]?.direction ? @direction
    DIRECTIONS_TO_WALL_TYPES[lastWallDirection][@direction]

  turnLeft: -> @direction = directions.LEFT unless @direction is directions.RIGHT
  turnRight: -> @direction = directions.RIGHT unless @direction is directions.LEFT
  turnUp: -> @direction = directions.UP unless @direction is directions.DOWN
  turnDown: -> @direction = directions.DOWN unless @direction is directions.UP

  makeWinner: ->
    @state = Cycle.STATES.WINNER

  toJSON: -> {
    number: @number
    x: @x
    y: @y
    color: @color
    state: @state
    direction: @direction
    explosionFrame: @explosionFrame
    walls: (wall.toJSON() for wall in @walls)
    ready: @ready
  }

module.exports = Cycle
