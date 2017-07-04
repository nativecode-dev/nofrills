const expect = require('chai').expect

const RegistryMap = require('../lib').RegistryMap

describe('when using RegistryMap', () => {
  const KEY1 = 'key-1'
  const KEY2 = 'key-2'

  it('should register multiple items with same key', () => {
    const registry = new RegistryMap()
    registry.register(KEY1, 1)
    registry.register(KEY1, 2)
    registry.register(KEY1, 3)
    expect(registry.resolve(KEY1)).to.deep.equal([1, 2, 3])
  })

  it('should remove single item for given key', () => {
    const registry = new RegistryMap()
    registry.register(KEY1, 1)
    registry.register(KEY1, 2)
    registry.register(KEY1, 3)
    registry.remove(KEY1, 2)
    expect(registry.resolve(KEY1)).to.deep.equal([1, 3])
  })

  it('should reset registry for given key', () => {
    const registry = new RegistryMap()
    registry.register(KEY1, 1)
    registry.register(KEY1, 2)
    registry.register(KEY1, 3)
    registry.reset(KEY1)
    expect(registry.resolve(KEY1)).to.deep.equal([])
  })

  it('should clear all keys', () => {
    const registry = new RegistryMap()
    registry.register(KEY1, 1)
    registry.register(KEY1, 2)
    registry.register(KEY1, 3)
    registry.register(KEY2,'a')
    registry.register(KEY2, 'b')
    registry.register(KEY2, 'c')
    registry.clear()
    expect(registry.resolve(KEY1)).to.deep.equal([])
    expect(registry.resolve(KEY2)).to.deep.equal([])
  })

  it('should do nothing when calling remove with non-existant key', () => {
    const registry = new RegistryMap()
    registry.remove(KEY1)
    expect(registry.resolve(KEY1)).to.deep.equal([])
  })

  it('should do nothing when calling reset on empty registry', () => {
    const registry = new RegistryMap()
    registry.reset(KEY1)
    expect(registry.resolve(KEY1)).to.deep.equal([])
  })
})
