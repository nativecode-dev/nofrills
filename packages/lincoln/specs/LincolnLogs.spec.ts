import 'mocha'

import { expect } from 'chai'

import { LincolnLog, Lincoln, Log } from '@nofrills/lincoln'

describe('when working with multiple log writers', () => {

  let logs: Log[] = []

  const options = 'test'

  const CreateLogger = (): LincolnLog => ({
    write: (log: Log): boolean => {
      logs.push(log)
      return true
    }
  })

  const Loggers: LincolnLog[] = [
    CreateLogger(),
    CreateLogger(),
    CreateLogger(),
  ]

  beforeEach(() => logs = [])

  it('should write to all debug loggers', () => {
    const sut = new Lincoln(options, Loggers)
    sut.debug('test')
    expect(logs.length).to.equal(Loggers.length)
  })

  it('should write to all error loggers', () => {
    const sut = new Lincoln(options, Loggers)
    sut.error('test')
    expect(logs.length).to.equal(Loggers.length)
  })

  it('should write to all fatal loggers', () => {
    const sut = new Lincoln(options, Loggers)
    sut.fatal('test')
    expect(logs.length).to.equal(Loggers.length)
  })

  it('should write to all info loggers', () => {
    const sut = new Lincoln(options, Loggers)
    sut.info('test')
    expect(logs.length).to.equal(Loggers.length)
  })

  it('should write to all silly loggers', () => {
    const sut = new Lincoln(options, Loggers)
    sut.silly('test')
    expect(logs.length).to.equal(Loggers.length)
  })

  it('should write to all trace loggers', () => {
    const sut = new Lincoln(options, Loggers)
    sut.trace('test')
    expect(logs.length).to.equal(Loggers.length)
  })

  it('should write to all warn loggers', () => {
    const sut = new Lincoln(options, Loggers)
    sut.warn('test')
    expect(logs.length).to.equal(Loggers.length)
  })

})
