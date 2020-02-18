import 'mocha'

import expect from './expect'

import { Lincoln } from '../src/Lincoln'

describe('when using Lincoln', () => {
  it('should create instance', () => {
    const sut = new Lincoln({ namespace: 'lincoln:test' })
    expect(sut.namespaceStr).to.be.equal('lincoln:test')
  })
})
