import 'mocha'

import { expect } from 'chai'

import { Promisify } from '../src/index'

describe('when turning node callback into promises', () => {
  function NodeLikeFunction(success: boolean, callback: (error?: Error) => void) {
    callback(success ? undefined : new Error('error'))
  }

  it('should fulfill callback', () => {
    const promise = Promisify<boolean>(handler => NodeLikeFunction(true, handler))
    expect(promise).to.eventually.be.fulfilled
  })

  it('should reject errors', () => {
    const promise = Promisify<boolean>(handler => NodeLikeFunction(false, handler))
    expect(promise).to.eventually.be.rejected
  })

  it('should fulfill callback with resolver', () => {
    const promise = Promisify<boolean>(handler => NodeLikeFunction(true, handler), resolve => resolve(true))
    expect(promise).to.eventually.be.fulfilled
  })

  it('should reject errors with resolver', () => {
    const promise = Promisify<boolean>(
      handler => NodeLikeFunction(false, handler),
      (_, reject) => reject(new Error('error')),
    )

    expect(promise).to.eventually.be.rejected
  })
})
