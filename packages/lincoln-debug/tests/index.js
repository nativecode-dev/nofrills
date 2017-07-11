const expect = require('chai').expect
const debug = require('../lib')

describe('when using debug lincoln interceptor', () => {
  const NAMESPACE = 'nativecode:test'

  it('should create instance with default options', () => {
    expect(() => {
      const logger = debug.CreateLogger(NAMESPACE)
      logger.debug('Hello, %s!', 'World')
    }).to.not.throw()
  })

  it('should create instance with options', () => {
    expect(() => {
      const options = {
        namespace: NAMESPACE,
      }
      const logger = debug.CreateLogger(options)
      logger.debug('Hello, %s!', 'World')
    }).to.not.throw()
  })

  it('should log parameterless calls', () => {
    expect(() => {
      const logger = debug.CreateLogger(NAMESPACE)
      logger.debug()
    }).to.not.throw()
  })
})
