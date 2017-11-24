import 'mocha'

import { expect } from 'chai'
import { CreateLogger, Options } from './index'

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

  it('should log parameterless calls', () => {
    expect(() => CreateLogger(NAMESPACE).debug()).to.not.throw()
  })

})
