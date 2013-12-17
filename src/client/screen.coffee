exports.clear = ->
  process.stdout.write '\x1b[2J'
  process.stdout.write '\x1b[H'

exports.hideCursor = ->
  process.stdout.write '\x1b[?25l'

exports.showCursor = ->
  process.stdout.write '\x1b[?25h'

exports.setForegroundColor = (color)->
  process.stdout.write "\x1b[3#{color}m"

exports.moveTo = (x, y) ->
  process.stdout.write "\x1b[#{y};#{x}f"
