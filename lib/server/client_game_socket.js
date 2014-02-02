(function() {
  var ClientGameSocket,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ClientGameSocket = (function() {
    function ClientGameSocket(socket, game, cycle) {
      this.socket = socket;
      this.game = game;
      this.cycle = cycle;
      this.onMovement = __bind(this.onMovement, this);
      this.onLeave = __bind(this.onLeave, this);
      this.socket.on('movement', this.onMovement);
      this.socket.on('disconnect', this.onLeave);
      this.socket.on('leave', this.onLeave);
      this.socket.join(this.game.name);
      this.socket.emit('cycle', this.cycle);
    }

    ClientGameSocket.prototype.onLeave = function() {
      this.socket.leave(this.game.name);
      return this.game.removeCycle(this.cycle);
    };

    ClientGameSocket.prototype.onMovement = function(movement) {
      this.game.touch();
      return this.cycle.navigate(movement);
    };

    return ClientGameSocket;

  })();

  module.exports = ClientGameSocket;

}).call(this);

//# sourceMappingURL=../../maps/client_game_socket.js.map
