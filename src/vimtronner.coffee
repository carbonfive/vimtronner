directions = require './directions'
Cycle = require './cycle'
screen = require './screen'

cycles = []
cycles.push new Cycle(1, 1, 1, 4)
cycles.push new Cycle(process.stdout.columns, process.stdout.rows, directions.LEFT, 1)

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

render = ->
  screen.clear()
  for cycle in cycles
    screen.setForegroundColor cycle.color
    for wall in cycle.walls
      screen.moveTo(wall.x, wall.y)
      process.stdout.write wall.character()
  for cycle in cycles
    screen.setForegroundColor cycle.color
    screen.moveTo(cycle.x, cycle.y)
    process.stdout.write cycle.character()

gameLoop = ->
  for cycle in cycles
    cycle.move()
    cycle.checkCollisions(cycles)
  render()

render()
setInterval gameLoop, 100
