describe('when using Lincoln', () => {
  const expect = require('chai').expect
  const merge = require('lodash').merge

  const context = require('./context')
  const extension = context.EXTENSION
  const namespace = context.NAMESPACE
  const message = context.MESSAGE

  const Lincoln = require('../lib').Lincoln

  describe('to log messages', () => {
    it('should create log object', (done) => {
      const options = context.options((log) => {
        expect(log.namespace).to.equal(namespace)
        expect(log.parameters[0]).to.equal(message)
        expect(log.tag).to.equal(`${namespace}:debug`)
        done()
      })
      const sut = new Lincoln(options)
      sut.debug(message)
    })

    it('should create log object with no options', () => {
      const sut = new Lincoln(namespace)
      expect(sut).to.be.instanceOf(Lincoln)
      expect(sut.namespace).to.equal(namespace)
    })

    it('should act as emitter', (done) => {
      const options = context.options((log) => log)
      const sut = new Lincoln(options)
      sut.on('log', (log) => {
        expect(log.namespace).to.equal(namespace)
        expect(log.parameters[0]).to.equal(message)
        expect(log.tag).to.equal(`${namespace}:debug`)
        done()
      })
      sut.debug(message)
    })

    it('should extend instance', (done) => {
      const options = context.options((log) => {
        expect(log.namespace).to.equal(`${namespace}:${extension}`)
        expect(log.parameters[0]).to.equal(message)
        expect(log.tag).to.equal(`${namespace}:${extension}:debug`)
        done()
      })
      const logger = new Lincoln(options)
      const sut = logger.extend(extension)
      expect(logger.id).not.equal(sut.id)
      sut.debug(message)
    })

    it('should log object', (done) => {
      const options = context.options((log) => {
        expect(log.parameters[0].message).to.equal(message)
        done()
      })
      const sut = new Lincoln(options)
      sut.debug({
        message
      })
    })
  })

  describe('to log different types of messages', () => {
    it('should call debug', (done) => {
      const options = context.options((log) => {
        expect(log.tag).to.equal(`${namespace}:debug`)
        done()
      })
      const sut = new Lincoln(options)
      sut.debug(message)
    })

    it('should call error', (done) => {
      const options = context.options((log) => {
        expect(log.tag).to.equal(`${namespace}:error`)
        done()
      })
      const sut = new Lincoln(options)
      sut.error(message)
    })

    it('should call info', (done) => {
      const options = context.options((log) => {
        expect(log.tag).to.equal(`${namespace}:info`)
        done()
      })
      const sut = new Lincoln(options)
      sut.info(message)
    })

    it('should call warn', (done) => {
      const options = context.options((log) => {
        expect(log.tag).to.equal(`${namespace}:warn`)
        done()
      })
      const sut = new Lincoln(options)
      sut.warn(message)
    })
  })

  describe('to filter messages', () => {
    const filter = (log) => log.tag.indexOf('debug') >= 0
    it('should filter message', () => {
      let calls = 0
      const options = context.options((log) => {
        calls++
        expect(calls).to.equal(1)
      })
      options.filters = [filter]
      const sut = new Lincoln(options)
      sut.debug(message)
      sut.warn(message)
    })
  })
})
