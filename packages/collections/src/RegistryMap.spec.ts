import 'mocha'

import { expect } from 'chai'
import { RegistryMap } from './index'

describe('when using RegistryMap', () => {
  const KEY1 = 'key-1'
  const KEY2 = 'key-2'

  it('should register multiple items with same key', () => {
    const registry = new RegistryMap()
    registry.register(KEY1, 1)
    registry.register(KEY1, 2)
    registry.register(KEY1, 3)
    const sut: any = registry.resolve(KEY1)
    expect(sut).to.deep.equal([1, 2, 3])
  })

  it('should remove single item for given key', () => {
    const registry = new RegistryMap()
    registry.register(KEY1, 1)
    registry.register(KEY1, 2)
    registry.register(KEY1, 3)
    registry.remove(KEY1, 2)
    const sut: any = registry.resolve(KEY1)
    expect(sut).to.deep.equal([1, 3])
  })

  it('should reset registry for given key', () => {
    const registry = new RegistryMap()
    registry.register(KEY1, 1)
    registry.register(KEY1, 2)
    registry.register(KEY1, 3)
    registry.reset(KEY1)
    const sut: any = registry.resolve(KEY1)
    expect(sut).to.deep.equal([])
  })

  it('should clear all keys', () => {
    const registry = new RegistryMap()
    registry.register(KEY1, 1)
    registry.register(KEY1, 2)
    registry.register(KEY1, 3)
    registry.register(KEY2, 'a')
    registry.register(KEY2, 'b')
    registry.register(KEY2, 'c')
    registry.clear()
    const sut1: any = registry.resolve(KEY1)
    expect(sut1).to.deep.equal([])
    const sut2: any = registry.resolve(KEY2)
    expect(sut2).to.deep.equal([])
  })

  it('should do nothing when calling remove with non-existant key', () => {
    const registry = new RegistryMap()
    registry.remove(KEY1, 1)
    const sut: any = registry.resolve(KEY1)
    expect(sut).to.deep.equal([])
  })

  it('should do nothing when calling reset on empty registry', () => {
    const registry = new RegistryMap()
    registry.reset(KEY1)
    const sut: any = registry.resolve(KEY1)
    expect(sut).to.deep.equal([])
  })
})
