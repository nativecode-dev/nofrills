import { expect } from 'chai'
import { Lincoln, Log, Options } from './index'

describe('when using Lincoln', () => {
  const context = require('../artifacts/context')
  const extension = context.EXTENSION
  const namespace = context.NAMESPACE
  const message = context.MESSAGE

  describe('to log messages', () => {
    it('should create Lincoln with no options', () => {
      const sut: Lincoln = new Lincoln()
      expect(sut).to.be.instanceOf(Lincoln)
    })

    it('should create log object', (done) => {
      const options: Options = context.options((log: Log) => {
        expect(log.namespace).to.equal(`${namespace}:debug`)
        expect(log.parameters[0]).to.equal(message)
        done()
      })
      const sut: Lincoln = new Lincoln(options)
      sut.debug(message)
    })

    it('should create log object with no options', () => {
      const sut: Lincoln = new Lincoln(namespace)
      expect(sut).to.be.instanceOf(Lincoln)
      expect(sut.namespace).to.equal(namespace)
    })

    it('should act as emitter', (done) => {
      const options: Options = context.options((log: Log) => log)
      const sut: Lincoln = new Lincoln(options)
      sut.on('log', (log) => {
        expect(log.namespace).to.equal(`${namespace}:debug`)
        expect(log.parameters[0]).to.equal(message)
        done()
      })
      sut.debug(message)
    })

    it('should extend instance', (done) => {
      const options: Options = context.options((log: Log) => {
        expect(log.namespace).to.equal(`${namespace}:${extension}:debug`)
        expect(log.parameters[0]).to.equal(message)
        done()
      })
      const logger: Lincoln = new Lincoln(options)
      const sut: Lincoln = logger.extend(extension)
      expect(logger.id).not.equal(sut.id)
      sut.debug(message)
    })

    it('should log object', (done) => {
      const options: Options = context.options((log: Log) => {
        expect(log.parameters[0].message).to.equal(message)
        done()
      })
      const sut: Lincoln = new Lincoln(options)
      sut.debug({
        message
      })
    })

    it('should log empty parameters', (done) => {
      const options: Options = context.options((log: Log) => {
        expect(log.parameters.length).to.equal(0)
        done()
      })
      const sut: Lincoln = new Lincoln(options)
      sut.debug()
    })
  })

  describe('to log different types of messages', () => {
    it('should call debug', (done) => {
      const options: Options = context.options((log: Log) => {
        expect(log.namespace).to.equal(`${namespace}:debug`)
        done()
      })
      const sut: Lincoln = new Lincoln(options)
      sut.debug(message)
    })

    it('should call error', (done) => {
      const options: Options = context.options((log: Log) => {
        expect(log.namespace).to.equal(`${namespace}:error`)
        done()
      })
      const sut: Lincoln = new Lincoln(options)
      sut.error(message)
    })

    it('should call fatal', (done) => {
      const options: Options = context.options((log: Log) => {
        expect(log.namespace).to.equal(`${namespace}:fatal`)
        done()
      })
      const sut: Lincoln = new Lincoln(options)
      sut.fatal(message)
    })

    it('should call info', (done) => {
      const options: Options = context.options((log: Log) => {
        expect(log.namespace).to.equal(`${namespace}:info`)
        done()
      })
      const sut: Lincoln = new Lincoln(options)
      sut.info(message)
    })

    it('should call trace', (done) => {
      const options: Options = context.options((log: Log) => {
        expect(log.namespace).to.equal(`${namespace}:trace`)
        done()
      })
      const sut: Lincoln = new Lincoln(options)
      sut.trace(message)
    })

    it('should call warn', (done) => {
      const options: Options = context.options((log: Log) => {
        expect(log.namespace).to.equal(`${namespace}:warn`)
        done()
      })
      const sut: Lincoln = new Lincoln(options)
      sut.warn(message)
    })
  })

  describe('to filter messages', () => {
    const filter = (log: Log) => log.namespace.indexOf('debug') < 0
    it('should filter message', () => {
      let calls = 0
      const options: Options = context.options((log: Log) => {
        calls++
        expect(calls).to.equal(1)
      })
      options.filters.register('test', filter)
      const sut: Lincoln = new Lincoln(options)
      sut.debug(message)
      sut.warn(message)
    })
  })
})
