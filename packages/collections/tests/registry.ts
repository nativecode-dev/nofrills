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

  it('should return undefined when no key found', () => {
    const registry = new Registry()
    const sut: any = registry.resolve(KEY)
    expect(sut).to.equal(undefined)
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
    const sut: any = registry.resolve(KEY)
    expect(sut).to.equal(undefined)
  })

  it('should unregister known key', () => {
    const registry = new Registry()
    registry.register(KEY, VALUE)
    registry.unregister(KEY, VALUE)
    const sut: any = registry.resolve(KEY)
    expect(sut).to.equal(undefined)
  })

  it('should do nothing when unregistering unknown key', () => {
    const registry = new Registry()
    registry.unregister(KEY, VALUE)
    const sut: any = registry.resolve(KEY)
    expect(sut).to.equal(undefined)
  })

  it('should resolve nothing when resolving unknown key', () => {
    const registry = new Registry()
    const sut: any = registry.resolve(KEY)
    expect(sut).to.equal(undefined)
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
})
