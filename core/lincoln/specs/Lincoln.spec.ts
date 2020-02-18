import 'mocha'

import expect from './expect'

import { Lincoln } from '../src/Lincoln'
import { createMessage } from '../src/CreateMessage'
import { LincolnMessageType } from '../src/LincolnMessageType'

describe('when using Lincoln', () => {
  it('should create instance', () => {
    const sut = new Lincoln({ namespace: 'lincoln:test' })
    expect(sut.scope).to.be.equal('lincoln:test')
  })

  it('should extend existing Lincoln instance', () => {
    const lincoln = new Lincoln({ namespace: 'lincoln:test' })
    const sut = lincoln.extend('extended')
    expect(sut.scope).to.equal('lincoln:test:extended')
  })

  it('should observe single messages', done => {
    const sut = new Lincoln({ namespace: 'lincoln:test' })

    const subscription = sut.subscribe(envelope => {
      expect(envelope.message.body).to.equal('test')
      subscription.unsubscribe()
      done()
    })

    sut.write(createMessage('test', LincolnMessageType.info))
  })

  it('should observe extended messages', done => {
    const lincoln = new Lincoln({ namespace: 'lincoln:test' })
    const sut = lincoln.extend('extended')

    const subscription = lincoln.subscribe(envelope => {
      expect(envelope.message.body).to.equal('test')
      subscription.unsubscribe()
      done()
    })

    sut.write(createMessage('test', LincolnMessageType.info))
  })
})
