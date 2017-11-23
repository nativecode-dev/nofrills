import { expect } from 'chai'
import { CreateLogger, Options } from './index'

describe('when using debug lincoln interceptor', () => {
  const NAMESPACE = 'nativecode:test'

  it('should create instance with default options', () => {
    expect(() => {
      const logger = CreateLogger(NAMESPACE)
      logger.debug('Hello, %s!', 'World')
    }).to.not.throw()
  })

  it('should create instance with options', () => {
    expect(() => {
      const options: Partial<Options> = {
        namespace: NAMESPACE,
      }
      const logger = CreateLogger(options)
      logger.debug('Hello, %s!', 'World')
    }).to.not.throw()
  })

  it('should log parameterless calls', () => {
    expect(() => {
      const logger = CreateLogger(NAMESPACE)
      logger.debug()
    }).to.not.throw()
  })
})
