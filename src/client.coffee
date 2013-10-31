socket = require('socket.io-client').connect('http://localhost:8000')
VimTronnerBoard = require './vimtronnerboard'

vimTronnerBoard = new VimTronnerBoard

socket.on 'connect', ->
  socket.on 'game', (game) ->
    vimTronnerBoard.loadState(game)
    vimTronnerBoard.render()
