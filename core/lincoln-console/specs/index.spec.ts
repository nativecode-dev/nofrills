import 'mocha'

import { expect } from 'chai'
import { Options } from '@nofrills/lincoln'

import { CreateLogger } from '../src/index'

describe('when using debug lincoln interceptor', () => {
  const debug = console.debug
  const error = console.error
  const log = console.log
  const warn = console.warn

  before(() => {
    console.debug = () => void 0
    console.error = () => void 0
    console.log = () => void 0
    console.warn = () => void 0
  })

  after(() => {
    console.debug = debug
    console.error = error
    console.log = log
    console.warn = warn
  })

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
