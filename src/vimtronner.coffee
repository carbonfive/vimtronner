directions = require './directions'
Cycle = require './cycle'
screen = require './screen'
buffer = require './buffer'

ARENA_WALL_CHARS = {
  HORIZONTAL: buffer(0xE2, 0x95, 0x90)
  VERTICAL: buffer(0xE2, 0x95, 0x91)
  TOP_LEFT_CORNER: buffer(0xE2, 0x95, 0x94)
  TOP_RIGHT_CORNER: buffer(0xE2, 0x95, 0x97)
  BOTTOM_LEFT_CORNER: buffer(0xE2, 0x95, 0x9A)
  BOTTOM_RIGHT_CORNER: buffer(0xE2, 0x95, 0x9D)
}


cycles = []
cycles.push new Cycle(1, 1, 1, 4)
cycles.push new Cycle(47, 47, directions.LEFT, 1)

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
      cycles[0].turnDown()
    when 107
      cycles[0].turnUp()
    when 104
      cycles[0].turnLeft()
    when 108
      cycles[0].turnRight()
    when 115
      cycles[1].turnDown()
    when 100
      cycles[1].turnUp()
    when 97
      cycles[1].turnLeft()
    when 102
      cycles[1].turnRight()

screen.clear()
screen.hideCursor()

renderArena = ->
  screen.setForegroundColor 3
  screen.moveTo(1,1)
  process.stdout.write ARENA_WALL_CHARS.TOP_LEFT_CORNER
  for x in [2..49]
    screen.moveTo x, 1
    process.stdout.write ARENA_WALL_CHARS.HORIZONTAL
  screen.moveTo 50, 1
  process.stdout.write ARENA_WALL_CHARS.TOP_RIGHT_CORNER
  for y in [2..49]
    screen.moveTo 50, y
    process.stdout.write ARENA_WALL_CHARS.VERTICAL
  screen.moveTo 50, 50
  process.stdout.write ARENA_WALL_CHARS.BOTTOM_RIGHT_CORNER
  for x in [49..2]
    screen.moveTo x, 50
    process.stdout.write ARENA_WALL_CHARS.HORIZONTAL
  screen.moveTo 1, 50
  process.stdout.write ARENA_WALL_CHARS.BOTTOM_LEFT_CORNER
  for y in [49..2]
    screen.moveTo 1, y
    process.stdout.write ARENA_WALL_CHARS.VERTICAL

render = ->
  screen.clear()
  renderArena()
  for cycle in cycles
    screen.setForegroundColor cycle.color
    for wall in cycle.walls
      screen.moveTo(wall.x + 1, wall.y + 1)
      process.stdout.write wall.character()
  for cycle in cycles
    screen.setForegroundColor cycle.color
    screen.moveTo(cycle.x + 1, cycle.y + 1)
    process.stdout.write cycle.character()


gameLoop = ->
  for cycle in cycles
    cycle.move()
    cycle.checkCollisions(cycles)
  render()

render()
setInterval gameLoop, 100
