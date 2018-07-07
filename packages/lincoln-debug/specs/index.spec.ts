import 'mocha'

import { expect } from 'chai'
import { CreateLogger, CreateOptions, Log, Options } from '../src/index'

describe('when using debug lincoln interceptor', () => {
  const NAMESPACE = 'nativecode:test'

  it('should create instance with default options', () => {
    expect(() => CreateLogger(NAMESPACE).debug('Hello, %s!', 'World')).to.not.throw()
  })

  it('should create instance with options', () => {
    const options: Partial<Options> = {
      namespace: NAMESPACE,
    }
    expect(() => CreateLogger(options).debug('Hello, %s!', 'World')).to.not.throw()
  })

  it('should create instance with options with filters and interceptors', () => {
    let filtered = 0
    let intercepted = 0

    const filter = () => {
      filtered = filtered + 1
      return true
    }

    const interceptor = (log: Log) => {
      intercepted = intercepted + 1
      return log
    }

    const options = CreateOptions(NAMESPACE, [['test-filter', filter]], [['test-interceptor', interceptor]])
    const logger = CreateLogger(options)
    logger.debug('test')
    expect(filtered).to.equal(1)
    expect(intercepted).to.equal(1)
  })

  it('should log parameterless calls', () => {
    expect(() => CreateLogger(NAMESPACE).debug()).to.not.throw()
  })

})
