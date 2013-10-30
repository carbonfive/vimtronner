directions = require './directions'
buffer = require './buffer'
Cycle = require './cycle'
screen = require './screen'

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
  screen.setForegroundColor cycle.color
  for wall in cycle.walls
    do (wall) ->
      screen.moveTo(wall.x, wall.y)
      process.stdout.write wall.character()
  screen.moveTo(cycle.x, cycle.y)
  process.stdout.write cycle.character()

gameLoop = ->
  cycle.move()
  render()

render()
setInterval gameLoop, 100
