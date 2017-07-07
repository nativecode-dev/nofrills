const expect = require('chai').expect
const debug = require('../lib')

describe('when using debug lincoln interceptor', () => {
  const NAMESPACE = 'nativecode:test'

  it('should create instance with default options', () => {
    const logger = debug.CreateLogger(NAMESPACE)
    logger.debug('Hello, %s!', 'World')
  })
})
