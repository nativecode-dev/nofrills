import 'mocha'

import { expect } from 'chai'
import { Scrubber, Scrubbers, Scrubs } from '@nofrills/scrubs'

import { data } from './data'

describe('when using scrubs registry', () => {
  const message = 'test'

  it('should register type handler', (done) => {
    const scrubs = new Scrubs()

    scrubs.register('string', (value: any) => {
      const scrubbers: Scrubbers | undefined = scrubs.get('string')
      if (scrubbers) {
        expect(scrubbers.length).to.equal(1)
        expect(value).to.equal(message)
      } else {
        expect(scrubbers).to.not.equal(undefined)
      }
      done()
    })

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
    const scrubs = new Scrubs()

    scrubs.register('string', (value: any) => {
      scrubs.clear('string')
      const scrubbers: Scrubbers | undefined = scrubs.get('string')
      if (scrubbers) {
        expect(scrubbers.length).to.equal(0)
      } else {
        expect(scrubbers).to.not.equal(undefined)
      }
      done()
    })

    scrubs.scrub(message)
  })
})
