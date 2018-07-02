import 'mocha'

import { expect } from 'chai'

import { LincolnLog, LincolnLogs } from '../src/index'

describe('when working with multiple log writers', () => {

  const Counts: any = {
    debug: 0,
    error: 0,
    fatal: 0,
    info: 0,
    silly: 0,
    trace: 0,
    warn: 0,
  }

  const CountLogger = (): LincolnLog => ({
    debug: (...parameters: any[]): void => Counts.debug = Counts.debug + 1,
    error: (...parameters: any[]): void => Counts.error = Counts.error + 1,
    fatal: (...parameters: any[]): void => Counts.fatal = Counts.fatal + 1,
    info: (...parameters: any[]): void => Counts.info = Counts.info + 1,
    silly: (...parameters: any[]): void => Counts.silly = Counts.silly + 1,
    trace: (...parameters: any[]): void => Counts.trace = Counts.trace + 1,
    warn: (...parameters: any[]): void => Counts.warn = Counts.warn + 1,
  })

  const Loggers: LincolnLog[] = [
    CountLogger(),
    CountLogger(),
    CountLogger(),
  ]

  beforeEach(() => {
    Counts.debug = 0
    Counts.error = 0
    Counts.fatal = 0
    Counts.info = 0
    Counts.trace = 0
    Counts.warn = 0
  })

  it('should write to all debug loggers', () => {
    const sut = new LincolnLogs(Loggers)
    sut.debug('test')
    expect(Counts.debug).to.equal(Loggers.length)
  })

  it('should write to all error loggers', () => {
    const sut = new LincolnLogs(Loggers)
    sut.error('test')
    expect(Counts.error).to.equal(Loggers.length)
  })

  it('should write to all fatal loggers', () => {
    const sut = new LincolnLogs(Loggers)
    sut.fatal('test')
    expect(Counts.fatal).to.equal(Loggers.length)
  })

  it('should write to all info loggers', () => {
    const sut = new LincolnLogs(Loggers)
    sut.info('test')
    expect(Counts.info).to.equal(Loggers.length)
  })

  it('should write to all silly loggers', () => {
    const sut = new LincolnLogs(Loggers)
    sut.silly('test')
    expect(Counts.silly).to.equal(Loggers.length)
  })

  it('should write to all trace loggers', () => {
    const sut = new LincolnLogs(Loggers)
    sut.trace('test')
    expect(Counts.trace).to.equal(Loggers.length)
  })

  it('should write to all warn loggers', () => {
    const sut = new LincolnLogs(Loggers)
    sut.warn('test')
    expect(Counts.warn).to.equal(Loggers.length)
  })

})
