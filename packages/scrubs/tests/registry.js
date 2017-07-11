const expect = require('chai').expect
const Scrubs = require('../lib').Scrubs

describe('when using scrubs registry', () => {
  const message = 'test'

  it('should register type handler', (done) => {
    const handler = (value) => {
      const handlers = scrubs.get('string')
      expect(handlers.length).to.equal(1)
      expect(value).to.equal(message)
      done()
    }
    const scrubs = new Scrubs()
    scrubs.register('string', handler)
    scrubs.scrub(message)
  })

  it('should clear type handlers', (done) => {
    const handler = (value) => {
      scrubs.clear('string')
      const handlers = scrubs.get('string')
      expect(handlers.length).to.equal(0)
      done()
    }
    const scrubs = new Scrubs()
    scrubs.register('string', handler)
    scrubs.scrub(message)
  })
})
