import 'mocha'

import { expect } from 'chai'
import { Filter, LincolnRegistry } from '../src'

describe('when using LincolnRegistry', () => {
  it('should create instance', () => {
    const registry = new LincolnRegistry<Filter>([['test', () => Promise.resolve(true)]])
    expect(registry.containsKey('test')).to.equal(true)
  })
})
