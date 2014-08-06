WebClient = require './'
$ = require 'jquery'

$ ->
  client = new WebClient()
  client.join
    name: 'dysfunctional-apparatus',
    numberOfPlayers: 2,
    height: 100,
    width: 100

