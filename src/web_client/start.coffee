WebClient = require './'
$ = require 'jquery'

$ ->
  client = new WebClient()
  client.listGames()
