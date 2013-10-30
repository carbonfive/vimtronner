directions = require './directions'
Wall = require './wall'
buffer = require './buffer'

CYCLE_CHAR = []
CYCLE_CHAR[directions.UP] = buffer(0xe2, 0x95, 0xbf)
CYCLE_CHAR[directions.DOWN] = buffer(0xE2, 0x95, 0xBD)
CYCLE_CHAR[directions.LEFT] = buffer(0xE2, 0x95, 0xBE)
CYCLE_CHAR[directions.RIGHT] = buffer(0xE2, 0x95, 0xBC)

CYCLE_EXPLOSION = buffer(0xE2, 0xAC, 0xA4)

CYCLE_STATES = {
  RACING: 0,
  EXPLODING: 1,
  DEAD: 2
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
  constructor: (@x, @y, @direction, @color)->
    @walls = []

  character: ->
    if @state == CYCLE_STATES.EXPLODING
      CYCLE_EXPLOSION
    else
      CYCLE_CHAR[@direction]

  move: ->
    unless @state == CYCLE_STATES.EXPLODING
      @walls.push new Wall(@x, @y, @nextWallType(), @direction)
      switch @direction
        when directions.UP
          @y -= 1 unless @y == 1
        when directions.DOWN
          @y += 1 unless @y == process.stdout.rows
        when directions.LEFT
          @x -= 1 unless @x == 1
        when directions.RIGHT
          @x += 1 unless @x == process.stdout.columns

  checkCollisionWith: (object)->
    @x == object.x and @y == object.y

  checkCollisions: (cycles)->
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
    @state_counter = 30

  nextWallType: ->
    lastWallDirection = @walls[@walls.length - 1]?.direction ? @direction
    DIRECTIONS_TO_WALL_TYPES[lastWallDirection][@direction]

  turnLeft: -> @direction = directions.LEFT unless @direction is directions.RIGHT
  turnRight: -> @direction = directions.RIGHT unless @direction is directions.LEFT
  turnUp: -> @direction = directions.UP unless @direction is directions.DOWN
  turnDown: -> @direction = directions.DOWN unless @direction is directions.UP

module.exports = Cycle
