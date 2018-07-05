import 'mocha'

import { expect } from 'chai'
import { Registry } from '../src/index'

describe('when using Registry', () => {
  const KEY = 'key'
  const VALUE = '<value>'

  it('should add and resolve item', () => {
    const registry = new Registry()
    registry.register(KEY, VALUE)
    const sut: any = registry.resolve(KEY)
    expect(sut).to.equal(VALUE)
  })

  it('should not register second handler', () => {
    const registry = new Registry()
    registry.register(KEY, VALUE)
    registry.register(KEY, 'test')
    const sut: any = registry.resolve(KEY)
    expect(sut).to.equal(VALUE)
  })

  it('should clear registry', () => {
    const registry = new Registry()
    registry.register(KEY, VALUE)
    registry.clear()
    expect(registry.containsKey(KEY)).to.equal(false)
  })

  it('should unregister known key', () => {
    const registry = new Registry()
    registry.register(KEY, VALUE)
    registry.unregister(KEY)
    expect(registry.containsKey(KEY)).to.equal(false)
  })

  it('should resolve nothing when resolving unknown key', () => {
    const registry = new Registry()
    expect(registry.containsKey(KEY)).to.equal(false)
  })

  it('should return keys as iterable', () => {
    const registry = new Registry()
    registry.register('first', 0)
    registry.register('last', 1)
    const sut: string[] = Array.from(registry.keys)
    expect(sut).to.deep.equal(['first', 'last'])
  })

  it('should return values as iterable', () => {
    const registry = new Registry()
    registry.register('first', 0)
    registry.register('last', 1)
    const sut: any[] = Array.from(registry.values)
    expect(sut).to.deep.equal([0, 1])
  })

  it('should return undefined when key does not exist', () => {
    const sut = new Registry()
    expect(sut.resolve(KEY)).to.equal(undefined)
  })
})
