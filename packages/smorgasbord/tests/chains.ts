import { expect } from 'chai'
import { Chain, ChainHandler, ChainHandlerLink } from '../src/Index'

// tslint:disable:no-unused-expression

describe('when using Chain of Responsibilty pattern', () => {
  it('should call all registered handlers', () => {
    const first: ChainHandler<any, any> = (object: any): any => {
      object.first = true
      return object
    }
    const second: ChainHandler<any, any> = (object: any): any => {
      object.second = true
      return object
    }

    const chain = new Chain<any, any>()
    const result = chain.add(first).add(second).execute({})
    expect(result.first).to.be.true
    expect(result.second).to.be.true
  })
})
