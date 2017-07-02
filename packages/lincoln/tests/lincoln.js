describe('when using Lincoln', () => {
  const expect = require('chai').expect
  const merge = require('lodash').merge

  const Console = require('../lib').Console
  const Debug = require('../lib').Debug
  const Lincoln = require('../lib').Lincoln

  describe('to log messages', () => {
    const extension = 'extension'
    const namespace = 'lincoln:test'
    const message = 'TEST'

    const Options = (interceptor) => {
      return {
        interceptors: [Debug, interceptor],
        namespace: namespace
      }
    }

    it('should create log object', (done) => {
      const options = Options((log) => {
        expect(log.namespace).to.equal(namespace)
        expect(log.parameters[0]).to.equal(message)
        expect(log.tag).to.equal(`${namespace}:debug`)
        done()
      })
      const sut = new Lincoln(options)
      sut.debug(message)
    })

    it('should act as emitter', (done) => {
      const options = Options((log) => log)
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
      const options = Options((log) => {
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
  })
})
