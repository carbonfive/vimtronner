UP = 0
RIGHT = 1
DOWN = 2
LEFT = 3

buffer = ->
  buf = new Buffer(arguments.length)
  buf.writeUInt8(arguments[index], index) for index in [0...arguments.length]
  buf

CYCLE_CHAR = []
CYCLE_CHAR[UP] = buffer(0xe2, 0x95, 0xbf)
CYCLE_CHAR[DOWN] = buffer(0xE2, 0x95, 0xBD)
CYCLE_CHAR[LEFT] = buffer(0xE2, 0x95, 0xBE)
CYCLE_CHAR[RIGHT] = buffer(0xE2, 0x95, 0xBC)

class Cycle
  constructor: (x, y, direction, color)->
    @x = x
    @y = y
    @direction = direction
    @color = color

  turnLeft: -> @direction = LEFT unless @direction is RIGHT
  turnRight: -> @direction = RIGHT unless @direction is LEFT
  turnUp: -> @direction = UP unless @direction is DOWN
  turnDown: -> @direction = DOWN unless @direction is UP

class Wall
  constructor: (x, y, type, color)->
    @x = x
    @y = y
    @type = type
    @color = color

class Explosion
  constructor: (x, y) ->
    @counter = 30

cycle = new Cycle(1, 1, 1, 4)

clearScreen = ->
  process.stdout.write '\x1b[2J'
  process.stdout.write '\x1b[H'

hideCursor = ->
  process.stdout.write '\x1b[?25l'

showCursor = ->
  process.stdout.write '\x1b[?25h'

setForegroundColor = (color)->
  process.stdout.write "\x1b[3#{color}m"

moveTo = (x, y) ->
  process.stdout.write "\x1b[#{y};#{x}f"

onSigInt = ->
  clearScreen()
  showCursor()
  process.nextTick process.exit

process.on 'SIGINT', onSigInt

process.stdin.setRawMode true
process.stdin.resume()
process.stdin.on 'data', (chunk)->
  switch chunk[0]
    when 3
      process.kill process.pid, 'SIGINT'
    when 106
      cycle.turnDown()
    when 107
      cycle.turnUp()
    when 104
      cycle.turnLeft()
    when 108
      cycle.turnRight()

clearScreen()
hideCursor()

render = ->
  clearScreen()
  setForegroundColor cycle.color
  moveTo(cycle.x, cycle.y)
  process.stdout.write CYCLE_CHAR[cycle.direction]

gameLoop = ->
  switch cycle.direction
    when UP
      cycle.y -= 1 unless cycle.y == 1
    when DOWN
      cycle.y += 1 unless cycle.y == process.stdout.rows
    when LEFT
      cycle.x -= 1 unless cycle.x == 1
    when RIGHT
      cycle.x += 1 unless cycle.x == process.stdout.columns
  render()

render()
setInterval gameLoop, 100
