socket = require('socket.io-client').connect('http://localhost:8000')

socket.on 'connect', ->
  socket.on 'game', (game) ->
    console.log game
