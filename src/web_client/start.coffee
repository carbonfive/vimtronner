WebClient = require './'
$ = require 'jquery'

$ ->
  client = new WebClient()
  client.join
    name: 'dysfunctional-apparatus',
    numberOfPlayers: 2,
    height: 50,
    width: 80

