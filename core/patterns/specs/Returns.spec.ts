import expect from './expect'

import { Returns } from '../src/Returns'

describe('when using Returns', () => {
  it('should return value after executing callback', () => {
    let called = false
    const result = true
    expect(Returns(result).after(() => (called = true))).to.be.true
    expect(called).to.be.true
  })
})
