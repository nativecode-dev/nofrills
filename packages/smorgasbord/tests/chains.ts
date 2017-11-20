import { expect } from 'chai'
import { Chain, ChainHandler, ChainHandlerLink } from '../src'

// tslint:disable:no-unused-expression

describe('when using Chain of Responsibilty pattern', () => {
  interface Response {
    text: string
  }

  it('should call all registered handlers', () => {
    // Arrange
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

    const third: ChainHandler<any, Response> = (object: any, next: ChainHandlerLink<any, Response>): Partial<Response> => {
      const response: Partial<Response> = next(object)
      expect(response.text).to.be.equal('second')
      response.text = 'third'
      return response
    }

    // Act
    const result: Partial<Response> = new Chain<any, Response>()
      .add(first)
      .add(second)
      .add(third)
      .execute({})

    // Assert
    expect(result.text).to.be.equal('third')
  })

  it('should call all registered handlers in reverse', () => {
    // Arrange
    const first: ChainHandler<any, Response> = (object: any, next: ChainHandlerLink<any, Response>): Partial<Response> => {
      const response: Partial<Response> = next(object)
      expect(response.text).to.be.equal('second')
      response.text = 'first'
      return response
    }

    const second: ChainHandler<any, Response> = (object: any, next: ChainHandlerLink<any, Response>): Partial<Response> => {
      const response: Partial<Response> = next(object)
      expect(response.text).to.be.equal('third')
      response.text = 'second'
      return response
    }

    const third: ChainHandler<any, Response> = (object: any, next: ChainHandlerLink<any, Response>): Partial<Response> => {
      const response: Partial<Response> = next(object)
      expect(response.text).to.be.undefined
      response.text = 'third'
      return response
    }

    // Act
    const result: Partial<Response> = new Chain<any, Response>([first, second, third]).execute({}, true)

    // Assert
    expect(result.text).to.be.equal('first')
  })
})
