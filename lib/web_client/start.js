(function() {
  var $, WebClient;

  WebClient = require('./');

  $ = require('jquery');

  $(function() {
    var client;
    client = new WebClient();
    return client.join({
      name: 'dysfunctional-apparatus',
      numberOfPlayers: 2,
      height: 50,
      width: 80
    });
  });

}).call(this);

//# sourceMappingURL=../../maps/start.js.map
