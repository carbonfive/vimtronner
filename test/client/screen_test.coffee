screen = require '../../src/client/screen'

describe 'screen', ->
  describe 'columns', ->
    it 'returns the number of columns', ->
      expect(screen.columns).to.eq process.stdout.columns

  describe 'rows', ->
    it 'returns the number of rows', ->
      expect(screen.rows).to.eq process.stdout.rows

  describe 'maxGridRows', ->
    it 'returns the maximum size a grid can be vertically', ->
      expect(screen.maxGridRows).to.eq(process.stdout.rows - 4)

  describe 'maxGridColumns', ->
    it 'returns the maximum size a grid can be horizontally', ->
      expect(screen.maxGridColumns).to.eq(process.stdout.columns - 2)

  describe 'maxGridSize', ->
    it 'returns the minimum of the maximum rows or columns', ->
      expect(screen.maxGridSize).to.eq(Math.min(screen.maxGridColumns, screen.maxGridRows))
