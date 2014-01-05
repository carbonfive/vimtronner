class ClientGameSocket
  constructor: (@socket, @game, @cycle)->
    @socket.on 'movement', @onMovement
    @socket.on 'disconnect', @onLeave
    @socket.on 'leave', @onLeave
    @socket.join @game.name
    @socket.emit 'cycle', @cycle

  onLeave: =>
    @socket.leave @game.name
    @game.removeCycle @cycle

  onMovement: (movement)=> @cycle.navigate(movement)

module.exports = ClientGameSocket
