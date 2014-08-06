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
      height: 100,
      width: 100
    });
  });

}).call(this);

//# sourceMappingURL=../../maps/start.js.map
