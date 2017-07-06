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

  it('should clear registry', () => {
    const registry = new Registry()
    registry.register(KEY, VALUE)
    registry.clear()
    expect(registry.resolve(KEY)).to.be.undefined
  })

  it('should unregister known key', () => {
    const registry = new Registry()
    registry.register(KEY, VALUE)
    registry.unregister(KEY)
    expect(registry.resolve(KEY)).to.be.undefined
  })

  it('should do nothing when unregistering unknown key', () => {
    const registry = new Registry()
    registry.unregister(KEY, VALUE)
    expect(registry.resolve(KEY)).to.be.undefined
  })

  it('should resolve nothing when resolving unknown key', () => {
    const registry = new Registry()
    expect(registry.resolve(KEY)).to.be.undefined
  })

  it('should return keys as iterable', () => {
    const registry = new Registry()
    registry.register('first', 0)
    registry.register('last', 1)
    expect(Array.from(registry.keys)).to.deep.equal(['first', 'last'])
  })

  it('should return values as iterable', () => {
    const registry = new Registry()
    registry.register('first', 0)
    registry.register('last', 1)
    expect(Array.from(registry.values)).to.deep.equal([0, 1])
  })
})
