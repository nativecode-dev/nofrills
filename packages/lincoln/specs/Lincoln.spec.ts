import 'mocha'

import { expect } from 'chai'
import { Lincoln, Log, Options, LogMessageType } from '../src'

import { EXTENSION, MESSAGE, NAMESPACE, Context } from './Context'

describe('when using Lincoln', () => {

  describe('to log messages', () => {

    it('should create Lincoln with no options', () => {
      const sut: Lincoln = new Lincoln()
      expect(sut).to.be.instanceOf(Lincoln)
    })

    it('should get now as tring', () => {
      const sut: Lincoln = new Lincoln()
      const regex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
      expect(regex.test(sut.now())).to.be.true
    })

    it('should create log object', (done) => {
      const options: Options = Context.intercept(async (log: Log) => {
        expect(log.namespace).to.equal(`${NAMESPACE}:debug`)
        expect(log.parameters[0]).to.equal(MESSAGE)
        done()
        return log
      })
      const sut: Lincoln = new Lincoln(options)
      sut.debug(MESSAGE)
    })

    it('should create log object with no options', () => {
      const sut: Lincoln = new Lincoln(NAMESPACE)
      expect(sut).to.be.instanceOf(Lincoln)
      expect(sut.namespace).to.equal(NAMESPACE)
    })

    it('should act as emitter', (done) => {
      const sut: Lincoln = new Lincoln(NAMESPACE)
      sut.on('log-message', (log: Log) => {
        expect(log.namespace).to.equal(`${NAMESPACE}:debug`)
        expect(log.parameters[0]).to.equal(MESSAGE)
        done()
      })
      sut.debug(MESSAGE)
    })

    it('should extend instance', (done) => {
      const options: Options = Context.intercept(async (log: Log) => {
        expect(log.namespace).to.equal(`${NAMESPACE}:${EXTENSION}:debug`)
        expect(log.parameters[0]).to.equal(MESSAGE)
        done()
        return log
      })
      const logger: Lincoln = new Lincoln(options)
      const sut: Lincoln = logger.extend(EXTENSION)
      expect(logger.id).not.equal(sut.id)
      sut.debug(MESSAGE)
    })

    it('should log object', (done) => {
      const options: Options = Context.intercept(async (log: Log) => {
        expect(log.parameters[0].message).to.equal(MESSAGE)
        done()
        return log
      })
      const sut: Lincoln = new Lincoln(options)
      sut.debug({ message: MESSAGE })
    })

    it('should log empty parameters', (done) => {
      const options: Options = Context.intercept(async (log: Log) => {
        expect(log.parameters.length).to.equal(0)
        done()
        return log
      })
      const sut: Lincoln = new Lincoln(options)
      sut.debug()
    })

  })

  describe('to log different types of messages', () => {

    it('should call debug', (done) => {
      const options: Options = Context.intercept(async (log: Log) => {
        expect(log.namespace).to.equal(`${NAMESPACE}:debug`)
        done()
        return log
      })
      const sut: Lincoln = new Lincoln(options)
      sut.debug(MESSAGE)
    })

    it('should call error', (done) => {
      const options: Options = Context.intercept(async (log: Log) => {
        expect(log.namespace).to.equal(`${NAMESPACE}:error`)
        done()
        return log
      })
      const sut: Lincoln = new Lincoln(options)
      sut.error(MESSAGE)
    })

    it('should call fatal', (done) => {
      const options: Options = Context.intercept(async (log: Log) => {
        expect(log.namespace).to.equal(`${NAMESPACE}:fatal`)
        done()
        return log
      })
      const sut: Lincoln = new Lincoln(options)
      sut.fatal(MESSAGE)
    })

    it('should call info', (done) => {
      const options: Options = Context.intercept(async (log: Log) => {
        expect(log.namespace).to.equal(`${NAMESPACE}:info`)
        done()
        return log
      })
      const sut: Lincoln = new Lincoln(options)
      sut.info(MESSAGE)
    })

    it('should call silly', (done) => {
      const options: Options = Context.intercept(async (log: Log) => {
        expect(log.namespace).to.equal(`${NAMESPACE}:silly`)
        done()
        return log
      })
      const sut: Lincoln = new Lincoln(options)
      sut.silly(MESSAGE)
    })

    it('should call trace', (done) => {
      const options: Options = Context.intercept(async (log: Log) => {
        expect(log.namespace).to.equal(`${NAMESPACE}:trace`)
        done()
        return log
      })
      const sut: Lincoln = new Lincoln(options)
      sut.trace(MESSAGE)
    })

    it('should call warn', (done) => {
      const options: Options = Context.intercept(async (log: Log) => {
        expect(log.namespace).to.equal(`${NAMESPACE}:warn`)
        done()
        return log
      })
      const sut: Lincoln = new Lincoln(options)
      sut.warn(MESSAGE)
    })

  })

  describe('to filter messages', () => {

    it('should filter message', (done) => {
      const filter = (log: Log) => {
        const filtered = log.type === LogMessageType.debug
        if (filtered) {
          done()
        }
        return Promise.resolve(filtered)
      }

      const options: Options = Context.filter(filter)
      const sut: Lincoln = new Lincoln(options)
      sut.debug(MESSAGE)
      sut.warn(MESSAGE)
    })

    it('should not filter message', (done) => {
      const filter = (log: Log) => {
        if (log.type === LogMessageType.warn) {
          done()
        }
        return Promise.resolve(false)
      }

      const options: Options = Context.filter(filter)
      const sut: Lincoln = new Lincoln(options)
      sut.debug(MESSAGE)
      sut.warn(MESSAGE)
    })

  })

  describe('to intercept messages', () => {

    it('should intercept message', (done) => {
      const interceptor = async (log: Log) => {
        done()
        return log
      }

      const options: Options = Context.intercept(interceptor)
      const sut: Lincoln = new Lincoln(options)
      sut.debug(MESSAGE)
    })

  })

})
