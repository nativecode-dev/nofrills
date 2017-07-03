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

  it('should return undefined when no key found', () => {
    const registry = new Registry()
    expect(registry.resolve(KEY)).to.be.undefined
  })

  it('should not register second handler', () => {
    const registry = new Registry()
    registry.register(KEY, VALUE)
    registry.register(KEY, 'test')
    expect(registry.resolve(KEY)).to.equal(VALUE)
  })
})
