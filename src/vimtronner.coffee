directions = require './directions'
buffer = require './buffer'
Cycle = require './cycle'
screen = require './screen'

CYCLE_CHAR = []
CYCLE_CHAR[directions.UP] = buffer(0xe2, 0x95, 0xbf)
CYCLE_CHAR[directions.DOWN] = buffer(0xE2, 0x95, 0xBD)
CYCLE_CHAR[directions.LEFT] = buffer(0xE2, 0x95, 0xBE)
CYCLE_CHAR[directions.RIGHT] = buffer(0xE2, 0x95, 0xBC)

cycle = new Cycle(1, 1, 1, 4)

onSigInt = ->
  screen.clear()
  screen.showCursor()
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

screen.clear()
screen.hideCursor()

render = ->
  screen.clear()
  screen.setForegroundColor cycle.color
  screen.moveTo(cycle.x, cycle.y)
  process.stdout.write CYCLE_CHAR[cycle.direction]

gameLoop = ->
  switch cycle.direction
    when directions.UP
      cycle.y -= 1 unless cycle.y == 1
    when directions.DOWN
      cycle.y += 1 unless cycle.y == process.stdout.rows
    when directions.LEFT
      cycle.x -= 1 unless cycle.x == 1
    when directions.RIGHT
      cycle.x += 1 unless cycle.x == process.stdout.columns
  render()

render()
setInterval gameLoop, 100
