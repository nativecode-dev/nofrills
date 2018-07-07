import 'mocha'

import { expect } from 'chai'
import { Filter, LincolnRegistry } from '@nofrills/lincoln'

describe('when using LincolnRegistry', () => {

  it('should create instance', () => {
    const registry = new LincolnRegistry<Filter>([['test', () => true]])
    expect(registry.containsKey('test')).to.equal(true)
  })

})
