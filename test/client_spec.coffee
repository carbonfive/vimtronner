Client = require '../src/client'
Cycle = require '../src/models/cycle'

describe Client, ->
  beforeEach ->
    @client = new Client

  describe '#storeCycle', ->
    context 'given a cycle', ->
      beforeEach ->
        @cycle = sinon.createStubInstance(Cycle)
        @client.storeCycle @cycle

      it "stores it as the player's cycle", ->
        expect(@client.cycle).to.eq @cycle
