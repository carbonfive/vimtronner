(function() {
  var $, WebClient;

  WebClient = require('./');

  $ = require('jquery');

  $(function() {
    var client;
    client = new WebClient();
    return client.listGames();
  });

}).call(this);

//# sourceMappingURL=../../maps/start.js.map
