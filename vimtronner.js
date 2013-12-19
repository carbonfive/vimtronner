require('coffee-script');
Server = require('./src/server');

var port = process.env.PORT || 8000;
var server = new Server(port);
server.listen();
