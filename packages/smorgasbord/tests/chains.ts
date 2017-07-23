import { expect } from 'chai'
import { Chain, ChainHandler, ChainHandlerLink } from '../src'

// tslint:disable:no-unused-expression

describe('when using Chain of Responsibilty pattern', () => {
  it('should call all registered handlers', () => {
    const first: ChainHandler<any, any> = (object: any, next: ChainHandlerLink<any, any>): any => {
      const response: any = next(object)
      response.first = true
      expect(response.second).to.be.undefined
      return response
    }

    const second: ChainHandler<any, any> = (object: any, next: ChainHandlerLink<any, any>): any => {
      const response: any = next(object)
      response.second = true
      expect(response.first).to.be.true
      return response
    }

    const chain: Chain<any, any> = new Chain<any, any>()
    const result: any = chain.add(first).add(second).execute({})
    expect(result.first).to.be.true
    expect(result.second).to.be.true
  })

  it('should call all registered handlers in reverse', () => {
    const first: ChainHandler<any, any> = (object: any, next: ChainHandlerLink<any, any>): any => {
      const response: any = next(object)
      response.first = true
      expect(response.second).to.be.true
      return response
    }

    const second: ChainHandler<any, any> = (object: any, next: ChainHandlerLink<any, any>): any => {
      const response: any = next(object)
      response.second = true
      expect(response.first).to.be.undefined
      return response
    }

    const chain: Chain<any, any> = new Chain<any, any>()
    const result: any = chain.add(first).add(second).execute({}, true)
    expect(result.first).to.be.true
    expect(result.second).to.be.true
  })
})
