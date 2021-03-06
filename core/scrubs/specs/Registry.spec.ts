import 'mocha'

import { expect } from 'chai'
import { Scrubber, Scrubs } from '../src/Scrubs'

import { data } from './data'

describe('when using scrubs registry', () => {
  const message = 'test'

  it('should register type handler', (done) => {
    const scrubs = new Scrubs()

    scrubs.register('string', (value: any) => {
      const scrubbers = scrubs.get('string') || []
      expect(scrubbers.length).to.equal(1)
      expect(value).to.equal(message)
      done()
      return value
    })

    scrubs.scrub(message)
  })

  it('should register multiple type handlers', () => {
    const dateHandler: Scrubber<Date> = (value: Date) => value
    const stringHandler: Scrubber<string> = (value: string) => `${value}-test`
    const scrubs = new Scrubs()
    const result = scrubs.register('string', stringHandler).register('date', dateHandler).scrub(data.apikey, 'string')

    expect(result).to.equal('s4p3rs3cr3t-test')
  })

  it('should clear type handlers', (done) => {
    const scrubs = new Scrubs()

    scrubs.register('string', (value: any) => {
      scrubs.clear('string')
      const scrubbers = scrubs.get('string') || []
      expect(scrubbers.length).to.equal(0)
      done()
      return value
    })

    scrubs.scrub(message)
  })
})
