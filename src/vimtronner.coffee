program = require 'commander'
fs = require 'fs'
Server = require './server'
Client = require './client'

exports = module.exports = (argv) ->
  program
    .version(JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version)
    .option('-S, --server', 'launches a server')
    .option('-C, --client', 'launches a client')
    .option('-A, --address <address>', 'the address to connect the client', '127.0.0.1')
    .option('-P, --port <port>', 'the port to launch the server or connect the client', 8000)
    .option('-G, --game <game>', 'the game the client wants to join')
    .option('-N, --number <number of players>', 'the number of players required to play (applies to new game only)')
    .option('-Z, --size <size of grid>', 'the size of the game grid (applies to new game only)')
    .parse(argv)

  if program.server
    server = new Server
    server.listen(program.port)

  if program.client
    client = new Client(program.address, program.port)
    if program.game?
      number = parseInt(program.number, 10)
      size = parseInt(program.size, 10)
      client.join({name: program.game, numberOfPlayers: number, gridSize: size})
    else
      client.listGames()
