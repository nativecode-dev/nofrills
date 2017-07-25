import * as mocha from 'mocha'

import { expect } from 'chai'
import { Scrubber, Scrubs } from '../src/index'

import { data } from './artifacts/data'

describe('when using scrubs registry', () => {
  const message = 'test'

  it('should register type handler', (done) => {
    const handler = (value: any) => {
      const handlers = scrubs.get('string')
      expect(handlers.length).to.equal(1)
      expect(value).to.equal(message)
      done()
    }
    const scrubs = new Scrubs()
    scrubs.register('string', handler)
    scrubs.scrub(message)
  })

  it('should register multiple type handlers', () => {
    const dateHandler: Scrubber<Date> = (value: Date) => value
    const stringHandler: Scrubber<string> = (value: string) => `${value}-test`
    const scrubs = new Scrubs()
    const result = scrubs
      .register('string', stringHandler)
      .register('date', dateHandler)
      .scrub(data.apikey)
    expect(result).to.equal('<SECRET>-test')
  })

  it('should clear type handlers', (done) => {
    const handler = (value: any) => {
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
