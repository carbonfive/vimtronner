exports.clear = ->
  process.stdout.write '\x1b[2J'
  process.stdout.write '\x1b[H'

exports.hideCursor = ->
  process.stdout.write '\x1b[?25l'

exports.showCursor = ->
  process.stdout.write '\x1b[?25h'

exports.setForegroundColor = (color)->
  process.stdout.write "\x1b[3#{color}m"

exports.setBackgroundColor = (color)->
  process.stdout.write "\x1b[4#{color}m"

exports.moveTo = (x, y) ->
  process.stdout.write "\x1b[#{y};#{x}f"

exports.resetColors = ->
  process.stdout.write '\x1b[39;49m'

exports.render = (buffer)->
  process.stdout.write buffer

[ LEFT, RIGHT, CENTER ] = [0, 1, 2]

exports.TEXT_ALIGN = { LEFT, RIGHT, CENTER }

exports.print = (string, x, y, alignment=LEFT) ->
  [sx, sy] = switch alignment
    when LEFT then [x, y]
    when RIGHT then [x - string.length + 1, y]
    when CENTER then [x - string.length/2, y]
  exports.moveTo sx, sy
  exports.render string

Object.defineProperty exports, 'columns', get: -> process.stdout.columns
Object.defineProperty exports, 'rows', get: -> process.stdout.rows
Object.defineProperty exports, 'center', get: -> Math.round(@columns/2)
Object.defineProperty exports, 'maxGridRows', get: -> process.stdout.rows - 4
Object.defineProperty exports, 'maxGridColumns', get: -> process.stdout.columns - 2
Object.defineProperty exports, 'maxGridSize',
  get: -> Math.min @maxGridRows, @maxGridColumns
