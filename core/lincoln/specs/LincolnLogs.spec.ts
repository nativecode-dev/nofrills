import 'mocha'

import { expect } from 'chai'

import { LincolnLog, Lincoln, Log, LincolnEvents } from '../src'

describe('when working with multiple log writers', () => {

  let logs: Log[] = []

  const options = 'test'

  const CreateLogger = (): LincolnLog => ({
    write: (log: Log): Promise<boolean> => {
      logs.push(log)
      return Promise.resolve(true)
    }
  })

  const Loggers: LincolnLog[] = [
    CreateLogger(),
    CreateLogger(),
    CreateLogger(),
  ]

  beforeEach(() => logs = [])

  it('should write to all debug loggers', done => {
    const sut = new Lincoln(options, Loggers)
    sut.on(LincolnEvents.Log, (_, count) => {
      expect(count).equals(Loggers.length)
      done()
    })
    sut.debug('test')
  })

  it('should write to all error loggers', done => {
    const sut = new Lincoln(options, Loggers)
    sut.on(LincolnEvents.Log, (_, count) => {
      expect(count).equals(Loggers.length)
      done()
    })
    sut.error('test')
  })

  it('should write to all fatal loggers', done => {
    const sut = new Lincoln(options, Loggers)
    sut.on(LincolnEvents.Log, (_, count) => {
      expect(count).equals(Loggers.length)
      done()
    })
    sut.fatal('test')
  })

  it('should write to all info loggers', done => {
    const sut = new Lincoln(options, Loggers)
    sut.on(LincolnEvents.Log, (_, count) => {
      expect(count).equals(Loggers.length)
      done()
    })
    sut.info('test')
  })

  it('should write to all silly loggers', done => {
    const sut = new Lincoln(options, Loggers)
    sut.on(LincolnEvents.Log, (_, count) => {
      expect(count).equals(Loggers.length)
      done()
    })
    sut.silly('test')
  })

  it('should write to all trace loggers', done => {
    const sut = new Lincoln(options, Loggers)
    sut.on(LincolnEvents.Log, (_, count) => {
      expect(count).equals(Loggers.length)
      done()
    })
    sut.trace('test')
  })

  it('should write to all warn loggers', done => {
    const sut = new Lincoln(options, Loggers)
    sut.on(LincolnEvents.Log, (_, count) => {
      expect(count).equals(Loggers.length)
      done()
    })
    sut.warn('test')
  })

})
