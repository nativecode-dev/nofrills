import 'mocha'

import { expect } from 'chai'

import { LincolnLog, Lincoln, Log } from '@nofrills/lincoln'

describe('when working with multiple log writers', async () => {

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

  it('should write to all debug loggers', async () => {
    const sut = new Lincoln(options, Loggers)
    await sut.debug('test')
    expect(logs.length).to.equal(Loggers.length)
  })

  it('should write to all error loggers', async () => {
    const sut = new Lincoln(options, Loggers)
    await sut.error('test')
    expect(logs.length).to.equal(Loggers.length)
  })

  it('should write to all fatal loggers', async () => {
    const sut = new Lincoln(options, Loggers)
    await sut.fatal('test')
    expect(logs.length).to.equal(Loggers.length)
  })

  it('should write to all info loggers', async () => {
    const sut = new Lincoln(options, Loggers)
    await sut.info('test')
    expect(logs.length).to.equal(Loggers.length)
  })

  it('should write to all silly loggers', async () => {
    const sut = new Lincoln(options, Loggers)
    await sut.silly('test')
    expect(logs.length).to.equal(Loggers.length)
  })

  it('should write to all trace loggers', async () => {
    const sut = new Lincoln(options, Loggers)
    await sut.trace('test')
    expect(logs.length).to.equal(Loggers.length)
  })

  it('should write to all warn loggers', async () => {
    const sut = new Lincoln(options, Loggers)
    await sut.warn('test')
    expect(logs.length).to.equal(Loggers.length)
  })

})
