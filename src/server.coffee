Game = require('./game')

game = new Game
game.addListener 'game', (gameJSON) ->
  io.sockets.emit 'game', gameJSON

io = require('socket.io').listen 8000

io.sockets.on 'connection', (socket) ->
  cycle = game.addCycle()

  socket.on 'disconnect', ->
    game.removeCycle cycle
