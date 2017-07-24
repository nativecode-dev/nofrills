import { expect } from 'chai'
import { Chain, ChainHandler, ChainHandlerLink } from '../src'

// tslint:disable:no-unused-expression

describe('when using Chain of Responsibilty pattern', () => {
  interface Response {
    text: string
  }

  it('should call all registered handlers', () => {
    const first: ChainHandler<any, Response> = (object: any, next: ChainHandlerLink<any, Response>): Partial<Response> => {
      const response: Partial<Response> = next(object)
      expect(response.text).to.be.undefined
      response.text = 'first'
      return response
    }

    const second: ChainHandler<any, Response> = (object: any, next: ChainHandlerLink<any, Response>): Partial<Response> => {
      const response: Partial<Response> = next(object)
      expect(response.text).to.be.equal('first')
      response.text = 'second'
      return response
    }

    const chain: Chain<any, Response> = new Chain<any, Response>()
    const result: Partial<Response> = chain.add(first).add(second).execute({})
    expect(result.text).to.be.equal('second')
  })

  it('should call all registered handlers in reverse', () => {
    const first: ChainHandler<any, Response> = (object: any, next: ChainHandlerLink<any, Response>): Partial<Response> => {
      const response: Partial<Response> = next(object)
      expect(response.text).to.be.equal('second')
      response.text = 'first'
      return response
    }

    const second: ChainHandler<any, Response> = (object: any, next: ChainHandlerLink<any, Response>): Partial<Response> => {
      const response: Partial<Response> = next(object)
      expect(response.text).to.be.undefined
      response.text = 'second'
      return response
    }

    const chain: Chain<any, Response> = new Chain<any, Response>()
    const result: Partial<Response> = chain.add(first).add(second).execute({}, true)
    expect(result.text).to.be.equal('first')
  })
})
