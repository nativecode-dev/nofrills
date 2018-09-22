import expect from './expect'

import { Tap } from '../src/Tap'

describe('when using Tap', () => {
  it('should return value after executing callback', () => {
    const resolved = Promise.resolve(true)
    let resolveCount = 0
    expect(Tap(resolved).after(() => resolveCount++)).to.eventually.be.true
  })
})
