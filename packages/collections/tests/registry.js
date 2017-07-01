const expect = require('chai').expect

const Registry = require('../lib').Registry

describe('when using Registry', () => {
  const KEY = 'key'
  const VALUE = '<value>'
  it('should add and resolve item', () => {
    const registry = new Registry()
    registry.register(KEY, VALUE)
    expect(registry.resolve(KEY)).to.equal(VALUE)
  })
})
