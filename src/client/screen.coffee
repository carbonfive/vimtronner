transformationStack = [{x: 0, y: 0}]

Object.defineProperty module.exports, 'transformationStackTail', get: ->
  [rest...,tail] = transformationStack
  tail

transform = (x,y)->
  transformationStack.reduce(
    ((point, transform)->
      {
        x: point.x + transform.x
        y: point.y + transform.y
      }
    ),
    { x, y }
  )

module.exports.save = ->
  transformationStack.push { x: 0, y: 0}

module.exports.restore = ->
  transformationStack.pop() if transformationStack.length > 1

module.exports.transform = (x,y)->
  module.exports.transformationStackTail.x = x
  module.exports.transformationStackTail.y = y

module.exports.clear = ->
  process.stdout.write '\x1b[2J'
  process.stdout.write '\x1b[H'

module.exports.hideCursor = ->
  process.stdout.write '\x1b[?25l'

module.exports.showCursor = ->
  process.stdout.write '\x1b[?25h'

module.exports.setForegroundColor = (color)->
  process.stdout.write "\x1b[3#{color}m"

module.exports.setBackgroundColor = (color)->
  process.stdout.write "\x1b[4#{color}m"

module.exports.moveTo = (x, y) ->
  { x, y } = transform(x,y)
  process.stdout.write "\x1b[#{y};#{x}f"

module.exports.resetColors = ->
  process.stdout.write '\x1b[39;49m'

module.exports.resetAll = ->
  process.stdout.write '\x1b[0m'

module.exports.render = (buffer)->
  process.stdout.write buffer

[ LEFT, RIGHT, CENTER ] = [0, 1, 2]

module.exports.TEXT_ALIGN = { LEFT, RIGHT, CENTER }

module.exports.print = (string, x, y, alignment=LEFT) ->
  [sx, sy] = switch alignment
    when LEFT then [x, y]
    when RIGHT then [x - string.length + 1, y]
    when CENTER then [x - Math.round(string.length/2), y]
  module.exports.moveTo sx, sy
  module.exports.render string

module.exports.clearRect = (x,y,width,height)->
  row = (' ' for i in [1..width]).join ''
  for i in [0...height]
    module.exports.moveTo x, y + i
    module.exports.render row

Object.defineProperty module.exports, 'columns', get: -> process.stdout.columns
Object.defineProperty module.exports, 'rows', get: -> process.stdout.rows
Object.defineProperty module.exports, 'center', get: ->
  { x: Math.round(@columns/2), y: Math.round(@rows/2) }
Object.defineProperty module.exports, 'maxGridRows', get: -> process.stdout.rows - 2
Object.defineProperty module.exports, 'maxGridColumns', get: -> process.stdout.columns
Object.defineProperty module.exports, 'maxGridSize',
  get: -> Math.min @maxGridRows, @maxGridColumns
