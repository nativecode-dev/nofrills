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

  it('should create instance options with filter', (done) => {
    const filter = () => {
      done()
      return false
    }

    const options = CreateOptions(NAMESPACE, [['test-filter', filter]])

    CreateLogger(options).debug('test-message')
  })

  it('should create instance options with interceptor', (done) => {
    const interceptor = (log: Log) => {
      done()
      return log
    }

    const options = CreateOptions(NAMESPACE, [], [['test-interceptor', interceptor]])

    CreateLogger(options).debug('test-message')
  })

  it('should log parameterless calls', () => {
    expect(() => CreateLogger(NAMESPACE).debug()).to.not.throw()
  })

})
